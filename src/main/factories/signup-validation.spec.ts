import { CompareFieldValidation } from '../../presentation/helpers/validators/compare-field-validation'
import { RequiredFieldValidation } from '../../presentation/helpers/validators/requeired-field-validation'
import { Validation } from '../../presentation/helpers/validators/validation'
import { ValidationComposite } from '../../presentation/helpers/validators/validation-composite'
import { makeSignUpValidation } from './signup-validation'

jest.mock('../../presentation/helpers/validators/validation-composite')

describe('SignUPValidation Factory', () => {
    it('Should ValidationComposite with all validations', () => {
        makeSignUpValidation()
        const validations: Validation[] = []
        const fields = ['name', 'email', 'password', 'passwordConfirmation']
        for (const field of fields) {
            validations.push(new RequiredFieldValidation(field))
        }
        validations.push(new CompareFieldValidation(fields[3], fields[4]))
        expect(ValidationComposite).toHaveBeenCalledWith(validations)
    })
})