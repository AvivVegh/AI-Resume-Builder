import { Callback, Context, Handler } from 'aws-lambda';
import { JwtRsaVerifier } from 'aws-jwt-verify';
import { decode } from 'jsonwebtoken';
import { COOKIE_ID_TOKEN } from '../auth/auth.service';

const getDenyPolicy = () => {
  // IAM default policy to deny all.
  return {
    Version: '2012-10-17',
    Statement: [
      {
        Action: 'execute-api:Invoke',
        Effect: 'Deny',
        Resource: '*',
      },
    ],
  };
};

const getAllowPolicy = (resource: string) => {
  // IAM policy to invoke API.
  return {
    Version: '2012-10-17',
    Statement: [
      {
        Action: 'execute-api:Invoke',
        Effect: 'Allow',
        Resource: resource,
      },
    ],
  };
};

const generateAuthResponse = (principalId: any, resource: any) => {
  const policyDocument = getAllowPolicy(resource);

  return {
    principalId: principalId,
    policyDocument,
  };
};

export const authorize: Handler = async (event: any, _context: Context, callback: Callback) => {
  const methodArn = event.methodArn;
  const defaultDenyAllPolicy = getDenyPolicy();

  const token = event.headers.cookies[COOKIE_ID_TOKEN];

  try {
    if (!token) {
      console.error('no token', event);
      callback(null, defaultDenyAllPolicy);
    }

    const payload = decode(token) as any;
    console.log('payload:', payload);

    // Define IDP verifier parameters
    const verifier = JwtRsaVerifier.create({
      issuer: `${payload.iss}`, //replace <issuer_url_placeholder> with Entra ID issuer url
      audience: `api://${payload.aud}`, //replace <audience_id_placeholder> with Entra ID audience api
      jwksUri: 'https://www.googleapis.com/oauth2/v3/certs',
    });

    if (verifier && payload.oid) {
      console.log('verifier:', verifier);
      callback(null, generateAuthResponse(payload.oid, methodArn));
    } else {
      console.error('Invalid token.  Missing ID', payload);
      callback(null, defaultDenyAllPolicy);
    }
  } catch (err) {
    console.error('err', err);
    callback(null, defaultDenyAllPolicy);
  }
};
