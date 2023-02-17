import { LoadSurveyController } from '../../../../../presentation/controllers/survey/load-survey/load-survey-controller';
import { Controller } from '../../../../../presentation/protocols';
import { makeLogControllerDecorator } from '../../../decorators/log-controller-decorator-factory';
import { makeDbLoadSurvey } from '../../../usecases/load-survey/db-load-survey-factory';

export const makeLoadSurveyController = (): Controller => {
    const dbLoadSurvey = makeDbLoadSurvey() // Here's implementing my Data layer to be used in the controller
    const controller = new LoadSurveyController(dbLoadSurvey) // Here's the controller implementation using Data layer that implements MongoRepository
    return makeLogControllerDecorator(controller)
}