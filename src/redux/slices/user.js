import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: null,
  likes: [],
  following:[]
};

const slice = createSlice({
  name: 'user',
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
    getUserAddressSuccess(state,action) {
      state.likes = action.payload.data.data;
    },

    getUserFollowingSuccess(state,action) {
      state.following = action.payload.following
      ;
    },
  },
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function getUserAddress() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/api/liked-blogs?limit=100`);
      dispatch(slice.actions.getUserAddressSuccess(response?.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getFollowingList(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/api/following/${id}`);
      console.log(response?.data,"popo")
      dispatch(slice.actions.getUserFollowingSuccess(response?.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
