/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/prop-types */
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import _, { isEmpty } from 'lodash';
import { toast } from 'react-toastify';
import {
	TreeGridComponent,
	ColumnsDirective,
	ColumnDirective,
	Inject,
	Filter,
	Toolbar,
	Resize,
} from '@syncfusion/ej2-react-treegrid';
import { L10n } from '@syncfusion/ej2-base';
import { useParams } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import moment from 'moment';
import Card, {
	CardActions,
	CardBody,
	CardFooter,
	CardFooterRight,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../../components/bootstrap/Card';
import Page from '../../layout/Page/Page';
import PageWrapper from '../../layout/PageWrapper/PageWrapper';
import { fetchWorktrackList } from '../../redux/slice/worktrackSlice';
import './style.css';
import { toggleFormSlice } from '../../redux/common/toggleFormSlice';
import { LIST_STATUS } from '../../utils/constants';
import Loading from '../../components/Loading/Loading';
import Button from '../../components/bootstrap/Button';
import DailyWorktrackInfo from './DailyWorktrackInfo';
import DailyWorktrackForm from './DailyWorktrackForm';
import { addWorktrackLog } from './services';
import {
	calcCurrentKPIOfWorkTrack,
	calcTotalCurrentKPIWorkTrackByUser,
	calcTotalFromWorkTrackLogs,
	calcTotalKPIOfWorkTrack,
	calcTotalKPIWorkTrackByUser,
} from '../../utils/function';

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
	const worktrack = useSelector((state) => state.worktrack.worktrack);
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

	const params = useParams();
	const { id } = params;

	const toolbarOptions = ['Search'];
	const searchOptions = {
		fields: ['data.kpiNorm.name', 'data.mission.name'],
		ignoreCase: true,
		key: '',
		operator: 'contains',
	};

	useEffect(() => {
		dispatch(fetchWorktrackList(id));
	}, [dispatch, id]);

	useEffect(() => {
		if (!isEmpty(worktrack)) {
			const treeData = createDataTree(
				worktrack.workTracks
					?.filter((item) => {
						return item?.workTrackUsers?.isResponsible === true;
					})
					.map((item) => {
						return {
							...item,
							statusName: LIST_STATUS.find((st) => st.value === item.status)?.label,
							totalKPI: calcTotalKPIOfWorkTrack(item),
							totalQuantity: calcTotalFromWorkTrackLogs(item.workTrackLogs),
							currentKPI: calcCurrentKPIOfWorkTrack(item),
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
						parent: worktrack.workTracks?.find((i) => i.id === data.parentId),
					})
				}
			/>
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
				dispatch(fetchWorktrackList(id));
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
	const handleDate = (month) => {
		if (month === '/') {
			return '/';
		}
		const date = new Date();
		const y = date.getFullYear();
		const m = date.getMonth();
		const start = new Date(y, m - month, 1);
		const end = new Date(y, m + 1 - month, 0);
		const startDate = moment(start).format('YYYY-MM-DD');
		const endDate = moment(end).format('YYYY-MM-DD');
		return `?startDate=${startDate}&endDate=${endDate}`;
	};
	const selectDate = [
		{
			label: 'Tất cả',
			value: '/',
		},
		{
			label: 'Tháng này',
			value: '0',
		},
		{
			label: 'Tháng trước',
			value: '1',
		},
	];
	const [labelDropdow, setLabelDropdow] = React.useState('Tất cả');
	const handleChangeDate = (data) => {
		setLabelDropdow(data.label);
		dispatch(fetchWorktrackList(`${id}${handleDate(data.value)}`));
	};
	return (
		<PageWrapper title='Danh sách công việc'>
			<Page container='fluid'>
				{loading ? (
					<Loading />
				) : (
					<div className='row mb-0'>
						<div className='col-12'>
							<Card className='w-100'>
								<CardHeader>
									<CardLabel icon='TaskAlt' iconColor='primary'>
										<CardTitle>
											<CardLabel>
												Danh sách nhiệm vụ của {_.get(worktrack, 'name')}
											</CardLabel>
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
											onClick={() => dispatch(fetchWorktrackList(id))}>
											Tải lại
										</Button>
										<Dropdown>
											<Dropdown.Toggle variant='primary' id='dropdown-basic'>
												{labelDropdow}
											</Dropdown.Toggle>
											<Dropdown.Menu>
												{selectDate.map((ele) => (
													<Dropdown.Item
														onClick={() => handleChangeDate(ele)}>
														{ele.label}
													</Dropdown.Item>
												))}
											</Dropdown.Menu>
										</Dropdown>
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
												height='400'>
												<Inject services={[Resize]} />
												<ColumnsDirective>
													<ColumnDirective
														field='data.kpiNorm.name'
														headerText='Tên nhiệm vụ'
														width='400'
													/>
													<ColumnDirective
														field='data.totalKPI'
														headerText='Tổng điểm KPI'
														textAlign='Right'
														customAttributes={customAttributes}
														width='150'
													/>
													<ColumnDirective
														field='data.currentKPI'
														headerText='KPI đạt được'
														textAlign='Right'
														customAttributes={customAttributes}
														width='150'
													/>
													<ColumnDirective
														field='data.totalQuantity'
														headerText='Số lượng hoàn thành'
														textAlign='Right'
														customAttributes={customAttributes}
														width='150'
													/>
													<ColumnDirective
														field='data.statusName'
														headerText='Trạng thái'
														width='100'
														textAlign='Center'
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
									<CardFooter
										tag='div'
										className=''
										size='lg'
										borderSize={1}
										borderColor='primary'>
										<CardFooterRight tag='div' className='fw-bold fs-5'>
											Tổng điểm KPI:
											<span className='text-primary ms-2'>
												{calcTotalKPIWorkTrackByUser(worktrack)}
											</span>
										</CardFooterRight>
										<CardFooterRight tag='div' className='fw-bold fs-5'>
											Tổng điểm KPI hiện tại:
											<span className='text-primary ms-2'>
												{calcTotalCurrentKPIWorkTrackByUser(worktrack)}
											</span>
										</CardFooterRight>
									</CardFooter>
								</CardBody>
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
