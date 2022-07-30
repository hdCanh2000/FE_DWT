import { isArray, isEmpty } from 'lodash';

const calculateTotalTasks = (tasks = []) => {
	// tính tổng số task của 1 nhiệm vụ
	return tasks?.length || 0;
};

const calculateTotalSubTasks = (subtasks = []) => {
	// tính tổng số subtask của 1 task
	return subtasks?.length || 0;
};

const calculateTotalSubTasksInTasks = (tasks = []) => {
	// tính tổng số subtask của 1 nhiệm vụ
	let total = 0;
	if (tasks?.length === 0 || !tasks) return 0;
	tasks?.forEach((item) => {
		// eslint-disable-next-line no-unsafe-optional-chaining
		total += item?.subtasks?.length;
	});
	return total || 0;
};

const calcTotalTaskByStatus = (tasks, status) => {
	// tính tổng số task theo status của 1 nhiệm vụ
	if (!isArray(tasks) || isEmpty(tasks)) return 0;
	let total = 0;
	tasks.forEach((task) => {
		if (task.status === status) total += 1;
	});
	return total;
};

const calculateTotalFailSubTask = (task = []) => {
	// tính tổng số subtask bế tắc/xem xét của 1 nhiệm vụ
	if (isEmpty(task)) return 0;
	const { subtasks } = task;
	if (isEmpty(subtasks)) return 0;
	let total = 0;
	// eslint-disable-next-line consistent-return
	subtasks.forEach((item) => {
		if (item.status === 2 || item.status === 3) {
			total += 1;
		}
	});
	// eslint-disable-next-line consistent-return
	subtasks.forEach((item) => {
		const { steps } = item;
		if (steps?.length === 0 || isEmpty(steps)) return 0;
		steps?.forEach((step) => {
			if (step.status === 2 || step.status === 3) total += 1;
		});
	});
	return total;
};

const calculateTotalStepOfTask = (task) => {
	// tính tổng số bước của 1 task
	if (isEmpty(task)) return 0;
	const { subtasks } = task;
	if (isEmpty(subtasks)) return 0;
	let totalStep = 0;
	subtasks.forEach((item) => {
		// eslint-disable-next-line no-unsafe-optional-chaining
		totalStep += item?.steps?.length;
	});
	return totalStep;
};

const calculateTotalCompleteStepOfTask = (task) => {
	// tính tổng số bước hoàn thành của 1 task
	// tính tổng số bước của 1 task
	if (isEmpty(task)) return 0;
	const { subtasks } = task;
	if (isEmpty(subtasks)) return 0;
	let totalStep = 0;
	// eslint-disable-next-line consistent-return
	subtasks.forEach((item) => {
		const { steps } = item;
		if (steps?.length === 0 || !steps) return 0;
		steps?.forEach((step) => {
			if (step.status === 1) totalStep += 1;
		});
	});
	return totalStep;
};

const calculateProgressMission = (tasks = []) => {
	// tính % hoàn thành mục tiêu
	if (tasks?.length === 0 || !tasks) return 0;
	let totalStep = 0;
	let totalCompleteStep = 0;
	tasks.forEach((item) => {
		totalStep += calculateTotalStepOfTask(item);
		totalCompleteStep += calculateTotalCompleteStepOfTask(item);
	});
	return Math.round((totalCompleteStep / totalStep) * 100);
};

const calculateProgressTaskBySteps = (subtasks = []) => {
	// tính % hoàn thành 1 task theo step
	let countStepComplete = 0;
	let stepsLength = 0;
	if (subtasks.length === 0 || !subtasks) return 0;

	subtasks.forEach((item) => {
		stepsLength += item.steps.length;
	});

	// eslint-disable-next-line consistent-return
	subtasks.forEach((item) => {
		const { steps } = item;
		if (steps?.length === 0 || !steps) return 0;
		steps?.forEach((step) => {
			if (step.status === 1) countStepComplete += 1;
		});
	});
	return Math.round((countStepComplete / stepsLength) * 100);
};

// tính % hoàn thành 1 subtask theo step
const calculateProgressSubTaskBySteps = (subtask = {}) => {
	if (isEmpty(subtask)) return 0;
	const stepsLength = subtask?.steps?.length;
	const { steps } = subtask;
	if (!isArray(steps) || isEmpty(steps)) return 0;
	let count = 0;
	steps?.forEach((item) => {
		if (item?.status === 1) count += 1;
	});
	return Math.floor((count / stepsLength) * 100);
};

// ------------		  UPDATE FUNCTION CALC PROGRESS MISSION & TASK		-----------------

// tính tổng số bước của 1 subtask
const calcTotalStepOfSubTask = (subtask) => {
	if (isEmpty(subtask)) return 0;
	const { steps } = subtask;
	if (isEmpty(steps)) return 0;
	return steps.length;
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
	// if (subtask?.status === 1) {
	const { steps } = subtask;
	if (isEmpty(steps)) return 0;
	return (
		Math.round(
			(calcTotalStepCompleteOfSubTask(subtask) / calcTotalStepOfSubTask(subtask)) * 100,
		) || 0
	);
	// }
	// return 0;
};

// tính số kpi đã dùng cho 1 subtask
const calcKPICompleteOfSubtask = (subtask) => {
	const percentComplete = calcProgressSubtask(subtask);
	return Math.round((percentComplete / 100) * subtask.kpi_value);
};

// tính tổng số kpi đã dùng của 1 task
const calcKPICompleteOfTask = (task) => {
	const { subtasks } = task;
	let totalKPI = 0;
	if (!isArray(subtasks) || isEmpty(subtasks)) return 0;
	subtasks.forEach((subtask) => {
		if (subtask?.status === 1) {
			totalKPI += calcKPICompleteOfSubtask(subtask);
		}
	});
	return totalKPI;
};

// tính % hoàn thành của 1 task (thông qua giá trị kpi)
const calcProgressTask = (task) => {
	const totalCompleteKPI = calcKPICompleteOfTask(task);
	return Math.round((totalCompleteKPI * 100) / task.kpi_value) || 0;
};

// tính tổng số kpi đã dùng của 1 mission
const calcKPICompleteOfMission = (mission, tasks) => {
	if (isEmpty(mission)) return 0;
	if (isEmpty(tasks) || !isArray(tasks)) return 0;
	let totalKPI = 0;
	tasks.forEach((task) => {
		if (task?.status === 1) {
			totalKPI += calcKPICompleteOfTask(task);
		}
	});
	return totalKPI;
};

const calcProgressMission = (mission, tasks) => {
	if (isEmpty(mission)) return 0;
	const totalCompleteKPI = calcKPICompleteOfMission(mission, tasks);
	return Math.round((totalCompleteKPI * 100) / mission.current_kpi_value) || 0;
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

// eslint-disable-next-line import/prefer-default-export
export {
	calculateProgressMission,
	calculateProgressTaskBySteps,
	calculateProgressSubTaskBySteps,
	calculateTotalSubTasks,
	calculateTotalTasks,
	calcTotalTaskByStatus,
	calculateTotalSubTasksInTasks,
	// subtask
	calculateTotalFailSubTask,
	calcKPICompleteOfSubtask,
	calcProgressSubtask,
	calcTotalStepByStatus,
	// tính tổng số bước của 1 subtask
	calcTotalStepOfSubTask,
	// UPDATE
	// tính % hoàn thành task
	calcProgressTask,
	// tính % hoàn thành mission
	calcProgressMission,
	// tính số kpi đã dùng của 1 task
	calcKPICompleteOfTask,
	// tính số kpi đã dùng của mission
	calcKPICompleteOfMission,
};
