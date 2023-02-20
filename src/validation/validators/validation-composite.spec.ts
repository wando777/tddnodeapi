import { MissingParamError } from '@/presentation/errors'
import { SutTypesValidation } from '@/presentation/protocols/sut-types'
import { Validation } from '@/presentation/protocols'
import { ValidationComposite } from './validation-composite'

const makeValidation = (): Validation => {
    class ValidationStub implements Validation {
        validate(input: any): any {
            return null
        }
    }
    return new ValidationStub()
}

const makeSut = (): SutTypesValidation => {
    const validationStubs = [makeValidation(), makeValidation()]
    const sut = new ValidationComposite(validationStubs)
    return {
        sut,
        validationStubs
    }
}

describe('Validation Composite', () => {
    it('Should return an error if any validation fails', () => {
        const { sut, validationStubs } = makeSut()
        jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(new MissingParamError('field'))
        const response = sut.validate({ field: 'any_value' })
        expect(response).toEqual(new MissingParamError('field'))
    })
    it('Should return the very first error if more than one validation fails', () => {
        const { sut, validationStubs } = makeSut()
        jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(new Error())
        jest.spyOn(validationStubs[1], 'validate').mockReturnValueOnce(new MissingParamError('field'))
        const response = sut.validate({ field: 'any_value' })
        expect(response).toEqual(new Error())
    })
    it('Should not return an error if validation works', () => {
        const { sut } = makeSut()
        const response = sut.validate({ field: 'any_value' })
        expect(response).toBeFalsy()
    })
})