document.addEventListener('DOMContentLoaded', () => {
    const roomId = document.body.dataset.roomId!;
    const ws = new WebSocket(`ws://${location.host}/ws/rooms/${roomId}`);
    const videos = document.querySelector('#videos')
    const localVideo = document.querySelector('#localFeed') as HTMLVideoElement;

    const peers: { [id: string]: RTCPeerConnection } = {};
    let localStream: MediaStream;

    document.querySelector('#startCall')?.addEventListener('click', async () => {
        localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localVideo.srcObject = localStream;

        ws.send(JSON.stringify({ type: 'start' }))

    })

    ws.onmessage = async (event) => {
        const msg = JSON.parse(event.data)
        const peerId = msg.from

        switch (msg.type) {
            case 'offer':
                {
                    const peer = createPeer(peerId)
                    await peer.setRemoteDescription(new RTCSessionDescription(msg.offer))
                    const answer = await peer.createAnswer()
                    await peer.setLocalDescription(answer)
                    ws.send(JSON.stringify({ type: 'answer', answer: peer.localDescription, to: peerId }))
                    break;
                }
            case 'answer':
                {
                    const peer = peers[peerId]
                    await peer.setRemoteDescription(new RTCSessionDescription(msg.answer))
                }
            case 'ice':
                {
                    const peer = peers[peerId]
                    await peer.addIceCandidate(new RTCIceCandidate(msg.candidate))
                }
            case 'join':
            case 'start':
                {
                    // Initiate offer to new Peer
                    if (peerId && !peers[peerId]) {
                        const peer = createPeer(peerId)
                        const offer = await peer.createOffer()
                        await peer.setLocalDescription(offer)

                        ws.send(JSON.stringify({ type: 'offer', offer: peer.localDescription, to: peerId }))
                    }
                }
            default: break;
        }
    }

    function createPeer(peerId: string): RTCPeerConnection {
        const peer = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] })
        peers[peerId] = peer
        localStream.getTracks().forEach(track => peer.addTrack(track, localStream))

        peer.onicecandidate = (e) => {
            if (e.candidate) ws.send(JSON.stringify({ type: 'ice', candidate: e.candidate, to: peerId }))
        }

        peer.ontrack = (e) => {
            const remoteVideo = document.createElement('video')
            remoteVideo.srcObject = e.streams[0]
            remoteVideo.autoplay = true
            remoteVideo.playsInline = true
            videos?.appendChild(remoteVideo)
        }

        return peer

    }
})


