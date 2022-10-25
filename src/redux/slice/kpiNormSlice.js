import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import _ from 'lodash';
import {
	getAllKpiNorm,
	addKpiNorm,
	updateKpiNorm,
	fetchAllKpiNorms,
	fetchAllSubKpiNorms,
} from '../../pages/kpiNorm/services';

const initialState = {
	kpiNorms: [],
	loading: false,
	error: false,
};

// Đầu tiên, tạo thunk
export const fetchKpiNormList = createAsyncThunk('kpiNorm/fetchList', async (params) => {
	const response = await getAllKpiNorm(params);
	return response.data.data.map((item) => {
		return {
			...item,
			label: item.name,
			value: item.id,
			text: item.name,
			parentId: item.parent_id,
			department: {
				...item.department,
				label: _.get(item, 'department.name'),
				value: _.get(item, 'department.value'),
			},
			position: {
				...item.position,
				label: _.get(item, 'position.name'),
				value: _.get(item, 'position.value'),
			},
			unit: {
				...item.unit,
				label: _.get(item, 'unit.name'),
				value: _.get(item, 'unit.value'),
			},
		};
	});
});

export const fetchKpiNormListByParams = createAsyncThunk(
	'kpiNorm/fetchKpiNormListByParams',
	async (params) => {
		const response = await fetchAllKpiNorms(params);
		return response.data.data.map((item) => {
			return {
				...item,
				label: item.name,
				value: item.id,
				text: item.name,
			};
		});
	},
);

export const fetchKpiSubNormList = createAsyncThunk('kpiNorm/fetchKpiSubNormList', async (data) => {
	const response = await fetchAllSubKpiNorms(data);
	return response.data.map((item) => {
		return {
			...item,
			label: item.name,
			value: item.id,
			text: item.name,
		};
	});
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
		// fetch list
		[fetchKpiNormListByParams.pending]: (state) => {
			state.loading = true;
		},
		[fetchKpiNormListByParams.fulfilled]: (state, action) => {
			state.loading = false;
			state.kpiNorms = [...action.payload];
		},
		[fetchKpiNormListByParams.rejected]: (state, action) => {
			state.loading = false;
			state.error = action.error;
		},
		// fetch sub list
		[fetchKpiSubNormList.pending]: (state) => {
			state.loading = true;
		},
		[fetchKpiSubNormList.fulfilled]: (state, action) => {
			state.loading = false;
			state.kpiNorms = [...action.payload];
		},
		[fetchKpiSubNormList.rejected]: (state, action) => {
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
