import Joi from 'joi';

export const toJoiObject = <T extends Joi.PartialSchemaMap<T>>(val?: T): Joi.ObjectSchema<T> => Joi.object({ ...val });

type ExpandRecursively<T> = T extends object
  ? T extends infer O
    ? {
        [K in keyof O]: O[K] extends Joi.ArraySchema
          ? any[]
          : O[K] extends Joi.BooleanSchema
            ? boolean
            : O[K] extends Joi.BinarySchema
              ? Buffer
              : O[K] extends Joi.DateSchema
                ? Date
                : O[K] extends Joi.FunctionSchema
                  ? <I>(...args: any[]) => I
                  : O[K] extends Joi.NumberSchema
                    ? number
                    : O[K] extends Joi.ObjectSchema<any>
                      ? any
                      : O[K] extends Joi.StringSchema
                        ? string
                        : O[K] extends Joi.ObjectSchema
                          ? ExpandRecursively<O[K]>
                          : O[K] extends Joi.AnySchema
                            ? any
                            : O[K];
      }
    : never
  : T;

export type InterfaceFrom<T extends Joi.ObjectSchema<any>> = T extends Joi.ObjectSchema<infer U>
  ? ExpandRecursively<U>
  : never;
