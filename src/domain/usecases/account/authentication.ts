import { AddAccountParams } from './add-account'

export type AuthenticationParams = Omit<AddAccountParams, 'name'>

export interface Authentication {
    auth: (authentication: AuthenticationParams) => Promise<string>
}