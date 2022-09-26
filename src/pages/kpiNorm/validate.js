import * as Yup from 'yup';

const validate = Yup.object().shape({
	// name: Yup.string().required('Vui lòng nhập tên định mức KPI'),
	// department: Yup.object().required('Vui lòng chọn phòng ban'),
	// position: Yup.object().required('Vui lòng chọn vị trí chuyên môn'),
	// description: Yup.string().required('Vui lòng nhập mô tả'),
	// evaluationDescription: Yup.string().required('Vui lòng nhập đánh giá đo lường'),
});

export default validate;
