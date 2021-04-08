import useAuth from "helpers/useAuth";

const useUser = () => {
  const auth = useAuth();
  return auth.currentUser();
};

export default useUser;
