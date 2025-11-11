/**
 * API Endpoints
 */
export const ENDPOINTS = {
  // Routes
  ROUTES: '/routes',
  ROUTES_BASELINE: (routeId: string) => `/routes/${routeId}/baseline`,
  ROUTES_COMPARISON: '/routes/comparison',

  // Compliance
  COMPLIANCE_CB: '/compliance/cb',
  COMPLIANCE_ADJUSTED_CB: '/compliance/adjusted-cb',

  // Banking
  BANKING_RECORDS: '/banking/records',
  BANKING_BANK: '/banking/bank',
  BANKING_APPLY: '/banking/apply',

  // Pooling
  POOLS: '/pools',
};