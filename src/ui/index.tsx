import { Hono, Context } from "hono"
import { serveStatic } from 'hono/bun'
import { RoomPage } from "./room"
import { html } from "hono/html"
import { pathToFileURL } from "bun"

export const ui = new Hono()

ui.use('/static/*', serveStatic({ root: "./" } as any))
ui.get('/', (c) => c.html(html`
    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Whisper Gate - Video Conferencing</title>
            <link rel="icon" type="image/svg+xml" href="/static/favicon.svg" />
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 25%, #f1f5f9 50%, #ffffff 75%, #f8fafc 100%);
                    background-size: 400% 400%;
                    animation: subtleShift 20s ease infinite;
                    color: #1e293b;
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                }
                @keyframes subtleShift {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                body::before {
                    content: '';
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-image: 
                        radial-gradient(circle at 25% 25%, rgba(71, 85, 105, 0.03) 1px, transparent 1px),
                        radial-gradient(circle at 75% 75%, rgba(100, 116, 139, 0.02) 1px, transparent 1px);
                    background-size: 80px 80px;
                    pointer-events: none;
                    z-index: 0;
                }
                .container {
                    text-align: center;
                    max-width: 600px;
                    padding: 2rem;
                    position: relative;
                    z-index: 1;
                }
                .logo {
                    font-size: 3rem;
                    margin-bottom: 1rem;
                    background: linear-gradient(135deg, #1e293b, #475569);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                h1 {
                    font-size: 2.5rem;
                    margin-bottom: 1rem;
                    font-weight: 700;
                    color: #1e293b;
                }
                p {
                    font-size: 1.2rem;
                    color: #64748b;
                    margin-bottom: 2rem;
                    line-height: 1.6;
                }
                .room-form {
                    display: flex;
                    gap: 1rem;
                    margin-bottom: 2rem;
                    justify-content: center;
                    flex-wrap: wrap;
                }
                .room-input {
                    padding: 1rem 1.5rem;
                    font-size: 1rem;
                    border: 1px solid rgba(148, 163, 184, 0.3);
                    border-radius: 12px;
                    background: rgba(255, 255, 255, 0.8);
                    backdrop-filter: blur(10px);
                    color: #1e293b;
                    min-width: 200px;
                    box-shadow: 0 4px 15px rgba(71, 85, 105, 0.1);
                    transition: all 0.3s ease;
                }
                .room-input:focus {
                    outline: none;
                    border-color: rgba(59, 130, 246, 0.5);
                    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
                }
                .room-input::placeholder {
                    color: #94a3b8;
                }
                .join-btn {
                    padding: 1rem 2rem;
                    font-size: 1rem;
                    background: linear-gradient(135deg, #3b82f6, #1d4ed8);
                    color: white;
                    border: none;
                    border-radius: 12px;
                    cursor: pointer;
                    font-weight: 600;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
                }
                .join-btn:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 15px 30px rgba(59, 130, 246, 0.4);
                }
                .features {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                    gap: 1rem;
                    margin-top: 3rem;
                }
                .feature {
                    padding: 1.5rem;
                    background: rgba(255, 255, 255, 0.8);
                    backdrop-filter: blur(10px);
                    border-radius: 16px;
                    border: 1px solid rgba(148, 163, 184, 0.2);
                    box-shadow: 0 8px 20px rgba(71, 85, 105, 0.1);
                    transition: all 0.3s ease;
                }
                .feature:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 15px 30px rgba(71, 85, 105, 0.15);
                    border-color: rgba(59, 130, 246, 0.3);
                }
                .feature-icon {
                    font-size: 2rem;
                    margin-bottom: 0.5rem;
                    color: #3b82f6;
                }
                .feature-title {
                    font-weight: 600;
                    margin-bottom: 0.25rem;
                    color: #1e293b;
                }
                .feature-desc {
                    font-size: 0.9rem;
                    color: #64748b;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="logo">
                    <i class="fas fa-video"></i>
                </div>
                <h1>Whisper Gate</h1>
                <p>Professional video conferencing made simple. Connect with anyone, anywhere.</p>
                
                <div class="room-form">
                    <input type="text" class="room-input" placeholder="Enter room ID" id="roomInput">
                    <button class="join-btn" onclick="joinRoom()">
                        <i class="fas fa-sign-in-alt"></i>
                        Join Room
                    </button>
                </div>
                
                <div class="features">
                    <div class="feature">
                        <div class="feature-icon"><i class="fas fa-video"></i></div>
                        <div class="feature-title">HD Video</div>
                        <div class="feature-desc">Crystal clear video calls</div>
                    </div>
                    <div class="feature">
                        <div class="feature-icon"><i class="fas fa-desktop"></i></div>
                        <div class="feature-title">Screen Share</div>
                        <div class="feature-desc">Share your screen instantly</div>
                    </div>
                    <div class="feature">
                        <div class="feature-icon"><i class="fas fa-shield-alt"></i></div>
                        <div class="feature-title">Secure</div>
                        <div class="feature-desc">End-to-end encrypted</div>
                    </div>
                </div>
            </div>
            
            <script>
                function joinRoom() {
                    const roomId = document.getElementById('roomInput').value.trim();
                    if (roomId) {
                        window.location.href = '/rooms/' + roomId;
                    } else {
                        // Generate random room ID
                        const randomId = Math.random().toString(36).substr(2, 8);
                        window.location.href = '/rooms/' + randomId;
                    }
                }
                
                document.getElementById('roomInput').addEventListener('keypress', function(e) {
                    if (e.key === 'Enter') {
                        joinRoom();
                    }
                });
            </script>
        </body>
    </html>
    `))
ui.get('/rooms/:roomID', (c: Context) => {
    const { roomID } = c.req.param();
    return c.render(<RoomPage roomId={roomID}/>)
})