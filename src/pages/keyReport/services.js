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

const addKeyReport = (data) => {
	return axiosClient({
		method: 'POST',
		url: `/api/keysReport`,
		data,
	});
};

const updateKeyReport = (data) => {
	return axiosClient({
		method: 'PUT',
		url: `/api/keysReport/${data.id}`,
		data,
	});
};

const deleteKeyReport = (id) => {
	return axiosClient({
		method: 'DELETE',
		url: `/api/keysReport/${id}`,
	});
};

export { getAllKeyReport, addKeyReport, updateKeyReport, deleteKeyReport };
