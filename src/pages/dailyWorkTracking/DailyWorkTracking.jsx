import React, { useEffect } from 'react';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { arrayToTree } from 'performant-array-to-tree';
import { TreeTable, TreeState } from 'cp-react-tree-table';
import { isEmpty } from 'lodash';
import Card, { CardBody, CardHeader, CardLabel, CardTitle } from '../../components/bootstrap/Card';
// import { useToasts } from 'react-toast-notifications';
// import Toasts from '../../components/bootstrap/Toasts';
import Page from '../../layout/Page/Page';
import PageWrapper from '../../layout/PageWrapper/PageWrapper';
import { fetchWorktrackList } from '../../redux/slice/worktrackSlice';
import Icon from '../../components/icon/Icon';
import './style.css';
import { toggleFormSlice } from '../../redux/common/toggleFormSlice';
import DailyWorktrackingModal from './DailyWorktrackingModal';

// import { addKpiNorm } from '../kpiNorm/services';
// import { addWorktrack } from './services';
// import TableCalendar from './TableCalendar';
// import TableWorkTracking from './tableWorkTracking';

const DailyWorkTracking = () => {
	const dispatch = useDispatch();
	const params = useParams();
	// const { addToast } = useToasts();
	// const worktracks = useSelector((state) => state.worktrack.worktracks);

	const { id } = params;

	const worktrack = useSelector((state) => state.worktrack.worktracks);
	const toggleForm = useSelector((state) => state.toggleForm.open);
	const itemEdit = useSelector((state) => state.toggleForm.data);
	const handleOpenForm = (data) => dispatch(toggleFormSlice.actions.openForm(data));
	const handleCloseForm = () => dispatch(toggleFormSlice.actions.closeForm());

	const [treeValue, setTreeValue] = React.useState(
		TreeState.create(arrayToTree(worktrack, { childrenField: 'children' })),
	);

	useEffect(() => {
		if (!isEmpty(worktrack)) {
			setTreeValue(
				TreeState.expandAll(
					TreeState.create(arrayToTree(worktrack, { childrenField: 'children' })),
				),
			);
		}
	}, [worktrack]);

	useEffect(() => {
		dispatch(fetchWorktrackList(id));
	}, [dispatch, id]);

	// useEffect(() => {
	// 	setRowsState(worktracks);
	// }, [dispatch, worktracks]);

	// const [rowsState, setRowsState] = useState([]);

	// const handleAddRow = () => {
	// 	const item = {
	// 		name: '',
	// 		quantity: '',
	// 		unit: '',
	// 		note: '',
	// 		deadline: '',
	// 		plan: '',
	// 	};
	// 	setRowsState((prev) => [...prev, item]);
	// };

	// hàm onchange cho input key
	// const handleChangeRowState = (index, event, name) => {
	// 	setRowsState((prev) => {
	// 		return prev.map((row, i) => {
	// 			if (i !== index) return row;
	// 			return {
	// 				...row,
	// 				[name]: name === 'unit' ? event : event.target?.value,
	// 			};
	// 		});
	// 	});
	// };

	// const handleRemoveRowField = (e, index) => {
	// 	setRowsState((prev) => prev.filter((state) => state !== prev[index]));
	// };

	// const handleShowToast = (title, content) => {
	// 	addToast(
	// 		<Toasts title={title} icon='Check2Circle' iconColor='success' time='Now' isDismiss>
	// 			{content}
	// 		</Toasts>,
	// 		{
	// 			autoDismiss: true,
	// 		},
	// 	);
	// };

	// const userLogin = window.localStorage.getItem('roles');

	// const handleSubmit = () => {
	// 	const dataKPINormSubmit = [];
	// 	const dataWorktrackSubmit = [];
	// 	rowsState.forEach((item) => {
	// 		dataKPINormSubmit.push({
	// 			name: item.name,
	// 			description: null,
	// 			hr: null,
	// 			departmentId: null,
	// 			department: null,
	// 			positionId: null,
	// 			position: null,
	// 			unitId: item.unit?.value,
	// 			unit: {
	// 				name: item.unit?.name,
	// 				id: item.unit?.value,
	// 			},
	// 			manday: null,
	// 			quantity: parseInt(item.quantity, 10),
	// 			type: 2,
	// 		});
	// 		dataWorktrackSubmit.push({
	// 			name: item.name,
	// 			userId: parseInt(id, 10),
	// 			unitId: item.unit?.value,
	// 			unit: {
	// 				name: item.unit?.name,
	// 				id: item.unit?.value,
	// 			},
	// 			quantity: parseInt(item.quantity, 10),
	// 			note: item.note,
	// 			deadline: item.deadline,
	// 			plan: item.plan,
	// 			trackings: [],
	// 			status: 1,
	// 		});
	// 	});
	// 	dataKPINormSubmit.forEach((item) => {
	// 		addKpiNorm(item)
	// 			.then(() => {})
	// 			.catch((err) => {
	// 				throw err;
	// 			});
	// 	});
	// 	dataWorktrackSubmit.forEach((item) => {
	// 		addWorktrack(item)
	// 			.then(() => {
	// 				handleShowToast(`Thêm nhiệm vụ`, `Thêm nhiệm vụ thành công!`);
	// 				dispatch(fetchWorktrackList(id));
	// 			})
	// 			.catch((err) => {
	// 				handleShowToast(`Thêm nhiệm vụ`, `Thêm nhiệm vụ không thành công!`);
	// 				dispatch(fetchWorktrackList(id));
	// 				throw err;
	// 			});
	// 	});
	// };

	const renderIndexCell = (row) => {
		return (
			<div
				style={{
					paddingLeft: `${row.metadata.depth * 30}px`,
					minWidth: 360,
				}}
				// onClick={row.toggleChildren}
				onDoubleClick={() =>
					handleOpenForm({
						...row.data,
						parent: worktrack.find((item) => item.id === row.data.parentId),
					})
				}
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

				<span>{row.data?.kpiNorm?.name || ''}</span>
			</div>
		);
	};

	const handleOnChange = (newValue) => {
		setTreeValue(newValue);
	};

	return (
		<PageWrapper title='Công việc hàng ngày'>
			<Page container='fluid'>
				<div className='row'>
					<div className='col-12'>
						<div className='d-flex justify-content-between align-items-center'>
							<div className='display-6 fw-bold py-3'>Báo cáo công việc</div>
						</div>
					</div>
				</div>
				<div className='row mb-0 h-100'>
					<div className='col-12'>
						{/* <div className='row p-2'>
							<div className='col-8 px-0'>
								<TableWorkTracking
									rowsState={rowsState}
									handleChangeRowState={handleChangeRowState}
									handleAddRow={handleAddRow}
									handleRemoveRowField={handleRemoveRowField}
									handleSubmit={handleSubmit}
								/>
							</div>
							<div className='col-4 px-0'>
								<TableCalendar rowsState={rowsState} />
							</div>
						</div> */}
						<Card className='w-100'>
							<CardHeader>
								<CardLabel icon='AccountCircle' iconColor='primary'>
									<CardTitle>
										<CardLabel>Danh sách nhiệm vụ của nhân viên A</CardLabel>
									</CardTitle>
								</CardLabel>
							</CardHeader>
							<CardBody>
								<TreeTable value={treeValue} onChange={handleOnChange}>
									<TreeTable.Column
										// basis='180px'
										// grow='0'
										style={{ minWidth: 300 }}
										renderCell={renderIndexCell}
										renderHeaderCell={() => <span>Tên nhiệm vụ</span>}
									/>
									<TreeTable.Column
										renderCell={(row) => (
											<span className='expenses-cell text-left'>
												{row.data?.mission?.name || 'Không'}
											</span>
										)}
										renderHeaderCell={() => <span>Thuộc mục tiêu</span>}
									/>
									<TreeTable.Column
										renderCell={(row) => (
											<span className='expenses-cell text-left'>
												{row.data?.quantity || ''}
											</span>
										)}
										renderHeaderCell={() => (
											<span className='t-left'>Số lượng</span>
										)}
									/>
									<TreeTable.Column
										renderCell={(row) => (
											<span className='expenses-cell text-left'>
												{moment(`${row.data.deadline}`).format(
													'DD-MM-YYYY',
												) || ''}
											</span>
										)}
										renderHeaderCell={() => <span>Hạn hoàn thành</span>}
									/>
									<TreeTable.Column
										renderCell={(row) => (
											<span className='expenses-cell text-right'>
												{row.data?.kpiNorm?.manday || ''}
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
				<DailyWorktrackingModal
					data={itemEdit}
					worktrack={worktrack}
					handleClose={handleCloseForm}
					show={toggleForm}
				/>
			</Page>
		</PageWrapper>
	);
};
export default DailyWorkTracking;
