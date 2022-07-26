import _ from 'lodash';

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

const calculateTotalCompleteTask = () => {
	// tính tổng số task hoàn thành của 1 nhiệm vụ
	const total = 0;
	return total;
};

const calculateTotalFailTask = () => {
	// tính tổng số task bế tắc/xem xét của 1 nhiệm vụ
	const total = 0;
	return total;
};

const calculateTotalFailSubTask = (task = []) => {
	// tính tổng số subtask bế tắc/xem xét của 1 nhiệm vụ
	if (_.isEmpty(task)) return 0;
	const { subtasks } = task;
	if (_.isEmpty(subtasks)) return 0;
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
		if (steps?.length === 0 || _.isEmpty(steps)) return 0;
		steps?.forEach((step) => {
			if (step.status === 2 || step.status === 3) total += 1;
		});
	});
	return total;
};

const calculateTotalStepOfTask = (task) => {
	// tính tổng số bước của 1 task
	if (_.isEmpty(task)) return 0;
	const { subtasks } = task;
	if (_.isEmpty(subtasks)) return 0;
	let totalStep = 0;
	subtasks.forEach((item) => {
		// eslint-disable-next-line no-unsafe-optional-chaining
		totalStep += item?.steps?.length;
	});
	return totalStep;
};

const calculateTotalCompleteStepOfTask = (task) => {
	// tính tổng số bước hoàn thành của 1 task
<<<<<<< HEAD
=======
	// tính tổng số bước của 1 task
>>>>>>> main
	if (_.isEmpty(task)) return 0;
	const { subtasks } = task;
	if (_.isEmpty(subtasks)) return 0;
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

const calculateProgressSubTaskBySteps = (subtasks = []) => {
	// tính % hoàn thành 1 subtask theo step
	const subtasksLength = subtasks?.length;
	let count = 0;
	subtasks?.forEach((item) => {
		if (item?.status === 1) count += 1;
	});
	return Math.floor((count / subtasksLength) * 100);
};

// eslint-disable-next-line import/prefer-default-export
export {
	calculateProgressMission,
	calculateProgressTaskBySteps,
	calculateProgressSubTaskBySteps,
	calculateTotalSubTasks,
	calculateTotalTasks,
	calculateTotalCompleteTask,
	calculateTotalFailTask,
	calculateTotalSubTasksInTasks,
	calculateTotalFailSubTask,
};
