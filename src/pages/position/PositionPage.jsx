import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
import { fetchPositionList } from '../../redux/slice/positionSlice';
import { fetchPositionLevelList } from '../../redux/slice/positionLevelSlice';
import { fetchDepartmentList } from '../../redux/slice/departmentSlice';
import { fetchRequirementList } from '../../redux/slice/requirementSlice';
import { addPosition, updatePosition } from './services';
import PositionForm from '../common/ComponentCommon/PositionForm';
import PositionDetail from './PositionDetail';
import NotPermission from '../presentation/auth/NotPermission';

const PositionPage = () => {
	const { darkModeStatus } = useDarkMode();

	const dispatch = useDispatch();
	const toggleForm = useSelector((state) => state.toggleForm.open);
	const itemEdit = useSelector((state) => state.toggleForm.data);
	const handleOpenForm = (data) => dispatch(toggleFormSlice.actions.openForm(data));
	const handleCloseForm = () => dispatch(toggleFormSlice.actions.closeForm());
	const positions = useSelector((state) => state.position.positions);
	const positionLevels = useSelector((state) => state.positionLevel.positionLevels);
	const departments = useSelector((state) => state.department.departments);
	const requirements = useSelector((state) => state.requirement.requirements);
	const [openDetail, setOpenDetail] = React.useState(false);
	const [dataDetail, setDataDetail] = React.useState({});
	// const [nvs] = React.useState(true);
	const fetchRequirement = () => {
		const newItem = itemEdit?.requirements?.map((items) => ({
			...items,
			label: items.name,
			value: items.id,
		}));
		return { ...itemEdit, requirements: newItem };
	};
	const fetchRequirementDetail = () => {
		const newItem = dataDetail?.requirements?.map((items) => ({
			...items,
			label: items.name,
			value: items.id,
		}));
		return { ...dataDetail, requirements: newItem };
	};
	useEffect(() => {
		dispatch(fetchPositionList());
		dispatch(fetchPositionLevelList());
		dispatch(fetchDepartmentList());
		dispatch(fetchRequirementList());
	}, [dispatch]);

	const columns = [
		{
			title: 'Tên Vị Trí',
			placeholder: 'tên vị trí',
			id: 'name',
			key: 'name',
			type: 'text',
			align: 'left',
			isShow: true,
			col: 6,
		},
		{
			title: 'Phòng Ban',
			id: 'department_id',
			key: 'department_id',
			type: 'singleSelect',
			align: 'left',
			isShow: true,
			render: (item) => <span>{item?.department?.name || 'No data'}</span>,
			options: departments,
			col: 6,
		},
		{
			title: 'Cấp Nhân Sự',
			id: 'position_levels_id',
			key: 'position_levels_id',
			type: 'singleSelect',
			align: 'left',
			isShow: true,
			render: (item) => <span>{item?.positionLevel?.name || 'No data'}</span>,
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
			render: (item) => <span>{item?.positionLevel?.name || 'No data'}</span>,
			options: positionLevels,
			col: 6,
		},
		{
			title: 'Địa điểm làm việc',
			placeholder: 'địa điểm làm việc',
			id: 'address',
			key: 'address',
			type: 'text',
			align: 'left',
			isShow: true,
		},
		{
			title: 'Mô Tả Vị Trí',
			placeholder: 'mô tả vị trí',
			id: 'description',
			key: 'description',
			type: 'textarea',
			align: 'left',
			isShow: true,
		},
		{
			title: 'Yêu cầu năng lực',
			id: 'requirements',
			key: 'requirements',
			type: 'select',
			align: 'left',
			isShow: false,
			render: (item) => <span>{item?.requirement?.name || 'No data'}</span>,
			options: requirements,
			isMulti: true,
		},
		{
			title: 'Hành Động',
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
				</div>
			),
			isShow: false,
		},
	];
	const handleSubmitForm = async (data) => {
		const dataSubmit = {
			id: parseInt(data?.id, 10),
			name: data?.name,
			address: data?.address,
			description: data?.description,
			department_id: parseInt(data.department_id, 10),
			position_levels_id: parseInt(data.position_levels_id, 10),
			manager: parseInt(data.manager, 10),
			// kpiNormId: data?.kpiName,
			requirement_id: data?.requirements?.map((item) => item.id),
		};
		if (data?.id) {
			try {
				const response = await updatePosition(dataSubmit);
				await response.data;
				dispatch(fetchPositionList());
				handleCloseForm();
				// eslint-disable-next-line no-empty
			} catch (error) {}
		} else {
			try {
				const response = await addPosition(dataSubmit);
				await response.data;
				dispatch(fetchPositionList());
				handleCloseForm();
				// eslint-disable-next-line no-empty
			} catch (error) {}
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
	return (
		<PageWrapper title={demoPages.hrRecords.subMenu.position.text}>
			<Page container='fluid'>
				{verifyPermissionHOC(
					<>
						<div
							className='row mb-0'
							style={{ maxWidth: '80%', minWidth: '60%', margin: '0 auto' }}>
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
							item={fetchRequirement()}
							label={itemEdit?.id ? 'Cập nhật vị trí' : 'Thêm mới vị trí'}
							fields={columns}
							// nv={nvs}
							validate={validate}
						/>
						<PositionDetail
							show={openDetail}
							onClose={handleCloseDetail}
							item={fetchRequirementDetail()}
							label={`Chi tiết vị trí: ${dataDetail?.name}`}
							fields={columns}
							// nv
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
