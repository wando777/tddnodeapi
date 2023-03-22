export const saveSurveyResultPath = {
  put: {
    tags: ['Survey'],
    summary: 'Survey result API to upload an answer',
    security: [{
      apiKeyAuth: [] as any
    }],
    parameters: [{
      in: 'path',
      name: 'surveyId',
      required: true,
      schema: {
        type: 'string'
      }
    }],
    requestBody: {
      description: 'Content payload',
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/saveSurveyParams'
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
              $ref: '#/schemas/surveyResult'
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