import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
	addPositionLevel,
	getAllPositionLevel,
	updatePositionLevel,
} from '../../pages/positionLevelConfig/services';

const initialState = {
	positionLevels: [],
	loading: false,
	error: false,
};

// Đầu tiên, tạo thunk
export const fetchPositionLevelList = createAsyncThunk('positionLevel/fetchList', async () => {
	const response = await getAllPositionLevel();
	return response.data;
});

export const onAddPositionLevel = createAsyncThunk('positionLevel/addNew', async (data) => {
	const response = await addPositionLevel(data);
	return response.data;
});

export const onUpdatePositionLevel = createAsyncThunk('positionLevel/update', async (data) => {
	const response = await updatePositionLevel(data);
	return response.data;
});

// eslint-disable-next-line import/prefer-default-export
export const positionLevelSlice = createSlice({
	name: 'positionLevelSlice',
	initialState,
	reducers: {},
	extraReducers: {
		// fetch list
		[fetchPositionLevelList.pending]: (state) => {
			state.loading = true;
		},
		[fetchPositionLevelList.fulfilled]: (state, action) => {
			state.loading = false;
			state.positionLevels = [...action.payload];
		},
		[fetchPositionLevelList.rejected]: (state, action) => {
			state.loading = false;
			state.error = action.error;
		},
		// add new
		[onAddPositionLevel.pending]: (state) => {
			state.loading = true;
		},
		[onAddPositionLevel.fulfilled]: (state, action) => {
			state.loading = false;
			state.positionLevels = [...state.positionLevels, ...action.payload];
		},
		[onAddPositionLevel.rejected]: (state, action) => {
			state.loading = false;
			state.error = action.error;
		},
		// update
		[onUpdatePositionLevel.pending]: (state) => {
			state.loading = true;
		},
		[onUpdatePositionLevel.fulfilled]: (state, action) => {
			const {
				arg: { id },
			} = action.meta;
			state.loading = false;
			if (id) {
				state.positionLevels = state.positionLevels.map((item) =>
					item.id === id ? Object.assign(item, action.payload) : item,
				);
			}
		},
		[onUpdatePositionLevel.rejected]: (state, action) => {
			state.loading = false;
			state.error = action.error;
		},
	},
});
