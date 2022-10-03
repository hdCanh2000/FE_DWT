import axiosClient from '../../utils/axiosClient';

const getAllEmployee = () => {
	// lấy danh sách nhân viên
	return axiosClient({
		method: 'GET',
		url: `/api/users`,
	});
};

const getUserById = (id) => {
	return axiosClient({
		method: 'GET',
		url: `/api/users/${id}`,
	});
};

const addEmployee = (data) => {
	return axiosClient({
		method: 'POST',
		url: `/api/users`,
		data,
	});
};

const updateEmployee = (data) => {
	return axiosClient({
		method: 'PUT',
		url: `/api/users/${data.id}`,
		data,
	});
};

export { getAllEmployee, getUserById, addEmployee, updateEmployee };
