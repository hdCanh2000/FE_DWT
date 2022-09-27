import React, { useEffect, useState, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useToasts } from 'react-toast-notifications';
import { useParams } from 'react-router-dom';
import { Formik, useFormik } from 'formik';
import { Tab, Tabs } from 'react-bootstrap';
import Button from '../../components/bootstrap/Button';
import Card, { CardBody, CardHeader, CardLabel, CardTitle } from '../../components/bootstrap/Card';
import Input from '../../components/bootstrap/forms/Input';
import Textarea from '../../components/bootstrap/forms/Textarea';
import FormGroup from '../../components/bootstrap/forms/FormGroup';
import Toasts from '../../components/bootstrap/Toasts';
import { updateDepartment } from './services';
import UserDetailPage from './UserDetailPage';
import validate from './validate';
import Checks from '../../components/bootstrap/forms/Checks';
import {
	fetchDepartmentById,
	fetchDepartmentWithUserList,
} from '../../redux/slice/departmentSlice';
import Select from '../../components/bootstrap/forms/Select';

// eslint-disable-next-line react/prop-types
const DepartmentDetail = ({ organizationLevelOptions, departmentList, initValues }) => {
	const params = useParams();
	const { addToast } = useToasts();
	const dispatch = useDispatch();
	const department = useSelector((state) => state.department.departments);
	const [isEdit, setIsEdit] = useState(true);
	useEffect(() => {
		dispatch(fetchDepartmentById(params.id));
		formik.initialValues = {
			id: department.id,
			slug: department?.slug,
			description: department?.description,
			name: department?.name,
			address: department?.address,
			status: department?.status,
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dispatch, params.id]);
	const formik = useFormik({
		initialValues: initValues,
		enableReinitialize: true,
		validationSchema: validate,
		onSubmit: (values) => {
			handleSubmitForm(values);
			setIsEdit(true);
		},
	});

	const handleShowToast = (title, content) => {
		addToast(
			<Toasts title={title} icon='Check2Circle' iconColor='success' time='Now' isDismiss>
				{content}
			</Toasts>,
			{
				autoDismiss: true,
			},
		);
	};

	const handleSubmitForm = async (data) => {
		const dataSubmit = {
			organizationLevel: parseInt(data?.organizationLevel, 10),
			parentId: parseInt(data?.parentId, 10),
			id: data?.id,
			name: data.name,
			description: data.description,
			slug: data.slug,
			address: data.address,
			status: Number(data.status),
		};
		try {
			await updateDepartment(dataSubmit);
			dispatch(fetchDepartmentWithUserList());
		} catch (error) {
			handleShowToast(`Cập nhật phòng ban`, `Cập nhật phòng ban không thành công!`);
		}
	};
	// eslint-disable-next-line react-hooks/exhaustive-deps
	const handleEdit = () => {
		setIsEdit(false);
	};

	return (
		<div className='col-lg-8 col-md-6'>
			<Formik initialValues={initValues} enableReinitialize>
				<Card className='h-100'>
					<Card className='h-100 mb-0'>
						<Tabs defaultActiveKey='departmentDetail' id='uncontrolled-tab-example'>
							<Tab
								eventKey='departmentDetail'
								title='Thông tin chi tiết'
								className='mb-3'>
								<CardHeader>
									<CardLabel icon='Edit' iconColor='warning'>
										<CardTitle>
											{isEdit
												? 'Thông tin chi tiết cơ cấu tổ chức'
												: 'Chỉnh sửa cấu tổ chức'}
										</CardTitle>
									</CardLabel>
								</CardHeader>
								<CardBody className='pt-0'>
									<div className='row g-4'>
										<div className='col-md-6'>
											<FormGroup id='name' label='Tên đơn vị'>
												<Input
													disabled={isEdit}
													placeholder='Tên đơn vị'
													onChange={formik.handleChange}
													onBlur={formik.handleBlur}
													value={formik.values.name}
													isValid={formik.isValid}
													isTouched={formik.touched.name}
													invalidFeedback={formik.errors.name}
													size='lg'
													className='border border-2 shadow-none'
												/>
											</FormGroup>
										</div>
										<div className='col-md-6'>
											<FormGroup id='slug' label='Mã cơ cấu tổ chức'>
												<Input
													disabled={isEdit}
													type='text'
													placeholder='Mã đơn vị'
													onChange={formik.handleChange}
													onBlur={formik.handleBlur}
													value={formik.values.slug}
													isValid={formik.isValid}
													isTouched={formik.touched.slug}
													size='lg'
													className='border border-2 shadow-none'
												/>
											</FormGroup>
										</div>
										<div className='col-md-12'>
											<FormGroup id='parentId' label='Thuộc đơn vị'>
												<Select
													list={departmentList}
													disabled={isEdit}
													type='text'
													placeholder='Chọn đơn vị trực thuộc'
													onChange={formik.handleChange}
													onBlur={formik.handleBlur}
													value={formik.values.parentId}
													isValid={formik.isValid}
													isTouched={formik.touched.parentId}
													size='lg'
													className='border border-2 shadow-none'
												/>
											</FormGroup>
										</div>
										<div className='col-md-12'>
											<FormGroup id='organizationLevel' label='Cấp tổ chức'>
												<Select
													list={organizationLevelOptions}
													disabled={isEdit}
													type='text'
													placeholder='Chọn cấp tổ chức'
													onChange={formik.handleChange}
													onBlur={formik.handleBlur}
													value={formik.values.organizationLevel}
													isValid={formik.isValid}
													isTouched={formik.touched.organizationLevel}
													size='lg'
													className='border border-2 shadow-none'
												/>
											</FormGroup>
										</div>
										<div className='col-md-12'>
											<FormGroup id='description' label='Mô tả'>
												<Textarea
													disabled={isEdit}
													rows={3}
													placeholder='Mô tả'
													onChange={formik.handleChange}
													onBlur={formik.handleBlur}
													value={formik.values.description}
													isValid={formik.isValid}
													isTouched={formik.touched.description}
													size='lg'
													className='border border-2 shadow-none'
													name='description'
												/>
											</FormGroup>
										</div>
										<div className='col-12'>
											<FormGroup id='address' label='Địa chỉ'>
												<Textarea
													disabled={isEdit}
													rows={3}
													placeholder='Địa chỉ'
													onChange={formik.handleChange}
													onBlur={formik.handleBlur}
													value={formik.values.address}
													isValid={formik.isValid}
													isTouched={formik.touched.address}
													invalidFeedback={formik.errors.address}
													size='lg'
													className='border border-2 shadow-none'
													name='address'
												/>
											</FormGroup>
										</div>
										<div className='col-12'>
											<FormGroup id='status' label='Trạng thái hoạt động'>
												<Checks
													disabled={isEdit}
													id='status'
													type='switch'
													size='lg'
													label={
														Number(formik.values.status) === 1
															? 'Đang hoạt động'
															: 'Không hoạt động'
													}
													onChange={formik.handleChange}
													checked={formik.values.status}
												/>
											</FormGroup>
										</div>
										<div className='col-12'>
											<div className='w-100 mt-4 text-center'>
												{!isEdit ? (
													<Button
														color='primary'
														size='lg'
														className='w-50 p-3'
														type='submit'
														onClick={formik.handleSubmit}>
														Lưu thông tin
													</Button>
												) : (
													<Button
														color='info'
														size='lg'
														icon='Build'
														tag='button'
														className='w-50 p-3'
														onClick={() => handleEdit()}>
														Sửa cơ cấu tổ chức
													</Button>
												)}
											</div>
										</div>
									</div>
								</CardBody>
							</Tab>
							<Tab
								eventKey='userDepartment'
								title='Danh sách nhân viên'
								className='mb-3'>
								<UserDetailPage dataUser={initValues}/>
							</Tab>
						</Tabs>
					</Card>
				</Card>
			</Formik>
		</div>
	);
};

export default memo(DepartmentDetail);
