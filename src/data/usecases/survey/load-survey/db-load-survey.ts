import { SurveyModel } from '@/domain/models/survey'
import { LoadSurvey, LoadSurveyRepository } from './db-load-survey-protocols'

export class DbLoadSurvey implements LoadSurvey {
  constructor(
    private readonly loadSurveyRepository: LoadSurveyRepository
  ) { }

  async load(): Promise<SurveyModel[]> {
    const surveys = await this.loadSurveyRepository.loadAll()
    return surveys
  }
}