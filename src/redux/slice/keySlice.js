import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getAllResource, addResource, updateResouce } from '../../api/fetchApi';

const initialState = {
	keys: [],
	key: {},
	loading: false,
	error: false,
	currentPage: 1,
	pagination: {},
};

export const fetchKeyList = createAsyncThunk('key/fetchList', async (params) => {
	const response = await getAllResource('/api/keys', params);
	return response.data;
});
export const onAddKey = createAsyncThunk('key/addNew', async (data) => {
	const response = await addResource('/api/keys', data);
	return response.data;
});

export const onUpdateKey = createAsyncThunk('key/update', async (data) => {
	const response = await updateResouce('/api/keys', data);
	return response.data;
});

// eslint-disable-next-line import/prefer-default-export
export const keySlice = createSlice({
	name: 'keySlice',
	initialState,
	reducers: {
		changeCurrentPage: (state, action) => {
			state.currentPage = action.payload;
		},
	},
	extraReducers: {
		// fetch list
		[fetchKeyList.pending]: (state) => {
			state.loading = true;
		},
		[fetchKeyList.fulfilled]: (state, action) => {
			state.loading = false;
			state.keys = [
				...action.payload.data.map((item) => {
					return {
						...item,
						label: item.name,
						text: item.name,
						value: item.id,
						unit: {
							...item?.unit,
							label: item?.unit?.name,
							value: item?.unit?.id,
						},
					};
				}),
			];
			state.pagination = { ...action.payload.pagination };
		},
		[fetchKeyList.rejected]: (state, action) => {
			state.loading = false;
			state.error = action.error;
		},
		// add new
		[onAddKey.pending]: (state) => {
			state.loading = true;
		},
		[onAddKey.fulfilled]: (state, action) => {
			state.loading = false;
			state.keys = [...state.keys, ...action.payload];
		},
		[onAddKey.rejected]: (state, action) => {
			state.loading = false;
			state.error = action.error;
		},
		// update
		[onUpdateKey.pending]: (state) => {
			state.loading = true;
		},
		[onUpdateKey.fulfilled]: (state, action) => {
			const {
				arg: { id },
			} = action.meta;
			state.loading = false;
			if (id) {
				state.keys = state.keys.map((item) =>
					item.id === id ? Object.assign(item, action.payload) : item,
				);
			}
		},
		[onUpdateKey.rejected]: (state, action) => {
			state.loading = false;
			state.error = action.error;
		},
	},
});
export const { changeCurrentPage } = keySlice.actions;
