import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getAllUnits } from '../../pages/unit/services';

const initialState = {
	units: [],
	loading: false,
	error: false,
};

export const fetchUnitList = createAsyncThunk('unit/fetchList', async () => {
	const response = await getAllUnits();
	return response.data?.data.map((unit) => {
		return {
			...unit,
			value: unit?.id,
			label: unit?.name,
		};
	});
});

export const unitSlice = createSlice({
	name: 'unitSlice',
	initialState,
	reducers: {},
	extraReducers: {
		// fetch list
		[fetchUnitList.pending]: (state) => {
			state.loading = true;
		},
		[fetchUnitList.fulfilled]: (state, action) => {
			state.loading = false;
			state.units = [...action.payload];
		},
		[fetchUnitList.rejected]: (state, action) => {
			state.loading = false;
			state.error = action.error;
		},
	},
});
