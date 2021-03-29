const redirectToLoginPage = () => {
  return { redirect: { destination: "/login", permanent: false } };
};

export default redirectToLoginPage;
