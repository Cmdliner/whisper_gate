import { Hono } from 'hono'
import { secureHeaders } from 'hono/secure-headers'
import { cors } from 'hono/cors'
import { jsxRenderer } from 'hono/jsx-renderer'
import { api } from './routes'
import { ui } from './ui'
import { websocket, webSocketHandler } from './controllers/ws.controller'

const app = new Hono()
app.use(cors())
app.use(secureHeaders())

app.use('*', jsxRenderer())

app.get('/healthz', (c) => c.json({ message: 'The hood is up Cmdliner!' }))
app.get('/ws/rooms/:roomID', webSocketHandler)
app.route('/api/v1', api)
app.route('', ui)

export default {
    port: 3001,
    fetch: app.fetch,
    websocket,
}
