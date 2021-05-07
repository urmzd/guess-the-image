export declare type LanguageCodeOrNull = string | null;
export declare type LanguageCodeOrNullList = LanguageCodeOrNull[];
export declare type UriList = string[];
export declare type GetLanguageQueryParameters = {
    uris: UriList;
};
export declare type GetLanguageResponse = {
    languageCodes: LanguageCodeOrNullList;
};
