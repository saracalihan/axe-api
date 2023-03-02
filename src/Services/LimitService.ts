import { QueryFeature, QueryFeatureType } from "../Enums";
import { IQueryLimitConfig } from "../Interfaces";
import { QueryFeatureMap } from "../constants";

const generatePermission = (
  type: QueryFeatureType,
  feature: QueryFeature,
  keys: string[] | null[] = []
): IQueryLimitConfig[] => {
  const features = QueryFeatureMap[feature];

  if (keys.length === 0) {
    keys = [null];
  }

  return features
    .map((subFeature) => {
      return keys.map((key) => {
        return {
          type,
          feature: subFeature,
          key,
        };
      });
    })
    .flat();
};

export const allow = (
  feature: QueryFeature,
  keys: string[] = []
): IQueryLimitConfig[] => {
  return generatePermission(QueryFeatureType.Allow, feature, keys);
};

export const deny = (
  feature: QueryFeature,
  keys: string[] = []
): IQueryLimitConfig[] => {
  return generatePermission(QueryFeatureType.Deny, feature, keys);
};
