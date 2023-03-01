import { SaveSurveyResult, SaveSurveyResultRepository, SaveSurveyResultParams } from './db-save-survey-result-protocols';
import { SurveyResultModel } from '@/domain/models/survey-result';

export class DbSaveSurveyResult implements SaveSurveyResult {
  constructor(
    private readonly saveSurveyResultRepository: SaveSurveyResultRepository
  ) { }

  async save(surveyData: SaveSurveyResultParams): Promise<SurveyResultModel> {
    const saveSurveyResult = await this.saveSurveyResultRepository.saveResult(surveyData)
    return saveSurveyResult
  }
}