import { IVersionConfig, allow, QueryFeature } from "axe-api";

const config: IVersionConfig = {
  transaction: [],
  serializers: [],
  supportedLanguages: ["en", "de"],
  defaultLanguage: "en",
  query: {
    limits: [
      allow(QueryFeature.FieldsAll),
      allow(QueryFeature.WithHasOne),
      allow(QueryFeature.Sorting),
      allow(QueryFeature.WhereAll),
    ],
  },
};

export default config;
