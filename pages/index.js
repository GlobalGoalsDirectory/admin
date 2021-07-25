import Link from "next/link";
import { Box, Button, Paper, Typography } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import AppLayout from "layouts/AppLayout";
import ExportOrganizationsButton from "components/ExportOrganizationsButton";
import { viewOrganizationUrl } from "helpers/urls";

const COLUMNS = [
  { field: "id", headerName: "Domain", flex: 1 },
  { field: "name", headerName: "Name", flex: 1 },
  {
    field: "Actions",
    headerName: "",
    sortable: false,
    filterable: false,
    disableColumnMenu: true,
    renderCell: ({ row }) => (
      <Link href={viewOrganizationUrl(row)} passHref>
        <Button variant="contained" color="primary" size="small">
          View
        </Button>
      </Link>
    ),
  },
];

const HomePage = ({ organizations }) => (
  <AppLayout>
    <Box display="flex" alignItems="center">
      <Typography variant="h1" gutterBottom>
        Organizations
      </Typography>
      <Box flexGrow={1} align="right">
        <ExportOrganizationsButton
          organizationIds={organizations.map((org) => org.faunaId)}
        />
      </Box>
    </Box>
    <Box display="flex" flexGrow={1} clone>
      <Paper>
        <DataGrid
          rows={organizations.map((org) => ({ id: org.domain, ...org }))}
          columns={COLUMNS}
          disableSelectionOnClick
          disableColumnSelector={true}
        />
      </Paper>
    </Box>
  </AppLayout>
);

import withAuthentication from "helpers/withAuthentication";
import getPublishedOrganizations from "helpers/getPublishedOrganizations";

export const getServerSideProps = withAuthentication(async () => {
  const organizations = await getPublishedOrganizations();

  return {
    props: {
      organizations,
    },
  };
});

export default HomePage;
