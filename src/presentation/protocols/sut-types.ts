import { Authentication } from '../../domain/usecases/authentication'
import { EmailValidation } from '../../validation/validators/email-validation'
import { ValidationComposite } from '../../validation/validators/validation-composite'
import { EmailValidator } from '../../validation/protocols/email-validator'
import { SignUpController } from '../controllers/login/singup/signup-controller'
import { AddAccount } from '../../domain/usecases/add-account'
import { LoginController } from '../controllers/login/login/login-controller'
import { Validation } from './validation'

export interface SutTypes {
    sut: SignUpController
    addAccountStub: AddAccount
    validationStub: Validation
    authenticationStub: Authentication
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