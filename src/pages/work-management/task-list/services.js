import axiosClient from '../../../utils/axiosClient';

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

export { getAllTasks, getAllTasksByDepartment };
