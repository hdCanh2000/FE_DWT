const validate = (values) => {
	const errors = {};
	if (!values.code) {
		errors.code = 'Vui lòng nhập mã nhân viên';
	} else if (values.code.length < 3) {
		errors.code = 'Mã nhân viên tối thiểu 3 ký tự';
	}

	if (!values.name) {
		errors.name = 'Vui lòng nhập họ tên';
	} else if (values.name.length < 3) {
		errors.name = 'Họ tên tối thiểu 3 ký tự';
	} else if (values.name.length > 30) {
		errors.name = 'Họ tên tối đa 30 ký tự';
	}

	if (!values.email) {
		errors.email = 'Vui lòng nhập email';
	} else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
		errors.email = 'Email không đúng định dạng';
	}

	if (!values.phone) {
		errors.phone = 'Vui lòng nhập số điện thoại';
	} else if (!/(84|0[3|5|7|8|9])+([0-9]{8})/i.test(values.phone)) {
		errors.phone = 'Số điện thoại không đúng định dạng';
	}

	if (!values.password) {
		errors.password = 'Vui lòng nhập mật khẩu.';
	} else {
		errors.password = '';

		if (values.password.length < 8) {
			errors.password += 'Mật khẩu tối thiểu 8 ký tự ';
		}
		if (!/[0-9]/g.test(values.password)) {
			errors.password += 'Mật khẩu phải bao gồm ít nhất 1 ký tự số. ';
		}
		if (!/[a-z]/g.test(values.password)) {
			errors.password += 'Mật khẩu phải bao gồm ký tự viết thường.';
		}
		if (!/[A-Z]/g.test(values.password)) {
			errors.password += 'Mật khẩu phải bao gồm ký tự viết hoa.';
		}
		if (!/[!@#$%^&*)(+=._-]+$/g.test(values.password)) {
			errors.password += 'Mật khẩu bao gồm ký tự đặc biệt.';
		}
	}

	if (!values.confirmPassword) {
		errors.confirmPassword = 'Vui lòng nhập mật khẩu xác nhận.';
	} else if (values.password !== values.confirmPassword) {
		errors.confirmPassword = 'Mật khẩu xác nhận không khớp.';
	}

	return errors;
};

export default validate;
