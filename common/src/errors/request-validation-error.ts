import { CustomError } from "./custom-error";
import { ValidationError } from "express-validator";

export class RequestValidationError extends CustomError {
  statusCode = 400;
  constructor(public errors: ValidationError[]) {
    super("Invalid request");
  }
  // Getting error messages from express Validator
  generateErrors() {
    // Mapping errors from express Validator and returning as object with properties defined in customError
    return this.errors.map((error) => {
      return { message: error.msg, field: error.param };
    });
  }
}
