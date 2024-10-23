import { APIGatewayEvent } from 'aws-lambda';
import Joi from 'joi';
import _ = require('lodash');

import * as querystring from 'querystring';

import { myContainer } from '../inversify.config';
import { Logger } from './logger';

// path params

export const convertPathParametersToLowerCase = (event: APIGatewayEvent) => {
  const pathParameters: any = {};

  if (event.pathParameters) {
    for (const key of Object.keys(event.pathParameters)) {
      pathParameters[key.toLowerCase()] = event.pathParameters[key];
    }
  }

  return pathParameters;
};

export const convertPathParametersToCamelCase = (event: APIGatewayEvent) => {
  const pathParameters: any = {};

  if (event.pathParameters) {
    for (const key of Object.keys(event.pathParameters)) {
      pathParameters[_.camelCase(key)] = event.pathParameters[key];
    }
  }

  return pathParameters;
};
export const extractParams = <T = Record<string, any>>(event: APIGatewayEvent, props: string[]) => {
  const convertedPathEvent = convertPathParametersToCamelCase(event);
  return _.pick(convertedPathEvent, props) as T;
};

const parseVal = (desc: any, val: any) => {
  if (!desc || !val) {
    return val;
  }

  const valType = desc.type;
  const splitVal = val?.split(',');
  switch (valType) {
    case 'number':
      return Number(val);

    case 'boolean':
      return val === 'true';

    case 'array':
      // desc.items is an optional property that stores the type of the items in the array
      // There can be more than one type at which point the dev should manually parse the output
      // Also, mixing types is a very bad idea 99.999% of the time
      if (desc?.items?.length === 1) {
        return splitVal.map(parseVal.bind(this, [desc.items[0]]));
      }

      return splitVal;
  }

  return val;
};

export const extractQueryParams = <T>(event: APIGatewayEvent, props: Joi.ObjectSchema | string[]) => {
  const queryParams = event.queryStringParameters;

  if (!queryParams) {
    return {} as T;
  }

  // String array is fine for cases where params are just strings
  if (Array.isArray(props)) {
    return _.pick<T>(queryParams as any, props) as T;
  }

  const desc = props.describe().keys;
  const mappedObj = Object.entries(queryParams).reduce(
    (col, [key, val]) => ({
      ...col,
      [key]: parseVal(desc?.[key], val),
    }),
    {} as any
  );

  return _.pick<T>(mappedObj, Object.keys(desc)) as T;
};

export const InvalidJson = Symbol('InvalidJson');

/*
 * Note:
 * This returns the InvalidJson symbol on a parse error.
 * You need to use some form of type checking (e.g. joi.object()) to generate
 * a validation error.
 */
export const extractQueryParamJson = (event: APIGatewayEvent, paramName: string) => {
  const logger = myContainer.resolve(Logger);
  if (event.queryStringParameters) {
    const json = event.queryStringParameters[paramName];

    if (json) {
      try {
        return JSON.parse(event.queryStringParameters[paramName]);
      } catch (e) {
        logger.warn(`Invalid JSON in query param ${paramName}: ${json}`);
        return InvalidJson;
      }
    }
  }

  return undefined;
};

export const convertQueryStringToLowerCase = (event: APIGatewayEvent): any => {
  const queryString: any = {};

  if (event.queryStringParameters) {
    for (const key of Object.keys(event.queryStringParameters)) {
      queryString[key.toLowerCase()] = event.queryStringParameters[key];
    }
  }

  return queryString;
};

// event body

export const convertEventBodyToLowerCase = (event: APIGatewayEvent) => {
  if (event.body === null) {
    return {};
  }

  const body = JSON.parse(event.body);
  const eventBody: any = {};

  Object.keys(body).forEach((key: string) => {
    eventBody[key.toLowerCase()] = body[key];
  });

  return eventBody;
};

// Note we're not changing body key/value to lowercase
export const extractBody = <T = Record<string, any>>(event: APIGatewayEvent, props: string[]) => {
  if (!event.body) {
    return {} as T;
  }

  const body = JSON.parse(event.body);
  return _.pick(body, props) as T;
};

// TODO refactor and add tests
const convertObjectCamelCase = (object: any) => {
  let convertedObject: any, originalKey: string, newKey: string, value: any;

  if (object instanceof Array) {
    convertedObject = [];

    for (originalKey in object) {
      value = object[originalKey];

      if (typeof value === 'object') {
        value = convertObjectCamelCase(value);
      }

      convertedObject.push(value);
    }
  } else {
    convertedObject = {};

    for (originalKey in object) {
      // eslint-disable-next-line
      if (object.hasOwnProperty(originalKey)) {
        // newKey = (originalKey.charAt(0).toLowerCase() + originalKey.slice(1) || originalKey).toString();
        newKey = _.camelCase(originalKey);
        value = object[originalKey];

        if (value !== null && value.constructor === Object) {
          value = convertObjectCamelCase(value);
        }

        convertedObject[newKey] = value;
      }
    }
  }

  return convertedObject;
};

export const convertEventBodyToCamelCase = (event: APIGatewayEvent) => {
  if (event.body === null) {
    return {};
  }

  return convertObjectCamelCase(JSON.parse(event.body));
};

// Headers

export const convertHeadersToLowerCase = (event: APIGatewayEvent): any => {
  const inputHeaders = event.headers;
  const headers: any = {};

  if (inputHeaders) {
    for (const key of Object.keys(inputHeaders)) {
      headers[key.toLowerCase()] = inputHeaders[key];
    }
  }

  return headers;
};

export const extractBodyFromFormData = (event: APIGatewayEvent, keys: string[]) => {
  const parsed = querystring.decode(event.body);
  return _.pick(parsed, keys);
};
