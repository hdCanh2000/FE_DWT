import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, createSearchParams, useSearchParams } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications';
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
import TaskAlertConfirm from '../work-management/mission/TaskAlertConfirm';
import Toasts from '../../components/bootstrap/Toasts';
import { toggleFormSlice } from '../../redux/common/toggleFormSlice';
import { fetchPositionList } from '../../redux/slice/positionSlice';
import { fetchPositionLevelList } from '../../redux/slice/positionLevelSlice';
import { fetchDepartmentList } from '../../redux/slice/departmentSlice';
import { fetchRequirementList } from '../../redux/slice/requirementSlice';
import { addPosition, updatePosition, deletePositions } from './services';
import PositionForm from '../common/ComponentCommon/PositionForm';
import PositionDetail from './PositionDetail';
import NotPermission from '../presentation/auth/NotPermission';

const PositionPage = () => {
	const { darkModeStatus } = useDarkMode();
	const [searchParams] = useSearchParams();

	const navigate = useNavigate();
	const dispatch = useDispatch();

	const text = searchParams.get('text') || '';
	const page = searchParams.get('page') || '';

	const localtion = useLocation();
	const { addToast } = useToasts();
	const toggleForm = useSelector((state) => state.toggleForm.open);
	const itemEdit = useSelector((state) => state.toggleForm.data);
	const [itemDelete, setItemDelete] = React.useState({});
	const [isDelete, setIsDelete] = React.useState(false);

	const handleOpenForm = (data) => dispatch(toggleFormSlice.actions.openForm(data));
	const handleCloseForm = () => dispatch(toggleFormSlice.actions.closeForm());
	const positions = useSelector((state) => state.position.positions);
	const pagination = useSelector((state) => state.position.pagination);
	const positionLevels = useSelector((state) => state.positionLevel.positionLevels);
	const departments = useSelector((state) => state.department.departments);
	const requirements = useSelector((state) => state.requirement.requirements);
	const [openDetail, setOpenDetail] = React.useState(false);
	const [dataDetail, setDataDetail] = React.useState({});
	const [currentPage, setCurrentPage] = React.useState(page || 1);

	// const [nvs] = React.useState(true);
	const fetchRequirement = () => {
		const newItem = itemEdit?.requirements?.map((items) => ({
			...items,
			label: items.name,
			value: items.id,
		}));
		return { ...itemEdit, requirements: newItem };
	};

	const fetchRequirementDetail = (data) => {
		const newItem = data?.requirements?.map((items) => ({
			...items,
			label: items.name,
			value: items.id,
		}));
		return { ...dataDetail, requirements: newItem };
	};

	useEffect(() => {
		const query = {};
		query.text = text;
		query.page = text ? 1 : page;
		dispatch(fetchPositionList(query));
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
			type: 'singleSelect',
			align: 'left',
			isShow: false,
			render: (item) => <span>{item?.positions?.name || ''}</span>,
			options: positions,
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
						color='primary'
						isLight={darkModeStatus}
						className='text-nowrap mx-2'
						icon='RemoveRedEye'
						onClick={() => handleOpenDetail(item)}
					/>
					<Button
						isOutline={!darkModeStatus}
						color='danger'
						isLight={darkModeStatus}
						className='text-nowrap mx-2'
						icon='Trash'
						onClick={() => handleOpenDelete(item)}
					/>
				</div>
			),
			isShow: false,
		},
	];

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
			id: parseInt(data.id, 10),
			name: data.name,
			code: data?.code,
			address: data?.address,
			description: data?.description,
			department_id: parseInt(data?.department_id, 10),
			position_levels_id: parseInt(data?.position_levels_id, 10),
			manager: parseInt(data?.manager, 10),
			// kpiNormId: data?.kpiName,
			requirement_id: data?.requirements?.map((item) => item.id),
		};
		if (data?.id) {
			try {
				const response = await updatePosition(dataSubmit);
				await response.data;
				dispatch(fetchPositionList());
				handleCloseForm();
				handleShowToast(
					`Cập nhật vị trí công việc!`,
					`Cập nhật vị trí công việc thành công!`,
				);
			} catch (error) {
				handleShowToast(
					`Cập nhật vị trí công việc`,
					`Cập nhật vị trí công việc không thành công!`,
				);
			}
		} else {
			try {
				const response = await addPosition(dataSubmit);
				await response.data;
				dispatch(fetchPositionList());
				handleCloseForm();
				handleShowToast(`Thêm vị trí công việc`, `Thêm vị trí công việc thành công!`);
			} catch (error) {
				handleShowToast(`Thêm vị trí công việc`, `Thêm vị trí công việc không thành công!`);
			}
		}
	};

	const handleOpenDetail = (item) => {
		setOpenDetail(true);
		setDataDetail({ ...item });
	};
	const handleCloseDetail = () => {
		setOpenDetail(false);
		setDataDetail({});
	};
	const handleOpenDelete = (item) => {
		setIsDelete(true);
		setItemDelete({ ...item });
	};
	const handleCloseDelete = () => {
		setIsDelete(false);
	};
	const handleDeletePosition = async (item) => {
		try {
			await deletePositions(item);
			const query = {};
			query.text = text;
			query.page = 1;
			dispatch(fetchPositionList(query));
			handleShowToast(`Xoá vị trí công việc`, `Xoá vị trí công việc thành công!`);
		} catch (error) {
			handleShowToast(`Xoá vị trí công việc`, `Xoá vị trí công việc không thành công!`);
		}
		handleCloseDelete();
	};
	return (
		<PageWrapper title={demoPages.hrRecords.subMenu.position.text}>
			<Page container='fluid'>
				{verifyPermissionHOC(
					<>
						<div
							className='row mb-0'
							style={{ maxWidth: '100%', minWidth: '60%', margin: '0 auto' }}>
							<div className='col-12'>
								<Card className='w-100'>
									<div style={{ margin: '24px 24px 0' }}>
										<CardHeader>
											<CardLabel icon='Assignment' iconColor='primary'>
												<CardTitle>
													<CardLabel>Danh sách vị trí</CardLabel>
												</CardTitle>
											</CardLabel>
											<CardActions>
												<Button
													color='info'
													icon='PostAdd'
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
												onChangeCurrentPage={handleChangeCurrentPage}
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
						<PositionForm
							show={toggleForm}
							onClose={handleCloseForm}
							handleSubmit={handleSubmitForm}
							item={fetchRequirement(itemEdit)}
							label={itemEdit?.id ? 'Cập nhật vị trí' : 'Thêm mới vị trí'}
							fields={columns}
							// nv={nvs}
							validate={validate}
						/>
						<PositionDetail
							show={openDetail}
							onClose={handleCloseDetail}
							item={fetchRequirementDetail(dataDetail)}
							label={`Chi tiết vị trí: ${dataDetail?.name}`}
							fields={columns}
							// nv
						/>
						<TaskAlertConfirm
							openModal={isDelete}
							onCloseModal={handleCloseDelete}
							onConfirm={() => handleDeletePosition(itemDelete?.id)}
							title='Xoá vị trí công việc'
							content={`Xác nhận xoá vị trí công việc: <strong>${itemDelete?.name}</strong> ?`}
						/>
					</>,
					['admin'],
					<NotPermission />,
				)}
			</Page>
		</PageWrapper>
	);
};

export default PositionPage;
