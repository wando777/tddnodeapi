import { SurveyResultModel } from '@/domain/models/survey-result'
import { InvalidParamError } from '@/presentation/errors'
import { badRequest, notFound, ok, serverError } from '@/presentation/helpers/http/http-helper'
import { SaveSurveyResultController } from './save-survey-result-controller'
import { HttpRequest, SaveSurveyResult, SaveSurveyResultParams, LoadSurveyById } from './save-survey-result-controller-protocols'
import { SurveyModel } from '@/domain/models/survey'
import MockDate from 'mockdate'
import { throwError } from '@/domain/test'

const makeFakeRequest = (): HttpRequest => ({
  body: {
    answer: 'any_answer',
    date: new Date()
  },
  params: {
    surveyId: 'any_surveyId'
  },
  userId: 'any_userId'
})

const makeFakeSurvey = (): SurveyModel => ({
  id: 'any_id',
  question: 'any_question',
  answers: [{
    image: 'any_image',
    answer: 'any_answer'
  }],
  date: new Date()
})

const makeFakeSurveyResult = (): SurveyResultModel => ({
  id: 'any_id',
  surveyId: 'any_surveyId',
  userId: 'any_userId',
  answer: 'any_answer',
  date: new Date()
})

// const makeValidation = (): Validation => {
//   class ValidationStub implements Validation {
//     validate(input: any): any {
//       return null
//     }
//   }
//   return new ValidationStub()
// }

const makeSaveSurveyResult = (): SaveSurveyResult => {
  class SaveSurveyResultStub implements SaveSurveyResult {
    async save(input: SaveSurveyResultParams): Promise<SurveyResultModel> {
      return await new Promise(resolve => resolve(makeFakeSurveyResult()))
    }
  }
  return new SaveSurveyResultStub()
}

const makeLoadSurveyById = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    async loadById(id: string): Promise<SurveyModel> {
      return await new Promise(resolve => resolve(makeFakeSurvey()))
    }
  }
  return new LoadSurveyByIdStub()
}

type SutTypes = {
  sut: SaveSurveyResultController
  loadSurveyByIdStub: LoadSurveyById
  saveSurveyResultStub: SaveSurveyResult
}

const makeSut = (): SutTypes => {
  const saveSurveyResultStub = makeSaveSurveyResult()
  // const validationStub = makeValidation()
  const loadSurveyByIdStub = makeLoadSurveyById()
  const sut = new SaveSurveyResultController(loadSurveyByIdStub, saveSurveyResultStub)
  return {
    sut,
    loadSurveyByIdStub,
    saveSurveyResultStub
  }
}

describe('SaveSurveyResult Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })
  afterAll(() => {
    MockDate.reset()
  })
  it('Should call LoadSurveyById with correct values', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    const loadByIdSpy = jest.spyOn(loadSurveyByIdStub, 'loadById')
    await sut.handle(makeFakeRequest())
    expect(loadByIdSpy).toHaveBeenCalledWith(makeFakeRequest().params.surveyId)
  })
  it('Should returns 404 if LoadSurveyById returns null', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockReturnValueOnce(new Promise(resolve => resolve(null)))
    const httpresponse = await sut.handle(makeFakeRequest())
    expect(httpresponse).toEqual(notFound(new InvalidParamError('Survey not found')))
  })
  it('Should return 500 if LoadSurveyById throws', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockImplementationOnce(throwError)
    const httpresponse = await sut.handle(makeFakeRequest())
    expect(httpresponse).toEqual(serverError(new Error()))
  })
  it('Should returns 400 if an invalid answer is provided', async () => {
    const { sut } = makeSut()
    const makeFakeRequestWithInvalidAnswer = makeFakeRequest()
    makeFakeRequestWithInvalidAnswer.body.answer = 'invalid_answer'
    const httpresponse = await sut.handle(makeFakeRequestWithInvalidAnswer)
    expect(httpresponse).toEqual(badRequest(new InvalidParamError('invalid answer')))
    // expect(httpresponse).toEqual(makeFakeRequest())
  })
  it('Should call SaveSurvey use case with correct values', async () => {
    const { sut, saveSurveyResultStub } = makeSut()
    const saveSurveySpy = jest.spyOn(saveSurveyResultStub, 'save')
    await sut.handle(makeFakeRequest())
    const { id, ...makeFakeSaveSurveyResult } = makeFakeSurveyResult()
    expect(saveSurveySpy).toHaveBeenCalledWith(makeFakeSaveSurveyResult)
  })
  it('Should return 500 if SaveSurveyResult throws', async () => {
    const { sut, saveSurveyResultStub } = makeSut()
    jest.spyOn(saveSurveyResultStub, 'save').mockImplementationOnce(throwError)
    const httpresponse = await sut.handle(makeFakeRequest())
    expect(httpresponse).toEqual(serverError(new Error()))
  })
  it('Should return 200 on success', async () => {
    const { sut } = makeSut()
    const httpresponse = await sut.handle(makeFakeRequest())
    expect(httpresponse).toEqual(ok(makeFakeSurveyResult()))
  })
  // it('Should call Validation with correct values', async () => {
  //   const { sut, validationStub } = makeSut()
  //   const validateSpy = jest.spyOn(validationStub, 'validate')
  //   await sut.handle(makeFakeRequest())
  //   expect(validateSpy).toHaveBeenCalledWith(makeFakeRequest().body)
  // })
  // it('Should return 400 validation fails', async () => {
  //   const { sut, validationStub } = makeSut()
  //   jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error())
  //   const httpresponse = await sut.handle(makeFakeRequest())
  //   expect(httpresponse).toEqual(badRequest(new Error()))
  // })
})