import { InvalidParamError } from '@/presentation/errors'
import { badRequest, notFound, ok, serverError } from '@/presentation/helpers/http/http-helper'
import { SaveSurveyResultController } from './save-survey-result-controller'
import { HttpRequest, SaveSurveyResult, LoadSurveyById } from './save-survey-result-controller-protocols'
import { mockSurveyResultModel, throwError } from '@/domain/test'
import { mockLoadSurveyById, mockSaveSurveyResult } from '@/presentation/test'
import MockDate from 'mockdate'

const mockRequest = (): HttpRequest => ({
  body: {
    answer: 'any_answer',
    date: new Date()
  },
  params: {
    surveyId: 'any_surveyId'
  },
  userId: 'any_userId'
})

type SutTypes = {
  sut: SaveSurveyResultController
  loadSurveyByIdStub: LoadSurveyById
  saveSurveyResultStub: SaveSurveyResult
}

const makeSut = (): SutTypes => {
  const saveSurveyResultStub = mockSaveSurveyResult()
  const loadSurveyByIdStub = mockLoadSurveyById()
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
    await sut.handle(mockRequest())
    expect(loadByIdSpy).toHaveBeenCalledWith(mockRequest().params.surveyId)
  })
  it('Should returns 404 if LoadSurveyById returns null', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockReturnValueOnce(new Promise(resolve => resolve(null)))
    const httpresponse = await sut.handle(mockRequest())
    expect(httpresponse).toEqual(notFound(new InvalidParamError('Survey not found')))
  })
  it('Should return 500 if LoadSurveyById throws', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockImplementationOnce(throwError)
    const httpresponse = await sut.handle(mockRequest())
    expect(httpresponse).toEqual(serverError(new Error()))
  })
  it('Should returns 400 if an invalid answer is provided', async () => {
    const { sut } = makeSut()
    const mockRequestWithInvalidAnswer = mockRequest()
    mockRequestWithInvalidAnswer.body.answer = 'invalid_answer'
    const httpresponse = await sut.handle(mockRequestWithInvalidAnswer)
    expect(httpresponse).toEqual(badRequest(new InvalidParamError('invalid answer')))
    // expect(httpresponse).toEqual(mockRequest())
  })
  it('Should call SaveSurvey use case with correct values', async () => {
    const { sut, saveSurveyResultStub } = makeSut()
    const saveSurveySpy = jest.spyOn(saveSurveyResultStub, 'save')
    await sut.handle(mockRequest())
    const { id, ...makeFakeSaveSurveyResult } = mockSurveyResultModel()
    expect(saveSurveySpy).toHaveBeenCalledWith(makeFakeSaveSurveyResult)
  })
  it('Should return 500 if SaveSurveyResult throws', async () => {
    const { sut, saveSurveyResultStub } = makeSut()
    jest.spyOn(saveSurveyResultStub, 'save').mockImplementationOnce(throwError)
    const httpresponse = await sut.handle(mockRequest())
    expect(httpresponse).toEqual(serverError(new Error()))
  })
  it('Should return 200 on success', async () => {
    const { sut } = makeSut()
    const httpresponse = await sut.handle(mockRequest())
    expect(httpresponse).toEqual(ok(mockSurveyResultModel()))
  })
})