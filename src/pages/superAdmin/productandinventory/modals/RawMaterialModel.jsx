import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Grid } from "@mui/material";
import StyledModal from "../../../../components/StyledModal";
import { Label16 } from "../../../../components/StyledText";
import { FormInput } from "../../../../components/input/FormInput";
import useApiRequest from "../../../../hooks/useApiRequest";
import useFetchDropdown from "../../../../hooks/useFetchDropdown";
import SingleSelect from "../../../../components/select/SingleSelect";
import { mapApiDataToForm } from "../../../../hooks/mapApiDataToForm";
import { rawMaterialValidation } from "../schema";
import { productInventoryURLS, wareHouseURLS, } from "../../../../services/api/superadminApi";

const initialPayloadsRawMaterial = {
  material_name: "",
  code: "",
  warehouse: "",
  initial_volume: "",
  volume_left: "",
  low_stock: "",
};

const RawMaterialModel = ({ opened, onClose, setLoader, onSuccess, from, setFrom, prefetchRawMaterialDetailData, rawMaterialOptions }) => {
  const { post, put } = useApiRequest();

  const { control, handleSubmit, reset, formState: { isSubmitting, isDirty }, } = useForm({
    defaultValues: initialPayloadsRawMaterial,
    resolver: yupResolver(rawMaterialValidation),
  });

  const { postRawMaterialURL, editRawMaterialDetailURL } = productInventoryURLS;

  useEffect(() => {
    if (from.modal === "editRawMaterial" && prefetchRawMaterialDetailData) {
      const formValues = mapApiDataToForm(
        initialPayloadsRawMaterial,
        prefetchRawMaterialDetailData
      );
      reset({
        ...formValues,
        warehouse:
          prefetchRawMaterialDetailData?.warehouse?.id ||
          prefetchRawMaterialDetailData?.warehouse_id ||
          prefetchRawMaterialDetailData?.warehouse ||
          "",
      });
    }
  }, [prefetchRawMaterialDetailData]);

  const onSubmit = async (data) => {
    setLoader(false);
    const payload = {
      ...data,
      initial_volume: Number(String(data.initial_volume).trim()),
      volume_left: Number(String(data.volume_left).trim()),
      low_stock: Number(String(data.low_stock).trim()),
    };
    let response;
    if (from.modal === "editRawMaterial") {
      response = await put(
        `${editRawMaterialDetailURL}/${prefetchRawMaterialDetailData?.id}`,
        payload
      );
    } else {
      response = await post(postRawMaterialURL, payload);
    }
    if (response.settings.success) {
      setLoader(true);
      toast.success(response.settings.message);
      reset();
      onClose();
      onSuccess();
      setFrom({ rawMaterialId: "" })
    } else {
      toast.error(response.settings.message);
    }
  };

  return (
    <>
      <StyledModal
        opened={opened}
        onClose={onClose}
        title={
          from.modal === "addRawMaterial"
            ? "Add Raw Material"
            : "Edit Raw Material"
        }
        buttonText={
          from.modal === "addRawMaterial" ? "Add Material" : "Edit Material"
        }
        isSubmitting={isSubmitting}
        isDirty={from.modal === "editRawMaterial" && !isDirty}

        formProps={{ onSubmit: handleSubmit(onSubmit) }}
        size="lg"
      >
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6, xl: 6 }}>
            <Box>
              <Label16>Material Name</Label16>
              <FormInput
                control={control}
                name="material_name"
                placeholder="Enter Material Name"
              />
            </Box>
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6, xl: 6 }}>
            <Box>
              <Label16>WareHouse</Label16>
              <SingleSelect
                control={control}
                name="warehouse"
                placeholder="Select Warehouse"
                options={rawMaterialOptions?.data || []}
              />
            </Box>
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6, xl: 6 }}>
            <Box>
              <Label16>Code</Label16>
              <FormInput
                control={control}
                name="code"
                placeholder="Enter Code"
              />
            </Box>
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6, xl: 6 }}>
            <Box>
              <Label16>Initial Volume(in kgs)</Label16>
              <FormInput
                control={control}
                name="initial_volume"
                placeholder="Initial Volume"
              />
            </Box>
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6, xl: 6 }}>
            <Box>
              <Label16>Volume Left</Label16>
              <FormInput
                control={control}
                name="volume_left"
                placeholder="Enter Volume Left"
              />
            </Box>
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6, xl: 6 }}>
            <Box>
              <Label16>Warehouse Location</Label16>
              <Box
                sx={{
                  border: "1px solid #ccc",
                  borderRadius: "6px",
                  padding: "10px",
                  backgroundColor: "#f9f9f9",
                }}
              >
                Visakhapatnam
              </Box>
            </Box>
          </Grid>
           <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6, xl: 6 }}>
            <Box>
              <Label16>Low Stock</Label16>
              <FormInput
                control={control}
                name="low_stock"
                placeholder="Enter Low Stock"
              />
            </Box>
          </Grid>

        </Grid>
      </StyledModal>
    </>
  );
};

export default RawMaterialModel;
