import * as Yup from 'yup';

const validate = Yup.object().shape({
	code: Yup.string().min(2, 'Mã vị trí tối thiểu  ký tự').required('Vui lòng nhập mã vị trí'),
	name: Yup.string()
		.max(30, 'Tên vị trí tối đa 30 kí tự')
		.min(3, 'Tên vị trí tối thiểu 3 kí tự')
		.required('Vui lòng nhập tên vị trí'),
	departmentId: Yup.string().required('Vui lòng chọn phòng ban'),
	position: Yup.number().required('Vui lòng chọn cấp nhân sự'),
});

export default validate;
