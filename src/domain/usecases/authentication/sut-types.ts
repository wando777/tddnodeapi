import { LoadAccountByEmailRepository } from '../../../data/protocols/db/load-account-by-email-repository';
import { DbAuthentication } from './db-authentication';

export interface SutTypesDbAuthentication{
    sut: DbAuthentication
    loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
}