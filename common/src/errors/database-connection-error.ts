import { CustomError } from "./custom-error";

export class DatabaseConnectionError extends CustomError {
  statusCode = 500;
  constructor() {
    super("Database Error");
  }
  generateErrors() {
    return [{ message: "db connection error!" }];
  }
}
