import axiosClient from '../../utils/axiosClient';

const getTaskByUser = (id) => {
	return axiosClient({
		method: 'GET',
		url: `/getTaskByUser/${id}`,
	});
};

export default getTaskByUser;
