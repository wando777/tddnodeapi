import { ok, serverError } from '../../../helpers/http/http-helper';
import { LoadSurvey, Controller, HttpRequest, HttpResponse } from './load-survey-controller-protocols';

export class LoadSurveyController implements Controller {
	constructor(
		private readonly loadSurvey: LoadSurvey
	) { }

	async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
		try {
			const surveys = await this.loadSurvey.load()
			return ok(surveys)
		} catch (err: any) {
			return serverError(err)
		}
	}
}