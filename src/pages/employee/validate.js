import * as Yup from 'yup';

const validate = Yup.object({
	code: Yup.string()
		.min(3, 'Mã nhân viên tối thiểu 3 ký tự')
		.required('Vui lòng nhập mã nhân viên'),
	name: Yup.string()
		.max(30, 'Họ tên tối đa 30 kí tự')
		.min(3, 'Họ tên tối thiểu 3 kí tự')
		.required('Vui lòng nhập họ tên'),
	email: Yup.string().email('Email không đúng định dạng').required('Vui lòng nhập Email '),
	// password: Yup.string().min(6, 'Mật khẩu tối thiểu 6 kí tự').required('Vui lòng nhập mật khẩu'),
	// confirmPassword: Yup.string()
	// 	.oneOf([Yup.ref('password'), null], 'Mật khẩu không trùng nhau')
	// 	.required('Vui lòng xác nhận mật khẩu'),
});

export default validate;
