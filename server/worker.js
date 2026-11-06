import { httpServerHandler } from 'cloudflare:node'
import { env } from 'cloudflare:workers'
import { createApiServer, setRuntimeEnv } from './index.js'

setRuntimeEnv(env)
const server = createApiServer()
server.listen(8787)

export default httpServerHandler({ port: 8787 })
