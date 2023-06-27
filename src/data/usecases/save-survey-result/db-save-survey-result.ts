import { SaveSurveyResult, SaveSurveyResultRepository, SaveSurveyResultParams, LoadSurveyResultRepository } from './db-save-survey-result-protocols';
import { SurveyResultModel } from '@/domain/models/survey-result';

export class DbSaveSurveyResult implements SaveSurveyResult {
  constructor(
    private readonly saveSurveyResultRepository: SaveSurveyResultRepository,
    private readonly loadSurveyResultRepository: LoadSurveyResultRepository
  ) { }

  async save(surveyData: SaveSurveyResultParams): Promise<SurveyResultModel> {
    await this.saveSurveyResultRepository.saveResult(surveyData)
    const loadSurveyResult = await this.loadSurveyResultRepository.loadBySurveyId(surveyData.surveyId)
    return loadSurveyResult
  }
}