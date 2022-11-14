import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getAllResource, getResourceById } from '../../api/fetchApi';

const initialState = {
	positions: [],
	position: {},
	loading: false,
	error: false,
	pagination: {},
	currentPage: 1,
};

export const fetchPositionList = createAsyncThunk('position/fetchList', async (params) => {
	const response = await getAllResource('/api/positions', params);
	return response.data;
});

export const fetchPositionById = createAsyncThunk('position/fetchId', async (id) => {
	const response = await getResourceById('/api/positions', id);
	return response.data;
});

export const positionSlice = createSlice({
	name: 'positionSlice',
	initialState,
	reducers: {
		changeCurrentPage: (state, action) => {
			state.currentPage = action.payload;
		},
	},
	extraReducers: {
		// fetch list
		[fetchPositionList.pending]: (state) => {
			state.loading = true;
		},
		[fetchPositionList.fulfilled]: (state, action) => {
			state.loading = false;
			state.positions = [...action.payload.data].map((position) => {
				return {
					...position,
					id: position?.id,
					value: position?.id,
					label: position?.name,
				};
			});
			state.pagination = { ...action.payload.pagination };
		},
		[fetchPositionList.rejected]: (state, action) => {
			state.loading = false;
			state.error = action.error;
		},
		// fetch position by id
		[fetchPositionById.pending]: (state) => {
			state.loading = true;
		},
		[fetchPositionById.fulfilled]: (state, action) => {
			state.loading = false;
			state.position = { ...action.payload };
		},
		[fetchPositionById.rejected]: (state, action) => {
			state.loading = false;
			state.error = action.error;
		},
	},
});

export const { changeCurrentPage } = positionSlice.actions;
