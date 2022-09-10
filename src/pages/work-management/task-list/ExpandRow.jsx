import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import moment from 'moment';
import classNames from 'classnames';
import Button from '../../../components/bootstrap/Button';
import {
	formatColorPriority,
	formatColorStatus,
	FORMAT_TASK_STATUS,
} from '../../../utils/constants';
import Icon from '../../../components/icon/Icon';
import Progress from '../../../components/bootstrap/Progress';
import useDarkMode from '../../../hooks/useDarkMode';
import { demoPages } from '../../../menu';

const minWidth100 = {
	minWidth: 100,
};

const ExpandRow = ({ subtasks, onOpenModal, taskId }) => {
	const { themeStatus } = useDarkMode();
	return (
		<table className='table table-modern'>
			<thead>
				<tr>
					<th>Tên đầu việc</th>
					<th className='text-center'>Nhân viên phụ trách</th>
					<th className='text-center'>Trạng thái</th>
					<th className='text-center'>Hạn ngày hoàn thành</th>
					<th className='text-center'>Giá trị KPI</th>
					<th className='text-center'>Tiến độ</th>
					<th className='text-center'>Thứ tự ưu tiên</th>
				</tr>
			</thead>
			<tbody>
				{subtasks?.map((subTaskItem) => (
					<tr key={subTaskItem.id}>
						<td>
							<Link
								className='text-underline'
								to={`${demoPages.jobsPage.subMenu.mission.path}/dau-viec/${subTaskItem?.id}`}>
								{subTaskItem?.name}
							</Link>
						</td>
						<td className='text-center'>{subTaskItem?.users[0]?.name}</td>
						<td className='text-center'>
							<Button
								isLink
								color={formatColorStatus(subTaskItem.status)}
								icon='Circle'
								className='text-nowrap'>
								{FORMAT_TASK_STATUS(subTaskItem.status)}
							</Button>
						</td>
						<td className='text-center'>
							{moment(`${subTaskItem.deadlineDate}`).format('DD-MM-YYYY')}
						</td>
						<td className='text-center'>{subTaskItem.kpiValue}</td>
						<td className='text-center' style={minWidth100}>
							<div className='d-flex align-items-center'>
								<div className='flex-shrink-0 me-3'>{`${subTaskItem.progress}%`}</div>
								<Progress
									className='flex-grow-1'
									isAutoColor
									value={subTaskItem.progress}
									style={{ height: 10 }}
								/>
							</div>
						</td>
						<td className='text-center'>
							<div className='d-flex align-items-center justify-content-center'>
								<span
									style={{ paddingRight: '1rem', paddingLeft: '1rem' }}
									className={classNames(
										'badge',
										'border border-2',
										[`border-${themeStatus}`],
										'bg-success',
										'pt-2 pb-2 me-2',
										`bg-${formatColorPriority(subTaskItem.priority)}`,
									)}>
									<span className=''>{`Cấp ${subTaskItem.priority}`}</span>
								</span>
							</div>
						</td>
					</tr>
				))}
				<tr>
					<td colSpan={12}>
						<Button
							className='d-flex align-items-center cursor-pointer'
							style={{ paddingLeft: 0 }}
							onClick={() => onOpenModal(taskId)}>
							<Icon size='lg' icon='PlusCircle' />
							<span className='mx-2'>Thêm đầu việc</span>
						</Button>
					</td>
				</tr>
			</tbody>
		</table>
	);
};

ExpandRow.propTypes = {
	// eslint-disable-next-line react/forbid-prop-types, react/require-default-props
	subtasks: PropTypes.array.isRequired,
	// eslint-disable-next-line react/require-default-props
	// handleUpdateStatus: PropTypes.func,
	// eslint-disable-next-line react/require-default-props
	onOpenModal: PropTypes.func,
	taskId: PropTypes.number,
};
ExpandRow.defaultProps = {
	// eslint-disable-next-line react/default-props-match-prop-types
	subtasks: null,
	taskId: null,
};

export default ExpandRow;
