import { combineReducers } from 'redux';
import { employeeSlice } from '../slice/employeeSlice';
import { toggleFormSlice } from '../common/toggleFormSlice';
import { missionSlice } from '../slice/missionSlice';
import { taskSlice } from '../slice/taskSlice';

const rootReducer = combineReducers({
	employee: employeeSlice,
	mission: missionSlice,
	task: taskSlice,
	toggleForm: toggleFormSlice,
});

export default rootReducer;
