import { mockLoadSurveyResultRepository } from '@/data/test/mock-db-load-survey-result'
import { LoadSurveyResultRepository } from './db-load-survey-result-protocols'
import { DbLoadSurveyResult } from './db-load-survey-result'
import { mockSurveyResultModel, throwError } from '@/domain/test'
import MockDate from 'mockdate'

type SutTypes = {
  sut: DbLoadSurveyResult
  loadSurveyResultRepositoryStub: LoadSurveyResultRepository
}

const makeSut = (): SutTypes => {
  const loadSurveyResultRepositoryStub = mockLoadSurveyResultRepository()
  const sut = new DbLoadSurveyResult(loadSurveyResultRepositoryStub)
  return {
    sut,
    loadSurveyResultRepositoryStub
  }
}

describe('DbLoadSurveyResult Usecase', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })
  afterAll(() => {
    MockDate.reset()
  })
  it('Should call LoadSurveyResultRepository ', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()
    const loadBySurveyIdSpy = jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId')
    await sut.load('any_survey_id')
    expect(loadBySurveyIdSpy).toHaveBeenCalledWith('any_survey_id')
  })
  it('Should throw an error if LoadSurveyResultRepository throws', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut();
    jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId').mockImplementationOnce(throwError)
    const accountPromise = sut.load('any_survey_id')
    await expect(accountPromise).rejects.toThrow()
  })
  it('Should return surveyResultModel on success', async () => {
    const { sut } = makeSut();
    const surveyResult = await sut.load('any_survey_id')
    expect(surveyResult).toEqual(mockSurveyResultModel())
  })
})