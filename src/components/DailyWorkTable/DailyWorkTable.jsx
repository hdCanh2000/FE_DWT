/* eslint-disable */
import React from 'react';
import { Table } from 'antd';
import dayjs from 'dayjs';
import { getDailyWorkTableRowAndHeaderRow } from './config';
import { useQuery } from 'react-query';
import { getDailyWorks } from '../../pages/dailyWorkTracking/services';
import { useEffect, useMemo, useRef, useState } from 'react';
import scrollIntoView from 'scroll-into-view';
import ModalDailyWorkLog from './ModalDailyWorkLog';
import moment from 'moment';
import ModalDailyWorkInfo from './ModalDailyWorkInfo';

const DailyWorkTable = ({ dataSearch }) => {
	const [isOpenDailyWorkLogModal, setIsOpenDailyWorkLogModal] = useState(false);
	const [dailyWorkLogModalData, setDailyWorkLogModalData] = useState({
		logDay: moment(),
		dailyWork: {},
	});

	const [isOpenDailyWorkInfoModal, setIsOpenDailyWorkInfoModal] = useState(false);
	const [dailyWorkInfoModalData, setDailyWorkInfoModalData] = useState({});
	const tableRef = useRef(null);
	const [canScroll, setCanScroll] = useState(true);

	const onCalenderClick = (record, currentDay) => {
		setDailyWorkLogModalData((prevState) => ({
			...prevState,
			logDay: currentDay,
			dailyWork: record,
		}));
		setIsOpenDailyWorkLogModal((prevState) => !prevState);
	};
	const onTargetTitleClick = (record) => {
		setDailyWorkInfoModalData(record);
		setIsOpenDailyWorkInfoModal(true);
	};
	const { columns, headerRow } = getDailyWorkTableRowAndHeaderRow(
		dayjs(dataSearch.start, 'M-DD-YYYY'),
		onCalenderClick,
		onTargetTitleClick,
	);

	const {
		data: listDailyWorks = [],
		isLoading: isLoadingListDailyWorks,
		isError: isErrorListDailyWorks,
		refetch: reFetchListDailyWorks,
	} = useQuery(['getDailyWorks', dataSearch], ({ queryKey }) => getDailyWorks(queryKey[1]));

	// normalize data for table
	const tableData = useMemo(() => {
		const rows = listDailyWorks.map((item, index) => {
			const logs = item.DailyWorkLogs;
			let totalCompletedTasks = 0;
			logs.forEach((log) => {
				if (log.status === 'completed') {
					totalCompletedTasks += log.quantity;
				}
			});

			const row = {
				key: index + 1,
				...item,
				progress: `${totalCompletedTasks} / ${item.monthKey}`,
				totalResult: totalCompletedTasks,
				unit: item?.unit?.name,
			};
			// insert targetLogs to table
			logs.forEach((log) => {
				const targetDay = dayjs(log.reportDate || log.noticedDate).format('DD');
				const logStatus = log.status;
				const logQuantity = log.quantity;
				const logNoticed = log.noticedStatus;
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
	}, [listDailyWorks]);

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
		const element = document.getElementById(`daily_work_${+dayjs().format('DD')}`);
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
		const tableHeader = table.querySelector('th[colspan="6"]');
		if (!tableHeader) return;
		// reset style attribute
		tableHeader.style = '';
	}, [tableData, tableRef]);

	return (
		<>
			{isErrorListDailyWorks ? (
				<div>Có lỗi xảy ra</div>
			) : (
				<>
				<Table
					columns={columns}
					dataSource={tableData}
					bordered
					scroll={{ x: 'max-content' }}
					ref={tableRef}
					pagination={(tableData.length <= 1) ? false : true}
					loading={isLoadingListDailyWorks}
				/>
				{(tableData.length <= 1) 
					? <div className='text-center'>
						<h5 style={{color: '#adb5bd'}}>Chưa có nhiệm vụ nào</h5>
					</div> 
					: null}
				</>
			)}
			<ModalDailyWorkLog
				isOpen={isOpenDailyWorkLogModal}
				logDay={dailyWorkLogModalData.logDay}
				dailyWork={dailyWorkLogModalData.dailyWork}
				onOk={() => {
					setDailyWorkLogModalData({ logDay: moment(), dailyWork: null });
					setIsOpenDailyWorkLogModal(false);
				}}
				onCancel={() => {
					setDailyWorkLogModalData({ logDay: moment(), dailyWork: null });
					setIsOpenDailyWorkLogModal(false);
				}}
				reFetchTable={async () => {
					setCanScroll(false);
					await reFetchListDailyWorks();
				}}
			/>

			<ModalDailyWorkInfo
				dailyWork={dailyWorkInfoModalData}
				open={isOpenDailyWorkInfoModal}
				onOk={() => setIsOpenDailyWorkInfoModal(false)}
			/>
		</>
	);
};

export default DailyWorkTable;
