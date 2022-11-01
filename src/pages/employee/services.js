import axiosClient from '../../utils/axiosClient';

const getAllEmployee = (params) => {
	// lấy danh sách nhân viên
	return axiosClient({
		method: 'GET',
		url: `/api/users`,
		params,
	});
};

const getAllEmployeeByDepartment = (id, params) => {
	// lấy danh sách nhân viên
	return axiosClient({
		method: 'GET',
		url: `/api/users/department/${id}`,
		params,
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
const exportExcel = () => {
	return axiosClient({
		method: 'GET',
		url: `/api/users/exportExcel`,
		responseType: 'blob',
	});
};

const deleteEmployee = (id) => {
	return axiosClient({
		method: 'DELETE',
		url: `/api/users/${id}`,
	});
};

export {
	getAllEmployee,
	getAllEmployeeByDepartment,
	getUserById,
	addEmployee,
	updateEmployee,
	deleteEmployee,
	exportExcel,
};
