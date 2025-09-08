import { Fragment } from "hono/jsx";

type RoomPageProps = {
    roomId: string;
}

export const RoomPage = ({ roomId }: RoomPageProps) => {
    return (
        <Fragment>
            <html lang="en">
                <head>
                    <meta charset="UTF-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <title>Whisper Gate - Video Conference</title>
                    <link rel="icon" type="image/svg+xml" href="/static/favicon.svg" />
                    <link rel="stylesheet" href="/static/room.css" />
                    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
                    <script src="/static/script.js"></script>
                    <script src="/static/video-layout.js"></script>
                </head>
                <body data-room-id={roomId}>
                    <div class="room-container">
                        <header class="room-header">
                            <h1 class="room-title">
                                <i class="fas fa-video"></i>
                                Whisper Gate
                            </h1>
                            <div class="room-id">
                                <i class="fas fa-door-open"></i>
                                Room: {roomId}
                            </div>
                        </header>

                        <main class="video-grid" id="videos">
                            <div class="video-container local">
                                <video id="localFeed" class="video-element" autoplay playsinline muted></video>
                                <div class="video-overlay">
                                    <span class="video-label">You</span>
                                </div>
                            </div>
                        </main>

                        <div class="controls-panel">
                            <button class="control-btn mute" disabled title="Mute (Coming Soon)">
                                <i class="fas fa-microphone"></i>
                            </button>
                            <button class="control-btn video" disabled title="Video Toggle (Coming Soon)">
                                <i class="fas fa-video"></i>
                            </button>
                            <button class="control-btn start" id="startCall" title="Start Call">
                                <i class="fas fa-phone"></i>
                            </button>
                            <button class="control-btn end" disabled title="End Call (Coming Soon)">
                                <i class="fas fa-phone-slash"></i>
                            </button>
                        </div>

                        <div class="debug-panel" id="debug">
                            <h4><i class="fas fa-bug"></i> Debug Console</h4>
                            <div id="debugLog"></div>
                        </div>
                    </div>
                </body>
            </html>
        </Fragment>
    );
}