import { APIGatewayEvent, Context } from 'aws-lambda';

import 'reflect-metadata';
import { initEnitityManager, setRequestContext, setUserRequestContext } from './global-setters';

import { myContainer } from '../../inversify.config';
import { Logger } from '../logger';
import { RequestContext } from '../request-context';
import { IDataResponse, IErrorResponse, IFileResponse } from '../../types/http-responses';
import { InterfaceFrom, toJoiObject } from '../../types/joi-util';
import { HttpResponses } from '../http-responses';
import { extractBody, extractParams, extractQueryParams } from '../request';
import { serialize, parse } from 'cookie';

export type Validator = <T extends Record<string, any>>(event: APIGatewayEvent, context?: Context) => T;

export const responseCallback = async (response: IErrorResponse | IDataResponse | IFileResponse) => {
  const logger = myContainer.resolve(Logger);
  // const db = myContainer.resolve(Database);
  // If RDS Proxy is in use then there is no need to disconnect
  // RDS Proxy uses an idle timeout to prune stray connections
  // If there is a build-up of idle connections look into adjusting this setting
  // if (process.env.USE_RDS_PROXY !== 'true') {
  //   logger.debug('Closing DB connections');
  //   await db.closeConnections();
  // }

  let headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Allow-Methods': '*',
    'Access-Control-Allow-Credentials': true,
  } as any;

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
    console.log('reddirect', response.data, JSON.stringify(headers));

    return {
      statusCode: 302,
      headers: {
        Location: response.data,
        ...headers,
      },
      multiValueHeaders: {
        'Cache-Control': 'no-cache',
        // 'Set-Cookie': ['cookie1=value1; Path=/; Max-Age=259200', 'cookie2=value2; Path=/; Max-Age=259200'],
        'Set-Cookie': getCookies(),
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
      body: isTextContent ? response.data.toString() : response.data.toString('base64'),
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

export const parseParams = <T extends Record<string, object>>(validation: T) => {
  const schema = toJoiObject({ ...validation }).required();
  const schemaKeys = Object.keys(validation);
  type ISchema = InterfaceFrom<typeof schema>;

  return (
    event: APIGatewayEvent,
    context: Context
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

export const getValidatorWithUserId = <T extends Record<string, object>>(validation: T): Validator => {
  const schema = toJoiObject({ ...validation }).required();
  const schemaKeys = Object.keys(validation);

  return <K>(event: APIGatewayEvent): K & { userId: string } => {
    const user = RequestContext.getInstance().get()['user'];
    const pathParams = extractParams<K>(event, schemaKeys);
    const queryParams = extractQueryParams<K>(event, schema);
    const bodyParams = extractBody<K>(event, schemaKeys);

    const params = { ...pathParams, ...queryParams, ...bodyParams, userId: user.id };

    const { error } = schema.validate(params);
    if (error) {
      throw error;
    }

    return params;
  };
};

export const getValidatorWithUser = <T extends Record<string, object>>(validation: T): Validator => {
  const schema = toJoiObject({ ...validation }).required();
  const schemaKeys = Object.keys(validation);

  return <K>(event: APIGatewayEvent): K & { userId: string } => {
    const user = RequestContext.getInstance().get()['user'];
    const pathParams = extractParams<K>(event, schemaKeys);
    const queryParams = extractQueryParams<K>(event, schema);
    const bodyParams = extractBody<K>(event, schemaKeys);

    const params = { ...pathParams, ...queryParams, ...bodyParams, ...user };

    const { error } = schema.validate(params);
    if (error) {
      throw error;
    }

    return params;
  };
};

export const getValidator = <T extends Record<string, object>>(validation: T): Validator => {
  const schema = toJoiObject({ ...validation }).required();
  const schemaKeys = Object.keys(validation);

  return <K>(event: APIGatewayEvent): K => {
    const pathParams = extractParams<K>(event, schemaKeys);
    const queryParams = extractQueryParams<K>(event, schema);
    const bodyParams = extractBody<K>(event, schemaKeys);

    const params = { ...pathParams, ...queryParams, ...bodyParams };

    const { error } = schema.validate(params);
    if (error) {
      throw error;
    }

    return params;
  };
};

export const reqWrapper = (
  fn: (data: Record<string, any>) => Promise<any>,
  validation: Record<string, object> | Validator
) => {
  const parse = typeof validation === 'function' ? validation : parseParams(validation);

  return async (event: APIGatewayEvent, context: Context) => {
    const data = parse(event, context);
    return await fn(data);
  };
};

export const handlerWrapper =
  (fn: (event: APIGatewayEvent, context?: Context) => Promise<any>) =>
  async (event: APIGatewayEvent, context: Context) => {
    await setRequestContext(event, context);

    // await setUserRequestContext(event);

    // await initEnitityManager();

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

const getCookies = () => {
  const context = RequestContext.getInstance();
  const cookie = context.getCookies();
  let cookies = [];
  if (cookie) {
    const cookiesKeys = Object.keys(cookie);

    for (const key of cookiesKeys) {
      const cookieValue = cookie[key];

      const parseCookie = serialize(key, cookieValue.value, cookieValue.options);

      cookies.push(parseCookie + '; Path=/;');
    }
  }
  return cookies;
};
