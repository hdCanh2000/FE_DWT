import * as Yup from 'yup';

const validate = Yup.object().shape({
	code: Yup.string().min(2, 'Mã vị trí tối thiểu  ký tự').required('Vui lòng nhập mã vị trí'),
	name: Yup.string()
		.max(30, 'Tên vị trí tối đa 30 kí tự')
		.min(3, 'Tên vị trí tối thiểu 3 kí tự')
		.required('Vui lòng nhập tên vị trí'),
	// dateOfBirth: Yup.string().required('Vui lòng nhập ngày sinh'),
	// dateOfJoin: Yup.string().required('Vui lòng nhập ngày tham gia'),
	description: Yup.string().required('Vui lòng nhập mô tả vị trí'),
	departmentId: Yup.string().required('Vui lòng chọn phòng ban'),
	positionLevelId: Yup.string().required('Vui lòng chọn cấp nhân sự'),
	// email: Yup.string().email('Email không đúng định dạng').required('Vui lòng nhập email'),
	// password: Yup.string().required('Vui lòng nhập mật khẩu'),
	// confirmPassword: Yup.string().when('password', {
	// 	is: (val) => !!(val && val.length > 0),
	// 	then: Yup.string().oneOf([Yup.ref('password')], 'Mật khẩu xác nhận không khớp'),
	// }),
});

export default validate;
