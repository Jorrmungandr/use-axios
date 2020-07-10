import { get, post, patch, remove } from './functions';

interface AxiosBody {
  url: String;
  success: Function;
  error: Function;
}

function useAxios(config: { authentication: Boolean } | null): Object {
  const match = document.cookie.match(/(^| )token=([^;]+)/);
  const token = match ? match[2] : null;
  const headers = { authorization: `Bearer ${token}` };

  const errorCatcher = async (func: Function, params: Object) => {
    try {
      const res = await func({
        ...params,
        headers,
        authentication: config?.authentication,
      });

      return res;
    } catch (err) {
      console.log(err);
      return err;
    }
  };

  const functions = {
    axiosGet: (params: {
      url: string;
      setState: Function;
      process: Function;
    }) => errorCatcher(get, params),

    axiosPost: (params: AxiosBody) => errorCatcher(post, params),

    axiosPatch: (params: AxiosBody) => errorCatcher(patch, params),

    axiosDelete: (params: AxiosBody) => errorCatcher(remove, params),
  };

  return functions;
}

export default useAxios;
