import { AccountModel } from '@/domain/models/account';
import { SurveyModel } from '@/domain/models/survey';
import { mockAddAccountParams, mockSurveyAddParams } from '@/domain/test';
import { SaveSurveyResultParams } from '@/domain/usecases/survey-result/save-survey-result';
import { SurveyResultMongoRepository } from './survey-result-mongo-repository';
import { MongoHelper } from '../helpers/mongo-helper';
import { Collection, ObjectId } from 'mongodb';
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
            await sut.saveResult(surveyResultData)
            const surveyResult = await surveyResultsCollection.findOne({
                surveyId: surveyResultData.surveyId,
                userId: surveyResultData.userId
            })
            expect(surveyResult).toBeTruthy()
        })
        // it('Should update survey on success', async () => {
        //     const sut = makeSut()
        //     const surveyResultData = await makeFakeSurveyResultData()
        //     const res = await surveyResultsCollection.insertOne(surveyResultData) // Inserting a suvery result into the data base
        //     const resultFind = await surveyResultsCollection.findOne(res.insertedId)
        //     // const firstSurveyResultData = resultFind && MongoHelper.map(resultFind)
        //     // const updated = Object.assign(surveyResultData, surveyResultData.answer, 'updated_answer') // Updating my survey data result with a new answer
        //     // const surveyResult = await sut.saveResult(updated)
        //     const surveyResult = await sut.saveResult({
        //         surveyId: surveyResultData.surveyId,
        //         userId: surveyResultData.userId,
        //         answer: 'updated_answer',
        //         date: new Date()
        //     })
        //     expect(surveyResult).toBeTruthy()
        //     expect(surveyResult.surveyId).toEqual(resultFind.surveyId)
        //     expect(surveyResult.answers[0]).toBe(resultFind.answers[1].answer)
        //     expect(surveyResult.answers[0].count).toBe(1)
        //     expect(surveyResult.answers[0].percent).toBe(100)
        // })
        test('Should update survey result if its not new', async () => {
            const survey = await makeFakeSurvey()
            const account = await makeFakeAccount()
            await surveyResultsCollection.insertOne({
                surveyId: new ObjectId(survey.id),
                userId: new ObjectId(account.id),
                answer: survey.answers[0].answer,
                date: new Date()
            })
            const sut = makeSut()
            await sut.saveResult({
                surveyId: survey.id,
                userId: account.id,
                answer: survey.answers[1].answer,
                date: new Date()
            })
            const surveyResult = await surveyResultsCollection.find({
                surveyId: survey.id,
                userId: account.id
            }).toArray()
            expect(surveyResult).toBeTruthy()
            expect(surveyResult.length).toBe(1)
        })
    })

    describe('loadBySurveyId()', () => {
        test('Should load survey result', async () => {
            const survey = await makeFakeSurvey()
            const account = await makeFakeAccount()
            await surveyResultsCollection.insertMany([{
                surveyId: new ObjectId(survey.id),
                userId: new ObjectId(account.id),
                answer: survey.answers[0].answer,
                date: new Date()
            },
            {
                surveyId: new ObjectId(survey.id),
                userId: new ObjectId(account.id),
                answer: survey.answers[0].answer,
                date: new Date()
            },
            {
                surveyId: new ObjectId(survey.id),
                userId: new ObjectId(account.id),
                answer: survey.answers[0].answer,
                date: new Date()
            },
            {
                surveyId: new ObjectId(survey.id),
                userId: new ObjectId(account.id),
                answer: survey.answers[1].answer,
                date: new Date()
            }])
            const sut = makeSut()
            const surveyResult = await sut.loadBySurveyId(survey.id)
            expect(surveyResult).toBeTruthy()
            expect(surveyResult.surveyId).toEqual(survey.id)
            expect(surveyResult.answers[0].count).toBe(3)
            expect(surveyResult.answers[0].percent).toBe(75)
            expect(surveyResult.answers[1].count).toBe(1)
            expect(surveyResult.answers[1].percent).toBe(25)
        })
    })
})
