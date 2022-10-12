import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getAllRequirement } from '../../pages/recruitmentRequirements/services';

const initialState = {
	requirements: [],
	requirement: {},
	loading: false,
	error: false,
};

// Đầu tiên, tạo thunk
export const fetchRequirementList = createAsyncThunk('key/fetchList', async () => {
	const response = await getAllRequirement();
	return response.data.data.map((requirement) => {
		return {
			...requirement,
			label: requirement.name,
			text: requirement.name,
			value: requirement.id,
		};
	});
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
			state.requirements = [...action.payload];
		},
		[fetchRequirementList.rejected]: (state, action) => {
			state.loading = false;
			state.error = action.error;
		},
	},
});
