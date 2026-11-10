import { createServer as createViteServer } from 'vite'
import { createServer } from 'node:http'
import { loadEnvFile } from 'node:process'
import { randomBytes } from 'node:crypto'
try { loadEnvFile('.env') } catch (error) { if (error.code !== 'ENOENT') throw error }
const port = Number(process.env.DEV_PORT || 8080)
const host = process.env.DEV_HOST || '127.0.0.1'
// Generate session-only credentials for localhost development; never enable this in production.
if (!process.env.ADMIN_PASSWORD && host === '127.0.0.1') {
  process.env.ADMIN_EMAIL = 'admin@mubsa.local'
  process.env.ADMIN_PASSWORD = randomBytes(12).toString('base64url')
  process.env.ADMIN_SESSION_SECRET = randomBytes(32).toString('hex')
  console.log(`Local admin: ${process.env.ADMIN_EMAIL}\nSession password: ${process.env.ADMIN_PASSWORD}`)
}
const { createApiServer } = await import('./index.js')
const api = createApiServer()
const server = createServer((request, response) => {
  if (request.url.startsWith('/api/')) api.emit('request', request, response)
  else vite.middlewares(request, response)
})
const vite = await createViteServer({ server: { middlewareMode: true, ws: { server } }, appType: 'spa' })
server.on('error', async (error) => {
  console.error(error.code === 'EADDRINUSE' ? `Port ${port} is occupied. Close the previous server or set DEV_PORT to another port.` : error)
  await vite.close()
  process.exit(1)
})
server.listen(port, host, () => console.log(`Mubsa website + API: http://${host}:${port}\nAdmin: http://${host}:${port}/admin`))
async function stop() { server.close(); await vite.close(); process.exit(0) }
process.on('SIGINT', stop)
process.on('SIGTERM', stop)
