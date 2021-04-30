import reject from "lodash.reject";
import pick from "lodash.pick";
import { diff } from "deep-object-diff";
import { q, client } from "helpers/fauna";
import getOrganizationByDomain from "helpers/getOrganizationByDomain";
import { remapKeysToDatabase } from "helpers/organization";
import { isReviewableField } from "helpers/review";

const submitReviewForOrganization = async ({
  domain,
  newData,
  lastExtractionDataHash,
  reviewedBy,
}) => {
  // Verify newData only contains allowed properties
  const forbiddenFields = reject(Object.keys(newData), isReviewableField);
  if (forbiddenFields.length) {
    throw new Error(
      `Fields ${forbiddenFields.join(", ")} are not permitted in review.`
    );
  }

  // Read organization from fauna (recordId)
  const organization = await getOrganizationByDomain(domain);

  // Verify last extraction data hash
  if (organization.lastExtractionDataHash != lastExtractionDataHash) {
    throw new Error(
      `Extraction data hash (${lastExtractionDataHash}) does not match.`
    );
  }

  // Check if review is complete (all fields in need of review have data to
  // update)
  const { reviewedExtractionData, lastExtractionData } = organization;
  const changedFields = diff(reviewedExtractionData, lastExtractionData);
  const fieldsToReview = Object.keys(changedFields).filter(isReviewableField);
  const isCompleteReview = fieldsToReview.every((field) =>
    newData.hasOwnProperty(field)
  );

  // Update data
  const updateData = {
    data: newData,
    reviewedAt: new Date().toISOString(),
    reviewedBy,
  };

  if (isCompleteReview) {
    updateData.reviewedExtractionData = lastExtractionData;
    updateData.reviewedExtractionDataHash = lastExtractionDataHash;
  } else {
    updateData.reviewedExtractionData = pick(
      lastExtractionData,
      Object.keys(newData)
    );
  }

  await client.query(
    q.Update(q.Ref(q.Collection("organizations"), organization.faunaId), {
      data: remapKeysToDatabase(updateData),
    })
  );
};

export default submitReviewForOrganization;
