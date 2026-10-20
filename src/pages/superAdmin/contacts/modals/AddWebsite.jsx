import { FormInput } from '../../../../components/input/FormInput'
import { StyledCircularProgress } from '../../../../components/StyleCircularProgrerss'
import { OutlinedAddButton, PrimaryButton } from '../../../../components/StyledButtons'
import { useForm } from 'react-hook-form'
import { Box, Grid } from '@mui/material'
import { Label16 } from '../../../../components/StyledText'
import StyledModal from '../../../../components/StyledModal'

function AddWebsite({opened,onClose}) {
   const { control, handleSubmit, reset, formState: { isSubmitting } } = useForm({});
      return (
          <StyledModal opened={opened} onClose={onClose} isSubmitting={isSubmitting} title="Add Website" buttonText="Add Website">
              <Box component="form" onSubmit={handleSubmit()}>
                  <Grid container spacing={2} sx={{ borderRadius: "30px" }}>
                      <Grid size={{ xs: 12, md: 6 }}>
                          <Label16>Lead Name</Label16>
                          <FormInput
                              control={control}
                              name="size"
                          />
                      </Grid>
  
                      <Grid size={{ xs: 12, md: 6 }}>
                          <Label16>Company Name</Label16>
                          <FormInput
                              control={control}
                              name="price"
                          />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                          <Label16>Company Type</Label16>
                          <FormInput
                              control={control}
                              name="price"
                          />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                          <Label16>Mail Id</Label16>
                          <FormInput
                              control={control}
                              name="price"
                          />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                          <Label16>Mail Id</Label16>
                          <FormInput
                              control={control}
                              name="price"
                          />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                          <Label16>Mail Id</Label16>
                          <FormInput
                              control={control}
                              name="price"
                          />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                          <Label16>Mail Id</Label16>
                          <FormInput
                              control={control}
                              name="price"
                          />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                          <Label16>Mail Id</Label16>
                          <FormInput
                              control={control}
                              name="price"
                          />
                      </Grid>
  
                  </Grid>
       
              </Box>
          </StyledModal>
  
      )
}

export default AddWebsite