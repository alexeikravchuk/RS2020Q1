import { OMD_API } from '../../../constants';

export default function handleError(err, requesText) {
  let { message } = err;

  if (!OMD_API.errorsMessage[message]) {
    throw Error(message);
  }

  message = `${OMD_API.errorsMessage[err.message]} ${
    message === '404 Not Found' ? '' : `'${requesText}'`
  }`;
  throw Error(message);
}
