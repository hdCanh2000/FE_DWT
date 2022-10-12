import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
	getAllRole,
	addRole,
	updateRole,
	deleteRole,
} from '../../pages/config/configPermission/services';

const initialState = {
	roles: [],
	loading: false,
	error: false,
};

// Đầu tiên, tạo thunk
export const fetchRoleList = createAsyncThunk('role/fetchList', async () => {
	const response = await getAllRole();
	return response.data;
});

export const onAddRole = createAsyncThunk('role/addNew', async (data) => {
	const response = await addRole(data);
	return response.data;
});

export const onUpdateRole = createAsyncThunk('role/update', async (data) => {
	const response = await updateRole(data);
	return response.data;
});

export const onDeleteRole = createAsyncThunk('role/delete', async (data) => {
	const response = await deleteRole(data);
	return response.data;
});

// eslint-disable-next-line import/prefer-default-export
export const roleSlice = createSlice({
	name: 'roleSlice',
	initialState,
	reducers: {},
	extraReducers: {
		// fetch list
		[fetchRoleList.pending]: (state) => {
			state.loading = true;
		},
		[fetchRoleList.fulfilled]: (state, action) => {
			state.loading = false;
			state.roles = [...action.payload];
		},
		[fetchRoleList.rejected]: (state, action) => {
			state.loading = false;
			state.error = action.error;
		},
		// add new
		[onAddRole.pending]: (state) => {
			state.loading = true;
		},
		[onAddRole.fulfilled]: (state, action) => {
			state.loading = false;
			state.roles = [...state.roles, action.payload];
		},
		[onAddRole.rejected]: (state, action) => {
			state.loading = false;
			state.error = action.error;
		},
		// update
		[onUpdateRole.pending]: (state) => {
			state.loading = true;
		},
		[onUpdateRole.fulfilled]: (state, action) => {
			const {
				arg: { id },
			} = action.meta;
			state.loading = false;
			if (id) {
				state.roles = state.roles.map((item) =>
					item.id === id ? { ...action.payload } : item,
				);
			}
		},
		[onUpdateRole.rejected]: (state, action) => {
			state.loading = false;
			state.error = action.error;
		},
		// delete
		[onDeleteRole.pending]: (state) => {
			state.loading = true;
		},
		[onDeleteRole.fulfilled]: (state, action) => {
			state.loading = false;
			if (action.id) {
				state.roles = state.roles.filter((item) => item.id !== action.payload);
			}
		},
		[onDeleteRole.rejected]: (state, action) => {
			state.loading = false;
			state.error = action.error;
		},
	},
});
