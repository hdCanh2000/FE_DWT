import COLORS from '../common/data/enumColors';

export const MODAL_ACTION_COLSE = 'MODAL_ACTION_COLSE';
export const MODAL_ACTION_CONFIRM = 'MODAL_ACTION_CONFIRM';
export const FORMAT_TASK_STATUS = (status) => {
	let result = '';
	switch (status) {
		case 0:
			result = 'Đang thực hiện';
			break;
		case 1:
			result = 'Đã hoàn thành';
			break;
		case 2:
			result = 'Chờ xác nhận';
			break;
		case 3:
			result = 'Quá hạn/Thất bại';
			break;
		case 4:
			result = 'Từ chối';
			break;
		default:
			result = 'Đang thực hiện';
			break;
	}
	return result;
};

export const STATUS = {
	PENDING: { value: 0, name: 'Đang thực hiện', color: COLORS.PRIMARY.name },
	APPROVED: { value: 1, name: 'Đã hoàn thành', color: COLORS.SUCCESS.name },
	CANCELED: { value: 2, name: 'Chờ xác nhận', color: COLORS.DANGER.name },
	FAILURE: { value: 3, name: 'Quá hạn/Thất bại', color: COLORS.DARK.name },
	REJECTED: { value: 4, name: 'Từ chối', color: COLORS.WARNING.name },
};

export const formatColorStatus = (status) => {
	let result = '';
	switch (status) {
		case 0:
			result = 'primary';
			break;
		case 1:
			result = 'success';
			break;
		case 2:
			result = 'danger';
			break;
		case 3:
			result = 'dark';
			break;
		case 4:
			result = 'warning';
			break;
		default:
			result = 'primary';
			break;
	}
	return result;
};

export const PRIORITIES = [5, 4, 3, 2, 1];

export const formatColorPriority = (priority) => {
	let result = '';
	switch (priority) {
		case 1:
			result = 'success';
			break;
		case 2:
			result = 'primary';
			break;
		case 3:
			result = 'secondary';
			break;
		case 4:
			result = 'warning';
			break;
		case 5:
			result = 'danger';
			break;
		default:
			result = 'success';
			break;
	}
	return result;
};
