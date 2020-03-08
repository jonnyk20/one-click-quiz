import { isNil, isEmpty, either, pipe, not } from "ramda";

export const isNilOrEmpty = either(isNil, isEmpty);

export const isNotNilOrEmpty = pipe(isNilOrEmpty, not);

export const wait = async (delay: number) => {
  return new Promise(function(resolve) {
    setTimeout(resolve, delay);
  });
};
