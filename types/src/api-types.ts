export type LanguageCodeOrNull = string | null;
export type LanguageCodeOrNullList = LanguageCodeOrNull[]
export type KeyList = string[];

export type GetLanguageQueryParameters = {
  keys: KeyList;
}

export type GetLanguageResponse = {
  languageCodes: LanguageCodeOrNullList
}
