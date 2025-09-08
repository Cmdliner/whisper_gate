import { Fragment } from "hono/jsx";

type RoomPageProps = {
    roomId: string;
}

export const RoomPage = ({ roomId }: RoomPageProps) => {
    const name = "Cmdliner!"
    return (
        <Fragment>
            <html lang="en">
                <head>
                    <meta charset="UTF-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <title>Whisper Gate</title>
                    <style>{`
                        body {
                            font-family: Arial, sans-serif;
                            margin: 20px;
                            background-color: #f0f0f0;
                        }
                        h1 {
                            color: #333;
                            text-align: center;
                        }
                        #videos {
                            display: flex;
                            flex-wrap: wrap;
                            gap: 15px;
                            justify-content: center;
                            margin: 20px 0;
                        }
                        video {
                            width: 300px;
                            height: 200px;
                            background-color: #000;
                            border: 2px solid #333;
                            border-radius: 8px;
                        }
                        #localFeed {
                            border-color: #4CAF50;
                        }
                        button {
                            display: block;
                            margin: 20px auto;
                            padding: 12px 24px;
                            font-size: 16px;
                            background-color: #4CAF50;
                            color: white;
                            border: none;
                            border-radius: 5px;
                            cursor: pointer;
                        }
                        button:hover {
                            background-color: #45a049;
                        }
                        button:disabled {
                            background-color: #cccccc;
                            cursor: not-allowed;
                        }
                        #debug {
                            position: fixed;
                            top: 10px;
                            right: 10px;
                            background: rgba(0,0,0,0.8);
                            color: white;
                            padding: 10px;
                            border-radius: 5px;
                            font-family: monospace;
                            font-size: 12px;
                            max-width: 300px;
                            max-height: 200px;
                            overflow-y: auto;
                        }
                    `}</style>
                    <script src="/static/script.js"></script>
                </head>
                <body data-room-id={roomId}>
                    <h1>Whisper Gate - Room: {roomId}</h1>
                    <div id="videos">
                        <video id="localFeed" autoplay playsinline muted></video>
                    </div>
                    <button id="startCall">Start Call</button>
                    <div id="debug">
                        <div>Debug Console:</div>
                        <div id="debugLog"></div>
                    </div>
                </body>
            </html>
        </Fragment>
    );
}