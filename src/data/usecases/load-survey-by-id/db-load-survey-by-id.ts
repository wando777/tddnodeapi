import { LoadSurveyById, LoadSurveyByIdRepository } from './db-load-survey-by-id-protocols'
import { SurveyModel } from '@/domain/models/survey'

export class DbLoadSurveyById implements LoadSurveyById {
  constructor(
    private readonly loadSurveyRepository: LoadSurveyByIdRepository
  ) { }

  async loadById(id: string): Promise<SurveyModel> {
    const survey = await this.loadSurveyRepository.loadOneById(id)
    return survey
  }
}