import { DbAddSurvey } from '@/data/usecases/survey/add-survey/db-add-survey'
import { AddSurvey } from '@/domain/usecases/survey/add-survey'
import { SurveyMongoRepository } from '@/infra/db/mongodb/survey/survey-mongo-repository'

export const makeDbAddSurvey = (): AddSurvey => {
    const surveyMongoRepo = new SurveyMongoRepository()
    const dbAddSurvey = new DbAddSurvey(surveyMongoRepo)
    return dbAddSurvey
}