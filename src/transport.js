import request from 'request-promise';
import promiseRetry from 'promise-retry';
import isDefined from 'check-defined';
import fs from 'fs';


// When the API sends a 429 back, retry it for 10 times
// This code is mainly copied from
// https://github.com/CanTireInnovations/request-promise-retry/blob/master/index.js

var retryRequest = function( promiseRequest ) {
  return function( req ) {

    return promiseRetry(
      function( retry ) {

        return promiseRequest( req )
          .catch( function( err ) {
            if (err.statusCode === 429) {
              //if the request has filedata, reread stream
              if (isDefined(req, 'formData.filedata.value.path')) {
                req.formData.filedata.value = fs.createReadStream(req.formData.filedata.value.path);
              }
              retry(err);
            }
            throw err ;
          } );
      },
      {
        retries: 10,
        minTimeout: 1000,
        maxTimeout: 10000,
        randomize: true
      }
    );
  };
};

export default retryRequest(request);
