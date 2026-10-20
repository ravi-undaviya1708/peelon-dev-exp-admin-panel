import { yupResolver } from "@hookform/resolvers/yup";
import { useSelector } from "react-redux";
import {
  Box,
  Breadcrumbs,
  Grid,
  Typography,
  Link,
  Card,
  CardContent,
} from "@mui/material";
import { PrimaryButton } from "../../../components/StyledButtons";
import { colors } from "../../../constants/constants";
import { Font20, InputLabel16 } from "../../../components/StyledText";
import { FormInput } from "../../../components/input/FormInput";
import SingleSelect from "../../../components/select/SingleSelect";
import { StyledCircularProgress } from "../../../components/StyleCircularProgrerss";
import {
  accountsPathConstants,
  customerPathConstants,
  deliveryDispatchPathConstants,
  factoryPathConstants,
  salesRepresentativePathConstants,
  superAdminPathConstants,
  warehouseManagerPathConstants,
} from "../../../constants/pathConstants";
import { useForm } from "react-hook-form";
import { TextareaInput } from "../../../components/input/TextareaInput";
import { contactusURLS } from "../../../services/api/superadminApi";
import { useLocation, useNavigate } from "react-router-dom";
import useApiRequest from "../../../hooks/useApiRequest";
import { toast } from "react-toastify";
import useFetchList from "../../../hooks/useFetchList";
import { useEffect, useState } from "react";
import { mapApiDataToForm } from "../../../hooks/mapApiDataToForm";
import { contactsValidation } from "./schema";
import useFetchDropdown from "../../../hooks/useFetchDropdown";
import { MultiImageUploadController } from "../../../components/image/MulitImageUpload";
import { useMulitImageArray } from "../../../hooks/useMultiImageArray";

const initialContactPayloads = {
  name_of_poc: "",
  company_name: "",
  company_type: "",
  email: "",
  mobile: "",
  entry_type: "Manual",
  location: "",
  // interested_product: [],
  annual_contract_details:"",
  city: "",
  notes: "",
  upload_document1: null,
  upload_document2: null,
  upload_document3: null,
  upload_document4: null,
  upload_document5: null,
  upload_document6: null,
  upload_document7: null,
  upload_document8: null,
};

