import AppLayout from "layouts/AppLayout";

const ReviewLayout = (props) => (
  <AppLayout contentBoxProps={{ maxHeight: "calc(100vh - 88px)" }} {...props} />
);

export default ReviewLayout;
