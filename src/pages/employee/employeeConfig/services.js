import axiosClient from '../../../utils/axiosClient';

const getAllPositionLevel = () => {
	// lấy danh sách quản lí nhân sự
	return axiosClient({
		method: 'GET',
		url: `/positionLevels`,
	});
};
const addPositionLevel = (data) => {
	return axiosClient({
		method: 'POST',
		url: `/positionLevels`,
		data,
	});
};
const updatePositionLevel = (data) => {
	return axiosClient({
		method: 'PUT',
		url: `/positionLevels/${data.id}`,
		data,
	});
};
const deletePositionLevel = (id) => {
	return axiosClient({
		method: 'DELETE',
		url: `/positionLevels/${id}`,
	});
};
export { getAllPositionLevel, addPositionLevel, updatePositionLevel, deletePositionLevel };
