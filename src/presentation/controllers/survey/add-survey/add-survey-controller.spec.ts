import { SutTypes } from './sut-types-add-survey'
import { HttpRequest } from './add-survey-controller-protocols';
import { AddSurveyController } from './add-survey-controller'
import { throwError } from '@/domain/test';
import { mockValidation } from '@/validation/test';
import { mockAddSurvey } from '@/presentation/test';
import { badRequest, created, serverError } from '@/presentation/helpers/http/http-helper';
import MockDate from 'mockdate'

const mockRequest = (): HttpRequest => ({
   body: {
      question: 'any_question',
      answers: [{
         image: 'any_image',
         answer: 'any_answer'
      }],
      date: new Date()
   }
})

const makeSut = (): SutTypes => {
   const addSurveyStub = mockAddSurvey()
   const validationStub = mockValidation()
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
      await sut.handle(mockRequest())
      expect(validateSpy).toHaveBeenCalledWith(mockRequest().body)
   })
   it('Should return 400 validation fails', async () => {
      const { sut, validationStub } = makeSut()
      jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error())
      const httpresponse = await sut.handle(mockRequest())
      expect(httpresponse).toEqual(badRequest(new Error()))
   })
   it('Should call AddSurvey use case with correct values', async () => {
      const { sut, addSurveyStub } = makeSut()
      const addSpy = jest.spyOn(addSurveyStub, 'add')
      await sut.handle(mockRequest())
      expect(addSpy).toHaveBeenCalledWith(mockRequest().body)
   })
   it('Should throw server error if AddSurvey throws', async () => {
      const { sut, addSurveyStub } = makeSut()
      jest.spyOn(addSurveyStub, 'add').mockImplementationOnce(throwError)
      const httpresponse = await sut.handle(mockRequest())
      expect(httpresponse).toEqual(serverError(new Error()))
   })
   it('Should return 204 on success', async () => {
      const { sut } = makeSut()
      const httpresponse = await sut.handle(mockRequest())
      expect(httpresponse).toEqual(created())
   })
})