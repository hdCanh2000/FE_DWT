import axiosClient from '../../../utils/axiosClient';

const getAllDepartments = () => {
	return axiosClient({
		method: 'GET',
		url: '/departments',
	});
};
const getAllUser = () => {
	return axiosClient({
		method: 'GET',
		url: '/users',
	});
};
const getAllSubtasks = (id) => {
	return axiosClient({
		method: 'GET',
		url: `/tasks/${id}`,
	});
};
const updateSubtasks = (id, data) => {
	return axiosClient({
		method: 'PATCH',
		url: `/tasks/${id}`,
		data,
	});
};

const updateStatusPendingTask = (data) => {
	return axiosClient({
		method: 'PUT',
		url: `/tasks/${data.id}`,
		data,
	});
};

export { updateSubtasks, getAllDepartments, getAllSubtasks, getAllUser, updateStatusPendingTask };
