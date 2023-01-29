import { CustomError } from "./custom-error";

export class NotFoundError extends CustomError {
  statusCode = 404;
  // No need to use message argument for NotFoundError
  constructor() {
    // For logging Purpose
    super("Not Found!");
  }
  generateErrors() {
    return [{ message: "not Found" }];
  }
}

