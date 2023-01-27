import { Router } from 'express'
import { adapterRoute } from '../adapter/express/express-route-adapter'
import { makeLoginController } from '../factories/controllers/login/login-controller-factory'
import { makeSignUpController } from '../factories/controllers/signup/signup-controller-factory'

export default (router: Router): void => {
    router.post('/signup', adapterRoute(makeSignUpController()))
    router.post('/login', adapterRoute(makeLoginController()))
}