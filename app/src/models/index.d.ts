import {
    ModelInit,
    MutableModel,
    PersistentModelConstructor,
} from '@aws-amplify/datastore'

export declare class S3Object {
  readonly key: string;
  readonly bucket: string;
  readonly region: string;
  constructor(init: ModelInit<S3Object>);
}

export declare class Media {
  readonly id: string;
  readonly hint: string;
  readonly language: string;
  readonly media: S3Object;
  constructor(init: ModelInit<Media>);
  static copyOf(
    source: Media,
    mutator: (draft: MutableModel<Media>) => MutableModel<Media> | void
  ): Media;
}
