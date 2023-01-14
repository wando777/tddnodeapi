import { Router } from 'express'
import { adapterRoute } from '../adapter/express/express-route-adapter'
import { makeLoginController } from '../factories/login/login-factory'
import { makeSignUpController } from '../factories/signup/signup-factory'

export default (router: Router): void => {
    router.post('/signup', adapterRoute(makeSignUpController()))

    router.post('/login', adapterRoute(makeLoginController()))
}