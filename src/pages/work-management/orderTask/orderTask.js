// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import { useToasts } from 'react-toast-notifications';
import Card, {
	CardActions,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../../../components/bootstrap/Card';
import Page from '../../../layout/Page/Page';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import { demoPages } from '../../../menu';
import { getAllDepartments } from '../mission/services';
import Button from '../../../components/bootstrap/Button';
import Dropdown, {
	DropdownItem,
	DropdownMenu,
	DropdownToggle,
} from '../../../components/bootstrap/Dropdown';
import verifyPermissionHOC from '../../../HOC/verifyPermissionHOC';
import Search from '../../common/ComponentCommon/Search';
import { fetchKpiNormList } from '../../../redux/slice/kpiNormSlice';
import OrderTaskForm from './OrdertaskForm';
import PaginationButtons, {
	dataPagination,
	PER_COUNT,
} from '../../../components/PaginationButtons';
import { addWorktrack } from '../../dailyWorkTracking/services';
import Toasts from '../../../components/bootstrap/Toasts';

const Item = ({ data, onDelete, onOpen }) => {
	const { name, quantity, user, startDate, deadlineDate, index } = data;
	return (
		<Card>
			<CardHeader>
				<CardLabel
					// onClick={()=>handleOpenForm(data)}
					style={{ cursor: 'pointer' }}>
					<CardTitle onClick={() => onOpen(data)}>
						<CardLabel>{name}</CardLabel>
					</CardTitle>
				</CardLabel>
				<CardActions>
					<Button
						style={{ border: '1px solid' }}
						icon='Close'
						tag='button'
						onClick={() => onDelete(index)}
					/>
				</CardActions>
			</CardHeader>
			<div className=' row p-4'>
				<div className='col-12'>Người phụ trách : {user?.label}</div>
				<div className='col-12'>
					Thời gian : {moment(startDate).format('DD-MM-YYYY')} -{' '}
					{moment(deadlineDate).format('DD-MM-YYYY')}
				</div>
				<div className='col-12'>Số lượng : {quantity}</div>
			</div>
		</Card>
	);
};
const OrderTask = () => {
	const [dataDepartments, setDataDepartments] = useState([]);
	const kpiNorm = useSelector((state) => state.kpiNorm.kpiNorms);
	const [departmentSelect, setDepartmentSelect] = useState(1);
	const [isOpenForm, setIsOpenForm] = useState(false);
	const [itemEdit, setItemEdit] = useState({
		kpiNorm: [],
		departmentReplated: [],
		userReplated: [],
	});
	const [tasks, setTasks] = useState([]);
	const dispatch = useDispatch();
	const [currentPage, setCurrentPage] = useState(1);
	const [perPage, setPerPage] = useState(PER_COUNT['10']);
	const [newItem, setNewItem] = React.useState([]);
	const items = dataPagination(newItem, currentPage, perPage);

	useEffect(() => {
		const fecth = () => {
			if (kpiNorm) {
				setNewItem(
					kpiNorm?.filter(
						(item) => item?.departmentId === departmentSelect || departmentSelect === 1,
					),
				);
			}
		};
		fecth();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [departmentSelect, kpiNorm]);
	useEffect(() => {
		dispatch(fetchKpiNormList());
	}, [dispatch]);
	useEffect(() => {
		const fetchData = async () => {
			const response = await getAllDepartments();
			const result = await response.data;
			setDataDepartments(
				result
					.reverse()
					.concat({
						id: 1,
						name: 'Tất cả',
					})
					.reverse(),
			);
		};
		fetchData();
	}, []);
	const { addToast } = useToasts();
	const handleShowToast = (title, content) => {
		addToast(
			<Toasts title={title} icon='Check2Circle' iconColor='success' time='Now' isDismiss>
				{content}
			</Toasts>,
			{
				autoDismiss: true,
			},
		);
	};
	const handleSubmit = async () => {
		await addWorktrack(tasks);
		handleShowToast('Giao nhiệm vụ', 'Giao nhiệm vụ thành công !');
		setTasks([]);
	};
	const handleOpenForm = (item) => {
		setItemEdit({ ...item });
		setIsOpenForm(true);
	};
	const handleCloseForm = () => {
		setIsOpenForm(false);
	};
	const handleDeleteTasks = (index) => {
		const data = tasks?.filter((item) => item.index !== index);
		setTasks([...data]);
	};
	return (
		<PageWrapper title={demoPages.jobsPage.subMenu.mission.text}>
			<Page container='fluid'>
				<div className='col-12'>
					<Card className='w-100'>
						<CardHeader>
							<CardLabel>
								<CardTitle>
									<CardLabel> </CardLabel>
								</CardTitle>
							</CardLabel>
						</CardHeader>
						<div className='row h-100 w-100'>
							<div className='col-lg-4 col-md-6 pb-4' style={{ minHeight: '900px' }}>
								<Card
									style={{
										height: '100%',
										maxHeight: '900px',
										minHeight: '900px',
										overflow: 'scroll',
									}}>
									<CardHeader>
										<CardLabel>
											<CardTitle>
												<CardLabel>Nhiệm vụ đã giao</CardLabel>
											</CardTitle>
										</CardLabel>
									</CardHeader>
									<div className='p-4'>
										<div>
											<Search />
										</div>
										<div>
											{tasks?.map((item) => (
												<Item
													data={item}
													onDelete={handleDeleteTasks}
													onOpen={handleOpenForm}
												/>
											))}
										</div>
									</div>
								</Card>
							</div>
							<div className='col-lg-8 col-md-6' style={{ minHeight: '900px' }}>
								<Card style={{ minHeight: '900px' }}>
									<CardHeader>
										<CardLabel>
											<CardTitle>
												<CardLabel>Danh sách nhiệm vụ</CardLabel>
											</CardTitle>
										</CardLabel>
										{verifyPermissionHOC(
											<CardActions className='d-flex align-items-center'>
												{verifyPermissionHOC(
													<Dropdown>
														<DropdownToggle hasIcon={false}>
															<Button
																color='primary'
																icon='Circle'
																className='text-nowrap'>
																{
																	dataDepartments.filter(
																		(item) =>
																			item.id ===
																			departmentSelect,
																	)[0]?.name
																}
															</Button>
														</DropdownToggle>
														<DropdownMenu>
															{dataDepartments?.map((item) => (
																<DropdownItem
																	key={item?.id}
																	onClick={() =>
																		setDepartmentSelect(item.id)
																	}>
																	<div>{item?.name}</div>
																</DropdownItem>
															))}
														</DropdownMenu>
													</Dropdown>,
													['admin'],
												)}
											</CardActions>,
											['admin', 'manager'],
										)}
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
													<th>Tên định mức KPI</th>
													<th>Phòng ban</th>
													<th>Đơn vị tính</th>
													<th>Mô tả</th>
													<th>Vị trí chuyên môn</th>
												</tr>
											</thead>
											<tbody>
												{items?.map((item) => (
													<React.Fragment key={item.id}>
														<tr
															onClick={() => handleOpenForm(item)}
															style={{ cursor: 'pointer' }}>
															<td>{item?.name}</td>
															<td>{item?.department?.name}</td>
															<td>{item?.unit?.name}</td>
															<td>{item?.description}</td>
															<td>{item?.position?.name}</td>
														</tr>
													</React.Fragment>
												))}
											</tbody>
										</table>
										<footer>
											<hr />
											<PaginationButtons
												data={newItem}
												setCurrentPage={setCurrentPage}
												currentPage={currentPage}
												perPage={perPage}
												setPerPage={setPerPage}
											/>
										</footer>
									</div>
								</Card>
							</div>
						</div>
						<div className='col-12 my-4'>
							<div className='w-100 mt-4 text-center'>
								<Button
									color='primary'
									className='w-15 p-3 m-1'
									type='button'
									onClick={handleSubmit}>
									Chốt nhiệm vụ
								</Button>
							</div>
						</div>
					</Card>
				</div>
			</Page>
			<OrderTaskForm
				show={isOpenForm}
				onClose={handleCloseForm}
				onSubmit={handleSubmit}
				item={itemEdit}
				setTasks={setTasks}
				tasks={tasks}
			/>
		</PageWrapper>
	);
};

export default OrderTask;
