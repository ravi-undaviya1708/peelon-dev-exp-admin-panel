import React, { useEffect, useRef } from "react";
import { Box, ClickAwayListener } from "@mui/material";
import { SlidersHorizontal } from "lucide-react"; // or whichever icon lib you're using
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "react-hook-form";
import MultiSelectCheckbox from "../../../../components/select/MulitSelectCheckBox";
import isEqual from "lodash/isEqual";

function Filters({ dealStageDropdownData, onFiltersChange, selectedFilters = {} }) {
    const [opened, { toggle }] = useDisclosure(false);
    const handleClickAway = () => {
        if (opened) toggle();
    };
    
    const { control, watch, reset} = useForm({});
    const filters = watch();
    const groupedOptions = { stages: dealStageDropdownData };
    const prevFiltersRef = useRef(filters); // Store previous filters

    useEffect(() => {
        // Only call onFiltersChange if filters have changed
        if (!isEqual(filters, prevFiltersRef.current)) {
            onFiltersChange(filters);
            prevFiltersRef.current = filters; // Update previous filters
        }
    }, [filters, onFiltersChange]);

    useEffect(() => {
        if (opened) {
            reset(selectedFilters); // refill selected values when popup is opened
        }
    }, [opened, reset, selectedFilters]);

    return (
        <ClickAwayListener onClickAway={handleClickAway}>
            <Box sx={{ position: "relative", display: "inline-block" }}>
                {/* Toggle Icon Button */}
                <Box
                    onClick={toggle}
                    sx={{
                        cursor: "pointer",
                        display: "inline-block",
                    }}
                >
                    <SlidersHorizontal color="gray" />
                </Box>

                {opened && (
                    <Box
                        sx={{
                            position: "absolute",
                            right: 0,
                            mt: 5,
                            zIndex: 999,
                            borderRadius: "10px",
                            background: "#A5A5A5",
                            padding: "20px",
                        }}
                    >
                        <Box
                            sx={{
                                width: { xs: "250px", sm: "330px" },
                                background: "#fff",
                                borderRadius: "10px",
                                boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
                                padding: "1rem",
                            }}
                        >
                            {Object.entries(groupedOptions).map(([groupName, options]) => (
                                <MultiSelectCheckbox
                                    key={groupName}
                                    name={groupName}
                                    control={control}
                                    label={groupName.charAt(0).toUpperCase() + groupName.slice(1)}
                                    options={options}
                                />
                            ))}

                        </Box>
                    </Box>
                )}
            </Box>
        </ClickAwayListener>
    );
}

export default Filters;
