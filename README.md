The admin dashboard uses the server-to-server Service account authentication
method: https://github.com/googleapis/google-api-nodejs-client#service-account-credentials

You must first create a Google Service Account and then click on "Add Key" under Service Accounts > Keys. Choose JSON format. You must make the private key ID, private key, client email, and client ID available as environment variables (e.g., via the `.env.local` file that is automatically read by Next.js). You can use `.env.local.sample` as a template.
