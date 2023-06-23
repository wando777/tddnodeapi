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

export const surveyResultAnswerSchema = {
  type: 'object',
  properties: {
    image: {
      type: 'string'
    },
    answer: {
      type: 'string'
    },
    count: {
      type: 'number'
    },
    percent: {
      type: 'number'
    }
  },
  required: ['answer', 'count', 'percent']
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
    surveyId: {
      type: 'string'
    },
    question: {
      type: 'string'
    },
    answers: {
      type: 'array',
      items: {
        $ref: '#/schemas/surveyResultAnswer'
      }
    },
    date: {
      type: 'string'
    }
  },
  required: ['surveyId', 'question', 'answers', 'date']
}