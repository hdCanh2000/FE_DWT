import axiosClientNode from '../../../utils/axiosClientNode';

const login = (data) => {
	return axiosClientNode({
		method: 'POST',
		url: '/api/auth/login',
		data,
	});
};

// eslint-disable-next-line import/prefer-default-export
export { login };
