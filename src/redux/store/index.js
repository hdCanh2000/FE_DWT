import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { employeeSlice } from '../slice/employeeSlice';
import { toggleFormSlice } from '../common/toggleFormSlice';
import { departmentSlice } from '../slice/departmentSlice';
import { missionSlice } from '../slice/missionSlice';
import { taskSlice } from '../slice/taskSlice';

const reducer = combineReducers({
	mission: missionSlice.reducer,
	task: taskSlice.reducer,
	employee: employeeSlice.reducer,
	department: departmentSlice.reducer,
	toggleForm: toggleFormSlice.reducer,
});

// eslint-disable-next-line import/prefer-default-export
export const store = configureStore({
	reducer,
});
