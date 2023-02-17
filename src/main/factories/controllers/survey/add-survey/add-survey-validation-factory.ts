import { Validation } from '../../../../../presentation/protocols/validation'
import { ValidationComposite, RequiredFieldValidation } from '../../../../../validation/validators'

export const makeAddSurveyValidation = (): ValidationComposite => {
    const validations: Validation[] = []
    const fields = ['question', 'answers']
    for (const field of fields) {
        validations.push(new RequiredFieldValidation(field))
    }
    return new ValidationComposite(validations)
}