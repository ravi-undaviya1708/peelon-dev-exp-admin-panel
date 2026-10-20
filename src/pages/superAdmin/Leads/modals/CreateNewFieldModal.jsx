import React from 'react'
import StyledModal from '../../../../components/StyledModal'
import { useForm } from 'react-hook-form'
import { FormInput } from '../../../../components/input/FormInput'

function CreateNewFieldModal({opened,onClose,onCreateField}) {
    const {control,handleSubmit,reset, watch,formState:{isSubmitting}}=useForm({})
    const onSumbit=(data)=>{
        onCreateField(data);
        onClose()
        reset()
    }
    
  return (
   <StyledModal opened={opened} onClose={onClose} title={"Create New Field"} buttonText={"Create"} formProps={{onSubmit:handleSubmit(onSumbit)}}>
    <FormInput
     control={control}
     name="name"
    />
   </StyledModal>
  )
}

export default CreateNewFieldModal