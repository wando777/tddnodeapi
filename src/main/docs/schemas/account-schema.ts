export const accountSchema = {
  type: 'object',
  properties: {
    accessToken: {
      type: 'string'
    }
  }
}

export const loginParamsSchema = {
  type: 'object',
  properties: {
    email: {
      type: 'string'
    },
    password: {
      type: 'string'
    }
  },
  required: ['email', 'password']
}