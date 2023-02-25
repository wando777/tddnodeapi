import { InvalidParamError } from '@/presentation/errors';
import { badRequest, notFound, ok, serverError } from '@/presentation/helpers/http/http-helper';
import { Controller, HttpRequest, HttpResponse, LoadSurveyById } from './save-survey-result-controller-protocols';

export class SaveSurveyResultController implements Controller {
	constructor(
		// private readonly saveSurveyResult: SaveSurveyResult,
		private readonly loadSurveyById: LoadSurveyById
	) { }

	async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
		try {
			const { userId, answer } = httpRequest.body
			const { surveyId } = httpRequest.params
			const survey = await this.loadSurveyById.loadById(httpRequest.params.surveyId)
			if (survey) {
				const answers = survey.answers.map(a => a.answer)
				if (!answers.includes(answer)) {
					return badRequest(new InvalidParamError('invalid answer'))
				}
			} else {
				return notFound(new InvalidParamError('Survey not found'))
			}
			return ok(survey)
		} catch (err: any) {
			return serverError(err)
		}
		// const error = this.validation.validate(httpRequest.body)
		// if (error) {
		// 	return badRequest(error)
		// }
		// const httpResponse = await this.saveSurveyResult.save({
		// 	surveyId,
		// 	userId,
		// 	answer,
		// 	date: new Date()
		// })
	}
}