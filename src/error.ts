import { Response } from "express";
import mongoose from "mongoose";
import { logger } from "./logger";
export class AppError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string, err?: any) {
    if (message == "mongodb error") {
      message = err.message;
      super(message);
      this.stack = err.stack;
      this.statusCode = statusCode;
    } else {
      super(message);
      this.statusCode = statusCode;
      Error.captureStackTrace(this);
    }
  }
}

class ErrorHandler {
  public handleError(err: Error, res?: Response) {
    //constructing response
    let { message, stack } = err;
    let statusCode;
    if (err instanceof AppError) {
      statusCode = err.statusCode;
    } else {
      statusCode = 500;
      message = "Something went wrong";
    }

    //logging
    logger.error({ message, stack, statusCode });

    //response
    res ? res.status(statusCode).json({ error: { message } }) : null;
  }

  public isTrustedError(error: Error): boolean {
    return error instanceof AppError ? true : false;
  }
}
export const errorHandler = new ErrorHandler();
