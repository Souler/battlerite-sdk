export interface ApiRequest {
    method?: 'GET' | 'POST',
    url?: string,
    headers?: { [header: string]: string },
    queryParams?: SerializableQueryParams,
}

export type SerializableQueryParams = {
    [key: string]: string | string[] | number | number[]  | Date | undefined,
}
