import { mockLoadSurveyById, mockLoadSurveyResult } from '@/presentation/test'
import { LoadSurveyResultController } from './load-survey-result-controller'
import { HttpRequest, LoadSurveyById, LoadSurveyResult } from './load-survey-result-controller-protocols'
import { forbidden, ok, serverError } from '@/presentation/helpers/http/http-helper'
import { InvalidParamError } from '@/presentation/errors'
import { mockSurveyResultModel, throwError } from '@/domain/test'
import MockDate from 'mockdate'

const mockRequest = (): HttpRequest => ({
  params: {
    surveyId: 'any_id'
  }
})

type SutTypes = {
  sut: LoadSurveyResultController
  loadSurveyByIdStub: LoadSurveyById
  loadSurveyResultStub: LoadSurveyResult
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdStub = mockLoadSurveyById()
  const loadSurveyResultStub = mockLoadSurveyResult()
  const sut = new LoadSurveyResultController(loadSurveyByIdStub, loadSurveyResultStub)
  return {
    sut,
    loadSurveyByIdStub,
    loadSurveyResultStub
  }
}

describe('LoadSurveyResult Controller', () => {
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
  // it('Should returns 404 if LoadSurveyById returns null', async () => {
  //   const { sut, loadSurveyByIdStub } = makeSut()
  //   jest.spyOn(loadSurveyByIdStub, 'loadById').mockReturnValueOnce(Promise.resolve(null))
  //   const httpresponse = await sut.handle(mockRequest())
  //   expect(httpresponse).toEqual(notFound(new InvalidParamError('Survey not found')))
  // })
  it('Should returns 403 if LoadSurveyById returns null', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockReturnValueOnce(Promise.resolve(null))
    const httpresponse = await sut.handle(mockRequest())
    expect(httpresponse).toEqual(forbidden(new InvalidParamError('Survey not found')))
  })
  it('Should return 500 if LoadSurveyById throws', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockImplementationOnce(throwError)
    const httpresponse = await sut.handle(mockRequest())
    expect(httpresponse).toEqual(serverError(new Error()))
  })
  it('Should call LoadSurveyResult with correct values', async () => {
    const { sut, loadSurveyResultStub } = makeSut()
    const loadSpy = jest.spyOn(loadSurveyResultStub, 'load')
    await sut.handle(mockRequest())
    expect(loadSpy).toHaveBeenCalledWith(mockRequest().params.surveyId)
  })
  it('Should return 500 if LoadSurveyResult throws', async () => {
    const { sut, loadSurveyResultStub } = makeSut()
    jest.spyOn(loadSurveyResultStub, 'load').mockImplementationOnce(throwError)
    const httpresponse = await sut.handle(mockRequest())
    expect(httpresponse).toEqual(serverError(new Error()))
  })
  it('Should return 200 on success', async () => {
    const { sut } = makeSut()
    const httpresponse = await sut.handle(mockRequest())
    expect(httpresponse).toEqual(ok(mockSurveyResultModel()))
  })
})