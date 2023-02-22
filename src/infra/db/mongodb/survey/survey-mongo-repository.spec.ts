import { AddSurveyModel } from '@/domain/usecases/add-survey';
import { SaveSurveyResultModel } from '@/domain/usecases/save-survey-result';
import env from '@/main/config/env';
import { Collection } from 'mongodb';
import { MongoHelper } from '../helpers/mongo-helper';
import { SurveyMongoRepository } from './survey-mongo-repository';

let surveyCollection: Collection

const makeSut = (): SurveyMongoRepository => {
    return new SurveyMongoRepository();
}

describe('Survey Mongo Repository', () => {
    beforeAll(async () => {
        await MongoHelper.connect(env.mongoUrl)
    });

    afterAll(async () => {
        await MongoHelper.disconnect()
    });

    beforeEach(async () => {
        surveyCollection = await MongoHelper.getCollection('surveys')
        await surveyCollection.deleteMany({})
    })

    const makeFakeSurveyTest = (): AddSurveyModel => ({
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

    const makeFakeSurveyResultData = (): SaveSurveyResultModel => ({
        surveyId: 'any_surveyId',
        userId: 'any_userId',
        answer: 'any_answer',
        date: new Date()
    })

    const makeFakeSurveyResult = Object.assign({}, makeFakeSurveyResultData(), { id: 'any_id' })

    describe('add()', () => {
        it('Should return true on add survey success', async () => {
            const sut = makeSut()
            await sut.add(makeFakeSurveyTest())
            const survey = await surveyCollection.findOne({ question: makeFakeSurveyTest().question })
            expect(survey).toBeTruthy()
        })
    })

    describe('loadAll()', () => {
        it('Should return all surveys on success', async () => {
            const sut = makeSut()
            await surveyCollection.insertOne(makeFakeSurveyTest())
            const surveys = await sut.loadAll()
            // const survey = await surveyCollection.findOne({ question: makeFakeSurveyTest().question })
            expect(surveys).toBeTruthy()
            expect(surveys.length).toBe(1)
            expect(surveys[0].question).toBe(makeFakeSurveyTest().question)
        })
        it('Should return an empty list when empty', async () => {
            const sut = makeSut()
            const surveys = await sut.loadAll()
            expect(surveys).toBeTruthy()
            expect(surveys.length).toBe(0)
        })
    })

    describe('save()', () => {
        it('Should return true on save survey success', async () => {
            const sut = makeSut()
            await sut.saveResult(makeFakeSurveyResultData())
            const survey = await surveyCollection.findOne({ surveyId: makeFakeSurveyResultData().surveyId })
            expect(survey).toBeTruthy()
        })
    })

    describe('loadOneById()', () => {
        it('Should return a survey result by Id on success', async () => {
            const sut = makeSut()
            const res = await surveyCollection.insertOne(makeFakeSurveyTest())
            const surveyResult = surveyCollection.findOne(res.insertedId)
            console.log(makeFakeSurveyResult.id)
            const survey = await sut.loadOneById(
                (surveyResult && MongoHelper.map(surveyResult)).id
            )
            expect(survey).toBeTruthy()
        })
    })
})