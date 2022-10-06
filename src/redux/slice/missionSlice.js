import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getReportMisson } from '../../pages/dashboard/services';
import {
	getAllMission,
	getMissionById,
	updateMissionById,
} from '../../pages/work-management/mission/services';

const initialState = {
	missions: [],
	mission: {},
	missionReport: {},
	loading: false,
	error: false,
};

// Đầu tiên, tạo thunk
export const fetchMissionList = createAsyncThunk('mission/fetchList', async () => {
	const response = await getAllMission();
	return response.data.data.map((item) => {
		return {
			...item,
			label: item.name,
			value: item.id,
		};
	});
});

export const fetchMissionById = createAsyncThunk('mission/fetchId', async (id) => {
	const response = await getMissionById(id);
	return response.data;
});

export const fetchMissionReport = createAsyncThunk('mission/fetchReport', async () => {
	const response = await getReportMisson();
	return response.data;
});

export const AddMissionList = createAsyncThunk('mission/AddList', async (data) => {
	const response = await updateMissionById(data);
	return response.data;
});

// eslint-disable-next-line import/prefer-default-export
export const missionSlice = createSlice({
	name: 'missionSlice',
	initialState,
	reducers: {},
	extraReducers: {
		// fetch list
		[fetchMissionList.pending]: (state) => {
			state.loading = true;
		},
		[fetchMissionList.fulfilled]: (state, action) => {
			state.loading = false;
			state.missions = [...action.payload];
		},
		[fetchMissionList.rejected]: (state, action) => {
			state.loading = false;
			state.error = action.error;
		},
		// fetch by id
		[fetchMissionById.pending]: (state) => {
			state.loading = true;
		},
		[fetchMissionById.fulfilled]: (state, action) => {
			state.loading = false;
			state.mission = { ...action.payload };
		},
		[fetchMissionById.rejected]: (state, action) => {
			state.loading = false;
			state.error = action.error;
		},
		// fetch report
		[fetchMissionReport.pending]: (state) => {
			state.loading = true;
		},
		[fetchMissionReport.fulfilled]: (state, action) => {
			state.loading = false;
			state.missionReport = { ...action.payload };
		},
		[fetchMissionReport.rejected]: (state, action) => {
			state.loading = false;
			state.error = action.error;
		},
		// add new
		[AddMissionList.pending]: (state) => {
			state.loading = true;
		},
		[AddMissionList.fulfilled]: (state, action) => {
			state.loading = false;
			state.missions = [...state.missions, ...action.payload];
		},
		[AddMissionList.rejected]: (state, action) => {
			state.loading = false;
			state.error = action.error;
		},
		// update
	},
});
