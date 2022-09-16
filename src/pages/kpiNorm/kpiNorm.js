import React, { useEffect } from 'react';
import { useToasts } from 'react-toast-notifications';
import { useDispatch, useSelector } from 'react-redux';
import Page from '../../layout/Page/Page';
import PageWrapper from '../../layout/PageWrapper/PageWrapper';
// import TableCommon from '../common/ComponentCommon/TableCommon';
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
import verifyPermissionHOC from '../../HOC/verifyPermissionHOC';
import { toggleFormSlice } from '../../redux/common/toggleFormSlice';
import { fetchDepartmentList } from '../../redux/slice/departmentSlice';
import { fetchKpiNormList } from '../../redux/slice/kpiNormSlice';
import { addKpiNorm, deleteKpiNorm, updateKpiNorm } from './services';
import TaskAlertConfirm from '../work-management/mission/TaskAlertConfirm';
import validate from './validate';

const EmployeePage = () => {
	const { darkModeStatus } = useDarkMode();
	const { addToast } = useToasts();
	const dispatch = useDispatch();
	const toggleForm = useSelector((state) => state.toggleForm.open);
	const itemEdit = useSelector((state) => state.toggleForm.data);
	const handleOpenForm = (data) => dispatch(toggleFormSlice.actions.openForm(data));
	const handleCloseForm = () => dispatch(toggleFormSlice.actions.closeForm());

	const kpiNorm = useSelector((state) => state.kpiNorm.kpiNorms);
	const departments = useSelector((state) => state.department.departments);

	useEffect(() => {
		dispatch(fetchDepartmentList());
	}, [dispatch]);

	useEffect(() => {
		dispatch(fetchKpiNormList());
	}, [dispatch]);
	const kpiNorms = kpiNorm.map((item) => {
		if (item.id === itemEdit?.id) {
			return {
				id: '',
				label: 'Không',
				text: '',
				value: '',
			};
		}
		return {
			id: item.id,
			label: item.name,
			text: item.name,
			value: item.id,
		};
	});
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
			render: (item) => <span>{item?.department?.name || ''}</span>,
			options: departments,
			isMulti: false,
		},
		{
			title: 'Đơn vị',
			id: 'unit',
			key: 'unit',
			type: 'string',
			align: 'center',
			isShow: true,
		},
		{
			title: 'Điểm KPI trên 1 đơn vị',
			id: 'point',
			key: 'point',
			type: 'number',
			align: 'center',
			isShow: true,
		},
		{
			title: 'Nhiệm vụ cha',
			id: 'parent',
			key: 'parent',
			type: 'select',
			align: 'center',
			render: (item) => (
				<span>{item?.parent?.label === '' ? 'không' : item?.parent?.label}</span>
			),
			options: kpiNorms,
			isShow: false,
		},
		{
			title: 'Mô tả',
			id: 'description',
			key: 'description',
			type: 'string',
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
			id: data?.id,
			name: data?.name,
			departmentId: parseInt(data?.department?.id, 10),
			department: data?.department,
			parentId: parseInt(data?.parent?.id, 10),
			parent: data?.parent,
			unit: data?.unit,
			point: data?.point,
			description: data?.description,
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
					`Định mức KPI ${result?.user?.name} được thêm thành công!`,
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
	const handleDeleteKpiNorm = (item) => {
		try {
			deleteKpiNorm(item);
			dispatch(fetchKpiNormList());
			handleShowToast(`Xoá định mức KPI`, `Xoá định mức KPI thành công!`);
		} catch (error) {
			handleShowToast(`Xoá định mức KPI`, `Xoá định mức KPI không thành công!`);
		}
		handleCloseDelete();
	};
	return (
		<PageWrapper title={demoPages.hrRecords.subMenu.hrList.text}>
			<Page container='fluid'>
				{verifyPermissionHOC(
					<div className='row mb-4'>
						<div className='col-12'>
							<div className='d-flex justify-content-between align-items-center'>
								<div className='display-6 fw-bold py-3'>Danh mục định mức KPI</div>
							</div>
						</div>
					</div>,
					['admin', 'manager'],
				)}
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
										<table
											className='table table-modern mb-0'
											style={{ fontSize: 14 }}>
											<thead>
												<tr>
													<th>Tên định mức KPI</th>
													<th className='text-center'>Phòng ban</th>
													<th className='text-center'>Đơn vị</th>
													<th className='text-center'>
														Điểm KPI trên 1 đơn vị
													</th>
													<th className='text-center'>Hành động</th>
													<td />
												</tr>
											</thead>
											<tbody>
												{kpiNorm?.map((item) => (
													<React.Fragment key={item.id}>
														<tr>
															<td className='cursor-pointer'>
																{item?.name}
															</td>
															<td
																className='cursor-pointer'
																align='center'>
																{item?.department?.name}
															</td>
															<td
																className='cursor-pointer'
																align='center'>
																{item?.unit}
															</td>
															<td
																className='cursor-pointer'
																align='center'>
																{item?.point}
															</td>
															<td align='center'>
																<Button
																	isOutline={!darkModeStatus}
																	color='success'
																	isLight={darkModeStatus}
																	className='text-nowrap mx-1'
																	icon='Edit'
																	onClick={() =>
																		handleOpenForm(item)
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
