import 'mocha';
import * as should from 'should';
import * as sinon from 'sinon';
import * as URL from 'url';
import BattleriteApiClient from '../src/client';
import { API_GLOBAL_SHARD } from '../src/constants';
import { SinonStub } from 'sinon';

describe('BattleriteApiClient', () => {
    const API_KEY = '____________________';
    let client: BattleriteApiClient = new BattleriteApiClient(API_KEY);

    describe('#buildUrl', () => {

        it(`resolves relative urls to ${API_GLOBAL_SHARD}`, () => {
            should(client.buildUrl(`/matches`))
                .be.eql(`${API_GLOBAL_SHARD}matches`);
            should(client.buildUrl(`/matches/D005654E95174996B303A17B979DC016`))
                .be.eql(`${API_GLOBAL_SHARD}matches/D005654E95174996B303A17B979DC016`);
            should(client.buildUrl((`matches`)))
                .be.eql(`${API_GLOBAL_SHARD}matches`);
            should(client.buildUrl((`matches/D005654E95174996B303A17B979DC016`)))
                .be.eql(`${API_GLOBAL_SHARD}matches/D005654E95174996B303A17B979DC016`);
            should(client.buildUrl(`./matches`))
                .be.eql(`${API_GLOBAL_SHARD}matches`);
            should(client.buildUrl(`./matches/D005654E95174996B303A17B979DC016`))
                .be.eql(`${API_GLOBAL_SHARD}matches/D005654E95174996B303A17B979DC016`);
        })

        it('allows absolute urls', () => {
            should(client.buildUrl('https://api.dc01.gamelockerapp.com/status'))
                .be.eql('https://api.dc01.gamelockerapp.com/status');
        })

        it('serializes queryParams into url search parameters', () => {
            const url = '/matches';
            const query = {
                'limit': 10,
                'filter[playerName]': 'player1',
            };
            const _url = URL.parse(client.buildUrl(url, query));
            should(_url.search).containEql('limit=10');
            should(decodeURIComponent(_url.search)).containEql('filter[playerName]=player1');
        })

        it('serializes array queryParams into a search parameter concatenated with commas', () => {
            const url = '/matches';
            const query = {
                'filter[playerNames]': [ 'playername1', 'playername2', 'playername3'],
            };
            const _url = URL.parse(client.buildUrl(url, query));
            should(decodeURIComponent(_url.search)).containEql('filter[playerNames]=playername1,playername2,playername3');
        })

        it('serializes Date queryParams into ISO6818 strings', () => {
            const url = '/matches';
            const date = new Date();
            const query = {
                'filter[createdAt_end]': date,
            };
            const _url = URL.parse(client.buildUrl(url, query));
            should(decodeURIComponent(_url.search))
            .containEql(`filter[createdAt_end]=${date.toISOString()}`);
        })

        it('doesn\'t add query parameters which value is undefined', () => {
            const url = '/matches';
            const query: any = {
                'limit': undefined,
            };
            should(client.buildUrl(url, query))
                .not.containEql('limit=');  
        })
    })

    describe('#buildRequestInit', () => {

        it('sets method GET by default', () => {
            should(client.buildRequestInit()).have.property('method').which.is.eql('GET');
        })

        it('adds the authorization header with the provided api key', () => {
            const init = client.buildRequestInit();
            should(init).have.property('headers').which.is.an.Array();
            should(init.headers).containEql([ 'authorization', `Bearer ${API_KEY}` ]);
        });

        it('adds the accept header', () => {
            const init = client.buildRequestInit();
            should(init).have.property('headers').which.is.an.Array();
            should(init.headers).containEql(['accept', 'application/vnd.api+json']);
        });

        it('combines default headers with provided headers', () => {
            const init = client.buildRequestInit({
                headers: {
                    'X-Custom-Header': 'Value',
                }
            });
            should(init).have.property('headers').which.is.an.Array();
            should(init.headers).containEql(['authorization', `Bearer ${API_KEY}`]);
            should(init.headers).containEql(['accept', 'application/vnd.api+json']);
            should(init.headers).containEql(['x-custom-header', 'Value']);
        })
    })

    describe('#fetch', () => {
        let fetchStub: SinonStub = null;
        beforeEach(() => {
            fetchStub = sinon.stub();
            fetchStub.resolves(new Response());
            client._fetchStub = fetchStub;
        });

        it('rejects if nothing is passed', () => {
            return should(client.fetch()).be.rejectedWith(/url/i);
        })

        it('rejects if object passed doesn\'t contain an url', () => {
            return should(client.fetch({})).be.rejectedWith(/url/i);
        })

        it('calls fetch with the given url', async () => {
            const res = await client.fetch({ url: '/matches' });
            const [ [ req ] ] = fetchStub.args;
            should(req).have.property('url').which.match(/\/matches/);
        })
    })
})
