import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getAllUnits } from '../../pages/unit/services';

const initialState = {
	units: [],
	pagination: {},
	currentPage: 1,
	loading: false,
	error: false,
};

export const fetchUnitList = createAsyncThunk('unit/fetchList', async (params) => {
	const response = await getAllUnits(params);
	return response.data;
});

export const unitSlice = createSlice({
	name: 'unitSlice',
	initialState,
	reducers: {
		changeCurrentPage: (state, action) => {
			state.currentPage = action.payload;
		},
	},
	extraReducers: {
		[fetchUnitList.pending]: (state) => {
			state.loading = true;
		},
		[fetchUnitList.fulfilled]: (state, action) => {
			state.loading = false;
			state.units = [...action.payload.data].map((unit) => {
				return {
					...unit,
					value: unit?.id,
					label: unit?.name,
				};
			});
			state.pagination = { ...action.payload.pagination };
		},
		[fetchUnitList.rejected]: (state, action) => {
			state.loading = false;
			state.error = action.error;
		},
	},
});

export const { changeCurrentPage } = unitSlice.actions;
