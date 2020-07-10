import { useCallback } from 'react';
import axios from 'axios';

function useAxios(
  ...methods: Array<'get' | 'patch' | 'delete' | 'post'>
): Array<Function> {
  if (methods.length === 0) {
    throw new Error(
      "Methods array is empty, add an method to useAxios's parameters"
    );
  }

  const functions: Array<Function> = methods.map(method => {
    if (!['get', 'patch', 'post', 'delete'].includes(method)) {
      throw new Error(`Invalid method (${method})`);
    }

    return async ({
      url = '/',
      body = {},
      setState = () => {},
      process = (data: Object) => data,
      success = () => {},
      error = () => {},
    }: {
      url: String;
      body: Object;
      setState: Function;
      process: Function;
      success: Function;
      error: Function;
    }) => {
      try {
        const match = document.cookie.match(/(^| )token=([^;]+)/);
        const token = match ? match[2] : null;
        const headers = { authorization: `Bearer ${token}` };

        const methodsArguments = {
          get: [{ headers }],
          post: [body, { headers }],
          patch: [body, { headers }],
          delete: [{ headers, data: body }],
        };

        const axiosMethod: Function = axios[method];

        const res: any = await axiosMethod(url, ...methodsArguments[method]);

        if (method === 'get') {
          if (setState) {
            setState(await process(res.data.data));
          } else {
            process(res.data.data);
          }
        }

        await success(res, body);
        return res;
      } catch (err) {
        await error(err);
        console.log(err);
        return err;
      }
    };
  });

  const first = useCallback<any>(functions[0], []);
  const second = useCallback<any>(functions[1], []);
  const third = useCallback<any>(functions[2], []);
  const fourth = useCallback<any>(functions[3], []);

  return [
    ...(first ? [first] : []),
    ...(second ? [second] : []),
    ...(third ? [third] : []),
    ...(fourth ? [fourth] : []),
  ];
}

export default useAxios;
