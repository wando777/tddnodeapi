import { LogMongoRepository } from './log-mongo-repository';
import env from '@/main/config/env';
import { MongoHelper } from '../helpers/mongo-helper';
import { Collection } from 'mongodb';

const makeSut = (): LogMongoRepository => {
    return new LogMongoRepository()
}

describe('Log Mongo Repository', () => {
    let errorCollection: Collection
    beforeAll(async () => {
        await MongoHelper.connect(env.mongoUrl)
    });

    afterAll(async () => {
        await MongoHelper.disconnect()
    });

    beforeEach(async () => {
        errorCollection = await MongoHelper.getCollection('errors')
        await errorCollection.deleteMany({})
    })
    it('Should create an error log on success', async () => {
        const sut = makeSut()
        await sut.logError('any_error')
        const count = await errorCollection.countDocuments()
        expect(count).toBe(1)
    })
})