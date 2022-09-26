import React, { useEffect, useState } from 'react';
import { useToasts } from 'react-toast-notifications';
import { useDispatch, useSelector } from 'react-redux';
import Page from '../../layout/Page/Page';
import PageWrapper from '../../layout/PageWrapper/PageWrapper';
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
import CommonForm from '../common/ComponentCommon/CommonForm';
import { fetchDepartmentList } from '../../redux/slice/departmentSlice';
import { fetchKpiNormList } from '../../redux/slice/kpiNormSlice';
import { addKpiNorm, deleteKpiNorm, updateKpiNorm } from './services';
import TaskAlertConfirm from '../work-management/mission/TaskAlertConfirm';
import validate from './validate';
import DetailForm from '../common/ComponentCommon/DetailForm';
import verifyPermissionHOC from '../../HOC/verifyPermissionHOC';
import Search from '../common/ComponentCommon/Search';
import { fetchPositionList } from '../../redux/slice/positionSlice';
import { fetchUnitList } from '../../redux/slice/unitSlice';
import { toggleFormSlice } from '../../redux/common/toggleFormSlice';
import PaginationButtons, { dataPagination, PER_COUNT } from '../../components/PaginationButtons';

const EmployeePage = () => {
	const { darkModeStatus } = useDarkMode();
	const { addToast } = useToasts();
	const dispatch = useDispatch();
	const kpiNorm = useSelector((state) => state.kpiNorm.kpiNorms);
	const departments = useSelector((state) => state.department.departments);
	const positions = useSelector((state) => state.position.positions);
	const units = useSelector((state) => state.unit.units);
	const toggleForm = useSelector((state) => state.toggleForm.open);
	const itemEdit = useSelector((state) => state.toggleForm.data);
	const [openDetail, setOpenDetail] = useState(false);
	const [dataDetail, setDataDetail] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [perPage, setPerPage] = useState(PER_COUNT['10']);
	const items = dataPagination(kpiNorm, currentPage, perPage);

	const handleOpenForm = (data) => dispatch(toggleFormSlice.actions.openForm(data));
	const handleCloseForm = () => dispatch(toggleFormSlice.actions.closeForm());

	useEffect(() => {
		dispatch(fetchUnitList());
	}, [dispatch]);

	useEffect(() => {
		dispatch(fetchPositionList());
	}, [dispatch]);

	useEffect(() => {
		dispatch(fetchDepartmentList());
	}, [dispatch]);

	useEffect(() => {
		dispatch(fetchKpiNormList());
	}, [dispatch]);

	const [itemDelete, setItemDelete] = React.useState({});
	const [isDelete, setIsDelete] = React.useState(false);

	const columns = [
		{
			title: 'Tên định mức Kpi',
			id: 'name',
			key: 'name',
			type: 'text',
			align: 'left',
			isShow: true,
		},
		{
			title: 'Phòng ban',
			id: 'department',
			key: 'department',
			type: 'select',
			align: 'center',
			isShow: true,
			render: (item) => <span>{item?.department?.name || 'No data'}</span>,
			options: departments,
			isMulti: false,
			col: 6,
		},
		{
			title: 'Vị trí chuyên môn',
			id: 'position',
			key: 'position',
			type: 'select',
			align: 'center',
			isShow: true,
			render: (item) => <span>{item?.position?.name || 'No data'}</span>,
			options: positions,
			isMulti: false,
			col: 6,
		},
		{
			title: 'Đơn vị tính',
			id: 'unit',
			key: 'unit',
			type: 'select',
			align: 'center',
			options: units,
			isShow: true,
			render: (item) => <span>{item?.unit?.name || ''}</span>,
			isMulti: false,
			col: 4,
		},
		{
			title: 'Số lượng',
			id: 'quantity',
			key: 'quantity',
			type: 'number',
			align: 'center',
			isShow: true,
			col: 3,
		},
		{
			title: 'Số ngày công cần thiết',
			id: 'manday',
			key: 'manday',
			type: 'number',
			align: 'center',
			isShow: true,
			col: 5,
		},
		{
			title: 'Mô tả',
			id: 'description',
			key: 'description',
			type: 'textarea',
			align: 'center',
			isShow: true,
		},
		{
			title: 'Nguồn nhân lực',
			id: 'hr',
			key: 'hr',
			type: 'textarea',
			align: 'center',
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
						className='text-nowrap mx-1'
						icon='Edit'
						onClick={() => handleOpenForm(item)}
					/>
					<Button
						isOutline={!darkModeStatus}
						color='danger'
						isLight={darkModeStatus}
						className='text-nowrap mx-1'
						icon='Trash'
						onClick={() => handleOpenDelete(item)}
					/>
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
			name: data?.name,
			point: data?.point,
			description: data?.description,
			hr: data?.hr,
			departmentId: parseInt(data?.department?.id, 10),
			department: {
				id: data?.department?.id,
				name: data?.department?.name,
			},
			positionId: parseInt(data?.position?.id, 10),
			position: {
				id: data?.position?.id,
				name: data?.position?.name,
			},
			unitId: parseInt(data?.unit?.id, 10),
			unit: {
				id: data?.unit?.id,
				name: data?.unit?.name,
			},
			manday: data?.manday,
			quantity: data?.quantity,
		};
		if (data?.id) {
			try {
				const response = await updateKpiNorm(dataSubmit);
				const result = await response.data;
				dispatch(fetchKpiNormList());
				handleCloseForm();
				handleShowToast(
					`Cập nhật định mức KPI!`,
					`Định mức KPI ${result?.name} được cập nhật thành công!`,
				);
			} catch (error) {
				handleShowToast(`Cập nhật định mức KPI`, `Cập nhật định mức KPI không thành công!`);
				throw error;
			}
		} else {
			try {
				const response = await addKpiNorm(dataSubmit);
				const result = await response.data;
				dispatch(fetchKpiNormList());
				handleCloseForm();
				handleShowToast(
					`Thêm định mức KPI`,
					`Định mức KPI ${result?.name} được thêm thành công!`,
				);
			} catch (error) {
				handleShowToast(`Thêm định mức KPI`, `Thêm định mức KPI không thành công!`);
				throw error;
			}
		}
	};

	const handleOpenDelete = (item) => {
		setIsDelete(true);
		setItemDelete({ ...item });
	};

	const handleCloseDelete = () => {
		setIsDelete(false);
	};

	const handleOpenDetail = (item) => {
		setOpenDetail(true);
		setDataDetail({
			...item,
			department: {
				...item.department,
				label: item?.department?.name,
				value: item?.departmentId,
			},
		});
	};

	const handleCloseDetail = () => {
		setOpenDetail(false);
		setDataDetail({});
	};

	const handleDeleteKpiNorm = async (item) => {
		try {
			await deleteKpiNorm(item);
			dispatch(fetchKpiNormList());
			handleShowToast(`Xoá định mức KPI`, `Xoá định mức KPI thành công!`);
		} catch (error) {
			handleShowToast(`Xoá định mức KPI`, `Xoá định mức KPI không thành công!`);
		}
		handleCloseDelete();
	};

	const lable = 'Định mức lao động & KPI';

	return (
		<PageWrapper title={demoPages.cauHinh.subMenu.kpiNorm.text}>
			<Page container='fluid'>
				<div className='row'>
					<div className='col-12'>
						<div className='d-flex justify-content-between align-items-center'>
							<div className='display-6 fw-bold py-3'>{lable}</div>
						</div>
					</div>
				</div>
				{verifyPermissionHOC(
					<div className='row mb-0'>
						<div className='col-12'>
							<Card className='w-100'>
								<CardHeader>
									<CardLabel icon='AccountCircle' iconColor='primary'>
										<CardTitle>
											<CardLabel>Danh sách định mức KPI</CardLabel>
										</CardTitle>
									</CardLabel>
									<CardActions>
										<Button
											color='info'
											icon='PersonPlusFill'
											tag='button'
											onClick={() => handleOpenForm(null)}>
											Thêm định mức KPI
										</Button>
									</CardActions>
								</CardHeader>
								<div className='p-4'>
									<div className='p-4'>
										<div style={{ maxWidth: '25%' }}>
											<Search />
										</div>
										<table
											className='table table-modern mb-0'
											style={{ fontSize: 14 }}>
											<thead>
												<tr>
													<th>Tên định mức KPI</th>
													<th>Phòng ban</th>
													<th className='text-center'>Số lượng</th>
													<th>Đơn vị tính</th>
													<th>Mô tả</th>
													<th>Vị trí chuyên môn</th>
													<th className='text-center'>Hành động</th>
												</tr>
											</thead>
											<tbody>
												{items?.map((item) => (
													<React.Fragment key={item.id}>
														<tr>
															<td>{item?.name}</td>
															<td>{item?.department?.name}</td>
															<td className='text-center'>
																{item?.quantity}
															</td>
															<td>{item?.unit?.name}</td>
															<td>{item?.description}</td>
															<td>{item?.position?.name}</td>
															<td className='text-center'>
																<Button
																	isOutline={!darkModeStatus}
																	color='success'
																	isLight={darkModeStatus}
																	className='text-nowrap mx-1'
																	icon='Edit'
																	onClick={() =>
																		handleOpenForm({
																			...item,
																			department: {
																				...item.department,
																				value: item
																					.department
																					?.value,
																				label: item
																					.department
																					?.name,
																			},
																			position: {
																				...item.position,
																				value: item.position
																					?.value,
																				label: item.position
																					?.name,
																			},
																			unit: {
																				...item.unit,
																				value: item.unit
																					?.value,
																				label: item.unit
																					?.name,
																			},
																		})
																	}
																/>
																<Button
																	isOutline={!darkModeStatus}
																	color='primary'
																	isLight={darkModeStatus}
																	className='text-nowrap mx-1'
																	icon='RemoveRedEye'
																	onClick={() =>
																		handleOpenDetail({
																			...item,
																			department: {
																				...item.department,
																				value: item
																					.department
																					?.value,
																				label: item
																					.department
																					?.name,
																			},
																			position: {
																				...item.position,
																				value: item.position
																					?.value,
																				label: item.position
																					?.name,
																			},
																			unit: {
																				...item.unit,
																				value: item.unit
																					?.value,
																				label: item.unit
																					?.name,
																			},
																		})
																	}
																/>
																<Button
																	isOutline={!darkModeStatus}
																	color='danger'
																	isLight={darkModeStatus}
																	className='text-nowrap mx-1'
																	icon='Trash'
																	onClick={() =>
																		handleOpenDelete(item)
																	}
																/>
															</td>
														</tr>
													</React.Fragment>
												))}
											</tbody>
										</table>
										<hr />
										<footer>
											<PaginationButtons
												data={kpiNorm}
												setCurrentPage={setCurrentPage}
												currentPage={currentPage}
												perPage={perPage}
												setPerPage={setPerPage}
											/>
										</footer>
									</div>
								</div>
							</Card>
						</div>
					</div>,
					['admin', 'manager'],
				)}
				<CommonForm
					show={toggleForm}
					onClose={handleCloseForm}
					handleSubmit={handleSubmitForm}
					item={itemEdit}
					label={itemEdit?.id ? 'Cập nhật định mức KPI' : 'Thêm mới định mức KPI'}
					fields={columns}
					validate={validate}
				/>
				<DetailForm
					show={openDetail}
					onClose={handleCloseDetail}
					item={dataDetail}
					label={`${dataDetail?.name}`}
					fields={columns}
				/>
				<TaskAlertConfirm
					openModal={isDelete}
					onCloseModal={handleCloseDelete}
					onConfirm={() => handleDeleteKpiNorm(itemDelete?.id)}
					title='Xoá định mức KPI'
					content={`Xác nhận xoá định mức <strong>${itemDelete?.name}</strong> ?`}
				/>
			</Page>
		</PageWrapper>
	);
};

export default EmployeePage;
