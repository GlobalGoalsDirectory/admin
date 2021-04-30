import submitReviewForOrganization from "helpers/submitReviewForOrganization";
import { q, client } from "helpers/fauna";
import getOrganizationByDomain from "helpers/getOrganizationByDomain";

jest.mock("helpers/fauna");
jest.mock("helpers/getOrganizationByDomain");

const organizationInDatabase = {
  ref: 123,
  domain: "test.com",
  data: {},
  lastExtractionData: {
    name: "B",
    about: "hello world",
    address: "street # 123",
  },
  lastExtractionDataHash: "extraction-hash",
  reviewedExtractionData: { name: "A", about: "lorem ipsum" },
  reviewedExtractionDataHash: "reviewed-hash",
  reviewBypass: ["state"],
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
  test("it updates reviewed_extraction_data_hash", async () => {
    await submitReviewForOrganization({
      domain: "test.com",
      newData: { name: "new name", about: "new about", address: "new street" },
      lastExtractionDataHash: "extraction-hash",
      reviewedBy: "user@example.com",
    });

    expect(q.Update.mock.calls[0][1].data).toEqual({
      data: { name: "new name", about: "new about", address: "new street" },
      reviewed_extraction_data: organizationInDatabase.lastExtractionData,
      reviewed_extraction_data_hash: "extraction-hash",
      reviewed_at: expect.anything(),
      reviewed_by: "user@example.com",
      review_bypass: ["state"],
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
      review_bypass: ["state"],
    });

    expect(updateData).not.toHaveProperty("reviewed_extraction_data_hash");
  });
});

describe("when bypassing a field", () => {
  test("it updates review_bypass", async () => {
    await submitReviewForOrganization({
      domain: "test.com",
      newData: { address: "example" },
      lastExtractionDataHash: "extraction-hash",
      reviewedBy: "user@example.com",
      bypass: ["address"],
    });

    expect(q.Update.mock.calls[0][1].data).toEqual({
      data: {
        address: "example",
      },
      reviewed_extraction_data: {
        address: organizationInDatabase.lastExtractionData.address,
      },
      reviewed_at: expect.anything(),
      reviewed_by: "user@example.com",
      review_bypass: ["state", "address"],
    });
  });
});
