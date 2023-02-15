import { DbLoadSurvey } from './db-load-survey'
import MockDate from 'mockdate'
import { LoadSurveyRepository } from './db-load-survey-protocols'
import { SurveyModel } from '../../../domain/models/survey'

const makeFakeSurveys = (): SurveyModel[] => [{
  id: 'any_id',
  question: 'any_question',
  answers: [{
    image: 'any_image',
    answer: 'any_answer'
  }],
  date: new Date()
}]

const makeLoadSurveyRepository = (): LoadSurveyRepository => {
  class LoadSurveyRepositoryStub implements LoadSurveyRepository {
    async loadAll(): Promise<SurveyModel[]> {
      return await new Promise(resolve => resolve(makeFakeSurveys()))
    }
  }
  return new LoadSurveyRepositoryStub()
}

export interface SutTypes {
  sut: DbLoadSurvey
  loadSurveyRepositoryStub: LoadSurveyRepository
}

const makeSut = (): SutTypes => {
  const loadSurveyRepositoryStub = makeLoadSurveyRepository()
  const sut = new DbLoadSurvey(loadSurveyRepositoryStub)
  return {
    sut,
    loadSurveyRepositoryStub
  }
}

describe('DbAddSurvey Usecase', () => {
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
    const promise = await sut.load()
    expect(promise).toEqual(makeFakeSurveys())
  })
  // it('Should throw an error if AddSurveyRepository throws', async () => {
  //   const { sut, addSurveyRepositoryStub } = makeSut();
  //   jest.spyOn(addSurveyRepositoryStub, 'add').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
  //   // jest.spyOn(addSurveyRepositoryStub, 'add').mockImplementationOnce(async () => {
  //   //     throw new Error()
  //   // })
  //   const accountPromise = sut.add(makeFakeSurvey())
  //   await expect(accountPromise).rejects.toThrow()
  // })
})