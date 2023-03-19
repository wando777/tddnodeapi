export const loginPath = {
  post: {
    tags: ['Login'],
    summary: 'Authentication Login API',
    requestBody: {
      description: 'Content payload',
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/login'
          }
        }
      }
    },
    responses: {
      200: {
        description: 'Success',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/account'
            }
          }
        }
      },
      400: {
        description: 'Bad request. The request has returned as invalid'
      },
      default: {
        description: 'Unexpected error'
      }
    }
  }
}