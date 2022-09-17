import * as Yup from 'yup';

const validate = Yup.object({
	name: Yup.string().required('Vui lòng nhập tên định mức KPI'),
	department: Yup.string().required('Vui lòng chọn phòng ban'),
	// description: Yup.string().required('Vui lòng nhập mô tả'),
	// unit: Yup.string().required('Vui lòng nhập đơn vị'),
	// point: Yup.string().required('Vui lòng nhập điểm Kpi trên 1 đơn vị'),
});

export default validate;
