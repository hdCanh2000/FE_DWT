/* eslint-disable react/prop-types */
import React, { useState, memo, useEffect } from 'react';
import { Formik, useFormik } from 'formik';
import { Tab, Tabs } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import Button from '../../components/bootstrap/Button';
import Card, {
	CardActions,
	CardBody,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../../components/bootstrap/Card';
import Input from '../../components/bootstrap/forms/Input';
import Textarea from '../../components/bootstrap/forms/Textarea';
import FormGroup from '../../components/bootstrap/forms/FormGroup';
import { updateDepartment } from './services';
import UserDetailPage from './UserDetailPage';
import validate from './validate';
import Checks from '../../components/bootstrap/forms/Checks';
import Select from '../../components/bootstrap/forms/Select';
import { fetchDepartmentWithUserList } from '../../redux/slice/departmentSlice';
import AlertConfirm from '../common/ComponentCommon/AlertConfirm';
import './style.scss';

// eslint-disable-next-line react/prop-types
const DepartmentDetail = ({ organizationLevelOptions, departmentList, initValues }) => {
	const [initData, setInitData] = useState({});
	const dispatch = useDispatch();
	const [isEdit, setIsEdit] = useState(true);
	const [openDelete, setOpenDelete] = useState(false);

	useEffect(() => {
		setInitData({ ...initValues });
	}, [initValues]);

	useEffect(() => {
		formik.initialValues = {
			id: initValues.id,
			code: initValues?.code,
			description: initValues?.description,
			name: initValues?.name,
			address: initValues?.address,
			status: initValues?.status,
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [initValues]);

	const formik = useFormik({
		initialValues: initData,
		enableReinitialize: true,
		validationSchema: validate,
		onSubmit: (values) => {
			handleSubmitForm(values);
			setIsEdit(true);
		},
	});

	const handleSubmitForm = async (data) => {
		const dataSubmit = {
			organizationLevel: parseInt(data?.organizationLevel, 10),
			parentId: parseInt(data?.parentId, 10),
			id: data?.id,
			name: data.name,
			description: data.description,
			code: data.code,
			address: data.address,
			status: Number(data.status),
		};
		// eslint-disable-next-line no-useless-catch
		try {
			await updateDepartment(dataSubmit);
			setInitData({ ...dataSubmit });
			dispatch(fetchDepartmentWithUserList());
		} catch (error) {
			throw error;
		}
	};

	const handleDelete = async (data) => {
		const dataSubmit = {
			organizationLevel: parseInt(data?.organizationLevel, 10),
			parentId: parseInt(data?.parentId, 10),
			id: data?.id,
			name: data.name,
			description: data.description,
			code: data.code,
			address: data.address,
			status: Number(data.status),
			isDelete: 1,
		};
		// eslint-disable-next-line no-useless-catch
		try {
			await updateDepartment(dataSubmit);
			setInitData({ ...dataSubmit });
			dispatch(fetchDepartmentWithUserList());
		} catch (error) {
			throw error;
		}
	};

	const handleEdit = () => {
		setIsEdit(false);
	};

	const handleOpenDelete = () => {
		setOpenDelete(!openDelete);
	};

	return (
		<div className='col-lg-9 col-md-6'>
			<Formik initialValues={initValues} enableReinitialize>
				<Card className='h-98'>
					<Card className='h-100 mb-0'>
						<Tabs defaultActiveKey='userDepartment' id='uncontrolled-tab-example'>
							<Tab
								eventKey='userDepartment'
								title='Danh sách nhân viên'
								className='mb-3'>
								<UserDetailPage dataUser={initValues} />
							</Tab>
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
									<CardActions>
										{isEdit && (
											<div>
												<Button
													color='info'
													size='lg'
													icon='Build'
													tag='button'
													// className='w-30 p-3'
													onClick={() => handleEdit()}
												/>
												<Button
													color='danger'
													size='lg'
													icon='Trash'
													tag='button'
													// className='w-5 p-3'
													style={{ marginLeft: '3px' }}
													onClick={() => handleOpenDelete()}
												/>
											</div>
										)}
									</CardActions>
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
												{!isEdit && (
													<Button
														color='primary'
														size='lg'
														className='w-50 p-3'
														type='submit'
														onClick={formik.handleSubmit}>
														Lưu thông tin
													</Button>
												)}
											</div>
										</div>
									</div>
									<AlertConfirm
										openModal={openDelete}
										onCloseModal={handleOpenDelete}
										onConfirm={() => handleDelete(initValues)}
										title='Xoá cơ cấu tổ chức'
										content={`Xác nhận xoá cơ cấu tổ chức <strong>${initValues?.name}</strong> ?`}
									/>
								</CardBody>
							</Tab>
						</Tabs>
					</Card>
				</Card>
			</Formik>
		</div>
	);
};

export default memo(DepartmentDetail);
