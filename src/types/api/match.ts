/**
 * @see http://battlerite-docs.readthedocs.io/en/latest/match_data_summary/match_data_summary.html
 */
export interface Match {
    /** Match ID */
    id: string,
    /** Time of Match Played (iso8601)*/
    createdAt: string,
    /** Duration of match in seconds */
    duration: number,
    /** Game Mode */
    gameMode: string,
    /** Version of the game */
    patchVersion: string,
    /** Region Shard */
    shardID: string,
    /** Stats particular to the match */
    stats: { [key: string]: any },
    assets: MatchAssets,
    /** See Rosters */
    rosters: any,
    /** See Rounds */
    rounds: any,
    /** Participants that are spectating */
    spectators: any,
    /** Identifies the studio and game */
    titleId: string,
}

export interface MatchAssets {
    /** Asset */
    type: string,
    /** Time of Telemtry creation (iso8601)  */
    createdAt: string,
    /** NA */
    description: string,
    /** telemetry.json */
    filename: string,
    /** ID of Asset */
    id: string,
    /** application / json */
    contentType: string,
    /** Telemetry */
    name: { [key: string]: any }, // TODO: is this correct?
    /** Link to Telemetry.json file */
    URL: string,
    /** Region Shard */
    shardId: string,
}
