import doNotWaitForEmptyEventLoop from "helpers/doNotWaitForEmptyEventLoop";
import authenticate from "helpers/authenticate";

// Set up getServerSideProps function
// Make user available in params. Is null if not authenticated, else object.
const withUser = (fn) => {
  return async function getServerSideProps(params) {
    doNotWaitForEmptyEventLoop(params);

    // Try to authenticate user
    params.user = await authenticate(params);

    // Call user-provided function
    return await fn(params);
  };
};

export default withUser;
