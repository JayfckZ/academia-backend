import { buildApp } from './app'

const app = buildApp()

app.listen({
  port: Number(process.env.PORT),
  host: '0.0.0.0'
})