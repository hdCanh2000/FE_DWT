import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getAllResource, getResourceById, updateResouce } from '../../api/fetchApi';

const initialState = {
	missions: [],
	mission: {},
	pagination: {},
	missionReport: {},
	loading: false,
	error: false,
	currentPage: 1,
};

export const fetchMissionList = createAsyncThunk('mission/fetchList', async (params) => {
	const response = await getAllResource('/api/missions', params);
	return response.data;
});

export const fetchMissionById = createAsyncThunk('mission/fetchId', async (id) => {
	const response = await getResourceById('/api/missions', id);
	return response.data;
});

export const AddMissionList = createAsyncThunk('mission/AddList', async (data) => {
	const response = await updateResouce('/api/missions', data);
	return response.data;
});

// eslint-disable-next-line import/prefer-default-export
export const missionSlice = createSlice({
	name: 'missionSlice',
	initialState,
	reducers: {
		changeCurrentPage: (state, action) => {
			state.currentPage = action.payload;
		},
	},
	extraReducers: {
		// fetch list
		[fetchMissionList.pending]: (state) => {
			state.loading = true;
		},
		[fetchMissionList.fulfilled]: (state, action) => {
			state.loading = false;
			state.missions = [...action.payload.data].map((item) => {
				return {
					...item,
					label: item.name,
					value: item.id,
				};
			});
			state.pagination = { ...action.payload.pagination };
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

export const { changeCurrentPage } = missionSlice.actions;
