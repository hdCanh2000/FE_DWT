import axiosClient from '../../../utils/axiosClient';

const getAllMission = () => {
	// lấy toàn bộ danh sách mục tiêu
	return axiosClient({
		method: 'GET',
		url: '/missions?_embed=tasks',
	});
};

const getLatestTasks = () => {
	// lấy danh sách các task mới nhất
	return axiosClient({
		method: 'GET',
		url: '/tasks?_order=desc&_limit=6',
	});
};

const getAllTasks = () => {
	// lấy danh sách các task mới nhất
	return axiosClient({
		method: 'GET',
		url: '/tasks',
	});
};

const getMissionById = (id) => {
	// lấy thông tin mục tiêu theo id
	return axiosClient({
		method: 'GET',
		url: `/missions/${id}`,
	});
};

const addNewMission = (data) => {
	// thêm mục tiêu mới
	return axiosClient({
		method: 'POST',
		url: '/missions',
		data,
	});
};

const updateMissionById = (data) => {
	// cập nhật mục tiêu
	return axiosClient({
		method: 'PUT',
		url: `/missions/${data.id}`,
		data,
	});
};

const deleteMissionById = (id) => {
	// xoá mục tiêu
	return axiosClient({
		method: 'DELETE',
		url: `/missions/${id}`,
	});
};

const getAllDepartments = () => {
	// lấy danh sách phòng ban
	return axiosClient({
		method: 'GET',
		url: '/departments',
	});
};

const getAllPositions = () => {
	// lấy danh sách positions
	return axiosClient({
		method: 'GET',
		url: '/positions',
	});
};

const getPositionById = (id) => {
	// lấy danh sách positions
	return axiosClient({
		method: 'GET',
		url: `/positions/${id}`,
	});
};

// task services

const getAllTaksByMissionID = (id) => {
	// lấy tất cả task của nhiệm vụ theo id
	return axiosClient({
		method: 'GET',
		url: `/tasks/mission/${id}`,
	});
};

const deleteTaskById = (id) => {
	// xoá task thuộc mục tiêu
	return axiosClient({
		method: 'DELETE',
		url: `/tasks/${id}`,
	});
};

const getTaskById = (id) => {
	return axiosClient({
		method: 'GET',
		url: `/tasks/${id}`,
	});
};

const addNewTask = (data) => {
	// thêm nhiệm vụ mới
	return axiosClient({
		method: 'POST',
		url: '/tasks',
		data,
	});
};

const updateTaskByID = (data) => {
	// cập nhật công việc
	return axiosClient({
		method: 'PUT',
		url: `/tasks/${data.id}`,
		data,
	});
};

const getAllUser = () => {
	// lấy danh sách nhân viên
	return axiosClient({
		method: 'GET',
		url: `/users`,
	});
};

const getAllKeys = () => {
	return axiosClient({
		method: 'GET',
		url: '/keys',
	});
};

const addKey = (data) => {
	return axiosClient({
		method: 'POST',
		url: `/keys`,
		data,
	});
};

const updateKey = (data) => {
	return axiosClient({
		method: 'PUT',
		url: `/keys/${data.id}`,
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
