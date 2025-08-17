import { Hono } from 'hono'
import authRoutes from '@/api/v1/selfauth/routes'
import sessionRoutes from './api/v1/session/routes'
import oauthRoutes from './api/v1/oauth/routes'

const app = new Hono()


app.route("/api/v1/account", authRoutes)
app.route("/api/v1/user", sessionRoutes)
app.route("/api/v1/account", oauthRoutes)
app.get('/', (c) => {
  return c.text('Hello Hono!')
})

export default app
