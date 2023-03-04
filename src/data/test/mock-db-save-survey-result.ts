import { SurveyResultModel } from '@/domain/models/survey-result'
import { mockSaveSurveyResultParams } from '@/domain/test'
import { SaveSurveyResultRepository, SaveSurveyResultParams } from '../usecases/save-survey-result/db-save-survey-result-protocols'

export const mockSaveSurveyResultRepository = (): SaveSurveyResultRepository => {
  class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
    async saveResult(surveyData: SaveSurveyResultParams): Promise<SurveyResultModel> {
      return await new Promise(
        resolve => resolve(
          Object.assign({}, mockSaveSurveyResultParams(), { id: 'any_id' })
        )
      )
    }
  }
  return new SaveSurveyResultRepositoryStub()
}