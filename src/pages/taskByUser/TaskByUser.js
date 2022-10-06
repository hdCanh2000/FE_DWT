import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Card, { CardHeader, CardLabel, CardTitle } from '../../components/bootstrap/Card';
import PaginationButtons, { dataPagination, PER_COUNT } from '../../components/PaginationButtons';
import verifyPermissionHOC from '../../HOC/verifyPermissionHOC';
import Page from '../../layout/Page/Page';
import PageWrapper from '../../layout/PageWrapper/PageWrapper';
import { fetchEmployeeList } from '../../redux/slice/employeeSlice';
import Search from '../common/ComponentCommon/Search';
import NotPermission from '../presentation/auth/NotPermission';

const TaskByUser = () => {
	const dispatch = useDispatch();
	const users = useSelector((state) => state.employee.employees);
	const [currentPage, setCurrentPage] = useState(1);
	const [perPage, setPerPage] = useState(PER_COUNT['10']);
	const items = dataPagination(users, currentPage, perPage);
	useEffect(() => {
		dispatch(fetchEmployeeList());
	}, [dispatch]);

	return (
		<PageWrapper title='Giám sát công việc nhân viên'>
			<Page container='fluid'>
				{verifyPermissionHOC(
					<div className='row my-4'>
						<div className='col-md-12'>
							<Card>
								<CardHeader>
									<CardLabel icon='Task' iconColor='danger'>
										<CardTitle>
											<CardLabel>Danh sách công việc của nhân viên</CardLabel>
										</CardTitle>
									</CardLabel>
								</CardHeader>
								<div className='p-4'>
									<div style={{ maxWidth: '25%' }}>
										<Search />
									</div>
									<table
										className='table table-modern mb-0'
										style={{ fontSize: 14 }}>
										<thead>
											<tr>
												<th>Họ và tên</th>
												<th>Phòng ban</th>
												<th>Vị trí</th>
												<th className='text-center'>Số nhiệm vụ đang có</th>
												<th>Chức vụ</th>
											</tr>
										</thead>
										<tbody>
											{items?.map((item) => (
												<React.Fragment key={item.id}>
													<tr>
														<td>
															<a
																className='text-underline'
																href={`/cong-viec-cua-nhan-vien/${item.id}`}>
																{item.name}
															</a>
														</td>
														<td>{item?.department?.name}</td>
														<td>{item?.position?.name}</td>
														<td className='text-center'>
															{item?.workTracks?.length || 0}
														</td>
														<td>
															{item?.role === 'manager'
																? 'Quản lý '
																: 'Nhân viên'}
														</td>
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
							</Card>
						</div>
					</div>,
					['admin', 'manager'],
					<NotPermission />,
				)}
			</Page>
		</PageWrapper>
	);
};

export default TaskByUser;
