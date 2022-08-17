import React, { useState } from 'react';
import classNames from 'classnames';
import Card, {
	CardActions,
	CardBody,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../../../components/bootstrap/Card';
import Button from '../../../components/bootstrap/Button';
import Dropdown, {
	DropdownItem,
	DropdownMenu,
	DropdownToggle,
} from '../../../components/bootstrap/Dropdown';
import Icon from '../../../components/icon/Icon';
import data from '../../../common/data/dummyEventsData';
import EVENT_STATUS from '../../../common/data/enumEventStatus';
import Avatar from '../../../components/Avatar';
import PaginationButtons, {
	dataPagination,
	PER_COUNT,
} from '../../../components/PaginationButtons';
import useSortableData from '../../../hooks/useSortableData';
import useDarkMode from '../../../hooks/useDarkMode';
import SubTaskForm from '../subtask/SubTaskForm';

// eslint-disable-next-line react/prop-types
const TaskProgressTable = ({ isFluid }) => {
	const { themeStatus, darkModeStatus } = useDarkMode();

	const [upcomingEventsEditOffcanvas, setUpcomingEventsEditOffcanvas] = useState(false);
	const handleUpcomingEdit = () => {
		setUpcomingEventsEditOffcanvas(!upcomingEventsEditOffcanvas);
	};

	const [currentPage, setCurrentPage] = useState(1);
	const [perPage, setPerPage] = useState(PER_COUNT['5']);
	const { items, requestSort, getClassNamesFor } = useSortableData(data);

	return (
		<>
			<Card stretch={isFluid}>
				<CardHeader borderSize={1}>
					<CardLabel icon='Alarm' iconColor='info'>
						<CardTitle>Tiến độ công việc</CardTitle>
					</CardLabel>
					<CardActions>
						<Button
							color='info'
							icon='CloudDownload'
							isLight
							tag='a'
							to='/somefile.txt'
							target='_blank'
							download>
							Xuất Excel
						</Button>
					</CardActions>
				</CardHeader>
				<CardBody className='table-responsive' isScrollable={isFluid}>
					<table className='table table-modern'>
						<thead>
							<tr>
								<th
									onClick={() => requestSort('date')}
									className='cursor-pointer text-decoration-underline'
									style={{ width: '10%' }}>
									Ngày / Giờ{' '}
									<Icon
										size='lg'
										className={getClassNamesFor('date')}
										icon='FilterList'
									/>
								</th>
								<th style={{ width: '20%' }}>Đầu việc</th>
								<th style={{ width: '20%' }}>Nhân viên phụ trách</th>
								<th style={{ minWidth: '100px' }}>Điểm KPI</th>
								<th style={{ minWidth: '150px' }}>Thời gian dự tính</th>
								<th style={{ minWidth: '100px' }}>Độ ưu tiên</th>
								<th>Trạng thái</th>
								<td />
							</tr>
						</thead>
						<tbody>
							{dataPagination(items, currentPage, perPage).map((item) => (
								<tr key={item.id}>
									<td>
										<div
											className='d-flex align-items-center'
											style={{ maxWidth: '150px' }}>
											<span
												className={classNames(
													'badge',
													'border border-2',
													[`border-${themeStatus}`],
													'rounded-circle',
													'bg-success',
													'p-2 me-2',
													`bg-${item.status.color}`,
												)}>
												<span className='visually-hidden'>
													{item.status.name}
												</span>
											</span>
											<span className='text-nowrap'>{item.date}</span>
										</div>
									</td>
									<td>
										<div>
											<div style={{ minWidth: '150px' }}>
												{item.workTitle}
											</div>
										</div>
									</td>
									<td>
										<div className='d-flex'>
											<div className='flex-shrink-0'>
												<Avatar
													src={item.assigned.src}
													srcSet={item.assigned.srcSet}
													color={item.assigned.color}
													size={36}
												/>
											</div>
											<div>
												<div>{item.customer.name}</div>
												<div className='small text-muted'>
													{item.customer.email}
												</div>
											</div>
										</div>
									</td>
									<td>{`${item.kpiPoint} điểm`}</td>
									<td>{item.duration}</td>
									<td>
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
													`bg-${item.status.color}`,
												)}>
												<span className=''>{`Cấp ${item.priority}`}</span>
											</span>
										</div>
									</td>
									<td>
										<Dropdown>
											<DropdownToggle hasIcon={false}>
												<Button
													isLink
													color={item.status.color}
													icon='Circle'
													className='text-nowrap'>
													{item.status.name}
												</Button>
											</DropdownToggle>
											<DropdownMenu>
												{Object.keys(EVENT_STATUS).map((key) => (
													<DropdownItem key={key}>
														<div>
															<Icon
																icon='Circle'
																color={EVENT_STATUS[key].color}
															/>
															{EVENT_STATUS[key].name}
														</div>
													</DropdownItem>
												))}
											</DropdownMenu>
										</Dropdown>
									</td>
									<td>
										<Button
											isOutline={!darkModeStatus}
											color='dark'
											isLight={darkModeStatus}
											className={classNames('text-nowrap', {
												'border-light': !darkModeStatus,
											})}
											icon='Edit'
											onClick={handleUpcomingEdit}>
											Sửa
										</Button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</CardBody>
				<PaginationButtons
					data={items}
					label='items'
					setCurrentPage={setCurrentPage}
					currentPage={currentPage}
					perPage={perPage}
					setPerPage={setPerPage}
				/>
			</Card>

			<SubTaskForm
				setUpcomingEventsEditOffcanvas={setUpcomingEventsEditOffcanvas}
				upcomingEventsEditOffcanvas={upcomingEventsEditOffcanvas}
				handleUpcomingEdit={handleUpcomingEdit}
				titleModal='Chỉnh sửa đầu việc'
			/>
		</>
	);
};

export default TaskProgressTable;
