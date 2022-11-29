import { DbAddAccount } from '../usecases/add-account/db-add-account'
import { Encrypter } from './encrypter'

export interface SutTypes{
    sut: DbAddAccount
    encrypterStub: Encrypter
}