import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { useToasts } from 'react-toast-notifications';
// import { useParams } from 'react-router-dom';
import { Formik } from 'formik';
import Button from '../../components/bootstrap/Button';
import Card, {
	CardBody,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../../components/bootstrap/Card';
import Page from '../../layout/Page/Page';
import PageWrapper from '../../layout/PageWrapper/PageWrapper';
import { demoPages } from '../../menu';
// import Toasts from '../../components/bootstrap/Toasts';
import CommonForm from '../common/ComponentCommon/CommonForm';
// import validate from './validate';
import SubHeaderCommon from '../common/SubHeaders/SubHeaderCommon';
import verifyPermissionHOC from '../../HOC/verifyPermissionHOC';
import { toggleFormSlice } from '../../redux/common/toggleFormSlice';
import { fetchPositionList } from '../../redux/slice/positionSlice';


const PositionDetailPage = () => {
	// const params = useParams();
	// const { addToast } = useToasts();
	const TABS = {
		INFOR: 'Thông tin',
		MISSiONS: 'Thêm nhiệm vụ',
	};

	const [activeTab, setActiveTab] = useState(TABS.INFOR);

	const dispatch = useDispatch();
	const toggleForm = useSelector((state) => state.toggleForm.open);
	const itemEdit = useSelector((state) => state.toggleForm.data);
	const positions = useSelector((state) => state.position.positions);
	console.log(positions);

	useEffect(() => {
		dispatch(fetchPositionList());
	}, [dispatch]);

	const handleCloseForm = () => dispatch(toggleFormSlice.actions.closeForm());

	// const handleShowToast = (title, content) => {
	// 	addToast(
	// 		<Toasts title={title} icon='Check2Circle' iconColor='success' time='Now' isDismiss>
	// 			{content}
	// 		</Toasts>,
	// 		{
	// 			autoDismiss: true,
	// 		},
	// 	);
	// };

	// const handleSubmitEmployeeForm = async (data) => {
	// 	const dataSubmit = {};
	// 	if (data.id) {
	// 		try {
	// 			// const response = await updateEmployee(dataSubmit);
	// 			const result = await response.data;
	// 			dispatch(fetchDepartmentById(params.id));
	// 			handleCloseForm();
	// 			handleShowToast(
	// 				`Cập nhật nhân viên!`,
	// 				`Nhân viên ${result?.name} được cập nhật thành công!`,
	// 			);
	// 		} catch (error) {
	// 			handleShowToast(`Cập nhật nhân viên`, `Cập nhật nhân viên không thành công!`);
	// 		}
	// 	} else {
	// 		try {
	// 			// const response = await addEmployee(dataSubmit);
	// 			const result = await response.data;
	// 			dispatch(fetchDepartmentById(params.id));
	// 			handleCloseForm();
	// 			handleShowToast(
	// 				`Thêm nhân viên`,
	// 				`Nhân viên ${result?.user?.name} được thêm thành công!`,
	// 			);
	// 		} catch (error) {
	// 			handleShowToast(`Thêm nhân viên`, `Thêm nhân viên không thành công!`);
	// 		}
	// 	}
	// };

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
												isLight={TABS.INFOR !== activeTab}
												onClick={() => setActiveTab(TABS.INFOR)}>
												{TABS.INFOR}
											</Button>
										</div>
										<div className='col-12'>
											<Button
												icon='Edit'
												color='info'
												className='w-100 p-3'
												isLight={TABS.MISSiONS !== activeTab}
												onClick={() => setActiveTab(TABS.MISSiONS)}>
												{TABS.MISSiONS}
											</Button>
										</div>
									</div>
								</CardBody>
							</Card>
						</div>
						<div className='col-lg-10 col-md-6'>
							{TABS.INFOR === activeTab && (
								<Card className='h-100'>
									<Card className='h-100 mb-0'>
										<CardHeader>
											<CardLabel icon='Contacts' iconColor='warning'>
												<CardTitle>Thông tin nhiệm vụ cho từng vị trí</CardTitle>
											</CardLabel>
										</CardHeader>
										<div className='p-4'>
											{/* <TableCommon
												className='table table-modern mb-0'
												columns={positions?.name}
												data={(item) => <span>{item?.position?.name || 'No data'}</span>}
											/>
											<ul>
												<h2>Tên Vị Trí</h2>
												<li data={(item) => <span>{item?.position?.name || 'No data'}</span>}/>
											</ul>
											<ul>
												<h2>Nhiệm vụ cụ thể</h2>
												<li data={positions?.address}/>

											</ul> */}
										</div>
									</Card>
								</Card>
							)}
							{TABS.MISSiONS === activeTab && (
								<Formik initialValues={positions} enableReinitialize>
									<Card className='h-100'>
										<Card className='h-100 mb-0'>
											<CardHeader>
												<CardLabel icon='Edit' iconColor='warning'>
													<CardTitle>Thêm nhiệm vụ</CardTitle>
												</CardLabel>
											</CardHeader>
											{/* <CardBody className='pt-0'>
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
											</CardBody> */}
										</Card>
									</Card>
								</Formik>
							)}
						</div>
					</div>,
					['admin'],
				)}

				<CommonForm
					show={toggleForm}
					onClose={handleCloseForm}
					// handleSubmit={handleSubmitEmployeeForm}
					item={itemEdit}
					label={itemEdit?.id ? 'Cập nhật nhân viên' : 'Thêm mới nhân viênn'}
					// fields={columns}
				/>
			</Page>
		</PageWrapper>
	);
};

export default PositionDetailPage;
