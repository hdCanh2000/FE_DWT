import axiosClient from '../../../utils/axiosClient';

const login = (data) => {
	return axiosClient({
		method: 'POST',
		url: '/auth/login',
		data,
	});
};

// eslint-disable-next-line import/prefer-default-export
export { login };
