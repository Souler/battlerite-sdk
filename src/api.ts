import { merge, get, isUndefined, isString, isNumber, isDate } from 'lodash';
import { ApiResponse } from './types';
import BattleriteApiClient from './client';
import * as validations from './validations';

export type MatchCollectionFilter = {
    page?: {
        offset?: number,
        limit?: number,
    }
    sort?: string,
    filter?: {
        createdAtStart?: Date,
        createdAtEnd?: Date,
        playerNames?: Array<string>,
        playerIds?: Array<number>,
        teamNames?: Array<string>,
        gameMode?: string,
    },
}

export type PlayersCollectionFilter = {
    filter?: {
        playerNames?: string[],
        playerIds?: string[],
    }
}

export default class BattleriteApi {
    readonly client: BattleriteApiClient;

    constructor(apiKey: string) {
        this.client = new BattleriteApiClient(apiKey);
    }

    getMatches(query: MatchCollectionFilter = {}): Promise<ApiResponse<any>> {
        // Query Params to be pased to the fetch request
        const queryParams: { [key: string]: string|number } = {};
        // Assing defaults to keep things DRY
        query = merge({
            page: {},
            sort: '',
            filter: {},
        }, query);

        // Validate query params
        try {
            validations.optionalNumber(query.page.offset, 'page.offset');
            validations.optionalNumber(query.page.limit, 'page.limit');
            validations.optionalString(query.sort, 'sort');
            validations.optionalDate(query.filter.createdAtEnd, 'filter.createdAtEnd');
            validations.optionalDate(query.filter.createdAtEnd, 'filter.createdAtEnd');
            validations.optionalStringArray(query.filter.playerNames, 'filter.playerNames');
            validations.optionalNumberArray(query.filter.playerIds, 'filter.playerIds');
            validations.optionalString(query.filter.gameMode, 'filter.gameMode');
        } catch(e) {
            return Promise.reject(e);
        }

        // Adapt the query params into the expected query names
        return this.client.fetch({
            method: 'GET',
            url: '/matches',
            queryParams: {
                'page[offset]': query.page.offset,
                'page[limit]': query.page.limit,
                'sort': query.sort,
                'filter[createdAt-start]': query.filter.createdAtStart,
                'filter[createdAt-end]': query.filter.createdAtEnd,
                'filter[playerNames]': query.filter.playerNames,
                'filter[playerIds]': query.filter.playerIds,
                'filter[teamNames]': query.filter.teamNames,
                'filter[gameMode]': query.filter.gameMode,
            },
        })
    }

    getMatch(matchId: string) {
        // Validate params
        try {
            validations.optionalString(matchId, 'matchId');
        } catch(e) {
            return Promise.reject(e);
        }

        return this.client.fetch({
            method: 'GET',
            url: `/matches/${matchId}`,
        })
    }

    getPlayers(query?: PlayersCollectionFilter) {
        // Query Params to be pased to the fetch request
        const queryParams: { [key: string]: string|number } = {};
        // Assing defaults to keep things DRY
        query = merge({
            filter: {},
        }, query);

        // Validate query params
        try {
            validations.optionalStringArray(query.filter.playerNames, 'filter.playerNames');
            validations.optionalNumberArray(query.filter.playerIds, 'filter.playerIds');
        } catch(e) {
            return Promise.reject(e);
        }
        
        return this.client.fetch({
            method: 'GET',
            url: '/players',
            queryParams,
        });
    }

    getPlayer(playerId: string) {
        // Validate params
        try {
            validations.optionalString(playerId, 'playerId');
        } catch(e) {
            return Promise.reject(e);
        }
        
        return this.client.fetch({
            method: 'GET',
            url: `/players/${playerId}`,
        });        
    }
}
