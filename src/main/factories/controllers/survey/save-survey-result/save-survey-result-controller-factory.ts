import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory'
import { makeDbLoadSurveyById } from '@/main/factories/usecases/load-survey/db-load-survey-by-id-factory'
import { makeDbSaveSurveyResult } from '@/main/factories/usecases/save-survey-result/db-save-survey-result-factory'
import { SaveSurveyResultController } from '@/presentation/controllers/survey-result/save-survey-result/save-survey-result-controller'
import { Controller } from '@/presentation/protocols'

export const makeSaveSurveyResultController = (): Controller => {
    const dbLoadSurveyById = makeDbLoadSurveyById() // Here's my Data layer implementation to be used in the controller
    const dbSaveSurveyResult = makeDbSaveSurveyResult() // Same here
    const controller = new SaveSurveyResultController(dbLoadSurveyById, dbSaveSurveyResult) // Here's the controller implementation using Data layer that implements MongoRepository
    return makeLogControllerDecorator(controller)
}