import { forbidden } from '@/presentation/helpers/http/http-helper';
import { Controller, HttpRequest, HttpResponse, LoadSurveyById } from './load-survey-result-controller-protocols';
import { InvalidParamError } from '@/presentation/errors';

export class LoadSurveyResultController implements Controller {
  constructor(
    private readonly loadSurveyById: LoadSurveyById
  ) { }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const survey = await this.loadSurveyById.loadById(httpRequest.params.surveyId)
    if (!survey) {
      return forbidden(new InvalidParamError('Survey not found'))
    }
    return await Promise.resolve(null)
  }
}