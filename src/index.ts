import { randomUUIDv7 } from 'bun'
import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => {
	return c.text('Hello Hono!')
})

app.get('/healthz' , (c) => {
	return c.json({ success: true, message: 'The hood is up Cmdliner!'})
})

app.post('/test', async (c) => {
	const body = await c.req.json<ReqBody>();
	const responseHeaders: HeadersInit = {
		"Set-Cookie": `Bearer ${randomUUIDv7()}`
	};
	return 	c.json({success: true, message: `My name is ${body.name} and I am ${body.age} year(s) old`}, 200, responseHeaders)
})

export default app
