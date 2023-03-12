import { mockListSurveyModel, mockSurveyModel } from '@/domain/test'
import { LoadSurveyById } from '../controllers/survey-result/save-survey-result/save-survey-result-controller-protocols'
import { LoadSurvey, SurveyModel } from '../controllers/survey/load-survey/load-survey-controller-protocols'

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