/* eslint-disable react/prop-types */
import React, { useEffect, useState, useCallback, memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import moment from 'moment';
import _ from 'lodash';
import {
	TreeGridComponent,
	ColumnsDirective,
	ColumnDirective,
	Filter,
	Toolbar,
	Inject,
} from '@syncfusion/ej2-react-treegrid';
import { L10n } from '@syncfusion/ej2-base';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import Card, {
	CardActions,
	CardBody,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../../../components/bootstrap/Card';
import Page from '../../../layout/Page/Page';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import { fetchKpiNormList } from '../../../redux/slice/kpiNormSlice';
import OrderTaskForm from './OrdertaskForm';
import { deleteWorkTrack } from '../../dailyWorkTracking/services';
import verifyPermissionHOC from '../../../HOC/verifyPermissionHOC';
import NotPermission from '../../presentation/auth/NotPermission';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import Button from '../../../components/bootstrap/Button';
import Loading from '../../../components/Loading/Loading';
import { toggleFormSlice } from '../../../redux/common/toggleFormSlice';
import AlertConfirm from '../../common/ComponentCommon/AlertConfirm';
import { fetchAssignTask } from '../../../redux/slice/worktrackSlice';

L10n.load({
	'vi-VI': {
		grid: {
			EmptyDataSourceError: 'Có lỗi xảy ra, vui lòng tải lại trang.',
			EmptyRecord: 'Không có dữ liệu nhiệm vụ.',
		},
	},
});

const Item = memo(({ data, showKpiNorm, fetch, onOpen }) => {
	const { quantity, deadline, users } = data;
	const [open, setOpen] = useState(false);

	const handleClose = () => {
		setOpen(false);
	};

	const handleOpen = () => {
		setOpen(true);
	};
	const userResponsible = _.get(
		_.filter(users, (user) => {
			return _.get(user, 'workTrackUsers.isResponsible') === true;
		})[0],
		'name',
	);

	const handlDeleteItem = async (ele) => {
		try {
			await deleteWorkTrack(ele.id);
			toast.success('Xoá công việc thành công!', {
				position: toast.POSITION.TOP_RIGHT,
				autoClose: 1000,
			});
			fetch();
		} catch (error) {
			toast.error('Xoá công việc không thành công!', {
				position: toast.POSITION.TOP_RIGHT,
				autoClose: 1000,
			});
			throw error;
		}
	};

	return (
		<>
			<Card>
				<CardHeader className='pb-1 cursor-pointer w-100'>
					<CardLabel className='w-100 cursor-pointer' onClick={() => onOpen(data)}>
						<CardTitle>
							<CardLabel>{showKpiNorm(_.get(data, 'kpiNorm_id'))}</CardLabel>
						</CardTitle>
					</CardLabel>
					<CardActions onClick={handleOpen}>
						<FormGroup>
							<OverlayTrigger
								overlay={
									<Tooltip id='addSubMission'>Xóa nhiệm vụ đã giao</Tooltip>
								}>
								<Button
									type='button'
									size='lg'
									className='d-block w-10'
									icon='Close'
								/>
							</OverlayTrigger>
						</FormGroup>
					</CardActions>
				</CardHeader>
				<CardBody
					className='row px-4 pb-4 pt-1 cursor-pointer'
					onClick={() => onOpen(data)}>
					{verifyPermissionHOC(
						<div className='col-12'>Người phụ trách: {userResponsible}</div>,
						['admin', 'manager'],
					)}
					<div className='col-12'>
						Thời hạn hoàn thành: {moment(deadline).format('DD-MM-YYYY')}
					</div>
					<div className='col-12'>Số lượng : {quantity}</div>
				</CardBody>
			</Card>
			<AlertConfirm
				openModal={open}
				onCloseModal={handleClose}
				onConfirm={() => handlDeleteItem(data)}
				title='Xoá công việc'
				content='Xác nhận xoá công việc đã giao?'
			/>
		</>
	);
});

const toolbarOptions = ['Search'];
const searchOptions = {
	fields: ['data.name', 'data.position.name'],
	ignoreCase: true,
	key: '',
	operator: 'contains',
};

const OrderTask = () => {
	const dispatch = useDispatch();
	const kpiNorm = useSelector((state) => state.kpiNorm.kpiNorms);
	const tasks = useSelector((state) => state.worktrack.tasks);
	const loading = useSelector((state) => state.worktrack.loading);
	const toggleForm = useSelector((state) => state.toggleForm.open);
	const itemEdit = useSelector((state) => state.toggleForm.data);
	const handleOpenForm = (data) => dispatch(toggleFormSlice.actions.openForm(data));
	const handleCloseForm = () => dispatch(toggleFormSlice.actions.closeForm());

	const [treeValue, setTreeValue] = useState([]);

	useEffect(() => {
		dispatch(fetchAssignTask());
	}, [dispatch]);

	useEffect(() => {
		dispatch(fetchKpiNormList());
	}, [dispatch]);
	const createDataTree = useCallback((dataset) => {
		const hashTable = Object.create(null);
		dataset.forEach((aData) => {
			hashTable[aData.id] = { data: aData, children: [] };
		});
		const dataTree = [];
		dataset.forEach((aData) => {
			if (aData.parentId) {
				hashTable[aData.parentId]?.children.push(hashTable[aData.id]);
			} else {
				dataTree.push(hashTable[aData.id]);
			}
		});
		return dataTree;
	}, []);

	useEffect(() => {
		if (!_.isEmpty(kpiNorm)) {
			const treeData = createDataTree(
				_.map(kpiNorm, (item) => {
					return {
						...item,
						quantity: !_.isNumber(item.quantity) ? '--' : item.quantity,
						kpi_value: !_.isNumber(item.kpi_value) ? '--' : item.kpi_value,
						unit: item?.unit?.name,
					};
				}),
			);
			setTreeValue(treeData);
		}
	}, [createDataTree, kpiNorm]);
	const showKpiNorm = (kpiNormId) => {
		const newKpiNorm = kpiNorm.filter((item) => item.id === kpiNormId);
		return newKpiNorm.length !== 0 ? newKpiNorm[0].label : null;
	};
	return (
		<PageWrapper title='Giao việc'>
			<Page container='fluid'>
				{loading ? (
					<Loading />
				) : (
					<div>
						{verifyPermissionHOC(
							<div className='col-12'>
								<div className='row h-100 w-100'>
									<div className='col-4' style={{ height: '800px' }}>
										<Card style={{ height: '800px' }}>
											<CardHeader>
												<CardLabel>
													<CardTitle>
														<CardLabel>Nhiệm vụ đã giao</CardLabel>
													</CardTitle>
												</CardLabel>
											</CardHeader>
											<div className='p-4' style={{ overflow: 'scroll' }}>
												<div>
													<div>
														{tasks.length === 0 &&
															'Chưa giao nhiệm vụ nào!'}
													</div>
													{tasks?.map((item) => (
														<Item
															fetch={() =>
																dispatch(fetchAssignTask())
															}
															key={item.id}
															showKpiNorm={showKpiNorm}
															data={item}
															onOpen={handleOpenForm}
														/>
													))}
												</div>
											</div>
										</Card>
									</div>
									<div className='col-8' style={{ height: '800px' }}>
										<Card style={{ height: '800px' }}>
											<CardHeader>
												<CardLabel>
													<CardTitle>
														<CardLabel>Danh sách nhiệm vụ</CardLabel>
													</CardTitle>
												</CardLabel>
											</CardHeader>
											<CardBody className='h-100'>
												<div className='control-pane h-100'>
													<div className='control-section h-100'>
														<TreeGridComponent
															locale='vi-VI'
															dataSource={treeValue}
															treeColumnIndex={0}
															allowResizing
															allowReordering
															toolbar={toolbarOptions}
															searchSettings={searchOptions}
															className='cursor-pointer'
															rowSelected={(item) => {
																handleOpenForm({
																	kpiNorm_id: item.data.data.id,
																	unit: item.data.data?.unit,
																	quantity:
																		item.data.data?.quantity,
																	kpi_value:
																		item.data.data.kpi_value,
																	kpiNorm_name:
																		item.data.data.name,
																});
															}}
															childMapping='children'
															height='600'>
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
															<Inject services={[Filter, Toolbar]} />
														</TreeGridComponent>
													</div>
												</div>
											</CardBody>
										</Card>
									</div>
								</div>
							</div>,
							['admin', 'manager', 'user'],
							<NotPermission />,
						)}
					</div>
				)}
			</Page>
			<OrderTaskForm
				fetch={() => dispatch(fetchAssignTask())}
				show={toggleForm}
				onClose={handleCloseForm}
				item={itemEdit}
			/>
		</PageWrapper>
	);
};
export default OrderTask;
