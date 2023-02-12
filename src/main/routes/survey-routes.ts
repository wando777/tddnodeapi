import { Router } from 'express'
import { adapterMiddleware } from '../adapter/express/express-middleware-adapter'
import { adapterRoute } from '../adapter/express/express-route-adapter'
import { makeAddSurveyController } from '../factories/controllers/survey/add-survey-controller-factory'
import { makeAuthMiddleware } from '../factories/middlewares/auth-middleware-factory'

export default (router: Router): void => {
    const adminAuth = adapterMiddleware(makeAuthMiddleware('admin'))
    router.post('/survey', adminAuth, adapterRoute(makeAddSurveyController()))
}