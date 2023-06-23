import { LoadSurveyResult, LoadSurveyResultRepository, SurveyResultModel } from './db-load-survey-result-protocols'

export class DbLoadSurveyResult implements LoadSurveyResult {
  constructor(
    private readonly loadSurveyResultRepository: LoadSurveyResultRepository
  ) { }

  async load(surveyId: string): Promise<SurveyResultModel> {
    const loadSaveResult = await this.loadSurveyResultRepository.loadBySurveyId(surveyId)
    return loadSaveResult
  }
}