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

const getTaskById = (id) => {
	return axiosClient({
		method: 'GET',
		url: `/tasks/${id}`,
	});
};

const getAllSubtasksByTaskId = (id) => {
	return axiosClient({
		method: 'GET',
		url: `/subtasks/task/${id}`,
	});
};

const getSubTaskById = (id) => {
	return axiosClient({
		method: 'GET',
		url: `/subtasks/${id}`,
	});
};

const addNewSubtask = (data) => {
	return axiosClient({
		method: 'POST',
		url: `/subtasks`,
		data,
	});
};

const updateSubtask = (data) => {
	return axiosClient({
		method: 'PUT',
		url: `/subtasks/${data.id}`,
		data,
	});
};

const deleteSubtask = (id) => {
	return axiosClient({
		method: 'DELETE',
		url: `/subtasks/${id}`,
	});
};

const updateStatusPendingTask = (data) => {
	return axiosClient({
		method: 'PUT',
		url: `/tasks/${data.id}`,
		data,
	});
};

const getAllTasks = () => {
	// lấy danh sách các task mới nhất
	return axiosClient({
		method: 'GET',
		url: '/tasks',
	});
};
const getAllKeys = () => {
	return axiosClient({
		method: 'GET',
		url: '/keys?_expand=unit',
	});
};
export {
	getAllKeys,
	getAllDepartments,
	getTaskById,
	getAllSubtasksByTaskId,
	getAllUser,
	getSubTaskById,
	addNewSubtask,
	updateSubtask,
	updateStatusPendingTask,
	deleteSubtask,
	getAllTasks,
};
