import { Hono } from 'hono'
import authRoutes from '@/api/v1/selfauth/routes'
import sessionRoutes from './api/v1/session/routes'
import oauthRoutes from './api/v1/oauth/routes'
import { logger } from "hono/logger"

const app = new Hono()
app.use(logger());
app.route("/api/v1/account", authRoutes)
app.route("/api/v1/user", sessionRoutes)
app.route("/api/v1/account", oauthRoutes)
app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.onError((err, c) => {
  console.error(`${err}`)
  return c.json({
    messgae: "server failed",
    error: err,
  })
})

export default app
