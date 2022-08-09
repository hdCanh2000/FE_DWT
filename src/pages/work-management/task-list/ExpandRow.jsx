import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import moment from 'moment';
import classNames from 'classnames';
import Dropdown, {
	DropdownItem,
	DropdownMenu,
	DropdownToggle,
} from '../../../components/bootstrap/Dropdown';
import Button from '../../../components/bootstrap/Button';
import {
	formatColorPriority,
	formatColorStatus,
	FORMAT_TASK_STATUS,
	TASK_STATUS_MANAGE,
} from '../../../utils/constants';
import Icon from '../../../components/icon/Icon';
import Progress from '../../../components/bootstrap/Progress';
import useDarkMode from '../../../hooks/useDarkMode';
import { calcProgressSubtask } from '../../../utils/function';
import TaskDetailForm from '../TaskDetail/TaskDetailForm/TaskDetailForm';

const minWidth100 = {
	minWidth: 100,
};

const ExpandRow = ({ subtasks, taskId, handleUpdateStatus }) => {
	const { themeStatus } = useDarkMode();
	const [task, setTask] = useState({});
	const [editModalStatus, setEditModalStatus] = useState(false);
	const [idEdit, setIdEdit] = useState(0);
	const [newWork, setNewWork] = React.useState([]);
	const [title, setTitle] = useState();
	// Handle
	const handleOpenModal = (items, titles) => {
		setEditModalStatus(true);
		setIdEdit(items.id);
		setTitle(titles);
	};

	return (
		<>
			<table className='table sub-table table-modern'>
				<thead>
					<tr>
						<th
							style={{
								color: '#A562EC',
								paddingLeft: 0,
							}}>
							<div className='d-flex align-items-center'>
								<span className='mx-2 block'>Tên đầu việc</span>
							</div>
						</th>
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
							<td
								style={{
									borderLeft: '2px solid #A562EC',
								}}>
								<Link
									className='text-underline'
									to={`/cong-viec-${subTaskItem.task_id}/dau-viec/${subTaskItem?.id}`}>
									{subTaskItem?.name}
								</Link>
							</td>
							<td className='text-center'>{subTaskItem?.user?.name}</td>
							<td className='text-center'>
								<Dropdown>
									<DropdownToggle hasIcon={false}>
										<Button
											isLink
											color={formatColorStatus(subTaskItem.status)}
											icon='Circle'
											className='text-nowrap'>
											{FORMAT_TASK_STATUS(subTaskItem.status)}
										</Button>
									</DropdownToggle>
									<DropdownMenu>
										{Object.keys(TASK_STATUS_MANAGE).map((key) => (
											<DropdownItem
												key={key}
												onClick={() =>
													handleUpdateStatus(
														TASK_STATUS_MANAGE[key].value,
														subTaskItem,
													)
												}>
												<div>
													<Icon
														icon='Circle'
														color={TASK_STATUS_MANAGE[key].color}
													/>
													{TASK_STATUS_MANAGE[key].name}
												</div>
											</DropdownItem>
										))}
									</DropdownMenu>
								</Dropdown>
							</td>
							<td className='text-center'>
								{moment(`${subTaskItem.deadline_date}`).format('DD-MM-YYYY')}
							</td>
							<td className='text-center'>{subTaskItem.kpi_value}</td>
							<td className='text-center' style={minWidth100}>
								<div className='d-flex align-items-center'>
									<div className='flex-shrink-0 me-3'>{`${calcProgressSubtask(
										subTaskItem,
									)}%`}</div>
									<Progress
										className='flex-grow-1'
										isAutoColor
										value={calcProgressSubtask(subTaskItem)}
										style={{
											height: 10,
										}}
									/>
								</div>
							</td>
							<td className='text-center'>
								<div className='d-flex align-items-center justify-content-center'>
									<span
										style={{
											paddingRight: '1rem',
											paddingLeft: '1rem',
										}}
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
						<td
							colSpan={12}
							style={{
								borderLeft: '3px solid #D7A5FF',
							}}>
							<Button
								className='d-flex align-items-center cursor-pointer'
								style={{
									paddingLeft: 0,
								}}
								onClick={() => handleOpenModal(0, 'add')}>
								<Icon size='lg' icon='PlusCircle' />
								<span className='mx-2'>Thêm mới</span>
							</Button>
						</td>
					</tr>
				</tbody>
			</table>
			<TaskDetailForm
				title={title}
				setTask={setTask}
				task={task}
				setEditModalStatus={setEditModalStatus}
				editModalStatus={editModalStatus}
				id={parseInt(taskId, 10)}
				idEdit={idEdit}
				newWork={newWork}
				setNewWork={setNewWork}
			/>
		</>
	);
};

ExpandRow.propTypes = {
	// eslint-disable-next-line react/forbid-prop-types, react/require-default-props
	subtasks: PropTypes.array.isRequired,
	// eslint-disable-next-line react/require-default-props
	handleUpdateStatus: PropTypes.func,
	taskId: PropTypes.number,
};
ExpandRow.defaultProps = {
	// eslint-disable-next-line react/default-props-match-prop-types
	subtasks: null,
	taskId: null,
};

export default ExpandRow;
