import { superAdminURL } from "./api";

export const dashboardURLS = {
  getDashboardURL: `${superAdminURL}/main-dashboard`,
  getfactoryOperationDashboardURL: `${superAdminURL}/factory-operation-dashboard`,
  getRecentLeadsURL: `${superAdminURL}/recent-leads`,
  getOrderOverview: `${superAdminURL}/order-over-views`,
  getClosedDealsURL: `${superAdminURL}/closed-deals`,
  getClosedActivitiesCount: `${superAdminURL}/closed-activities-count`,
  getOpenActivitiesCount: `${superAdminURL}/open-activities-count`,
  closedActivitiesURL: `${superAdminURL}/closed-activities`,
  openActivityURL: `${superAdminURL}/open-activities`,
  getFactoryMenberDashboardTicketsURL: `${superAdminURL}/factory-member-dashboard-tickets`,
  postRaiseTicketURL: `${superAdminURL}/raise-ticket`,
  putRaiseTicketURL: `${superAdminURL}/raise-ticket-detail`,
  allUserURL: `${superAdminURL}/team-users-dropdown`,
  getRaiseTicketURL: `${superAdminURL}/raise-ticket`,
  getModuleDropdownURL: `${superAdminURL}/module-choices-dropdown`,
  getDeliveryTicketsURL: `${superAdminURL}/closed-tickets`,
  getSalesTicketsURL: `${superAdminURL}/delivered-order-ticcket`,
  getAssignedBulkOrdersURL: `${superAdminURL}/assigned-bulk-orders`,
  commonDrodownUrL:`${superAdminURL}/common-dropodown`
};

export const LeadsURLS = {
  postLeadURL: `${superAdminURL}/leads`,
  leadsDashboardURL: `${superAdminURL}/leads-dashboard`,
  getLeadsURL: `${superAdminURL}/leads`,
  editLeadDetailURL: `${superAdminURL}/lead-details`,
  leadSourceDropdownURL: `${superAdminURL}/lead-source-dropdown`,
  leadStageDropdownURL: `${superAdminURL}/lead-stage-dropdown`,
  usersDropdownURL: `${superAdminURL}/users-dropdown`,
  salesRepresentivDropdownURL: `${superAdminURL}/sales-rep-dropdown`,
  leadDetailsURL: `${superAdminURL}/lead-details`,
  convertLeadToDealURL: `${superAdminURL}/convert-lead-to-deal`,
  convertLeadToLostURL: `${superAdminURL}/convert-lead-to-lost`,
  companiesDropdownURL: `${superAdminURL}/companies-dropdown`,
  postCompanyURL: `${superAdminURL}/contact-us`,
  productsDropdownURL: `${superAdminURL}/products-dropdown`,
  locationDropdwonURL: `${superAdminURL}/location-dropdown`,
};

export const DealsURLS = {
  getDealsURL: `${superAdminURL}/deals`,
  getDealDetailsURL: `${superAdminURL}/deals-details`,
  getUsersDropdownURL: `${superAdminURL}/users-dropdown`,
  postDealURL: `${superAdminURL}/deals`,
  getCompaniesDropdownURL: `${superAdminURL}/companies-dropdown`,
  getProductDropdownURL: `${superAdminURL}/products`,
  deleteDealURL: `${superAdminURL}/deals-details`,
  editDealURL: `${superAdminURL}/deals-details`,
  dealStageDropdownURL: `${superAdminURL}/deal-stage-dropdown`,
  dealValueTypeDropdownURL: `${superAdminURL}/deal-valuetype-dropdown`,
  dealSourceDropdownURL: `${superAdminURL}/deal-source-dropdown`,
  locationDropdwonURL: `${superAdminURL}/location-dropdown`,
};

