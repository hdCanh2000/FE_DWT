import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useToasts } from 'react-toast-notifications';
import Toasts from '../../components/bootstrap/Toasts';
import Page from '../../layout/Page/Page';
import PageWrapper from '../../layout/PageWrapper/PageWrapper';
import { demoPages } from '../../menu';
import { fetchWorktrackListMe } from '../../redux/slice/worktrackSlice';
import { addKpiNorm } from '../kpiNorm/services';
import { addWorktrack } from './services';
import TableCalendar from './TableCalendar';
import TableWorkTracking from './tableWorkTracking';

const DailyWorkTrackingMe = () => {
	const dispatch = useDispatch();
	const { addToast } = useToasts();
	const worktracks = useSelector((state) => state.worktrack.worktracks);

	useEffect(() => {
		dispatch(fetchWorktrackListMe());
	}, [dispatch]);

	useEffect(() => {
		setRowsState(worktracks);
	}, [dispatch, worktracks]);

	const [rowsState, setRowsState] = useState([]);

	const handleAddRow = () => {
		const item = {
			name: '',
			quantity: '',
			unit: '',
			note: '',
			deadline: '',
			plan: '',
		};
		setRowsState((prev) => [...prev, item]);
	};

	// hàm onchange cho input key
	const handleChangeRowState = (index, event, name) => {
		setRowsState((prev) => {
			return prev.map((row, i) => {
				if (i !== index) return row;
				return {
					...row,
					[name]: name === 'unit' ? event : event.target?.value,
				};
			});
		});
	};

	const handleRemoveRowField = (e, index) => {
		setRowsState((prev) => prev.filter((state) => state !== prev[index]));
	};

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

	const handleSubmit = () => {
		const dataKPINormSubmit = [];
		const dataWorktrackSubmit = [];
		rowsState.forEach((item) => {
			dataKPINormSubmit.push({
				name: item.name,
				description: null,
				hr: null,
				departmentId: null,
				department: null,
				positionId: null,
				position: null,
				unitId: item.unit?.value,
				unit: {
					name: item.unit?.name,
					id: item.unit?.value,
				},
				manday: null,
				quantity: parseInt(item.quantity, 10),
			});
			dataWorktrackSubmit.push({
				name: item.name,
				userId: parseInt(window.localStorage.getItem('userId'), 10),
				unitId: item.unit?.value,
				unit: {
					name: item.unit?.name,
					id: item.unit?.value,
				},
				quantity: parseInt(item.quantity, 10),
				note: item.note,
				deadline: item.deadline,
				plan: item.plan,
				trackings: [],
				status: 1,
			});
		});
		dataKPINormSubmit.forEach((item) => {
			addKpiNorm(item)
				.then(() => {})
				.catch((err) => {
					throw err;
				});
		});
		dataWorktrackSubmit.forEach((item) => {
			addWorktrack(item)
				.then(() => {
					handleShowToast(`Thêm nhiệm vụ`, `Thêm nhiệm vụ thành công!`);
					dispatch(fetchWorktrackListMe());
				})
				.catch((err) => {
					handleShowToast(`Thêm nhiệm vụ`, `Thêm nhiệm vụ không thành công!`);
					throw err;
				});
		});
	};

	return (
		<PageWrapper title={demoPages.jobsPage.subMenu.dailyWorkTracking.text}>
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
						<div className='row p-2'>
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
						</div>
					</div>
				</div>
			</Page>
		</PageWrapper>
	);
};
export default DailyWorkTrackingMe;
