import { MissingParamError } from '../../errors'
import { RequiredFieldValidation } from './requeired-field-validation'

describe('RequiredField Validation', () => {
    it('Should return a MissingParamError if validation fails', () => {
        const sut = new RequiredFieldValidation('any_field')
        const response = sut.validate({ name: 'any_name' })
        expect(response).toEqual(new MissingParamError('any_field'))
    })
})