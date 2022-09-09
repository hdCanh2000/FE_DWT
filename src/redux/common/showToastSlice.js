import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	open: false,
	data: {},
};

// eslint-disable-next-line import/prefer-default-export
export const showToastSlice = createSlice({
	name: 'showToast',
	initialState,
	reducers: {
		openForm: (state, action) => {
			state.open = true;
			state.data = {
				...state.data,
				...action.payload,
			};
		},
		closeForm: (state) => {
			state.open = false;
			state.data = {};
		},
	},
});
