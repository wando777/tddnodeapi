import { DbSaveSurveyResult } from '@/data/usecases/save-survey-result/db-save-survey-result'
import { SaveSurveyResult } from '@/data/usecases/save-survey-result/db-save-survey-result-protocols'
import { SurveyResultMongoRepository } from '@/infra/db/mongodb/save-result/survey-result-mongo-repository'

export const makeDbSaveSurveyResult = (): SaveSurveyResult => {
    const saveSurveyResultMongoRepo = new SurveyResultMongoRepository()
    const loadSurveyResultMongoRepo = new SurveyResultMongoRepository()
    const dbSaveSurveyResult = new DbSaveSurveyResult(saveSurveyResultMongoRepo, loadSurveyResultMongoRepo)
    return dbSaveSurveyResult
}