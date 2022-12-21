import { MissingParamError } from '../../errors'
import { Validation } from './validation'
import { ValidationComposite } from './validation-composite'

describe('Validation Composite', () => {
    it('Should return an error if any validation fails', () => {
        class ValidationStub implements Validation {
            validate(input: any): Error {
                return new MissingParamError('field')
            }
        }
        const validationStub = new ValidationStub()
        const sut = new ValidationComposite([validationStub])
        const response = sut.validate({ field: 'any_value' })
        expect(response).toEqual(new MissingParamError('field'))
    })
})