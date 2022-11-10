import * as Yup from 'yup';

const digitsOnly = (value) => /^\d*[\\.{1}\d*]\d*$/.test(value) || value.length === 0;

const validate = Yup.object().shape({
	name: Yup.string().required('Vui lòng nhập tên định mức KPI'),
	position: Yup.object().required('Vui lòng chọn vị trí đảm nhiệm'),
	kpi_value: Yup.string()
		.required('Vui lòng nhập giá trị KPI')
		.test('kpi_value', 'Nhập giá trị dạng số', digitsOnly),
	manday: Yup.string().test('manday', 'Nhập giá trị dạng số', digitsOnly),
});

export default validate;
