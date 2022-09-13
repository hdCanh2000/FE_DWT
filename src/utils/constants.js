import COLORS from '../common/data/enumColors';

export const MODAL_ACTION_COLSE = 'MODAL_ACTION_COLSE';
export const MODAL_ACTION_CONFIRM = 'MODAL_ACTION_CONFIRM';
export const FORMAT_TASK_STATUS = (status) => {
	let result = '';
	switch (status) {
		case 0:
			result = 'Chờ chấp nhận';
			break;
		case 1:
			result = 'Chấp nhận';
			break;
		case 2:
			result = 'Đang thực hiện';
			break;
		case 3:
			result = 'Đã xong';
			break;
		case 4:
			result = 'Đã hoàn thành';
			break;
		case 5:
			result = 'Từ chối';
			break;
		case 6:
			result = 'Huỷ';
			break;
		case 7:
			result = 'Đóng';
			break;
		case 8:
			result = 'Tạm dừng';
			break;
		default:
			result = 'Chờ chấp nhận';
			break;
	}
	return result;
};

export const STATUS = {
	PENDING: { value: 0, name: 'Chờ chấp nhận', code: 'pending', color: COLORS.DANGER.name },
	ACCEPTED: { value: 1, name: 'Chấp nhận', code: 'accepted', color: COLORS.INFO.name },
	INPROGRESS: {
		value: 2,
		name: 'Đang thực hiện',
		code: 'inprogress',
		color: COLORS.PRIMARY.name,
	},
	SOLVED: { value: 3, name: 'Đã xong - Chờ duyệt', code: 'solved', color: COLORS.SUCCESS.name },
	COMPLETED: { value: 4, name: 'Đã hoàn thành', code: 'completed', color: COLORS.SUCCESS.name },
	REJECTED: { value: 5, name: 'Từ chối', code: 'rejectes', color: COLORS.DANGER.name },
	FAILED: { value: 6, name: 'Huỷ', code: 'failed', color: COLORS.DARK.name },
	CLOSE: { value: 7, name: 'Đóng', code: 'Pending', color: COLORS.DARK.name },
	ONHOLD: { value: 8, name: 'Tạm dừng', code: 'Pending', color: COLORS.INFO.name },
};

export const TASK_STATUS = {
	ACCEPTED: { value: 1, name: 'Chấp nhận', code: 'accepted', color: COLORS.INFO.name },
	INPROGRESS: {
		value: 2,
		name: 'Đang thực hiện',
		code: 'inprogress',
		color: COLORS.PRIMARY.name,
	},
	SOLVED: { value: 3, name: 'Đã xong - Chờ duyệt', code: 'solved', color: COLORS.SUCCESS.name },
	FAILED: { value: 6, name: 'Huỷ', code: 'failed', color: COLORS.DARK.name },
	ONHOLD: { value: 8, name: 'Tạm dừng', code: 'Pending', color: COLORS.INFO.name },
};

export const TASK_STATUS_MANAGE = {
	FAILED: { value: 6, name: 'Huỷ', code: 'failed', color: COLORS.DARK.name },
	CLOSE: { value: 7, name: 'Đóng', code: 'Pending', color: COLORS.DARK.name },
	ONHOLD: { value: 8, name: 'Tạm dừng', code: 'Pending', color: COLORS.INFO.name },
};

export const renderStatus = () => {
	return STATUS;
	// let result = {};
	// switch (status) {
	// 	case 0:
	// 		result = {
	// 			ACCEPTED: {
	// 				value: 1,
	// 				name: 'Chấp nhận',
	// 				code: 'accepted',
	// 				color: COLORS.INFO.name,
	// 			},
	// 			INPROGRESS: {
	// 				value: 2,
	// 				name: 'Đang thực hiện',
	// 				code: 'inprogress',
	// 				color: COLORS.PRIMARY.name,
	// 			},
	// 		};
	// 		break;
	// 	case 1:
	// 		result = {
	// 			INPROGRESS: {
	// 				value: 2,
	// 				name: 'Đang thực hiện',
	// 				code: 'inprogress',
	// 				color: COLORS.PRIMARY.name,
	// 			},
	// 			SOLVED: {
	// 				value: 3,
	// 				name: 'Đã xong - Chờ duyệt',
	// 				code: 'solved',
	// 				color: COLORS.SUCCESS.name,
	// 			},
	// 			ONHOLD: { value: 8, name: 'Tạm dừng', code: 'Pending', color: COLORS.INFO.name },
	// 		};
	// 		break;
	// 	case 2:
	// 		result = {
	// 			SOLVED: {
	// 				value: 3,
	// 				name: 'Đã xong - Chờ duyệt',
	// 				code: 'solved',
	// 				color: COLORS.SUCCESS.name,
	// 			},
	// 			ONHOLD: { value: 8, name: 'Tạm dừng', code: 'Pending', color: COLORS.INFO.name },
	// 		};
	// 		break;
	// 	case 3:
	// 		result = {
	// 			INPROGRESS: {
	// 				value: 2,
	// 				name: 'Đang thực hiện',
	// 				code: 'inprogress',
	// 				color: COLORS.PRIMARY.name,
	// 			},
	// 			// COMPLETED: {
	// 			// 	value: 4,
	// 			// 	name: 'Đã hoàn thành',
	// 			// 	code: 'completed',
	// 			// 	color: COLORS.SUCCESS.name,
	// 			// },
	// 			// REJECTED: {
	// 			// 	value: 5,
	// 			// 	name: 'Từ chối',
	// 			// 	code: 'rejectes',
	// 			// 	color: COLORS.DANGER.name,
	// 			// },
	// 		};
	// 		break;
	// 	case 4:
	// 		result = {};
	// 		break;
	// 	case 5:
	// 		result = {
	// 			ACCEPTED: {
	// 				value: 1,
	// 				name: 'Chấp nhận',
	// 				code: 'accepted',
	// 				color: COLORS.INFO.name,
	// 			},
	// 			INPROGRESS: {
	// 				value: 2,
	// 				name: 'Đang thực hiện',
	// 				code: 'inprogress',
	// 				color: COLORS.PRIMARY.name,
	// 			},
	// 			SOLVED: {
	// 				value: 3,
	// 				name: 'Đã xong - Chờ duyệt',
	// 				code: 'solved',
	// 				color: COLORS.SUCCESS.name,
	// 			},
	// 		};
	// 		break;
	// 	case 6:
	// 		result = {};
	// 		break;
	// 	case 7:
	// 		result = {};
	// 		break;
	// 	case 8:
	// 		result = {
	// 			INPROGRESS: {
	// 				value: 2,
	// 				name: 'Đang thực hiện',
	// 				code: 'inprogress',
	// 				color: COLORS.PRIMARY.name,
	// 			},
	// 			SOLVED: {
	// 				value: 3,
	// 				name: 'Đã xong - Chờ duyệt',
	// 				code: 'solved',
	// 				color: COLORS.SUCCESS.name,
	// 			},
	// 			FAILED: { value: 6, name: 'Huỷ', code: 'failed', color: COLORS.DARK.name },
	// 		};
	// 		break;
	// 	default:
	// 		result = STATUS;
	// 		break;
	// }
	// return result;
};

