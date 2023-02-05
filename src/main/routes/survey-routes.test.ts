import { Collection } from 'mongodb';
import request from 'supertest'
import { AddSurveyModel } from '../../domain/usecases/add-survey';
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper';
import app from '../config/app'
import env from '../config/env';

let surveyCollection: Collection

describe('Survey Routes', () => {
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

    const makeFakeSurvey = (): AddSurveyModel => ({
        question: 'Question 1',
        answers: [{
            answer: 'Answer 1',
            image: 'http://image-name.com'
        },
        {
            answer: 'Answer 2'
        }]
    })

    describe('POST /survey', () => {
        it('Should return 204 on survey success', async () => {
            await request(app)
                .post('/api/survey')
                .send(makeFakeSurvey())
                .expect(204)
        })
    })
})