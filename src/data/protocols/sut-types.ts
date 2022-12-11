import { LogControllerDecorator } from '../../main/decorators/log'
import { Controller } from '../../presentation/protocols'
import { DbAddAccount } from '../usecases/add-account/db-add-account'
import { AddAccountRepository } from './add-account-repository'
import { Encrypter } from './encrypter'
import { LogErrorRepository } from './log-error-repository'

export interface SutTypes {
    sut: DbAddAccount
    encrypterStub: Encrypter
    addAccountRepositoryStub: AddAccountRepository
}

export interface SutTypesDecorator {
    sut: LogControllerDecorator
    controllerStub: Controller
    logErrorRepositoryStub: LogErrorRepository
}