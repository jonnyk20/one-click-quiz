import { isNil, isEmpty, either } from "ramda";

export const isNilOrEmpty = either(isNil, isEmpty);

export const isNotNilOrEmpty = (arg: any) => !isNilOrEmpty(arg);

export const wait = async (delay: number) => {
  return new Promise(function(resolve) {
    setTimeout(resolve, delay);
  });
};

export const encodeQueryString = (params: any) => {
  const keys: string[] = Object.keys(params);

  if (!isNilOrEmpty(keys)) {
    var esc = encodeURIComponent;
    const paramsString = Object.keys(params)
      .map(k => esc(k) + "=" + esc(params[k]))
      .join("&");
    return `?${paramsString}`;
  }

  return "";
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

export const isDev = window.location.host.includes("localhost");
