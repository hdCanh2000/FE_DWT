/* eslint no-nested-ternary: 0 */
import React, { useEffect, useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { DatePicker, Skeleton, Table } from 'antd';
import locale from 'antd/es/date-picker/locale/vi_VN';
import moment from 'moment';
import dayjs from 'dayjs';
import scrollIntoView from 'scroll-into-view';
import Page from '../../layout/Page/Page';
import PageWrapper from '../../layout/PageWrapper/PageWrapper';
import Card, { CardBody, CardLabel, CardTitle } from '../../components/bootstrap/Card';
import { getWorkTrackTableRowAndHeaderRow } from './workTrackTableConfig';
import { getListTarget, getUserDetail } from './services';
import ModalTargetLog from './ModalTargetLog';
import ModalTargetInfo from './ModalTargetInfo';

const DailyWorkTrackingUser = () => {
	const params = useParams();
	const { id } = params;
	const [date, setDate] = useState(dayjs());
	const [isOpenTargetLogModal, setIsOpenTargetLogModal] = useState(false);
	const [isOpenTargetInfoModal, setIsOpenTargetInfoModal] = useState(false);
	const [canScroll, setCanScroll] = useState(true);
	// set default date to today
	const [targetLogModalData, setTargetLogModalData] = useState({ logDay: moment(), target: {} });
	const [targetInfoModalData, setTargetInfoModalData] = useState({});
	const [dataSearch, setDataSearch] = useState({
		start: `${dayjs().month() + 1}-01-${dayjs().year()}`,
		end: `${dayjs().month() + 1}-${dayjs().daysInMonth()}-${dayjs().year()}`,
		q: '',
		userId: id,
	});
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
		date,
		onCalenderClick,
		onTargetTitleClick,
	);
	const {
		data: listTarget = [],
		isLoading: isLoadingListTarget,
		isError: isErrorListTarget,
		refetch: reFetchListTarget,
	} = useQuery(['getListTarget', dataSearch], ({ queryKey }) => getListTarget(queryKey[1]));
	// get user from api
	const {
		data: user = {},
		isLoading: isLoadingUser,
		isError: isErrorUser,
	} = useQuery(['getUserDetail', id], ({ queryKey }) => getUserDetail(queryKey[1]));
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
	}, [listTarget, headerRow]);
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
	}, [tableData, canScroll, dataSearch.start]);
	const handleChangeMonth = (updatedDate) => {
		setDate(updatedDate);
		setDataSearch({
			...dataSearch,
			start: `${updatedDate.month() + 1}-01-${updatedDate.year()}`,
			end: `${updatedDate.month() + 1}-${updatedDate.daysInMonth()}-${updatedDate.year()}`,
		});
	};

	return (
		<PageWrapper title='Danh sách công việc'>
			<Page container='fluid'>
				<Card className='w-100'>
					<div style={{ margin: '24px 24px 0' }}>
						<div className='w-100 d-flex justify-content-between align-items-center'>
							{/* DONT REMOVE THIS EMPTY DIV IT IS FOR ALIGNING THE HEADER */}
							<div />
							<div>
								<CardTitle>
									<CardLabel className='d-flex justify-content-center'>
										NHẬT TRÌNH CÔNG VIỆC
									</CardLabel>
								</CardTitle>
								<div className='text-center'>
									Vị trí:{' '}
									{isLoadingUser
										? '...'
										: isErrorUser
										? '_'
										: user?.department?.name}
								</div>
							</div>
							<div className='text-end'>
								<div>
									Người thực hiện:{' '}
									{isLoadingUser ? '...' : isErrorUser ? '_' : user.name}
								</div>
								<div>
									Tháng:{' '}
									<DatePicker.MonthPicker
										format='MM/YYYY'
										locale={locale}
										style={{ width: 100 }}
										value={date}
										onChange={handleChangeMonth}
									/>
								</div>
							</div>
						</div>
						<CardBody>
							<div className='control-pane'>
								<div className='control-section'>
									{isLoadingListTarget ? (
										<Skeleton />
									) : isErrorListTarget ? (
										<div>Xảy ra lỗi khi lấy dữ liệu</div>
									) : (
										<Table
											columns={columns}
											dataSource={tableData}
											bordered
											scroll={{ x: 'max-content' }}
										/>
									)}
								</div>
							</div>
						</CardBody>
					</div>
				</Card>
			</Page>

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
		</PageWrapper>
	);
};
export default DailyWorkTrackingUser;
