import { Validation } from '../../../../../presentation/protocols'
import { RequiredFieldValidation, ValidationComposite } from '../../../../../validation/validators'
import { makeAddSurveyValidation } from './add-survey-validation-factory'

jest.mock('../../../../../validation/validators/validation-composite')

describe('AddSurveyValidation Factory', () => {
    it('Should call ValidationComposite with all validations', () => {
        makeAddSurveyValidation()
        const validations: Validation[] = []
        const fields = ['question', 'answers']
        for (const field of fields) {
            validations.push(new RequiredFieldValidation(field))
        }
        expect(ValidationComposite).toHaveBeenCalledWith(validations)
    })
})