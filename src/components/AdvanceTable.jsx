import React from "react";
import {
  Box,
  Button,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
  useTheme,
  Card,
  CardContent,
} from "@mui/material";
import {
  CornerUpRight,
  Eye,
  Handshake,
  Pencil,
  Trash2,
  Upload,
  UserCheck,
  UserMinus,
  XCircle,
} from "lucide-react";
import { colors, remValues } from "../constants/constants";
import { Menu } from "@mantine/core";
import { BsThreeDotsVertical } from "react-icons/bs";
import { StyledNoData } from "./StyledNoData";

export const AdvancedTable = ({
  columns = [],
  data = [],
  isAction = false,
  onEdit,
  onAssigneTo,
  isText,
  onDelete,
  page,
  totalPages,
  onView,
  isView = false,
  onPageChange,
  onDeal,
  onLost,
  onClosedActivity = false,
  convertPurchase = false,
  convertInvoice = false,
  uploadQuotation = false,
  maxHeight = 520,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const hasActionCol = Boolean(isAction || isText);
  const totalCols = columns.length + (hasActionCol ? 1 : 0);

  // Dynamic minimum table width based on columns configuration
  const calculatedMinWidth = columns.reduce((acc, col) => {
    if (col.width && typeof col.width === "number") return acc + col.width;
    if (col.minWidth && typeof col.minWidth === "number") return acc + col.minWidth;
    if (typeof col.width === "string" && col.width.endsWith("px")) {
      return acc + (parseInt(col.width, 10) || 140);
    }
    if (typeof col.minWidth === "string" && col.minWidth.endsWith("px")) {
      return acc + (parseInt(col.minWidth, 10) || 140);
    }
    return acc + 140; // Default readable column width
  }, hasActionCol ? 80 : 0);

  const minTableWidth = Math.max(700, calculatedMinWidth);

  const cellFontSize = isTablet ? "0.75rem" : "0.813rem";
  const cellPadding = isTablet ? "10px 8px" : "12px 14px";

  const headerCellSx = {
    fontSize: cellFontSize,
    padding: cellPadding,
    whiteSpace: "nowrap",
    backgroundColor: "#FFFDF3",
    color: colors.headingclr || "#222222",
    fontWeight: 600,
    borderBottom: "1px solid #E6E6E6",
  };

  const bodyCellSx = {
    fontSize: cellFontSize,
    padding: cellPadding,
    color: colors.greey || "#666666",
    fontWeight: 500,
    verticalAlign: "middle",
    borderBottom: "1px solid #F0F0F0",
  };

  return (
    <>
      {!isMobile ? (
        <Box sx={{ width: "100%", overflow: "hidden" }}>
          <TableContainer
            sx={{
              maxHeight: maxHeight,
              overflowY: "auto",
              overflowX: "auto",
              borderRadius: "12px",
              border: "1px solid #E6E6E6",
              backgroundColor: "#FFFFFF",
              "&::-webkit-scrollbar": {
                width: "8px",
                height: "8px",
              },
              "&::-webkit-scrollbar-track": {
                background: "#F5F5F5",
                borderRadius: "10px",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "#C1C1C1",
                borderRadius: "10px",
                "&:hover": {
                  background: "#A0A0A0",
                },
              },
            }}
          >
            <Table stickyHeader sx={{ width: "100%", minWidth: minTableWidth }}>
              <TableHead>
                <TableRow>
                  {columns.map((col) => (
                    <TableCell
                      key={`head-${col.key}`}
                      align={col.align || "left"}
                      sx={{
                        ...headerCellSx,
                        minWidth: col.minWidth || "120px",
                        width: col.width || "auto",
                        maxWidth: col.maxWidth || "none",
                      }}
                    >
                      {col.name}
                    </TableCell>
                  ))}

                  {hasActionCol && (
                    <TableCell
                      key="head-actions"
                      align="center"
                      sx={{
                        ...headerCellSx,
                        width: 80,
                        minWidth: 80,
                        maxWidth: 80,
                        color: "#333333",
                        fontWeight: 600,
                      }}
                    >
                      Actions
                    </TableCell>
                  )}
                </TableRow>
              </TableHead>

              <TableBody sx={{ backgroundColor: "white" }}>
                {data && data.length > 0 ? (
                  data.map((row, rowIndex) => {
                    const rowKey = row.id ?? `row-${rowIndex}`;
                    return (
                      <TableRow
                        key={rowKey}
                        hover
                        sx={{
                          "&:hover": {
                            backgroundColor: "#F9FAF9",
                            "& .delete-icon": {
                              color: "#153A1A",
                              fill: "#153A1A",
                            },
                          },
                        }}
                      >
                        {columns.map((col) => {
                          const cellKey = `cell-${rowKey}-${col.key ?? rowIndex}`;
                          const rawValue = col.renderFunction
                            ? col.renderFunction(row, rowIndex)
                            : typeof row[col.key] === "object" && row[col.key] !== null
                              ? "-"
                              : row[col.key];

                          const isNullOrUndefined =
                            rawValue === null ||
                            rawValue === undefined ||
                            rawValue === "";
                          const cellValue = isNullOrUndefined ? "-" : rawValue;

                          return (
                            <TableCell
                              key={cellKey}
                              align={col.align || "left"}
                              sx={{
                                ...bodyCellSx,
                                minWidth: col.minWidth || "120px",
                                width: col.width || "auto",
                                maxWidth: col.maxWidth || "none",
                                whiteSpace: col.wrap ? "normal" : "nowrap",
                              }}
                            >
                              {React.isValidElement(cellValue) ? (
                                cellValue
                              ) : (
                                <Typography
                                  component="div"
                                  sx={{
                                    fontSize: "inherit",
                                    color: "inherit",
                                    fontWeight: "inherit",
                                    textTransform: col.capitalize ? "capitalize" : "none",
                                    whiteSpace: col.wrap ? "normal" : "nowrap",
                                    wordBreak: col.wrap ? "break-word" : "normal",
                                    overflow: col.wrap ? "visible" : "hidden",
                                    textOverflow: col.wrap ? "clip" : "ellipsis",
                                    maxWidth: col.maxWidth || "none",
                                  }}
                                >
                                  {cellValue}
                                </Typography>
                              )}
                            </TableCell>
                          );
                        })}

                        {hasActionCol && (
                          <TableCell
                            align="center"
                            sx={{
                              ...bodyCellSx,
                              width: 80,
                              minWidth: 80,
                              maxWidth: 80,
                              padding: "6px 4px",
                            }}
                          >
                            {isAction ? (
                              <Menu shadow="md" width={200} position="bottom-end">
                                <Menu.Target>
                                  <Button
                                    variant="text"
                                    sx={{
                                      minWidth: "auto",
                                      padding: "4px",
                                      "&:hover": {
                                        backgroundColor: "rgba(0, 0, 0, 0.04)",
                                      },
                                    }}
                                  >
                                    <BsThreeDotsVertical color="grey" fontSize={16} />
                                  </Button>
                                </Menu.Target>

                                <Menu.Dropdown>
                                  {onEdit && (
                                    <Menu.Item
                                      leftSection={<Pencil size={16} color="gray" />}
                                      onClick={() => onEdit(row, rowIndex)}
                                      style={{ color: "gray" }}
                                    >
                                      Edit
                                    </Menu.Item>
                                  )}
                                  {(onView || isView) && (
                                    <Menu.Item
                                      leftSection={
                                        <Eye size={16} style={{ color: "gray" }} />
                                      }
                                      onClick={() => onView && onView(row, rowIndex)}
                                      style={{ color: "gray" }}
                                    >
                                      View
                                    </Menu.Item>
                                  )}
                                  {convertPurchase && row?.status === "quotation" && (
                                    <Menu.Item
                                      leftSection={
                                        <CornerUpRight
                                          size={16}
                                          style={{ color: "gray" }}
                                        />
                                      }
                                      onClick={() => convertPurchase(row, rowIndex)}
                                      style={{ color: "gray" }}
                                    >
                                      Convert To Purchase Order
                                    </Menu.Item>
                                  )}
                                  {convertInvoice && row?.status !== "invoice" && (
                                    <Menu.Item
                                      leftSection={
                                        <CornerUpRight
                                          size={16}
                                          style={{ color: "gray" }}
                                        />
                                      }
                                      onClick={() => convertInvoice(row, rowIndex)}
                                      style={{ color: "gray" }}
                                    >
                                      Convert To Invoice Order
                                    </Menu.Item>
                                  )}
                                  {uploadQuotation && (
                                    <Menu.Item
                                      leftSection={
                                        <Upload size={16} style={{ color: "gray" }} />
                                      }
                                      onClick={() => uploadQuotation(row, rowIndex)}
                                      style={{ color: "gray" }}
                                    >
                                      Upload Quotation
                                    </Menu.Item>
                                  )}
                                  {onDeal && (
                                    <Menu.Item
                                      leftSection={
                                        <Handshake
                                          size={16}
                                          style={{ color: "gray" }}
                                        />
                                      }
                                      onClick={() => onDeal(row, rowIndex)}
                                      style={{ color: "gray" }}
                                    >
                                      Convert to Deal
                                    </Menu.Item>
                                  )}
                                  {onLost && (
                                    <Menu.Item
                                      leftSection={
                                        <UserMinus
                                          size={16}
                                          style={{ color: "gray" }}
                                        />
                                      }
                                      onClick={() => onLost(row, rowIndex)}
                                      style={{ color: "gray" }}
                                    >
                                      Convert to Lost
                                    </Menu.Item>
                                  )}
                                  {onClosedActivity && (
                                    <Menu.Item
                                      leftSection={
                                        <XCircle
                                          size={16}
                                          style={{ color: "gray" }}
                                        />
                                      }
                                      onClick={() => onClosedActivity(row, rowIndex)}
                                      style={{ color: "gray" }}
                                    >
                                      Close Activity
                                    </Menu.Item>
                                  )}
                                  {onAssigneTo && (
                                    <Menu.Item
                                      leftSection={
                                        <UserCheck
                                          size={16}
                                          style={{ color: "gray" }}
                                        />
                                      }
                                      onClick={() => onAssigneTo(row, rowIndex)}
                                      style={{ color: "gray" }}
                                    >
                                      Assign To
                                    </Menu.Item>
                                  )}
                                  {onDelete && (
                                    <Menu.Item
                                      leftSection={<Trash2 size={16} color="gray" />}
                                      onClick={() => onDelete(row, rowIndex)}
                                      style={{ color: "gray" }}
                                    >
                                      Delete
                                    </Menu.Item>
                                  )}
                                </Menu.Dropdown>
                              </Menu>
                            ) : (
                              "-"
                            )}
                          </TableCell>
                        )}
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={totalCols} align="center" sx={{ py: 4 }}>
                      <StyledNoData />
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {totalPages > 1 && (
            <Box
              sx={{
                display: "flex",
                flexDirection: isTablet ? "column" : "row",
                justifyContent: "space-between",
                padding: isTablet
                  ? "12px 8px"
                  : `${remValues.rem12 || "12px"} ${remValues.rem16 || "16px"}`,
                alignItems: "center",
                gap: isTablet ? 2 : 0,
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{ fontSize: isTablet ? "0.813rem" : "1rem", whiteSpace: "nowrap" }}
              >
                Page <strong>{page}</strong> of <strong>{totalPages}</strong>
              </Typography>
              <Pagination
                page={page}
                onChange={(_event, value) => onPageChange(value)}
                count={totalPages}
                showFirstButton
                showLastButton
                size={isTablet ? "small" : "medium"}
                sx={{
                  "& .MuiPaginationItem-root": {
                    fontSize: isTablet ? "0.7rem" : "0.875rem",
                    minWidth: isTablet ? "26px" : "32px",
                    height: isTablet ? "26px" : "32px",
                  },
                }}
              />
            </Box>
          )}
        </Box>
      ) : (
        /* ── Mobile: card layout ── */
        <Box display="flex" flexDirection="column" gap={2} p={1}>
          {data && data.length > 0 ? (
            data.map((row, rowIndex) => (
              <Card
                key={row.id || rowIndex}
                sx={{
                  borderRadius: "12px",
                  border: "1px solid #E6E6E6",
                  backgroundColor: "#FFFDF3",
                  boxShadow: "0px 1px 4px rgba(0, 0, 0, 0.05)",
                }}
              >
                <CardContent>
                  {columns.map((col) => {
                    const rawValue = col.renderFunction
                      ? col.renderFunction(row, rowIndex)
                      : typeof row[col.key] === "object" && row[col.key] !== null
                        ? "-"
                        : row[col.key];

                    const isNullOrUndefined =
                      rawValue === null ||
                      rawValue === undefined ||
                      rawValue === "";
                    const cellValue = isNullOrUndefined ? "-" : rawValue;

                    return (
                      <Box key={col.key} mb={1}>
                        <Typography
                          variant="subtitle2"
                          sx={{
                            color: colors.headingclr,
                            fontWeight: 600,
                            fontSize: "0.75rem",
                          }}
                        >
                          {col.name}
                        </Typography>
                        {React.isValidElement(cellValue) ? (
                          cellValue
                        ) : (
                          <Typography
                            variant="body2"
                            sx={{
                              color: "#666666",
                              fontWeight: 500,
                              fontSize: "0.813rem",
                              wordBreak: "break-word",
                            }}
                          >
                            {cellValue}
                          </Typography>
                        )}
                      </Box>
                    );
                  })}

                  {isAction && (
                    <Box mt={2} display="flex" flexWrap="wrap" gap={1}>
                      {onEdit && (
                        <Button
                          onClick={() => onEdit(row, rowIndex)}
                          size="small"
                          variant="contained"
                          sx={{
                            backgroundColor: "#16A14E",
                            color: "white",
                            fontSize: "0.7rem",
                            padding: "4px 8px",
                            textTransform: "none",
                          }}
                          startIcon={<Pencil size={12} />}
                        >
                          Edit
                        </Button>
                      )}
                      {onAssigneTo && (
                        <Button
                          onClick={() => onAssigneTo(row, rowIndex)}
                          size="small"
                          variant="contained"
                          startIcon={<UserCheck size={12} />}
                          sx={{
                            backgroundColor: "#F59E0B",
                            color: "#FFFFFF",
                            fontSize: "0.7rem",
                            padding: "4px 10px",
                            textTransform: "none",
                            minWidth: "auto",
                            "&:hover": { backgroundColor: "#D97706" },
                            "&:active": { backgroundColor: "#B45309" },
                            "&.Mui-disabled": {
                              backgroundColor: "#FDE68A",
                              color: "#92400E",
                            },
                          }}
                        >
                          Assign To
                        </Button>
                      )}
                      {onDelete && (
                        <Button
                          onClick={() => onDelete(row, rowIndex)}
                          size="small"
                          variant="contained"
                          color="error"
                          sx={{
                            fontSize: "0.7rem",
                            padding: "4px 8px",
                            textTransform: "none",
                          }}
                          startIcon={<Trash2 size={12} />}
                        >
                          Delete
                        </Button>
                      )}
                      {(onView || isView) && (
                        <Button
                          onClick={() => onView && onView(row, rowIndex)}
                          size="small"
                          variant="outlined"
                          sx={{
                            borderColor: "#999",
                            color: "#444",
                            fontSize: "0.7rem",
                            padding: "4px 8px",
                            textTransform: "none",
                          }}
                          startIcon={<Eye size={12} />}
                        >
                          View
                        </Button>
                      )}
                      {onDeal && (
                        <Button
                          onClick={() => onDeal(row, rowIndex)}
                          size="small"
                          variant="outlined"
                          sx={{
                            borderColor: "#999",
                            color: "#444",
                            fontSize: "0.7rem",
                            padding: "4px 8px",
                            textTransform: "none",
                          }}
                          startIcon={<Handshake size={12} />}
                        >
                          Deal
                        </Button>
                      )}
                      {onLost && (
                        <Button
                          onClick={() => onLost(row, rowIndex)}
                          size="small"
                          variant="outlined"
                          sx={{
                            borderColor: "#999",
                            color: "#444",
                            fontSize: "0.7rem",
                            padding: "4px 8px",
                            textTransform: "none",
                          }}
                          startIcon={<UserMinus size={12} />}
                        >
                          Lost
                        </Button>
                      )}
                      {onClosedActivity && (
                        <Button
                          onClick={() => onClosedActivity(row, rowIndex)}
                          size="small"
                          variant="outlined"
                          sx={{
                            borderColor: "#999",
                            color: "#444",
                            fontSize: "0.7rem",
                            padding: "4px 8px",
                            textTransform: "none",
                          }}
                          startIcon={<XCircle size={12} />}
                        >
                          Close
                        </Button>
                      )}
                      {convertPurchase && row?.status === "quotation" && (
                        <Button
                          onClick={() => convertPurchase(row, rowIndex)}
                          size="small"
                          variant="outlined"
                          sx={{
                            borderColor: "#999",
                            color: "#444",
                            fontSize: "0.7rem",
                            padding: "4px 8px",
                            textTransform: "none",
                          }}
                          startIcon={<CornerUpRight size={12} />}
                        >
                          Purchase
                        </Button>
                      )}
                      {convertInvoice && row?.status !== "invoice" && (
                        <Button
                          onClick={() => convertInvoice(row, rowIndex)}
                          size="small"
                          variant="outlined"
                          sx={{
                            borderColor: "#999",
                            color: "#444",
                            fontSize: "0.7rem",
                            padding: "4px 8px",
                            textTransform: "none",
                          }}
                          startIcon={<CornerUpRight size={12} />}
                        >
                          Invoice
                        </Button>
                      )}
                      {uploadQuotation && (
                        <Button
                          onClick={() => uploadQuotation(row, rowIndex)}
                          size="small"
                          variant="outlined"
                          sx={{
                            borderColor: "#999",
                            color: "#444",
                            fontSize: "0.7rem",
                            padding: "4px 8px",
                            textTransform: "none",
                          }}
                          startIcon={<Upload size={12} />}
                        >
                          Upload
                        </Button>
                      )}
                    </Box>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <StyledNoData />
          )}

          {totalPages > 1 && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 1,
                mt: 2,
              }}
            >
              <Typography variant="subtitle2" sx={{ fontSize: "0.813rem" }}>
                Page <strong>{page}</strong> of <strong>{totalPages}</strong>
              </Typography>
              <Pagination
                page={page}
                onChange={(_event, value) => onPageChange(value)}
                count={totalPages}
                showFirstButton
                showLastButton
                size="small"
                sx={{
                  "& .MuiPaginationItem-root": {
                    fontSize: "0.7rem",
                    minWidth: "26px",
                    height: "26px",
                  },
                }}
              />
            </Box>
          )}
        </Box>
      )}
    </>
  );
};
