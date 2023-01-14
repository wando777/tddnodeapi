import { Router } from 'express'
import { makeSignUpController } from '../factories/signup/signup-factory'
import { adapterRoute } from '../adapter/express-route-adapter'

export default (router: Router): void => {
    router.post('/signup', adapterRoute(makeSignUpController()))
}