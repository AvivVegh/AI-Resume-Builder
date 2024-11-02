import { isNull, isUndefined } from 'lodash';

export const getRegion = (): string => process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION;

export const isNullOrUndefined = (val: any): boolean => {
  return isNull(val) || isUndefined(val);
};
