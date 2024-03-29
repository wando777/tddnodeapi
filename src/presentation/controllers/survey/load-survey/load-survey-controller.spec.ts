import { LoadSurvey } from './load-survey-controller-protocols';
import { LoadSurveyController } from './load-survey-controller'
import { serverError, created, ok } from '@/presentation/helpers/http/http-helper';
import MockDate from 'mockdate'
import { mockListSurveyModel, throwError } from '@/domain/test';
import { mockLoadSurvey } from '@/presentation/test';

export type SutTypes = {
   sut: LoadSurveyController
   loadSurveyStub: LoadSurvey
}

const makeSut = (): SutTypes => {
   const loadSurveyStub = mockLoadSurvey()
   const sut = new LoadSurveyController(loadSurveyStub)
   return {
      sut,
      loadSurveyStub
   }
}

describe('LoadSurvey Controller', () => {
   beforeAll(() => {
      MockDate.set(new Date())
   })
   afterAll(() => {
      MockDate.reset()
   })
   it('Should call LoadSurvey', async () => {
      const { sut, loadSurveyStub } = makeSut()
      const loadSpy = jest.spyOn(loadSurveyStub, 'load')
      await sut.handle({})
      expect(loadSpy).toHaveBeenCalled()
   })
   it('Should throw server error if AddSurvey throws', async () => {
      const { sut, loadSurveyStub } = makeSut()
      jest.spyOn(loadSurveyStub, 'load').mockImplementationOnce(throwError)
      const httpresponse = await sut.handle({})
      expect(httpresponse).toEqual(serverError(new Error()))
   })
   it('Should return 200 on LoadSurvey success', async () => {
      const { sut } = makeSut()
      const httpresponse = await sut.handle({})
      expect(httpresponse).toEqual(ok(mockListSurveyModel()))
   })
   it('Should return 204 on LoadSurvey success with no content', async () => {
      const { sut, loadSurveyStub } = makeSut()
      // const loadSpy = jest.spyOn(loadSurveyStub, 'load') as unknown as jest.Mock<
      //    ReturnType<(key: null) => Promise<null>>,
      //    Parameters<(key: null) => Promise<null>>
      // >
      // loadSpy.mockReturnValueOnce(new Promise(_resolve => _resolve(null)))
      jest.spyOn(loadSurveyStub, 'load').mockReturnValueOnce(Promise.resolve([]))
      // jest.spyOn(loadSurveyStub, 'load').mockImplementationOnce(throwError)
      const httpresponse = await sut.handle({})
      expect(httpresponse).toEqual(created())
   })
})