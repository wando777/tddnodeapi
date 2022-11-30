import { DbAddAccount } from '../usecases/add-account/db-add-account'
import { AddAccountRepository } from './add-account-repository'
import { Encrypter } from './encrypter'

export interface SutTypes {
    sut: DbAddAccount
    encrypterStub: Encrypter
    addAccountRepositoryStub: AddAccountRepository
}