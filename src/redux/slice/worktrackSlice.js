import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import moment from 'moment';
import {
	addWorktrack,
	getAllWorktrack,
	getAllWorktrackByUser,
	getAllWorktrackByUserId,
	updateWorktrack,
} from '../../pages/dailyWorkTracking/services';
import { getAllWorktrackByStatus } from '../../pages/pendingWorktrack/services';
import { LIST_STATUS_PENDING } from '../../utils/constants';

const initialState = {
	worktracks: [],
	worktracksByStatus: [],
	worktrack: {},
	loading: false,
	error: false,
};

// Đầu tiên, tạo thunk
export const fetchWorktrackListAll = createAsyncThunk('worktrack/fetchListAll', async () => {
	const response = await getAllWorktrack();
	return response.data.data.map((item) => {
		return {
			...item,
			label: item.name,
			value: item.id,
			text: item.name,
			parentId: item.parent_id,
		};
	});
});

// Đầu tiên, tạo thunk
export const fetchWorktrackListByStatus = createAsyncThunk(
	'worktrack/fetchListByStatus',
	async (status) => {
		const response = await getAllWorktrackByStatus(status);
		return response.data.data.map((item) => {
			return {
				...item,
				label: item.name,
				value: item.id,
				text: item.name,
				parentId: item.parent_id,
				deadlineText: item.deadline ? moment(item.deadline).format('DD-MM-YYYY') : '--',
				statusName: LIST_STATUS_PENDING.find((st) => st.value === item.status).label,
				userResponsible: item.users.find((u) => u?.workTrackUsers?.isResponsible === true)
					?.name,
			};
		});
	},
);

export const fetchWorktrackList = createAsyncThunk('worktrack/fetchList', async (id) => {
	const response = await getAllWorktrackByUserId(id);
	return response.data.data;
});

export const fetchWorktrackListMe = createAsyncThunk('worktrack/fetchListMe', async () => {
	const response = await getAllWorktrackByUser();
	return response.data.map((item) => {
		return {
			...item,
			label: item.name,
			value: item.id,
			text: item.name,
			unit: {
				...item.unit,
				label: item?.unit?.name,
				value: item?.unit?.id,
			},
		};
	});
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
		// fetch list all
		[fetchWorktrackListAll.pending]: (state) => {
			state.loading = true;
		},
		[fetchWorktrackListAll.fulfilled]: (state, action) => {
			state.loading = false;
			state.worktracks = [...action.payload];
		},
		[fetchWorktrackListAll.rejected]: (state, action) => {
			state.loading = false;
			state.error = action.error;
		},
		// fetch list all by status
		[fetchWorktrackListByStatus.pending]: (state) => {
			state.loading = true;
		},
		[fetchWorktrackListByStatus.fulfilled]: (state, action) => {
			state.loading = false;
			state.worktracksByStatus = [...action.payload];
		},
		[fetchWorktrackListByStatus.rejected]: (state, action) => {
			state.loading = false;
			state.error = action.error;
		},
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
			state.worktracks = [...action.payload];
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
