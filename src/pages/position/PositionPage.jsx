import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
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
import Toasts from '../../components/bootstrap/Toasts';
import useDarkMode from '../../hooks/useDarkMode';
// import CommonForm from '../common/ComponentCommon/CommomForm';
import validate from './validate';
import verifyPermissionHOC from '../../HOC/verifyPermissionHOC';
import { toggleFormSlice } from '../../redux/common/toggleFormSlice';
import { fetchPositionList } from '../../redux/slice/positionSlice';
import { fetchPositionLevelList } from '../../redux/slice/positionLevelSlice';
import { fetchDepartmentList } from '../../redux/slice/departmentSlice';
import { fetchKpiNormList } from '../../redux/slice/kpiNormSlice';
import { addPosition, updatePosition } from './services';
import PositionForm from '../common/ComponentCommon/PositionForm';

const PositionPage = () => {
	const { darkModeStatus } = useDarkMode();
	const { addToast } = useToasts();

	// const navigate = useNavigate();

	const dispatch = useDispatch();
	const toggleForm = useSelector((state) => state.toggleForm.open);
	const itemEdit = useSelector((state) => state.toggleForm.data);

	const handleOpenForm = (data) => dispatch(toggleFormSlice.actions.openForm(data));
	const handleCloseForm = () => dispatch(toggleFormSlice.actions.closeForm());

	const positions = useSelector((state) => state.position.positions);
	const positionLevels = useSelector((state) => state.positionLevel.positionLevels);
	const departments = useSelector((state) => state.department.departments);
	// const kpiNorms = useSelector((state) => state.kpiNorm.kpiNorms);

	const [nvs] = React.useState(true);
	useEffect(() => {
		dispatch(fetchPositionList());
	}, [dispatch]);

	useEffect(() => {
		dispatch(fetchPositionLevelList());
	}, [dispatch]);

	useEffect(() => {
		dispatch(fetchDepartmentList());
	}, [dispatch]);

	useEffect(() => {
		dispatch(fetchKpiNormList());
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
			title: 'Mã Vị Trí',
			// placeholder: 'mã vị trí',
			// id: 'code',
			key: 'code',
			// type: 'text',
			align: 'left',
			// isShow: true,
			render: (item) => <span>{item?.positionLevel?.code || 'No data'}</span>,
		},
		{
			title: 'Loại hình công việc',
			placeholder: 'loại hình công việc',
			id: 'jobType',
			key: 'jobType',
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
			title: 'Cấp Nhân Sự',
			id: 'positionLevelId',
			key: 'positionLevelId',
			type: 'singleSelect',
			align: 'left',
			isShow: true,
			render: (item) => <span>{item?.positionLevel?.name || 'No data'}</span>,
			options: positionLevels,
		},
		{
			title: 'Phòng Ban',
			id: 'departmentId',
			key: 'departmentId',
			type: 'singleSelect',
			align: 'left',
			isShow: true,
			render: (item) => <span>{item?.department?.name || 'No data'}</span>,
			options: departments,
		},
		{
			// title: 'Nhiệm vụ',
			// // id: 'kpiNormId',
			// // key: 'kpiNormId',
			// type: 'singleSelect',
			// align: 'left',
			// isShow: true,
			// render: (item) => <span>{item?.kpiNorm?.name || 'No data'}</span>,
			// options: kpiNorms,
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
					{/* <Button
						isOutline={!darkModeStatus}
						color='danger'
						isLight={darkModeStatus}
						className='text-nowrap mx-2'
						icon='Trash'
						// onClick={() => handleOpenDelete(item)}
					/> */}
				</>
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
			id: parseInt(data?.id, 10),
			name: data.name,
			address: data.address,
			description: data.description,
			departmentId: parseInt(data.departmentId, 10),
			positionLevelId: parseInt(data.positionLevelId, 10),
			jobType: data.jobType,
			kpiNormId: data.kpiName
		};
		if (data.id) {
			try {
				const response = await updatePosition(dataSubmit);
				const result = await response.data;
				dispatch(fetchPositionList());
				handleCloseForm();
				handleShowToast(
					`Cập nhật vị trí!`,
					`Vị trí ${result.name} được cập nhật thành công!`,
				);
			} catch (error) {
				handleShowToast(`Cập nhật phòng ban`, `Cập nhật phòng ban không thành công!`);
			}
		} else {
			try {
				const response = await addPosition(dataSubmit);
				const result = await response.data;
				dispatch(fetchPositionList());
				// handleClearValueForm();
				handleCloseForm();
				handleShowToast(`Thêm vị trí`, `Vị trí ${result.name} được thêm thành công!`);
			} catch (error) {
				handleShowToast(`Thêm vị trí`, `Thêm vị trí không thành công!`);
			}
		}
	};

	return (
		<PageWrapper title={demoPages.hrRecords.subMenu.position.text}>
			<Page container='fluid'>
				{verifyPermissionHOC(
					<>
						<div className='row mb-4'>
							<div className='col-12'>
								<div className='d-flex justify-content-between align-items-center'>
									<div className='display-6 fw-bold py-3'>Quản Lý Vị Trí</div>
								</div>
							</div>
						</div>
						<div className='row mb-0'>
							<div className='col-12'>
								<Card className='w-100'>
									<CardHeader>
										<CardLabel icon='AccountCircle' iconColor='primary'>
											<CardTitle>
												<CardLabel>Quản Lý Vị Trí</CardLabel>
											</CardTitle>
										</CardLabel>
										<CardActions>
											<Button
												color='info'
												icon='PersonPlusFill'
												tag='button'
												onClick={() => handleOpenForm(null)}>
												Thêm vị trí
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
								</Card>
							</div>
						</div>
						<PositionForm
							show={toggleForm}
							onClose={handleCloseForm}
							handleSubmit={handleSubmitForm}
							item={itemEdit}
							label={itemEdit?.id ? 'Cập nhật vị trí' : 'Thêm mới vị trí'}
							fields={columns}
							nv={nvs}
							validate={validate}
						/>
					</>,
					['admin'],
				)}
			</Page>
		</PageWrapper>
	);
};

export default PositionPage;
