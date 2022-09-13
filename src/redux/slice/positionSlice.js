import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getAllPositionWithUser } from '../../pages/position/services';
import { getAllPositions } from '../../pages/work-management/mission/services';

const initialState = {
	positions: [],
	// position: {},
	loading: false,
	error: false,
};

export const fetchPositionList = createAsyncThunk('position/fetchList', async () => {
	const response = await getAllPositions();
	return response.data;
});

export const fetchPositionWithUserList = createAsyncThunk('position/fetchWithUserList', async () => {
	const response = await getAllPositionWithUser();
	return response.data;
});


// export const fetchDepartmentWithUserList = createAsyncThunk(
// 	'department/fetchWithUserList',
// 	async () => {
// 		const response = await getAllDepartmentWithUser();
// 		return response.data;
// 	},
// );

// export const fetchDepartmentById = createAsyncThunk(
// 	'department/fetchDepartmentById',
// 	async (id) => {
// 		const response = await getDepartmentByIdWithUser(id);
// 		return response.data;
// 	},
// );

// eslint-disable-next-line import/prefer-default-export

export const positionSlice = createSlice({
	name: 'positionSlice',
	initialState,
	reducers: {},
	extraReducers: {
		// fetch list
		[fetchPositionList.pending]: (state) => {
			state.loading = true;
		},
		[fetchPositionList.fulfilled]: (state, action) => {
			state.loading = false;
			state.positions = [...action.payload];
		},
		[fetchPositionList.rejected]: (state, action) => {
			state.loading = false;
			state.error = action.error;
		},
		// fetch list with user
		[fetchPositionWithUserList.pending]: (state) => {
			state.loading = true;
		},
		[fetchPositionWithUserList.fulfilled]: (state, action) => {
			state.loading = false;
			state.positions = [...action.payload];
		},
		[fetchPositionWithUserList.rejected]: (state, action) => {
			state.loading = false;
			state.error = action.error;
		},
		// // fetch by id with user
		// [fetchDepartmentById.pending]: (state) => {
		// 	state.loading = true;
		// },
		// [fetchDepartmentById.fulfilled]: (state, action) => {
		// 	state.loading = false;
		// 	state.department = { ...action.payload };
		// },
		// [fetchDepartmentById.rejected]: (state, action) => {
		// 	state.loading = false;
		// 	state.error = action.error;
		// },
	},
});
