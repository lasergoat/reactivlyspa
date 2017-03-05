
import get from 'lodash/get';
import axios from 'axios';

export function originUrl() {
  const origin = window.location.href;

  return origin;
}

// send http GET request
export function getRequest(url, options = {}) {
  const request = {
    // map the options to axios
    ...options,
    url,
    method: 'get',
    data: get(options, 'body', {}),
  };

  // return a promise
  return axios(request);
}
