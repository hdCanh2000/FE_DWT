import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
	addWorktrack,
	getAllWorktrackByUser,
	getAllWorktrackByUserId,
	// getAllWorktrackByUser,
	updateWorktrack,
} from '../../pages/dailyWorkTracking/services';

const initialState = {
	worktracks: [],
	worktrack: {},
	loading: false,
	error: false,
};

// Đầu tiên, tạo thunk
export const fetchWorktrackList = createAsyncThunk('worktrack/fetchList', async (id) => {
	const response = await getAllWorktrackByUserId(id);
	return response.data;
	// .map((item) => {
	// 	return {
	// 		...item,
	// 		label: item.name,
	// 		value: item.id,
	// 		text: item.name,
	// 		unit: {
	// 			...item.unit,
	// 			label: item?.unit?.name,
	// 			value: item?.unit?.id,
	// 		},
	// 	};
	// });
});

export const fetchWorktrackListMe = createAsyncThunk('worktrack/fetchListMe', async () => {
	const response = await getAllWorktrackByUser();
	return response.data;
	// .map((item) => {
	// 	return {
	// 		...item,
	// 		label: item.name,
	// 		value: item.id,
	// 		text: item.name,
	// 		unit: {
	// 			...item.unit,
	// 			label: item?.unit?.name,
	// 			value: item?.unit?.id,
	// 		},
	// 	};
	// });
});

export const onAddWorktrack = createAsyncThunk('worktrack/addNew', async (data) => {
	const response = await addWorktrack(data);
	return response.data;
});

export const onUpdateWorktrack = createAsyncThunk('worktrack/update', async (data) => {
	const response = await updateWorktrack(data);
	return response.data;
});

// eslint-disable-next-line import/prefer-default-export
export const worktrackSlice = createSlice({
	name: 'worktrackSlice',
	initialState,
	reducers: {},
	extraReducers: {
		// fetch list
		[fetchWorktrackList.pending]: (state) => {
			state.loading = true;
		},
		[fetchWorktrackList.fulfilled]: (state, action) => {
			state.loading = false;
			state.worktrack = { ...action.payload };
		},
		[fetchWorktrackList.rejected]: (state, action) => {
			state.loading = false;
			state.error = action.error;
		},
		// fetch list
		[fetchWorktrackListMe.pending]: (state) => {
			state.loading = true;
		},
		[fetchWorktrackListMe.fulfilled]: (state, action) => {
			state.loading = false;
			state.worktrack = { ...action.payload };
		},
		[fetchWorktrackListMe.rejected]: (state, action) => {
			state.loading = false;
			state.error = action.error;
		},
		// add new
		[onAddWorktrack.pending]: (state) => {
			state.loading = true;
		},
		[onAddWorktrack.fulfilled]: (state, action) => {
			state.loading = false;
			state.worktracks = [...state.worktracks, ...action.payload];
		},
		[onAddWorktrack.rejected]: (state, action) => {
			state.loading = false;
			state.error = action.error;
		},
		// update
		[onUpdateWorktrack.pending]: (state) => {
			state.loading = true;
		},
		[onUpdateWorktrack.fulfilled]: (state, action) => {
			const {
				arg: { id },
			} = action.meta;
			state.loading = false;
			if (id) {
				state.worktracks = state.worktracks.map((item) =>
					item.id === id ? Object.assign(item, action.payload) : item,
				);
			}
		},
		[onUpdateWorktrack.rejected]: (state, action) => {
			state.loading = false;
			state.error = action.error;
		},
	},
});
