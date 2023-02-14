import { SutTypes } from './sut-types-add-survey'
import { AddSurvey, AddSurveyModel, HttpRequest, Validation } from './add-survey-controller-protocols';
import { AddSurveyController } from './add-survey-controller'
import { badRequest, created, serverError } from '../../../helpers/http/http-helper';
import MockDate from 'mockdate'

const makeFakeRequest = (): HttpRequest => ({
   body: {
      question: 'any_question',
      answers: [{
         image: 'any_image',
         answer: 'any_answer'
      }],
      date: new Date()
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

const makeAddSurvey = (): AddSurvey => {
   class AddSurveynStub implements AddSurvey {
      async add(input: AddSurveyModel): Promise<void> {
         return await new Promise(resolve => resolve())
      }
   }
   return new AddSurveynStub()
}

const makeSut = (): SutTypes => {
   const addSurveyStub = makeAddSurvey()
   const validationStub = makeValidation()
   const sut = new AddSurveyController(validationStub, addSurveyStub)
   return {
      sut,
      validationStub,
      addSurveyStub
   }
}

describe('AddSurvey Controller', () => {
   beforeAll(() => {
      MockDate.set(new Date())
   })
   afterAll(() => {
      MockDate.reset()
   })
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
   it('Should call AddSurvey use case with correct values', async () => {
      const { sut, addSurveyStub } = makeSut()
      const addSpy = jest.spyOn(addSurveyStub, 'add')
      await sut.handle(makeFakeRequest())
      expect(addSpy).toHaveBeenCalledWith(makeFakeRequest().body)
   })
   it('Should throw server error if AddSurvey throws', async () => {
      const { sut, addSurveyStub } = makeSut()
      jest.spyOn(addSurveyStub, 'add').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
      const httpresponse = await sut.handle(makeFakeRequest())
      expect(httpresponse).toEqual(serverError(new Error()))
   })
   it('Should return 204 on success', async () => {
      const { sut } = makeSut()
      const httpresponse = await sut.handle(makeFakeRequest())
      expect(httpresponse).toEqual(created())
   })
})