import * as url from 'url';

export const API_BASE_ENDPOINT = 'https://api.dc01.gamelockerapp.com';
export const API_GLOBAL_SHARD = url.resolve(API_BASE_ENDPOINT, '/shards/global/');
export const API_CONTENT_TYPE = 'application/vnd.api+json';
