import { LogErrorRepository } from '@/data/protocols/db/log/log-error-repository'
import { Controller } from '@/presentation/protocols'
import { LogControllerDecorator } from './log-controller-decorator'

export interface SutTypesDecorator {
  sut: LogControllerDecorator
  controllerStub: Controller
  logErrorRepositoryStub: LogErrorRepository
}