import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	TreeGridComponent,
	ColumnsDirective,
	ColumnDirective,
} from '@syncfusion/ej2-react-treegrid';
import _, { isEmpty } from 'lodash';
import Page from '../../layout/Page/Page';
import PageWrapper from '../../layout/PageWrapper/PageWrapper';
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
	const [treeValue, setTreeValue] = React.useState([]);
	const fixForm = () => {
		return kpiNorm.map((item) => ({
			...item,
			quantity: _.isEmpty(item.quantity) ? '--' : item.quantity,
			kpi_value: _.isEmpty(item.kpi_value) ? '--' : item.kpi_value,
		}));
	};
	useEffect(() => {
		if (!isEmpty(kpiNorm)) {
			const treeData = createDataTree(fixForm());
			setTreeValue(treeData);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
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
			id: 'tasktype',
			key: 'tasktype',
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
			name: data?.name,
			description: data?.description,
			descriptionkpivalue: data?.descriptionkpivalue,
			// department_id: parseInt(data?.position?.department?.id, 10),
			position_id: parseInt(data?.position?.id, 10),
			parent_id: parseInt(data?.parent?.id, 10),
			kpi_value: parseInt(data?.kpivalue, 10),
			quantity: parseInt(data?.quantity, 10),
			// hr: data?.hr,
			// manday: parseInt(data?.manday, 10),
			// unit_id: parseInt(data?.unit, 10),
			tasktype: data?.tasktype.value,
		};
		if (data.id) {
			try {
				const response = await updateKpiNorm(dataSubmit);
				await response.data;
				dispatch(fetchKpiNormList());
				handleCloseForm();
			} catch (error) {
				dispatch(fetchKpiNormList());
				throw error;
			}
		} else {
			try {
				const response = await addKpiNorm(dataSubmit);
				await response.data;
				dispatch(fetchKpiNormList());
				handleCloseForm();
			} catch (error) {
				dispatch(fetchKpiNormList());
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
	return (
		<PageWrapper title='Khai báo nhiệm vụ'>
			<Page container='fluid'>
				{verifyPermissionHOC(
					<div
						className='row mb-0'
						style={{ maxWidth: '90%', minWidth: '90%', margin: '0 auto' }}>
						<div className='col-12'>
							<Card className='w-100 h-100'>
								<div style={{ margin: '24px 24px 0' }}>
									<CardHeader>
										<CardLabel icon='FormatListBulleted' iconColor='primary'>
											<CardTitle>
												<CardLabel>Danh sách nhiệm vụ</CardLabel>
											</CardTitle>
										</CardLabel>
										<CardActions>
											<Button
												color='info'
												icon='PlaylistAdd'
												tag='button'
												onClick={() => handleOpenForm(null)}>
												Thêm mới
											</Button>
										</CardActions>
									</CardHeader>
									<CardBody>
										<div className='control-pane'>
											<div className='control-section'>
												<TreeGridComponent
													dataSource={treeValue}
													treeColumnIndex={0}
													className='cursor-pointer'
													rowSelected={(item) => {
														handleOpenForm(item.data.data);
													}}
													childMapping='children'
													height='410'>
													<ColumnsDirective>
														<ColumnDirective
															field='data.name'
															headerText='Tên nhiệm vụ'
															width='200'
														/>
														<ColumnDirective
															field='data.position.name'
															headerText='Vị trí đảm nhiệm'
															width='90'
															textAlign='Left'
														/>
														<ColumnDirective
															field='data.quantity'
															headerText='Số lượng'
															width='90'
															textAlign='Center'
														/>
														<ColumnDirective
															field='data.kpi_value'
															headerText='Giá trị KPI'
															width='90'
															textAlign='Center'
														/>
													</ColumnsDirective>
												</TreeGridComponent>
											</div>
										</div>
									</CardBody>
								</div>
							</Card>
						</div>
					</div>,
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
