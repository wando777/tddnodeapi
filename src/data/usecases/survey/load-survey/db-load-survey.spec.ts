import { DbLoadSurvey } from './db-load-survey'
import MockDate from 'mockdate'
import { LoadSurveyRepository } from './db-load-survey-protocols'
import { mockListSurveyModel, throwError } from '@/domain/test'
import { mockLoadSurveyRepository } from '@/data/test'

export type SutTypes = {
  sut: DbLoadSurvey
  loadSurveyRepositoryStub: LoadSurveyRepository
}

const makeSut = (): SutTypes => {
  const loadSurveyRepositoryStub = mockLoadSurveyRepository()
  const sut = new DbLoadSurvey(loadSurveyRepositoryStub)
  return {
    sut,
    loadSurveyRepositoryStub
  }
}

describe('DbLoadSurvey Usecase', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })
  afterAll(() => {
    MockDate.reset()
  })
  it('Should call LoadSurveyRepository', async () => {
    const { sut, loadSurveyRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadSurveyRepositoryStub, 'loadAll')
    await sut.load()
    expect(loadSpy).toHaveBeenCalled()
  })
  it('Should return a list of Surveys on success', async () => {
    const { sut } = makeSut()
    const surveyResponse = await sut.load()
    expect(surveyResponse).toEqual(mockListSurveyModel())
  })
  it('Should throw an error if AddSurveyRepository throws', async () => {
    const { sut, loadSurveyRepositoryStub } = makeSut();
    jest.spyOn(loadSurveyRepositoryStub, 'loadAll').mockImplementationOnce(throwError)
    const promise = sut.load()
    await expect(promise).rejects.toThrow()
  })
})