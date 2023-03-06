import axiosClient from '../../utils/axiosClient';

const getAllKeyReport = async (params) => {
	// lấy danh sách tiêu chí
	const resp = await axiosClient({
		method: 'GET',
		url: `/api/keysReport`,
		params,
	});
	return resp.data;
};

// const getAllKeyReportByDepartment = (id, params) => {
// 	// lấy danh sách nhân viên
// 	return axiosClient({
// 		method: 'GET',
// 		url: `/api/users/department/${id}`,
// 		params,
// 	});
// };

// const getKeyReportById = (id) => {
// 	return axiosClient({
// 		method: 'GET',
// 		url: `/api/users/${id}`,
// 	});
// };

const addKeyReport = (data) => {
	return axiosClient({
		method: 'POST',
		url: `/api/keyreport`,
		data,
	});
};

const updateKeyReport = (data) => {
	return axiosClient({
		method: 'PUT',
		url: `/api/keyreport/${data.id}`,
		data,
	});
};

const deleteKeyReport = (id) => {
	return axiosClient({
		method: 'DELETE',
		url: `/api/keyreport/${id}`,
	});
};

export { getAllKeyReport, addKeyReport, updateKeyReport, deleteKeyReport };
