/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreateMediaInput = {
  id?: string | null;
  hint?: string | null;
  languageCode?: string | null;
  media: S3ObjectInput;
  _version?: number | null;
};

export type S3ObjectInput = {
  key: string;
};

export type ModelMediaConditionInput = {
  hint?: ModelStringInput | null;
  languageCode?: ModelStringInput | null;
  and?: Array<ModelMediaConditionInput | null> | null;
  or?: Array<ModelMediaConditionInput | null> | null;
  not?: ModelMediaConditionInput | null;
};

export type ModelStringInput = {
  ne?: string | null;
  eq?: string | null;
  le?: string | null;
  lt?: string | null;
  ge?: string | null;
  gt?: string | null;
  contains?: string | null;
  notContains?: string | null;
  between?: Array<string | null> | null;
  beginsWith?: string | null;
  attributeExists?: boolean | null;
  attributeType?: ModelAttributeTypes | null;
  size?: ModelSizeInput | null;
};

export enum ModelAttributeTypes {
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
  _null = "_null",
}

export type ModelSizeInput = {
  ne?: number | null;
  eq?: number | null;
  le?: number | null;
  lt?: number | null;
  ge?: number | null;
  gt?: number | null;
  between?: Array<number | null> | null;
};

export type Media = {
  __typename: "Media";
  id?: string;
  hint?: string | null;
  languageCode?: string | null;
  media?: S3Object;
  _version?: number;
  _deleted?: boolean | null;
  _lastChangedAt?: number;
  createdAt?: string;
  updatedAt?: string;
};

export type S3Object = {
  __typename: "S3Object";
  key?: string;
};

export type UpdateMediaInput = {
  id: string;
  hint?: string | null;
  languageCode?: string | null;
  media?: S3ObjectInput | null;
  _version?: number | null;
};

export type DeleteMediaInput = {
  id?: string | null;
  _version?: number | null;
};

export type ModelMediaFilterInput = {
  id?: ModelIDInput | null;
  hint?: ModelStringInput | null;
  languageCode?: ModelStringInput | null;
  and?: Array<ModelMediaFilterInput | null> | null;
  or?: Array<ModelMediaFilterInput | null> | null;
  not?: ModelMediaFilterInput | null;
};

export type ModelIDInput = {
  ne?: string | null;
  eq?: string | null;
  le?: string | null;
  lt?: string | null;
  ge?: string | null;
  gt?: string | null;
  contains?: string | null;
  notContains?: string | null;
  between?: Array<string | null> | null;
  beginsWith?: string | null;
  attributeExists?: boolean | null;
  attributeType?: ModelAttributeTypes | null;
  size?: ModelSizeInput | null;
};

export type ModelMediaConnection = {
  __typename: "ModelMediaConnection";
  items?: Array<Media | null> | null;
  nextToken?: string | null;
  startedAt?: number | null;
};

export type CreateMediaMutationVariables = {
  input?: CreateMediaInput;
  condition?: ModelMediaConditionInput | null;
};

export type CreateMediaMutation = {
  createMedia?: {
    __typename: "Media";
    id: string;
    hint?: string | null;
    languageCode?: string | null;
    media: {
      __typename: "S3Object";
      key: string;
    };
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
    createdAt: string;
    updatedAt: string;
  } | null;
};

export type UpdateMediaMutationVariables = {
  input?: UpdateMediaInput;
  condition?: ModelMediaConditionInput | null;
};

export type UpdateMediaMutation = {
  updateMedia?: {
    __typename: "Media";
    id: string;
    hint?: string | null;
    languageCode?: string | null;
    media: {
      __typename: "S3Object";
      key: string;
    };
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
    createdAt: string;
    updatedAt: string;
  } | null;
};

export type DeleteMediaMutationVariables = {
  input?: DeleteMediaInput;
  condition?: ModelMediaConditionInput | null;
};

export type DeleteMediaMutation = {
  deleteMedia?: {
    __typename: "Media";
    id: string;
    hint?: string | null;
    languageCode?: string | null;
    media: {
      __typename: "S3Object";
      key: string;
    };
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
    createdAt: string;
    updatedAt: string;
  } | null;
};

export type SyncMediaQueryVariables = {
  filter?: ModelMediaFilterInput | null;
  limit?: number | null;
  nextToken?: string | null;
  lastSync?: number | null;
};

export type SyncMediaQuery = {
  syncMedia?: {
    __typename: "ModelMediaConnection";
    items?: Array<{
      __typename: "Media";
      id: string;
      hint?: string | null;
      languageCode?: string | null;
      _version: number;
      _deleted?: boolean | null;
      _lastChangedAt: number;
      createdAt: string;
      updatedAt: string;
    } | null> | null;
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
};

export type GetMediaQueryVariables = {
  id?: string;
};

export type GetMediaQuery = {
  getMedia?: {
    __typename: "Media";
    id: string;
    hint?: string | null;
    languageCode?: string | null;
    media: {
      __typename: "S3Object";
      key: string;
    };
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
    createdAt: string;
    updatedAt: string;
  } | null;
};

export type ListMediasQueryVariables = {
  filter?: ModelMediaFilterInput | null;
  limit?: number | null;
  nextToken?: string | null;
};

export type ListMediasQuery = {
  listMedias?: {
    __typename: "ModelMediaConnection";
    items?: Array<{
      __typename: "Media";
      id: string;
      hint?: string | null;
      languageCode?: string | null;
      _version: number;
      _deleted?: boolean | null;
      _lastChangedAt: number;
      createdAt: string;
      updatedAt: string;
    } | null> | null;
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
};

export type OnCreateMediaSubscription = {
  onCreateMedia?: {
    __typename: "Media";
    id: string;
    hint?: string | null;
    languageCode?: string | null;
    media: {
      __typename: "S3Object";
      key: string;
    };
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
    createdAt: string;
    updatedAt: string;
  } | null;
};

export type OnUpdateMediaSubscription = {
  onUpdateMedia?: {
    __typename: "Media";
    id: string;
    hint?: string | null;
    languageCode?: string | null;
    media: {
      __typename: "S3Object";
      key: string;
    };
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
    createdAt: string;
    updatedAt: string;
  } | null;
};

export type OnDeleteMediaSubscription = {
  onDeleteMedia?: {
    __typename: "Media";
    id: string;
    hint?: string | null;
    languageCode?: string | null;
    media: {
      __typename: "S3Object";
      key: string;
    };
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
    createdAt: string;
    updatedAt: string;
  } | null;
};
