// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable jsx-a11y/no-static-element-interactions */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable jsx-a11y/click-events-have-key-events */

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { arrayToTree } from 'performant-array-to-tree';
import { TreeTable, TreeState } from 'cp-react-tree-table';
import { isEmpty } from 'lodash';
import Page from '../../layout/Page/Page';
import PageWrapper from '../../layout/PageWrapper/PageWrapper';
import { demoPages } from '../../menu';
import Card, {
	CardActions,
	CardBody,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../../components/bootstrap/Card';
import Button from '../../components/bootstrap/Button';
import useDarkMode from '../../hooks/useDarkMode';
import CommonForm from '../common/ComponentCommon/CommonForm';
import { fetchDepartmentList } from '../../redux/slice/departmentSlice';
import { fetchKpiNormList } from '../../redux/slice/kpiNormSlice';
import { addKpiNorm, deleteKpiNorm, updateKpiNorm } from './services';
import TaskAlertConfirm from '../work-management/mission/TaskAlertConfirm';
import validate from './validate';
import DetailForm from '../common/ComponentCommon/DetailForm';
import verifyPermissionHOC from '../../HOC/verifyPermissionHOC';
import { fetchPositionList } from '../../redux/slice/positionSlice';
import { fetchUnitList } from '../../redux/slice/unitSlice';
import { toggleFormSlice } from '../../redux/common/toggleFormSlice';
import NotPermission from '../presentation/auth/NotPermission';
import './style.css';
import Icon from '../../components/icon/Icon';

const KpiNormPage = () => {
	const { darkModeStatus } = useDarkMode();
	const dispatch = useDispatch();
	const kpiNorm = useSelector((state) => state.kpiNorm.kpiNorms);
	const departments = useSelector((state) => state.department.departments);
	const positions = useSelector((state) => state.position.positions);
	const units = useSelector((state) => state.unit.units);
	const toggleForm = useSelector((state) => state.toggleForm.open);
	const itemEdit = useSelector((state) => state.toggleForm.data);
	const [openDetail, setOpenDetail] = useState(false);
	const [dataDetail, setDataDetail] = useState(false);

	const handleOpenForm = (data) => dispatch(toggleFormSlice.actions.openForm(data));
	const handleCloseForm = () => dispatch(toggleFormSlice.actions.closeForm());

	useEffect(() => {
		dispatch(fetchUnitList());
		dispatch(fetchPositionList());
		dispatch(fetchDepartmentList());
		dispatch(fetchKpiNormList());
	}, [dispatch]);

	const [itemDelete, setItemDelete] = React.useState({});
	const [isDelete, setIsDelete] = React.useState(false);

	const [treeValue, setTreeValue] = React.useState(
		TreeState.create(arrayToTree(kpiNorm, { childrenField: 'children' })),
	);

	useEffect(() => {
		if (!isEmpty(kpiNorm)) {
			setTreeValue(
				TreeState.expandAll(
					TreeState.create(arrayToTree(kpiNorm, { childrenField: 'children' })),
				),
			);
		}
	}, [kpiNorm]);

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
			title: 'Định mức cha',
			id: 'parent',
			key: 'parent',
			type: 'select',
			align: 'center',
			options: kpiNorm,
			isShow: true,
			isMulti: false,
			col: 6,
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
			col: 5,
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
			title: 'Số ngày công',
			id: 'manday',
			key: 'manday',
			type: 'number',
			align: 'right',
			isShow: true,
			col: 3,
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

	const handleSubmitForm = async (data) => {
		const dataSubmit = {
			id: parseInt(data?.id, 10),
			name: data?.name,
			description: data?.description,
			manday: data?.manday,
			hr: data?.hr,
			department_id: parseInt(data?.department?.id, 10),
			position_id: parseInt(data?.position?.id, 10),
			unit_id: parseInt(data?.unit?.id, 10),
			parent_id: parseInt(data?.parent?.id, 10),
			type: 1,
		};
		if (data?.id) {
			try {
				const response = await updateKpiNorm(dataSubmit);
				await response.data;
				dispatch(fetchKpiNormList());
				handleCloseForm();
				setTreeValue(TreeState.expandAll(treeValue));
			} catch (error) {
				setTreeValue(TreeState.expandAll(treeValue));
				throw error;
			}
		} else {
			try {
				const response = await addKpiNorm(dataSubmit);
				await response.data;
				dispatch(fetchKpiNormList());
				handleCloseForm();
				setTreeValue(TreeState.expandAll(treeValue));
			} catch (error) {
				setTreeValue(TreeState.expandAll(treeValue));
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

	const handleCloseDetail = () => {
		setOpenDetail(false);
		setDataDetail({});
	};

	const handleDeleteKpiNorm = async (item) => {
		// eslint-disable-next-line no-useless-catch
		try {
			await deleteKpiNorm(item);
			dispatch(fetchKpiNormList());
		} catch (error) {
			throw error;
		}
		handleCloseDelete();
	};

	const lable = 'Định mức lao động & KPI';

	const handleOnChange = (newValue) => {
		setTreeValue(newValue);
	};

	const renderIndexCell = (row) => {
		return (
			<div
				style={{
					paddingLeft: `${row.metadata.depth * 30}px`,
					minWidth: 360,
				}}
				// onClick={row.toggleChildren}
				onDoubleClick={() => handleOpenForm(row.data)}
				className={
					row.metadata.hasChildren
						? 'with-children d-flex align-items-center cursor-pointer user-select-none'
						: 'without-children cursor-pointer user-select-none'
				}>
				{row.metadata.hasChildren ? (
					<Icon
						color='success'
						type='button'
						size='lg'
						icon={row.$state.isExpanded ? 'ArrowDropDown' : 'ArrowRight'}
						className='d-block bg-transparent'
						style={{ fontSize: 25 }}
						onClick={row.toggleChildren}
					/>
				) : (
					''
				)}

				<span>{row.data.name || ''}</span>
			</div>
		);
	};

	return (
		<PageWrapper title={demoPages.cauHinh.subMenu.kpiNorm.text}>
			<Page container='fluid'>
				{verifyPermissionHOC(
					<>
						<div className='row'>
							<div className='col-12'>
								<div className='d-flex justify-content-between align-items-center'>
									<div className='display-6 fw-bold py-3'>{lable}</div>
								</div>
							</div>
						</div>
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
									<CardBody>
										<TreeTable value={treeValue} onChange={handleOnChange}>
											<TreeTable.Column
												// basis='180px'
												// grow='0'
												style={{ minWidth: 300 }}
												renderCell={renderIndexCell}
												renderHeaderCell={() => <span>Tên định mức</span>}
											/>
											<TreeTable.Column
												renderCell={(row) => (
													<span className='expenses-cell text-left'>
														{row.data.department.name || ''}
													</span>
												)}
												renderHeaderCell={() => (
													<span className='t-left'>Phòng ban</span>
												)}
											/>
											<TreeTable.Column
												renderCell={(row) => (
													<span className='expenses-cell text-left'>
														{row.data.position.name || ''}
													</span>
												)}
												renderHeaderCell={() => <span>Vị trí</span>}
											/>
											<TreeTable.Column
												renderCell={(row) => (
													<span className='expenses-cell text-left'>
														{row.data.unit.name || ''}
													</span>
												)}
												renderHeaderCell={() => (
													<span className='t-left'>Đơn vị tính</span>
												)}
											/>
											<TreeTable.Column
												renderCell={(row) => (
													<span className='expenses-cell text-right'>
														{row.data.manday || ''}
													</span>
												)}
												renderHeaderCell={() => (
													<span className='t-left'>Số ngày công</span>
												)}
											/>
										</TreeTable>
									</CardBody>
								</Card>
							</div>
						</div>
					</>,
					['admin'],
					<NotPermission />,
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

export default KpiNormPage;
