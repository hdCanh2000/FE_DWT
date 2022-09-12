import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	open: false,
	confirm: false,
	data: {
		title: '',
		subTitle: '',
		status: null,
		isShowNote: false,
	},
};

// eslint-disable-next-line import/prefer-default-export
export const toggleFormSlice = createSlice({
	name: 'toggleForm',
	initialState,
	reducers: {
		openForm: (state, action) => {
			state.open = true;
			state.confirm = false;
			state.data = {
				...state.data,
				...action.payload,
			};
		},
		confirmForm: (state, action) => {
			state.open = false;
			state.confirm = true;
			state.data = {
				...state.data,
				...action.payload,
			};
		},
		closeForm: (state) => {
			state.open = false;
			state.confirm = false;
			state.data = {};
		},
		// openFormCloseMission: (state) => {
		// 	state.open = true;
		// 	state.confirm = false;
		// 	state.data = {};
		// },
	},
});
