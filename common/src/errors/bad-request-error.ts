import { CustomError } from "./custom-error";

export class BadRequestError extends CustomError {
  statusCode = 400;
  // * Message argument is to specify what input fields are missing during badrequest
  constructor(public message: string) {
    // use super method everytime you extends the class
    super(message);
  }

  generateErrors() {
    return [{ message: this.message }];
  }
}



