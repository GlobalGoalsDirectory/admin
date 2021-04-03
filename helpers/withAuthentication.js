import withUser from "helpers/withUser";

// Set up getServerSideProps function
// If user is not authenticated, redirect to login page
// Otherwise, execute user code.
const withAuthentication = (fn) => {
  return withUser(async (params) => {
    if (!params.user)
      return { redirect: { destination: "/login", permanent: false } };

    // Call user-provided function
    return await fn(params);
  });
};

export default withAuthentication;
