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

export const surveyParamsSchema = {
  type: 'object',
  properties: {
    questions: {
      type: 'string'
    },
    answers: {
      type: 'array',
      items: {
        $ref: '#/schemas/surveyAnswer'
      }
    }
  }
}

export const surveyAnswerSchema = {
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

export const saveSurveyParamsSchema = {
  type: 'object',
  properties: {
    answer: {
      type: 'string'
    }
  }
}

export const surveyResultSchema = {
  type: 'object',
  properties: {
    id: {
      type: 'string'
    },
    surveyId: {
      type: 'string'
    },
    accountId: {
      type: 'string'
    },
    answer: {
      type: 'string'
    },
    date: {
      type: 'string'
    }
  }
}