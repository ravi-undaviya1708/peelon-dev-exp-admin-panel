import { Controller } from "react-hook-form";
import {
  Box,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Typography,
} from "@mui/material";

const MulitSelectCheckBox = ({ name, control, options, label }) => {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={[]}
      render={({ field, fieldState: { error } }) => {
        const handleChange = (optionValue) => {
          const newValue = field.value.includes(optionValue)
            ? field.value.filter((v) => v !== optionValue)
            : [...field.value, optionValue];
          field.onChange(newValue);
        };

        return (
          <Box>
            {label && <Typography my="4px" fontWeight="bold">{label}</Typography>}
            <FormGroup>
              {options.map((option, index) => {
                return (
                  <FormControlLabel
                    sx={{
                      marginTop: "-5px",
                      "& .MuiFormControlLabel-label": {
                        fontSize: "14px",
                        marginLeft:"-5px", 
                        color:"#222222"
                      },
                    }}
                    key={option.value}

                    control={
                      <Checkbox
                        size="l3px"
                        checked={field.value.includes(option.value)}
                        onChange={() => handleChange(option.value)}
                      />
                    }
                    label={option.label}
                  />
                );
              })}
            </FormGroup>
            {error && (
              <Typography color="error" fontSize={12}>
                {error.message}
              </Typography>
            )}
          </Box>
        );
      }}
    />
  );
};

export default MulitSelectCheckBox;
