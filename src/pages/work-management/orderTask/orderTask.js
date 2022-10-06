// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import { useToasts } from 'react-toast-notifications';
import Card, { CardHeader, CardLabel, CardTitle } from '../../../components/bootstrap/Card';
import Page from '../../../layout/Page/Page';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import Button from '../../../components/bootstrap/Button';
import { fetchKpiNormList } from '../../../redux/slice/kpiNormSlice';
import OrderTaskForm from './OrdertaskForm';
import PaginationButtons, {
	dataPagination,
	PER_COUNT,
} from '../../../components/PaginationButtons';
import Toasts from '../../../components/bootstrap/Toasts';
import { getAllWorktrackByUser } from '../../dailyWorkTracking/services';
import verifyPermissionHOC from '../../../HOC/verifyPermissionHOC';
import NotPermission from '../../presentation/auth/NotPermission';

const Item = ({ data, showUser, showKpiNorm }) => {
	const { quantity, startDate, deadlineDate } = data;
	return (
		<Card>
			<CardHeader>
				<CardLabel style={{ cursor: 'pointer' }}>
					<CardTitle>
						<CardLabel>{showKpiNorm(data.kpiNorm_id)}</CardLabel>
					</CardTitle>
				</CardLabel>
			</CardHeader>
			<div className='row px-4 pb-2'>
				<div className='col-12'>Người phụ trách : {showUser(data.user_id)}</div>
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
	const kpiNorm = useSelector((state) => state.kpiNorm.kpiNorms);
	const users = useSelector((state) => state.employee.employees);
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
	const items = dataPagination(
		kpiNorm.filter((item) => item.parentId === null),
		currentPage,
		perPage,
	);
	useEffect(() => {
		const fetch = async () => {
			const response = await getAllWorktrackByUser();
			const result = await response.data.data;
			setTasks(result.filter((item) => item.user_id !== null));
		};
		fetch();
	}, []);
	useEffect(() => {
		dispatch(fetchKpiNormList());
	}, [dispatch]);

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
		handleShowToast('Giao nhiệm vụ', 'Giao nhiệm vụ thành công !');
	};
	const handleOpenForm = (item) => {
		setItemEdit({ ...item });
		setIsOpenForm(true);
	};
	const handleCloseForm = () => {
		setIsOpenForm(false);
	};
	const showUser = (userId) => {
		const newUser = users.filter((item) => item.id === userId);
		if (newUser.length !== 0) {
			return newUser[0].label;
		}
		return 'null';
	};
	const showKpiNorm = (kpiNormId) => {
		const newKpiNorm = kpiNorm.filter((item) => item.id === kpiNormId);
		if (newKpiNorm.length !== 0) {
			return newKpiNorm[0].label;
		}
		return 'null';
	};
	return (
		<PageWrapper title='Giao việc'>
			<Page container='fluid'>
				{verifyPermissionHOC(
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
								<div
									className='col-lg-4 col-md-6 pb-4'
									style={{ minHeight: '900px' }}>
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
												<div style={{ textAlign: 'center' }}>
													{tasks.length === 0 &&
														'Chưa giao nhiệm vụ nào!'}
												</div>
												{tasks?.map((item) => (
													<Item
														showKpiNorm={showKpiNorm}
														data={item}
														showUser={showUser}
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
										</CardHeader>
										<div className='p-4'>
											<table
												className='table table-modern mb-0'
												style={{ fontSize: 14 }}>
												<thead>
													<tr>
														<th>Tên nhiệm vụ</th>
														<th>Loại nhiệm vụ</th>
														<th>Vị trí đảm nhiệm</th>
														<th>Giá trị KPI</th>
													</tr>
												</thead>
												<tbody>
													{items?.map((item) => (
														<React.Fragment key={item.id}>
															<tr
																onClick={() => handleOpenForm(item)}
																style={{ cursor: 'pointer' }}>
																<td>{item?.name}</td>
																<td>
																	{item?.taskType ||
																		'Thường xuyên'}
																</td>
																<td>{item?.position?.name}</td>
																<td>{item?.kpiValue}</td>
															</tr>
														</React.Fragment>
													))}
												</tbody>
											</table>
											<footer>
												<hr />
												<PaginationButtons
													data={kpiNorm.filter(
														(item) => item.parentId === null,
													)}
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
					</div>,
					['admin', 'manager'],
					<NotPermission />,
				)}
			</Page>
			<OrderTaskForm
				show={isOpenForm}
				onClose={handleCloseForm}
				onSubmit={handleSubmit}
				item={itemEdit}
			/>
		</PageWrapper>
	);
};
export default OrderTask;
