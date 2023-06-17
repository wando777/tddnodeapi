import { SurveyModel } from '../models/survey';
import { AddSurveyParams } from '../usecases/survey/add-survey';

export const mockListSurveyModel = (): SurveyModel[] => [{
  id: 'any_id',
  question: 'any_question',
  answers: [{
    image: 'any_image',
    answer: 'any_answer'
  },
  {
    answer: 'another_answer'
  }],
  date: new Date()
}]

export const mockSurveyModel = (): SurveyModel => ({
  id: 'any_id',
  question: 'any_question',
  answers: [{
    image: 'any_image',
    answer: 'any_answer'
  },
  {
    answer: 'another_answer'
  }],
  date: new Date()
})

export const mockSurveyAddParams = (): AddSurveyParams => ({
  question: 'any_question',
  answers: [{
    image: 'any_image',
    answer: 'any_answer'
  },
  {
    answer: 'other_answer'
  }],
  date: new Date()
})