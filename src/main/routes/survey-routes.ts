import { Router } from 'express'
import { adapterRoute } from '../adapter/express/express-route-adapter'
import { makeAddSurveyController } from '../factories/controllers/survey/add-survey-controller-factory'

export default (router: Router): void => {
    router.post('/survey', adapterRoute(makeAddSurveyController()))
}