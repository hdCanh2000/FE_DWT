import * as Yup from 'yup';

const validate = Yup.object().shape({
	name: Yup.string()
		.max(30, 'Tên vị trí tối đa 30 kí tự')
		.min(3, 'Tên vị trí tối thiểu 3 kí tự')
		.required('Vui lòng nhập tên vị trí'),
	description: Yup.string().required('Vui lòng nhập mô tả vị trí'),
});

export default validate;
