import { Model as pb_Model, KVPair, Payload } from "js/generated/modelzoo/protos/services_pb";
import _ from "lodash";

export interface ModelObject {
  name: string;
  metadata: Record<string, string[]>;
}

export function payloadMetadataToRecord(payload: Payload): Record<string, string> | undefined {
  switch (payload.getPayloadCase()) {
    case (Payload.PayloadCase.IMAGE):
      return _.fromPairs(payload.getImage()!.toObject().metadataMap)
    case (Payload.PayloadCase.TABLE):
      return _.fromPairs(payload.getTable()!.toObject().metadataMap)
    case (Payload.PayloadCase.TEXT):
      return _.fromPairs(payload.getText()!.toObject().metadataMap)
    default:
      return undefined
  }
}

function metadataToKV(pairs: KVPair[]): Record<string, string[]> {
  return _.mapValues(
    _.groupBy(pairs, (pair: KVPair) => pair.getKey()),
    (lst: KVPair[]) => {
      return _.map(lst, pair => pair.getValue());
    }
  );
}

export const parseModels = (models: Array<pb_Model>): Array<ModelObject> => {
  return models.map((model: pb_Model, index, array) => {
    return {
      name: model.getModelName(),
      metadata: metadataToKV(model.getMetadataList())
    };
  });
};
