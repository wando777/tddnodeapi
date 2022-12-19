import { RequiredFieldValidation } from '../../presentation/helpers/validators/requeired-field-validation'
import { Validation } from '../../presentation/helpers/validators/validation'
import { ValidationComposite } from '../../presentation/helpers/validators/validation-composite'

export const makeSignUpValidation = (): ValidationComposite => {
    const validations: Validation[] = []
    const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
    for (const field of requiredFields) {
        validations.push(new RequiredFieldValidation(field))
    }
    return new ValidationComposite(validations)
}