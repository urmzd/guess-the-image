export type LanguageCodeOrNull = string | null;

export type GetLanguageQueryParameters = {
  uris: string[]
}

export type GetLanguageResponse = {
  languageCodes: LanguageCodeOrNull[]
}
