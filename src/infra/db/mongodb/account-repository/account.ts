import { AddAccountRepository } from '../../../../data/protocols/db/add-account-repository';
import { AccountModel } from '../../../../domain/models/account';
import { AddAccountModel } from '../../../../domain/usecases/add-account';
import { MongoHelper } from './helpers/mongo-helper';

export class AccountMongoRepository implements AddAccountRepository {
    async add(accountData: AddAccountModel): Promise<AccountModel> {
        const accountCollection = await MongoHelper.getCollection('accounts')
        const result = await accountCollection.insertOne(accountData)
        const resultFind = await accountCollection.findOne(result.insertedId)
        // const { _id, ...accountWithoutId } = account
        // return await new Promise(resolve => resolve({
        //     id: '',
        //     name: '',
        //     email: 'mail@mail.com',
        //     password: ''
        // }))
        return resultFind && MongoHelper.map(resultFind)
    }
}