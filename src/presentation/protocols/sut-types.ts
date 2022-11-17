import { SignUpController } from '../controllers/signup'
import { EmailValidator } from './email-validator'

export interface SutTypes {
    sut: SignUpController
    emailValidatorStub: EmailValidator
}