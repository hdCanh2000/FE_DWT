import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useLocation, useNavigate, createSearchParams, useSearchParams } from 'react-router-dom';
import Page from '../../layout/Page/Page';
import PageWrapper from '../../layout/PageWrapper/PageWrapper';
import TableCommon from '../common/ComponentCommon/TableCommon';
import { demoPages } from '../../menu';
import Card, {
	CardActions,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../../components/bootstrap/Card';
import Button from '../../components/bootstrap/Button';
import useDarkMode from '../../hooks/useDarkMode';
import validate from './validate';
import verifyPermissionHOC from '../../HOC/verifyPermissionHOC';
import { toggleFormSlice } from '../../redux/common/toggleFormSlice';
import { fetchRequirementList, changeCurrentPage } from '../../redux/slice/requirementSlice';
import CommonForm from '../common/ComponentCommon/CommonForm';
import AlertConfirm from '../work-management/mission/AlertConfirm';
import NotPermission from '../presentation/auth/NotPermission';
import Loading from '../../components/Loading/Loading';
import { addResource, deleteResouce, updateResouce } from '../../api/fetchApi';

const RecruitmentRequirementPage = () => {
	const { darkModeStatus } = useDarkMode();
	const [searchParams] = useSearchParams();

	const navigate = useNavigate();
	const dispatch = useDispatch();

	const text = searchParams.get('text') || '';

	const localtion = useLocation();

	const toggleForm = useSelector((state) => state.toggleForm.open);
	const itemEdit = useSelector((state) => state.toggleForm.data);
	const toggleFormDelete = useSelector((state) => state.toggleForm.confirm);

	const handleOpenFormDelete = (data) => dispatch(toggleFormSlice.actions.confirmForm(data));
	const handleOpenForm = (data) => dispatch(toggleFormSlice.actions.openForm(data));
	const handleCloseForm = () => dispatch(toggleFormSlice.actions.closeForm());

	const requirements = useSelector((state) => state.requirement.requirements);
	const currentPage = useSelector((state) => state.requirement.currentPage);
	const pagination = useSelector((state) => state.requirement.pagination);
	const loading = useSelector((state) => state.requirement.loading);

	useEffect(() => {
		const query = {};
		query.text = text;
		query.limit = 10;
		query.page = currentPage;
		dispatch(fetchRequirementList(query));
	}, [dispatch, currentPage, text]);

	const setCurrentPage = (page) => {
		dispatch(changeCurrentPage(page));
	};

	const handleSubmitSearch = (searchValue) => {
		if (searchValue.text === '') {
			searchParams.delete('text');
			navigate({
				pathname: localtion.pathname,
			});
		} else {
			navigate({
				pathname: localtion.pathname,
				search: createSearchParams({
					text: searchValue.text,
				}).toString(),
			});
		}
		setCurrentPage(1);
	};

	const handleChangeCurrentPage = (searchValue) => {
		setCurrentPage(searchValue.page);
	};

	const columns = [
		{
			title: 'Tên yêu cầu',
			placeholder: 'tên yêu cầu',
			id: 'name',
			key: 'name',
			type: 'text',
			align: 'left',
			isShow: true,
		},
		{
			title: 'Mô tả',
			placeholder: 'mô tả',
			id: 'description',
			key: 'description',
			type: 'textarea',
			align: 'left',
			isShow: true,
		},
		{
			title: 'Hành Động',
			id: 'action',
			key: 'action',
			align: 'center',
			render: (item) => (
				<>
					<Button
						isOutline={!darkModeStatus}
						color='success'
						isLight={darkModeStatus}
						className='text-nowrap mx-2'
						icon='Edit'
						onClick={() => handleOpenForm(item)}
					/>
					<Button
						isOutline={!darkModeStatus}
						color='danger'
						isLight={darkModeStatus}
						className='text-nowrap mx-2'
						icon='Trash'
						onClick={() => handleOpenFormDelete(item)}
					/>
				</>
			),
			isShow: false,
		},
	];

	const handleSubmitForm = async (data) => {
		const dataSubmit = {
			id: parseInt(data.id, 10),
			name: data.name,
			description: data?.description,
		};
		if (data.id) {
			try {
				const response = await updateResouce('/api/requirements', dataSubmit);
				await response.data;
				toast.success('Cập nhật yêu cầu thành công!', {
					position: toast.POSITION.TOP_RIGHT,
					autoClose: 1000,
				});
				dispatch(fetchRequirementList());
				handleCloseForm();
				const query = {};
				query.text = text;
				query.page = currentPage;
				query.limit = 10;
				dispatch(fetchRequirementList(query));
			} catch (error) {
				toast.error('Cập nhật yêu cầu không thành công!', {
					position: toast.POSITION.TOP_RIGHT,
					autoClose: 1000,
				});
				throw error;
			}
		} else {
			try {
				const response = await addResource('/api/requirements', dataSubmit);
				await response.data;
				toast.success('Cập nhật yêu cầu thành công!', {
					position: toast.POSITION.TOP_RIGHT,
					autoClose: 1000,
				});
				const query = {};
				query.text = text;
				query.page = 1;
				query.limit = 10;
				dispatch(fetchRequirementList(query));
				handleCloseForm();
			} catch (error) {
				toast.error('Cập nhật yêu cầu không thành công!', {
					position: toast.POSITION.TOP_RIGHT,
					autoClose: 1000,
				});
				throw error;
			}
		}
	};

	const handleDeleteRequirement = async (data) => {
		try {
			await deleteResouce('/api/requirements', data);
			toast.success('Xoá yêu cầu thành công!', {
				position: toast.POSITION.TOP_RIGHT,
				autoClose: 1000,
			});
			const query = {};
			query.text = text;
			query.page = currentPage;
			dispatch(fetchRequirementList(query));
			handleCloseForm();
		} catch (error) {
			toast.error('Xoá yêu cầu không thành công!', {
				position: toast.POSITION.TOP_RIGHT,
				autoClose: 1000,
			});
			throw error;
		}
	};

	return (
		<PageWrapper title={demoPages.cauHinh.subMenu.recruitmentRequirements.text}>
			<Page container='fluid'>
				{loading ? (
					<Loading />
				) : (
					<div>
						{verifyPermissionHOC(
							<>
								<div
									className='row mb-0'
									style={{ maxWidth: '70%', minWidth: '70%', margin: '0 auto' }}>
									<div className='col-12'>
										<Card className='w-100'>
											<div style={{ margin: '24px 24px 0' }}>
												<CardHeader>
													<CardLabel
														icon='AccountCircle'
														iconColor='primary'>
														<CardTitle>
															<CardLabel>
																Danh sách yêu cầu tuyển dụng
															</CardLabel>
														</CardTitle>
													</CardLabel>
													<CardActions>
														<Button
															color='info'
															icon='AddCircleOutline'
															tag='button'
															onClick={() => handleOpenForm(null)}>
															Thêm mới
														</Button>
													</CardActions>
												</CardHeader>
												<div className='p-4'>
													<TableCommon
														className='table table-modern mb-0'
														columns={columns}
														data={requirements}
														onSubmitSearch={handleSubmitSearch}
														onChangeCurrentPage={
															handleChangeCurrentPage
														}
														currentPage={parseInt(currentPage, 10)}
														totalItem={pagination?.totalRows}
														total={pagination?.total}
														setCurrentPage={setCurrentPage}
														searchvalue={text}
														isSearch
													/>
												</div>
											</div>
										</Card>
									</div>
								</div>
								<CommonForm
									show={toggleForm}
									onClose={handleCloseForm}
									handleSubmit={handleSubmitForm}
									item={itemEdit}
									label={
										itemEdit?.id
											? 'Cập nhật yêu cầu năng lực'
											: 'Thêm mới yêu cầu năng lực'
									}
									fields={columns}
									validate={validate}
								/>
								<AlertConfirm
									openModal={toggleFormDelete}
									onCloseModal={handleCloseForm}
									onConfirm={() => handleDeleteRequirement(itemEdit?.id)}
									title='Xoá yêu cầu năng lực'
									content='Xác nhận xoá yêu cầu năng lực?'
								/>
							</>,
							['admin'],
							<NotPermission />,
						)}
					</div>
				)}
			</Page>
		</PageWrapper>
	);
};

export default RecruitmentRequirementPage;
