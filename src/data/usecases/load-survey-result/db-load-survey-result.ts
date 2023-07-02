import { LoadSurveyByIdRepository, LoadSurveyResult, LoadSurveyResultRepository, SurveyResultModel } from './db-load-survey-result-protocols'

export class DbLoadSurveyResult implements LoadSurveyResult {
  constructor(
    private readonly loadSurveyResultRepository: LoadSurveyResultRepository,
    private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository
  ) { }

  async load(surveyId: string): Promise<SurveyResultModel> {
    let loadSaveResult = await this.loadSurveyResultRepository.loadBySurveyId(surveyId)
    if (!loadSaveResult) {
      const surveyResult = await this.loadSurveyByIdRepository.loadOneById(surveyId)
      loadSaveResult = {
        surveyId: surveyResult.id,
        question: surveyResult.question,
        date: surveyResult.date,
        answers: surveyResult.answers.map(answer => Object.assign({}, answer, {
          count: 0,
          percent: 0
        }))
      }
    }
    return loadSaveResult
  }
}