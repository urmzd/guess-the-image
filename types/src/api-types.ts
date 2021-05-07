export type LanguageCodeOrNull = string | null;
export type LanguageCodeOrNullList = LanguageCodeOrNull[]
export type UriList = string[];

export type GetLanguageQueryParameters = {
  uris: UriList;
}

export type GetLanguageResponse = {
  languageCodes: LanguageCodeOrNullList
}
