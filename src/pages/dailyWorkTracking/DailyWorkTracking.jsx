/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty } from 'lodash';
import { toast } from 'react-toastify';
import {
	TreeGridComponent,
	ColumnsDirective,
	ColumnDirective,
	Inject,
	Filter,
	Toolbar,
} from '@syncfusion/ej2-react-treegrid';
import { L10n } from '@syncfusion/ej2-base';
import Card, { CardBody, CardHeader, CardLabel, CardTitle } from '../../components/bootstrap/Card';
import Page from '../../layout/Page/Page';
import PageWrapper from '../../layout/PageWrapper/PageWrapper';
import { fetchWorktrackListAll } from '../../redux/slice/worktrackSlice';
import './style.css';
import { toggleFormSlice } from '../../redux/common/toggleFormSlice';
import { LIST_STATUS } from '../../utils/constants';
import Loading from '../../components/Loading/Loading';
import DailyWorktrackForm from './DailyWorktrackForm';
import { addWorktrackLog } from './services';
import DailyWorktrackInfo from './DailyWorktrackInfo';
import Button from '../../components/bootstrap/Button';

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
			EmptyRecord: 'Không có dữ liệu nhiệm vụ.',
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

const DailyWorkTracking = () => {
	const dispatch = useDispatch();

	const worktrack = useSelector((state) => state.worktrack.worktracks);
	const loading = useSelector((state) => state.worktrack.loading);
	const toggleForm = useSelector((state) => state.toggleForm.open);
	const itemEdit = useSelector((state) => state.toggleForm.data);
	const handleOpenForm = (data) => dispatch(toggleFormSlice.actions.openForm(data));
	const handleCloseForm = () => dispatch(toggleFormSlice.actions.closeForm());

	const [treeValue, setTreeValue] = React.useState([]);
	const [showForm, setShowForm] = React.useState(false);
	const [dataShow, setDataShow] = React.useState({
		row: {},
		column: {},
		valueForm: {},
	});

	const toolbarOptions = ['Search'];
	const searchOptions = {
		fields: [
			'data.kpiNorm.name',
			'data.user.name',
			'data.user.department.name',
			'data.missionValue',
		],
		ignoreCase: true,
		key: '',
		operator: 'contains',
	};

	const fixForm = useCallback(() => {
		return worktrack.map((item) => ({
			...item,
			user: item?.users?.find((u) => u?.workTrackUsers?.isResponsible === true),
			statusName: LIST_STATUS.find((st) => st.value === item.status)?.label,
			parentId: item.parent_id,
		}));
	}, [worktrack]);

	useEffect(() => {
		if (!isEmpty(worktrack)) {
			const treeData = createDataTree(fixForm());
			setTreeValue(treeData);
		}
	}, [fixForm, worktrack]);

	useEffect(() => {
		dispatch(fetchWorktrackListAll());
	}, [dispatch]);

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

	const handleSubmit = (item) => {
		const dataSubmit = {
			status: item.status,
			date: dataShow.valueForm.date,
			note: item.note,
			workTrack_id: item.data.dataWorktrack.id || null,
		};
		addWorktrackLog(dataSubmit)
			.then(() => {
				handleClose();
				dispatch(fetchWorktrackListAll());
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
			<Button
				type='button'
				isOutline={false}
				color='info'
				isLight
				className='text-nowrap mx-2'
				icon='Eye'
				onClick={() =>
					handleOpenForm({
						...data,
						parent: worktrack.find((i) => i.id === data.parentId),
					})
				}
			/>
		);
	};

	return (
		<PageWrapper title='Danh sách công việc'>
			<Page container='fluid'>
				{loading ? (
					<Loading />
				) : (
					<div
						className='row mb-0'
						style={{ maxWidth: '90%', minWidth: '60%', margin: '0 auto' }}>
						<div className='col-12'>
							<Card className='w-100'>
								<div style={{ margin: '24px 24px 0' }}>
									<CardHeader>
										<CardLabel icon='TaskAlt' iconColor='primary'>
											<CardTitle>
												<CardLabel>Danh sách nhiệm vụ</CardLabel>
											</CardTitle>
										</CardLabel>
									</CardHeader>
									<CardBody>
										<div className='control-pane'>
											<div className='control-section'>
												<TreeGridComponent
													locale='vi-VI'
													dataSource={treeValue}
													treeColumnIndex={0}
													toolbar={toolbarOptions}
													searchSettings={searchOptions}
													className='cursor-pointer user-select-none'
													// rowSelected={(item) => {
													// 	handleOpenForm({
													// 		...item.data.data,
													// 		parent: worktrack.find(
													// 			(i) =>
													// 				i.id ===
													// 				item.data.data.parentId,
													// 		),
													// 	});
													// }}
													childMapping='children'
													height='400'>
													<ColumnsDirective>
														<ColumnDirective
															field='data.kpiNorm.name'
															headerText='Tên nhiệm vụ'
															customAttributes={customAttributes}
															width='400'
														/>
														<ColumnDirective
															field='data.user.name'
															headerText='Người phụ trách'
															customAttributes={customAttributes}
															width='200'
														/>
														<ColumnDirective
															headerText='Chi tiết'
															textAlign='Center'
															width='100'
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
			</Page>
		</PageWrapper>
	);
};
export default DailyWorkTracking;
