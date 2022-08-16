import axiosClient from '../../../utils/axiosClient';

const getAllSubTasks = () => {
	return axiosClient({
		method: 'GET',
		url: `/subtasks`,
	});
};

// eslint-disable-next-line import/prefer-default-export
export { getAllSubTasks };
