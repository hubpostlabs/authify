import { Hono } from 'hono'
import authRoutes from '@/api/v1/selfauth/routes'
import sessionRoutes from './api/v1/session/routes'

const app = new Hono()


app.route("/service/web/v1", authRoutes)
app.route("/service/web/v1", sessionRoutes)
app.get('/', (c) => {
  return c.text('Hello Hono!')
})

export default app
