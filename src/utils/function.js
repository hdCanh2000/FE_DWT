import { isArray, isEmpty, size } from 'lodash';

const calcTotalTaskByStatus = (tasks, status) => {
	// tính tổng số task theo status của 1 nhiệm vụ
	if (!isArray(tasks) || isEmpty(tasks)) return 0;
	let total = 0;
	tasks.forEach((task) => {
		if (task.status === status) total += 1;
	});
	return total;
};

// ------------		  UPDATE FUNCTION CALC PROGRESS MISSION & TASK		-----------------

// tính tổng số bước của 1 subtask
const calcTotalStepOfSubTask = (subtask) => {
	if (isEmpty(subtask)) return 0;
	const { steps } = subtask;
	if (isEmpty(steps)) return 0;
	return size(steps);
};

// tính tổng số bước hoàn thành của 1 subtask
const calcTotalStepCompleteOfSubTask = (subtask) => {
	if (isEmpty(subtask)) return 0;
	const { steps } = subtask;
	if (isEmpty(steps)) return 0;
	let total = 0;
	steps.forEach((item) => {
		if (item.status === 1) total += 1;
	});
	return total;
};

// tính % hoàn thành của 1 subtask
const calcProgressSubtask = (subtask) => {
	if (isEmpty(subtask)) return 0;
	if (subtask.status === 3 || subtask.status === 4 || subtask.status === 7) return 100;
	return (
		Math.round(
			(calcTotalStepCompleteOfSubTask(subtask) / calcTotalStepOfSubTask(subtask)) * 100,
		) || 0
	);
};

// tính số kpi đã dùng cho 1 subtask
const calcKPICompleteOfSubtask = (subtask) => {
	const percentComplete = calcProgressSubtask(subtask);
	return Math.round((percentComplete / 100) * subtask.kpiValue);
};

// tính tổng số kpi của 1 task theo subtask
const calcTotalKPIOfTask = (task) => {
	if (task.status === 4) return task.kpiValue;
	const { subtasks } = task;
	let totalKPI = 0;
	if (!isArray(subtasks) || isEmpty(subtasks)) return 0;
	subtasks.forEach((subtask) => {
		totalKPI += subtask.kpiValue;
	});
	return totalKPI;
};

// tính tổng số kpi đã dùng của 1 task
const calcKPICompleteOfTask = (task) => {
	if (task?.status === 4 || task?.status === 7) return task?.kpiValue;
	const { subtasks } = task;
	let totalKPI = 0;
	if (!isArray(subtasks) || isEmpty(subtasks)) return 0;
	subtasks.forEach((subtask) => {
		if (subtask?.status === 4 || subtask?.status === 7) {
			totalKPI += calcKPICompleteOfSubtask(subtask);
		}
	});
	return totalKPI;
};

// tính % hoàn thành của 1 task (thông qua giá trị kpi)
const calcProgressTask = (task) => {
	const totalCompleteKPI = calcKPICompleteOfTask(task);
	if (task?.status === 4) {
		return 100;
	}
	return Math.round((totalCompleteKPI * 100) / task.kpiValue) || 0;
};

// tính tổng số kpi đã dùng của 1 mission
const calcKPICompleteOfMission = (mission, tasks) => {
	if (isEmpty(mission)) return 0;
	if (isEmpty(tasks) || !isArray(tasks)) return 0;
	let totalKPI = 0;
	tasks.forEach((task) => {
		// if (task?.status === 4 || task?.status === 7) {
		totalKPI += calcKPICompleteOfTask(task);
		// }
	});
	return totalKPI;
};

const calcProgressMission = (mission, tasks) => {
	if (isEmpty(mission)) return 0;
	const totalCompleteKPI = calcKPICompleteOfMission(mission, tasks);
	return Math.round((totalCompleteKPI * 100) / mission.kpiValue) || 0;
};

const calcProgressMissionByTaskComplete = (mission, tasks) => {
	if (isEmpty(mission)) return 0;
	return Math.round((calcTotalTaskByStatus(tasks, 4) * 100) / size(tasks)) || 0;
};

// ------------		  UPDATE FUNCTION CALC TOTAL & PROGRESS SUBTASK		-----------------

// tính tổng số step theo status của 1 subtask
const calcTotalStepByStatus = (subtask, status) => {
	if (isEmpty(subtask)) return 0;
	let total = 0;
	const { steps } = subtask;
	if (isEmpty(steps) || !isArray(steps)) return 0;
	steps.forEach((step) => {
		if (step.status === status) total += 1;
	});
	return total;
};

// tính tổng số subtask theo status
const calcTotalSubtaskByStatus = (task, status) => {
	if (isEmpty(task)) return 0;
	let total = 0;
	const { subtasks } = task;
	if (isEmpty(subtasks) || !isArray(subtasks)) return 0;
	subtasks.forEach((subtask) => {
		if (subtask.status === status) total += 1;
	});
	return total;
};

// ------------		  UPDATE FUNCTION CALC CURRENT KPI VALUE	-----------------
// kpi thực tế của 1 task
const calcTotalCurrentKPIOfTask = (task) => {
	if (isEmpty(task)) return 0;
	const { subtasks } = task;
	if (isEmpty(subtasks) || !isArray(subtasks)) return 0;
	let totalKPI = 0;
	subtasks.forEach((subtask) => {
		totalKPI += subtask.kpiValue;
	});
	return totalKPI;
};

// kpi thực tế của của 1 mission
const calcTotalCurrentKPIOfMission = (mission, tasks) => {
	if (isEmpty(mission)) return 0;
	if (isEmpty(tasks) || !isArray(tasks)) return 0;
	let totalKPI = 0;
	tasks.forEach((task) => {
		totalKPI += calcTotalCurrentKPIOfTask(task);
	});
	return totalKPI;
};

// kpi đã dùng của 1 mission
const calcUsedKPIValueOfMission = (mission, tasks) => {
	if (isEmpty(mission)) return 0;
	if (isEmpty(tasks) || !isArray(tasks)) return 0;
	let totalKPI = 0;
	tasks.forEach((task) => {
		totalKPI += task.kpiValue;
	});
	return totalKPI;
};

// eslint-disable-next-line import/prefer-default-export
export {
	calcTotalTaskByStatus,
	calcKPICompleteOfSubtask,
	calcProgressSubtask,
	calcTotalStepByStatus,
	calcTotalStepOfSubTask,
	calcProgressTask,
	calcProgressMission,
	calcProgressMissionByTaskComplete,
	calcKPICompleteOfTask,
	calcKPICompleteOfMission,
	calcTotalSubtaskByStatus,
	calcTotalKPIOfTask,
	calcUsedKPIValueOfMission,
	calcTotalCurrentKPIOfMission,
};
