CreateIndex({
  name: "published_organizations",
  source: {
    collection: Collection("organizations"),
    fields: {
      is_published: Query(
        Lambda(
          "doc",
          And(
            Not(
              IsNull(
                Select(["data", "data", "commitment_url"], Var("doc"), null)
              )
            ),
            Not(IsNull(Select(["data", "data", "name"], Var("doc"), null))),
            Not(IsNull(Select(["data", "data", "homepage"], Var("doc"), null)))
          )
        )
      ),
    },
  },
  terms: [{ binding: "is_published" }],
  values: [
    { field: ["data", "domain"] },
    { field: ["data", "data", "name"] },
    { field: ["ref"] },
  ],
});
