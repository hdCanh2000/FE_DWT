import React, { useState } from 'react';
import Card, { CardBody } from '../../../components/bootstrap/Card';
import Icon from '../../../components/icon/Icon';
import Avatar from '../../../components/Avatar';
import { dataTable1 } from './dataTable';
import Button from '../../../components/bootstrap/Button';

const user = {
	id: 4,
	username: 'ryan',
	name: 'Ryan',
	surname: 'McGrath',
	position: 'Worker',
	src: '',
	srcSet: '',
	isOnline: false,
	color: 'info',
};

// eslint-disable-next-line react/prop-types
const RenderStatusTable = ({ status }) => {
	const _status =
		(status === 'Đã hoàn thành' && '#01C875') ||
		(status === 'Đang thực hiện' && '#FDAB3D') ||
		(status === 'Bế tắc' && '#E2445B');
	return (
		<td
			style={{
				background: `${_status}`,
			}}>
			<span
				style={{
					height: '100%',
					display: 'block',
					padding: '10px',
					color: '#fff',
				}}
				className='text-center block'>
				{status}
			</span>
		</td>
	);
};

// eslint-disable-next-line react/prop-types
const TaskDepartmentTable = ({ isFluid }) => {
	const [expandedRows, setExpandedRows] = useState([]);
	const [expandState, setExpandState] = useState({});

	const handleEpandRow = (event, userId) => {
		const currentExpandedRows = expandedRows;
		const isRowExpanded = currentExpandedRows.includes(userId);

		const obj = {};
		// eslint-disable-next-line no-unused-expressions
		isRowExpanded ? (obj[userId] = false) : (obj[userId] = true);
		setExpandState(obj);

		const newExpandedRows = isRowExpanded
			? currentExpandedRows.filter((id) => id !== userId)
			: currentExpandedRows.concat(userId);

		setExpandedRows(newExpandedRows);
	};

	return (
		<Card stretch={isFluid}>
			<CardBody className='table-responsive' isScrollable={isFluid}>
				<table className='table table-task table-modern mt-4'>
					<thead>
						<tr className='bg-white'>
							<th style={{ color: '#A562EC' }} className='cursor-pointer'>
								<div className='d-flex align-items-center'>
									<Icon size='sm' icon='CaretDownSquareFill' />
									<span className='mx-2 block'>Phần mềm DWT</span>
								</div>
							</th>
							<th className='text-center'>Số nhiệm vụ con</th>
							<th className='text-center'>Owner</th>
							<th className='text-center'>Trạng thái</th>
							<th className='text-center'>Thời gian thực hiện</th>
							<th className='text-center'>Tổng số đầu mục</th>
							<th className='text-center'>Tổng điểm KPI</th>
							<th className='text-center'>Tỉ trọng hoàn thành</th>
							<th>Ghi chú</th>
						</tr>
					</thead>
					<tbody>
						{dataTable1.map((taskItem) => (
							<>
								<tr key={taskItem.id}>
									<td
										style={{
											borderLeft: '3px solid #A562EC',
										}}>
										{taskItem.taskName}
									</td>
									<td style={{ color: '#569CFB' }} className='text-center'>
										<Button
											className='d-flex align-items-center justify-content-center cursor-pointer m-auto'
											onClick={(event) => handleEpandRow(event, taskItem.id)}>
											<Icon
												color='info'
												size='sm'
												icon={`${
													expandState[taskItem.id]
														? 'CaretUpFill'
														: 'CaretDownFill'
												}`}
											/>
											<span className='mx-2' style={{ color: '#0174EB' }}>
												{taskItem.subTaskCount}
											</span>
										</Button>
									</td>
									<td className='text-center'>
										<Avatar
											src={user.src}
											srcSet={user.srcSet}
											color={user.color}
											size={36}
										/>
									</td>
									<RenderStatusTable status={taskItem.status} />
									<td>
										<div className='d-flex align-items-center justify-content-center'>
											<span
												style={{
													background: '#A25DDC',
													color: '#fff',
													padding: '5px 0 5px 30px',
													borderTopLeftRadius: '2rem',
													borderBottomLeftRadius: '2rem',
													display: 'block',
												}}>
												{taskItem.dateStart} -
											</span>
											<span
												style={{
													background: '#333333',
													color: '#fff',
													padding: '5px 30px 5px 0',
													borderTopRightRadius: '2rem',
													borderBottomRightRadius: '2rem',
													display: 'block',
												}}>
												{taskItem.dateEnd}
											</span>
										</div>
									</td>
									<td className='text-center'>{taskItem.totalEntries}</td>
									<td className='text-center'>{taskItem.totalKPIPoint}</td>
									<td className='text-center'>{taskItem.percentComplete}%</td>
									<td>{taskItem.note}</td>
								</tr>
								<tr>
									<td colSpan='10'>
										{expandedRows.includes(taskItem.id) && (
											<table className='table sub-table table-modern'>
												<thead>
													<tr>
														<th
															style={{
																color: '#A562EC',
																paddingLeft: 0,
															}}>
															<div className='d-flex align-items-center'>
																<span className='mx-2 block'>
																	Tên đầu việc
																</span>
															</div>
														</th>
														<th>STT</th>
														<th className='text-center'>Owner</th>
														<th className='text-center'>Trạng thái</th>
														<th className='text-center'>
															Thời gian thực hiện
														</th>
														<th className='text-center'>Số điểm KPI</th>
														<th className='text-center'>
															Tỉ trọng hoàn thành
														</th>
														<th className='text-center'>
															Tên n.vụ phòng ban
														</th>
														<th className='text-center'>Đầu mục</th>
														<th className='text-center'>
															Thứ tự ưu tiên
														</th>
														<th className='text-center'>Báo cáo</th>
													</tr>
												</thead>
												<tbody>
													{taskItem.subTaskList.map(
														(subTaskItem, index) => (
															<tr key={subTaskItem.id}>
																<td
																	style={{
																		borderLeft:
																			'2px solid #A562EC',
																	}}>
																	{subTaskItem.taskName}
																</td>
																<td
																	style={{ color: '#569CFB' }}
																	className='text-center'>
																	<div className='d-flex align-items-center justify-content-center'>
																		<span className='mx-2'>
																			{index + 1}
																		</span>
																	</div>
																</td>
																<td className='text-center'>
																	<Avatar
																		src={user.src}
																		srcSet={user.srcSet}
																		color={user.color}
																		size={36}
																	/>
																</td>
																<RenderStatusTable
																	status={subTaskItem.status}
																/>
																<td className='text-center'>
																	<span
																		style={{
																			background: '#A25DDC',
																			color: '#fff',
																			padding:
																				'5px 30px 5px 30px',
																			borderRadius: '2rem',
																			display: 'block',
																		}}>
																		{subTaskItem.date}
																	</span>
																</td>
																<td className='text-center'>
																	{subTaskItem.kpiPoint}
																</td>
																<td className='text-center'>
																	{subTaskItem.percentComplete}%
																</td>
																<td className='text-center'>
																	{
																		subTaskItem?.departmentTaskName
																	}
																</td>
																<td className='text-center'>
																	<span
																		style={{
																			padding: '10px 20px',
																			background: '#EDF6FD',
																			color: '#0073EA',
																			display: 'block',
																		}}>
																		{subTaskItem?.taskType}
																	</span>
																</td>
																<td className='text-center'>1</td>
																<td className='text-center'>
																	Cả phòng
																</td>
															</tr>
														),
													)}
													<tr>
														<td
															colSpan={11}
															style={{
																borderLeft: '3px solid #D7A5FF',
															}}>
															<Button
																className='d-flex align-items-center cursor-pointer'
																style={{ paddingLeft: 0 }}>
																<Icon size='lg' icon='PlusCircle' />
																<span className='mx-2'>
																	Thêm mới
																</span>
															</Button>
														</td>
													</tr>
												</tbody>
											</table>
										)}
									</td>
								</tr>
							</>
						))}
						<tr>
							<td
								colSpan={10}
								style={{
									borderLeft: '3px solid #D7A5FF',
								}}>
								<Button
									className='d-flex align-items-center cursor-pointer'
									style={{ paddingLeft: 0 }}>
									<Icon size='lg' icon='PlusCircle' />
									<span className='mx-2'>Thêm mới</span>
								</Button>
							</td>
						</tr>
					</tbody>
				</table>
				<table className='table table-task table-modern mt-4'>
					<thead>
						<tr className='bg-white'>
							<th style={{ color: '#01C973' }} className='cursor-pointer'>
								<div className='d-flex align-items-center'>
									<Icon size='sm' icon='CaretDownSquareFill' />
									<span className='mx-2 block'>Phần mềm DWT</span>
								</div>
							</th>
							<th className='text-center'>Số nhiệm vụ con</th>
							<th className='text-center'>Owner</th>
							<th className='text-center'>Trạng thái</th>
							<th className='text-center'>Thời gian thực hiện</th>
							<th className='text-center'>Tổng số đầu mục</th>
							<th className='text-center'>Tổng điểm KPI</th>
							<th className='text-center'>Tỉ trọng hoàn thành</th>
							<th>Ghi chú</th>
						</tr>
					</thead>
					<tbody>
						{dataTable1.map((taskItem) => (
							<>
								<tr key={taskItem.id}>
									<td
										style={{
											borderLeft: '3px solid #01C973',
										}}>
										{taskItem.taskName}
									</td>
									<td style={{ color: '#569CFB' }} className='text-center'>
										<Button
											className='d-flex align-items-center justify-content-center cursor-pointer m-auto'
											onClick={(event) => handleEpandRow(event, taskItem.id)}>
											<Icon
												color='info'
												size='sm'
												icon={`${
													expandState[taskItem.id]
														? 'CaretUpFill'
														: 'CaretDownFill'
												}`}
											/>
											<span className='mx-2' style={{ color: '#0174EB' }}>
												{taskItem.subTaskCount}
											</span>
										</Button>
									</td>
									<td className='text-center'>
										<Avatar
											src={user.src}
											srcSet={user.srcSet}
											color={user.color}
											size={36}
										/>
									</td>
									<RenderStatusTable status={taskItem.status} />
									<td>
										<div className='d-flex align-items-center justify-content-center'>
											<span
												style={{
													background: '#01C973',
													color: '#fff',
													padding: '5px 0 5px 30px',
													borderTopLeftRadius: '2rem',
													borderBottomLeftRadius: '2rem',
													display: 'block',
												}}>
												{taskItem.dateStart} -
											</span>
											<span
												style={{
													background: '#333333',
													color: '#fff',
													padding: '5px 30px 5px 0',
													borderTopRightRadius: '2rem',
													borderBottomRightRadius: '2rem',
													display: 'block',
												}}>
												{taskItem.dateEnd}
											</span>
										</div>
									</td>
									<td className='text-center'>{taskItem.totalEntries}</td>
									<td className='text-center'>{taskItem.totalKPIPoint}</td>
									<td className='text-center'>{taskItem.percentComplete}%</td>
									<td>{taskItem.note}</td>
								</tr>
								<tr>
									<td colSpan='10'>
										{expandedRows.includes(taskItem.id) && (
											<table className='table sub-table table-modern'>
												<thead>
													<tr>
														<th
															style={{
																color: '#A562EC',
																paddingLeft: 0,
															}}>
															<div className='d-flex align-items-center'>
																<span className='mx-2 block'>
																	Tên đầu việc
																</span>
															</div>
														</th>
														<th>STT</th>
														<th className='text-center'>Owner</th>
														<th className='text-center'>Trạng thái</th>
														<th className='text-center'>
															Thời gian thực hiện
														</th>
														<th className='text-center'>Số điểm KPI</th>
														<th className='text-center'>
															Tỉ trọng hoàn thành
														</th>
														<th className='text-center'>
															Tên n.vụ phòng ban
														</th>
														<th className='text-center'>Đầu mục</th>
														<th className='text-center'>
															Thứ tự ưu tiên
														</th>
														<th className='text-center'>Báo cáo</th>
													</tr>
												</thead>
												<tbody>
													{taskItem.subTaskList.map(
														(subTaskItem, index) => (
															<tr key={subTaskItem.id}>
																<td
																	style={{
																		borderLeft:
																			'2px solid #A562EC',
																	}}>
																	{subTaskItem.taskName}
																</td>
																<td
																	style={{ color: '#569CFB' }}
																	className='text-center'>
																	<div className='d-flex align-items-center justify-content-center'>
																		<span className='mx-2'>
																			{index + 1}
																		</span>
																	</div>
																</td>
																<td className='text-center'>
																	<Avatar
																		src={user.src}
																		srcSet={user.srcSet}
																		color={user.color}
																		size={36}
																	/>
																</td>
																<RenderStatusTable
																	status={subTaskItem.status}
																/>
																<td className='text-center'>
																	<span
																		style={{
																			background: '#A25DDC',
																			color: '#fff',
																			padding:
																				'5px 30px 5px 30px',
																			borderRadius: '2rem',
																			display: 'block',
																		}}>
																		{subTaskItem.date}
																	</span>
																</td>
																<td className='text-center'>
																	{subTaskItem.kpiPoint}
																</td>
																<td className='text-center'>
																	{subTaskItem.percentComplete}%
																</td>
																<td className='text-center'>
																	{
																		subTaskItem?.departmentTaskName
																	}
																</td>
																<td className='text-center'>
																	<span
																		style={{
																			padding: '10px 20px',
																			background: '#EDF6FD',
																			color: '#0073EA',
																			display: 'block',
																		}}>
																		{subTaskItem?.taskType}
																	</span>
																</td>
																<td className='text-center'>1</td>
																<td className='text-center'>
																	Cả phòng
																</td>
															</tr>
														),
													)}
													<tr>
														<td
															colSpan={11}
															style={{
																borderLeft: '3px solid #99FFD3',
															}}>
															<Button
																className='d-flex align-items-center cursor-pointer'
																style={{ paddingLeft: 0 }}>
																<Icon size='lg' icon='PlusCircle' />
																<span className='mx-2'>
																	Thêm mới
																</span>
															</Button>
														</td>
													</tr>
												</tbody>
											</table>
										)}
									</td>
								</tr>
							</>
						))}
						<tr>
							<td
								colSpan={10}
								style={{
									borderLeft: '3px solid #99FFD3',
								}}>
								<Button
									className='d-flex align-items-center cursor-pointer'
									style={{ paddingLeft: 0 }}>
									<Icon size='lg' icon='PlusCircle' />
									<span className='mx-2'>Thêm mới</span>
								</Button>
							</td>
						</tr>
					</tbody>
				</table>
				<table className='table table-task table-modern mt-4'>
					<thead>
						<tr className='bg-white'>
							<th style={{ color: '#569CFB' }} className='cursor-pointer'>
								<div className='d-flex align-items-center'>
									<Icon size='sm' icon='CaretDownSquareFill' />
									<span className='mx-2 block'>Phần mềm DWT</span>
								</div>
							</th>
							<th className='text-center'>Số nhiệm vụ con</th>
							<th className='text-center'>Owner</th>
							<th className='text-center'>Trạng thái</th>
							<th className='text-center'>Thời gian thực hiện</th>
							<th className='text-center'>Tổng số đầu mục</th>
							<th className='text-center'>Tổng điểm KPI</th>
							<th className='text-center'>Tỉ trọng hoàn thành</th>
							<th>Ghi chú</th>
						</tr>
					</thead>
					<tbody>
						{dataTable1.map((taskItem) => (
							<>
								<tr key={taskItem.id}>
									<td
										style={{
											borderLeft: '3px solid #569CFB',
										}}>
										{taskItem.taskName}
									</td>
									<td style={{ color: '#569CFB' }} className='text-center'>
										<Button
											className='d-flex align-items-center justify-content-center cursor-pointer m-auto'
											onClick={(event) => handleEpandRow(event, taskItem.id)}>
											<Icon
												color='info'
												size='sm'
												icon={`${
													expandState[taskItem.id]
														? 'CaretUpFill'
														: 'CaretDownFill'
												}`}
											/>
											<span className='mx-2' style={{ color: '#0174EB' }}>
												{taskItem.subTaskCount}
											</span>
										</Button>
									</td>
									<td className='text-center'>
										<Avatar
											src={user.src}
											srcSet={user.srcSet}
											color={user.color}
											size={36}
										/>
									</td>
									<RenderStatusTable status={taskItem.status} />
									<td>
										<div className='d-flex align-items-center justify-content-center'>
											<span
												style={{
													background: '#569CFB',
													color: '#fff',
													padding: '5px 0 5px 30px',
													borderTopLeftRadius: '2rem',
													borderBottomLeftRadius: '2rem',
													display: 'block',
												}}>
												{taskItem.dateStart} -
											</span>
											<span
												style={{
													background: '#333333',
													color: '#fff',
													padding: '5px 30px 5px 0',
													borderTopRightRadius: '2rem',
													borderBottomRightRadius: '2rem',
													display: 'block',
												}}>
												{taskItem.dateEnd}
											</span>
										</div>
									</td>
									<td className='text-center'>{taskItem.totalEntries}</td>
									<td className='text-center'>{taskItem.totalKPIPoint}</td>
									<td className='text-center'>{taskItem.percentComplete}%</td>
									<td>{taskItem.note}</td>
								</tr>
								<tr>
									<td colSpan='10'>
										{expandedRows.includes(taskItem.id) && (
											<table className='table sub-table table-modern'>
												<thead>
													<tr>
														<th
															style={{
																color: '#A562EC',
																paddingLeft: 0,
															}}>
															<div className='d-flex align-items-center'>
																<span className='mx-2 block'>
																	Tên đầu việc
																</span>
															</div>
														</th>
														<th>STT</th>
														<th className='text-center'>Owner</th>
														<th className='text-center'>Trạng thái</th>
														<th className='text-center'>
															Thời gian thực hiện
														</th>
														<th className='text-center'>Số điểm KPI</th>
														<th className='text-center'>
															Tỉ trọng hoàn thành
														</th>
														<th className='text-center'>
															Tên n.vụ phòng ban
														</th>
														<th className='text-center'>Đầu mục</th>
														<th className='text-center'>
															Thứ tự ưu tiên
														</th>
														<th className='text-center'>Báo cáo</th>
													</tr>
												</thead>
												<tbody>
													{taskItem.subTaskList.map(
														(subTaskItem, index) => (
															<tr key={subTaskItem.id}>
																<td
																	style={{
																		borderLeft:
																			'2px solid #A562EC',
																	}}>
																	{subTaskItem.taskName}
																</td>
																<td
																	style={{ color: '#569CFB' }}
																	className='text-center'>
																	<div className='d-flex align-items-center justify-content-center'>
																		<span className='mx-2'>
																			{index + 1}
																		</span>
																	</div>
																</td>
																<td className='text-center'>
																	<Avatar
																		src={user.src}
																		srcSet={user.srcSet}
																		color={user.color}
																		size={36}
																	/>
																</td>
																<RenderStatusTable
																	status={subTaskItem.status}
																/>
																<td className='text-center'>
																	<span
																		style={{
																			background: '#A25DDC',
																			color: '#fff',
																			padding:
																				'5px 30px 5px 30px',
																			borderRadius: '2rem',
																			display: 'block',
																		}}>
																		{subTaskItem.date}
																	</span>
																</td>
																<td className='text-center'>
																	{subTaskItem.kpiPoint}
																</td>
																<td className='text-center'>
																	{subTaskItem.percentComplete}%
																</td>
																<td className='text-center'>
																	{
																		subTaskItem?.departmentTaskName
																	}
																</td>
																<td className='text-center'>
																	<span
																		style={{
																			padding: '10px 20px',
																			background: '#EDF6FD',
																			color: '#0073EA',
																			display: 'block',
																		}}>
																		{subTaskItem?.taskType}
																	</span>
																</td>
																<td className='text-center'>1</td>
																<td className='text-center'>
																	Cả phòng
																</td>
															</tr>
														),
													)}
													<tr>
														<td
															colSpan={11}
															style={{
																borderLeft: '3px solid #A8CDFF',
															}}>
															<Button
																className='d-flex align-items-center cursor-pointer'
																style={{ paddingLeft: 0 }}>
																<Icon size='lg' icon='PlusCircle' />
																<span className='mx-2'>
																	Thêm mới
																</span>
															</Button>
														</td>
													</tr>
												</tbody>
											</table>
										)}
									</td>
								</tr>
							</>
						))}
						<tr>
							<td
								colSpan={10}
								style={{
									borderLeft: '3px solid #A8CDFF',
								}}>
								<Button
									className='d-flex align-items-center cursor-pointer'
									style={{ paddingLeft: 0 }}>
									<Icon size='lg' icon='PlusCircle' />
									<span className='mx-2'>Thêm mới</span>
								</Button>
							</td>
						</tr>
					</tbody>
				</table>
			</CardBody>
		</Card>
	);
};

export default TaskDepartmentTable;
