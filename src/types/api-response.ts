import { ApiError } from './api-error';

/**
 * @see http://battlerite-docs.readthedocs.io/en/latest/receivingresponses/receivingresponses.html
 */
export interface ApiResponse<T> {
    /** The response’s “primary data” */
    data?: T,
    /**  Array of error objects */
    errors?: ApiError[],
    /** A links object related to the primary data */
    links: any,
    /**
     * An array of resource objects that are related to the primary data and
     * or each other(“included resources”)
     */
    included?: any,
}

