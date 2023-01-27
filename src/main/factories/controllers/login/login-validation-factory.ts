import { Validation } from '../../../../presentation/protocols/validation'
import { EmailValidation, RequiredFieldValidation, ValidationComposite } from '../../../../presentation/helpers/validators'
import { EmailValidatorAdapter } from '../../../adapter/validators/email-validator-adapter'

export const makeLoginValidation = (): ValidationComposite => {
    const validations: Validation[] = []
    const fields = ['email', 'password']
    for (const field of fields) {
        validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new EmailValidation('email', new EmailValidatorAdapter()))
    return new ValidationComposite(validations)
}