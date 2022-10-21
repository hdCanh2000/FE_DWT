import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getAllRequirement } from '../../pages/recruitmentRequirements/services';

const initialState = {
	requirements: [],
	requirement: {},
	loading: false,
	error: false,
	pagination: {},
};

// Đầu tiên, tạo thunk
export const fetchRequirementList = createAsyncThunk('requirements/fetchList', async (params) => {
	const response = await getAllRequirement(params);
	return response.data;
});

// eslint-disable-next-line import/prefer-default-export
export const requirementSlice = createSlice({
	name: 'requirementSlice',
	initialState,
	reducers: {},
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
