import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getAllPositionLevel } from '../../pages/positionLevelConfig/services';

const initialState = {
	positionLevels: [],
	loading: false,
	error: false,
};

export const fetchPositionLevelList = createAsyncThunk('positionLevel/fetchLevelList', async () => {
	const response = await getAllPositionLevel();
	return response.data;
});

export const positionLevelSlice = createSlice({
	name: 'positionLevelSlice',
	initialState,
	reducers: {},
	extraReducers: {
		// fetch level list
		[fetchPositionLevelList.pending]: (state) => {
			state.loading = true;
		},
		[fetchPositionLevelList.fulfilled]: (state, action) => {
			state.loading = false;
			state.positionLevels = [...action.payload];
		},
		[fetchPositionLevelList.rejected]: (state, action) => {
			state.loading = false;
			state.error = action.error;
		},
	},
});
