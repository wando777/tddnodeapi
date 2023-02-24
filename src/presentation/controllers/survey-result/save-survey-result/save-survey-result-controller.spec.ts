import { SurveyResultModel } from '@/domain/models/survey-result'
import { InvalidParamError } from '@/presentation/errors'
import { notFound } from '@/presentation/helpers/http/http-helper'
import { SaveSurveyResultController } from './save-survey-result-controller'
import { HttpRequest, Validation, SaveSurveyResult, SaveSurveyResultModel, LoadSurveyById } from './save-survey-result-controller-protocols'
import { SurveyModel } from '@/domain/models/survey'
import MockDate from 'mockdate'

const makeFakeRequest = (): HttpRequest => ({
  body: {
    userId: 'any_userId',
    answer: 'any_answer',
    date: new Date()
  },
  params: {
    surveyId: 'any_surveyId'
  }
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

const makeFakeSurveyResult = (): any => {
  return Object.assign({}, makeFakeSurveyResult(), { id: 'any_id' })
}

// const makeValidation = (): Validation => {
//   class ValidationStub implements Validation {
//     validate(input: any): any {
//       return null
//     }
//   }
//   return new ValidationStub()
// }

// const makeSaveSurveyResult = (): SaveSurveyResult => {
//   class SaveSurveyResultStub implements SaveSurveyResult {
//     async save(input: SaveSurveyResultModel): Promise<SurveyResultModel> {
//       return await new Promise(resolve => resolve(makeFakeSurveyResult()))
//     }
//   }
//   return new SaveSurveyResultStub()
// }

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
}

const makeSut = (): SutTypes => {
  // const saveSurveyResultStub = makeSaveSurveyResult()
  // const validationStub = makeValidation()
  const loadSurveyByIdStub = makeLoadSurveyById()
  const sut = new SaveSurveyResultController(loadSurveyByIdStub)
  return {
    sut,
    loadSurveyByIdStub
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
  // it('Should call SaveSurvey use case with correct values', async () => {
  //   const { sut, saveSurveyResultStub } = makeSut()
  //   const saveSurveySpy = jest.spyOn(saveSurveyResultStub, 'save')
  //   await sut.handle(makeFakeRequest())
  //   expect(saveSurveySpy).toHaveBeenCalledWith(makeFakeRequest().body)
  // })
  // it('Should throw server error if AddSurvey throws', async () => {
  //   const { sut, saveSurveyResultStub } = makeSut()
  //   jest.spyOn(saveSurveyResultStub, 'save').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
  //   const httpresponse = await sut.handle(makeFakeRequest())
  //   expect(httpresponse).toEqual(serverError(new Error()))
  // })
  // it('Should return 200 on success', async () => {
  //   const { sut } = makeSut()
  //   const httpresponse = await sut.handle(makeFakeRequest())
  //   expect(httpresponse).toEqual(ok({ id: 'test' }))
  // })
})