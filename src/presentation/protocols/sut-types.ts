import { Validation } from './validation'
import { LoginController } from '../controllers/login/login/login-controller'
import { Authentication } from '../controllers/login/login/login-controller-protocols'
import { SignUpController } from '../controllers/login/singup/signup-controller'
import { AddAccount } from '../controllers/login/singup/signup-controller-protocols'
import { EmailValidator } from '@/validation/protocols/email-validator'
import { EmailValidation, ValidationComposite } from '@/validation/validators'

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