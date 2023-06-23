import { SurveyResultModel } from '@/domain/models/survey-result'

export type SaveSurveyResultParams = {
    surveyId: string
    userId: string
    answer: string
    date: Date
}

export interface SaveSurveyResult {
    save: (data: SaveSurveyResultParams) => Promise<SurveyResultModel>
}