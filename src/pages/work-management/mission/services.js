import axiosClient from '../../../utils/axiosClient';

const getAllMission = () => {
	// lấy toàn bộ danh sách mục tiêu
	return axiosClient({
		method: 'GET',
		url: '/api/missions',
	});
};

const getLatestTasks = () => {
	// lấy danh sách các task mới nhất
	return axiosClient({
		method: 'GET',
		url: '/api/tasks?_order=desc&_limit=6',
	});
};

const getAllTasks = () => {
	// lấy danh sách các task mới nhất
	return axiosClient({
		method: 'GET',
		url: '/api/tasks',
	});
};

const getMissionById = (id) => {
	// lấy thông tin mục tiêu theo id
	return axiosClient({
		method: 'GET',
		url: `/api/missions/${id}`,
	});
};

const addNewMission = (data) => {
	// thêm mục tiêu mới
	return axiosClient({
		method: 'POST',
		url: '/api/missions',
		data,
	});
};

const updateMissionById = (data) => {
	// cập nhật mục tiêu
	return axiosClient({
		method: 'PUT',
		url: `/api/missions/${data.id}`,
		data,
	});
};

const deleteMissionById = (id) => {
	// xoá mục tiêu
	return axiosClient({
		method: 'DELETE',
		url: `/api/missions/${id}`,
	});
};

const getAllDepartments = () => {
	// lấy danh sách phòng ban
	return axiosClient({
		method: 'GET',
		url: '/api/departments',
	});
};

const getAllPositions = () => {
	// lấy danh sách positions
	return axiosClient({
		method: 'GET',
		url: '/api/positions',
	});
};

const getPositionById = (id) => {
	// lấy danh sách positions
	return axiosClient({
		method: 'GET',
		url: `/api/positions/${id}`,
	});
};

// task services

const getAllTaksByMissionID = (id) => {
	// lấy tất cả task của nhiệm vụ theo id
	return axiosClient({
		method: 'GET',
		url: `/api/tasks/mission/${id}`,
	});
};

const deleteTaskById = (id) => {
	// xoá task thuộc mục tiêu
	return axiosClient({
		method: 'DELETE',
		url: `/api/tasks/${id}`,
	});
};

const getTaskById = (id) => {
	return axiosClient({
		method: 'GET',
		url: `/api/tasks/${id}`,
	});
};

const addNewTask = (data) => {
	// thêm nhiệm vụ mới
	return axiosClient({
		method: 'POST',
		url: '/api/tasks',
		data,
	});
};

const updateTaskByID = (data) => {
	// cập nhật công việc
	return axiosClient({
		method: 'PUT',
		url: `/api/tasks/${data.id}`,
		data,
	});
};

const getAllUser = () => {
	// lấy danh sách nhân viên
	return axiosClient({
		method: 'GET',
		url: `/api/users`,
	});
};

const getAllKeys = () => {
	return axiosClient({
		method: 'GET',
		url: '/api/keys?_expand=unit',
	});
};

const addKey = (data) => {
	return axiosClient({
		method: 'POST',
		url: `/api/keys`,
		data,
	});
};

const updateKey = (data) => {
	return axiosClient({
		method: 'PUT',
		url: `/api/keys/${data.id}`,
		data,
	});
};

export {
	addKey,
	updateKey,
	getAllKeys,
	getAllMission,
	getLatestTasks,
	getAllDepartments,
	getAllPositions,
	getMissionById,
	addNewMission,
	updateMissionById,
	deleteMissionById,
	deleteTaskById,
	getAllTaksByMissionID,
	getTaskById,
	addNewTask,
	updateTaskByID,
	getAllUser,
	getAllTasks,
	getPositionById,
};
