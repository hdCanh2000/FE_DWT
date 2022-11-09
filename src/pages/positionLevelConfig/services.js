import axiosClient from '../../utils/axiosClient';

const getAllPositionLevel = (params) => {
	// lấy danh sách quản lí nhân sự
	return axiosClient({
		method: 'GET',
		url: `/api/positionLevels`,
		params,
	});
};
const addPositionLevel = (data) => {
	return axiosClient({
		method: 'POST',
		url: `/api/positionLevels`,
		data,
	});
};
const updatePositionLevel = (data) => {
	return axiosClient({
		method: 'PUT',
		url: `/api/positionLevels/${data.id}`,
		data,
	});
};
const deletePositionLevel = (id) => {
	return axiosClient({
		method: 'DELETE',
		url: `/api/positionLevels/${id}`,
	});
};
export { getAllPositionLevel, addPositionLevel, updatePositionLevel, deletePositionLevel };
