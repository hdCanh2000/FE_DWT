import React from 'react';
import { TimelineItem } from '../../../components/extras/Timeline';

const renderTextByType = (props) => {
	const { type, username, prevStatus, nextStatus, taskName } = props;
	if (type === 1) {
		return (
			<>
				<span className='text-success fw-bold' style={{ fontSize: 14 }}>
					{username}
				</span>{' '}
				đã chuyển trạng thái công việc{' '}
				<span className='text-danger fw-bold' style={{ fontSize: 14 }}>
					{`${taskName}`}
				</span>{' '}
				từ{' '}
				<span className='text-primary fw-bold' style={{ fontSize: 14 }}>
					{prevStatus}
				</span>{' '}
				sang{' '}
				<span className='text-info fw-bold' style={{ fontSize: 14 }}>
					{nextStatus}
				</span>
			</>
		);
	}
	if (type === 2) {
		return (
			<>
				<span className='text-success fw-bold' style={{ fontSize: 14 }}>
					{username}
				</span>{' '}
				đã{' '}
				<span className='text-primary fw-bold' style={{ fontSize: 14 }}>
					{nextStatus}
				</span>{' '}
				công việc{' '}
				<span className='text-danger fw-bold' style={{ fontSize: 14 }}>
					{taskName}
				</span>
			</>
		);
	}
	return null;
};

const RelatedActionCommonItem = (props) => {
	// eslint-disable-next-line react/prop-types
	const { time } = props;
	return (
		<TimelineItem key={time} className='align-items-start' label={time} color='primary'>
			{renderTextByType(props)}
		</TimelineItem>
	);
};

export default RelatedActionCommonItem;
