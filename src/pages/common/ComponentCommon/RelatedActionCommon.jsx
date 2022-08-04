import React from 'react';
import PropTypes from 'prop-types';
import Timeline, { TimelineItem } from '../../../components/extras/Timeline';

const renderTextByType = (props) => {
	const { type, username, id, prevStatus, nextStatus, taskName } = props;
	if (type === 1) {
		return (
			<>
				<span className='text-success fw-bold' style={{ fontSize: 14 }}>
					{username}
				</span>{' '}
				đã chuyển trạng thái công việc{' '}
				<span className='text-danger fw-bold' style={{ fontSize: 14 }}>
					{`#${id}`}
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
	const { key, time } = props;
	return (
		<TimelineItem key={key} className='align-items-center' label={time} color='primary'>
			{renderTextByType(props)}
		</TimelineItem>
	);
};

const RelatedActionCommon = (props) => {
	const { data } = props;
	return (
		<Timeline>
			{data?.map((item) => (
				<RelatedActionCommonItem
					key={item?.id}
					type={item?.type}
					time={item?.time}
					username={item?.user?.name}
					id={item?.task_id}
					taskName={item?.task_name}
					prevStatus={item?.prev_status}
					nextStatus={item?.next_status}
					{...item}
				/>
			))}
		</Timeline>
	);
};

RelatedActionCommon.propTypes = {
	// eslint-disable-next-line react/forbid-prop-types, react/require-default-props
	data: PropTypes.array,
};
RelatedActionCommon.defaultProps = {
	data: [],
};

export default RelatedActionCommon;
