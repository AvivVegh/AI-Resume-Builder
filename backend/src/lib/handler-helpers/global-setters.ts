import { APIGatewayEvent, Context } from 'aws-lambda';
import 'reflect-metadata';

import { myContainer } from '../../inversify.config';
import { Database, DatabaseType } from '../database/data-source';
import { RequestContext } from '../request-context';

export const initEnitityManager = async () => {
  const db = myContainer.get<Database>(DatabaseType);
  await db.initEnitityManager();
};

export const setRequestContext = async (event: APIGatewayEvent, context: Context): Promise<void> => {
  if (!event.headers) {
    return;
  }

  const ctx: any = { awsRequestId: context.awsRequestId };

  for (const header in event.headers) {
    if (header.toLowerCase().startsWith('x-correlation-')) {
      ctx[header] = event.headers[header];
    }
  }

  if (!ctx['x-correlation-id']) {
    ctx['x-correlation-id'] = ctx.awsRequestId;
  }

  if (event.headers['User-Agent']) {
    ctx['User-Agent'] = event.headers['User-Agent'];
  }

  RequestContext.getInstance().replaceAllWith(ctx);

  await setUserRequestContext(event);
};

export const setUserRequestContext = async (event: APIGatewayEvent) => {
  const ctx = RequestContext.getInstance().get();
  const userId = event?.headers?.['x-user-id'];

  if (userId) {
    if (userId) {
      ctx['user'] = {
        id: userId,
      };
    }
  } else {
    ctx['user'] = {
      id: undefined,
    };
  }

  RequestContext.getInstance().replaceAllWith(ctx);
};
