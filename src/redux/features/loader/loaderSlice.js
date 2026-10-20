import { createSlice } from "@reduxjs/toolkit";

const loaderSlice = createSlice({
  name: "loader",
  initialState: { isLoading: false },
  reducers: {
    showLoader: (state) => {
      state.isLoading = true;

    },
    hideLoader: (state) => {
      state.isLoading = false;
    },
  },
});

export const { showLoader, hideLoader } = loaderSlice.actions;
export default loaderSlice.reducer;


// import { createSlice } from "@reduxjs/toolkit";

// const loaderSlice = createSlice({
//   name: "loader",
//   initialState: {
//     count: 0,
//     isLoading: false,
//   },
//   reducers: {
//     showLoader: (state) => {
//       if (state.count === 0) {
//         state.isLoading = true;
//       }
//       state.count += 1;

//     },
//     hideLoader: (state) => {
//       if (state.count > 0) {
//         state.count -= 1;
//       }

//       if (state.count ===0) {
//         state.isLoading = false;
//       }
//     },
//     resetLoader: (state) => {
//       state.count = 0;
//       state.isLoading = false;
//     },
//   },
// });

// export const { showLoader, hideLoader, resetLoader } = loaderSlice.actions;
// export default loaderSlice.reducer;
