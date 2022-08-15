import axiosClient from '../../../utils/axiosClient';

const getAllTasks = () => {
	return axiosClient({
		method: 'GET',
		url: `/tasks`,
	});
};

// eslint-disable-next-line import/prefer-default-export
export { getAllTasks };
