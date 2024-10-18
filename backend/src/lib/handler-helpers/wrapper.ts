import { APIGatewayEvent, Context } from 'aws-lambda';
import 'reflect-metadata';
import { myContainer } from '../../inversify.config';
import { Logger } from '../../lib/logger';
import { RequestContext } from '../../lib/request-context';
import {
  IDataResponse,
  IErrorResponse,
  IFileResponse,
} from '../../types/http-responses';
import { InterfaceFrom, toJoiObject } from '../../types/joi-util';
import { HttpResponses } from '../http-responses';
import { extractBody, extractParams, extractQueryParams } from '../request';
import { initEnitityManager } from './global-setters';

export type Validator = <T extends Record<string, any>>(
  event: APIGatewayEvent,
  context?: Context,
) => T;

export const responseCallback = async (
  response: IErrorResponse | IDataResponse | IFileResponse,
) => {
  const logger = myContainer.resolve(Logger);
  // const db = myContainer.resolve(Database);
  // If RDS Proxy is in use then there is no need to disconnect
  // RDS Proxy uses an idle timeout to prune stray connections
  // If there is a build-up of idle connections look into adjusting this setting
  // if (process.env.USE_RDS_PROXY !== 'true') {
  //   logger.debug('Closing DB connections');
  //   await db.closeConnections();
  // }

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Allow-Methods': '*',
  };

  const statusCode = response.statusCode;

  if (response.error) {
    logger.error(response.error, { response });
    if (response.error.statusCode === 301) {
      return {
        statusCode: 301,
      };
    } else {
      return {
        headers: {
          ...headers,
          ...{
            'Content-type': 'application/json',
          },
        },
        statusCode,
        body: JSON.stringify(response.error),
        isBase64Encoded: false,
      };
    }
  } else if (response.statusCode === 302) {
    return {
      statusCode: 302,
      headers: {
        ...headers,
        ...{
          Location: response.data,
        },
      },
    };
  } else if (response.contentType) {
    const isTextContent = response.contentType.startsWith('text/');
    return {
      statusCode,
      headers: {
        ...headers,
        ...{
          'Access-Control-Expose-Headers': 'Content-Disposition',
          'Content-Type': response.contentType,
          'Content-Disposition': response.contentDisposition,
        },
      },
      body: isTextContent
        ? response.data.toString()
        : response.data.toString('base64'),
      isBase64Encoded: !isTextContent,
    };
  } else {
    return {
      headers: {
        ...headers,
        ...{
          'Content-type': 'application/json',
        },
      },
      statusCode,
      body: JSON.stringify(response.data),
      isBase64Encoded: false,
    };
  }
};

export const parseParams = <T extends Record<string, object>>(
  validation: T,
) => {
  const schema = toJoiObject({ ...validation }).required();
  const schemaKeys = Object.keys(validation);
  type ISchema = InterfaceFrom<typeof schema>;

  return (
    event: APIGatewayEvent,
    context: Context,
  ): ISchema & { user: any; event: APIGatewayEvent; context: Context } => {
    const user = RequestContext.getInstance().get()['user'];
    const pathParams = extractParams<ISchema>(event, schemaKeys);
    const queryParams = extractQueryParams<ISchema>(event, schema);
    const bodyParams = extractBody<ISchema>(event, schemaKeys);

    const params = { ...pathParams, ...queryParams, ...bodyParams };

    const { error } = schema.validate(params);
    if (error) {
      throw error;
    }

    return {
      ...params,
      user,
      event,
      context,
    };
  };
};

export const handlerWrapper =
  (fn: (event: APIGatewayEvent, context?: Context) => Promise<any>) =>
  async (event: APIGatewayEvent, context: Context) => {
    await initEnitityManager();

    const logger = myContainer.resolve(Logger);
    try {
      return await responseCallback(await fn(event, context));
    } catch (error) {
      if (error.isJoi) {
        logger.withError('Handler validation error', error);
        return responseCallback(HttpResponses.ERROR_VALIDATION(error));
      }

      logger.withError('Handler error', error);
      return responseCallback(HttpResponses.ERROR(error));
    }
  };
