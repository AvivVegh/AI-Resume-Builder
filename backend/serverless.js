const yaml = require('js-yaml');

const fs = require('fs');
const path = require('path');

const functionPaths = ['./src/auth/serverless.yml'];

// Rewrite handler paths to make this folder the root
const functions = functionPaths.reduce((agg, file) => {
  const { ext, dir } = path.parse(file);

  let config;
  if (ext === '.yml' || ext === '.yaml') {
    config = yaml.load(fs.readFileSync(file, { encoding: 'utf-8' }));
  } else {
    config = require(file);
  }

  Object.values(config.functions).forEach((value) => {
    value.handler = path.join(dir, value.handler);
  });

  return { ...agg, ...config.functions };
}, {});

module.exports = {
  service: 'airb-local',
  frameworkVersion: '3',
  plugins: ['serverless-webpack', 'serverless-offline'],
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
      packager: 'npm',
    },
    'serverless-offline': {
      httpPort: 3003,
      // disableCookieValidation: true,
      // corsAllowHeaders: '*',
      // corsAllowOrigin: '*',
      // corsAllowCredentials: true,
      // enforceSecureCookies: false,
      // corsDisallowCredentials: false,
      // credentials: true,
      // allowCredentials: true,
    },
    authorizer: {
      type: 'CUSTOM',
      authorizerId: {
        'Fn::ImportValue': '${self:provider.stage}-gateway-AuthorizerId',
      },
    },
    cors: {
      origin: '*',
      headers: ['Content-Type', 'X-Amz-Date', 'Authorization', 'X-Api-Key', 'X-Amz-Security-Token', 'Set-Cookie'],
      allowCredentials: true,
    },
  },
  provider: {
    name: 'aws',
    runtime: 'nodejs20.x',
    memorySize: 1280,
    stage: "${opt:stage, 'dev'}",
    environment: '${file(./serverless.config.${sls:stage}.yml):environment}',
  },
  functions,
};
