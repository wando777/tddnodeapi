import { InvalidParamError } from '@/presentation/errors'
import { CompareFieldValidation } from './compare-field-validation'

const makeFakeRequest = (): any => {
    return {
        fieldName: 'any_field',
        fieldNameToCompare: 'any_field_to_compare'
    }
}

const makeSut = (): CompareFieldValidation => {
    // injecting a dependecy to our implementation where it should return whats has been mocked.
    return new CompareFieldValidation(makeFakeRequest().fieldName, makeFakeRequest().fieldNameToCompare)
}

describe('CompareField Validation', () => {
    it('Should return a InvalidParamError if validation fails', () => {
        const sut = makeSut()
        const fieldNameToCompare = makeFakeRequest().fieldNameToCompare
        const response = sut.validate({ any_field: 'any_value', any_field_to_compare: 'wrong_value' })
        expect(response).toEqual(new InvalidParamError(fieldNameToCompare))
    })
    it('Should not return an InvalidParamError if validation works', () => {
        const sut = makeSut()
        const response = sut.validate({ any_field: 'any_value', any_field_to_compare: 'any_value' })
        expect(response).toBeFalsy()
    })
})