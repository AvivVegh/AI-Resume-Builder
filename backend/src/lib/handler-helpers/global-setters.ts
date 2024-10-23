import { APIGatewayEvent, Context } from 'aws-lambda';
import 'reflect-metadata';
import { parse } from 'cookie';
import { myContainer } from '../../inversify.config';
import { Database, DatabaseType } from '../database/data-source';
import { User } from '../../types/user';
import { getTokenPayload } from '../auth';
import { RequestContext } from '../request-context';
import { isValidUuid } from '../validators';

export const initEnitityManager = async () => {
  const db = myContainer.get<Database>(DatabaseType);
  await db.initEnitityManager();
};

export const setRequestContext = async (event: APIGatewayEvent, context: Context): Promise<void> => {
  if (!event.headers) {
    return;
  }

  const ctx: any = { awsRequestId: context.awsRequestId };

  const setCookies = event.headers['Set-Cookie'];
  if (setCookies) {
    const cookies = parse(setCookies);
    console.log('cookies', cookies);
    RequestContext.getInstance().setCookies(cookies);
  }

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
};

export const setUserRequestContext = async (event: APIGatewayEvent) => {
  const ctx = RequestContext.getInstance().get();

  if (event?.headers?.['Authorization']) {
    const payload = getTokenPayload(event.headers['Authorization']);

    let userGroups: string[] = [];
    let department: string;
    if (event?.headers?.['user']) {
      const user = JSON.parse(event.headers['user']);
      userGroups = user.groups?.split(',');
      department = user.department;
    }

    if (isValidUuid(payload?.oid)) {
      ctx['user'] = {
        id: payload.oid,
        email: payload.unique_name,
        groups: userGroups,
        department: department,
      } as User;
    }
  } else {
    ctx['user'] = {
      id: undefined,
      email: undefined,
    };
  }

  RequestContext.getInstance().replaceAllWith(ctx);
};
