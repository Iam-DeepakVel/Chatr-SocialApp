export abstract class CustomError extends Error {
  abstract statusCode: number;
  constructor(message: string) {
    // Since we are extending another class super method should be used
    super(message);
  }

  abstract generateErrors(): { message: string; field?: string }[]
}



