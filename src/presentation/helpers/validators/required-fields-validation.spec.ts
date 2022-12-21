import { MissingParamError } from '../../errors'
import { RequiredFieldValidation } from './requeired-field-validation'

const makeFakeRequest = (): string => {
    const fieldName = 'any_field'
    return fieldName
}

const makeSut = (): RequiredFieldValidation => {
    // injecting a dependecy to our implementation where it should return whats has been mocked.
    return new RequiredFieldValidation(makeFakeRequest())
}

describe('RequiredField Validation', () => { 
    it('Should return a MissingParamError if validation fails', () => {
        const sut = makeSut()
        const response = sut.validate({ name: 'any_name' })
        expect(response).toEqual(new MissingParamError(makeFakeRequest()))
    })
    it('Should not return a MissingParamError if validation works', () => {
        const sut = makeSut()
        const response = sut.validate({ any_field: 'any_name' })
        expect(response).toBeFalsy()
    })
})