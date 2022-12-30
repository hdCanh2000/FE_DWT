import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, createSearchParams, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
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
import AlertConfirm from '../work-management/mission/AlertConfirm';
import { toggleFormSlice } from '../../redux/common/toggleFormSlice';
import { changeCurrentPage, fetchPositionList } from '../../redux/slice/positionSlice';
import { fetchPositionLevelList } from '../../redux/slice/positionLevelSlice';
import { fetchDepartmentList } from '../../redux/slice/departmentSlice';
import { fetchRequirementList } from '../../redux/slice/requirementSlice';
import NotPermission from '../presentation/auth/NotPermission';
import Loading from '../../components/Loading/Loading';
import CommonForm from '../common/ComponentCommon/CommonForm';
import { addResource, deleteResouce, getAllResource, updateResouce } from '../../api/fetchApi';

const PositionPage = () => {
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
	const positions = useSelector((state) => state.position.positions);
	const pagination = useSelector((state) => state.position.pagination);
	const loading = useSelector((state) => state.position.loading);
	const positionLevels = useSelector((state) => state.positionLevel.positionLevels);
	const departments = useSelector((state) => state.department.departments);
	const requirements = useSelector((state) => state.requirement.requirements);

	const currentPage = useSelector((state) => state.position.currentPage);

	const fetchRequirement = () => {
		const newItem = itemEdit?.requirements?.map((items) => ({
			...items,
			label: items.name,
			value: items.id,
		}));
		return { ...itemEdit, requirements: newItem };
	};

	const setCurrentPage = (page) => {
		dispatch(changeCurrentPage(page));
	};

	const [allPositions, setAllPositions] = React.useState([]);
	const fetch = async () => {
		const response = await getAllResource('/api/positions');
		setAllPositions(
			response.data.data.map((ele) => ({ ...ele, label: ele?.name, value: ele?.id })),
		);
	};

	useEffect(() => {
		fetch();
	}, []);

	useEffect(() => {
		const query = {};
		query.text = text;
		query.page = currentPage;
		query.limit = 10;
		dispatch(fetchPositionList(query));
	}, [currentPage, dispatch, text]);

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

	useEffect(() => {
		dispatch(fetchPositionLevelList());
		dispatch(fetchDepartmentList());
		dispatch(fetchRequirementList());
	}, [dispatch]);

	const columns = [
		{
			title: 'Tên vị trí',
			placeholder: 'tên vị trí',
			id: 'name',
			key: 'name',
			type: 'text',
			align: 'left',
			isShow: true,
			col: 5,
		},
		{
			title: 'Mã vị trí',
			placeholder: 'mã vị trí',
			id: 'code',
			key: 'code',
			type: 'text',
			align: 'left',
			isShow: true,
			col: 2,
		},
		{
			title: 'Phòng ban',
			id: 'department_id',
			key: 'department_id',
			type: 'singleSelect',
			align: 'left',
			isShow: true,
			render: (item) => <span>{item?.department?.name || ''}</span>,
			options: departments,
			col: 5,
		},
		{
			title: 'Cấp nhân sự',
			id: 'position_levels_id',
			key: 'position_levels_id',
			type: 'singleSelect',
			align: 'left',
			isShow: true,
			render: (item) => <span>{item?.positionLevel?.name || ''}</span>,
			options: positionLevels && positionLevels.filter((item) => item?.name !== 'Không'),
			col: 6,
		},
		{
			title: 'Quản lý cấp trên',
			id: 'manager',
			key: 'manager',
			type: 'select',
			align: 'left',
			isShow: false,
			render: (item) => <span>{item?.positions?.name || ''}</span>,
			options: allPositions,
			col: 6,
		},
		{
			title: 'Địa điểm làm việc',
			placeholder: 'địa điểm làm việc',
			id: 'address',
			key: 'address',
			type: 'text',
			align: 'left',
			isShow: false,
		},
		{
			title: 'Mô tả vị trí',
			placeholder: 'mô tả vị trí',
			id: 'description',
			key: 'description',
			type: 'textarea',
			align: 'left',
			isShow: false,
		},
		{
			title: 'Yêu cầu năng lực',
			id: 'requirements',
			key: 'requirements',
			type: 'select',
			align: 'left',
			isShow: false,
			render: (item) => <span>{item?.requirement?.name || ''}</span>,
			options: requirements,
			isMulti: true,
		},
		{
			title: 'Hành động',
			id: 'action',
			key: 'action',
			align: 'center',
			render: (item) => (
				<div className='d-flex align-items-center'>
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
				</div>
			),
			isShow: false,
		},
	];

	const handleSubmitForm = async (data) => {
		const dataSubmit = {
			id: parseInt(data.id, 10),
			name: data.name,
			code: data?.code,
			address: data?.address,
			description: data?.description,
			department_id: parseInt(data?.department_id, 10),
			position_levels_id: parseInt(data?.position_levels_id, 10),
			manager: parseInt(data?.manager, 10),
			requirement_id: data?.requirements?.map((item) => item.id),
		};
		if (data.id) {
			try {
				const response = await updateResouce('/api/positions', dataSubmit);
				await response.data;
				toast.success('Cập nhật vị trí thành công!', {
					position: toast.POSITION.TOP_RIGHT,
					autoClose: 1000,
				});
				const query = {};
				query.text = text;
				query.page = currentPage;
				query.limit = 10;
				dispatch(fetchPositionList(query));
				handleCloseForm();
			} catch (error) {
				toast.error('Cập nhật vị trí không thành công!', {
					position: toast.POSITION.TOP_RIGHT,
					autoClose: 1000,
				});
				throw error;
			}
		} else {
			try {
				const response = await addResource('/api/positions', dataSubmit);
				await response.data;
				toast.success('Thêm vị trí thành công!', {
					position: toast.POSITION.TOP_RIGHT,
					autoClose: 1000,
				});
				const query = {};
				query.text = text;
				query.page = 1;
				query.limit = 10;
				dispatch(fetchPositionList(query));
				handleCloseForm();
			} catch (error) {
				toast.error('Thêm vị trí không thành công!', {
					position: toast.POSITION.TOP_RIGHT,
					autoClose: 1000,
				});
				throw error;
			}
		}
	};

	const handleDeletePosition = async (item) => {
		try {
			await deleteResouce('/api/positions', item);
			toast.success('Xoá vị trí thành công!', {
				position: toast.POSITION.TOP_RIGHT,
				autoClose: 1000,
			});
			const query = {};
			query.text = text;
			query.page = 1;
			dispatch(fetchPositionList(query));
			handleCloseForm();
		} catch (error) {
			toast.error('Xoá vị trí không thành công!', {
				position: toast.POSITION.TOP_RIGHT,
				autoClose: 1000,
			});
			throw error;
		}
	};

	return (
		<PageWrapper title={demoPages.hrRecords.subMenu.position.text}>
			<Page container='fluid'>
				{loading ? (
					<Loading />
				) : (
					<div>
						{verifyPermissionHOC(
							<>
								<div
									className='row mb-0'
									style={{ maxWidth: '100%', minWidth: '60%', margin: '0 auto' }}>
									<div className='col-12'>
										<Card className='w-100'>
											<div style={{ margin: '24px 24px 0' }}>
												<CardHeader>
													<CardLabel
														icon='Assignment'
														iconColor='primary'>
														<CardTitle>
															<CardLabel>Danh sách vị trí</CardLabel>
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
														data={positions}
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
									item={fetchRequirement(itemEdit)}
									label={itemEdit?.id ? 'Cập nhật vị trí' : 'Thêm mới vị trí'}
									fields={columns}
									validate={validate}
								/>
								<AlertConfirm
									openModal={toggleFormDelete}
									onCloseModal={handleCloseForm}
									onConfirm={() => handleDeletePosition(itemEdit?.id)}
									title='Xoá vị trí công việc'
									content='Xác nhận xoá vị trí công việc?'
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

export default PositionPage;
