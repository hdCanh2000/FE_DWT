import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { employeeSlice } from '../slice/employeeSlice';
import { toggleFormSlice } from '../common/toggleFormSlice';
import { departmentSlice } from '../slice/departmentSlice';
import { positionSlice } from '../slice/positionSlice';
import { positionLevelSlice } from '../slice/positionLevelSlice';
import { missionSlice } from '../slice/missionSlice';
import { roleSlice } from '../slice/roleSlice';
import { kpiNormSlice } from '../slice/kpiNormSlice';
import { unitSlice } from '../slice/unitSlice';
import { requirementSlice } from '../slice/requirementSlice';
import { worktrackSlice } from '../slice/worktrackSlice';
import { keySlice } from '../slice/keySlice';

const reducer = combineReducers({
	mission: missionSlice.reducer,
	employee: employeeSlice.reducer,
	department: departmentSlice.reducer,
	position: positionSlice.reducer,
	role: roleSlice.reducer,
	positionLevel: positionLevelSlice.reducer,
	toggleForm: toggleFormSlice.reducer,
	kpiNorm: kpiNormSlice.reducer,
	unit: unitSlice.reducer,
	requirement: requirementSlice.reducer,
	worktrack: worktrackSlice.reducer,
	key: keySlice.reducer,
});

// eslint-disable-next-line import/prefer-default-export
export const store = configureStore({
	reducer,
});
