import * as fetch from 'isomorphic-fetch';
import { merge, mapKeys, toPairs, isObject, isString, isDate, isNumber, isUndefined } from 'lodash';
import * as queryString from 'query-string';
import * as url from 'url';
import { API_GLOBAL_SHARD, API_CONTENT_TYPE } from './constants';
import { ApiRequest, ApiResponse, SerializableQueryParams } from './types';

export type BuildRequestInit = {
    method?: 'GET' | 'POST',
    headers?: { [header: string]: string },
}

export default class BattleriteApiClient {

    _fetchStub: (input: RequestInfo, init?: RequestInit) => Promise<Response>;

    constructor(
        private apiKey: string,
    ) {}

    /**
     * Returns a fully formed URL based on the provided URI and query params.
     *
     * If the given URI doesn't have a protocol and a host, it is considered
     * to be relative to {@link API_GLOBAL_SHARD}.

     * @param uri 
     * @param queryParams
     */
    buildUrl(uri: string, queryParams?: SerializableQueryParams) {
        // Parse URL
        let parsedUrl = url.parse(uri);
        let _url = parsedUrl.href;

        if (!parsedUrl.protocol && !parsedUrl.host) {
            let path = parsedUrl.path;
            if (parsedUrl.path.charAt(0) === '/')
                path = `.${path}`
            _url = url.resolve(API_GLOBAL_SHARD, path);
        }

        // Parse QueryParams
        if (queryParams) {
            const params: { [key: string]: string } = {};
            for (let key in queryParams) {
                let value: any = queryParams[key];
                if (Array.isArray(value)) {
                    params[key] = value
                        .filter((v) => isString(v) || isNumber(v))
                        .join(',');
                } else if (isDate(value)) {
                    params[key] = value.toISOString();
                } else {
                    params[key] = value;
                }
            }
            _url = `${_url}?${queryString.stringify(params)}`;
        }

        return _url;
    }

    buildRequestInit({ method, headers }: BuildRequestInit = {}): RequestInit {
        headers = merge({
            'accept': API_CONTENT_TYPE,
            'authorization': `Bearer ${this.apiKey}`,
            'user-agent': 'NodeJS Battlerite-SDK https://github.com/Souler/battlerite-sdk',
        }, headers);

        // Force headers to be lowercase
        headers = mapKeys(headers, (v, key) => key.toLowerCase());

        return {
            method: method || 'GET',
            headers: toPairs(headers),
        };
    }

    async fetch<T>(req: ApiRequest = {}) {
        if (!req.url || !isString(req.url)) {
            return Promise.reject(new TypeError('Request URL must be a string'));
        }

        const url = this.buildUrl(req.url);
        const init = this.buildRequestInit({
            method: req.method,
            headers: req.headers,
        });

        const res = await (() => {
            if (this._fetchStub) {
                return this._fetchStub(url, init);
            } else
                return fetch(url, init);
        })();

        if (res.status < 200 || res.status > 299) {
            // TODO: Add custom error class
            const err = new Error(`${res.status}`);
            return Promise.reject(err);
        }

        const contentType = res.headers.get('content-type');
        if (contentType !== API_CONTENT_TYPE) {
            // TODO: Add custom error class
            const err = new Error(`Unkown API response content-type: ${contentType}`);
            return Promise.reject(err);
        }

        let body: ApiResponse<T> = await res.json();
        
        if (body.errors && body.errors.length > 0) {
            // TODO: Add custom error class
            const error = body.errors[0];
            const err = new Error(`${error.title}: ${error.description}`);
            return Promise.reject(err);
        }

        return body;
    }
}
