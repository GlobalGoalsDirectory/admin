import { useEffect } from "react";
import { useRouter } from "next/router";
import { useLocalObservable } from "mobx-react-lite";
import { Box, Card, Divider, Typography } from "@material-ui/core";
import ReviewLayout from "layouts/ReviewLayout";
import { setupReviewStore, ReviewStoreProvider } from "stores/reviewStore";
import ReviewStepList from "components/ReviewStepList";
import ReviewStep from "components/ReviewStep";
import ReviewConfirmation from "components/ReviewConfirmation";

const FIELDS_TO_BYPASS = [
  "address",
  "state",
  "country",
  "latitude",
  "longitude",
  "total_score",
  "sdgs_score",
  ...Array.from({ length: 17 }).map((_, i) => `sdg${i + 1}_score`),
];

const ReviewDomainPage = ({ organization }) => {
  const {
    domain,
    ref,
    data,
    lastExtractionData,
    lastExtractionDataHash,
    reviewedExtractionData,
    comment,
  } = organization;

  const router = useRouter();
  const reviewStore = useLocalObservable(
    setupReviewStore({
      storedData: data,
      extractedData: lastExtractionData,
      reviewedData: reviewedExtractionData,
    })
  );

  // Some fields (address, SDG scores, ...) are bypassing the human review
  // stage for now. We automatically accept the recommended course of action,
  // i.e., the extracted value if stored === reviewed or, otherwise, the stored
  // value.
  useEffect(() => {
    FIELDS_TO_BYPASS.filter(
      reviewStore.hasValueForFieldChangedSinceLastReview
    ).map((field) => {
      reviewStore.setNewValueForField({
        field,
        newValue: reviewStore.getSuggestedValueForField(field),
      });
    });
  }, []);

  const submitReview = async ({ comment }) => {
    const res = await fetch("/api/review/submit", {
      body: JSON.stringify({
        domain,
        newData: reviewStore.newData,
        lastExtractionDataHash,
        comment,
        bypass: Object.keys(reviewStore.newData).filter((key) =>
          FIELDS_TO_BYPASS.includes(key)
        ),
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
              <Box width={240} minWidth={240}>
                <ReviewStepList />
              </Box>
              <Divider orientation="vertical" />
              <Box flexGrow={1}>
                <ReviewStep field="logo" type="image" />
                <ReviewStep field="name" />
                <ReviewStep field="homepage" />
                <ReviewStep field="about" type="text" />
                <ReviewStep
                  label="Commitment"
                  field="commitment_url"
                  reviewOptions={lastExtractionData.alt_commitment_urls.map(
                    (item, index) => ({
                      label: `Option #${index + 1}`,
                      value: item.url,
                      key: item.url,
                      context: `"...${item.context}..." (count: ${item.count}, tag: ${item.tag})`,
                    })
                  )}
                />

                <ReviewStep field="facebook_handle" />
                <ReviewStep field="twitter_handle" />
                <ReviewStep field="linkedin_handle" />
                <ReviewConfirmation
                  comment={comment}
                  submitReview={submitReview}
                />
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
        "comment",
      ]),
    },
  };
});

export default ReviewDomainPage;
