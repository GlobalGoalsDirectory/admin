const LogoutPage = () => null;

export const getServerSideProps = ({ res }) => {
  res.setHeader(
    "Set-Cookie",
    "nf_jwt=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
  );

  return { redirect: { destination: "/login", permanent: false } };
};

export default LogoutPage;
