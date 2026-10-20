import { Box, Button, TablePagination, Typography } from '@mui/material';
function Pagination({ paginationData = {}, handlePageChange }) {

  const {
    page: page,
    rows_per_page = 10,
    count = 0,
    next_page = true,
    prev_page = true,
    total_pages = Math.ceil((count || 0) / (rows_per_page || 1)),
  } = paginationData;


  return (
    <>
      <TablePagination
        sx={{ display: { xs: "none", sm: "block" } }}
        rowsPerPageOptions={[paginationData.rows_per_page || 0]}
        component="div"
        count={paginationData.count || 0}
        rowsPerPage={paginationData.rows_per_page || 10}
        page={(paginationData.page || 1) - 1} // MUI uses 0-based indexing
        onPageChange={(e, newPage) => handlePageChange(newPage + 1)} // Convert back to 1-based
        slotProps={{
          actions: {
            nextButton: {
              disabled: !paginationData?.next_page,
              sx: {
                color: paginationData?.next_page ? 'black' : 'rgba(0, 0, 0, 0.3)',
              },
            },
            previousButton: {
              disabled: !paginationData?.prev_page,
              sx: {
                color: paginationData?.prev_page ? 'black' : 'rgba(0, 0, 0, 0.3)',
              },
            },
          },
        }}
      />
      <Box
        sx={{ display: { xs: "flex", sm: "none" } }}
        justifyContent="center"
        alignItems="center"
        gap={2}
        mt={2}
        mb={4}
      >
        <Button
          variant="outlined"
          size="small"
          disabled={!prev_page}
          onClick={() => handlePageChange(page - 1)}
          sx={{
            minWidth: 80,
            borderColor: prev_page ? '#999' : '#ccc',
            color: prev_page ? '#333' : '#aaa',
          }}
        >
          Prev
        </Button>

        <Typography fontSize="14px" color="#666">
          Page {page || 0} of {total_pages}
        </Typography>

        <Button
          variant="contained"
          size="small"
          disabled={paginationData?.next_page === null || paginationData?.next_page === undefined||total_pages===1||!paginationData?.next_page}
          onClick={() => handlePageChange(page + 1)}
          sx={{
            minWidth: 80,
            backgroundColor: paginationData?.next_page === null || paginationData?.next_page === undefined ? '#ccc' : '#16A14E',
            color: '#fff',
            '&:hover': {
              backgroundColor: paginationData?.next_page === null || paginationData?.next_page === undefined ? '#ccc' : '#138e44',
            },
          }}
        >
          Next
        </Button>

      </Box>
    </>
  );
}

export default Pagination;
