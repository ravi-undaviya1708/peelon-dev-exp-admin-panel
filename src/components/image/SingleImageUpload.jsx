
import { useState, useRef, useEffect } from "react";
import { Controller } from "react-hook-form";
import { FileInput, Text } from "@mantine/core";
import { Pencil } from "lucide-react";
import { Typography, Box } from "@mui/material";
import imageCompression from 'browser-image-compression';


export const ImageUpload = ({
  name,
  control,
  accept = "image/*",
  label = "Upload an image",
  placeholder = "Upload an image",
  from,
  isSubmitted,
  errors,
  width = "130px",
  height = "130px"
}) => {
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const value = field.value;
        useEffect(() => {
          if (!value) {
            setPreview(null || from);
            return;
          }
          if (typeof value === "string" && value.startsWith("http")) {
            setPreview(value);
          } else if (value instanceof File) {
            const objectUrl = URL.createObjectURL(value);
            setPreview(objectUrl);
            return () => URL.revokeObjectURL(objectUrl);
          } else {
            setPreview(null);
          }
        }, [value]);

        const openFileDialog = () => {
          if (fileInputRef.current) {
            fileInputRef.current.click();
          }
        };
        // const handleFileChange = (file) => {
        //   if (file) {
        //     field.onChange(file);
        //   } else {
        //     setPreview(from || null);
        //     field.onChange(from);
        //   }
        // };

        const handleFileChange = async (file) => {
          // const file = event.target.files[0];
          if (file) {
            try {
              const options = {
                maxSizeMB: 2,
                maxWidthOrHeight: 1280,
                useWebWorker: true,
                initialQuality: 0.6,
                alwaysKeepResolution: true,
              };
              const compressedBlob = await imageCompression(file, options);
              const compressedFile = new File(
                [compressedBlob],
                file.name,
                { type: compressedBlob.type, lastModified: Date.now() }
              );

              field.onChange(compressedFile);

            } catch (err) {
              console.error("Image compression error:", err);
              field.onChange(file);
            }
          } else {
            setPreview(from || null);
            field.onChange(from);
          }
        };

        return (
          <>
            {/* {label && <Text mb={5}>{label}</Text>} */}
            <Box
              onClick={openFileDialog}
              style={{
                width: width,
                height: height,
                border: "1px dashed #ccc",
                borderRadius: 8,
                cursor: "pointer",
                position: "relative",
                display: "flex",
                backgroundColor: "#f8f8f8",
                justifyContent: "center",
                // overflow:"hidden"
              }}
            >
              {preview ? (
                <>
                  <img
                    src={preview}
                    alt="Preview"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />

                  <Box
                    sx={{
                      backgroundColor: "#D9D9D9",
                      width: "26px",
                      height: "26px",
                      borderRadius: "100px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "absolute",
                      top: -15,
                      right: -30,

                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      openFileDialog();
                    }}
                  >
                    <Box
                      sx={{
                        border: "1px solid black",
                        width: "12px",
                      }}
                    />
                  </Box>

                </>
              ) : (
                <Typography
                  sx={{
                    fontSize: "12px",
                    color: "#666666",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                    padding: "4px",
                  }}
                >
                  {placeholder}
                </Typography>
              )}

            </Box>

            {/* Hidden Mantine FileInput just for logic */}
            <FileInput
              accept={accept}
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            <Box>
              {isSubmitted && errors && (
                <Text size="xs" style={{ color: "red" }} mt={4}>
                  {errors?.message}
                </Text>

              )}
            </Box>
          </>
        );
      }}
    />
  );
};

