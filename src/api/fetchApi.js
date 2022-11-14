import axiosClient from '../utils/axiosClient';

const fetchAPI = (method, url, data, params) => {
	return axiosClient({
		method,
		url,
		data,
		params,
	});
};

const getAllResource = (url, params) => {
	return axiosClient({
		method: 'GET',
		url,
		params,
	});
};

const getResourceById = (url, id, params) => {
	return axiosClient({
		method: 'GET',
		url: `${url}/${id}`,
		params,
	});
};

const addResource = (url, data) => {
	return axiosClient({
		method: 'POST',
		url,
		data,
	});
};

const updateResouce = (url, data) => {
	return axiosClient({
		method: 'PUT',
		url: `${url}/${data.id}`,
		data,
	});
};

const deleteResouce = (url, id) => {
	return axiosClient({
		method: 'DELETE',
		url: `${url}/${id}`,
	});
};

const exportExcel = (url, responseType = 'blob') => {
	return axiosClient({
		method: 'GET',
		url,
		responseType,
	});
};

export {
	fetchAPI,
	getAllResource,
	getResourceById,
	addResource,
	updateResouce,
	deleteResouce,
	exportExcel,
};
