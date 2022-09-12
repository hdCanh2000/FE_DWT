import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getSubTaskById } from '../../pages/work-management/subtask-step/services';

const initialState = {
	subtasks: [],
	subtask: {},
	subtaskReport: {},
	loading: false,
	error: false,
};

// Đầu tiên, tạo thunk
export const fetchSubtaskById = createAsyncThunk('subtask/fetchById', async () => {
	const response = await getSubTaskById();
	return response.data;
});

// eslint-disable-next-line import/prefer-default-export
export const subtaskSlice = createSlice({
	name: 'subtaskSlice',
	initialState,
	reducers: {},
	extraReducers: {
		// fetch list
		[fetchSubtaskById.pending]: (state) => {
			state.loading = true;
		},
		[fetchSubtaskById.fulfilled]: (state, action) => {
			state.loading = false;
			state.subtask = { ...action.payload };
		},
		[fetchSubtaskById.rejected]: (state, action) => {
			state.loading = false;
			state.error = action.error;
		},
		// add new

		// update
	},
});
