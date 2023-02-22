import { AccountModel } from '@/domain/models/account';
import { SurveyModel } from '@/domain/models/survey';
import { AddAccountModel } from '@/domain/usecases/add-account';
import { AddSurveyModel } from '@/domain/usecases/add-survey';
import { SaveSurveyResultModel } from '@/domain/usecases/save-survey-result';
import env from '@/main/config/env';
import { Collection } from 'mongodb';
import { MongoHelper } from '../helpers/mongo-helper';
import { SurveyResultMongoRepository } from './survey-result-mongo-repository';

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

    const makeFakeSurveyData = (): AddSurveyModel => ({
        question: 'any_question',
        answers: [{
            answer: 'any_answer',
            image: 'any_image'
        },
        {
            answer: 'any_answer 2'
        }],
        date: new Date()
    })

    const makeFakeAccountData = (): AddAccountModel => ({
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password'
    })

    const makeFakeSurvey = async (): Promise<SurveyModel> => {
        const res = await surveyCollection.insertOne(makeFakeSurveyData())
        const resultFind = await surveyCollection.findOne(res.insertedId)
        return resultFind && MongoHelper.map(resultFind)
    }

    const makeFakeAccount = async (): Promise<AccountModel> => {
        const res = await accountCollection.insertOne(makeFakeAccountData())
        const resultFind = await accountCollection.findOne(res.insertedId)
        return resultFind && MongoHelper.map(resultFind)
    }

    const makeFakeSurveyResultData = async (): Promise<SaveSurveyResultModel> => {
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
    })
})