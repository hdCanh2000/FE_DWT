import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
	getAllDepartmentWithUser,
	getDepartmentByIdWithUser,
} from '../../pages/department/services';
import { getAllDepartments } from '../../pages/work-management/mission/services';

const initialState = {
	departments: [],
	department: {},
	loading: false,
	error: false,
};

// Đầu tiên, tạo thunk
export const fetchDepartmentList = createAsyncThunk('department/fetchList', async () => {
	const response = await getAllDepartments();
	return response.data?.map((department) => {
		return {
			id: department?.id,
			text: department?.name,
			value: department?.id,
			label: department?.name,
		};
	});
});

export const fetchDepartmentWithUserList = createAsyncThunk(
	'department/fetchWithUserList',
	async () => {
		const response = await getAllDepartmentWithUser();
		return response.data;
	},
);

export const fetchDepartmentById = createAsyncThunk(
	'department/fetchDepartmentById',
	async (id) => {
		const response = await getDepartmentByIdWithUser(id);
		return response.data;
	},
);

// eslint-disable-next-line import/prefer-default-export
export const departmentSlice = createSlice({
	name: 'departmentSlice',
	initialState,
	reducers: {},
	extraReducers: {
		// fetch list
		[fetchDepartmentList.pending]: (state) => {
			state.loading = true;
		},
		[fetchDepartmentList.fulfilled]: (state, action) => {
			state.loading = false;
			state.departments = action.payload;
		},
		[fetchDepartmentList.rejected]: (state, action) => {
			state.loading = false;
			state.error = action.error;
		},
		// fetch list with user
		[fetchDepartmentWithUserList.pending]: (state) => {
			state.loading = true;
		},
		[fetchDepartmentWithUserList.fulfilled]: (state, action) => {
			state.loading = false;
			state.departments = [...action.payload];
		},
		[fetchDepartmentWithUserList.rejected]: (state, action) => {
			state.loading = false;
			state.error = action.error;
		},
		// fetch by id with user
		[fetchDepartmentById.pending]: (state) => {
			state.loading = true;
		},
		[fetchDepartmentById.fulfilled]: (state, action) => {
			state.loading = false;
			state.department = { ...action.payload };
		},
		[fetchDepartmentById.rejected]: (state, action) => {
			state.loading = false;
			state.error = action.error;
		},
	},
});