import axios from 'axios';

const patch = async ({
  url,
  body,
  headers,
  authentication,
}: {
  url: string;
  body: Object;
  headers: Object;
  authentication: Boolean;
}) => axios.patch(url, body, ...[authentication ? headers : []]);

export default patch;
