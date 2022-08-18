import axiosClient from '../../utils/axiosClient';

const getAllTasks = (params) => {
	return axiosClient({
		method: 'GET',
		url: `/tasks`,
		params,
	});
};

const getAllTasksByDepartment = (departmentId) => {
	return axiosClient({
		method: 'GET',
		url: `/tasks/department/${departmentId}`,
	});
};

const getAllTasksByStatus = (status) => {
	return axiosClient({
		method: 'GET',
		url: `/tasks/status/${status}`,
	});
};

const getAllSubTasksByUser = () => {
	return axiosClient({
		method: 'GET',
		url: `/subtasks_me`,
	});
};

const getReportMisson = (params) => {
	return axiosClient({
		method: 'GET',
		url: `/missions_report`,
		params,
	});
};

const getReportTask = (params) => {
	return axiosClient({
		method: 'GET',
		url: `/tasks_report`,
		params,
	});
};

const getReportSubTask = (params) => {
	return axiosClient({
		method: 'GET',
		url: `/subtasks_report`,
		params,
	});
};

export {
	getAllTasks,
	getAllTasksByStatus,
	getAllTasksByDepartment,
	getReportMisson,
	getReportTask,
	getAllSubTasksByUser,
	getReportSubTask,
};
