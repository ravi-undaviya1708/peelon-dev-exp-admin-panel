import React, { useEffect, useRef } from "react";
import { Box, ClickAwayListener } from "@mui/material";
import { SlidersHorizontal } from "lucide-react"; // or whichever icon lib you're using
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "react-hook-form";
import MultiSelectCheckbox from "../../../../components/select/MulitSelectCheckBox";
import isEqual from "lodash/isEqual";

function Filters({ onFiltersChange, selectedFilters }) {
    const [opened, { toggle }] = useDisclosure(false);

    const { control, reset, watch, formState: { isSubmitting } } = useForm();
    const handleClickAway = () => {
        if (opened) toggle();
    };
    const filters = watch();
    const prevFiltersRef = useRef(filters);

    useEffect(() => {
        if (!isEqual(filters, prevFiltersRef.current)) {
            onFiltersChange(filters);
            prevFiltersRef.current = filters;
        }
    }, [filters, onFiltersChange]);

    useEffect(() => {
        reset(selectedFilters)
    }, [opened, reset, selectedFilters])

    const headingLabelMap = {
        source: "Lead Source",
        lead: "Lead Stage",
        type: "Company Type"
    };

    const groupedOptions = {
        source: [
            { label: "Web", value: "web_forms" },
            { label: "Manual", value: "manual_entries" },
        ],

        lead: [
            { label: "Identified", value: "identified" },
            { label: "Qualified", value: "qualified" },
            { label: "Call Scheduled", value: "call scheduled"},
            { label: "Lost Leads", value: "lost" },
        ],

        type: [
            { label: "Retailer", value: "retailer" },
            { label: "Whole Seller", value: "whole_seller" }
        ]
    };

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
                                width: "200px",
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
                                    label={headingLabelMap[groupName] || groupName.charAt(0).toUpperCase() + groupName.slice(1)}
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
