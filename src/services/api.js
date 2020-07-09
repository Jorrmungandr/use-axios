function useAxios(...methods) {
  if (methods.length === 0) throw new TypeError('Methods array is empty, add an method to `useAxios` parameters');

  const [, setError] = useContext(ErrorContext);

  const functions = methods.map((method) => {
    if (!['get', 'post', 'patch', 'delete'].includes(method)) {
      throw new TypeError(`Invalid method (${method})`);
    }

    return async ({
      url: relativeUrl = '/',
      body = {},
      setState = () => { },
      process = (data) => data,
      success = () => { },
      error = () => { },
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
        const res = await api[method](relativeUrl, ...methodsArguments[method]);

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
        setError({
          type: method,
          message: err.response?.data?.message || err.message,
          status: err.response?.status || false,
          url: relativeUrl,
        });
        return err;
      }
    };
  });

  const first = useCallback(functions[0], []);
  const second = useCallback(functions[1], []);
  const third = useCallback(functions[2], []);
  const fourth = useCallback(functions[3], []);

  return [
    ...(first ? [first] : []),
    ...(second ? [second] : []),
    ...(third ? [third] : []),
    ...(fourth ? [fourth] : []),
  ];
}