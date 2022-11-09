/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { L10n } from '@syncfusion/ej2-base';
import {
	TreeGridComponent,
	ColumnsDirective,
	ColumnDirective,
	Inject,
	Filter,
	Toolbar,
	Resize,
} from '@syncfusion/ej2-react-treegrid';
import { isEmpty } from 'lodash';
import { toast } from 'react-toastify';
import Card, {
	CardActions,
	CardBody,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../../components/bootstrap/Card';
import Page from '../../layout/Page/Page';
import PageWrapper from '../../layout/PageWrapper/PageWrapper';
import { toggleFormSlice } from '../../redux/common/toggleFormSlice';
import './style.css';
import { LIST_STATUS } from '../../utils/constants';
import Loading from '../../components/Loading/Loading';
import DailyWorktrackInfo from './DailyWorktrackInfo';
import DailyWorktrackForm from './DailyWorktrackForm';
import Button from '../../components/bootstrap/Button';
import { fetchWorktrackListMe } from '../../redux/slice/worktrackSlice';
import { addWorktrackLog } from './services';
import { updateStatusWorktrack } from '../pendingWorktrack/services';
import AlertConfirm from '../common/ComponentCommon/AlertConfirm';

const createDataTree = (dataset) => {
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
};

L10n.load({
	'vi-VI': {
		grid: {
			EmptyDataSourceError: 'Có lỗi xảy ra, vui lòng tải lại trang.',
			EmptyRecord: 'Hiện tại chưa có công việc.',
		},
	},
});

const columns = () => {
	const date = new Date();
	const days = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
	const result = [];
	for (let i = 1; i <= days; i += 1) {
		result.push({
			day: i,
			date: `${i >= 10 ? i : `0${i}`}-${date.getMonth() + 1}-${date.getFullYear()}`,
		});
	}
	return result;
};

const renderColor = (status) => {
	switch (status) {
		case 'inProgress':
			return '#ffc000';
		case 'completed':
			return '#c5e0b3';
		case 'expired':
			return '#f97875';
		default:
			return 'transparent';
	}
};

const toolbarOptions = ['Search'];
const searchOptions = {
	fields: ['data.kpiNorm.name', 'data.mission.name'],
	ignoreCase: true,
	key: '',
	operator: 'contains',
};

const DailyWorkTrackingMe = () => {
	const dispatch = useDispatch();
	const worktrack = useSelector((state) => state.worktrack.worktrack);
	const loading = useSelector((state) => state.worktrack.loading);
	const toggleForm = useSelector((state) => state.toggleForm.open);
	const toggleFormDelete = useSelector((state) => state.toggleForm.confirm);
	const itemEdit = useSelector((state) => state.toggleForm.data);
	// const handleOpenForm = (data) => dispatch(toggleFormSlice.actions.openForm(data));
	const handleOpenFormDelete = (data) => dispatch(toggleFormSlice.actions.confirmForm(data));
	const handleCloseForm = () => dispatch(toggleFormSlice.actions.closeForm());
	const [treeValue, setTreeValue] = React.useState([]);
	const [showForm, setShowForm] = React.useState(false);
	const [dataShow, setDataShow] = React.useState({
		row: {},
		column: {},
		valueForm: {},
	});

	useEffect(() => {
		dispatch(fetchWorktrackListMe());
	}, [dispatch]);

	useEffect(() => {
		if (!isEmpty(worktrack)) {
			const treeData = createDataTree(
				worktrack.workTracks.map((item) => {
					return {
						...item,
						statusName: LIST_STATUS.find((st) => st.value === item.status)?.label,
						parentId: item.parent_id,
					};
				}),
			);
			setTreeValue(treeData);
		}
	}, [worktrack]);

	const handleShowForm = (row, item, dataWorktrack) => {
		setShowForm(true);
		setDataShow({
			valueForm: item,
			row,
			dataWorktrack,
		});
	};

	const handleClose = () => {
		setShowForm(false);
		setDataShow({
			valueForm: {},
			row: {},
		});
	};

	const customAttributesLog = { class: 'customcss_log' };
	const customAttributes = { class: 'customcss' };

	const treegridTemplate = (props) => {
		const { workTrackLogs } = props.data;
		return (
			<div className='d-flex'>
				{columns().map((item) => {
					return (
						<div
							key={item?.day}
							style={{
								border: '1px solid #c8c7c7',
								width: 48,
								height: 36,
								backgroundColor: renderColor(
									workTrackLogs?.find((i) => i?.date === item?.date)?.status,
								),
								borderRadius: 0,
							}}
							onClick={() =>
								handleShowForm(
									workTrackLogs?.find((i) => i?.date === item?.date),
									item,
									props.data,
								)
							}
							className='rounded-none cursor-pointer d-flex justify-content-center align-items-center'>
							{item?.day}
						</div>
					);
				})}
			</div>
		);
	};

	const viewTemplate = (props) => {
		const { data } = props;
		return (
			<div className=''>
				{/* <Button
					type='button'
					isOutline={false}
					color='info'
					isLight
					className='text-nowrap'
					icon='Eye'
					onClick={() =>
						handleOpenForm({
							...data,
							parent: worktrack.workTracks?.find((i) => i.id === data.parentId),
						})
					}>
					Xem
				</Button> */}
				{/* {(data.status === 'accepted' || data.status === 'completed') && (
					<Button
						type='button'
						isOutline={false}
						color='success'
						isLight
						className='text-nowrap ms-2'
						onClick={() => handleOpenFormDelete(data)}
						icon='Check'>
						Báo cáo
					</Button>
				)} */}
				<Button
					type='button'
					isOutline={false}
					color='success'
					isLight
					className='text-nowrap ms-2'
					onClick={() => handleOpenFormDelete(data)}
					icon='Check'>
					Báo cáo
				</Button>
			</div>
		);
	};

	const handleSubmit = (item) => {
		const dataSubmit = {
			status: item.status,
			date: dataShow.valueForm.date,
			note: item.note,
			quantity: item.quantity || null,
			workTrack_id: item.data.dataWorktrack.id,
		};
		addWorktrackLog(dataSubmit)
			.then(() => {
				handleClose();
				dispatch(fetchWorktrackListMe());
				toast.success('Báo cáo nhiệm vụ thành công!', {
					position: toast.POSITION.TOP_RIGHT,
					autoClose: 1000,
				});
			})
			.catch((err) => {
				toast.error('Báo cáo nhiệm vụ không thành công!', {
					position: toast.POSITION.TOP_RIGHT,
					autoClose: 1000,
				});
				throw err;
			});
	};

	const handleChangeStatus = (worktrackSubmit) => {
		const dataSubmit = {
			id: worktrackSubmit?.id,
			status: 'completed',
		};
		updateStatusWorktrack(dataSubmit)
			.then(() => {
				dispatch(fetchWorktrackListMe());
				handleCloseForm();
				toast.success('Báo cáo nhiệm vụ thành công!', {
					position: toast.POSITION.TOP_RIGHT,
					autoClose: 1000,
				});
			})
			.catch((error) => {
				toast.error('Báo cáo nhiệm vụ không thành công!', {
					position: toast.POSITION.TOP_RIGHT,
					autoClose: 1000,
				});
				throw error;
			});
	};

	return (
		<PageWrapper title='Công việc hàng ngày'>
			<Page container='fluid'>
				{loading ? (
					<Loading />
				) : (
					<div
						className='row mb-0 h-100'
						style={{ maxWidth: '90%', minWidth: '90%', margin: '0 auto' }}>
						<div className='col-12'>
							<Card className='w-100'>
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
												icon='ChangeCircle'
												tag='button'
												type='button'
												isOutline={false}
												isLight
												onClick={() => dispatch(fetchWorktrackListMe())}>
												Tải lại
											</Button>
										</CardActions>
									</CardHeader>
									<CardBody>
										<div className='control-pane'>
											<div className='control-section'>
												<TreeGridComponent
													locale='vi-VI'
													dataSource={treeValue}
													treeColumnIndex={0}
													allowResizing
													toolbar={toolbarOptions}
													searchSettings={searchOptions}
													className='cursor-pointer user-select-none'
													childMapping='children'
													height='500'>
													<Inject services={[Resize]} />
													<ColumnsDirective>
														<ColumnDirective
															field='data.kpiNorm.name'
															headerText='Tên nhiệm vụ'
															width='400'
														/>
														<ColumnDirective
															field='data.statusName'
															headerText='Trạng thái'
															width='200'
															textAlign='Center'
														/>
														<ColumnDirective
															headerText='Báo cáo'
															textAlign='Center'
															width='200'
															customAttributes={customAttributes}
															template={viewTemplate}
														/>
														<ColumnDirective
															headerText='Nhật trình công việc'
															textAlign='Left'
															width='900'
															minWidth='600'
															customAttributes={customAttributesLog}
															template={treegridTemplate}
														/>
													</ColumnsDirective>
													<Inject services={[Filter, Toolbar]} />
												</TreeGridComponent>
											</div>
										</div>
									</CardBody>
								</div>
							</Card>
						</div>
					</div>
				)}
				<DailyWorktrackInfo
					item={itemEdit}
					worktrack={worktrack}
					onClose={handleCloseForm}
					show={toggleForm}
				/>
				<DailyWorktrackForm
					data={dataShow}
					show={showForm}
					handleClose={handleClose}
					handleSubmit={handleSubmit}
				/>
				<AlertConfirm
					openModal={toggleFormDelete}
					onCloseModal={handleCloseForm}
					onConfirm={() => handleChangeStatus(itemEdit)}
					title='Báo cáo công việc'
					content='Xác nhận báo cáo công việc?'
				/>
			</Page>
		</PageWrapper>
	);
};
export default DailyWorkTrackingMe;
