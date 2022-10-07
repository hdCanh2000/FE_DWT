// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable jsx-a11y/no-static-element-interactions */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable jsx-a11y/click-events-have-key-events */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-unused-vars */

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
import { fetchKpiNormList } from '../../redux/slice/kpiNormSlice';
import { addKpiNorm, deleteKpiNorm, updateKpiNorm } from './services';
import TaskAlertConfirm from '../work-management/mission/TaskAlertConfirm';
import validate from './validate';
import DetailForm from '../common/ComponentCommon/DetailForm';
import verifyPermissionHOC from '../../HOC/verifyPermissionHOC';
import { fetchPositionList } from '../../redux/slice/positionSlice';
import { toggleFormSlice } from '../../redux/common/toggleFormSlice';
import NotPermission from '../presentation/auth/NotPermission';
import './style.css';
import Icon from '../../components/icon/Icon';
import KPINormForm from './KPINormForm';

const createDataTree = (dataset) => {
	const hashTable = Object.create(null);
	dataset.forEach((aData) => {
		hashTable[aData.id] = { data: aData, children: [] };
	});
	const dataTree = [];
	dataset.forEach((aData) => {
		if (aData.parentId) {
			hashTable[aData.parentId].children.push(hashTable[aData.id]);
			// hashTable[aData.parentId]
		} else {
			dataTree.push(hashTable[aData.id]);
		}
	});
	return dataTree;
};

const KpiNormPage = () => {
	const { darkModeStatus } = useDarkMode();
	const dispatch = useDispatch();
	const kpiNorm = useSelector((state) => state.kpiNorm.kpiNorms);
	const positions = useSelector((state) => state.position.positions);
	const toggleForm = useSelector((state) => state.toggleForm.open);
	const itemEdit = useSelector((state) => state.toggleForm.data);
	const [openDetail, setOpenDetail] = useState(false);
	const [dataDetail, setDataDetail] = useState(false);

	const handleOpenForm = (data) => dispatch(toggleFormSlice.actions.openForm(data));
	const handleCloseForm = () => dispatch(toggleFormSlice.actions.closeForm());

	useEffect(() => {
		dispatch(fetchPositionList());
		dispatch(fetchKpiNormList());
	}, [dispatch]);

	const [itemDelete, setItemDelete] = React.useState({});
	const [isDelete, setIsDelete] = React.useState(false);

	const [treeValue, setTreeValue] = React.useState(
		TreeState.create(arrayToTree(kpiNorm, { childrenField: 'children' })),
	);

	useEffect(() => {
		if (!isEmpty(kpiNorm)) {
			const treeData = createDataTree(kpiNorm);
			setTreeValue(TreeState.expandAll(TreeState.create(treeData)));
		}
	}, [kpiNorm]);

	const columns = [
		{
			title: 'Tên nhiệm vụ',
			id: 'name',
			key: 'name',
			type: 'text',
			align: 'left',
			isShow: true,
			col: 6,
		},
		{
			title: 'Vị trí đảm nhiệm',
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
			title: 'Thuộc nhiệm vụ cha (nếu có)',
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
			title: 'Loại nhiệm vụ',
			id: 'taskType',
			key: 'taskType',
			type: 'select',
			align: 'center',
			options: [
				{
					label: 'Thường xuyên',
					value: 'Thường xuyên',
				},
				{
					label: 'Không thường xuyên',
					value: 'Không thường xuyên',
				},
				{
					label: 'Kinh doanh',
					value: 'Kinh doanh',
				},
			],
			isShow: true,
			isMulti: false,
			col: 6,
		},
		{
			title: 'Mô tả/Diễn giải',
			id: 'description',
			key: 'description',
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
			name: data.name,
			description: data.description || null,
			descriptionkpivalue: data.descriptionKpiValue || null,
			department_id: parseInt(data?.position?.department?.id, 10) || null,
			position_id: parseInt(data?.position?.id, 10),
			parent_id: parseInt(data?.parent?.id, 10),
			kpi_value: parseInt(data?.kpiValue, 10),
			quantity: parseInt(data?.quantity, 10),
			unit_id: 1,
			tasktype: data.taskType.value,
			type: 1,
		};
		if (data.id) {
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

				<div
					onClick={() =>
						handleOpenForm({
							...row.data,
							parent: kpiNorm.find((item) => item.id === row.data.parentId),
						})
					}>
					{row.data.name || ''}
				</div>
			</div>
		);
	};

	return (
		<PageWrapper title='Khai báo nhiệm vụ'>
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
												<CardLabel>Danh sách nhiệm vụ</CardLabel>
											</CardTitle>
										</CardLabel>
										<CardActions>
											<Button
												color='info'
												icon='PersonPlusFill'
												tag='button'
												onClick={() => handleOpenForm(null)}>
												Thêm nhiệm vụ
											</Button>
										</CardActions>
									</CardHeader>
									<CardBody>
										<TreeTable value={treeValue} onChange={handleOnChange}>
											<TreeTable.Column
												style={{ minWidth: 300 }}
												renderCell={renderIndexCell}
												renderHeaderCell={() => <span>Tên nhiệm vụ</span>}
											/>
											<TreeTable.Column
												renderCell={(row) => (
													<span className='expenses-cell text-left'>
														{row.data.tasktype || ''}
													</span>
												)}
												renderHeaderCell={() => <span>Loại nhiệm vụ</span>}
											/>
											<TreeTable.Column
												renderCell={(row) => (
													<span className='expenses-cell text-left'>
														{row.data.position.name || ''}
													</span>
												)}
												renderHeaderCell={() => (
													<span>Vị trí đảm nhiệm</span>
												)}
											/>
											<TreeTable.Column
												renderCell={(row) => (
													<span className='expenses-cell text-left'>
														{row.data.quantity || ''}
													</span>
												)}
												renderHeaderCell={() => (
													<span className='t-left'>Số lượng</span>
												)}
											/>
											<TreeTable.Column
												renderCell={(row) => (
													<span className='expenses-cell text-right'>
														{row.data.kpi_value || ''}
													</span>
												)}
												renderHeaderCell={() => (
													<span className='t-left'>Giá trị KPI</span>
												)}
											/>
										</TreeTable>
									</CardBody>
								</Card>
							</div>
						</div>
					</>,
					['admin', 'manager'],
					<NotPermission />,
				)}
				<KPINormForm
					show={toggleForm}
					onClose={handleCloseForm}
					handleSubmit={handleSubmitForm}
					item={itemEdit}
					label={itemEdit?.id ? 'Cập nhật nhiệm vụ' : 'Thêm mới nhiệm vụ'}
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
					title='Xoá nhiệm vụ'
					content={`Xác nhận xoá nhiệm vụ <strong>${itemDelete?.name}</strong> ?`}
				/>
			</Page>
		</PageWrapper>
	);
};

export default KpiNormPage;
