import { HashComparer } from '../../../data/protocols/criptography/hash-comparer';
import { LoadAccountByEmailRepository } from '../../../data/protocols/db/load-account-by-email-repository';
import { DbAuthentication } from './db-authentication';

export interface SutTypesDbAuthentication{
    sut: DbAuthentication
    loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
    hashComparerStub: HashComparer
}