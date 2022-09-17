import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { employeeSlice } from '../slice/employeeSlice';
import { toggleFormSlice } from '../common/toggleFormSlice';
import { departmentSlice } from '../slice/departmentSlice';
import { positionSlice } from '../slice/positionSlice';
import { positionLevelSlice } from '../slice/positionLevelSlice';
import { missionSlice } from '../slice/missionSlice';
import { taskSlice } from '../slice/taskSlice';
import { roleSlice } from '../slice/roleSlice';
import { kpiNormSlice } from '../slice/kpiNormSlice';

const reducer = combineReducers({
	mission: missionSlice.reducer,
	task: taskSlice.reducer,
	employee: employeeSlice.reducer,
	department: departmentSlice.reducer,
	position: positionSlice.reducer,
	role: roleSlice.reducer,
	toggleForm: toggleFormSlice.reducer,
	kpiNorm: kpiNormSlice.reducer,
	positionLevel: positionLevelSlice.reducer,
});

// eslint-disable-next-line import/prefer-default-export
export const store = configureStore({
	reducer,
});
