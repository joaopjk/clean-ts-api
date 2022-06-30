
import { MissingParamError, InvalidParamError } from '../errors'
import { badRequest, serverError } from '../helpers/http-helper'
import { Controller, EmailValidator, HttpRequest, HttpResponse } from '../protocols'

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator

  constructor(emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }

  handle(httpRequest: HttpRequest): HttpResponse {
    try {
      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
      for (const field of requiredFields) {
        if (!httpRequest.body[field])
          return badRequest(new MissingParamError(field))
      }

      if (!this.emailValidator.isValid(httpRequest.body.email))
        return badRequest(new InvalidParamError('email'))

      if (httpRequest.body.password !== httpRequest.body.passwordConfirmation)
        return badRequest(new InvalidParamError('passwordConfirmation'))

      return {
        statusCode: 200,
        body: {}
      }
    } catch (error) {
      return serverError()
    }
  }
}
