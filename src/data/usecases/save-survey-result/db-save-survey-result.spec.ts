import { DbSaveSurveyResult } from './db-save-survey-result'
import { SaveSurveyResultRepository } from './db-save-survey-result-protocols'
import { mockSaveSurveyResultParams, throwError } from '@/domain/test'
import MockDate from 'mockdate'
import { mockSaveSurveyResultRepository } from '@/data/test'

type SutTypes = {
  sut: DbSaveSurveyResult
  saveSurveyResultRepositoryStub: SaveSurveyResultRepository
}

const makeSut = (): SutTypes => {
  const saveSurveyResultRepositoryStub = mockSaveSurveyResultRepository()
  const sut = new DbSaveSurveyResult(saveSurveyResultRepositoryStub)
  return {
    sut,
    saveSurveyResultRepositoryStub
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
    expect(surveyResponse).toEqual(Object.assign({}, mockSaveSurveyResultParams(), { id: 'any_id' }))
  })
  it('Should throw an error if SaveSurveyResultRepository throws', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut();
    jest.spyOn(saveSurveyResultRepositoryStub, 'saveResult').mockImplementationOnce(throwError)
    const accountPromise = sut.save(mockSaveSurveyResultParams())
    await expect(accountPromise).rejects.toThrow()
  })
})