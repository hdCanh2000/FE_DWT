import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getAllPositionLevel } from '../../pages/positionLevelConfig/services';

const initialState = {
	positionLevels: [],
	loading: false,
	error: false,
	pagination: {},
};

export const fetchPositionLevelList = createAsyncThunk(
	'positionLevel/fetchLevelList',
	async (params) => {
		const response = await getAllPositionLevel(params);
		return response.data;
	},
);

export const positionLevelSlice = createSlice({
	name: 'positionLevelSlice',
	initialState,
	reducers: {},
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
