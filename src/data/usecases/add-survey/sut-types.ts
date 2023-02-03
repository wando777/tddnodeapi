import { DbAddSurvey } from './db-add-survey';
import { AddSurveyRepository } from './db-add-survey-protocols';

export interface SutTypes {
  sut: DbAddSurvey
  addSurveyRepositoryStub: AddSurveyRepository
}