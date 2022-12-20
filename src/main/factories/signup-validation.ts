import { CompareFieldValidation } from '../../presentation/helpers/validators/compare-field-validation'
import { RequiredFieldValidation } from '../../presentation/helpers/validators/requeired-field-validation'
import { Validation } from '../../presentation/helpers/validators/validation'
import { ValidationComposite } from '../../presentation/helpers/validators/validation-composite'

export const makeSignUpValidation = (): ValidationComposite => {
    const validations: Validation[] = []
    const fields = ['name', 'email', 'password', 'passwordConfirmation']
    for (const field of fields) {
        validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new CompareFieldValidation(fields[3], fields[4]))
    return new ValidationComposite(validations)
}