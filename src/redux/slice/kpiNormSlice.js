import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getAllKpiNorm, addKpiNorm, updateKpiNorm } from '../../pages/kpiNorm/services';

const initialState = {
	kpiNorms: [],
	loading: false,
	error: false,
};

// Đầu tiên, tạo thunk
export const fetchKpiNormList = createAsyncThunk('kpiNorm/fetchList', async () => {
	const response = await getAllKpiNorm();
	return response.data;
});

export const onAddKpiNorm = createAsyncThunk('kpiNorm/addNew', async (data) => {
	const response = await addKpiNorm(data);
	return response.data;
});

export const onUpdateKpiNorm = createAsyncThunk('updateKpiNorm/update', async (data) => {
	const response = await updateKpiNorm(data);
	return response.data;
});

// eslint-disable-next-line import/prefer-default-export
export const kpiNormSlice = createSlice({
	name: 'kpiNormSlice',
	initialState,
	reducers: {},
	extraReducers: {
		// fetch list
		[fetchKpiNormList.pending]: (state) => {
			state.loading = true;
		},
		[fetchKpiNormList.fulfilled]: (state, action) => {
			state.loading = false;
			state.kpiNorms = [...action.payload];
		},
		[fetchKpiNormList.rejected]: (state, action) => {
			state.loading = false;
			state.error = action.error;
		},
		// add new
		[onAddKpiNorm.pending]: (state) => {
			state.loading = true;
		},
		[onAddKpiNorm.fulfilled]: (state, action) => {
			state.loading = false;
			state.kpiNorms = [...state.kpiNorms, ...action.payload];
		},
		[onAddKpiNorm.rejected]: (state, action) => {
			state.loading = false;
			state.error = action.error;
		},
		// update
		[onUpdateKpiNorm.pending]: (state) => {
			state.loading = true;
		},
		[onUpdateKpiNorm.fulfilled]: (state, action) => {
			const {
				arg: { id },
			} = action.meta;
			state.loading = false;
			if (id) {
				state.kpiNorms = state.kpiNorms.map((item) =>
					item.id === id ? Object.assign(item, action.payload) : item,
				);
			}
		},
		[onUpdateKpiNorm.rejected]: (state, action) => {
			state.loading = false;
			state.error = action.error;
		},
	},
});
