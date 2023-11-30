import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import renapRouter from './routers/renap'
import IARouter from './routers/ia'

const app = new Hono()

app.use(logger())
app.use(cors())
app.get('/', (c) => c.text('Hello Hono!'))
app.route("/renap", renapRouter)
app.route("/ia", IARouter)

export default {
    port: 9000,
    fetch: app.fetch
}
