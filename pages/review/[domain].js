import { Box, Button, Paper, Typography } from "@material-ui/core";
import AppLayout from "layouts/AppLayout";

const ReviewDomainPage = ({ organization }) => (
  <AppLayout isAuthenticated={true}>
    <Typography variant="h1" gutterBottom>
      Review
    </Typography>
    <Paper>hello {organization.domain}</Paper>
  </AppLayout>
);

import withAuthentication from "helpers/withAuthentication";
import getOrganizationByDomain from "helpers/getOrganizationByDomain";

export const getServerSideProps = withAuthentication(async ({ params }) => {
  const organization = await getOrganizationByDomain(params.domain);

  return {
    props: {
      organization,
    },
  };
});

export default ReviewDomainPage;
