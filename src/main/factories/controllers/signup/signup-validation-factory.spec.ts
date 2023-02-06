import { Validation } from '../../../../presentation/protocols'
import { makeSignUpValidation } from './signup-validation-factory'
import { EmailValidator } from '../../../../validation/protocols/email-validator'
import { RequiredFieldValidation, CompareFieldValidation, EmailValidation, ValidationComposite } from '../../../../validation/validators'

jest.mock('../../../../validation/validators/validation-composite')
const makeEmailValidator = (): EmailValidator => {
    // this is a mock response for testing valid parameters
    class EmailValidatorStub implements EmailValidator {
        isValid(email: string): boolean {
            return true
        }
    }
    return new EmailValidatorStub()
}

describe('SignUPValidation Factory', () => {
    it('Should call ValidationComposite with all validations', () => {
        makeSignUpValidation()
        const validations: Validation[] = []
        const fields = ['name', 'email', 'password', 'passwordConfirmation']
        for (const field of fields) {
            validations.push(new RequiredFieldValidation(field))
        }
        validations.push(new CompareFieldValidation(fields[2], fields[3]))
        validations.push(new EmailValidation('email', makeEmailValidator()))
        expect(ValidationComposite).toHaveBeenCalledWith(validations)
    })
})