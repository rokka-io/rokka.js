import request from 'request-promise';
import promiseRetry from 'promise-retry';

// When the API sends a 429 back, retry it for 10 times
// This code is mainly copied from
// https://github.com/CanTireInnovations/request-promise-retry/blob/master/index.js

const retryRequest = (promiseRequest) =>
  req => promiseRetry(
      retry => promiseRequest(req)
          .catch(err => {
            if (err.statusCode !== 429) {
              throw err ;
            }
            retry(err);
          })
    ,
    {
      retries: 10,
      minTimeout: 1000,
      maxTimeout: 10000,
      randomize: true
    }
  );


export default retryRequest(request);
