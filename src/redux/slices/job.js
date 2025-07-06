import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: null,
  appliedList: [],

};

const slice = createSlice({
  name: 'job',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    // START Product LOADING
    getJobAppliedSuccess(state,action) {
      state.appliedList = action.payload.data.data;
    },

  },
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function getJobApplied() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/api/job-applications`);
      dispatch(slice.actions.getJobAppliedSuccess(response?.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

