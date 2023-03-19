import { loginPath } from './paths/login-paths'
import { accountSchema, loginParamsSchema } from './schemas/account-schema'

export default {
  openapi: '3.0.0',
  info: {
    title: 'Clean Node API',
    description: 'Survey API made by Wando777',
    version: '1.0.0'
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
    login: loginParamsSchema
  }
}