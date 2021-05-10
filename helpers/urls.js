export const reviewOrganizationUrl = ({ domain }) =>
  `/review/${encodeURIComponent(domain)}`;

export const viewOrganizationUrl = ({ domain }) =>
  `/organizations/${encodeURIComponent(domain)}`;
