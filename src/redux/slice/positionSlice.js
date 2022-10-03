import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getPositionById } from '../../pages/position/services';
import { getAllPositions } from '../../pages/work-management/mission/services';

const initialState = {
	positions: [],
	position: {},
	loading: false,
	error: false,
};

export const fetchPositionList = createAsyncThunk('position/fetchList', async () => {
	const response = await getAllPositions();
	return response.data?.data.map((position) => {
		return {
			...position,
			id: position?.id,
			value: position?.id,
			label: position?.name,
		};
	});
});

export const fetchPositionById = createAsyncThunk('position/fetchId', async (id) => {
	const response = await getPositionById(id);
	return response.data;
});

export const positionSlice = createSlice({
	name: 'positionSlice',
	initialState,
	reducers: {},
	extraReducers: {
		// fetch list
		[fetchPositionList.pending]: (state) => {
			state.loading = true;
		},
		[fetchPositionList.fulfilled]: (state, action) => {
			state.loading = false;
			state.positions = [...action.payload];
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
