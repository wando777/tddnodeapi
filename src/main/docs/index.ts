import { badRequest } from './components/bad-request'
import { serverError } from './components/server-error'
import { loginPath } from './paths/login-paths'
import { accountSchema, loginParamsSchema } from './schemas/account-schema'
import { errorSchema } from './schemas/error-schema'

export default {
  openapi: '3.0.0',
  info: {
    title: 'Clean Node API',
    description: 'Survey API made by Wando777',
    version: '1.0.0'
  },
  license: {
    name: 'GPL-3.0-or-later',
    url: 'https://spdx.org/licenses/GPL-3.0-or-later.html'
  },
  servers: [{
    url: '/api'
  }],
  tags: [{
    name: 'Login'
  }],
  paths: {
    '/login': loginPath
  },
  schemas: {
    account: accountSchema,
    login: loginParamsSchema,
    error: errorSchema
  },
  components: {
    badRequest,
    serverError
  }
}