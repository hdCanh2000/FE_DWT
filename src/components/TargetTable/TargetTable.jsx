/* eslint-disable */
import { Select, Table } from 'antd';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import dayjs from 'dayjs';
import { getWorkTrackTableRowAndHeaderRow, listColumnsOptions } from './config';
import moment from 'moment/moment';
import ModalTargetLog from './ModalTargetLog';
import ModalTargetInfo from './ModalTargetInfo';
import { useQuery } from 'react-query';
import { getListTargetInfos } from '../../pages/dailyWorkTracking/services';
import scrollIntoView from 'scroll-into-view';

const TargetTable = ({ dataSearch, columnsToShow = [], setKpiEstimated }) => {
	const [isOpenTargetLogModal, setIsOpenTargetLogModal] = useState(false);
	const [isOpenTargetInfoModal, setIsOpenTargetInfoModal] = useState(false);
	const [canScroll, setCanScroll] = useState(true);

	// set default date to today
	const [targetLogModalData, setTargetLogModalData] = useState({ logDay: moment(), target: {} });
	const [targetInfoModalData, setTargetInfoModalData] = useState({});
	const tableRef = useRef(null);

	const onCalenderClick = (record, currentDay) => {
		setTargetLogModalData((prevState) => ({
			...prevState,
			logDay: currentDay,
			target: record,
		}));
		setIsOpenTargetLogModal((prevState) => !prevState);
	};

	const onTargetTitleClick = (record) => {
		setTargetInfoModalData(record);
		setIsOpenTargetInfoModal(true);
	};

	const { columns, headerRow } = getWorkTrackTableRowAndHeaderRow(
		dayjs(dataSearch.start, 'M-DD-YYYY'),
		onCalenderClick,
		onTargetTitleClick,
		columnsToShow,
	);
	const {
		data: listTarget = [],
		isLoading: isLoadingListTarget,
		isError: isErrorListTarget,
		refetch: reFetchListTarget,
	} = useQuery(['getListTargetInfos', dataSearch], ({ queryKey }) =>
		getListTargetInfos(queryKey[1]),
	);

	// normalize data for table
	const tableData = useMemo(() => {
		const rows = listTarget.map((item, index) => {
			const targetLogs = item.TargetLogs;
			let totalCompletedTasks = 0;
			targetLogs.forEach((targetLog) => {
				if (targetLog.status === 'completed') {
					totalCompletedTasks += targetLog.quantity;
				}
			});

			const row = {
				key: index + 1,
				...item,
				deadline: item.deadline ? dayjs(item.deadline).format('DD/MM/YYYY') : '_',
				// KQT MD: Kết quả tạm - Nhân từ số đầu việc hoàn thành nhân với MD
				manDayEstimated: totalCompletedTasks * item.manDay,
				// progress: totalCompletedTasks / item.quantity * 100,
				progress: `${totalCompletedTasks} / ${item.quantity}`,
				unit: item?.unit?.name,
			};
			// insert targetLogs to table
			targetLogs.forEach((targetLog) => {
				const targetDay = dayjs(targetLog.reportDate || targetLog.noticedDate).format('DD');
				const logStatus = targetLog.status;
				const logQuantity = targetLog.quantity;
				const logNoticed = targetLog.noticedStatus;
				const jsonData = JSON.stringify({
					logStatus,
					logQuantity,
					logNoticed,
				});
				row[`day${+targetDay}`] = jsonData;
			});
			return row;
		});
		return [headerRow, ...rows];
	}, [listTarget]);
	useEffect(() => {
		// only scroll to current day when search month and year is current month and year
		const searchMonth = +dataSearch.start.split('-')[0];
		const searchYear = +dataSearch.start.split('-')[2];
		const currentMonth = dayjs().month() + 1;
		const currentYear = dayjs().year();
		if (searchMonth !== currentMonth || searchYear !== currentYear) {
			return;
		}
		if (!canScroll) {
			return;
		}
		const element = document.getElementById(`${+dayjs().format('DD')}`);
		if (!element) return;
		scrollIntoView(element, {
			align: {
				top: 0.5,
				right: 1,
			},
		});
	}, [tableData]);

	// disable sticky header
	useEffect(() => {
		if (!tableData.length) return;
		const table = tableRef.current;
		if (!table) return;
		const tableHeader = table.querySelector('th[colspan="9"]');
		if (!tableHeader) return;
		// reset style attribute
		tableHeader.style = '';
	}, [tableData, tableRef, columnsToShow]);

	//set kpi estimated
	useEffect(() => {
		if (!tableData.length) return;
		let totalManDayEstimated = 0;
		tableData.forEach((item) => {
			if (item.key === 'STT') {
				return;
			}
			totalManDayEstimated += item.manDayEstimated;
		});
		const kpiEstimated = totalManDayEstimated * 4;
		setKpiEstimated(kpiEstimated);
	}, [tableData]);

	return (
		<>
			{isErrorListTarget ? (
				<div>Can't load data</div>
			) : (
				<>
					<Table
						rowKey={(item) => item.id}
						columns={columns}
						dataSource={tableData}
						bordered
						scroll={{ x: 'max-content' }}
						loading={isLoadingListTarget}
						pagination={tableData.length <= 1 ? false : true}
						ref={tableRef}
					/>
					{tableData.length <= 1 ? (
						<div className='text-center'>
							<h5 style={{ color: '#adb5bd', paddingTop: '8px' }}>
								Chưa có nhiệm vụ nào
							</h5>
						</div>
					) : null}
				</>
			)}
			<ModalTargetLog
				isOpen={isOpenTargetLogModal}
				logDay={targetLogModalData.logDay}
				target={targetLogModalData.target}
				onOk={() => {
					setTargetLogModalData({ logDay: moment(), target: null });
					setIsOpenTargetLogModal(false);
				}}
				onCancel={() => {
					setTargetLogModalData({ logDay: moment(), target: null });
					setIsOpenTargetLogModal(false);
				}}
				reFetchTable={async () => {
					setCanScroll(false);
					await reFetchListTarget();
				}}
			/>

			<ModalTargetInfo
				open={isOpenTargetInfoModal}
				target={targetInfoModalData}
				onOk={() => setIsOpenTargetInfoModal(false)}
				reFetchListTarget={reFetchListTarget}
			/>
		</>
	);
};

export default TargetTable;
