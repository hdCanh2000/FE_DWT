import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getAllResource } from '../../api/fetchApi';

const initialState = {
	positionLevels: [],
	loading: false,
	error: false,
	pagination: {},
	currentPage: 1,
};

export const fetchPositionLevelList = createAsyncThunk(
	'positionLevel/fetchLevelList',
	async (params) => {
		const response = await getAllResource('/api/positionLevels', params);
		return response.data;
	},
);

export const positionLevelSlice = createSlice({
	name: 'positionLevelSlice',
	initialState,
	reducers: {
		changeCurrentPage: (state, action) => {
			state.currentPage = action.payload;
		},
	},
	extraReducers: {
		// fetch level list
		[fetchPositionLevelList.pending]: (state) => {
			state.loading = true;
		},
		[fetchPositionLevelList.fulfilled]: (state, action) => {
			state.loading = false;
			state.positionLevels = [...action.payload.data].map((positionLevel) => {
				return {
					...positionLevel,
					id: positionLevel?.id,
					value: positionLevel?.id,
					label: positionLevel?.name,
				};
			});
			state.pagination = { ...action.payload.pagination };
		},
		[fetchPositionLevelList.rejected]: (state, action) => {
			state.loading = false;
			state.error = action.error;
		},
	},
});

export const { changeCurrentPage } = positionLevelSlice.actions;
