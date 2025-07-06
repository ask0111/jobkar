import sum from 'lodash/sum';
import uniq from 'lodash/uniq';
import uniqBy from 'lodash/uniqBy';
import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  globalSetting: null,
  error: null,
};
const slice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    getGlobalSettingSuccess(state, action) {
      state.globalSetting = action.payload;
    },
    hasError(state, action) {
      state.error = action.payload;
    },
  },
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function getGlobalSetting() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/settings`);
      const mapped = response?.data?.data.map((item) => ({ [item.key]: item.value }));
      const globalSettingObj = Object.assign({}, ...mapped);
      dispatch(slice.actions.getGlobalSettingSuccess(globalSettingObj));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}
