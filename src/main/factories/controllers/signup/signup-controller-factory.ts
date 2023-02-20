import { SignUpController } from '@/presentation/controllers/login/singup/signup-controller'
import { Controller } from '@/presentation/protocols'
import { makeLogControllerDecorator } from '../../decorators/log-controller-decorator-factory'
import { makeDbAddAccount } from '../../usecases/add-account/db-add-account-factory'
import { makeDbAuthentication } from '../../usecases/authentication/db-authentication-factory'
import { makeSignUpValidation } from './signup-validation-factory'

export const makeSignUpController = (): Controller => {
    const dbAddAccount = makeDbAddAccount()
    const dbAuthentication = makeDbAuthentication()
    return makeLogControllerDecorator(new SignUpController(dbAddAccount, makeSignUpValidation(), dbAuthentication))
}