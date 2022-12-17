/* eslint-disable */
import React from 'react';
import dayjs from 'dayjs';
import moment from 'moment';

const calenderRender = (text, record, currentDay, onCalenderClick) => {
	const dayName = moment(currentDay).format('ddd');
	const isWeekend = dayName === 'Sat' || dayName === 'Sun';
	const bgColor = dayName === 'Sat' ? '#fff2cc' : dayName === 'Sun' ? '#ff9f9f' : 'white';

	if (record.key === 'STT') {
		const [day, dayNameText] = text.split(' ');
		return {
			props: {
				style: { backgroundColor: bgColor },
				id: day,
			},
			children: (
				<div className='text-center' style={{ width: 28, background: bgColor }}>
					<div>{day}</div>
					<div>{dayNameText}</div>
				</div>
			),
		};
	}
	const completedColor = '#c5e0b3';
	const inProgressColor = '#ffc000';
	const warningColor = 'red';
	let textToRender = text;
	let bgColorToRender = bgColor;
	if (text) {
		const { logStatus, logQuantity, logNoticed } = JSON.parse(text);
		const isCompleted = logStatus === 'completed';
		const isWarning = !!logNoticed;
		if (isWarning) {
			bgColorToRender = warningColor;
			textToRender = `! ${logQuantity || ''}`;
		} else if (isCompleted) {
			bgColorToRender = completedColor;
			textToRender = logQuantity || '';
		} else {
			bgColorToRender = inProgressColor;
			textToRender = logQuantity || '';
		}
	}
	return {
		props: {
			style: {
				backgroundColor: bgColorToRender,
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

export const getWorkTrackTableRowAndHeaderRow = (filterDay, onCalenderClick) => {
	if (!filterDay) filterDay = dayjs();
	const month = filterDay.month() + 1;
	const year = filterDay.year();
	const totalDays = filterDay.daysInMonth();
	const columns = [
		{
			title: 'MỤC TIÊU NHIỆM VỤ (THÁNG)',
			colSpan: 9,
			dataIndex: 'key',
			fixed: 'left',
			render: (text, record) => {
				if (record.key === 'STT') {
					return <b>{text}</b>;
				}
				return text;
			},
		},
		{
			title: '',
			colSpan: 0,
			dataIndex: 'name',
			fixed: 'left',
			render: (text, record) => {
				if (record.key === 'STT') {
					return <b>{text}</b>;
				}
				return text;
			},
		},
		{
			title: '',
			colSpan: 0,
			dataIndex: 'description',
			render: (text, record) => {
				if (record.key === 'STT') {
					return <b>{text}</b>;
				}
				return text;
			},
		},
		{
			title: '',
			colSpan: 0,
			dataIndex: 'deadline',
			render: (text, record) => {
				if (record.key === 'STT') {
					return <b>{text}</b>;
				}
				return text;
			},
		},
		{
			title: '',
			colSpan: 0,
			dataIndex: 'quantity',
			render: (text, record) => {
				if (record.key === 'STT') {
					return <b>{text}</b>;
				}
				return text;
			},
		},
		{
			title: '',
			colSpan: 0,
			dataIndex: 'unit',
			render: (text, record) => {
				if (record.key === 'STT') {
					return <b>{text}</b>;
				}
				return text;
			},
		},
		{
			title: '',
			colSpan: 0,
			dataIndex: 'manDay',
			render: (text, record) => {
				if (record.key === 'STT') {
					return <b>{text}</b>;
				}
				return text;
			},
		},
		{
			title: '',
			colSpan: 0,
			dataIndex: 'manDayEstimated',
			render: (text, record) => {
				if (record.key === 'STT') {
					return <b>{text}</b>;
				}
				return text;
			},
		},
		{
			title: '',
			colSpan: 0,
			dataIndex: 'executionPlan',
			render: (text, record) => {
				if (record.key === 'STT') {
					return <b>{text}</b>;
				}
				return text;
			},
		},
		{
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
			title: '',
			colSpan: 0,
			dataIndex: `day${day}`,
			render: (text, record) => calenderRender(text, record, currentDay, onCalenderClick),
		});
	}
	columns.push({
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
