import axiosClient from '../../../utils/axiosClient';

const login = () => {
	// lấy toàn bộ danh sách mục tiêu
	return axiosClient({
		method: 'GET',
		url: '/login',
	});
};

// eslint-disable-next-line import/prefer-default-export
export { login };
