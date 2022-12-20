/* eslint no-nested-ternary: 0 */
/* eslint no-plusplus: 0 */
/* eslint import/prefer-default-export: 0 */
import React from 'react';
import dayjs from 'dayjs';
import moment from 'moment';

const calenderRender = (text, record, currentDay, onCalenderClick) => {
	const dayName = moment(currentDay).format('ddd');
	const isWeekend = dayName === 'Sat' || dayName === 'Sun';
	const saturdayCellStyle = {
		backgroundColor: 'rgba(251,188,6,.1)',
		borderColor: 'rgba(251,188,6,.2)',
		color: '#e4aa04',
	};
	const sundayCellStyle = {
		color: '#52cbcb',
		backgroundColor: 'rgba(102,209,209,.1)',
		borderColor: 'rgba(102,209,209,.2)',
	};
	const headerCellStyle =
		dayName === 'Sat' ? saturdayCellStyle : dayName === 'Sun' ? sundayCellStyle : {};

	if (record.key === 'STT') {
		const [day, dayNameText] = text.split(' ');
		return {
			props: {
				style: headerCellStyle,
				id: day,
			},
			children: (
				<div className='text-center' style={{ width: 28 }}>
					<div>{day}</div>
					<div>{dayNameText}</div>
				</div>
			),
		};
	}
	const completedStyle = {
		backgroundColor: 'rgba(5,163,74,.1)',
		borderColor: 'rgba(5,163,74,.2)',
		color: '#048a3f',
	};
	const inProgressStyle = {
		backgroundColor: '#fff',
	};
	const warningStyle = {
		backgroundColor: 'rgba(101,113,255,.1)',
		borderColor: 'rgba(101,113,255,.2)',
		color: '#4c59ff',
	};
	let textToRender = text;
	let cellStyle = headerCellStyle;
	if (text) {
		const { logStatus, logQuantity, logNoticed } = JSON.parse(text);
		const isCompleted = logStatus === 'completed';
		const isWarning = !!logNoticed;
		if (isCompleted) {
			cellStyle = completedStyle;
			textToRender = logQuantity || '';
		} else if (isWarning && !isCompleted) {
			cellStyle = warningStyle;
			textToRender = `! ${logQuantity || ''}`;
		} else {
			cellStyle = inProgressStyle;
			textToRender = logQuantity || '';
		}
	}
	return {
		props: {
			style: {
				...cellStyle,
				cursor: isWeekend ? 'not-allowed' : 'pointer',
			},
			onClick: () => {
				if (!isWeekend) {
					onCalenderClick(record, currentDay);
				}
			},
		},
		children: <div className='text-center'>{textToRender}</div>,
	};
};

