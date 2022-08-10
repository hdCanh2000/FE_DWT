import axiosClient from '../../utils/axiosClient';

const getAllEmployee = () => {
	// lấy danh sách nhân viên
	return axiosClient({
		method: 'GET',
		url: `/users?_expand=department`,
	});
};

const getUserById = (id) => {
	return axiosClient({
		method: 'GET',
		url: `/users/${id}?_expand=department`,
	});
};

const addEmployee = (data) => {
	return axiosClient({
		method: 'POST',
		url: `/register`,
		data,
	});
};

const updateEmployee = (data) => {
	return axiosClient({
		method: 'PUT',
		url: `/users/${data.id}`,
		data,
	});
};

// const addUser = (data) => {
// 	return axiosClient({
// 		method: 'POST',
// 		url: `/users`,
// 		data,
// 	});
// };

// const updateUser = (data) => {
// 	return axiosClient({
// 		method: 'PUT',
// 		url: `/users/${data.id}`,
// 		data,
// 	});
// };

export { getAllEmployee, getUserById, addEmployee, updateEmployee };
