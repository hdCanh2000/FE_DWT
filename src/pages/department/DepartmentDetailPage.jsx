import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useToasts } from 'react-toast-notifications';
import { useParams } from 'react-router-dom';
import Tree from 'react-animated-tree-v2';
import { Formik, useFormik } from 'formik';
import { arrayToTree } from 'performant-array-to-tree';
import Button from '../../components/bootstrap/Button';
import Card, { CardBody, CardHeader, CardLabel, CardTitle } from '../../components/bootstrap/Card';
import Page from '../../layout/Page/Page';
import PageWrapper from '../../layout/PageWrapper/PageWrapper';
import Input from '../../components/bootstrap/forms/Input';
import Textarea from '../../components/bootstrap/forms/Textarea';
import FormGroup from '../../components/bootstrap/forms/FormGroup';
import Toasts from '../../components/bootstrap/Toasts';
import { updateDepartment } from './services';
import validate from './validate';
import Checks from '../../components/bootstrap/forms/Checks';
import verifyPermissionHOC from '../../HOC/verifyPermissionHOC';
import {
	fetchDepartmentById,
	fetchDepartmentWithUserList,
} from '../../redux/slice/departmentSlice';
import Select from '../../components/bootstrap/forms/Select';

// eslint-disable-next-line react/prop-types
const DepartmentDetailPage = ({ organizationLevelOptions, departmentList }) => {
	const params = useParams();
	const { addToast } = useToasts();
	const dispatch = useDispatch();
	const department = useSelector((state) => state.department.departments);
	const [itemEdits, setItemEdits] = useState({});
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
		initialValues: itemEdits,
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
			const response = await updateDepartment(dataSubmit);
			const result = await response.data;
			dispatch(fetchDepartmentWithUserList());
			handleShowToast(
				`Cập nhật phòng ban!`,
				`Phòng ban ${result.name} được cập nhật thành công!`,
			);
		} catch (error) {
			handleShowToast(`Cập nhật phòng ban`, `Cập nhật phòng ban không thành công!`);
		}
	};
	const treeStyles = {
		color: 'black',
		fill: 'black',
		width: '100%',
		fontSize: '15px',
	};
	const departments = arrayToTree(department, { childrenField: 'items', dataField: null });
	const handleClick = (item) => {
		setItemEdits(item);
		setIsEdit(true);
	};
	const renderDepartmentMenu = (datas) => {
		return datas?.map((item) => {
			return (
				<div>
					<Tree
						key={item.id}
						content={`${item.name}(${item.items.length})`}
						style={treeStyles}
						open
						onItemClick={() => handleClick(item)}>
						{renderDepartmentMenu(item?.items)}
					</Tree>
				</div>
			);
		});
	};
	// eslint-disable-next-line react-hooks/exhaustive-deps
	const handleEdit = () => {
		setIsEdit(false);
	};

	return (
		<PageWrapper>
			<Page container='fluid'>
				{verifyPermissionHOC(
					<div className='row h-100 w-100'>
						<div className='col-lg-3 col-md-6'>
							<Card className='h-100'>
								<CardBody>{renderDepartmentMenu(departments)}</CardBody>
							</Card>
						</div>
						<div className='col-lg-9 col-md-6'>
							<Formik initialValues={department} enableReinitialize>
								<Card className='h-100'>
									<Card className='h-100 mb-0'>
										<CardHeader>
											<CardLabel icon='Edit' iconColor='warning'>
												<CardTitle>
													{isEdit
														? 'Thông tin chi tiết'
														: 'Chỉnh sửa phòng ban'}
												</CardTitle>
											</CardLabel>
										</CardHeader>
										<CardBody className='pt-0'>
											<div className='row g-4'>
												<div className='col-md-6'>
													<FormGroup id='name' label='Tên phòng ban'>
														<Input
															disabled={isEdit}
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
															disabled={isEdit}
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
													<FormGroup
														id='parentId'
														label='Quan hệ cha con'>
														<Select
															list={departmentList}
															disabled={isEdit}
															type='text'
															placeholder='Chọn quan hệ cha con'
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
													<FormGroup
														id='organizationLevel'
														label='Cấp tổ chức'>
														<Select
															list={organizationLevelOptions}
															disabled={isEdit}
															type='text'
															placeholder='Chọn cấp tổ chức'
															onChange={formik.handleChange}
															onBlur={formik.handleBlur}
															value={formik.values.organizationLevel}
															isValid={formik.isValid}
															isTouched={
																formik.touched.organizationLevel
															}
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
													<FormGroup
														id='status'
														label='Trạng thái hoạt động'>
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
																icon='PersonPlusFill'
																tag='button'
																className='w-50 p-3'
																onClick={() => handleEdit()}>
																Sửa phòng ban
															</Button>
														)}
													</div>
												</div>
											</div>
										</CardBody>
									</Card>
								</Card>
							</Formik>
						</div>
					</div>,
					['admin', 'manager'],
				)}
			</Page>
		</PageWrapper>
	);
};

export default DepartmentDetailPage;
