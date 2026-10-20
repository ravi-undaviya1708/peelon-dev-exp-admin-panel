import { Controller } from "react-hook-form";
import { Radio, Group } from '@mantine/core';

const RadioButton = ({ name, control, label,options }) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Radio.Group
          name={name}
          size="md"
          label={label}
          {...field}
          onChange={field.onChange}
          error={error ? error.message : ''}
        >
          <Group mt="xs">
            {options.map((option)=>(
             <Radio key={option.value}
               label={option.label}
               value={option.value}
             />
            ))}
          </Group>
        </Radio.Group>
      )}
    />
  );
};
export default RadioButton;