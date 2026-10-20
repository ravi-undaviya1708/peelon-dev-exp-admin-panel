// import { Box, Text } from "@mantine/core";
// import { FileText, Trash } from "lucide-react";
// import { Controller } from "react-hook-form";
// import { useRef } from "react";
// import { BsFilePdf, BsFileWord } from "react-icons/bs";

// export const MultiImageUploadController = ({
//   control,
//   imageKeys,
//   handleAddImage,
//   handleDeleteImage,
//   errors,
//   isSubmitted,
//   accept = "image/*"
// }) => {

//   const fileInputRef = useRef(null);
//   const handleClickUpload = () => {
//     if (fileInputRef.current) {
//       fileInputRef.current.click();
//     }
//   };


//   return (
//     <Box>
//       <Box style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
//         {imageKeys.map((key, index) => (
//           <Controller
//             key={key}
//             name={key}
//             control={control}
//             render={({ field, fieldState }) => {
//               const value = field.value;

//               const fileType = typeof value === "string"
//                 ? value.split('.').pop()?.toLowerCase() // Get file extension from URL
//                 : value?.type || "";

//               // Determine type flags
//               const isImage = typeof value === "string"
//                 ? ["jpg", "jpeg", "png", "gif", "webp", "bmp", "svg"].some(ext => value.toLowerCase().endsWith(ext))
//                 : fileType.startsWith("image/");

//               const isPDF = typeof value === "string"
//                 ? value.toLowerCase().endsWith(".pdf")
//                 : fileType === "application/pdf";

//               const isWord = typeof value === "string"
//                 ? value.toLowerCase().endsWith(".doc") || value.toLowerCase().endsWith(".docx")
//                 : fileType === "application/msword" ||
//                 fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

//               const fileName = typeof value === "string"
//                 ? value.split("/").pop()
//                 : value?.name || "";


//               // Set preview only for images
//               const preview = value
//                 ? typeof value === "string"
//                   ? isImage ? value : null
//                   : isImage ? URL.createObjectURL(value) : null
//                 : null;
//               return (
//                 <Box
//                   onClick={!preview ? handleClickUpload : undefined}
//                   style={{
//                     width: 100,
//                     height: 100,
//                     border: "1px dashed #ccc",
//                     borderRadius: 8,
//                     position: "relative",
//                     overflow: "hidden",
//                     backgroundColor: "#f8f8f8",
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     cursor: "pointer",
//                   }}
//                 >
//                   {value ? (
//                     <>
//                       {preview ? (
//                         <img
//                           src={preview}
//                           alt="Preview"
//                           style={{ width: "100%", height: "100%", objectFit: "cover" }}
//                         />
//                       ) : isPDF ? (
//                         <>
//                           <BsFilePdf size={40} color="red" />
//                           <Text size="xs" align="center">{fileName}</Text>
//                         </>
//                       ) : isWord && (
//                         <>
//                           <BsFileWord size={40} color="blue" />
//                           <Text size="xs" align="center">{fileName}</Text>
//                         </>
//                       )}
//                       <Box style={{ position: "absolute", top: 4, right: 4 }}>
//                         <Trash
//                           size={16}
//                           color="red"
//                           onClick={(e) => {
//                             e.stopPropagation(); // Prevent triggering upload
//                             handleDeleteImage(index);
//                           }}
//                           style={{ cursor: "pointer" }}
//                         />
//                       </Box>
//                     </>
//                   ) : (
//                     <span style={{ fontSize: 12 }}>Upload</span>
//                   )}
//                 </Box>
//               );
//             }}
//           />
//         ))}

//         {/* Hidden input outside Controller */}
//         <input
//           type="file"
//           accept={accept}
//           multiple
//           ref={fileInputRef}
//           style={{ display: "none" }}
//           onChange={(e) => {
//             const file = e.target.files?.[0]
//             e.target.value = "";

//             if (file) {
//               handleAddImage(file);
//             }
//           }}
//         />

//       </Box>

//       <Box>
//         {isSubmitted && errors && (
//           <Text size="xs" style={{ color: "red" }} mt={4}>
//             {errors?.message}
//           </Text>

