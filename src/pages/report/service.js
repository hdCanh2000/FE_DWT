import axiosClient from '../../utils/axiosClient';

export const getAllReport = async (params = {}) => {
	const res = await axiosClient({
		method: 'GET',
		url: `/api/reports`,
		params,
	});
	return res.data;
};

export const getAllReportByUserId = async (userId) => {
	const res = await axiosClient({
		method: 'GET',
		url: `/api/reports`,
		params: { userId },
	});
	return res.data;
};

export const createReport = async (data) => {
	const res = await axiosClient({
		method: 'POST',
		url: `/api/reports`,
		data,
	});
	return res.data;
};

export const uploadFileToRemoteHost = async (data) => {
	const res = await axiosClient({
		method: 'POST',
		url: `/api/upload`,
		data,
	});
	return res.data;
};
