import axiosClient from '../../../utils/axiosClient';

const getAllPositionLevel = () => {
	// lấy danh sách quản lí nhân sự
	return axiosClient({
		method: 'GET',
		url: `/positonLevel`,
	});
};
const addPositionLevel = (data) => {
	return axiosClient({
		method: 'POST',
		url: `/positonLevel`,
		data,
	});
};
const updatePositionLevel = (data) => {
	return axiosClient({
		method: 'PUT',
		url: `/positonLevel/${data.id}`,
		data,
	});
};
const deletePositionLevel = (id) => {
	return axiosClient({
		method: 'DELETE',
		url: `/positonLevel/${id}`,
	});
};
export { getAllPositionLevel, addPositionLevel, updatePositionLevel, deletePositionLevel };