export const activitiesURLS = {
  getActivitiesURL: `${superAdminURL}/create-activity-view`,
  activitiesDropdwonURL: `${superAdminURL}/activity-type-choices`,
  postActivitiesURL: `${superAdminURL}/create-activity-view`,
  companiesDropdownURL: `${superAdminURL}/companies-dropdown`,
  usersDropdownURL: `${superAdminURL}/users-dropdown`,
  activityDetailURL: `${superAdminURL}/activity-detail`,
  editActivityDetailURL: `${superAdminURL}/activity-detail`,
  activityDetailURL: `${superAdminURL}/activity-detail`,
  deletActivityDetailURL: `${superAdminURL}/activity-detail`,
  closedActivityURL: `${superAdminURL}/close-activivty`,
  leadsDropdownURL: `${superAdminURL}/leads-dropdown`,
  allUserURL: `${superAdminURL}/allusers-dropdown`,
};

export const contactusURLS = {
  getContactusURL: `${superAdminURL}/contact-us`,
  postContactusURL: `${superAdminURL}/contact-us`,
  getProductsDropdownURL: `${superAdminURL}/products-dropdown`,
  getContactDetailsURL: `${superAdminURL}/contact-details`,
  deleteContactURL: `${superAdminURL}/contact-details`,
  editContactURL: `${superAdminURL}/contact-details`,
  orderHistroyURL: `${superAdminURL}/company-order-history`,
  getCompanyTypeURL: `${superAdminURL}/company-type`,
  locationDropdwonURL: `${superAdminURL}/location-dropdown`,
};

export const calculatePricingURLS = {
  getCalculatePricingURL: `${superAdminURL}/calculate-pricing`,
  getCalculatePriceLinearURL: `${superAdminURL}/calculate-price-with-linears`,
};

export const ordersURLS = {
  getOrdersURL: `${superAdminURL}/orders`,
  orderUpdateURL: `${superAdminURL}/order-update`,
  paymentStatusURL: `${superAdminURL}/update-payment-status`,
  orderStatusDropdownURL: `${superAdminURL}/orders-status-dropdown`,
  postOrdersURL: `${superAdminURL}/orders`,
  createBulkOrderURL: `${superAdminURL}/create-bulk-order`,
  getWarehousesOptionsURL: `${superAdminURL}/warehouses`,
  companiesDropdownURL: `${superAdminURL}/companies-dropdown`,
  getProductsDropdownURL: `${superAdminURL}/products-dropdown`,
  getUsersDropdownURL: `${superAdminURL}/users-dropdown`,
  deleteOrderDetailURL: `${superAdminURL}/order-detail`,
  orderTypeDropdownURL: `${superAdminURL}/order-type-dropdown`,
  getOrderDetailsURL: `${superAdminURL}/order-detail`,
  factoryDropdownURL: `${superAdminURL}/factory-mem-dropdown`,
  trackingIdEditURL: `${superAdminURL}/order-detail`,
  invoiceDropdownURL: `${superAdminURL}/invoice-dropdown`,
  getCountriesCodeURL: `https://restcountries.com/v3.1/all?fields=name,cca2,idd,flags`,
};

export const customerManagementURLS = {
  getCustomersURL: `${superAdminURL}/customers`,
  getBulkOrderRequestsURL: `${superAdminURL}/bulk-order-requests`,
  postAssignedToURL: `${superAdminURL}/assign-bulk-order-to-sales-person`,
  salesRepresentivDropdownURL: `${superAdminURL}/sales-rep-dropdown`,
  putAssignedToURL: `${superAdminURL}/assigned-bulk-order-details`,
};

export const invoiceURLS = {
  postQuotationURL: `${superAdminURL}/create-quotation-view`,
  putQuotationURL: `${superAdminURL}/quotation-detail`,
  getQuotationURL: `${superAdminURL}/create-quotation-view`,
  usersDropdownURL: `${superAdminURL}/users-dropdown`,
  productsDropdownURL: `${superAdminURL}/products-dropdown`,
  qutoationDetailURL: `${superAdminURL}/quotation-detail`,
  deleteQutatationURL: `${superAdminURL}/quotation-detail`,
  convertStatustURL: `${superAdminURL}/convert-status`,
  downloadQuotationURL: `${superAdminURL}/quotation-pdf`,
  quotationuploadPDFURL: `${superAdminURL}/quotation-upload-pdf`,
  companiesDropdownURL: `${superAdminURL}/companies-dropdown`,
};

