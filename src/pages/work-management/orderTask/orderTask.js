/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import _ from 'lodash';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import Card, {
	CardActions,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../../../components/bootstrap/Card';
import Page from '../../../layout/Page/Page';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import { fetchKpiNormList } from '../../../redux/slice/kpiNormSlice';
import OrderTaskForm from './OrdertaskForm';
import PaginationButtons, {
	dataPagination,
	PER_COUNT,
} from '../../../components/PaginationButtons';
import { deleteWorkTrack, getAllWorktrackByUser } from '../../dailyWorkTracking/services';
import verifyPermissionHOC from '../../../HOC/verifyPermissionHOC';
import NotPermission from '../../presentation/auth/NotPermission';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import Button from '../../../components/bootstrap/Button';

const Item = ({ data, showKpiNorm, fetch, onOpen }) => {
	const { quantity, deadlineDate } = data;
	const handlDeleteItem = async (ele) => {
		await deleteWorkTrack(ele.id);
		fetch();
	};
	return (
		<Card>
			<CardHeader>
				<CardLabel style={{ cursor: 'pointer' }} onClick={() => onOpen(data)}>
					<CardTitle>
						<CardLabel>{showKpiNorm(_.get(data, 'kpiNorm_id'))}</CardLabel>
					</CardTitle>
				</CardLabel>
				<CardActions
					style={{ border: '1px solid', borderRadius: '6px' }}
					onClick={() => handlDeleteItem(data)}>
					<FormGroup>
						<OverlayTrigger
							overlay={<Tooltip id='addSubMission'>Xóa nhiệm vụ đã giao</Tooltip>}>
							<Button
								type='button'
								className='d-block w-10'
								icon='Close'
								// onClick={handleShowPickListKpiNorm}
							/>
						</OverlayTrigger>
					</FormGroup>
				</CardActions>
			</CardHeader>
			<div className='row px-4 pb-2'>
				<div className='col-12'>Người phụ trách: {_.get(data, 'user.name')}</div>
				<div className='col-12'>
					Thời hạn hoàn thành: {moment(deadlineDate).format('DD-MM-YYYY')}
				</div>
				<div className='col-12'>Số lượng : {quantity}</div>
			</div>
		</Card>
	);
};
const OrderTask = () => {
	const kpiNorm = useSelector((state) => state.kpiNorm.kpiNorms);
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
	const fetch = async () => {
		const response = await getAllWorktrackByUser();
		const result = await response.data.data;
		setTasks(result.filter((item) => item.user_id !== null));
	};
	useEffect(() => {
		fetch();
	}, []);
	useEffect(() => {
		dispatch(fetchKpiNormList());
	}, [dispatch]);
	const handleOpenForm = (item) => {
		setItemEdit({ ...item });
		setIsOpenForm(true);
	};
	const handleCloseForm = () => {
		setIsOpenForm(false);
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
						<div className='row h-100 w-100'>
							<div className='col-4' style={{ height: '800px' }}>
								<Card style={{ height: '800px' }}>
									<CardHeader>
										<CardLabel>
											<CardTitle>
												<CardLabel>Nhiệm vụ đã giao</CardLabel>
											</CardTitle>
										</CardLabel>
									</CardHeader>
									<div className='p-4' style={{ overflow: 'scroll' }}>
										<div>
											<div>
												{tasks.length === 0 && 'Chưa giao nhiệm vụ nào!'}
											</div>
											{tasks?.map((item) => (
												<Item
													fetch={fetch}
													key={item.id}
													showKpiNorm={showKpiNorm}
													data={item}
													onOpen={handleOpenForm}
												/>
											))}
										</div>
									</div>
								</Card>
							</div>
							<div className='col-8' style={{ height: '800px' }}>
								<Card style={{ height: '800px' }}>
									<CardHeader>
										<CardLabel>
											<CardTitle>
												<CardLabel>Danh sách nhiệm vụ</CardLabel>
											</CardTitle>
										</CardLabel>
									</CardHeader>
									<div>
										<table className='table table-modern mb-0'>
											<thead>
												<tr>
													<th style={{ width: '53%' }}>Tên nhiệm vụ</th>
													<th style={{ width: '18%' }}>Loại nhiệm vụ</th>
													<th style={{ width: '15%' }}>
														Vị trí đảm nhiệm
													</th>
													<th>Giá trị KPI</th>
												</tr>
											</thead>
										</table>
									</div>
									<div style={{ overflow: 'scroll', padding: '5px 5px 5px 5px' }}>
										<table className='table table-modern mb-0'>
											<tbody>
												{items?.map((item) => (
													<React.Fragment key={item.id}>
														<tr
															onClick={() => handleOpenForm(item)}
															className='cursor-pointer'>
															<td style={{ width: '54%' }}>
																{item?.name}
															</td>
															<td style={{ width: '18%' }}>
																{item?.taskType || 'Thường xuyên'}
															</td>
															<td style={{ width: '15%' }}>
																{_.get(item, 'position.name')}
															</td>

															<td>{item?.kpi_value || 'Không'}</td>
														</tr>
													</React.Fragment>
												))}
											</tbody>
										</table>
									</div>
									<div>
										<hr />
										<PaginationButtons
											data={kpiNorm.filter((item) => item.parentId === null)}
											setCurrentPage={setCurrentPage}
											currentPage={currentPage}
											perPage={perPage}
											setPerPage={setPerPage}
										/>
									</div>
								</Card>
							</div>
						</div>
					</div>,
					['admin', 'manager'],
					<NotPermission />,
				)}
			</Page>
			<OrderTaskForm
				fetch={fetch}
				show={isOpenForm}
				onClose={handleCloseForm}
				item={itemEdit}
			/>
		</PageWrapper>
	);
};
export default OrderTask;
