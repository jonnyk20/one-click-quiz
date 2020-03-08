import { isNil, isEmpty, either, pipe, not } from "ramda";

export const isNilOrEmpty = either(isNil, isEmpty);

export const isNotNilOrEmpty = pipe(isNilOrEmpty, not);

export const wait = async (delay: number) => {
  return new Promise(function(resolve) {
    setTimeout(resolve, delay);
  });
};

export const parseQueryString = (s: any): any =>
  s
    .slice(1)
    .split("&")
    .map((queryParam: string) => {
      let pair = queryParam.split("=");
      return { key: pair[0], value: pair[1] };
    })
    .reduce((query: any, pair: any) => {
      pair.key && (query[pair.key] = pair.value);

      return query;
    }, {});
