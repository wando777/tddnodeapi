import { SurveyModel } from '@/domain/models/survey'

export interface LoadSurveyByIdRepository {
  loadOneById: (id: string) => Promise<SurveyModel>
}