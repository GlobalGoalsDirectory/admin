CreateIndex({
  name: "rejected_organizations",
  source: {
    collection: Collection("organizations"),
    fields: {
      is_rejected: Query(
        Lambda(
          "doc",
          And(
            IsNull(
              Select(["data", "data", "commitment_url"], Var("doc"), null)
            ),
            Equals(
              Select(
                ["data", "reviewed_extraction_data", "commitment_url"],
                Var("doc"),
                null
              ),
              Select(
                ["data", "last_extraction_data", "commitment_url"],
                Var("doc"),
                null
              )
            )
          )
        )
      ),
    },
  },
  terms: [{ binding: "is_rejected" }],
  values: [
    { field: ["ts"], reverse: true },
    { field: ["data", "domain"] },
    { field: ["ref"] },
  ],
});
