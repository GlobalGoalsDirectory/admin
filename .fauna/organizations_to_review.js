CreateIndex({
  name: "organizations_to_review",
  source: {
    collection: Collection("organizations"),
    fields: {
      reviewed_or_created_at: Query(
        Lambda(
          "doc",
          If(
            Not(IsNull(Select(["data", "reviewed_at"], Var("doc"), null))),
            Select(["data", "reviewed_at"], Var("doc")),
            Select(["data", "created_at"], Var("doc"), "2021-01-01T00:00:00")
          )
        )
      ),
      needs_review: Query(
        Lambda(
          "doc",
          Let(
            {
              has_extraction_hash_changed: Not(
                Equals(
                  Select(
                    ["data", "reviewed_extraction_data_hash"],
                    Var("doc"),
                    null
                  ),
                  Select(
                    ["data", "last_extraction_data_hash"],
                    Var("doc"),
                    null
                  )
                )
              ),
              has_commitment_url: Not(
                IsNull(
                  Select(["data", "data", "commitment_url"], Var("doc"), null)
                )
              ),
              has_commitment_url_been_updated: Not(
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
              ),
            },
            And(
              Var("has_extraction_hash_changed"),
              Or(
                Var("has_commitment_url"),
                Var("has_commitment_url_been_updated")
              )
            )
          )
        )
      ),
    },
  },
  terms: [{ binding: "needs_review" }],
  values: [
    { binding: "reviewed_or_created_at" },
    { field: ["data", "domain"] },
    { field: ["ref"] },
    { field: ["data", "data", "name"] },
    { binding: "needs_review" },
  ],
});
