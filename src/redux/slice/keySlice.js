import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getAllKeys } from '../../pages/work-management/mission/services';

const initialState = {
	keys: [],
	key: {},
	loading: false,
	error: false,
};

// Đầu tiên, tạo thunk
export const fetchKeyList = createAsyncThunk('key/fetchList', async () => {
	const response = await getAllKeys();
	return response.data.map((item) => {
		return {
			...item,
			label: item.name,
			text: item.name,
			value: item.id,
		};
	});
});

// eslint-disable-next-line import/prefer-default-export
export const keySlice = createSlice({
	name: 'keySlice',
	initialState,
	reducers: {},
	extraReducers: {
		// fetch list
		[fetchKeyList.pending]: (state) => {
			state.loading = true;
		},
		[fetchKeyList.fulfilled]: (state, action) => {
			state.loading = false;
			state.keys = [...action.payload];
		},
		[fetchKeyList.rejected]: (state, action) => {
			state.loading = false;
			state.error = action.error;
		},
	},
});
