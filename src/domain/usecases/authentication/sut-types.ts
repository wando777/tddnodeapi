import { HashComparer } from '../../../data/protocols/criptography/hash-comparer';
import { TokenGenerator } from '../../../data/protocols/criptography/token-generator';
import { LoadAccountByEmailRepository } from '../../../data/protocols/db/load-account-by-email-repository';
import { UpdateAccessTokenRepository } from '../../../data/protocols/db/update-access-token-repository';
import { DbAuthentication } from './db-authentication';

export interface SutTypesDbAuthentication{
    sut: DbAuthentication
    loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
    hashComparerStub: HashComparer
    tokenGeneratorStub: TokenGenerator
    updateAccessTokenRepositoryStub: UpdateAccessTokenRepository
}