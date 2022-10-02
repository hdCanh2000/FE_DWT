import axiosClientNode from '../../utils/axiosClientNode';

const getAllEmployee = () => {
	// lấy danh sách nhân viên
	return axiosClientNode({
		method: 'GET',
		url: `/api/users`,
	});
};

const getUserById = (id) => {
	return axiosClientNode({
		method: 'GET',
		url: `/api/${id}`,
	});
};

const addEmployee = (data) => {
	return axiosClientNode({
		method: 'POST',
		url: `/api/users`,
		data,
	});
};

const updateEmployee = (data) => {
	return axiosClientNode({
		method: 'PUT',
		url: `/api/users/profile/${data.id}`,
		data,
	});
};

export { getAllEmployee, getUserById, addEmployee, updateEmployee };
