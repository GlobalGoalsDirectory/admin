import invert from "lodash.invert";

const DATABASE_KEY_MAP = {
  reviewed_extraction_data: "reviewedExtractionData",
  reviewed_extraction_data_hash: "reviewedExtractionDataHash",
  last_extraction_data: "lastExtractionData",
  last_extraction_data_hash: "lastExtractionDataHash",
  reviewed_at: "reviewedAt",
  reviewed_by: "reviewedBy",
};

const renameKeys = (object, keyMap) => {
  Object.entries(keyMap).forEach(([oldKey, newKey]) => {
    if (!object.hasOwnProperty(oldKey)) return;

    object[newKey] = object[oldKey];
    delete object[oldKey];
  });

  return object;
};

export const remapKeysFromDatabase = (organization) =>
  renameKeys({ ...organization }, DATABASE_KEY_MAP);

export const remapKeysToDatabase = (organization) =>
  renameKeys({ ...organization }, invert(DATABASE_KEY_MAP));
