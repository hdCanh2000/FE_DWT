import axiosClientNode from '../../../utils/axiosClientNode';

const login = (data) => {
	return axiosClientNode({
		method: 'POST',
		url: '/auth/login',
		data,
	});
};

// eslint-disable-next-line import/prefer-default-export
export { login };
