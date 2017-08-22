export default function createProvider() {
  const invoke = async (func, data) => {
    const startTime = new Date();
    const callback = (error, response) => {
      if (error) {
        throw new Error(error);
      } else if (response) {
        if (response.headers && response.headers['Content-Type'] === 'application/json') {
          if (response.body) {
            try {
              Object.assign(result, {
                body: JSON.parse(response.body),
              });
            } catch (e) {
              throw new Error('Content-Type of response is application/json but body is not json');
            }
          }
        }
        console.log(JSON.stringify({
          type: 'result',
          data: result
        })); // eslint-disable-line
      }
    };
    const event = data.payload;
    const context = {
      awsRequestId: 'id',
      invokeid: 'id',
      logGroupName: `aws/lambda/${input.functionConfig.lambdaName}`,
      logStreamName: '2015/09/22/[HEAD]13370a84ca4ed8b77c427af260',
      functionVersion: 'HEAD',
      isDefaultFunctionVersion: true,
      functionName: input.functionConfig.lambdaName,
      memoryLimitInMB: '1024',
      succeed(result) {
        return callback(null, result);
      },
      fail(error) {
        return callback(error);
      },
      done(error, result) {
        return callback(error, result);
      },
      getRemainingTimeInMillis() {
        return (new Date()).valueOf() - startTime.valueOf();
      },
    };

    const response = await func(event, context, callback);

  }



  const postInvoke = (data) => {
    const transformedData = R.clone(data);
    const { input } = transformedData;

    if (isProvider('aws', input)) {
      if (transformedData.input.errorData) {
        transformedData.output.errorData = {
          errorMessage: input.errorData,
        };
      }
    }

    transformedData.output.outputData = transformedData.input.outputData;
    return Promise.resolve(transformedData);
  };

  return {
    invoke
  };
}
