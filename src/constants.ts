import { HandlerTypes, QueryFeature } from "./Enums";

export const LOG_COLORS = {
  fgBlack: "\x1b[30m",
  fgRed: "\x1b[31m",
  fgGreen: "\x1b[32m",
  fgYellow: "\x1b[33m",
  fgBlue: "\x1b[34m",
  fgMagenta: "\x1b[35m",
  fgCyan: "\x1b[36m",
  fgWhite: "\x1b[37m",
  fgReset: "\x1b[0m",
};

export const DEFAULT_HANDLERS: HandlerTypes[] = [
  HandlerTypes.INSERT,
  HandlerTypes.PAGINATE,
  HandlerTypes.SHOW,
  HandlerTypes.UPDATE,
  HandlerTypes.PATCH,
  HandlerTypes.DELETE,
];

export const DEFAULT_METHODS_OF_MODELS: string[] = [
  "constructor",
  "hasMany",
  "hasOne",
  "belongsTo",
  "__defineGetter__",
  "__defineSetter__",
  "hasOwnProperty",
  "__lookupGetter__",
  "__lookupSetter__",
  "isPrototypeOf",
  "propertyIsEnumerable",
  "toString",
  "valueOf",
  "toLocaleString",
  "primaryKey",
  "table",
  "fillable",
  "validations",
  "handlers",
  "middlewares",
  "hiddens",
  "createdAtColumn",
  "updatedAtColumn",
  "deletedAtColumn",
  "transaction",
  "ignore",
  "limits",
  "getFillableFields",
  "getValidationRules",
];

export const API_ROUTE_TEMPLATES = {
  [HandlerTypes.INSERT]: (
    prefix: string,
    parentUrl: string,
    resource: string
  ) => `/${prefix}/${parentUrl}${resource}`,
  [HandlerTypes.PAGINATE]: (
    prefix: string,
    parentUrl: string,
    resource: string
  ) => `/${prefix}/${parentUrl}${resource}`,
  [HandlerTypes.ALL]: (prefix: string, parentUrl: string, resource: string) =>
    `/${prefix}/${parentUrl}${resource}/all`,
  [HandlerTypes.SHOW]: (
    prefix: string,
    parentUrl: string,
    resource: string,
    primaryKey: string
  ) => `/${prefix}/${parentUrl}${resource}/:${primaryKey}`,
  [HandlerTypes.UPDATE]: (
    prefix: string,
    parentUrl: string,
    resource: string,
    primaryKey: string
  ) => `/${prefix}/${parentUrl}${resource}/:${primaryKey}`,
  [HandlerTypes.PATCH]: (
    prefix: string,
    parentUrl: string,
    resource: string,
    primaryKey: string
  ) => `/${prefix}/${parentUrl}${resource}/:${primaryKey}`,
  [HandlerTypes.DELETE]: (
    prefix: string,
    parentUrl: string,
    resource: string,
    primaryKey: string
  ) => `/${prefix}/${parentUrl}${resource}/:${primaryKey}`,
  [HandlerTypes.FORCE_DELETE]: (
    prefix: string,
    parentUrl: string,
    resource: string,
    primaryKey: string
  ) => `/${prefix}/${parentUrl}${resource}/:${primaryKey}/force`,
};

export const QueryFeatureMap: Record<QueryFeature, Array<QueryFeature>> = {
  [QueryFeature.FieldsAll]: [QueryFeature.FieldsAll],
  [QueryFeature.Sorting]: [QueryFeature.Sorting],
  [QueryFeature.Limits]: [QueryFeature.Limits],
  [QueryFeature.WhereAll]: [
    QueryFeature.WhereEqual,
    QueryFeature.WhereNotEqual,
    QueryFeature.WhereGt,
    QueryFeature.WhereGte,
    QueryFeature.WhereLt,
    QueryFeature.WhereLte,
    QueryFeature.WhereLike,
    QueryFeature.WhereNotLike,
    QueryFeature.WhereIn,
    QueryFeature.WhereMotIn,
    QueryFeature.WhereBetween,
    QueryFeature.WhereNotBetween,
    QueryFeature.WhereNull,
    QueryFeature.WhereNotNull,
  ],
  [QueryFeature.WhereEqual]: [QueryFeature.WhereEqual],
  [QueryFeature.WhereNotEqual]: [QueryFeature.WhereNotEqual],
  [QueryFeature.WhereGt]: [QueryFeature.WhereGt],
  [QueryFeature.WhereGte]: [QueryFeature.WhereGte],
  [QueryFeature.WhereLt]: [QueryFeature.WhereLt],
  [QueryFeature.WhereLte]: [QueryFeature.WhereLte],
  [QueryFeature.WhereLike]: [QueryFeature.WhereLike],
  [QueryFeature.WhereNotLike]: [QueryFeature.WhereNotLike],
  [QueryFeature.WhereIn]: [QueryFeature.WhereIn],
  [QueryFeature.WhereMotIn]: [QueryFeature.WhereMotIn],
  [QueryFeature.WhereBetween]: [QueryFeature.WhereBetween],
  [QueryFeature.WhereNotBetween]: [QueryFeature.WhereNotBetween],
  [QueryFeature.WhereNull]: [QueryFeature.WhereNull],
  [QueryFeature.WhereNotNull]: [QueryFeature.WhereNotNull],
  [QueryFeature.Trashed]: [QueryFeature.Trashed],
  [QueryFeature.WithAll]: [QueryFeature.WithHasOne, QueryFeature.WithHasMany],
  [QueryFeature.WithHasOne]: [QueryFeature.WithHasOne],
  [QueryFeature.WithHasMany]: [QueryFeature.WithHasMany],
};
