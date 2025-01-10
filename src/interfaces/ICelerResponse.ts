export interface ICelerResponse<T> {
    "count": number;
    "next": string;
    "previous": string;
    "results": Array<T>;
}