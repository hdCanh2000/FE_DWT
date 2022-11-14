/* eslint-disable react/prop-types */
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { createSearchParams, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Page from '../../../layout/Page/Page';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import { demoPages } from '../../../menu';
import Card, {
	CardActions,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../../../components/bootstrap/Card';
import Button from '../../../components/bootstrap/Button';
import MissionFormModal from './MissionFormModal';
import Alert from '../../../components/bootstrap/Alert';
import useDarkMode from '../../../hooks/useDarkMode';
import TableCommon from '../../common/ComponentCommon/TableCommon';
import verifyPermissionHOC from '../../../HOC/verifyPermissionHOC';
import { fetchMissionList, changeCurrentPage } from '../../../redux/slice/missionSlice';
import { toggleFormSlice } from '../../../redux/common/toggleFormSlice';
import NotPermission from '../../presentation/auth/NotPermission';
import AlertConfirm from '../../common/ComponentCommon/AlertConfirm';
import Loading from '../../../components/Loading/Loading';
import { deleteResouce } from '../../../api/fetchApi';

const MissionPage = () => {
	const { darkModeStatus } = useDarkMode();
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const localtion = useLocation();

	const text = searchParams.get('text') || '';

	const dispatch = useDispatch();
	const missions = useSelector((state) => state.mission.missions);
	const pagination = useSelector((state) => state.mission.pagination);
	const loading = useSelector((state) => state.mission.loading);
	const toggleFormEdit = useSelector((state) => state.toggleForm.open);
	const confirmForm = useSelector((state) => state.toggleForm.confirm);
	const itemEdit = useSelector((state) => state.toggleForm.data);

	const currentPage = useSelector((state) => state.mission.currentPage);

	useEffect(() => {
		const query = {};
		query.text = text;
		query.page = currentPage;
		query.limit = 10;
		dispatch(fetchMissionList(query));
	}, [dispatch, currentPage, text]);

	const setCurrentPage = (page) => {
		dispatch(changeCurrentPage(page));
	};

	const handleOpenFormEdit = (data) => dispatch(toggleFormSlice.actions.openForm(data));
	const handleOpenFormDelete = (data) => dispatch(toggleFormSlice.actions.confirmForm(data));
	const handleCloseForm = () => dispatch(toggleFormSlice.actions.closeForm());

	const handleDelete = async (data) => {
		try {
			await deleteResouce('/api/missions', data?.id);
			toast.success('Xoá mục tiêu thành công!', {
				position: toast.POSITION.TOP_RIGHT,
				autoClose: 1000,
			});
			handleCloseForm();
			const query = {};
			query.text = text;
			query.page = currentPage;
			query.limit = 10;
			dispatch(fetchMissionList(query));
		} catch (error) {
			toast.error('Xoá mục tiêu không thành công!', {
				position: toast.POSITION.TOP_RIGHT,
				autoClose: 1000,
			});
			throw error;
		}
	};

	const columns = [
		{
			title: 'Tên mục tiêu',
			id: 'name',
			key: 'name',
			type: 'text',
		},
		{
			title: 'Phòng ban phụ trách',
			id: 'department',
			key: 'department',
			type: 'number',
			render: (item) =>
				item.departments.filter((i) => i.missionDepartments?.isResponsible)[0]?.name ||
				'--',
		},
		{
			title: 'Ngày bắt đầu',
			id: 'startTime',
			key: 'startTime',
			type: 'text',
			format: (value) => (value ? `${moment(`${value}`).format('DD-MM-YYYY')}` : '--'),
			align: 'center',
		},
		{
			title: 'Ngày kết thúc',
			id: 'endTime',
			key: 'endTime',
			format: (value) => (value ? `${moment(`${value}`).format('DD-MM-YYYY')}` : '--'),
			align: 'center',
		},
		{
			title: 'Số lượng',
			id: 'quantity',
			key: 'quantity',
			type: 'number',
			align: 'center',
			format: (value) => value || '--',
		},
		{
			title: 'Số ngày công',
			id: 'manday',
			key: 'manday',
			type: 'number',
			align: 'center',
		},
		{
			title: 'Hành động',
			id: 'action',
			key: 'action',
			render: (item) =>
				verifyPermissionHOC(
					<div className='d-flex align-items-center'>
						<Button
							isOutline={!darkModeStatus}
							color='success'
							isLight={darkModeStatus}
							className='text-nowrap mx-2'
							icon='Edit'
							onClick={() => handleOpenFormEdit(item)}
						/>
						<Button
							isOutline={!darkModeStatus}
							color='danger'
							isLight={darkModeStatus}
							className='text-nowrap mx-2 '
							icon='Delete'
							onClick={() => handleOpenFormDelete(item)}
						/>
					</div>,
					['admin'],
				),
		},
	];

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

	return (
		<PageWrapper title={demoPages.mucTieu?.text}>
			<Page container='fluid'>
				{loading ? (
					<Loading />
				) : (
					<div>
						{verifyPermissionHOC(
							<>
								<div
									className='row'
									style={{ maxWidth: '95%', minWidth: '60%', margin: '0 auto' }}>
									<div className='col-12'>
										<Card>
											<div style={{ margin: '24px 24px 0' }}>
												<CardHeader>
													<CardLabel icon='Task' iconColor='danger'>
														<CardTitle>
															<CardLabel>
																Danh sách mục tiêu
															</CardLabel>
														</CardTitle>
													</CardLabel>
													{verifyPermissionHOC(
														<CardActions>
															<Button
																color='info'
																icon='AddCircleOutline'
																tag='button'
																onClick={() =>
																	handleOpenFormEdit(null)
																}>
																Thêm mới
															</Button>
														</CardActions>,
														['admin'],
													)}
												</CardHeader>
												<div className='p-4'>
													<TableCommon
														className='table table-modern mb-0'
														columns={columns}
														data={missions}
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

											{!missions?.length && (
												<Alert
													color='warning'
													isLight
													icon='Report'
													className='mt-3'>
													Không có mục tiêu!
												</Alert>
											)}
										</Card>
									</div>
								</div>
								<MissionFormModal
									show={toggleFormEdit}
									onClose={handleCloseForm}
									item={itemEdit}
								/>
								<AlertConfirm
									openModal={confirmForm}
									onCloseModal={handleCloseForm}
									onConfirm={() => handleDelete(itemEdit)}
									title='Xoá mục tiêu'
									content={`Xác nhận xoá mục tiêu <strong>${itemEdit?.name}</strong> ?`}
								/>
							</>,
							['admin', 'manager'],
							<NotPermission />,
						)}
					</div>
				)}
			</Page>
		</PageWrapper>
	);
};

export default MissionPage;
