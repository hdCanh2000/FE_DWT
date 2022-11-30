import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import moment from 'moment';
import { get } from 'lodash';
import {
	getAllWorktrack,
	getAllWorktrackByUserId,
	getAllWorktrackMe,
} from '../../pages/dailyWorkTracking/services';
import { getAllWorktrackByStatus } from '../../pages/pendingWorktrack/services';
import { LIST_STATUS, LIST_STATUS_PENDING } from '../../utils/constants';
import {
	calcCurrentKPIOfWorkTrack,
	calcProgressTask,
	calcTotalFromWorkTrackLogs,
	calcTotalKPIOfWorkTrack,
	createDataTreeTable,
} from '../../utils/function';

const initialState = {
	worktracks: [],
	tasks: [],
	worktracksByStatus: [],
	worktrack: {},
	loading: false,
	error: false,
};

export const fetchWorktrackListAll = createAsyncThunk('worktrack/fetchListAll', async (params) => {
	const response = await getAllWorktrack(params);
	return response.data.data?.role === 'manager' || response.data.data?.role === 'user'
		? createDataTreeTable(
				response.data.data.workTracks.map((item) => {
					return {
						...item,
						label: item?.name,
						value: item?.id,
						text: item?.name,
						parentId: item?.parent_id,
						kpiPoint: item.kpi_point ? item.kpi_point : '--',
						user: item?.users?.find((u) => u?.workTrackUsers?.isResponsible === true),
						statusName: LIST_STATUS.find((st) => st.value === item.status)?.label,
						totalKPI: calcTotalKPIOfWorkTrack(item),
						totalQuantity: calcTotalFromWorkTrackLogs(item.workTrackLogs),
						currentKPI: calcCurrentKPIOfWorkTrack(item),
						progress: calcProgressTask(item),
					};
				}),
		  )
		: createDataTreeTable(
				response.data.data.map((item) => {
					return {
						...item,
						label: item?.name,
						value: item?.id,
						text: item?.name,
						parentId: item?.parent_id,
						kpiPoint: item.kpi_point ? item.kpi_point : '--',
						user: item?.users?.find((u) => u?.workTrackUsers?.isResponsible === true),
						statusName: LIST_STATUS.find((st) => st.value === item.status)?.label,
						totalKPI: calcTotalKPIOfWorkTrack(item),
						totalQuantity: calcTotalFromWorkTrackLogs(item.workTrackLogs),
						currentKPI: calcCurrentKPIOfWorkTrack(item),
						progress: calcProgressTask(item),
					};
				}),
		  );
});

export const fetchAssignTask = createAsyncThunk('worktrack/fetchListAsign', async () => {
	const response = await getAllWorktrack();
	return response.data.data?.role === 'manager' || response.data.data?.role === 'user'
		? response.data.data.workTracks
				?.filter((item) => {
					return item.workTrackUsers.isCreated === true;
				})
				?.map((item) => {
					const userResponsible = item.users.find(
						(user) => user.workTrackUsers.isResponsible === true,
					);
					return {
						...item,
						label: `${get(item, 'kpiNorm.name')} - ${get(userResponsible, 'name')}`,
						value: item.id,
						text: item.name,
						parentId: item.parent_id,
					};
				})
		: response.data.data?.map((item) => {
				const userResponsible = item.users.find(
					(user) => user.workTrackUsers.isResponsible === true,
				);
				return {
					...item,
					label: `${get(item, 'kpiNorm.name')} - ${get(userResponsible, 'name')}`,
					value: item.id,
					text: item.name,
					parentId: item.parent_id,
				};
		  });
});

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

export const fetchWorktrackList = createAsyncThunk('worktrack/fetchList', async (data) => {
	const response = await getAllWorktrackByUserId({ id: data.id, params: data.query });
	return response.data.data;
});

export const fetchWorktrackListMe = createAsyncThunk('worktrack/fetchListMe', async (params) => {
	const response = await getAllWorktrackMe(params);
	return response.data.data;
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
			state.worktracks = action.payload ? [...action.payload] : [];
		},
		[fetchWorktrackListAll.rejected]: (state, action) => {
			state.loading = false;
			state.error = action.error;
		},
		// fetch list assign
		[fetchAssignTask.pending]: (state) => {
			state.loading = true;
		},
		[fetchAssignTask.fulfilled]: (state, action) => {
			state.loading = false;
			state.tasks = action.payload ? [...action.payload] : [];
		},
		[fetchAssignTask.rejected]: (state, action) => {
			state.loading = false;
			state.error = action.error;
		},
		// fetch list all by status
		[fetchWorktrackListByStatus.pending]: (state) => {
			state.loading = true;
		},
		[fetchWorktrackListByStatus.fulfilled]: (state, action) => {
			state.loading = false;
			state.worktracksByStatus = action.payload ? [...action.payload] : [];
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
		// fetch list me
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
	},
});
