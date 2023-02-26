import { AddSurveyModel } from '@/domain/usecases/survey/add-survey';
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper';
import { sign } from 'jsonwebtoken';
import { Collection } from 'mongodb';
import request from 'supertest'
import app from '../config/app'
import env from '../config/env';

let surveyCollection: Collection
let accountCollection: Collection

const makeAccessToken = async (): Promise<string> => {
    const res = await accountCollection.insertOne({
        name: 'Wandao',
        email: 'wando123@gmai.com',
        password: '777'
    })
    const id = res.insertedId
    const accessToken = sign({ id }, env.jwtSecret)
    await accountCollection.updateOne({
        _id: id
    }, {
        $set: {
            accessToken
        }
    })
    return accessToken
}

describe('Survey Result Routes', () => {
    beforeAll(async () => {
        await MongoHelper.connect(env.mongoUrl)
    });

    afterAll(async () => {
        await MongoHelper.disconnect()
    });

    beforeEach(async () => {
        surveyCollection = await MongoHelper.getCollection('surveys')
        await surveyCollection.deleteMany({})
        accountCollection = await MongoHelper.getCollection('accounts')
        await accountCollection.deleteMany({})
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
    } as any)

    describe('PUT /survey/:surveyId/result', () => {
        it('Should return 403 on save survey result without accessToken', async () => {
            await request(app)
                .put('/api/survey/any_surveyId/result') // it does not matter what surveyId I send cause it should always throw a 403 forbidden error
                .send({ answer: 'any_answer' })
                .expect(403)
        })
        // it('Should return 204 on add survey with valid accessToken', async () => {
        //     const res = await accountCollection.insertOne({
        //         name: 'Wandao',
        //         email: 'wando123@gmai.com',
        //         password: '777',
        //         role: 'admin'
        //     })
        //     const id = res.insertedId
        //     const accessToken = sign({ id }, env.jwtSecret)
        //     await accountCollection.updateOne({
        //         _id: id
        //     }, {
        //         $set: {
        //             accessToken
        //         }
        //     })
        //     await request(app)
        //         .post('/api/survey')
        //         .set('x-access-token', accessToken)
        //         .send(makeFakeSurvey())
        //         .expect(204)
        // })
        // it('Should return 403 on add survey with an invalid accessToken', async () => {
        //     await request(app)
        //         .post('/api/survey')
        //         .send(makeFakeSurvey())
        //         .expect(403)
        // })
    })
    // describe('GET /survey', () => {
    //     it('Should return 403 on load survey without accessToken', async () => {
    //         await request(app)
    //             .get('/api/survey')
    //             .expect(403)
    //     })
    //     it('Should return 204 on load survey with valid accessToken but there is no survey', async () => {
    //         const accessToken = await makeAccessToken()
    //         await request(app)
    //             .get('/api/survey')
    //             .set('x-access-token', accessToken)
    //             .expect(204)
    //     })
    //     it('Should return 200 on load survey with valid accessToken', async () => {
    //         await surveyCollection.insertOne(makeFakeSurvey())
    //         await request(app)
    //             .get('/api/survey')
    //             .set('x-access-token', await makeAccessToken())
    //             .expect(200)
    //     })
    //     // it('Should return 403 on add survey with an invalid accessToken', async () => {
    //     //     await request(app)
    //     //         .post('/api/survey')
    //     //         .send(makeFakeSurvey())
    //     //         .expect(403)
    //     // })
    // })
})