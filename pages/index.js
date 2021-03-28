import { Box, Button, Paper, Typography } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import AppLayout from "layouts/AppLayout";

const COLUMNS = [
  { field: "id", headerName: "Domain", flex: 1 },
  { field: "name", headerName: "Name", flex: 1 },
  {
    field: "View",
    headerName: "",
    sortable: false,
    filterable: false,
    disableColumnMenu: true,
    renderCell: ({ row }) => (
      <Button variant="contained" color="primary" size="small">
        View
      </Button>
    ),
  },
];

const HomePage = ({ organizations }) => (
  <AppLayout>
    <Typography variant="h1" gutterBottom>
      Organizations
    </Typography>
    <Box display="flex" flexGrow={1} clone>
      <Paper>
        <DataGrid
          rows={organizations}
          columns={COLUMNS}
          disableSelectionOnClick
          disableColumnSelector={true}
        />
      </Paper>
    </Box>
  </AppLayout>
);

import { google } from "googleapis";
import zipObject from "lodash.zipobject";

export async function getServerSideProps(context) {
  // Load organizations from spreadsheet
  const auth = new google.auth.GoogleAuth({
    credentials: {
      type: "service_account",
      project_id: "global-goals-directory",
      private_key_id: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY_ID,
      private_key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY,
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL,
      client_id: process.env.GOOGLE_SERVICE_ACCOUNT_CLIENT_ID,
      auth_uri: "https://accounts.google.com/o/oauth2/auth",
      token_uri: "https://oauth2.googleapis.com/token",
      auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
      client_x509_cert_url:
        "https://www.googleapis.com/robot/v1/metadata/x509/global-goals-directory-admin-d%40global-goals-directory.iam.gserviceaccount.com",
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
    range: "Organizations!A:F",
  });

  const [headerRow, ...dataRows] = response.data.values;
  const data = dataRows.map((dataRow) => zipObject(headerRow, dataRow));

  // Set ID
  data.map((data) => (data.id = data.domain));

  return {
    props: {
      organizations: data,
    },
  };
}

export default HomePage;
