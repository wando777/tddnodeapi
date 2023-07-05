import { mockListSurveyModel, mockSurveyModel, mockSurveyResultModel } from '@/domain/test'
import { LoadSurveyById } from '../controllers/survey-result/save-survey-result/save-survey-result-controller-protocols'
import { LoadSurvey, SurveyModel } from '../controllers/survey/load-survey/load-survey-controller-protocols'
import { LoadSurveyResult } from '@/domain/usecases/survey-result/load-survey-result'
import { SurveyResultModel } from '@/domain/models/survey-result'

export const mockLoadSurvey = (): LoadSurvey => {
  class LoadSurveyStub implements LoadSurvey {
    async load(): Promise<SurveyModel[]> {
      return await Promise.resolve(mockListSurveyModel())
    }
  }
  return new LoadSurveyStub()
}

export const mockLoadSurveyById = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    async loadById(id: string): Promise<SurveyModel> {
      return await Promise.resolve(mockSurveyModel())
    }
  }
  return new LoadSurveyByIdStub()
}

export const mockLoadSurveyResult = (): LoadSurveyResult => {
  class LoadSurveyResultStub implements LoadSurveyResult {
    async load(surveyId: string): Promise<SurveyResultModel> {
      return await Promise.resolve(mockSurveyResultModel())
    }
  }
  return new LoadSurveyResultStub()
}