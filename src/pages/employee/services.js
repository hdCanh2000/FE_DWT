import axiosClient from '../../utils/axiosClient';

const getUserById = (id) => {
	return axiosClient({
		method: 'GET',
		url: `/users/${id}`,
	});
};

// eslint-disable-next-line import/prefer-default-export
export { getUserById };
