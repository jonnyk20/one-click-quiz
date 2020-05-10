import { isNil, isEmpty, either } from 'ramda';

export const isNilOrEmpty = either(isNil, isEmpty);

export const isNotNilOrEmpty = (arg: any) => !isNilOrEmpty(arg);

export const wait = async (ms: number) => {
  return new Promise(function (resolve) {
    setTimeout(resolve, ms);
  });
};
