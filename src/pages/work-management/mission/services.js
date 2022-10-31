import axiosClient from '../../../utils/axiosClient';

const getAllMission = (params) => {
	return axiosClient({
		method: 'GET',
		url: '/api/missions',
		params,
	});
};

const getMissionById = (id) => {
	return axiosClient({
		method: 'GET',
		url: `/api/missions/${id}`,
	});
};

const addNewMission = (data) => {
	return axiosClient({
		method: 'POST',
		url: '/api/missions',
		data,
	});
};

const updateMissionById = (data) => {
	return axiosClient({
		method: 'PUT',
		url: `/api/missions/${data.id}`,
		data,
	});
};

const deleteMissionById = (id) => {
	return axiosClient({
		method: 'DELETE',
		url: `/api/missions/${id}`,
	});
};

export { getAllMission, getMissionById, addNewMission, updateMissionById, deleteMissionById };
