import * as Yup from 'yup';

const validate = Yup.object().shape({
	name: Yup.string().required('Vui lòng nhập tên định mức KPI'),
	position: Yup.object().required('Vui lòng chọn vị trí đảm nhiệm'),
});

export default validate;
