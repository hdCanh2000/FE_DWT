import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
	getAllEmployee,
	getAllEmployeeByDepartment,
	addEmployee,
	updateEmployee,
} from '../../pages/employee/services';

const initialState = {
	employees: [],
	loading: false,
	error: false,
	pagination: {},
};

// Đầu tiên, tạo thunk
export const fetchEmployeeList = createAsyncThunk('employee/fetchList', async (params) => {
	const response = await getAllEmployee(params);
	return response.data;
});

export const fetchEmployeeListByDepartment = createAsyncThunk(
	'employee/fetchListByDepartment',
	async (id) => {
		const response = await getAllEmployeeByDepartment(id);
		return response.data?.data?.map((item) => {
			return {
				...item,
				label: item.name,
				value: item.id,
				text: item.name,
				department: {
					...item?.department,
					label: item?.department?.name,
					value: item?.department?.id,
				},
				position: {
					...item?.position,
					label: item?.position?.name,
					value: item?.position?.id,
				},
			};
		});
	},
);

export const onAddEmployee = createAsyncThunk('employee/addNew', async (data) => {
	const response = await addEmployee(data);
	return response.data;
});

export const onUpdateEmployee = createAsyncThunk('employee/update', async (data) => {
	const response = await updateEmployee(data);
	return response.data;
});

// eslint-disable-next-line import/prefer-default-export
export const employeeSlice = createSlice({
	name: 'employeeSlice',
	initialState,
	reducers: {},
	extraReducers: {
		// fetch list
		[fetchEmployeeList.pending]: (state) => {
			state.loading = true;
		},
		[fetchEmployeeList.fulfilled]: (state, action) => {
			state.loading = false;
			state.employees = [...action.payload.data].map((item) => {
				return {
					...item,
					label: item.name,
					value: item.id,
					text: item.name,
					department: {
						...item?.department,
						label: item?.department?.name,
						value: item?.department?.id,
					},
					position: {
						...item?.position,
						label: item?.position?.name,
						value: item?.position?.id,
					},
				};
			});
			state.pagination = { ...action.payload.pagination };
		},
		[fetchEmployeeList.rejected]: (state, action) => {
			state.loading = false;
			state.error = action.error;
		},
		// fetch list by department
		[fetchEmployeeListByDepartment.pending]: (state) => {
			state.loading = true;
		},
		[fetchEmployeeListByDepartment.fulfilled]: (state, action) => {
			state.loading = false;
			state.employees = [...action.payload];
		},
		[fetchEmployeeListByDepartment.rejected]: (state, action) => {
			state.loading = false;
			state.error = action.error;
		},
		// add new
		[onAddEmployee.pending]: (state) => {
			state.loading = true;
		},
		[onAddEmployee.fulfilled]: (state, action) => {
			state.loading = false;
			state.employees = [...state.employees, ...action.payload];
		},
		[onAddEmployee.rejected]: (state, action) => {
			state.loading = false;
			state.error = action.error;
		},
		// update
		[onUpdateEmployee.pending]: (state) => {
			state.loading = true;
		},
		[onUpdateEmployee.fulfilled]: (state, action) => {
			const {
				arg: { id },
			} = action.meta;
			state.loading = false;
			if (id) {
				state.employees = state.employees.map((item) =>
					item.id === id ? Object.assign(item, action.payload) : item,
				);
			}
		},
		[onUpdateEmployee.rejected]: (state, action) => {
			state.loading = false;
			state.error = action.error;
		},
	},
});
