// Disables waiting for empty event loop. This is necessary for support with
// FaunaDB.
const doNotWaitForEmptyEventLoop = ({ req }) => {
  if (req?.netlifyFunctionParams?.context)
    req.netlifyFunctionParams.context.callbackWaitsForEmptyEventLoop = false;
};

export default doNotWaitForEmptyEventLoop;
