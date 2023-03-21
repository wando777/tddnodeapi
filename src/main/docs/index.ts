import { badRequest, forbidden, serverError } from './components'
import { loginPath, surveyPath, signUpPath } from './paths'
import { accountSchema, loginParamsSchema, errorSchema, surveysSchema, surveySchema, surveyAnswer, apiKeyAuthSchema, surveyParamsSchema } from './schemas'
import { signUpParamsSchema } from './schemas/sign-up-schema'

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
  },
  {
    name: 'Survey'
  }],
  paths: {
    '/login': loginPath,
    '/survey': surveyPath,
    '/signup': signUpPath
  },
  schemas: {
    account: accountSchema,
    login: loginParamsSchema,
    signUp: signUpParamsSchema,
    error: errorSchema,
    surveyParams: surveyParamsSchema,
    surveys: surveysSchema,
    survey: surveySchema,
    surveyAnswer
  },
  components: {
    securitySchemes: {
      apiKeyAuth: apiKeyAuthSchema
    },
    badRequest,
    serverError,
    forbidden
  }
}