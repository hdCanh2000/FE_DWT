import axiosClient from '../../../utils/axiosClient';

const getAllSubTasks = () => {
	return axiosClient({
		method: 'GET',
		url: `/subtasks`,
	});
};

const deleteSubtaskById = (id) => {
	return axiosClient({
		method: 'DELETE',
		url: `/subtasks/${id}`,
	});
};

export { getAllSubTasks, deleteSubtaskById };
