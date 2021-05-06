"use strict";
/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten
Object.defineProperty(exports, "__esModule", { value: true });
exports.listMedias = exports.getMedia = exports.syncMedia = void 0;
exports.syncMedia = "\n  query SyncMedia(\n    $filter: ModelMediaFilterInput\n    $limit: Int\n    $nextToken: String\n    $lastSync: AWSTimestamp\n  ) {\n    syncMedia(\n      filter: $filter\n      limit: $limit\n      nextToken: $nextToken\n      lastSync: $lastSync\n    ) {\n      items {\n        id\n        hint\n        language\n        _version\n        _deleted\n        _lastChangedAt\n        createdAt\n        updatedAt\n      }\n      nextToken\n      startedAt\n    }\n  }\n";
exports.getMedia = "\n  query GetMedia($id: ID!) {\n    getMedia(id: $id) {\n      id\n      hint\n      language\n      media {\n        key\n        bucket\n        region\n      }\n      _version\n      _deleted\n      _lastChangedAt\n      createdAt\n      updatedAt\n    }\n  }\n";
exports.listMedias = "\n  query ListMedias(\n    $filter: ModelMediaFilterInput\n    $limit: Int\n    $nextToken: String\n  ) {\n    listMedias(filter: $filter, limit: $limit, nextToken: $nextToken) {\n      items {\n        id\n        hint\n        language\n        _version\n        _deleted\n        _lastChangedAt\n        createdAt\n        updatedAt\n      }\n      nextToken\n      startedAt\n    }\n  }\n";
