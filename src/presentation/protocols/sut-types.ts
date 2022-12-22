import { Authentication } from '../../domain/usecases/authentication'
import { LoginController } from '../controllers/login/login'
import { SignUpController } from '../controllers/singup/signup'
import { AddAccount, EmailValidator, Validation } from '../controllers/singup/signup-protocols'
import { EmailValidation } from '../helpers/validators/email-validation'
import { ValidationComposite } from '../helpers/validators/validation-composite'

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

export interface SutTypesEmailValidation {
    sut: EmailValidation
    emailValidatorStub: EmailValidator
}

export interface SutTypesValidation {
    sut: ValidationComposite
    validationStubs: Validation[]
}