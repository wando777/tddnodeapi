export const signUpPath = {
  post: {
    tags: ['Login'],
    summary: 'SignUp API for creating a new user',
    requestBody: {
      description: 'Content payload',
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/signUp'
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
        $ref: '#/components/badRequest'
      },
      500: {
        $ref: '#/components/serverError'
      }
    }
  }
}