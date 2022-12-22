import { Authentication } from '../../domain/usecases/authentication'
import { LoginController } from '../controllers/login/login'
import { SignUpController } from '../controllers/singup/signup'
import { AddAccount, Validation } from '../controllers/singup/signup-protocols'
import { EmailValidation } from '../helpers/validators/email-validation'
import { ValidationComposite } from '../helpers/validators/validation-composite'
import { EmailValidator } from './email-validator'

export interface SutTypes {
    sut: SignUpController
    addAccountStub: AddAccount
    validationStub: Validation
}

export interface SutTypesLogin {
    sut: LoginController
    authenticationStub: Authentication
    validationStub: Validation
}

export interface SutTypesEmailValidation {
    sut: EmailValidation
    emailValidatorStub: EmailValidator
}

export interface SutTypesValidation {
    sut: ValidationComposite
    validationStubs: Validation[]
}