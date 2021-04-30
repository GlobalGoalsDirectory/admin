import { useRouter } from "next/router";
import { useLocalObservable } from "mobx-react-lite";
import { Box, Card, Divider, Typography } from "@material-ui/core";
import ReviewLayout from "layouts/ReviewLayout";
import { setupReviewStore, ReviewStoreProvider } from "stores/reviewStore";
import ReviewStepList from "components/ReviewStepList";
import ReviewStep from "components/ReviewStep";
import ReviewConfirmation from "components/ReviewConfirmation";

const ReviewDomainPage = ({ organization }) => {
  const {
    domain,
    ref,
    data,
    lastExtractionData,
    lastExtractionDataHash,
    reviewedExtractionData,
  } = organization;

  const router = useRouter();
  const reviewStore = useLocalObservable(
    setupReviewStore({
      storedData: data,
      extractedData: lastExtractionData,
      reviewedData: reviewedExtractionData,
    })
  );

  const submitReview = async () => {
    const res = await fetch("/api/review/submit", {
      body: JSON.stringify({
        domain,
        newData: reviewStore.newData,
        lastExtractionDataHash,
      }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    if (!res.ok) {
      const { error } = await res.json();
      throw `An error has occurred: ${error.message}`;
    }

    // Navigate to back to review page
    router.push("/review");
  };

  return (
    <ReviewLayout>
      <Typography variant="h1" gutterBottom>
        Review: {domain}
      </Typography>
      <ReviewStoreProvider store={reviewStore}>
        <Box display="flex" flexDirection="column" flexGrow={1} clone>
          <Card>
            <Box display="flex" flexDirection="row" height={1}>
              <Box width={240}>
                <ReviewStepList />
              </Box>
              <Divider orientation="vertical" />
              <Box flexGrow={1}>
                <ReviewStep field="name" />
                <ReviewStep field="homepage" />
                <ReviewStep field="about" multiline />

                <ReviewStep field="facebook_handle" />
                <ReviewStep field="twitter_handle" />
                <ReviewStep field="linkedin_handle" />
                <ReviewConfirmation submitReview={submitReview} />
              </Box>
            </Box>
          </Card>
        </Box>
      </ReviewStoreProvider>
    </ReviewLayout>
  );
};

import pick from "lodash.pick";
import withAuthentication from "helpers/withAuthentication";
import getOrganizationByDomain from "helpers/getOrganizationByDomain";

export const getServerSideProps = withAuthentication(async ({ params }) => {
  const organization = await getOrganizationByDomain(params.domain);

  return {
    props: {
      organization: pick(organization, [
        "domain",
        "data",
        "lastExtractionData",
        "reviewedExtractionData",
        "lastExtractionDataHash",
      ]),
    },
  };
});

export default ReviewDomainPage;
