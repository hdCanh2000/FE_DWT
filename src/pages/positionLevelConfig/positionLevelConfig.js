import React, { useEffect } from 'react';
import { useLocation, useNavigate, createSearchParams, useSearchParams } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications';
import { useDispatch, useSelector } from 'react-redux';
import Card, {
	CardActions,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../../components/bootstrap/Card';
import Button from '../../components/bootstrap/Button';
import verifyPermissionHOC from '../../HOC/verifyPermissionHOC';
import { addPositionLevel, deletePositionLevel, updatePositionLevel } from './services';
import useDarkMode from '../../hooks/useDarkMode';
import CommonForm from '../common/ComponentCommon/CommonForm';
import Toasts from '../../components/bootstrap/Toasts';
import validate from './validate';
import PageWrapper from '../../layout/PageWrapper/PageWrapper';
import { demoPages } from '../../menu';
import Page from '../../layout/Page/Page';
import TableCommon from '../common/ComponentCommon/TableCommon';
import { toggleFormSlice } from '../../redux/common/toggleFormSlice';
import { fetchPositionLevelList } from '../../redux/slice/positionLevelSlice';
import NotPermission from '../presentation/auth/NotPermission';
import Loading from '../../components/Loading/Loading';
import TaskAlertConfirm from '../work-management/mission/TaskAlertConfirm';

const PositionLevelPage = () => {
	const { darkModeStatus } = useDarkMode();
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { addToast } = useToasts();

	const text = searchParams.get('text') || '';
	const page = searchParams.get('page') || '';

	const localtion = useLocation();

	const handleOpenFormDelete = (data) => dispatch(toggleFormSlice.actions.confirmForm(data));
	const handleOpenForm = (data) => dispatch(toggleFormSlice.actions.openForm(data));
	const handleCloseForm = () => dispatch(toggleFormSlice.actions.closeForm());
	const toggleForm = useSelector((state) => state.toggleForm.open);
	const toggleFormDelete = useSelector((state) => state.toggleForm.confirm);
	const itemEdit = useSelector((state) => state.toggleForm.data);
	const pagination = useSelector((state) => state.positionLevel.pagination);
	const loading = useSelector((state) => state.positionLevel.loading);
	const positionLevels = useSelector((state) => state.positionLevel.positionLevels);
	const [currentPage, setCurrentPage] = React.useState(page || 1);

	const columns = [
		{
			title: 'Tên cấp nhân sự',
			id: 'name',
			key: 'name',
			type: 'text',
			align: 'left',
			isShow: true,
		},
		{
			title: 'Mã cấp nhân sự',
			id: 'code',
			key: 'code',
			type: 'text',
			align: 'left',
			isShow: true,
		},
		{
			title: 'Mô tả',
			id: 'description',
			key: 'description',
			type: 'text',
			align: 'left',
			isShow: true,
		},
		{
			title: 'Hành động',
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

	useEffect(() => {
		const query = {};
		query.text = text;
		query.page = text ? 1 : page;
		dispatch(fetchPositionLevelList(query));
	}, [dispatch, page, text]);

	const handleSubmitSearch = (searchValue) => {
		navigate({
			pathname: localtion.pathname,
			search: createSearchParams({
				text: searchValue.text,
				page: 1,
			}).toString(),
		});
	};

	const handleChangeCurrentPage = (searchValue) => {
		navigate({
			pathname: localtion.pathname,
			search: createSearchParams({
				text: searchValue.text,
				page: searchValue.page,
			}).toString(),
		});
	};

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

	const handleSubmitForm = async (itemSubmit) => {
		if (!itemSubmit.id) {
			const reponse = await addPositionLevel(itemSubmit);
			const result = reponse.data;
			dispatch(fetchPositionLevelList());
			handleCloseForm();
			handleShowToast(
				'Thêm cấp nhân sự',
				`Thêm cấp nhân sự ${result.data.name} thành công !`,
			);
		} else {
			const reponse = await updatePositionLevel(itemSubmit);
			const result = reponse.data;
			dispatch(fetchPositionLevelList());
			handleCloseForm();
			handleShowToast(
				'Chỉnh sửa cấp nhân sự',
				`Chỉnh sửa cấp nhân sự ${result.data.name} thành công !`,
			);
		}
	};
	const handleDeletePositionLevel = async (item) => {
		try {
			await deletePositionLevel(item);
			const query = {};
			query.text = text;
			query.page = 1;
			dispatch(fetchPositionLevelList(query));
			handleShowToast(`Xoá cấp nhân sự`, `Xoá cấp nhân sự thành công!`);
			handleCloseForm();
		} catch (error) {
			handleShowToast(`Xoá cấp nhân sự`, `Xoá cấp nhân sự không thành công!`);
		}
		handleCloseForm();
	};

	return (
		<PageWrapper title={demoPages.hrRecords.subMenu.positionLevelConfig.text}>
			<Page container='fluid'>
				{loading ? (
					<Loading />
				) : (
					<div>
						{verifyPermissionHOC(
							<>
								<div
									className='row mb-0'
									style={{ maxWidth: '90%', minWidth: '90%', margin: '0 auto' }}>
									<div className='col-12'>
										<Card className='w-100'>
											<div style={{ margin: '24px 24px 0' }}>
												<CardHeader>
													<CardLabel
														icon='SupervisorAccount'
														iconColor='primary'>
														<CardTitle>
															<CardLabel>
																Danh sách cấp nhân sự
															</CardLabel>
														</CardTitle>
													</CardLabel>
													<CardActions>
														<Button
															color='info'
															icon='GroupAdd'
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
														data={positionLevels}
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
											? 'Cập nhật cấp nhân sự'
											: 'Thêm mới cấp nhân sự'
									}
									fields={columns}
									validate={validate}
								/>
								<TaskAlertConfirm
									openModal={toggleFormDelete}
									onCloseModal={handleCloseForm}
									onConfirm={() => handleDeletePositionLevel(itemEdit?.id)}
									title='Xoá cấp nhân sự'
									content={`Xác nhận xoá cấp nhân sự <strong>${itemEdit?.name}</strong> ?`}
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

export default PositionLevelPage;
