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
                    <script src="/static/script.js"></script>
                </head>
                <body data-room-id={roomId}>
                    <h1>Whisper Gate - {roomId}</h1>
                    <div id="videos">
                        <video id="localFeed" autoplay playsinline muted></video>
                    </div>
                    <button id="startCall">Start Call</button>
                </body>
            </html>
        </Fragment>
    );
}