import { AccountModel } from '@/domain/models/account';
import { LoadAccountByToken } from '@/domain/usecases/account/load-account-by-token';
import { LoadAccountByTokenRepository, Decrypter } from './db-load-account-by-token-protocols';

export class DbLoadAccountByToken implements LoadAccountByToken {
    constructor(
        private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository,
        private readonly decrypter: Decrypter
    ) { }

    async load(accessToken: string, role?: string): Promise<AccountModel> {
        let account: AccountModel = null
        const tokenDecrypted = await this.decrypter.decrypt(accessToken)
        if (tokenDecrypted) {
            account = await this.loadAccountByTokenRepository.loadByToken(accessToken, role)
        }
        return account
    }
}