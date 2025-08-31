import { Hono } from 'hono'
import { auth } from './routes/auth.route'
import { room } from './routes/room.routes'

const app = new Hono()

// app.use(cors())
// app.use(helmet())

app.get('/', (c) => c.redirect("/healthz"))
app.get("/healthz", (c) => c.json({ message: 'The hood is up Cmdliner!' }))

app.route('/auth', auth)
app.route('/rooms', room)

export default app
