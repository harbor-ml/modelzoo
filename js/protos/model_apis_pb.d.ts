import * as jspb from "google-protobuf"

export class Image extends jspb.Message {
  getMetadataMap(): jspb.Map<string, string>;
  clearMetadataMap(): void;

  getImageDataUrl(): string;
  setImageDataUrl(value: string): void;

  getModelName(): string;
  setModelName(value: string): void;

  getAccessToken(): string;
  setAccessToken(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Image.AsObject;
  static toObject(includeInstance: boolean, msg: Image): Image.AsObject;
  static serializeBinaryToWriter(message: Image, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Image;
  static deserializeBinaryFromReader(message: Image, reader: jspb.BinaryReader): Image;
}

export namespace Image {
  export type AsObject = {
    metadataMap: Array<[string, string]>,
    imageDataUrl: string,
    modelName: string,
    accessToken: string,
  }
}

export class Text extends jspb.Message {
  getMetadataMap(): jspb.Map<string, string>;
  clearMetadataMap(): void;

  getTextsList(): Array<string>;
  setTextsList(value: Array<string>): void;
  clearTextsList(): void;
  addTexts(value: string, index?: number): void;

  getModelName(): string;
  setModelName(value: string): void;

  getAccessToken(): string;
  setAccessToken(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Text.AsObject;
  static toObject(includeInstance: boolean, msg: Text): Text.AsObject;
  static serializeBinaryToWriter(message: Text, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Text;
  static deserializeBinaryFromReader(message: Text, reader: jspb.BinaryReader): Text;
}

export namespace Text {
  export type AsObject = {
    metadataMap: Array<[string, string]>,
    textsList: Array<string>,
    modelName: string,
    accessToken: string,
  }
}

export class Table extends jspb.Message {
  getMetadataMap(): jspb.Map<string, string>;
  clearMetadataMap(): void;

  getModelName(): string;
  setModelName(value: string): void;

  getAccessToken(): string;
  setAccessToken(value: string): void;

  getTableMap(): jspb.Map<string, Table.Row>;
  clearTableMap(): void;

  getColumnNamesList(): Array<string>;
  setColumnNamesList(value: Array<string>): void;
  clearColumnNamesList(): void;
  addColumnNames(value: string, index?: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Table.AsObject;
  static toObject(includeInstance: boolean, msg: Table): Table.AsObject;
  static serializeBinaryToWriter(message: Table, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Table;
  static deserializeBinaryFromReader(message: Table, reader: jspb.BinaryReader): Table;
}

export namespace Table {
  export type AsObject = {
    metadataMap: Array<[string, string]>,
    modelName: string,
    accessToken: string,
    tableMap: Array<[string, Table.Row.AsObject]>,
    columnNamesList: Array<string>,
  }

  export class Row extends jspb.Message {
    getColumnToValueMap(): jspb.Map<string, string>;
    clearColumnToValueMap(): void;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Row.AsObject;
    static toObject(includeInstance: boolean, msg: Row): Row.AsObject;
    static serializeBinaryToWriter(message: Row, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Row;
    static deserializeBinaryFromReader(message: Row, reader: jspb.BinaryReader): Row;
  }

  export namespace Row {
    export type AsObject = {
      columnToValueMap: Array<[string, string]>,
    }
  }

}

