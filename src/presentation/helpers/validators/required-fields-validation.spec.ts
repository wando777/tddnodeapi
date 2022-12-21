import { MissingParamError } from '../../errors'
import { RequiredFieldValidation } from './requeired-field-validation'

describe('RequiredField Validation', () => {
    it('Should return a MissingParamError if validation fails', () => {
        const fieldName = 'any_field'
        const sut = new RequiredFieldValidation(fieldName)
        const response = sut.validate({ name: 'any_name' })
        expect(response).toEqual(new MissingParamError(fieldName))
    })
    it('Should not return a MissingParamError if validation works', () => {
        const fieldName = 'any_field'
        const sut = new RequiredFieldValidation(fieldName)
        const response = sut.validate({ any_field: 'any_name' })
        expect(response).toBeFalsy()
    })
})