import { MissingParamError } from '../../errors'
import { SutTypesValidation } from '../../protocols'
import { Validation } from './validation'
import { ValidationComposite } from './validation-composite'

const makeValidationStub = (): Validation => {
    class ValidationStub implements Validation {
        validate(input: any): Error {
            return null
        }
    }
    return new ValidationStub()
}

const makeSut = (): SutTypesValidation => {
    const validationStub = makeValidationStub()
    const sut = new ValidationComposite([validationStub])
    return {
        sut,
        validationStub
    }
}

describe('Validation Composite', () => {
    it('Should return an error if any validation fails', () => {
        const { sut, validationStub } = makeSut()
        jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('field'))
        const response = sut.validate({ field: 'any_value' })
        expect(response).toEqual(new MissingParamError('field'))
    })
})