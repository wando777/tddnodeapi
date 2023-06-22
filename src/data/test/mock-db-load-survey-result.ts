import { SurveyResultModel } from '@/domain/models/survey-result'
import { mockSurveyResultModel } from '@/domain/test'
import { LoadSurveyResultRepository } from '../protocols/db/survey-result/load-survey-result-repository'

export const mockLoadSurveyResultRepository = (): LoadSurveyResultRepository => {
  class LoadSurveyResultRepositoryStub implements LoadSurveyResultRepository {
    async loadBySurveyId(surveyId: string): Promise<SurveyResultModel> {
      return await new Promise(
        resolve => resolve(
          mockSurveyResultModel()
        )
      )
    }
  }
  return new LoadSurveyResultRepositoryStub()
}