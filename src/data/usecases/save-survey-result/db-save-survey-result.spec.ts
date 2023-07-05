import { DbSaveSurveyResult } from './db-save-survey-result'
import { LoadSurveyResultRepository, SaveSurveyResultRepository } from './db-save-survey-result-protocols'
import { mockSaveSurveyResultParams, mockSurveyResultModel, throwError } from '@/domain/test'
import MockDate from 'mockdate'
import { mockLoadSurveyResultRepository, mockSaveSurveyResultRepository } from '@/data/test'

type SutTypes = {
  sut: DbSaveSurveyResult
  saveSurveyResultRepositoryStub: SaveSurveyResultRepository
  loadSurveyResultRepositoryStub: LoadSurveyResultRepository
}

const makeSut = (): SutTypes => {
  const saveSurveyResultRepositoryStub = mockSaveSurveyResultRepository()
  const loadSurveyResultRepositoryStub = mockLoadSurveyResultRepository()
  const sut = new DbSaveSurveyResult(saveSurveyResultRepositoryStub, loadSurveyResultRepositoryStub)
  return {
    sut,
    saveSurveyResultRepositoryStub,
    loadSurveyResultRepositoryStub
  }
}

describe('DbSaveSurveyResult Usecase', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })
  afterAll(() => {
    MockDate.reset()
  })
  it('Should call SaveSurveyResultRepository with correct values', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut()
    const saveSpy = jest.spyOn(saveSurveyResultRepositoryStub, 'saveResult')
    await sut.save(mockSaveSurveyResultParams())
    expect(saveSpy).toHaveBeenCalledWith(mockSaveSurveyResultParams())
  })
  it('Should return a SurveyResult on success', async () => {
    const { sut } = makeSut()
    const surveyResponse = await sut.save(mockSaveSurveyResultParams())
    expect(surveyResponse).toEqual(mockSurveyResultModel())
  })
  it('Should throw an error if SaveSurveyResultRepository throws', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut();
    jest.spyOn(saveSurveyResultRepositoryStub, 'saveResult').mockImplementationOnce(throwError)
    const accountPromise = sut.save(mockSaveSurveyResultParams())
    await expect(accountPromise).rejects.toThrow()
  })
  it('Should call LoadSurveyResultRepository with correct values', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()
    const loadBySurveyIdSpy = jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId')
    await sut.save(mockSaveSurveyResultParams())
    expect(loadBySurveyIdSpy).toHaveBeenCalledWith(mockSaveSurveyResultParams().surveyId)
  })
  it('Should throw an error if SaveSurveyResultRepository throws', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut();
    jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId').mockImplementationOnce(throwError)
    const accountPromise = sut.save(mockSaveSurveyResultParams())
    await expect(accountPromise).rejects.toThrow()
  })
})