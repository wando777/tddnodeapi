import { Router } from 'express'
import { adapterRoute } from '../adapter/express/express-route-adapter'
import { makeAddSurveyController } from '../factories/controllers/survey/add-survey/add-survey-controller-factory'
import { makeLoadSurveyController } from '../factories/controllers/survey/load-survey/load-survey-controller-factory'
import { adminAuth } from '../middlewares/auths/admin-auth'
import { userAuth } from '../middlewares/auths/user-auth'

export default (router: Router): void => {
    router.post('/survey', adminAuth, adapterRoute(makeAddSurveyController()))
    router.get('/survey', userAuth, adapterRoute(makeLoadSurveyController()))
}