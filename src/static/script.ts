document.addEventListener('DOMContentLoaded', () => {
    const roomId = document.body.dataset.roomId!;
    const myId = `${Math.random().toString(36).substr(2, 9)}-${Date.now()}`;
    const protocol = location.protocol === 'https:' ? 'wss:' : 'ws:';
    const ws = new WebSocket(`${protocol}//${location.host}/ws/rooms/${roomId}`);
    
    const videos = document.querySelector('#videos');
    const localVideo = document.querySelector('#localFeed') as HTMLVideoElement;
    
    const peers: { [id: string]: RTCPeerConnection } = {};
    const pendingIceCandidates: { [id: string]: RTCIceCandidateInit[] } = {};
    let localStream: MediaStream;
    let isCallStarted = false;
    const readyPeers = new Set<string>();
    
    ws.onopen = () => {
        ws.send(JSON.stringify({ type: 'join', from: myId }));
    };

    ws.onmessage = async (event) => {
        try {
            const msg = JSON.parse(event.data);
            const peerId = msg.from;
            
            if (peerId === myId) return;

            switch (msg.type) {
                case 'offer':
                    await handleOffer(peerId, msg.offer);
                    break;
                case 'answer':
                    await handleAnswer(peerId, msg.answer);
                    break;
                case 'ice':
                    await handleIceCandidate(peerId, msg.candidate);
                    break;
                case 'start':
                    readyPeers.add(peerId);
                    if (isCallStarted && !peers[peerId] && myId > peerId) {
                        await createOffer(peerId);
                    }
                    break;
                case 'leave':
                    cleanupPeer(peerId);
                    break;
            }
        } catch (err) {
            console.error('Error parsing message:', err);
        }
    };

    ws.onclose = () => setTimeout(() => location.reload(), 3000);

    document.querySelector('#startCall')?.addEventListener('click', async () => {
        if (isCallStarted) return;
        
        try {
            localStream = await navigator.mediaDevices.getUserMedia({ 
                video: true, 
                audio: true 
            });
            localVideo.srcObject = localStream;
            isCallStarted = true;
            
            ws.send(JSON.stringify({ type: 'start', from: myId }));
            
            readyPeers.forEach(async (peerId) => {
                if (!peers[peerId] && myId > peerId) {
                    await createOffer(peerId);
                }
            });
        } catch (error) {
            alert("Error accessing camera/microphone");
        }
    });

    async function createOffer(peerId: string) {
        if (peers[peerId]) return;
        
        const peer = createPeer(peerId);
        
        try {
            const offer = await peer.createOffer();
            await peer.setLocalDescription(offer);
            
            ws.send(JSON.stringify({
                type: 'offer',
                offer: peer.localDescription,
                to: peerId,
                from: myId
            }));
        } catch (error) {
            cleanupPeer(peerId);
        }
    }

    async function handleOffer(peerId: string, offer: RTCSessionDescriptionInit) {
        if (!localStream || peers[peerId]) return;
        
        const peer = createPeer(peerId);
        
        try {
            await peer.setRemoteDescription(new RTCSessionDescription(offer));
            const answer = await peer.createAnswer();
            await peer.setLocalDescription(answer);
            
            await processPendingIceCandidates(peerId);
            
            ws.send(JSON.stringify({
                type: 'answer',
                answer: peer.localDescription,
                to: peerId,
                from: myId
            }));
        } catch (error) {
            cleanupPeer(peerId);
        }
    }

    async function handleAnswer(peerId: string, answer: RTCSessionDescriptionInit) {
        const peer = peers[peerId];
        if (!peer) return;
        
        try {
            await peer.setRemoteDescription(new RTCSessionDescription(answer));
            await processPendingIceCandidates(peerId);
        } catch (error) {
            cleanupPeer(peerId);
        }
    }

    async function handleIceCandidate(peerId: string, candidate: RTCIceCandidateInit) {
        const peer = peers[peerId];
        if (!peer || !candidate) return;
        
        try {
            if (!peer.remoteDescription) {
                if (!pendingIceCandidates[peerId]) {
                    pendingIceCandidates[peerId] = [];
                }
                pendingIceCandidates[peerId].push(candidate);
                return;
            }
            
            await peer.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (error) {
            console.error('Error adding ICE candidate:', error);
        }
    }

    async function processPendingIceCandidates(peerId: string) {
        if (pendingIceCandidates[peerId] && peers[peerId]) {
            for (const candidate of pendingIceCandidates[peerId]) {
                try {
                    await peers[peerId].addIceCandidate(new RTCIceCandidate(candidate));
                } catch (error) {
                    console.error('Error adding buffered ICE candidate:', error);
                }
            }
            delete pendingIceCandidates[peerId];
        }
    }

    function createPeer(peerId: string): RTCPeerConnection {
        const isLocalhost = location.hostname === 'localhost' || location.hostname === '127.0.0.1';
        
        const peer = new RTCPeerConnection({
            iceServers: isLocalhost ? 
                [{ urls: 'stun:stun.l.google.com:19302' }] : 
                [
                    { urls: 'stun:stun.l.google.com:19302' },
                    { urls: 'stun:stun1.l.google.com:19302' },
                    {
                        urls: 'turn:openrelay.metered.ca:80',
                        username: 'openrelayproject',
                        credential: 'openrelayproject'
                    }
                ]
        });
        
        peers[peerId] = peer;
        
        if (localStream) {
            localStream.getTracks().forEach(track => {
                peer.addTrack(track, localStream);
            });
        }

        peer.onicecandidate = (e) => {
            if (e.candidate) {
                ws.send(JSON.stringify({
                    type: 'ice',
                    candidate: e.candidate,
                    to: peerId,
                    from: myId
                }));
            }
        };

        peer.ontrack = (e) => {
            let remoteVideo = document.getElementById(`remote-${peerId}`) as HTMLVideoElement;
            
            if (!remoteVideo) {
                remoteVideo = document.createElement('video');
                remoteVideo.id = `remote-${peerId}`;
                remoteVideo.autoplay = true;
                remoteVideo.playsInline = true;
                remoteVideo.style.width = '300px';
                remoteVideo.style.height = '200px';
                remoteVideo.style.border = '2px solid #333';
                remoteVideo.style.margin = '10px';
                videos?.appendChild(remoteVideo);
            }
            
            if (e.streams[0]) {
                remoteVideo.srcObject = e.streams[0];
            }
        };

        peer.onconnectionstatechange = () => {
            if (peer.connectionState === 'failed') {
                setTimeout(() => {
                    if (peer.connectionState === 'failed') {
                        cleanupPeer(peerId);
                    }
                }, 2000);
            } else if (peer.connectionState === 'disconnected') {
                setTimeout(() => {
                    if (peer.connectionState === 'disconnected') {
                        cleanupPeer(peerId);
                    }
                }, 10000);
            }
        };

        peer.oniceconnectionstatechange = () => {
            if (peer.iceConnectionState === 'failed') {
                peer.restartIce();
            }
        };

        return peer;
    }

    function cleanupPeer(peerId: string) {
        const video = document.getElementById(`remote-${peerId}`);
        if (video) video.remove();
        
        if (peers[peerId]) {
            peers[peerId].close();
            delete peers[peerId];
        }
        
        if (pendingIceCandidates[peerId]) {
            delete pendingIceCandidates[peerId];
        }
        
        readyPeers.delete(peerId);
    }
});
