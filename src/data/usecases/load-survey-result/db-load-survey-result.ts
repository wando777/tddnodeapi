import { LoadSurveyByIdRepository, LoadSurveyResult, LoadSurveyResultRepository, SurveyResultModel } from './db-load-survey-result-protocols'

export class DbLoadSurveyResult implements LoadSurveyResult {
  constructor(
    private readonly loadSurveyResultRepository: LoadSurveyResultRepository,
    private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository
  ) { }

  async load(surveyId: string): Promise<SurveyResultModel> {
    const loadSaveResult = await this.loadSurveyResultRepository.loadBySurveyId(surveyId)
    if (!loadSaveResult) {
      await this.loadSurveyByIdRepository.loadOneById(surveyId)
    }
    return loadSaveResult
  }
}