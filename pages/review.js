import Link from "next/link";
import { Box, Button, Paper, Typography } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import AppLayout from "layouts/AppLayout";
import { reviewOrganisationUrl } from "helpers/urls";

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
      <Link href={reviewOrganisationUrl(row)} passHref>
        <Button variant="contained" color="primary" size="small">
          Review
        </Button>
      </Link>
    ),
  },
];

const ReviewPage = ({ organizations }) => (
  <AppLayout isAuthenticated={true}>
    <Typography variant="h1" gutterBottom>
      Review
    </Typography>
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
import getOrganizationsToReview from "helpers/getOrganizationsToReview";

export const getServerSideProps = withAuthentication(async () => {
  const organizations = await getOrganizationsToReview();

  return {
    props: {
      organizations,
    },
  };
});

export default ReviewPage;