export const productInventoryURLS = {
  getBlogs: `${superAdminURL}/blog`,
  postBlogs: `${superAdminURL}/blog`,
  editBlogs: `${superAdminURL}/blog-detail`,
  deleteBlogs: `${superAdminURL}/blog-detail`,
  getProductSizeURL: `${superAdminURL}/size-of-products`,
  getProductInventoryURL: `${superAdminURL}/product-inventory`,
  getProductsURL: `${superAdminURL}/products`,
  productDetailURL: `${superAdminURL}/product-detail`,
  editProductDetailURL: `${superAdminURL}/product-detail`,
  postProductSizeURL: `${superAdminURL}/size-of-products`,
  postProductInventoryURL: `${superAdminURL}/product-inventory`,
  editProductInventoryDetailURL: `${superAdminURL}/product-inventory-detail`,
  postProductsURL: `${superAdminURL}/products`,
  getProductDetailsURL: `${superAdminURL}/product-detail`,
  getRequirementTypesDropdownURL: `${superAdminURL}/requirement-types-dropdown`,
  getWarehousesOptionsURL: `${superAdminURL}/warehouses`,
  getProductTypeChoicesURL: `${superAdminURL}/product-type-choices`,
  productInventoryDetailURL: `${superAdminURL}/product-inventory-detail`,
  sizeOfProductDetailURL: `${superAdminURL}/size-of-product-detail`,
  editSizeOfProductDetailURL: `${superAdminURL}/size-of-product-detail`,
  getRawMaterialURL: `${superAdminURL}/raw-material-inventory`,
  postRawMaterialURL: `${superAdminURL}/raw-material-inventory`,
  getRawMaterialDetailURL: `${superAdminURL}/raw-material-inventory-detail`,
  editRawMaterialDetailURL: `${superAdminURL}/raw-material-inventory-detail`,
  deleteRawMaterialURL: `${superAdminURL}/raw-material-inventory-detail`,
};

export const deliveriesAndDispatchURLS = {
  getDeliveriesOrdersURL: `${superAdminURL}/delivered-orders`,
  getDispatchedOrdersURL: `${superAdminURL}/dispatched-orders`,
  detailDeliveriesAndDispatchURL: `${superAdminURL}/dispatch-delivered-detail`,
  editDeliveriesAndDispatchURL: `${superAdminURL}/dispatchdetails-update`,
  getUsersDropdownURL: `${superAdminURL}/users-dropdown`,
};

export const qualityControlURLS = {
  getQualityURL: `${superAdminURL}/create-quality-control`,
  postQualityURL: `${superAdminURL}/create-quality-control`,
  deleteQualityURL: `${superAdminURL}/quality-control-detail`,
  getQualityDetailURL: `${superAdminURL}/quality-control-detail`,
  editQualityURL: `${superAdminURL}/quality-control-detail`,
  getQualityLevelDropdown: `${superAdminURL}/level-choices-dropdown`,
};

export const wareHouseURLS = {
  getWareHousesURL: `${superAdminURL}/warehouses`,
  postWareHousesURL: `${superAdminURL}/warehouses`,
  deleteWareHousesURL: `${superAdminURL}/warehouse-detail`,
  editWareHousesURL: `${superAdminURL}/warehouse-detail`,
  wareHouseDetailURL: `${superAdminURL}/warehouse-detail`,
  wareHouseDataURL: `${superAdminURL}/ware-house-data`,
};

export const accountsURLS = {
  totalSalesURL: `${superAdminURL}/accounts-dashboard`,
  regionURL: `${superAdminURL}/region-percentage`,
  salesRepresentativeURL: `${superAdminURL}/sales-representative`,
  postStaffURL: `${superAdminURL}/register`,
  factoryMemberURL: `${superAdminURL}/factory-operation-member`,
  staffDetailURL: `${superAdminURL}/sales-representative-detail`,
  editStaffURL: `${superAdminURL}/sales-representative-detail`,
  changeStaffPasswordURL: `${superAdminURL}/change-staff-password`,
};
