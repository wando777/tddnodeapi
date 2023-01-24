export class ParamInUseError extends Error {
    constructor(paramName: string) {
        super(`The ${paramName} is already in use`)
        this.name = 'ParamInUseError'
    }
}