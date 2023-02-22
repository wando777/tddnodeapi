import { DbSaveSurveyResult } from './db-save-survey-result'
import { SaveSurveyResultModel, SaveSurveyResultRepository } from './db-save-survey-result-protocols'
import { SurveyResultModel } from '@/domain/models/survey-result'
import MockDate from 'mockdate'

const makeSaveSurveyResultRepository = (): SaveSurveyResultRepository => {
  class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
    async saveResult(surveyData: SaveSurveyResultModel): Promise<SurveyResultModel> {
      return await new Promise(
        resolve => resolve(
          Object.assign({}, makeFakeSurveyResult(), { id: 'any_id' })
        )
      )
    }
  }
  return new SaveSurveyResultRepositoryStub()
}

type SutTypes = {
  sut: DbSaveSurveyResult
  saveSurveyResultRepositoryStub: SaveSurveyResultRepository
}

const makeSut = (): SutTypes => {
  const saveSurveyResultRepositoryStub = makeSaveSurveyResultRepository()
  const sut = new DbSaveSurveyResult(saveSurveyResultRepositoryStub)
  return {
    sut,
    saveSurveyResultRepositoryStub
  }
}

const makeFakeSurveyResult = (): SaveSurveyResultModel => ({
  surveyId: 'any_surveyId',
  userId: 'any_userId',
  answer: 'any_answer',
  date: new Date()
})

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
    await sut.save(makeFakeSurveyResult())
    expect(saveSpy).toHaveBeenCalledWith(makeFakeSurveyResult())
  })
  it('Should return a SurveyResult on success', async () => {
    const { sut } = makeSut()
    const surveyResponse = await sut.save(makeFakeSurveyResult())
    expect(surveyResponse).toEqual(Object.assign({}, makeFakeSurveyResult(), { id: 'any_id' }))
  })
  it('Should throw an error if SaveSurveyResultRepository throws', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut();
    jest.spyOn(saveSurveyResultRepositoryStub, 'saveResult').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    // jest.spyOn(addSurveyRepositoryStub, 'add').mockImplementationOnce(async () => {
    //     throw new Error()
    // })
    const accountPromise = sut.save(makeFakeSurveyResult())
    await expect(accountPromise).rejects.toThrow()
  })
})