
import {
  HttpRequest,
  HttpResponse,
  EmailValidator,
  Controller,
  MissingParamError,
  InvalidParamError,
  badRequest,
  serverError,
  AddAccount
} from './signup'

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly addAccount: AddAccount

  constructor(emailValidator: EmailValidator, addAccount: AddAccount) {
    this.emailValidator = emailValidator
    this.addAccount = addAccount
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
      for (const field of requiredFields) {
        if (!httpRequest.body[field])
          return badRequest(new MissingParamError(field))
      }

      const { name, email, password, passwordConfirmation } = httpRequest.body

      if (!this.emailValidator.isValid(email))
        return badRequest(new InvalidParamError('email'))

      if (password !== passwordConfirmation)
        return badRequest(new InvalidParamError('passwordConfirmation'))

      const account = await this.addAccount.add({
        name,
        email,
        password
      })

      return {
        statusCode: 200,
        body: account
      }
    } catch (error) {
      return serverError()
    }
  }
}
