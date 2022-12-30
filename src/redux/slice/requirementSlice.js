import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getAllResource } from '../../api/fetchApi';

const initialState = {
	requirements: [],
	requirement: {},
	loading: false,
	error: false,
	pagination: {},
	currentPage: 1,
};

export const fetchRequirementList = createAsyncThunk('requirements/fetchList', async (params) => {
	const response = await getAllResource('/api/requirements', params);
	return response.data;
});

// eslint-disable-next-line import/prefer-default-export
export const requirementSlice = createSlice({
	name: 'requirementSlice',
	initialState,
	reducers: {
		changeCurrentPage: (state, action) => {
			state.currentPage = action.payload;
		},
	},
	extraReducers: {
		// fetch list
		[fetchRequirementList.pending]: (state) => {
			state.loading = true;
		},
		[fetchRequirementList.fulfilled]: (state, action) => {
			state.loading = false;
			state.requirements = [...action.payload.data].map((requirement) => {
				return {
					...requirement,
					id: requirement?.id,
					value: requirement?.id,
					label: requirement?.name,
				};
			});
			state.pagination = { ...action.payload.pagination };
		},
		[fetchRequirementList.rejected]: (state, action) => {
			state.loading = false;
			state.error = action.error;
		},
	},
});

export const { changeCurrentPage } = requirementSlice.actions;
