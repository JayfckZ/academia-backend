import { buildApp } from './app'

const app = buildApp()

app.listen({ port: 3333 }, () => {
    console.log('Server rodando em http://localhost:3333')
})