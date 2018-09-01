import {
  cloneDeep,
  forEach,
  isArray,
  isEmpty,
  isEqual,
  isNaN,
  isObject,
  isUndefined,
  mapValues,
  reduce,
  set,
} from "lodash";
import { IFieldAction, IFieldInnerProps, IFieldProps, TFieldValue, TValidator } from "./Field";
import { IFormAction, IFormState, IFormValues, IRxFormProps, TErrors } from "./RxForm";

export const combineValidators = (validators: TValidator[]) => {
  return (value: TFieldValue): string | undefined => {
    return reduce(
      validators,
      (error: string | undefined, validator) => {
        return error || validateField(value, validator);
      },
      undefined,
    );
  };
};

export const isContainError = (formState: IFormState) => {
  return reduce(formState, (result, item) => result || (item.meta && !!item.meta.error), false);
};

export const toFormValues = (formState: IFormState): IFormValues => {
  const formValues = {};
  forEach(formState, (field, key) => {
    if (field) {
      set(formValues, key, field.value);
    }
  });
  return formValues;
};

export const setErrors = (formState: IFormState, errors: TErrors) => {
  if (isEmpty(errors)) {
    return formState;
  }
  return mapValues(formState, (field, name) => {
    return {
      ...field,
      meta: {
        ...field.meta,
        error: errors[name],
      },
    };
  });
};

const formatKeyPath = (key: string) => {
  return !isNaN(parseInt(key, 10)) ? `[${key}]` : key;
};

export const toObjWithKeyPath = (input: IRxFormProps["initialValues"]) => {
  const res = {} as any;
  const toKeyPath = (obj: any, prefix: string = "") => {
    Object.keys(obj).map((key) => {
      const value = obj[key];
      if (isArray(value) || isObject(value)) {
        const suffix = !isArray(value) && isObject(value) ? "." : "";
        toKeyPath(value, prefix + formatKeyPath(key) + suffix);
      } else {
        res[prefix + formatKeyPath(key)] = value;
      }
    });
  };
  toKeyPath(input);
  return res;
};

export const pickInputPropsFromFieldProps = ({ meta: { error }, ...others }: IFieldInnerProps) => {
  return {
    ...others,
    error,
  };
};

export const isDirty = (value: TFieldValue, defaultValue: string) => {
  return !isEqual(value, defaultValue);
};

export const validateField = (value: string | boolean, validate?: IFieldProps["validate"]) => {
  if (isUndefined(validate)) {
    return;
  }

  if (isArray(validate)) {
    return combineValidators(validate)(value);
  }

  if (typeof validate === "function") {
    return validate(value);
  }

  return;
};

export const log = ({
  action,
  prevState,
  nextState,
}: {
  action: IFieldAction | IFormAction;
  prevState: IFormState;
  nextState: IFormState;
}) => {
  if (process.env.NODE_ENV === "development") {
    console.groupCollapsed(`${action.type} ${new Date()}`);
    // use cloneDeep here in case state is a reference type
    console.log("prevState", cloneDeep(prevState));
    console.log("action", cloneDeep(action));
    console.log("nextState", cloneDeep(nextState));
    console.groupEnd();
  }
};
