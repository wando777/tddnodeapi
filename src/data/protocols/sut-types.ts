import { LogControllerDecorator } from '../../main/decorators/log'
import { Controller } from '../../presentation/protocols'
import { DbAddAccount } from '../usecases/add-account/db-add-account'
import { AddAccountRepository } from './db/add-account-repository'
import { Hasher } from './criptography/hasher'
import { LogErrorRepository } from './db/log-error-repository'

export interface SutTypes {
    sut: DbAddAccount
    hasherStub: Hasher
    addAccountRepositoryStub: AddAccountRepository
}

export interface SutTypesDecorator {
    sut: LogControllerDecorator
    controllerStub: Controller
    logErrorRepositoryStub: LogErrorRepository
}