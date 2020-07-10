import axios from 'axios';

const get = async ({
  url,
  setState,
  process,
  headers,
  authentication,
}: {
  url: string;
  setState: Function;
  process: Function;
  headers: Object;
  authentication: Boolean;
}) => {
  const res = await axios.get(url, ...[authentication ? headers : []]);

  if (setState) {
    setState(await process(res.data.data));
  } else {
    await process(res.data.data);
  }

  return res;
};

export default get;
