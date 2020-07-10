import axios from 'axios';

const axiosDelete = async ({
  url,
  body,
  headers,
  authentication,
}: {
  url: string;
  body: Object | null;
  headers: Object;
  authentication: Boolean;
}) =>
  axios.delete(url, {
    ...(authentication ? headers : {}),
    data: body,
  });

export default axiosDelete;
