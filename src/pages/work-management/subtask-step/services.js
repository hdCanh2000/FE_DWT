import axiosClient from '../../../utils/axiosClient';

const getTaskById = (id) => {
	return axiosClient({
		method: 'GET',
		url: `/tasks/${id}`,
	});
};

const getSubTaskById = (id) => {
	return axiosClient({
		method: 'GET',
		url: `/subtasks/${id}`,
	});
};

const updateSubtask = (data) => {
	return axiosClient({
		method: 'PUT',
		url: `/subtasks/${data.id}`,
		data,
	});
};

const getAllUser = () => {
	return axiosClient({
		method: 'GET',
		url: `/users`,
	});
};

export { getTaskById, getSubTaskById, updateSubtask, getAllUser };
