import * as Yup from 'yup';

const validate = Yup.object().shape({
	name: Yup.string()
		.max(30, 'Tên vị trí tối đa 30 kí tự')
		.min(3, 'Tên vị trí tối thiểu 3 kí tự')
		.required('Vui lòng nhập tên vị trí'),
	// address: Yup.string().required('Vui lòng nhập địa điểm làm việc'),
	// jobType: Yup.string().required('Vui lòng nhập loại hình công việc'),
	// description: Yup.string().required('Vui lòng nhập mô tả vị trí'),
	// departmentId: Yup.number().required('Vui lòng chọn phòng ban'),
	// positionLevelId: Yup.number().required('Vui lòng chọn cấp nhân sự'),
});

export default validate;
