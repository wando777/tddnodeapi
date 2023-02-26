import { adapterRoute } from '../adapter/express/express-route-adapter'
import { makeSaveSurveyResultController } from '../factories/controllers/survey/save-survey-result/save-survey-result-controller-factory'
import { userAuth } from '../middlewares/auths/user-auth'
import { Router } from 'express'

export default (router: Router): void => {
    router.put('/survey/:surveyId/result', userAuth, adapterRoute(makeSaveSurveyResultController()))
}