import { SutTypes } from './sut-types-add-survey'
import { HttpRequest, Validation } from './add-survey-controller-protocols';
import { AddSurveyController } from './add-survey-controller'
import { badRequest } from '../../../helpers/http/http-helper';

const makeFakeRequest = (): HttpRequest => ({
   body: {
      question: 'any_question',
      answers: [{
         image: 'any_image',
         answer: 'any_answer'
      }]
   }
})

const makeValidation = (): Validation => {
   class ValidationStub implements Validation {
      validate(input: any): any {
         return null
      }
   }
   return new ValidationStub()
}

const makeSut = (): SutTypes => {
   const validationStub = makeValidation()
   const sut = new AddSurveyController(validationStub)
   return {
      sut,
      validationStub
   }
}

describe('AddSurvey Controller', () => {
   it('Should call Validation with correct values', async () => {
      const { sut, validationStub } = makeSut()
      const validateSpy = jest.spyOn(validationStub, 'validate')
      await sut.handle(makeFakeRequest())
      expect(validateSpy).toHaveBeenCalledWith(makeFakeRequest().body)
   })
   it('Should return 400 validation fails', async () => {
      const { sut, validationStub } = makeSut()
      jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error())
      const httpresponse = await sut.handle(makeFakeRequest())
      expect(httpresponse).toEqual(badRequest(new Error()))
   })
})