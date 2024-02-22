import { Axios } from 'axios';

const Proxy = new Axios({
  responseType: 'blob',
  maxBodyLength: Infinity,
  maxContentLength: Infinity,
});

export default Proxy;
