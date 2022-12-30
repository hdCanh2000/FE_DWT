import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { addResource, getAllResource } from '../../api/fetchApi';

const initialState = {
	units: [],
	pagination: {},
	currentPage: 1,
	loading: false,
	error: false,
};

export const fetchUnitList = createAsyncThunk('unit/fetchList', async (params) => {
	const response = await getAllResource('/api/units', params);
	return response.data;
});

export const addUnit = createAsyncThunk('unit/add', async (data) => {
	const response = await addResource('/api/units', data);
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
		// get list
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
		// add
		// add new
		[addUnit.pending]: (state) => {
			state.loading = true;
		},
		[addUnit.fulfilled]: (state, action) => {
			state.loading = false;
			state.units = [...state.units, action.payload];
		},
		[addUnit.rejected]: (state, action) => {
			state.loading = false;
			state.error = action.error;
		},
	},
});

export const { changeCurrentPage } = unitSlice.actions;
