import { Box, Card, CardContent, Divider, Typography } from "@material-ui/core";
import AppLayout from "layouts/AppLayout";
import ReviewImage from "components/ReviewImage";

const ViewDomainPage = ({ organization }) => {
  const { domain, data = {}, comment } = organization;
  const { logo, name, homepage, about, commitment_url } = data;
  const { total_score, sdgs_score } = data;
  const { address, state, country, latitude, longitude } = data;
  const { facebook_handle, twitter_handle, linkedin_handle } = data;

  return (
    <AppLayout>
      <Typography variant="h1" gutterBottom>
        View: {domain}
      </Typography>
      <Card>
        <CardContent>
          <Box marginBottom={1}>
            <ReviewImage value={logo} width={100} height={100} />
          </Box>
          <Box marginBottom={1}>
            <Typography variant="body1">Name: {name}</Typography>
          </Box>
          <Box marginBottom={1}>
            <Typography variant="body1">Homepage: {homepage}</Typography>
          </Box>
          <Box marginBottom={1}>
            <Typography variant="body1">About: {about}</Typography>
          </Box>
          <Box marginBottom={1}>
            <Typography variant="body1">
              Commitment URL: {commitment_url}
            </Typography>
          </Box>

          <Box marginTop={3} marginBottom={1}>
            <Typography variant="h6">SDGs</Typography>
          </Box>
          <Box marginBottom={1}>
            <Typography variant="body1">Total score: {total_score}</Typography>
          </Box>
          <Box marginBottom={1}>
            <Typography variant="body1">SDGs score: {sdgs_score}</Typography>
          </Box>
          {Array.from({ length: 17 }).map((_, i) => (
            <Box marginBottom={1} key={i}>
              <Typography variant="body1">
                SDG {i + 1} score: {data[`sdg${i + 1}_score`]}
              </Typography>
            </Box>
          ))}

          <Box marginTop={3} marginBottom={1}>
            <Typography variant="h6">Location</Typography>
          </Box>
          <Box marginBottom={1}>
            <Typography variant="body1">Address: {address}</Typography>
          </Box>
          <Box marginBottom={1}>
            <Typography variant="body1">State: {state}</Typography>
          </Box>
          <Box marginBottom={1}>
            <Typography variant="body1">Country: {country}</Typography>
          </Box>
          <Box marginBottom={1}>
            <Typography variant="body1">Latitude: {latitude}</Typography>
          </Box>
          <Box marginBottom={1}>
            <Typography variant="body1">Longitude: {longitude}</Typography>
          </Box>

          <Box marginTop={3} marginBottom={1}>
            <Typography variant="h6">Social accounts</Typography>
          </Box>
          <Box marginBottom={1}>
            <Typography variant="body1">
              Facebook handle: {facebook_handle}
            </Typography>
          </Box>
          <Box marginBottom={1}>
            <Typography variant="body1">
              Twitter handle: {twitter_handle}
            </Typography>
          </Box>
          <Box marginBottom={1}>
            <Typography variant="body1">
              Linkedin handle: {linkedin_handle}
            </Typography>
          </Box>

          <Box marginTop={3} marginBottom={1}>
            <Typography variant="h6">Internal</Typography>
          </Box>
          <Box marginBottom={1}>
            <Typography variant="body1">Comments: {comment}</Typography>
          </Box>
        </CardContent>
      </Card>
    </AppLayout>
  );
};

import pick from "lodash.pick";
import withAuthentication from "helpers/withAuthentication";
import getOrganizationByDomain from "helpers/getOrganizationByDomain";

export const getServerSideProps = withAuthentication(async ({ params }) => {
  const organization = await getOrganizationByDomain(params.domain);

  return {
    props: {
      organization: pick(organization, ["domain", "data", "comment"]),
    },
  };
});

export default ViewDomainPage;
