import { SurveyMongoRepository } from './survey-mongo-repository'
import { MongoHelper } from '../helpers/mongo-helper'
import { Collection } from 'mongodb'
import env from '../../../../main/config/env'
import { AddSurveyModel } from '../../../../data/usecases/add-survey/db-add-survey-protocols'

let surveyCollection: Collection

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

    const makeSut = (): SurveyMongoRepository => {
        return new SurveyMongoRepository();
    }

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
})