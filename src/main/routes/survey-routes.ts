import { Router } from 'express'
import { adapterMiddleware } from '../adapter/express/express-middleware-adapter'
import { adapterRoute } from '../adapter/express/express-route-adapter'
import { makeAddSurveyController } from '../factories/controllers/survey/add-survey/add-survey-controller-factory'
import { makeLoadSurveyController } from '../factories/controllers/survey/load-survey/load-survey-controller-factory'
import { makeAuthMiddleware } from '../factories/middlewares/auth-middleware-factory'

export default (router: Router): void => {
    const adminAuth = adapterMiddleware(makeAuthMiddleware('admin'))
    const auth = adapterMiddleware(makeAuthMiddleware('user'))
    router.post('/survey', adminAuth, adapterRoute(makeAddSurveyController()))
    router.get('/survey', auth, adapterRoute(makeLoadSurveyController()))
}