const Manual = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loader, setLoader] = useState(true);
  const { contactId, from } = location?.state || "";
  const userType = useSelector((state) => state.auth.userType);
  const pathConstantsByRole = {
    "Super Admin": superAdminPathConstants,
    "Factory Operation": factoryPathConstants,
    "Sales Representative": salesRepresentativePathConstants,
    "Delivery & Dispatch": deliveryDispatchPathConstants,
    "Warehouse Manager": warehouseManagerPathConstants,
    "Accounts": accountsPathConstants,
    "Customer": customerPathConstants,
  };
  const pathConstants = pathConstantsByRole[userType];
  const files = [
    "upload_document1",
    "upload_document2",
    "upload_document3",
    "upload_document4",
    "upload_document5",
    "upload_document6",
    "upload_document7",
    "upload_document8",
  ];
  const { DEFAULT, DASHBOARD, CONTACTS } = pathConstants;
  const {
    postContactusURL,
    getContactDetailsURL,
    editContactURL,
    getProductsDropdownURL,
    getCompanyTypeURL,
    locationDropdwonURL,
  } = contactusURLS;
  const { post, put, filePost, filePut } = useApiRequest();
  const {
    control,
    handleSubmit,
    reset,
    getValues,
    setValue,
    watch,
    formState: { isSubmitting, isDirty, isSubmitted, errors },
  } = useForm({
    defaultValues: initialContactPayloads,
    resolver: yupResolver(contactsValidation),
  });
  //console.log(watch());

  const { data: prefetchContatctDetailData } = useFetchList(
    `${getContactDetailsURL}/${contactId}`,
    {},
    from === "editManual"
  );

  const { data: companyTypeOptions } = useFetchDropdown(
    getCompanyTypeURL,
    "value",
    "key"
  );
  const { data: locationDropdownOptions } = useFetchDropdown(
    locationDropdwonURL,
    "value",
    "key"
  );

  const { handleAddImage, handleDeleteImage } = useMulitImageArray(
    files,
    getValues,
    setValue
  );

  useEffect(() => {
    if (prefetchContatctDetailData && from === "editManual") {
      const formValues = mapApiDataToForm(
        initialContactPayloads,
        prefetchContatctDetailData
      );
      reset({
        ...formValues,
        // interested_product: prefetchContatctDetailData.interested_product?.map(
        //   (item) => item.id
        // ),
        entry_type: prefetchContatctDetailData.entry_type?.key,
        location: prefetchContatctDetailData?.location?.key,
      });
    }
  }, [from, prefetchContatctDetailData, reset]);

  const onSubmitContact = async (data) => {
    let payload = null;
    if (data?.entry_type === "Manual" || "manual") {
      payload = {
        ...data,
        entry_type: "manual",
      };
    }
    setLoader(false);
    let response;
    if (from === "editManual") {
      response = await filePut(
        `${editContactURL}/${prefetchContatctDetailData?.id}`,
        payload,
        files
      );
    } else {
      response = await filePost(postContactusURL, payload);
    }
    if (response.settings.success) {
      reset();
      navigate("../contacts");
      toast.success(response.settings.message);
    } else {
      toast.error(response.settings.message);
    }
  };
  console.log("watch", watch());

  return (
    <>
      <Box component="form" onSubmit={handleSubmit(onSubmitContact)}>
        <Box>
          <Box>
            <Typography
              sx={{
                fontSize: "24px",
                fontWeight: 700,
                color: colors.headingclr,
              }}
            >
              {from === "editManual" ? "Edit Contact" : "Add Contact"}
            </Typography>
            <Breadcrumbs separator="›" aria-label="breadcrumb">
              <Link
                style={{ color: colors.darkgreen, textDecoration: "none" }}
                href={`${DEFAULT}/${DASHBOARD}`}
              >
                <Typography sx={{ fontSize: "14px" }}>Dashbaord</Typography>
              </Link>
              <Link
                style={{ color: colors.darkgreen, textDecoration: "none" }}
                href={`${DEFAULT}/${CONTACTS} `}
              >
                <Typography sx={{ fontSize: "14px" }}>Contacts</Typography>
              </Link>

              <Typography sx={{ fontSize: "14px" }}>
                {from === "editManual" ? "Edit Contact" : "Add Contact"}
              </Typography>
            </Breadcrumbs>
          </Box>
          <Card
            sx={{
              mt: 2,
              boxShadow: "none",
              border: "1px solid #E6E6E6",
              borderRadius: "12px",
            }}
          >
            <CardContent>
              <Box>
                <Box>
                  <Font20>Company Owner Details</Font20>
                </Box>
                <Box mt={1}>
                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4, xl: 4 }}>
                      <Box>
                        <InputLabel16 sx={{ py: 1 }}>Company Name</InputLabel16>
                        <FormInput
                          name="company_name"
                          control={control}
                          placeholder="Enter Company Name"
                        />
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4, xl: 4 }}>
                      <Box>
                        <InputLabel16 sx={{ py: 1 }}>Company Type</InputLabel16>
                        <SingleSelect
                          name="company_type"
                          options={companyTypeOptions}
                          control={control}
                          placeholder="Select Company Type"
                        />
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4, xl: 4 }}>
                      <Box>
                        <InputLabel16 sx={{ py: 1 }}>Mail ID</InputLabel16>
                        <FormInput
                          name="email"
                          control={control}
                          placeholder="Enter Email ID"
                        />
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4, xl: 4 }}>
                      <Box>
                        <InputLabel16 sx={{ py: 1 }}>Mobile</InputLabel16>
                        <FormInput
                          name="mobile"
                          control={control}
                          placeholder="Enter Mobile Number"
                        />
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4, xl: 4 }}>
                      <Box>
                        <InputLabel16 sx={{ py: 1 }}>Location</InputLabel16>
                        <SingleSelect
                          name="location"
                          control={control}
                          placeholder="Select Location"
                          options={locationDropdownOptions}
                        />
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4, xl: 4 }}>
                      <Box>
                        <InputLabel16 sx={{ py: 1 }}>POC Name </InputLabel16>
                        <FormInput
                          name="name_of_poc"
                          control={control}
                          placeholder="Enter POC Name"
                        />
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4, xl: 4 }}>
                      <Box>
                        <InputLabel16 sx={{ py: 1 }}>Entry Type </InputLabel16>
                        <FormInput
                          name="entry_type"
                          control={control}
                          placeholder=""
                          disabled
                        />
                      </Box>
                    </Grid>
                    
                    {/* <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4, xl: 4 }}>
                      <Box>
                        <InputLabel16 sx={{ py: 1 }}>
                          Interested Products{" "}
                        </InputLabel16>
                        <MulitiSelect
                          control={control}
                          isClearable
                          options={productOptions.data}
                          name="interested_product"
                          placeholder="Select products"
                        />
                      </Box>
                    </Grid> */}

                    <Grid size={{ xs: 12 }}>
                      <Box>
                        <InputLabel16 sx={{ py: 1 }}>Address</InputLabel16>
                        <TextareaInput
                          name="city"
                          control={control}
                          placeholder="Enter Address"
                        />
                      </Box>
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                      <Grid size={{ xs: 12 }}>
                        <Box>
                          <InputLabel16 sx={{ py: 1 }}>
                            Upload File
                          </InputLabel16>
                          <MultiImageUploadController
                            control={control}
                            errors={errors?.upload_document}
                            imageKeys={files}
                            getValues={getValues}
                            setValue={setValue}
                            handleAddImage={handleAddImage}
                            handleDeleteImage={handleDeleteImage}
                            isSubmitted={isSubmitted}
                            accept=".pdf,.doc,.docx,image/*"
                          />
                        </Box>
                      </Grid>
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <Box>
                        <InputLabel16 sx={{ py: 1 }}>Notes</InputLabel16>
                        <TextareaInput
                          name="notes"
                          control={control}
                          placeholder="Enter notes"
                        />
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 12}}>
                      <Box>
                        <InputLabel16 sx={{ py: 1 }}>Annual Contract Details </InputLabel16>
                        <TextareaInput
                          name="annual_contract_details"
                          control={control}
                          placeholder="Enter Annual Contract Details"
                        />
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
                <Box mt={4}>
                  <PrimaryButton
                    sx={{ px: 4 }}
                    type="submit"
                    disabled={
                      isSubmitting || (from === "editManual" && !isDirty)
                    }
                  >
                    {from === "editManual" ? "Confirm" : "Add"}
                    {isSubmitting && <StyledCircularProgress />}
                  </PrimaryButton>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </>
  );
};
export default Manual;
