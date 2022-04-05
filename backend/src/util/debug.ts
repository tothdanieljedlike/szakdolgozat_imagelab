import * as Debug from 'debug';

export const debug = Debug(process.env.npm_package_name || 'server');
