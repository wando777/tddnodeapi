import { SurveyResultModel } from '../models/survey-result';
import { SaveSurveyResultParams } from '../usecases/survey-result/save-survey-result';

export const mockSaveSurveyResultParams = (): SaveSurveyResultParams => ({
  surveyId: 'any_surveyId',
  userId: 'any_userId',
  answer: 'any_answer',
  date: new Date()
})

export const mockSurveyResultModel = (): SurveyResultModel => ({
  surveyId: 'any_surveyId',
  question: 'any_question',
  answers: [{
    answer: 'any_answer',
    count: 1,
    percent: 50
  },
  {
    answer: 'other_answer',
    image: 'any_image',
    count: 10,
    percent: 80
  }],
  date: new Date()
})

export const mockSurveyResultModelWithZeros = (): SurveyResultModel => ({
  surveyId: 'any_id',
  question: 'any_question',
  answers: [{
    answer: 'any_answer',
    image: 'any_image',
    count: 0,
    percent: 0
  },
  {
    answer: 'another_answer',
    count: 0,
    percent: 0
  }],
  date: new Date()
})