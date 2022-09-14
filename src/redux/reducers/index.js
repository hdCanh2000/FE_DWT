import { combineReducers } from 'redux';
import { employeeSlice } from '../slice/employeeSlice';
import { toggleFormSlice } from '../common/toggleFormSlice';
import { missionSlice } from '../slice/missionSlice';
import { taskSlice } from '../slice/taskSlice';
import { kpiNormSlice } from '../slice/kpiNormSlice';
import { positionLevelSlice } from '../slice/positionLevelSlice';

const rootReducer = combineReducers({
	employee: employeeSlice,
	mission: missionSlice,
	task: taskSlice,
	toggleForm: toggleFormSlice,
	kpiNorm: kpiNormSlice,
	positionLevel: positionLevelSlice,

});

export default rootReducer;
