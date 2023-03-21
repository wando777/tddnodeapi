export const surveyPath = {
  get: {
    security: [{
      apiKeyAuth: [] as any
    }],
    tags: ['Survey'],
    summary: 'This API will list all surveys',
    responses: {
      200: {
        description: 'Success',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/surveys'
            }
          }
        }
      },
      403: {
        $ref: '#/components/forbidden'
      },
      500: {
        $ref: '#/components/serverError'
      }
    }
  },
  post: {
    security: [{
      apiKeyAuth: [] as any
    }],
    tags: ['Survey'],
    summary: 'This API will create a survey',
    requestBody: {
      description: 'Content payload',
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/surveyParams'
          }
        }
      }
    },
    responses: {
      204: {
        description: 'Success'
      },
      403: {
        $ref: '#/components/forbidden'
      },
      500: {
        $ref: '#/components/serverError'
      }
    }
  }
}