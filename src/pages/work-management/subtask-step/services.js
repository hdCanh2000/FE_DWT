import axiosClient from '../../../utils/axiosClient';

const getTaskById = (id) => {
	return axiosClient({
		method: 'GET',
		url: `/tasks/${id}`,
	});
};

const getSubTaskById = () => {
	return axiosClient({
		method: 'GET',
		url: '/tasks',
	});
};

const updateStatusPendingSubtask = (data) => {
	return axiosClient({
		method: 'PUT',
		url: `/tasks/${data.id}`,
		data,
	});
};

const addStepIntoSubtask = (data) => {
	return axiosClient({
		method: 'PUT',
		url: `/tasks/${data.id}`,
		data,
	});
};

const getAllUser = () => {
	// lấy danh sách nhân viên
	return axiosClient({
		method: 'GET',
		url: `/users`,
	});
};

// eslint-disable-next-line import/prefer-default-export
export { getTaskById, getSubTaskById, updateStatusPendingSubtask, getAllUser, addStepIntoSubtask };
