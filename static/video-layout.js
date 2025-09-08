document.addEventListener('DOMContentLoaded', () => {
    let hasRemoteConnection = false;
    let originalLocalVideoParent = null;
    let overlayContainer = null;
    
    function activateOverlayMode() {
        if (hasRemoteConnection) return;
        
        const localVideo = document.querySelector('#localFeed');
        const videoContainer = document.querySelector('.video-container');
        const remoteVideos = document.querySelectorAll('video[id^="remote-"]');
        
        if (!localVideo || !videoContainer || remoteVideos.length === 0) return;
        
        originalLocalVideoParent = localVideo.parentNode;
        
        const remoteVideo = remoteVideos[0];
        const videosContainer = document.querySelector('#videos');
        
        if (videosContainer && videosContainer.contains(remoteVideo)) {
            videoContainer.appendChild(remoteVideo);
        }
        
        remoteVideo.style.width = '100%';
        remoteVideo.style.height = '100%';
        remoteVideo.style.objectFit = 'cover';
        remoteVideo.style.border = 'none';
        remoteVideo.style.margin = '0';
        remoteVideo.style.borderRadius = '12px';
        remoteVideo.style.position = 'static';
        remoteVideo.style.top = 'auto';
        remoteVideo.style.left = 'auto';
        
        if (!overlayContainer) {
            overlayContainer = document.createElement('div');
            overlayContainer.className = 'local-overlay';
            overlayContainer.id = 'localVideoOverlay';
        }
        
        overlayContainer.appendChild(localVideo);
        videoContainer.appendChild(overlayContainer);
        
        localVideo.style.width = '100%';
        localVideo.style.height = '100%';
        localVideo.style.objectFit = 'cover';
        localVideo.style.borderRadius = '6px';
        
        hasRemoteConnection = true;
        console.log('Activated overlay mode: remote video in main area, local video in overlay');
    }
    
    function restoreOriginalLayout() {
        const localVideo = document.querySelector('#localFeed');
        const remoteVideos = document.querySelectorAll('video[id^="remote-"]');
        const videosContainer = document.querySelector('#videos');
        
        if (!hasRemoteConnection || !localVideo || !originalLocalVideoParent) return;
        
        remoteVideos.forEach(remoteVideo => {
            if (videosContainer && !videosContainer.contains(remoteVideo)) {
                videosContainer.appendChild(remoteVideo);
                
                remoteVideo.style.width = '300px';
                remoteVideo.style.height = '200px';
                remoteVideo.style.border = '2px solid #333';
                remoteVideo.style.margin = '10px';
                remoteVideo.style.position = '';
                remoteVideo.style.borderRadius = '';
                remoteVideo.style.objectFit = '';
            }
        });
        
        originalLocalVideoParent.appendChild(localVideo);
        
        if (overlayContainer && overlayContainer.parentNode) {
            overlayContainer.parentNode.removeChild(overlayContainer);
        }
        
        localVideo.style.width = '';
        localVideo.style.height = '';
        localVideo.style.objectFit = '';
        localVideo.style.borderRadius = '';
        
        hasRemoteConnection = false;
        console.log('Restored original layout: local video back to main area');
    }
    
    const observer = new MutationObserver((mutations) => {
        let remoteVideoAdded = false;
        let remoteVideoRemoved = false;
        
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1 && node.tagName === 'VIDEO' && node.id.startsWith('remote-')) {
                    remoteVideoAdded = true;
                }
            });
            
            mutation.removedNodes.forEach((node) => {
                if (node.nodeType === 1 && node.tagName === 'VIDEO' && node.id.startsWith('remote-')) {
                    remoteVideoRemoved = true;
                }
            });
        });
        
        if (remoteVideoAdded) {
            setTimeout(() => activateOverlayMode(), 200);
        }
        
        if (remoteVideoRemoved) {
            const remainingRemoteVideos = document.querySelectorAll('video[id^="remote-"]');
            if (remainingRemoteVideos.length === 0) {
                setTimeout(() => restoreOriginalLayout(), 100);
            }
        }
    });
    
    const videosContainer = document.querySelector('#videos');
    if (videosContainer) {
        observer.observe(videosContainer, {
            childList: true,
            subtree: true
        });
    }
    
    setTimeout(() => {
        const existingRemoteVideos = document.querySelectorAll('video[id^="remote-"]');
        if (existingRemoteVideos.length > 0) {
            activateOverlayMode();
        }
    }, 500);
    
    window.activateOverlayMode = activateOverlayMode;
    window.restoreOriginalLayout = restoreOriginalLayout;
    window.debugVideoLayout = () => {
        console.log('Remote connection status:', hasRemoteConnection);
        console.log('Overlay container:', overlayContainer);
        console.log('Original parent:', originalLocalVideoParent);
        console.log('Local video current parent:', document.querySelector('#localFeed')?.parentNode);
        console.log('Remote videos:', document.querySelectorAll('video[id^="remote-"]').length);
    };
});
