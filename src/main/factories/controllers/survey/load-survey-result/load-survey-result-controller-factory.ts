import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory'
import { makeDbLoadSurveyResult } from '@/main/factories/usecases/load-survey-result/db-load-survey-result-factory'
import { makeDbLoadSurveyById } from '@/main/factories/usecases/load-survey/db-load-survey-by-id-factory'
import { LoadSurveyResultController } from '@/presentation/controllers/survey-result/load-survey-result/load-survey-result-controller'
import { Controller } from '@/presentation/protocols'

export const makeLoadSurveyResultController = (): Controller => {
    const dbLoadSurveyById = makeDbLoadSurveyById() // Here's my Data layer implementation to be used in the controller
    const dbLoadSurveyResult = makeDbLoadSurveyResult()
    const controller = new LoadSurveyResultController(dbLoadSurveyById, dbLoadSurveyResult) // Here's the controller implementation using Data layer that implements MongoRepository
    return makeLogControllerDecorator(controller)
}