import axiosClient from '../../../utils/axiosClient';

const login = (data) => {
	return axiosClient({
		method: 'POST',
		url: '/api/auth/login',
		data,
	});
};

// eslint-disable-next-line import/prefer-default-export
export { login };
