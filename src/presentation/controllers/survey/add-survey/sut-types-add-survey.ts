import { AddSurveyController } from './add-survey-controller';
import { AddSurvey, Validation } from './add-survey-controller-protocols';

export type SutTypes =  {
  sut: AddSurveyController
  validationStub: Validation
  addSurveyStub: AddSurvey
}