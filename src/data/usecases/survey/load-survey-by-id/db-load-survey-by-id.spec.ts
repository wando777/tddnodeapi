import { DbLoadSurveyById } from './db-load-survey-by-id'
import { LoadSurveyByIdRepository } from './db-load-survey-by-id-protocols'
import MockDate from 'mockdate'
import { SurveyModel } from '@/domain/models/survey'
import { mockSurveyModel, throwError } from '@/domain/test'

const makeLoadSurveyByRepository = (): LoadSurveyByIdRepository => {
  class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
    async loadOneById(id: string): Promise<SurveyModel> {
      return await new Promise(resolve => resolve(mockSurveyModel()))
    }
  }
  return new LoadSurveyByIdRepositoryStub()
}

export type SutTypes = {
  sut: DbLoadSurveyById
  loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdRepositoryStub = makeLoadSurveyByRepository()
  const sut = new DbLoadSurveyById(loadSurveyByIdRepositoryStub)
  return {
    sut,
    loadSurveyByIdRepositoryStub
  }
}

describe('DbLoadSurveyById Usecase', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })
  afterAll(() => {
    MockDate.reset()
  })
  it('Should call LoadSurveyByIdRepository with correct values', async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut()
    const loadByIdSpy = jest.spyOn(loadSurveyByIdRepositoryStub, 'loadOneById')
    await sut.loadById(mockSurveyModel().id)
    expect(loadByIdSpy).toHaveBeenCalledWith(mockSurveyModel().id)
  })
  it('Should return a Survey on success', async () => {
    const { sut } = makeSut()
    const surveyResponse = await sut.loadById(mockSurveyModel().id)
    expect(surveyResponse).toEqual(mockSurveyModel())
  })
  it('Should throw an error if LoadSurveyByIdRepository throws', async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut();
    jest.spyOn(loadSurveyByIdRepositoryStub, 'loadOneById').mockImplementationOnce(throwError)
    const promise = sut.loadById(mockSurveyModel().id)
    await expect(promise).rejects.toThrow()
  })
})