/* eslint-disable */
import { Table } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { getWorkTrackTableRowAndHeaderRow } from './config';
import moment from 'moment/moment';
import ModalTargetLog from './ModalTargetLog';
import ModalTargetInfo from './ModalTargetInfo';
import { useQuery } from 'react-query';
import { getListTarget, getUserDetail } from '../../pages/dailyWorkTracking/services';
import scrollIntoView from 'scroll-into-view';

const TargetTable = ({ dataSearch }) => {
	const [isOpenTargetLogModal, setIsOpenTargetLogModal] = useState(false);
	const [isOpenTargetInfoModal, setIsOpenTargetInfoModal] = useState(false);
	const [canScroll, setCanScroll] = useState(true);
	// set default date to today
	const [targetLogModalData, setTargetLogModalData] = useState({ logDay: moment(), target: {} });
	const [targetInfoModalData, setTargetInfoModalData] = useState({});

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
	);
	const {
		data: listTarget = [],
		isLoading: isLoadingListTarget,
		isError: isErrorListTarget,
		refetch: reFetchListTarget,
	} = useQuery(['getListTarget', dataSearch], ({ queryKey }) => getListTarget(queryKey[1]));

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
				deadline: dayjs(item.deadline).format('DD/MM/YYYY'),
				// KQT MD: Kết quả tạm - Nhân từ số đầu việc hoàn thành nhân với MD
				manDayEstimated: totalCompletedTasks * item.manDay,
				unit: item.unit.name,
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

	return (
		<>
			{isErrorListTarget ? (
				<div>Can't load data</div>
			) : (
				<Table
					columns={columns}
					dataSource={tableData}
					bordered
					scroll={{ x: 'max-content' }}
					loading={isLoadingListTarget}
				/>
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
			/>
		</>
	);
};

export default TargetTable;
