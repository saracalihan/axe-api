import { QueryFeature, QueryFeatureType } from "../Enums";
import { IQueryLimitConfig } from "../Interfaces";
import { QueryFeatureMap } from "../constants";

const generatePermission = (
  type: QueryFeatureType,
  feature: QueryFeature,
  fields: string[] | null[] = []
): IQueryLimitConfig[] => {
  const features = QueryFeatureMap[feature];

  if (fields.length === 0) {
    fields = [null];
  }

  return features
    .map((subFeature) => {
      return fields.map((field) => {
        return {
          type,
          feature: subFeature,
          field,
        };
      });
    })
    .flat();
};

export const allow = (
  feature: QueryFeature,
  fields: string[] = []
): IQueryLimitConfig[] => {
  return generatePermission(QueryFeatureType.Allow, feature, fields);
};

export const deny = (
  feature: QueryFeature,
  fields: string[] = []
): IQueryLimitConfig[] => {
  return generatePermission(QueryFeatureType.Deny, feature, fields);
};
