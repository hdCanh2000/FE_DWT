const validate = (values) => {
	const errors = {};
	if (!values.unit) {
		errors.unit = 'Vui lòng nhập đơn vị đo lường chỉ số key';
	} else if (typeof values.value === "number") {
		errors.unit = 'Đơn vị đo lường chỉ số key không phải là số !';
	}
	if (typeof values.value !== "number") {
		errors.value = "Value phải là một số !"
	}
	if (!values.name) {
		errors.name = 'Vui lòng nhập tên key';
	} else if (values.name.length < 3) {
		errors.name = 'Tên key tối thiểu 3 ký tự';
	}
	if (!values.mission) {
		errors.mission = 'Vui lòng chọn nhiệm vụ cho chỉ số key';
	}
	return errors;
};

export default validate;