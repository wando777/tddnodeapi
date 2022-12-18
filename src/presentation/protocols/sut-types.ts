import { AddAccount } from '../../domain/usecases/add-account'
import { Authentication } from '../../domain/usecases/authentication'
import { LoginController } from '../controllers/login/login'
import { SignUpController } from '../controllers/singup/signup'
import { EmailValidator } from './email-validator'

export interface SutTypes {
    sut: SignUpController
    emailValidatorStub: EmailValidator
    addAccountStub: AddAccount
}

export interface SutTypesLogin {
    sut: LoginController
    emailValidatorStub: EmailValidator
    authenticationStub: Authentication
}