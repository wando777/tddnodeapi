import { SurveyMongoRepository } from '../../../../infra/db/mongodb/survey/survey-mongo-repository';
import { LoadSurvey } from '../../../../presentation/controllers/survey/load-survey/load-survey-controller-protocols';
import { DbLoadSurvey } from '../../../../data/usecases/load-survey/db-load-survey';

export const makeDbLoadSurvey = (): LoadSurvey => {
    const surveyMongoRepo = new SurveyMongoRepository()
    const dbLoadSurvey = new DbLoadSurvey(surveyMongoRepo)
    return dbLoadSurvey
}