export declare type LanguageCodeOrNull = string | null;
export declare type LanguageCodeOrNullList = LanguageCodeOrNull[];
export declare type KeyList = string[];
export declare type GetLanguageQueryParameters = {
    keys: KeyList;
};
export declare type GetLanguageResponse = {
    languageCodes: LanguageCodeOrNullList;
};
