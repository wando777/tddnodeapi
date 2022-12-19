import { Authentication } from '../../domain/usecases/authentication'
import { LoginController } from '../controllers/login/login'
import { SignUpController } from '../controllers/singup/signup'
import { AddAccount, EmailValidator, Validation } from '../controllers/singup/signup-protocols'

export interface SutTypes {
    sut: SignUpController
    emailValidatorStub: EmailValidator
    addAccountStub: AddAccount
    validationStub: Validation
}

export interface SutTypesLogin {
    sut: LoginController
    emailValidatorStub: EmailValidator
    authenticationStub: Authentication
}