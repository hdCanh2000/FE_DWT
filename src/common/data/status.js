import COLORS from './enumColors';

const STATUS = {
	0: { name: 'Đang thực hiện', color: COLORS.PRIMARY.name },
	1: { name: 'Đã hoàn thành', color: COLORS.SUCCESS.name },
	2: { name: 'Bế tắc', color: COLORS.DANGER.name },
	3: { name: 'Xem xét', color: COLORS.WARNING.name },
};
export default STATUS;
