import React from 'react';
import PropTypes from 'prop-types';
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
	STATUS,
} from '../../../utils/constants';
import Icon from '../../../components/icon/Icon';
import Progress from '../../../components/bootstrap/Progress';
import useDarkMode from '../../../hooks/useDarkMode';

const minWidth100 = {
	minWidth: 100,
};

const ExpandRow = ({ subtasks, handleUpdateStatus }) => {
	const { themeStatus } = useDarkMode();

	return (
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
					<th className='text-center'>Thời gian dự tính</th>
					<th className='text-center'>Hạn ngày hoàn thành</th>
					<th className='text-center'>Giá trị KPI</th>
					<th className='text-center'>Tỉ trọng hoàn thành</th>
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
							{subTaskItem.name}
						</td>
						<td className='text-center'>{subTaskItem?.user?.name}</td>
						<td>
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
									{Object.keys(STATUS).map((key) => (
										<DropdownItem
											key={key}
											onClick={() =>
												handleUpdateStatus(STATUS[key].value, subTaskItem)
											}>
											<div>
												<Icon icon='Circle' color={STATUS[key].color} />
												{STATUS[key].name}
											</div>
										</DropdownItem>
									))}
								</DropdownMenu>
							</Dropdown>
						</td>
						<td className='text-center'>
							<span
								className='text-nowrap'
								style={{
									background: '#569CFB',
									color: '#fff',
									padding: '5px 30px 5px 30px',
									borderRadius: '2rem',
								}}>
								{moment(
									`${subTaskItem.estimate_date} ${subTaskItem.estimate_time}`,
								).format('DD-MM-YYYY, HH:mm')}
							</span>
						</td>
						<td className='text-center'>
							<span
								className='text-nowrap'
								style={{
									background: '#A25DDC',
									color: '#fff',
									padding: '5px 30px 5px 30px',
									borderRadius: '2rem',
								}}>
								{moment(
									`${subTaskItem.deadline_date} ${subTaskItem.deadline_time}`,
								).format('DD-MM-YYYY, HH:mm')}
							</span>
						</td>
						<td className='text-center'>{subTaskItem.kpi_value}</td>
						<td className='text-center' style={minWidth100}>
							<div className='d-flex align-items-center'>
								<div className='flex-shrink-0 me-3'>{`${75}%`}</div>
								<Progress
									className='flex-grow-1'
									isAutoColor
									value={75}
									style={{
										height: 10,
									}}
								/>
							</div>
						</td>
						<td className='text-center'>
							<div className='d-flex align-items-center'>
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
						colSpan={11}
						style={{
							borderLeft: '3px solid #D7A5FF',
						}}>
						<Button
							className='d-flex align-items-center cursor-pointer'
							style={{
								paddingLeft: 0,
							}}>
							<Icon size='lg' icon='PlusCircle' />
							<span className='mx-2'>Thêm mới</span>
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
	handleUpdateStatus: PropTypes.func,
};
ExpandRow.defaultProps = {
	// eslint-disable-next-line react/default-props-match-prop-types
	subtasks: null,
};

export default ExpandRow;
