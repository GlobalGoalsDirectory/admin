import submitReviewForOrganization from "helpers/submitReviewForOrganization";
import { q, client } from "helpers/fauna";
import getOrganizationByDomain from "helpers/getOrganizationByDomain";

jest.mock("helpers/fauna");
jest.mock("helpers/getOrganizationByDomain");

const organizationInDatabase = {
  ref: 123,
  domain: "test.com",
  data: {},
  lastExtractionData: { name: "B", about: "hello world" },
  lastExtractionDataHash: "extraction-hash",
  reviewedExtractionData: { name: "A", about: "lorem ipsum" },
  reviewedExtractionDataHash: "reviewed-hash",
};

beforeEach(() => {
  getOrganizationByDomain.mockImplementation(() =>
    Promise.resolve(organizationInDatabase)
  );
});

describe("when submitting invalid lastExtractionDataHash", () => {
  test("it throws an error", async () => {
    await expect(
      submitReviewForOrganization({
        domain: "test.com",
        newData: {},
        lastExtractionDataHash: "abc",
      })
    ).rejects.toThrow("Extraction data hash (abc) does not match.");
  });
});

describe("when performing full review", () => {
  test("it updates reviewed_data_extraction_hash", async () => {
    await submitReviewForOrganization({
      domain: "test.com",
      newData: { name: "new name", about: "new about" },
      lastExtractionDataHash: "extraction-hash",
      reviewedBy: "user@example.com",
    });

    expect(q.Update.mock.calls[0][1].data).toEqual({
      data: { name: "new name", about: "new about" },
      reviewed_extraction_data: organizationInDatabase.lastExtractionData,
      reviewed_extraction_data_hash: "extraction-hash",
      reviewed_at: expect.anything(),
      reviewed_by: "user@example.com",
    });
  });
});

describe("when performing partial review", () => {
  test("it does not update reviewed_extraction_data_hash", async () => {
    await submitReviewForOrganization({
      domain: "test.com",
      newData: { name: "example" },
      lastExtractionDataHash: "extraction-hash",
      reviewedBy: "user@example.com",
    });

    const updateData = q.Update.mock.calls[0][1].data;

    expect(updateData).toEqual({
      data: {
        name: "example",
      },
      reviewed_extraction_data: {
        name: organizationInDatabase.lastExtractionData.name,
      },
      reviewed_at: expect.anything(),
      reviewed_by: "user@example.com",
    });

    expect(updateData).not.toHaveProperty("reviewed_extraction_data_hash");
  });
});