export const renderStatusTask = () => {
	return STATUS;
	// let result = {};
	// switch (status) {
	// 	case 0:
	// 		result = TASK_STATUS_MANAGE;
	// 		break;
	// 	case 1:
	// 		result = TASK_STATUS_MANAGE;
	// 		break;
	// 	case 2:
	// 		result = {
	// 			ONHOLD: { value: 8, name: 'Tạm dừng', code: 'Pending', color: COLORS.INFO.name },
	// 		};
	// 		break;
	// 	case 3:
	// 		result = {
	// 			INPROGRESS: {
	// 				value: 2,
	// 				name: 'Đang thực hiện',
	// 				code: 'inprogress',
	// 				color: COLORS.PRIMARY.name,
	// 			},
	// 			REJECTED: {
	// 				value: 5,
	// 				name: 'Từ chối',
	// 				code: 'rejectes',
	// 				color: COLORS.DANGER.name,
	// 			},
	// 			COMPLETED: {
	// 				value: 4,
	// 				name: 'Đã hoàn thành',
	// 				code: 'completed',
	// 				color: COLORS.SUCCESS.name,
	// 			},
	// 		};
	// 		break;
	// 	case 4:
	// 		result = {
	// 			CLOSE: { value: 7, name: 'Đóng', code: 'Pending', color: COLORS.DARK.name },
	// 		};
	// 		break;
	// 	case 5:
	// 		result = {
	// 			CLOSE: { value: 7, name: 'Đóng', code: 'Pending', color: COLORS.DARK.name },
	// 		};
	// 		break;
	// 	case 6:
	// 		result = {
	// 			PENDING: {
	// 				value: 0,
	// 				name: 'Chờ chấp nhận',
	// 				code: 'pending',
	// 				color: COLORS.DANGER.name,
	// 			},
	// 			ACCEPTED: {
	// 				value: 1,
	// 				name: 'Chấp nhận',
	// 				code: 'accepted',
	// 				color: COLORS.INFO.name,
	// 			},
	// 			INPROGRESS: {
	// 				value: 2,
	// 				name: 'Đang thực hiện',
	// 				code: 'inprogress',
	// 				color: COLORS.PRIMARY.name,
	// 			},
	// 		};
	// 		break;
	// 	case 7:
	// 		result = {};
	// 		break;
	// 	case 8:
	// 		result = {
	// 			INPROGRESS: {
	// 				value: 2,
	// 				name: 'Đang thực hiện',
	// 				code: 'inprogress',
	// 				color: COLORS.PRIMARY.name,
	// 			},
	// 			FAILED: { value: 6, name: 'Huỷ', code: 'failed', color: COLORS.DARK.name },
	// 		};
	// 		break;
	// 	default:
	// 		result = STATUS;
	// 		break;
	// }
	// return result;
};

export const formatColorStatus = (status) => {
	let result = '';
	switch (status) {
		case 0:
			result = 'danger';
			break;
		case 1:
			result = 'info';
			break;
		case 2:
			result = 'primary';
			break;
		case 3:
			result = 'success';
			break;
		case 4:
			result = 'success';
			break;
		case 5:
			result = 'danger';
			break;
		case 6:
			result = 'dark';
			break;
		case 7:
			result = 'dark';
			break;
		case 8:
			result = 'info';
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

export const formatPosition = (position) => {
	let result = '';
	switch (position) {
		case 1:
			result = 'Lao động kĩ thuật - NV văn phòng';
			break;
		case 2:
			result = 'Chuyên viên';
			break;
		case 3:
			result = 'Trưởng nhóm';
			break;
		case 4:
			result = 'Trưởng phòng';
			break;
		case 5:
			result = 'QL cấp trung';
			break;
		case 6:
			result = 'QL cấp cao';
			break;
		case 7:
			result = 'Lãnh Đạo';
			break;
		default:
			result = 'Lao Động Phổ Thông';
			break;
	}
	return result;
};
