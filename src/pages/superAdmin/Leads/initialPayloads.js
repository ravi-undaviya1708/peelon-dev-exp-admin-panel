export const initialLeadPayload = {
  company: "",
  description: "",
  website: "",
  follow_up_details: "",
  location: "",
  lead_source: "",
  lead_stage: "",
  last_follow_up: "",
  next_follow_up: "",
  assigned_sales_representative: "",
  interested_product: [],
  lead_by_team: "",
  trail_data: "",
  volume_of_produce: "",
  monthly_order_size: "",
  volume_units: "",
};

export const initialAddCompanyPayload = {
  name_of_poc: "",
  company_name: "",
  company_type: "",
  email: "",
  mobile: "",
  description: "",
  entry_type: "",
  location: "",
  city: "",
};

export const volumeUnitsOptions = [
  { label: "KGS", value: "KGS" },
  { label: "TONS", value: "TONS" },
];

export const currencyOptions = [
  { label: "USD", value: "USD" },
  { label: "INR", value: "INR" },
];
