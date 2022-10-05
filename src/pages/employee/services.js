import axiosClient from '../../utils/axiosClient';

const getAllEmployee = () => {
	// lấy danh sách nhân viên
	return axiosClient({
		method: 'GET',
		url: `/api/users`,
	});
};

const getAllEmployeeByDepartment = (id) => {
	// lấy danh sách nhân viên
	return axiosClient({
		method: 'GET',
		url: `/api/users/department/${id}`,
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
		url: `/api/users/profile`,
		data,
	});
};

export { getAllEmployee, getAllEmployeeByDepartment, getUserById, addEmployee, updateEmployee };
