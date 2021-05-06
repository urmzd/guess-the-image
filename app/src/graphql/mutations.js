"use strict";
/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMedia = exports.updateMedia = exports.createMedia = void 0;
exports.createMedia = "\n  mutation CreateMedia(\n    $input: CreateMediaInput!\n    $condition: ModelMediaConditionInput\n  ) {\n    createMedia(input: $input, condition: $condition) {\n      id\n      hint\n      language\n      media {\n        key\n        bucket\n        region\n      }\n      _version\n      _deleted\n      _lastChangedAt\n      createdAt\n      updatedAt\n    }\n  }\n";
exports.updateMedia = "\n  mutation UpdateMedia(\n    $input: UpdateMediaInput!\n    $condition: ModelMediaConditionInput\n  ) {\n    updateMedia(input: $input, condition: $condition) {\n      id\n      hint\n      language\n      media {\n        key\n        bucket\n        region\n      }\n      _version\n      _deleted\n      _lastChangedAt\n      createdAt\n      updatedAt\n    }\n  }\n";
exports.deleteMedia = "\n  mutation DeleteMedia(\n    $input: DeleteMediaInput!\n    $condition: ModelMediaConditionInput\n  ) {\n    deleteMedia(input: $input, condition: $condition) {\n      id\n      hint\n      language\n      media {\n        key\n        bucket\n        region\n      }\n      _version\n      _deleted\n      _lastChangedAt\n      createdAt\n      updatedAt\n    }\n  }\n";
