import { AccountModel } from '@/domain/models/account';
import { SurveyModel } from '@/domain/models/survey';
import { mockAddAccountParams, mockSurveyAddParams } from '@/domain/test';
import { SaveSurveyResultParams } from '@/domain/usecases/survey-result/save-survey-result';
import { SurveyResultMongoRepository } from './survey-result-mongo-repository';
import { MongoHelper } from '../helpers/mongo-helper';
import { Collection } from 'mongodb';
import env from '@/main/config/env';

let surveyCollection: Collection
let surveyResultsCollection: Collection
let accountCollection: Collection

const makeSut = (): SurveyResultMongoRepository => {
    return new SurveyResultMongoRepository();
}

describe('Survey Result Mongo Repository', () => {
    beforeAll(async () => {
        await MongoHelper.connect(env.mongoUrl)
    });

    afterAll(async () => {
        await MongoHelper.disconnect()
    });

    beforeEach(async () => {
        surveyCollection = await MongoHelper.getCollection('surveys')
        await surveyCollection.deleteMany({})
        surveyResultsCollection = await MongoHelper.getCollection('surveyResults')
        await surveyResultsCollection.deleteMany({})
        accountCollection = await MongoHelper.getCollection('accounts')
        await accountCollection.deleteMany({})
    })

    const makeFakeSurvey = async (): Promise<SurveyModel> => {
        const res = await surveyCollection.insertOne(mockSurveyAddParams())
        const resultFind = await surveyCollection.findOne(res.insertedId)
        return resultFind && MongoHelper.map(resultFind)
    }

    const makeFakeAccount = async (): Promise<AccountModel> => {
        const res = await accountCollection.insertOne(mockAddAccountParams())
        const resultFind = await accountCollection.findOne(res.insertedId)
        return resultFind && MongoHelper.map(resultFind)
    }

    const makeFakeSurveyResultData = async (): Promise<SaveSurveyResultParams> => {
        const survey = await makeFakeSurvey()
        const account = await makeFakeAccount()
        const surveyResult = {
            surveyId: survey.id,
            userId: account.id,
            answer: survey.answers[0].answer,
            date: new Date()
        }
        return surveyResult
    }

    // const makeFakeSurveyResult = Object.assign({}, makeFakeSurveyResultData(), { id: 'any_id' })

    describe('save()', () => {
        it('Should return true on save survey success', async () => {
            const sut = makeSut()
            const surveyResultData = await makeFakeSurveyResultData()
            const surveyResult = await sut.saveResult(surveyResultData)
            expect(surveyResult).toBeTruthy()
            expect(surveyResult.id).toBeTruthy()
            expect(surveyResult.userId).toEqual(surveyResultData.userId)
        })
        it('Should update survey on success', async () => {
            const sut = makeSut()
            const surveyResultData = await makeFakeSurveyResultData()
            const res = await surveyResultsCollection.insertOne(surveyResultData) // Inserting a suvery result into the data base
            const resultFind = await surveyResultsCollection.findOne(res.insertedId)
            // const firstSurveyResultData = resultFind && MongoHelper.map(resultFind)
            // const updated = Object.assign(surveyResultData, surveyResultData.answer, 'updated_answer') // Updating my survey data result with a new answer
            // const surveyResult = await sut.saveResult(updated)
            const surveyResult = await sut.saveResult({
                surveyId: surveyResultData.surveyId,
                userId: surveyResultData.userId,
                answer: 'updated_answer',
                date: new Date()
            })
            expect(surveyResult).toBeTruthy()
            expect(surveyResult.id).toEqual(resultFind._id)
            expect(surveyResult.answer).toEqual('updated_answer')
        })
    })
})
