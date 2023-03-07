import { QueryFeature, QueryFeatureType } from "../Enums";
import { IModelService, IQueryLimitConfig } from "../Interfaces";
import { QueryFeatureMap } from "../constants";
import ApiError from "../Exceptions/ApiError";

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

export const valideteQueryFeature = (
  model: IModelService,
  feature: QueryFeature,
  key: string | null = null,
  errorDescription?: string
) => {
  const errorDetail = errorDescription ? ` (${errorDescription})` : "";

  const rules = model.queryLimits.filter(
    (limit) => limit.feature === feature && limit.key === null
  );

  if (key) {
    const keyRules = model.queryLimits.filter(
      (limit) => limit.feature === feature && limit.key === key
    );

    if (keyRules.length > 0) {
      const lastKeyRule = keyRules.at(-1);
      if (lastKeyRule?.type === QueryFeatureType.Deny) {
        throw new ApiError(
          `Unsupported query feature${errorDetail}: ${feature.toString()} [${key}]`
        );
      }
      return;
    }
  }

  if (rules.length === 0) {
    throw new ApiError(
      `Unsupported query feature${errorDetail}: ${feature.toString()}`
    );
  }

  const lastRule = rules.at(-1);
  if (lastRule?.type === QueryFeatureType.Deny) {
    throw new ApiError(
      `Unsupported query feature${errorDetail}: ${feature.toString()}`
    );
  }
};
