import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import Alert from '../../components/bootstrap/Alert';
import Button from '../../components/bootstrap/Button';
import Card, {
	CardActions,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../../components/bootstrap/Card';
import Icon from '../../components/icon/Icon';
// import Dropdown, {
// 	DropdownItem,
// 	DropdownMenu,
// 	DropdownToggle,
// } from '../../components/bootstrap/Dropdown';
import Page from '../../layout/Page/Page';
import PageWrapper from '../../layout/PageWrapper/PageWrapper';
import { demoPages } from '../../menu';
import { fetchEmployeeList } from '../../redux/slice/employeeSlice';
import Search from '../common/ComponentCommon/Search';
import Expand from './Expan';
// import ExpandRow from '../work-management/task-list/ExpandRow';

const TaskByUser = () => {
	const dispatch = useDispatch();
	const users = useSelector((state) => state.employee.employees);
	const [isExpan, setIsExpan] = useState([]);
	useEffect(() => {
		dispatch(fetchEmployeeList());
	}, [dispatch]);
	const handleEpandRow = (idExpan) => {
		setIsExpan([...isExpan, idExpan]);
		if (isExpan.includes(idExpan)) {
			setIsExpan(isExpan.filter((item) => item !== idExpan));
		}
	};
	return (
		<PageWrapper title={demoPages.jobsPage.subMenu.taskByUser.path}>
			<Page container='fluid'>
				<div className='row'>
					<div className='col-12'>
						<div className='d-flex justify-content-between align-items-center'>
							<div className='display-6 fw-bold py-3'>Công việc của nhân viên</div>
						</div>
					</div>
				</div>
				<div className='row my-4'>
					<div className='col-md-12'>
						<Card>
							<CardHeader>
								<CardLabel icon='Task' iconColor='danger'>
									<CardTitle>
										<CardLabel>Danh sách công việc của nhân viên</CardLabel>
									</CardTitle>
								</CardLabel>
								<CardActions className='d-flex align-items-center'>
									<Button
										color='info'
										icon='Plus'
										tag='button'
										// onClick={() => handleOpenEditForm(null)}>
										// onClick={handleOnClickToActionPage}
									>
										Thêm nhiệm vụ
									</Button>
									{/* {verifyPermissionHOC(
                                            <Dropdown>
                                                <DropdownToggle hasIcon={false}>
                                                    <Button
                                                        color='primary'
                                                        icon='Circle'
                                                        className='text-nowrap'>
                                                        {
                                                            dataDepartments.filter(
                                                                (item) => item.id === departmentSelect,
                                                            )[0]?.name
                                                        }
                                                    </Button>
                                                </DropdownToggle>
                                                <DropdownMenu>
                                                    {dataDepartments?.map((item) => (
                                                        <DropdownItem
                                                            key={item?.id}
                                                            // onClick={() =>
                                                            // 	setDepartmentSelect(item.id)
                                                            // }
                                                        >
                                                            <div>{item?.name}</div>
                                                        </DropdownItem>
                                                    ))}
                                                </DropdownMenu>
                                            </Dropdown>,
                                            ['admin'],
                                        )} */}
								</CardActions>
							</CardHeader>
							<div className='p-4'>
								<div style={{ maxWidth: '25%' }}>
									<Search />
								</div>
								<table className='table table-modern mb-0' style={{ fontSize: 14 }}>
									<thead>
										<tr>
											<th>Họ và tên</th>
											<th style={{ textAlign: 'center' }}>Số đầu việc</th>
											<th style={{ textAlign: 'center' }}>Phòng ban</th>
											<th style={{ textAlign: 'center' }}>Trạng thái</th>
											<th style={{ textAlign: 'center' }}>Chức vụ</th>
										</tr>
									</thead>
									<tbody>
										{users?.map((item) => (
											<React.Fragment key={item.id}>
												<tr>
													<td>{item?.name}</td>
													<td>
														<Button
															className='d-flex align-items-center justify-content-center cursor-pointer m-auto'
															onClick={() => handleEpandRow(item.id)}>
															<Icon
																color='info'
																size='sm'
																// icon={`${
																//     expandState[item.id]
																//         ? 'CaretUpFill'
																//         : 'CaretDownFill'
																// }`}
																icon='CaretDownFill'
															/>
															<span
																className='mx-2'
																style={{ color: '#0174EB' }}>
																{item?.subtasks?.length || 0}
															</span>
														</Button>
													</td>
													<td style={{ textAlign: 'center' }}>
														{item?.department?.label}
													</td>
													<td style={{ textAlign: 'center' }}>
														{item?.status}
													</td>
													{/* <td>
														{verifyPermissionHOC(
															<Dropdown>
																<DropdownToggle hasIcon={false}>
																	<Button
																		isLink
																		color={formatColorStatus(
																			item.status,
																		)}
																		icon='Circle'
																		className='text-nowrap'>
																		{FORMAT_TASK_STATUS(
																			item.status,
																		)}
																	</Button>
																</DropdownToggle>
																<DropdownMenu>
																	{Object.keys(
																		renderStatusTask(
																			item.status,
																		),
																	).map((key) => (
																		<DropdownItem
																			key={key}
																			onClick={() =>
																				handleOpenConfirmStatusTask(
																					item,
																					STATUS[key]
																						.value,
																				)
																			}>
																			<div>
																				<Icon
																					icon='Circle'
																					color={
																						STATUS[key]
																							.color
																					}
																				/>
																				{STATUS[key].name}
																			</div>
																		</DropdownItem>
																	))}
																</DropdownMenu>
															</Dropdown>,
															['admin', 'manager'],
															<Button
																isLink
																color={formatColorStatus(
																	item.status,
																)}
																icon='Circle'
																className='text-nowrap'>
																{FORMAT_TASK_STATUS(item.status)}
															</Button>,
														)}
													</td> */}
													<td style={{ textAlign: 'center' }}>
														{item?.roles[0]}
													</td>
												</tr>
												<tr>
													<td
														colSpan='12'
														style={{
															padding: '5px 0 5px 50px',
															borderRadius: '0.5rem',
														}}>
														{isExpan.includes(item.id) && (
															<Expand
																key={item.id}
																subtasks={item?.subtasks}
																taskId={item.id}
															/>
														)}
													</td>
												</tr>
											</React.Fragment>
										))}
									</tbody>
								</table>
							</div>
							{/* {!tasks?.length && (
                                <Alert color='warning' isLight icon='Report' className='mt-3'>
                                    Không có nhiệm vụ!
                                </Alert>
                            )} */}
						</Card>
					</div>
				</div>
			</Page>
		</PageWrapper>
	);
};

export default TaskByUser;
