import { Hono, Context } from "hono"
import { serveStatic } from 'hono/bun'
import { RoomPage } from "./room"
import { html } from "hono/html"
import { pathToFileURL } from "bun"

export const ui = new Hono()

ui.use('/static/*', serveStatic({ root: "./" } as any))
ui.get('/', (c) => c.html(html`
    <html>
        <head></head>
        <body>
            <h1> Whisper Gate!!! </h1>
        </body>
    </html>
    `))
ui.get('/rooms/:roomID', (c: Context) => {
    const { roomID } = c.req.param();
    return c.render(<RoomPage roomId={roomID}/>)
})