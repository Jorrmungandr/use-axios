import axios from 'axios';

const post = async ({
  url,
  body,
  headers,
  authentication,
}: {
  url: string;
  body: Object;
  headers: Object;
  authentication: Boolean;
}) => axios.post(url, body, ...[authentication ? headers : []]);

export default post;
