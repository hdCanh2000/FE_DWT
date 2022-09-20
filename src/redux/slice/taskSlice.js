import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getAllTasks, getReportTask } from '../../pages/dashboard/services';
import {
	getAllTaksByMissionID,
	getLatestTasks,
} from '../../pages/work-management/mission/services';
import { getAllTasksByDepartment } from '../../pages/work-management/task-list/services';
import { getTaskById } from '../../pages/work-management/TaskDetail/services';

const initialState = {
	tasks: [],
	tasksByMisson: [],
	taskLates: [],
	taskReport: {},
	loading: false,
	error: false,
	task: {},
};

// Đầu tiên, tạo thunk
export const fetchTaskList = createAsyncThunk('task/fetchList', async (id) => {
	const response = await getAllTasksByDepartment(id);
	return response.data.map((item) => {
		return {
			...item,
			label: item.name,
			value: item.id,
			text: item.name,
		};
	});
});

export const fetchAllTask = createAsyncThunk('task/fetchAll', async () => {
	const response = await getAllTasks();
	return response.data.map((item) => {
		return {
			...item,
			label: item.name,
			value: item.id,
			text: item.name,
		};
	});
});

export const fetchTaskListByMissionId = createAsyncThunk('task/fetchListByMission', async (id) => {
	const response = await getAllTaksByMissionID(id);
	return response.data;
});

export const fetchTaskListLates = createAsyncThunk('task/fetchListLates', async () => {
	const response = await getLatestTasks();
	return response.data;
});

export const fetchTaskReport = createAsyncThunk('task/fetchReport', async (departmentId) => {
	const response = await getReportTask({ departmentId });
	return response.data;
});

export const fetchTaskById = createAsyncThunk('task/fetchById', async (id) => {
	const response = await getTaskById(id);
	return response.data;
});

export const taskSlice = createSlice({
	name: 'taskSlice',
	initialState,
	reducers: {},
	extraReducers: {
		// fetch all
		[fetchAllTask.pending]: (state) => {
			state.loading = true;
		},
		[fetchAllTask.fulfilled]: (state, action) => {
			state.loading = false;
			state.tasks = [...action.payload];
		},
		[fetchAllTask.rejected]: (state, action) => {
			state.loading = false;
			state.error = action.error;
		},
		// fetch list by department
		[fetchTaskList.pending]: (state) => {
			state.loading = true;
		},
		[fetchTaskList.fulfilled]: (state, action) => {
			state.loading = false;
			state.tasks = [...action.payload];
		},
		[fetchTaskList.rejected]: (state, action) => {
			state.loading = false;
			state.error = action.error;
		},
		// fetch list lates
		[fetchTaskListLates.pending]: (state) => {
			state.loading = true;
		},
		[fetchTaskListLates.fulfilled]: (state, action) => {
			state.loading = false;
			state.taskLates = [...action.payload];
		},
		[fetchTaskListLates.rejected]: (state, action) => {
			state.loading = false;
			state.error = action.error;
		},
		// fetch list by mision
		[fetchTaskListByMissionId.pending]: (state) => {
			state.loading = true;
		},
		[fetchTaskListByMissionId.fulfilled]: (state, action) => {
			state.loading = false;
			state.tasksByMisson = [...action.payload];
		},
		[fetchTaskListByMissionId.rejected]: (state, action) => {
			state.loading = false;
			state.error = action.error;
		},
		// fetch report
		[fetchTaskReport.pending]: (state) => {
			state.loading = true;
		},
		[fetchTaskReport.fulfilled]: (state, action) => {
			state.loading = false;
			state.taskReport = { ...action.payload };
		},
		[fetchTaskReport.rejected]: (state, action) => {
			state.loading = false;
			state.error = action.error;
		},
		// fetch by id
		[fetchTaskById.pending]: (state) => {
			state.loading = true;
		},
		[fetchTaskById.fulfilled]: (state, action) => {
			state.loading = false;
			state.task = {
				...action.payload.data,
				label: action.payload.data?.name,
				value: action.payload.data?.id,
			};
		},
		[fetchTaskById.rejected]: (state, action) => {
			state.loading = false;
			state.error = action.error;
		},
		// add new

		// update
	},
});
