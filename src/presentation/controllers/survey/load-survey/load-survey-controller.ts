import { created, ok, serverError } from '@/presentation/helpers/http/http-helper';
import { LoadSurvey, Controller, HttpRequest, HttpResponse } from './load-survey-controller-protocols';

export class LoadSurveyController implements Controller {
	constructor(
		private readonly loadSurvey: LoadSurvey
	) { }

	async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
		try {
			const surveys = await this.loadSurvey.load()
			return surveys.length ? ok(surveys) : created()
		} catch (err: any) {
			return serverError(err)
		}
	}
}