export const getWorkTrackTableRowAndHeaderRow = (
	filterDay,
	onCalenderClick,
	onTargetTitleClick,
) => {
	if (!filterDay) filterDay = dayjs();
	const month = filterDay.month() + 1;
	const year = filterDay.year();
	const totalDays = filterDay.daysInMonth();
	const columns = [
		{
			key: 'STT',
			title: 'MỤC TIÊU NHIỆM VỤ (THÁNG)',
			colSpan: 9,
			dataIndex: 'key',
			fixed: 'left',
			render: (text, record) => {
				if (record.key === 'STT') {
					return <b>{text}</b>;
				}
				return {
					props: {
						onClick: () => onTargetTitleClick(record),
						style: { cursor: 'pointer' },
					},
					children: <div>{text}</div>,
				};
			},
		},
		{
			key: 'name',
			title: '',
			colSpan: 0,
			dataIndex: 'name',
			fixed: 'left',
			render: (text, record) => {
				if (record.key === 'STT') {
					return <b>{text}</b>;
				}
				return {
					props: {
						onClick: () => onTargetTitleClick(record),
						style: { cursor: 'pointer' },
					},
					children: <div>{text}</div>,
				};
			},
		},
		{
			key: 'description',
			title: '',
			colSpan: 0,
			dataIndex: 'description',
			render: (text, record) => {
				if (record.key === 'STT') {
					return <b>{text}</b>;
				}
				return {
					props: {
						onClick: () => onTargetTitleClick(record),
						style: { cursor: 'pointer' },
					},
					children: <div>{text}</div>,
				};
			},
		},
		{
			key: 'deadline',
			title: '',
			colSpan: 0,
			dataIndex: 'deadline',
			render: (text, record) => {
				if (record.key === 'STT') {
					return <b>{text}</b>;
				}
				return {
					props: {
						onClick: () => onTargetTitleClick(record),
						style: { cursor: 'pointer' },
					},
					children: <div>{text}</div>,
				};
			},
		},
		{
			key: 'quantity',
			title: '',
			colSpan: 0,
			dataIndex: 'quantity',
			render: (text, record) => {
				if (record.key === 'STT') {
					return <b>{text}</b>;
				}
				return {
					props: {
						onClick: () => onTargetTitleClick(record),
						style: { cursor: 'pointer' },
					},
					children: <div>{text}</div>,
				};
			},
		},
		{
			key: 'unit',
			title: '',
			colSpan: 0,
			dataIndex: 'unit',
			render: (text, record) => {
				if (record.key === 'STT') {
					return <b>{text}</b>;
				}
				return {
					props: {
						onClick: () => onTargetTitleClick(record),
						style: { cursor: 'pointer' },
					},
					children: <div>{text}</div>,
				};
			},
		},
		{
			key: 'manDay',
			title: '',
			colSpan: 0,
			dataIndex: 'manDay',
			render: (text, record) => {
				if (record.key === 'STT') {
					return <b>{text}</b>;
				}
				return {
					props: {
						onClick: () => onTargetTitleClick(record),
						style: { cursor: 'pointer' },
					},
					children: <div>{text}</div>,
				};
			},
		},
		{
			key: 'manDayEstimated',
			title: '',
			colSpan: 0,
			dataIndex: 'manDayEstimated',
			render: (text, record) => {
				if (record.key === 'STT') {
					return <b>{text}</b>;
				}
				return {
					props: {
						onClick: () => onTargetTitleClick(record),
						style: { cursor: 'pointer' },
					},
					children: <div>{text}</div>,
				};
			},
		},
		{
			key: 'executionPlan',
			title: '',
			colSpan: 0,
			dataIndex: 'executionPlan',
			render: (text, record) => {
				if (record.key === 'STT') {
					return <b>{text}</b>;
				}
				return {
					props: {
						onClick: () => onTargetTitleClick(record),
						style: { cursor: 'pointer' },
					},
					children: <div>{text}</div>,
				};
			},
		},
		{
			key: 'day1',
			title: 'Nhật trình công việc',
			colSpan: totalDays,
			dataIndex: 'day1',
			render: (text, record) => {
				const currentDay = moment(`${year}-${month}-01`, 'YYYY-MM-DD');
				return calenderRender(text, record, currentDay, onCalenderClick);
			},
		},
	];
	for (let i = 0; i < totalDays - 1; i++) {
		const day = i + 2;
		const currentDay = moment(`${year}-${month}-${day}`, 'YYYY-MM-DD');
		columns.push({
			key: `day${day}`,
			title: '',
			colSpan: 0,
			dataIndex: `day${day}`,
			render: (text, record) => calenderRender(text, record, currentDay, onCalenderClick),
		});
	}
	columns.push({
		key: 'recentManDay',
		title: 'Đánh giá KQ/Chấm KPI',
		colSpan: 2,
		dataIndex: 'recentManDay', // this should be currentManDay but it's a typo in the API
		render: (text, record) => {
			if (record.key === 'STT') {
				return <b>{text}</b>;
			}
			return text;
		},
	});
	columns.push({
		key: 'managerComment',
		title: '',
		colSpan: 0,
		dataIndex: 'managerComment',
		render: (text, record) => {
			if (record.key === 'STT') {
				return <b>{text}</b>;
			}
			return text;
		},
	});

	const headerRow = {
		key: 'STT',
		name: 'Mục tiêu/Nhiệm vụ',
		description: 'Diễn giải',
		deadline: 'Thời hạn',
		quantity: 'SL',
		unit: 'DVT',
		manDay: '~ MD',
		manDayEstimated: 'KQT MD',
		executionPlan: 'KHTT (nêu có)',
		recentManDay: 'MD',
		managerComment: 'Ý kiến',
	};
	for (let i = 0; i < totalDays; i++) {
		const dayName = moment(`${year}-${month}-${i + 1}`, 'YYYY-MM-DD').format('ddd');
		headerRow[`day${i + 1}`] = `${i + 1} ${dayName}`;
	}

	return { columns, headerRow };
};
