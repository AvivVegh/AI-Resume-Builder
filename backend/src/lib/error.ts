import * as HttpStatus from 'http-status-codes';

import { Error } from '../types/error';

export const error = (message: string, statusCode?: number, data?: any): Error => {
  return {
    message,
    statusCode,
    data,
  };
};

export const badRequestError = (message: string, data?: any): Error => {
  return error(message || 'Bad Request', HttpStatus.StatusCodes.BAD_REQUEST, data);
};

export const notFoundError = (message: string, data?: any): Error => {
  return error(message || 'Not Found', HttpStatus.StatusCodes.NOT_FOUND, data);
};

export const forbiddenError = (message?: string, data?: any): Error => {
  return error(message || 'You have no permissions to do this action', HttpStatus.StatusCodes.FORBIDDEN, data);
};

export const unauthorizedError = (message?: string, data?: any): Error => {
  return error(message || 'Unauthorized Request', HttpStatus.StatusCodes.UNAUTHORIZED, data);
};

export const unprocessableEntityError = (message?: string, data?: any): Error => {
  return error(message || 'Unprocessable Entity', HttpStatus.StatusCodes.UNPROCESSABLE_ENTITY, data);
};

export const conflictError = (message?: string, data?: any): Error => {
  return error(message || 'Conflict Error', HttpStatus.CONFLICT, data);
};

export const redirectError = (message?: string, data?: any): Error => {
  return error(message || 'Conflict Error', HttpStatus.MOVED_PERMANENTLY, data);
};
