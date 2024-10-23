import * as HttpStatus from 'http-status-codes';
import joi, { ValidationError, ValidationErrorItem } from 'joi';

import { isNullOrUndefined } from './utils';
import { IContentResponse, IDataResponse, IErrorResponse, IFileResponse } from '../types/http-responses';

export const ERROR_403 = (message?: any) => {
  return {
    code: 403,
    message: message ? message : 'Forbidden',
  };
};

export const ERROR_405 = () => {
  return {
    code: 405,
    message: 'Method not allowed',
  };
};

export const ERROR_422 = (message?: any) => {
  return {
    code: 422,
    message: message ? message : 'Unprocessable entity',
  };
};

export const NO_CONTENT_SUCCESS = () => {
  return {
    code: 204,
  };
};

export const OK = (data: any, responseCode?: number) => {
  responseCode = responseCode ? responseCode : 200;
  return {
    data: data,
    code: responseCode,
    status: 'success',
  };
};

// Put refactor code below

export class HttpResponses {
  static DATA_RESPONSE(response: any, totalCount?: number, statusCode?: number): IDataResponse {
    // if response is paginated, destruct
    // TODO remove this fix when refactor response shape
    if (response && !isNullOrUndefined(response.items) && !isNullOrUndefined(response.totalCount)) {
      totalCount = response.totalCount;
      response = response.items;
    }

    return {
      statusCode: statusCode || 200,
      data: {
        result: response ? response : null,
        totalCount: totalCount ? totalCount : 0,
      },
    };
  }

  static CONTENT_RESPONSE(data: any, contentType: string): IContentResponse {
    return {
      statusCode: 200,
      data,
      contentType,
    };
  }

  static FILE_RESPONSE(data: any, contentType: string, contentDisposition: string): IFileResponse {
    return {
      statusCode: 200,
      data,
      contentType,
      contentDisposition,
    };
  }

  static CREATED_RESPONSE(response: any, totalCount?: number): IDataResponse {
    return {
      statusCode: 201,
      data: {
        result: response ? response : null,
        totalCount: totalCount ? totalCount : 0,
      },
    };
  }

  static NO_CONTENT_RESPONSE(): IDataResponse {
    return {
      statusCode: 204,
      data: null,
    };
  }

  static CUSTOM_RESPONSE(response: any): IDataResponse {
    return {
      statusCode: 200,
      data: response,
    };
  }

  // Use this to transform error thrown in service
  static ERROR(error: any): IErrorResponse {
    const errorDetails: any = {
      message: error.message || error,
    };

    if (error.data) {
      errorDetails.data = error.data;
    }

    return {
      statusCode: error.statusCode || error.code || 500,
      error: errorDetails,
    };
  }

  static ERROR_VALIDATION(error: joi.ValidationError | ValidationError): IErrorResponse {
    return {
      statusCode: HttpStatus.StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        message: 'Validation Error',
        validationErrors: (error.details as Array<joi.ValidationErrorItem | ValidationErrorItem>).map(
          (detail: joi.ValidationErrorItem | ValidationErrorItem) => {
            return {
              field: detail.path.join('/'),
              error: detail.message,
            };
          }
        ),
      },
    };
  }

  static ERROR_NOT_IMPLEMENTED(): IErrorResponse {
    return {
      statusCode: HttpStatus.StatusCodes.NOT_IMPLEMENTED,
      error: {
        message: 'Invalid http method request',
      },
    };
  }

  static ERROR_UNAUTHORIZED(): IErrorResponse {
    return {
      statusCode: HttpStatus.StatusCodes.UNAUTHORIZED,
      error: {
        message: 'Unauthorized',
      },
    };
  }

  static ERROR_FORBIDDEN(): IErrorResponse {
    return {
      statusCode: HttpStatus.StatusCodes.FORBIDDEN,
      error: {
        message: 'You have no permissions to do this action',
      },
    };
  }

  static ERROR_NOT_FOUND(error: any): IErrorResponse {
    return {
      statusCode: HttpStatus.StatusCodes.NOT_FOUND,
      error: {
        message: error,
      },
    };
  }

  static ERROR_BAD_REQUEST(): IErrorResponse {
    return {
      statusCode: HttpStatus.StatusCodes.BAD_REQUEST,
      error: {
        message: 'Invalid request',
      },
    };
  }
}
