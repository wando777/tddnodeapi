import { makeAddSurveyValidation } from './add-survey-validation-factory';
import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory';
import { makeDbAddSurvey } from '@/main/factories/usecases/add-survey/db-add-survey-factory';
import { AddSurveyController } from '@/presentation/controllers/survey/add-survey/add-survey-controller';
import { Controller } from '@/presentation/protocols';

export const makeAddSurveyController = (): Controller => {
    const dbAddSurvey = makeDbAddSurvey()
    const addSurveyValidation = makeAddSurveyValidation()
    const controller = new AddSurveyController(addSurveyValidation, dbAddSurvey)
    return makeLogControllerDecorator(controller)
}