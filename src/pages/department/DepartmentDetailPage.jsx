import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { useToasts } from 'react-toast-notifications';
import { useParams } from 'react-router-dom';
import { Formik, useFormik } from 'formik';
import Button from '../../components/bootstrap/Button';
import Card, {
	CardActions,
	CardBody,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../../components/bootstrap/Card';
import Page from '../../layout/Page/Page';
import PageWrapper from '../../layout/PageWrapper/PageWrapper';
import { demoPages } from '../../menu';
import Input from '../../components/bootstrap/forms/Input';
import Textarea from '../../components/bootstrap/forms/Textarea';
import FormGroup from '../../components/bootstrap/forms/FormGroup';
import Toasts from '../../components/bootstrap/Toasts';
import { updateDepartment } from './services';
import TableCommon from '../common/ComponentCommon/TableCommon';
import CommonForm from '../common/ComponentCommon/CommonForm';
import validate from './validate';
import Checks from '../../components/bootstrap/forms/Checks';
import { addEmployee, updateEmployee } from '../employee/services';
import Popovers from '../../components/bootstrap/Popovers';
import SubHeaderCommon from '../common/SubHeaders/SubHeaderCommon';
import verifyPermissionHOC from '../../HOC/verifyPermissionHOC';
import { fetchDepartmentById } from '../../redux/slice/departmentSlice';
import { toggleFormSlice } from '../../redux/common/toggleFormSlice';

const DepartmentDetailPage = () => {
	const params = useParams();
	const { addToast } = useToasts();
	const TABS = {
		DETAIL: 'Phòng ban',
		EMPLOYEES: 'Nhân viên',
	};
	const columns = [
		{
			title: 'Họ và tên',
			id: 'name',
			key: 'name',
			type: 'text',
			align: 'left',
			isShow: true,
		},
		{
			title: 'Mã NV',
			id: 'code',
			key: 'code',
			type: 'text',
			align: 'left',
			isShow: true,
		},
		{
			title: 'Ngày sinh',
			id: 'dateOfBirth',
			key: 'dateOfBirth',
			type: 'date',
			align: 'center',
			isShow: true,
			format: (value) => value && `${moment(`${value}`).format('DD-MM-YYYY')}`,
		},
		{
			title: 'Ngày gia nhập',
			id: 'dateOfJoin',
			key: 'dateOfJoin',
			type: 'date',
			align: 'center',
			isShow: true,
			format: (value) => value && `${moment(`${value}`).format('DD-MM-YYYY')}`,
		},
		{
			title: 'Email',
			id: 'email',
			key: 'email',
			type: 'text',
			align: 'left',
			isShow: true,
		},
		{
			title: 'Số điện thoại',
			id: 'phone',
			key: 'phone',
			type: 'text',
			align: 'center',
			isShow: true,
		},
		{
			title: 'Địa chỉ',
			id: 'address',
			key: 'address',
			type: 'textarea',
			align: 'left',
			isShow: true,
			render: (item) => (
				<Popovers desc={item?.address} trigger='hover'>
					<div
						style={{
							maxWidth: 150,
							WebkitLineClamp: '2',
							overflow: 'hidden',
							textOverflow: 'ellipsis',
							display: '-webkit-box',
							WebkitBoxOrient: 'vertical',
						}}>
						{item?.address}
					</div>
				</Popovers>
			),
		},
		{
			title: 'Trạng thái',
			id: 'status',
			key: 'status',
			type: 'switch',
			align: 'center',
			isShow: true,
			format: (value) => (value === 1 ? 'Đang hoạt động' : 'Không hoạt động'),
		},
		{
			title: 'Chức vụ',
			id: 'position',
			key: 'position',
			type: 'singleSelect',
			align: 'center',
			isShow: true,
			format: (value) => (value === 1 ? 'Quản lý' : 'Nhân viên'),
			options: [
				{
					id: 1,
					text: 'Quản lý',
					value: 1,
				},
				{
					id: 2,
					text: 'Nhân viên',
					value: 0,
				},
			],
		},
		{
			title: 'Hành động',
			id: 'action',
			key: 'action',
			align: 'center',
			render: (item) => (
				<Button
					isOutline
					color='success'
					isLight
					className='text-nowrap mx-2'
					icon='Edit'
					onClick={() => handleOpenForm(item)}
				/>
			),
			isShow: false,
		},
	];
	const [activeTab, setActiveTab] = useState(TABS.DETAIL);

	const dispatch = useDispatch();
	const department = useSelector((state) => state.department.department);
	const toggleForm = useSelector((state) => state.toggleForm.open);
	const itemEdit = useSelector((state) => state.toggleForm.data);

	const handleOpenForm = (data) => dispatch(toggleFormSlice.actions.openForm(data));
	const handleCloseForm = () => dispatch(toggleFormSlice.actions.closeForm());

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
		initialValues: {
			id: department.id,
			slug: department?.slug || '',
			description: department?.description || '',
			name: department?.name || '',
			address: department?.address || '',
			status: department?.status,
		},
		enableReinitialize: true,
		validate,
		onSubmit: (values, { resetForm }) => {
			handleSubmitForm(values);
			resetForm();
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
			id: data?.id,
			name: data.name,
			description: data.description,
			slug: data.slug,
			address: data.address,
			status: Number(data.status),
		};
		try {
			const response = await updateDepartment(dataSubmit);
			const result = await response.data;
			dispatch(fetchDepartmentById(params.id));
			handleShowToast(
				`Cập nhật phòng ban!`,
				`Phòng ban ${result.name} được cập nhật thành công!`,
			);
		} catch (error) {
			handleShowToast(`Cập nhật phòng ban`, `Cập nhật phòng ban không thành công!`);
		}
	};

	const handleSubmitEmployeeForm = async (data) => {
		const dataSubmit = {
			id: data?.id,
			name: data.name,
			departmentId: params.id,
			code: data.code,
			email: data.email,
			password: '123456',
			dateOfBirth: data.dateOfBirth,
			dateOfJoin: data.dateOfJoin,
			phone: data.phone,
			address: data.address,
			position: Number.parseInt(data.position, 10),
			status: Number(data.status),
			roles: Number.parseInt(data.position, 10) === 1 ? ['manager'] : ['user'],
		};
		if (data.id) {
			try {
				const response = await updateEmployee(dataSubmit);
				const result = await response.data;
				dispatch(fetchDepartmentById(params.id));
				handleCloseForm();
				handleShowToast(
					`Cập nhật nhân viên!`,
					`Nhân viên ${result?.name} được cập nhật thành công!`,
				);
			} catch (error) {
				handleShowToast(`Cập nhật nhân viên`, `Cập nhật nhân viên không thành công!`);
			}
		} else {
			try {
				const response = await addEmployee(dataSubmit);
				const result = await response.data;
				dispatch(fetchDepartmentById(params.id));
				handleCloseForm();
				handleShowToast(
					`Thêm nhân viên`,
					`Nhân viên ${result?.user?.name} được thêm thành công!`,
				);
			} catch (error) {
				handleShowToast(`Thêm nhân viên`, `Thêm nhân viên không thành công!`);
			}
		}
	};

	return (
		<PageWrapper title={demoPages.companyPage.subMenu.features.text}>
			<SubHeaderCommon />
			<Page container='fluid'>
				{verifyPermissionHOC(
					<div className='row h-100 w-100'>
						<div className='col-lg-2 col-md-6'>
							<Card className='h-100'>
								<CardHeader>
									<CardLabel icon='AccountCircle'>
										<CardTitle>Thông tin</CardTitle>
									</CardLabel>
								</CardHeader>
								<CardBody>
									<div className='row g-3'>
										<div className='col-12'>
											<Button
												icon='Contacts'
												color='info'
												className='w-100 p-3'
												isLight={TABS.DETAIL !== activeTab}
												onClick={() => setActiveTab(TABS.DETAIL)}>
												{TABS.DETAIL}
											</Button>
										</div>
										<div className='col-12'>
											<Button
												icon='LocalPolice'
												color='info'
												className='w-100 p-3'
												isLight={TABS.EMPLOYEES !== activeTab}
												onClick={() => setActiveTab(TABS.EMPLOYEES)}>
												{TABS.EMPLOYEES}
											</Button>
										</div>
									</div>
								</CardBody>
							</Card>
						</div>
						<div className='col-lg-10 col-md-6'>
							{TABS.DETAIL === activeTab && (
								<Formik initialValues={department} enableReinitialize>
									<Card className='h-100'>
										<Card className='h-100 mb-0'>
											<CardHeader>
												<CardLabel icon='Edit' iconColor='warning'>
													<CardTitle>Thông tin chi tiết</CardTitle>
												</CardLabel>
											</CardHeader>
											<CardBody className='pt-0'>
												<div className='row g-4'>
													<div className='col-md-6'>
														<FormGroup id='name' label='Tên phòng ban'>
															<Input
																placeholder='Tên phòng ban'
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
														<FormGroup id='slug' label='Mã phòng ban'>
															<Input
																type='text'
																placeholder='Mã phòng ban'
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
														<FormGroup id='description' label='Mô tả'>
															<Textarea
																rows={5}
																placeholder='Mô tả'
																onChange={formik.handleChange}
																onBlur={formik.handleBlur}
																value={formik.values.description}
																isValid={formik.isValid}
																isTouched={
																	formik.touched.description
																}
																size='lg'
																className='border border-2 shadow-none'
																name='description'
															/>
														</FormGroup>
													</div>
													<div className='col-12'>
														<FormGroup id='address' label='Địa chỉ'>
															<Textarea
																rows={5}
																placeholder='Địa chỉ'
																onChange={formik.handleChange}
																onBlur={formik.handleBlur}
																value={formik.values.address}
																isValid={formik.isValid}
																isTouched={formik.touched.address}
																invalidFeedback={
																	formik.errors.address
																}
																size='lg'
																className='border border-2 shadow-none'
																name='address'
															/>
														</FormGroup>
													</div>
													<div className='col-12'>
														<FormGroup
															id='status'
															label='Trạng thái hoạt động'>
															<Checks
																id='status'
																type='switch'
																size='lg'
																label={
																	Number(formik.values.status) ===
																	1
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
															<Button
																color='primary'
																size='lg'
																className='w-50 p-3'
																type='submit'
																onClick={formik.handleSubmit}>
																Lưu thông tin
															</Button>
														</div>
													</div>
												</div>
											</CardBody>
										</Card>
									</Card>
								</Formik>
							)}
							{TABS.EMPLOYEES === activeTab && (
								<Card className='h-100'>
									<Card className='h-100 mb-0'>
										<CardHeader>
											<CardLabel icon='Edit' iconColor='warning'>
												<CardTitle>Danh sách nhân viên</CardTitle>
											</CardLabel>
											<CardActions>
												<Button
													color='info'
													icon='PersonPlusFill'
													tag='button'
													onClick={() => handleOpenForm(null)}>
													Thêm nhân viên
												</Button>
											</CardActions>
										</CardHeader>
										<div className='p-4'>
											<TableCommon
												className='table table-modern mb-0'
												columns={columns}
												data={department?.users}
											/>
										</div>
									</Card>
								</Card>
							)}
						</div>
					</div>,
					['admin', 'manager'],
				)}

				<CommonForm
					show={toggleForm}
					onClose={handleCloseForm}
					handleSubmit={handleSubmitEmployeeForm}
					item={itemEdit}
					label={itemEdit?.id ? 'Cập nhật nhân viên' : 'Thêm mới nhân viênn'}
					fields={columns}
				/>
			</Page>
		</PageWrapper>
	);
};

export default DepartmentDetailPage;
