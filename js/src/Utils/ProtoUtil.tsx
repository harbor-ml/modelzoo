import { Model as pb_Model, KVPair } from "protos/services_pb";
import _ from "lodash";

export interface ModelObject {
  name: string;
  metadata: Record<string, string[]>;
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
