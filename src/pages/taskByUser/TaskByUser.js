import React, { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import Select from 'react-select';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../../components/bootstrap/Button';
import Card, { CardHeader, CardLabel, CardTitle } from '../../components/bootstrap/Card';
import PaginationButtons, { dataPagination, PER_COUNT } from '../../components/PaginationButtons';
import Page from '../../layout/Page/Page';
import PageWrapper from '../../layout/PageWrapper/PageWrapper';
import { fetchEmployeeList } from '../../redux/slice/employeeSlice';
import { fetchDepartmentList } from '../../redux/slice/departmentSlice';
import { fetchPositionList } from '../../redux/slice/positionSlice';
import Loading from '../../components/Loading/Loading';
// import { calcCurrentKPIOfWorkTrack, calcTotalKPIOfWorkTrack } from '../../utils/function';

const roles = [
	{
		label: 'Admin',
		value: 'admin',
	},
	{
		label: 'Quản lý',
		value: 'manager',
	},
	{
		label: 'Nhân viên',
		value: 'user',
	},
];

const TaskByUser = () => {
	const dispatch = useDispatch();
	const users = useSelector((state) => state.employee.employees);
	const loading = useSelector((state) => state.employee.loading);
	const departments = useSelector((state) => state.department.departments);
	const positions = useSelector((state) => state.position.positions);
	const [currentPage, setCurrentPage] = useState(1);
	const [perPage, setPerPage] = useState(PER_COUNT['10']);
	const items = dataPagination(users, currentPage, perPage);

	const [textSearch, setTextSearch] = useState('');
	const [searchValue, setSearchValue] = useState({
		text: '',
		departmentId: '',
		positionId: '',
		role: '',
	});

	const handleChange = (e) => {
		setTextSearch(e.target.value);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		const query = {};
		query.text = textSearch;
		query.role = searchValue.role.value;
		query.departmentId = searchValue.departmentId.value;
		query.positionId = searchValue.positionId.value;
		dispatch(fetchEmployeeList(query));
	};

	useEffect(() => {
		dispatch(fetchEmployeeList());
		dispatch(fetchDepartmentList());
		dispatch(fetchPositionList());
	}, [dispatch]);

	const handleResetFilter = () => {
		dispatch(fetchEmployeeList());
		setTextSearch('');
		setSearchValue({
			text: '',
			departmentId: '',
			positionId: '',
			role: '',
		});
	};

	return (
		<PageWrapper title='Giám sát công việc nhân viên'>
			<Page container='fluid'>
				{/* {verifyPermissionHOC( */}
				{loading ? (
					<Loading />
				) : (
					<div
						className='row mb-0'
						style={{ maxWidth: '90%', minWidth: '90%', margin: '0 auto' }}>
						<div className='col-md-12'>
							<Card>
								<div style={{ margin: '24px 24px 0' }}>
									<CardHeader>
										<CardLabel icon='Task' iconColor='danger'>
											<CardTitle>
												<CardLabel>
													Danh sách công việc theo nhân viên
												</CardLabel>
											</CardTitle>
										</CardLabel>
									</CardHeader>
									<div className='p-4'>
										<div className='w-100'>
											<Form className='w-100 mb-3' onSubmit={handleSubmit}>
												<div className='row g-2 mb-3'>
													<div className='col-4'>
														<Form.Control
															placeholder='Search...'
															className='rounded-none outline-none shadow-none'
															style={{
																borderColor: 'hsl(0, 0%, 80%)',
																borderRadius: '0rem',
															}}
															onChange={handleChange}
															value={textSearch}
														/>
													</div>
													<div className='col-3'>
														<Select
															name='departmentId'
															placeholder='Phòng ban'
															value={searchValue.departmentId}
															defaultValue={searchValue.departmentId}
															onChange={(value) => {
																setSearchValue({
																	...searchValue,
																	departmentId: value,
																});
															}}
															options={departments}
														/>
													</div>
													<div className='col-3'>
														<Select
															name='positionId'
															placeholder='Vị trí'
															value={searchValue.positionId}
															defaultValue={searchValue.positionId}
															onChange={(value) => {
																setSearchValue({
																	...searchValue,
																	positionId: value,
																});
															}}
															options={positions}
														/>
													</div>
													<div className='col-2'>
														<Select
															name='role'
															placeholder='Vai trò'
															value={searchValue.role}
															defaultValue={searchValue.role}
															onChange={(value) => {
																setSearchValue({
																	...searchValue,
																	role: value,
																});
															}}
															options={roles}
														/>
													</div>
												</div>
												<div className='w-100 d-flex justify-content-end'>
													<Button
														color='primary'
														isOutline
														isLight={false}
														onClick={handleResetFilter}
														className='text-nowrap rounded-0 outline-none shadow-none me-2'
														icon='ClearAll'>
														Xoá bộ lọc
													</Button>
													<Button
														color='info'
														isOutline
														isLight={false}
														onClick={handleSubmit}
														className='text-nowrap rounded-0 outline-none shadow-none ms-2'
														icon='Search'>
														Tìm kiếm
													</Button>
												</div>
											</Form>
										</div>
										<table className='table table-modern mb-0'>
											<thead>
												<tr>
													<th>Họ và tên</th>
													<th>Phòng ban</th>
													<th>Vị trí</th>
													<th className='text-center'>
														Số nhiệm vụ đang có
													</th>
													{/* <th className='text-center'>Tổng điểm KPI</th>
													<th className='text-center'>
														Điểm KPI hiện tại
													</th> */}
												</tr>
											</thead>
											<tbody>
												{items?.map((item) => (
													<React.Fragment key={item.id}>
														<tr>
															<td>
																<Link
																	className='text-underline'
																	to={`/cong-viec-cua-nhan-vien/${item.id}`}>
																	{item.name}
																</Link>
															</td>
															<td>{item?.department?.name}</td>
															<td>{item?.position?.name}</td>
															<td className='text-center'>
																{item?.workTracks?.filter((wt) => {
																	return (
																		wt?.workTrackUsers
																			?.isResponsible === true
																	);
																})?.length || 0}
															</td>
															{/* <td className='text-center'>
																{calcTotalKPIOfWorkTrack(
																	item.workTracks.map((wt) => ({
																		totalKPI:
																			calcTotalKPIOfWorkTrack(
																				wt,
																			),
																		currentKPI:
																			calcCurrentKPIOfWorkTrack(
																				wt,
																			),
																	})),
																) || 0}
															</td>
															<td className='text-center'>
																{calcCurrentKPIOfWorkTrack(
																	item.workTracks.map((wt) => ({
																		totalKPI:
																			calcTotalKPIOfWorkTrack(
																				wt,
																			),
																		currentKPI:
																			calcCurrentKPIOfWorkTrack(
																				wt,
																			),
																	})),
																) || 0}
															</td> */}
														</tr>
													</React.Fragment>
												))}
											</tbody>
										</table>
										<hr />
										<footer>
											<PaginationButtons
												data={users}
												setCurrentPage={setCurrentPage}
												currentPage={currentPage}
												perPage={perPage}
												setPerPage={setPerPage}
											/>
										</footer>
									</div>
								</div>
							</Card>
						</div>
					</div>
				)}
				{/* , */}
				{/* ['admin', 'manager'],
					<NotPermission />,
				)} */}
			</Page>
		</PageWrapper>
	);
};

export default TaskByUser;
