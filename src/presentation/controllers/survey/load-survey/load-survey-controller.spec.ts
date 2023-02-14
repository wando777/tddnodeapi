import { LoadSurvey, SurveyModel } from './load-survey-controller-protocols';
import { LoadSurveyController } from './load-survey-controller'

const makeFakeSurveys = (): SurveyModel[] => [{
   id: 'any_id',
   question: 'any_question',
   answers: [{
      image: 'any_image',
      answer: 'any_answer'
   }],
   date: new Date()
}]

const makeLoadSurvey = (): LoadSurvey => {
   class LoadSurveyStub implements LoadSurvey {
      async load(): Promise<SurveyModel[]> {
         return await new Promise(resolve => resolve(makeFakeSurveys()))
      }
   }
   return new LoadSurveyStub()
}

const makeSut = (): any => {
   const loadSurveyStub = makeLoadSurvey()
   const sut = new LoadSurveyController(loadSurveyStub)
   return {
      sut,
      loadSurveyStub
   }
}

describe('LoadSurvey Controller', () => {
   // beforeAll(() => {
   //    MockDate.set(new Date())
   // })
   // afterAll(() => {
   //    MockDate.reset()
   // })
   it('Should call LoadSurvey', async () => {
      const { sut, loadSurveyStub } = makeSut()
      const loadSpy = jest.spyOn(loadSurveyStub, 'load')
      await sut.handle({})
      expect(loadSpy).toHaveBeenCalled()
   })
   // it('Should return 400 validation fails', async () => {
   //    const { sut, validationStub } = makeSut()
   //    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error())
   //    const httpresponse = await sut.handle(makeFakeRequest())
   //    expect(httpresponse).toEqual(badRequest(new Error()))
   // })
   // it('Should call AddSurvey use case with correct values', async () => {
   //    const { sut, addSurveyStub } = makeSut()
   //    const addSpy = jest.spyOn(addSurveyStub, 'add')
   //    await sut.handle(makeFakeRequest())
   //    expect(addSpy).toHaveBeenCalledWith(makeFakeRequest().body)
   // })
   // it('Should throw server error if AddSurvey throws', async () => {
   //    const { sut, addSurveyStub } = makeSut()
   //    jest.spyOn(addSurveyStub, 'add').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
   //    const httpresponse = await sut.handle(makeFakeRequest())
   //    expect(httpresponse).toEqual(serverError(new Error()))
   // })
   // it('Should return 204 on success', async () => {
   //    const { sut } = makeSut()
   //    const httpresponse = await sut.handle(makeFakeRequest())
   //    expect(httpresponse).toEqual(created())
   // })
})