import * as Yup from 'yup';

const validate = Yup.object().shape({
	name: Yup.string().required('Vui lòng nhập tên định mức KPI'),
	departmentId: Yup.string().required('Vui lòng chọn phòng ban'),
	description: Yup.string().required('Vui lòng nhập mô tả'),
	evaluationDescription: Yup.string().required('Vui lòng nhập đánh giá đo lường'),
});

export default validate;
