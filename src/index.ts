import { Hono } from 'hono'
import { secureHeaders } from 'hono/secure-headers'
import { cors } from 'hono/cors'
import { jsxRenderer } from 'hono/jsx-renderer'
import { api } from './routes'
import { ui } from './ui'

const app = new Hono()
app.use(cors())
app.use(secureHeaders())

app.use('*', jsxRenderer())

app.get('/healthz', (c) => c.json({ message: 'The hood is up Cmdliner!' }))

app.route('/api/v1', api)
app.route('', ui)

export default app
