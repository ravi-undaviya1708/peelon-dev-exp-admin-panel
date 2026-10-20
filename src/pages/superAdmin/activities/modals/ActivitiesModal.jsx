import { useFieldArray, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Grid } from "@mui/material";
import StyledModal from "../../../../components/StyledModal";
import { Label16 } from "../../../../components/StyledText";
import { FormInput } from "../../../../components/input/FormInput";
import useApiRequest from "../../../../hooks/useApiRequest";
import SingleSelect from "../../../../components/select/SingleSelect";
import MulitiSelect from "../../../../components/select/MulitSelect";
import { activitiesURLS } from "../../../../services/api/superadminApi";
import { TextareaInput } from "../../../../components/input/TextareaInput";
import { MultiImageUploadController } from "../../../../components/image/MulitImageUpload";
import { useMulitImageArray } from "../../../../hooks/useMultiImageArray";
import { initialPayloadsActivities } from "../initialPayloadsActivities";
import { activityValidation } from "../schema";
import { mapApiDataToForm } from "../../../../hooks/mapApiDataToForm";
import { blobConversion } from "../../../../hooks/blobConversion";
import { IconButton } from "@mui/material";
import { PlusCircleIcon } from "lucide-react";
import { Add, Delete } from "@mui/icons-material";

const ActivitiesModal = ({
  opened,
  onClose,
  onSuccess,
  setFrom,
  from,
  activitiesDropdownData,
  prefetchActivityDetailData,
  usersDropdownData,
  companiesDropdownData,
  leadsDropdownData,
  allUserDropdown,
}) => {
  const { post, put } = useApiRequest();
  const files = ["attachment_1", "attachment_2", "attachment_3"];
  const { postActivitiesURL, editActivityDetailURL } = activitiesURLS;
  const [activities, setActivities] = useState(
    prefetchActivityDetailData?.activity_type,
  );
  const {
    control,
    handleSubmit,
    reset,
    watch,
    getValues,
    setValue,
    formState: { isSubmitting, isSubmitted, errors, isDirty },
  } = useForm({
    defaultValues: initialPayloadsActivities,
    resolver: yupResolver(activityValidation(activities)),
    mode: "onSubmit",
  });

  const { append, remove, fields } = useFieldArray({
    control,
    name: "to_email",
  });
  // console.log("formValues", watch());
  // console.log("errors", errors);

  useEffect(() => {
    if (fields.length === 0) {
      append("");
    }
  }, []);

  const { handleAddImage, handleDeleteImage } = useMulitImageArray(
    files,
    getValues,
    setValue,
  );

  const activityType = watch("activity_type");
  useEffect(() => {
    if (from.modal !== "editActivity") {
      const currentActivityType = getValues("activity_type");
      reset(
        {
          ...initialPayloadsActivities,
          activity_type: currentActivityType,
        },
        {
          keepDirty: false,
          keepTouched: false,
          keepErrors: false,
        },
      );
      setActivities(activityType);
    }
  }, [prefetchActivityDetailData, activityType]);
  console.log("to Email", prefetchActivityDetailData?.to_email);

  useEffect(() => {
    if (from.modal === "editActivity" && prefetchActivityDetailData) {
      const formValues = mapApiDataToForm(
        initialPayloadsActivities,
        prefetchActivityDetailData,
      );

      let toEmailArray = [];
      if (prefetchActivityDetailData.to_email) {
        try {
          toEmailArray = JSON.parse(
            prefetchActivityDetailData.to_email.replace(/'/g, '"'),
          );
        } catch (e) {
          console.error("Invalid to_email format", e);
        }
      }

      reset({
        ...formValues,
        assigned_to:
          prefetchActivityDetailData.assigned_to?.map((item) => item.id) || [],
        linked_to: prefetchActivityDetailData.linked_to?.id || "",
        to_email: toEmailArray,
      });
    }
  }, [prefetchActivityDetailData, reset]);

  const onSubmit = async (data) => {
    const formData = new FormData();
    let response;
    if (from.modal === "editActivity") {
      if (Array.isArray(data.assigned_to)) {
        data.assigned_to.forEach((id, index) => {
          formData.append(`assigned_to[${index}]`, id);
        });
      }

      for (let field in data) {
        let value = data[field];
        if (
          !files.includes(field) &&
          field !== "assigned_to" &&
          field !== "to_email"
        ) {
          formData.append(field, value);
        }

        if (field === "to_email" && value !== "") {
          value.forEach((email) => {
            formData.append("to_email", email);
          });
        }
      }
      const fileData = {};
      console.log("fileData", fileData);

      for (let field of files) {
        fileData[field] = data[field];
      }

      const imageConversionData = await blobConversion(fileData);
      for (const field in imageConversionData) {
        const fileData = imageConversionData[field];
        if (fileData) {
          const { blob, fileName } = fileData;
          formData.append(field, blob, fileName);
        } else {
          formData.append(field, "");
        }
      }
      response = await put(
        `${editActivityDetailURL}/${prefetchActivityDetailData?.id}`,
        formData,
      );
    } else {
      if (Array.isArray(data.assigned_to)) {
        data.assigned_to.forEach((id, index) => {
          formData.append(`assigned_to[${index}]`, id);
        });
      }

      for (let field in data) {
        let value = data[field];
        if (
          value !== null &&
          value !== "" &&
          field !== "assigned_to" &&
          field !== "to_email"
        ) {
          formData.append(field, value);
        }
        if (field === "to_email" && value !== "") {
          value.forEach((email) => {
            formData.append("to_email", email);
          });
        }
      }

      response = await post(postActivitiesURL, formData);
    }

    if (response.settings.success) {
      toast.success(response.settings.message);
      onClose();
      reset();
      onSuccess();
      setFrom({ activityId: "" });
    } else {
      toast.error(response.settings.message);
    }
  };

  return (
    <>
      <StyledModal
        opened={opened}
        onClose={onClose}
        title={from.modal === "addActivity" ? "Add Activity" : "Edit Activity"}
        buttonText={from.modal === "addActivity" ? "ADD" : "Update"}
        isDirty={from?.modal === "editActivity" && !isDirty}
        isSubmitting={isSubmitting}
        formProps={{ onSubmit: handleSubmit(onSubmit) }}
        size="lg"
      >
        <Box
          sx={{
            maxHeight: "500px",
            overflowY: "scroll",
            scrollbarWidth: "none",
          }}
        >
          <Grid container spacing={1}>
            <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6, xl: 6 }}>
              <Box>
                {from.modal === "editActivity" ? (
                  <>
                    <Label16 sx={{ py: 1 }}>Selected Activity</Label16>
                    <FormInput
                      control={control}
                      name="activity_type"
                      type={"text"}
                      placeholder="Select Activity"
                      disabled
                    />
                  </>
                ) : (
                  <>
                    <Label16 sx={{ py: 1 }}>Select Activity</Label16>
                    <SingleSelect
                      control={control}
                      name="activity_type"
                      placeholder="Select Activity Type"
                      options={activitiesDropdownData}
                    />
                  </>
                )}
              </Box>
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6, xl: 6 }}>
              <Box>
                <Label16 sx={{ py: 1 }}>Subject</Label16>
                <FormInput
                  control={control}
                  name="subject"
                  type={"text"}
                  placeholder="Enter Subject"
                />
              </Box>
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6, xl: 6 }}>
              <Box>
                <Label16 sx={{ py: 1 }}>Schedule Date</Label16>
                <FormInput
                  control={control}
                  name="scheduled_time"
                  type={"datetime-local"}
                />
              </Box>
            </Grid>

            <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6, xl: 6 }}>
              <Box>
                <Label16 sx={{ py: 1 }}>Linked To</Label16>
                <SingleSelect
                  control={control}
                  name="linked_to"
                  placeholder={"Select Client"}
                  options={companiesDropdownData}
                />
              </Box>
            </Grid>

            {activities === "meeting" && (
              <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6, xl: 6 }}>
                <Box>
                  <Label16 sx={{ py: 1 }}>Meet Link</Label16>
                  <FormInput
                    control={control}
                    name="activity_link"
                    type={"text"}
                    placeholder={"Enter Meeting Link"}
                  />
                </Box>
              </Grid>
            )}

            {activities === "email" && (
              <>
                {fields.map((field, index) => (
                  <Grid
                    key={field.id}
                    size={{ xs: 12, sm: 12, md: 6, lg: 6, xl: 6 }}
                  >
                    <Box display="flex" alignItems="center" gap={1}>
                      <Box flexGrow={1}>
                        <Label16 sx={{ py: 1 }}>To Email {index + 1}</Label16>
                        <FormInput
                          control={control}
                          name={`to_email.${index}`}
                          type="email"
                          placeholder="Enter Email ID"
                        />
                      </Box>
                      {fields.length > 1 && (
                        <IconButton
                          onClick={() => remove(index)}
                          color="error"
                          size="small"
                          style={{ marginTop: "30px" }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      )}
                    </Box>
                  </Grid>
                ))}

                <Grid size={{ xs: 12 }}>
                  <IconButton
                    onClick={() => append("")}
                    color="primary"
                    size="small"
                  >
                    <PlusCircleIcon fontSize="small" />
                  </IconButton>
                </Grid>
              </>
            )}

            <Grid size={{ xs: 12, md: 12 }}>
              <Box>
                <Label16 sx={{ py: 1 }}>Assigned</Label16>
                <MulitiSelect
                  control={control}
                  name="assigned_to"
                  options={allUserDropdown}
                  placeholder={"Select Assigned"}
                />
              </Box>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Box>
                <Label16 sx={{ py: 1 }}>About </Label16>
                <TextareaInput
                  control={control}
                  name="summary"
                  placeholder={"Enter your summary"}
                />
              </Box>
            </Grid>

            {activities === "email" && (
              <Grid size={{ xs: 12 }}>
                <Box>
                  <Label16 sx={{ py: 1 }}>Attachments</Label16>
                  <MultiImageUploadController
                    control={control}
                    errors={errors?.image_1}
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
            )}
          </Grid>
        </Box>
      </StyledModal>
    </>
  );
};

export default ActivitiesModal;
