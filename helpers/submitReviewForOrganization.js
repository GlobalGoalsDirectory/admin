import reject from "lodash.reject";
import pick from "lodash.pick";
import uniq from "lodash.uniq";
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
  comment,
  // An array of fields that were not reviewed by a human. For example, these
  // could be fields that are automatically set by the computer, that are
  // directly committed without human review. The main reason for this scenario
  // is that a certain field does not yet have a review step implemented.
  bypass = [],
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
  const {
    reviewedExtractionData,
    lastExtractionData,
    reviewBypass = [],
  } = organization;
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
    reviewBypass: uniq([...reviewBypass, ...bypass]),
  };

  // Add review comment, unless null
  if (comment != null) updateData.comment = comment;

  if (isCompleteReview) {
    updateData.reviewedExtractionData = lastExtractionData;
    updateData.reviewedExtractionDataHash = lastExtractionDataHash;
  } else {
    updateData.reviewedExtractionData = pick(
      lastExtractionData,
      Object.keys(newData)
    );
  }

  // Prepare Fauna actions
  const faunaActions = [
    q.Update(q.Var("ref"), {
      data: remapKeysToDatabase(updateData),
    }),
  ];

  // Clear reviewed extraction data, then set new reviewed extraction data.
  // Essentially, this serves as a replace operation. By default, q.Update will
  // merge the properties of two objects, so if we did not clear it first, we'd
  // end up with old/stale data in the object.
  // See https://forums.fauna.com/t/replace-by-path/169/2 for context.
  if (isCompleteReview)
    faunaActions.unshift(
      q.Update(q.Var("ref"), {
        data: remapKeysToDatabase({ reviewedExtractionData: null }),
      })
    );

  await client.query(
    q.Let(
      { ref: q.Ref(q.Collection("organizations"), organization.faunaId) },
      q.Do(...faunaActions)
    )
  );
};

export default submitReviewForOrganization;
