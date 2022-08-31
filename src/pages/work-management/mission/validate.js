const validate = (values) => {
	const errors = {};
	if (!values.name) {
		errors.name = 'Vui lòng nhập tên mục tiêu';
	}

	if (!values.kpiValue) {
		errors.kpiValue = 'Vui lòng nhập giá trị KPI';
	} else if (!/^\d+$/.test(values.kpiValue)) {
		errors.kpiValue = 'Giá trị KPI phải là số';
	}

	if (!values.startTime) {
		errors.startTime = 'Vui lòng chọn ngày bắt đầu';
	}

	if (!values.endTime) {
		errors.endTime = 'Vui lòng chọn ngày kết thúc';
	} else if (new Date(values.startTime).getTime() - new Date(values.endTime).getTime() > 0) {
		errors.endTime = 'Ngày kết thúc phải lớn hơn ngày bắt đầu';
	}

	return errors;
};

export default validate;
