export const surveysSchema = {
  type: 'array',
  items: {
    $ref: '#/schemas/survey'
  }
}

export const surveySchema = {
  type: 'object',
  properties: {
    id: {
      type: 'string'
    },
    questions: {
      type: 'string'
    },
    answers: {
      type: 'array',
      items: {
        $ref: '#/schemas/surveyAnswer'
      }
    },
    date: {
      type: 'string'
    }
  }
}

export const surveyAnswer = {
  type: 'object',
  properties: {
    image: {
      type: 'string'
    },
    answer: {
      type: 'string'
    }
  }
}