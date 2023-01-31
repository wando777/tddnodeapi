import { Validation } from '../../../../presentation/protocols/validation'
import { ValidationComposite, RequiredFieldValidation, CompareFieldValidation, EmailValidation } from '../../../../validation/validators'
import { EmailValidatorAdapter } from '../../../../infra/validators/email-validator-adapter'

export const makeSignUpValidation = (): ValidationComposite => {
    const validations: Validation[] = []
    const fields = ['name', 'email', 'password', 'passwordConfirmation']
    for (const field of fields) {
        validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new CompareFieldValidation(fields[2], fields[3]))
    validations.push(new EmailValidation('email', new EmailValidatorAdapter()))
    return new ValidationComposite(validations)
}