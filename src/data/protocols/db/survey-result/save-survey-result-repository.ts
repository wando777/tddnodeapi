import { SaveSurveyResultParams } from '@/domain/usecases/survey-result/save-survey-result';

export interface SaveSurveyResultRepository {
  saveResult: (surveyData: SaveSurveyResultParams) => Promise<void>
}
