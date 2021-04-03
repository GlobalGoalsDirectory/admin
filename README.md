The admin dashboard uses the server-to-server Service account authentication
method: https://github.com/googleapis/google-api-nodejs-client#service-account-credentials

You must first create a Google Service Account and then click on "Add Key" under Service Accounts > Keys. Choose JSON format. You must make the private key ID, private key, client email, and client ID available as environment variables (e.g., via the `.env.local` file that is automatically read by Next.js). You can use `.env.local.sample` as a template.

# Setting up Fauna DB

Create an index named `organizations_to_review` with the following binding:

```js
CreateIndex({
  name: "organizations_to_review",
  source: {
    collection: Collection("organizations"),
    fields: {
      needs_review: Query(
        Lambda(
          "doc",
          Not(
            Equals(
              Select(
                ["data", "reviewed_extraction_data_hash"],
                Var("doc"),
                null
              ),
              Select(["data", "last_extraction_data_hash"], Var("doc"), null)
            )
          )
        )
      ),
    },
  },
  terms: [{ binding: "needs_review" }],
  values: [
    { field: ["ref"] },
    { field: ["data", "domain"] },
    { field: ["data", "data", "name"] },
    { binding: "needs_review" },
  ],
});
```
