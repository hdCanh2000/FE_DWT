import * as Yup from 'yup';

const validate = Yup.object().shape({
	code: Yup.string().nullable().required('Vui lòng nhập mã nhân sự'),
	name: Yup.string()
		.max(30, 'Họ tên tối đa 30 kí tự')
		.min(3, 'Họ tên tối thiểu 3 kí tự')
		.required('Vui lòng nhập họ tên'),
	// dateOfBirth: Yup.string().required('Vui lòng nhập ngày sinh'),
	// dateOfJoin: Yup.string().required('Vui lòng nhập ngày tham gia'),
	// department: Yup.object().required('Vui lòng chọn phòng ban'),
	// position: Yup.string().nullable().required('Vui lòng chọn chức vụ'),
	email: Yup.string()
		.nullable()
		.email('Email không đúng định dạng')
		.required('Vui lòng nhập email'),
	sex: Yup.string().nullable().required('Vui lòng chọn giới tính'),
	// department: Yup.string().nullable().required('Vui lòng chọn phòng ban công tác'),
	// position: Yup.string().nullable().required('Vui lòng chọn vị trí làm việc'),
	role: Yup.string().nullable().required('Vui lòng chọn chức vụ'),
	// password: Yup.string().required('Vui lòng nhập mật khẩu'),
	// confirmPassword: Yup.string().when('password', {
	// 	is: (val) => !!(val && val.length > 0),
	// 	then: Yup.string().oneOf([Yup.ref('password')], 'Mật khẩu xác nhận không khớp'),
	// }),
});

export default validate;