//         )}
//       </Box>
//     </Box>
//   );
// };


import { Box, Text } from "@mantine/core";
import { FileText, Trash } from "lucide-react";
import { Controller } from "react-hook-form";
import { useRef } from "react";
import { BsFileEarmark, BsFilePdf, BsFileWord } from "react-icons/bs";
import imageCompression from 'browser-image-compression';


export const MultiImageUploadController = ({
  control,
  imageKeys,
  handleAddImage,
  handleDeleteImage,
  errors,
  isSubmitted,
  accept = "image/*",
  height = 100,
  width = 100
}) => {

  const fileInputRef = useRef(null);
  const handleClickUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };


  return (
    <Box>
      <Box style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {imageKeys.map((key, index) => (
          <Controller
            key={key}
            name={key}
            control={control}
            render={({ field, fieldState }) => {
              const value = field.value;

              const fileType = typeof value === "string"
                ? value.split('.').pop()?.toLowerCase()
                : value?.type || "";

              // Determine type flags
              const isImage = typeof value === "string"
                ? ["jpg", "jpeg", "png", "gif", "webp", "bmp", "svg"].some(ext => value.toLowerCase().endsWith(ext))
                : fileType.startsWith("image/");

              const isPDF = typeof value === "string"
                ? value.toLowerCase().endsWith(".pdf")
                : fileType === "application/pdf";

              const isWord = typeof value === "string"
                ? value.toLowerCase().endsWith(".doc") || value.toLowerCase().endsWith(".docx")
                : fileType === "application/msword" ||
                fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

              const fileName = typeof value === "string"
                ? value.split("/").pop()
                : value?.name || "";


              // Set preview only for images
              const preview = value
                ? typeof value === "string"
                  ? isImage ? value : null
                  : isImage ? URL.createObjectURL(value) : null
                : null;
              return (
                <Box
                  onClick={!preview ? handleClickUpload : undefined}
                  style={{
                    width: width,
                    height: height,
                    border: "1px dashed #ccc",
                    borderRadius: 8,
                    position: "relative",
                    overflow: "hidden",
                    backgroundColor: "#f8f8f8",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                >
                  {value ? (
                    <>
                      {preview ? (
                        <img
                          src={preview}
                          alt="Preview"
                          style={{ width: "100%", height: "100%", objectFit: "contain" }}
                        />
                      ) : isPDF ? (
                        <>
                          <BsFilePdf size={40} color="red" />
                          <Text size="xs" align="center">{fileName}</Text>
                        </>
                      ) : isWord && (
                        <>
                          <BsFileEarmark size={40}  />
                          <Text size="xs" align="center">{fileName}</Text>
                        </>
                      )}
                      <Box style={{ position: "absolute", top: 4, right: 4 }}>
                        <Trash
                          size={16}
                          color="red"
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent triggering upload
                            handleDeleteImage(index);
                          }}
                          style={{ cursor: "pointer" }}
                        />
                      </Box>
                    </>
                  ) : (
                    <span style={{ fontSize: 12 }}>Upload</span>
                  )}
                </Box>
              );
            }}
          />
        ))}

        {/* Hidden input outside Controller */}
        <input
          type="file"
          accept={accept}
          multiple
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={async (e) => {
            const file = e.target.files?.[0]
            e.target.value = "";

            if (file) {
              try {
                if (file.type.startsWith("image/")) {
                  const options = {
                    maxSizeMB: 2,
                    maxWidthOrHeight: 1280,
                    useWebWorker: true,
                    initialQuality: 0.6,
                  };

                  const compressedBlob = await imageCompression(file, options);
                  const compressedFile = new File([compressedBlob], file.name, {
                    type: compressedBlob.type,
                    lastModified: Date.now(),
                  });

                  handleAddImage(compressedFile);
                } else {
                  handleAddImage(file);
                }
              } catch (err) {
                console.error("Compression error:", err);
                handleAddImage(file);
              }
            }
          }
          }

        />

      </Box>

      <Box>
        {isSubmitted && errors && (
          <Text size="xs" style={{ color: "red" }} mt={4}>
            {errors?.message}
          </Text>

        )}
      </Box>
    </Box>
  );
};

