// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable react/prop-types */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable eslint-comments/no-duplicate-disable */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-shadow */
import React, { useState, useEffect, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import SelectComponent from 'react-select';
import { Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import Input from '../../../components/bootstrap/forms/Input';
import { fetchDepartmentList } from '../../../redux/slice/departmentSlice';
import Select from '../../../components/bootstrap/forms/Select';
import { PRIORITIES } from '../../../utils/constants';
import Option from '../../../components/bootstrap/Option';
import Textarea from '../../../components/bootstrap/forms/Textarea';
import Button from '../../../components/bootstrap/Button';
import Card, {
	CardActions,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../../../components/bootstrap/Card';
import { fetchMissionList } from '../../../redux/slice/missionSlice';
import { fetchEmployeeList } from '../../../redux/slice/employeeSlice';
import { fetchKpiNormList } from '../../../redux/slice/kpiNormSlice';
import { fetchKeyList } from '../../../redux/slice/keySlice';
import { fetchUnitList } from '../../../redux/slice/unitSlice';
import ListPickKpiNorm from './ListPickKpiNorm';
import Icon from '../../../components/icon/Icon';
import { addWorktrack } from '../../dailyWorkTracking/services';

const customStyles = {
	control: (provided) => ({
		...provided,
		padding: '10px',
		fontSize: '18px',
		borderRadius: '1.25rem',
	}),
};
// eslint-disable-next-line react/prop-types, no-unused-vars
const OrderTaskForm = ({ show, onClose, item,fetch }) => {
	const [dataSubMission, setDataSubMission] = React.useState([]);
	const dispatch = useDispatch();
	const users = useSelector((state) => state.employee.employees);
	const kpiNorms = useSelector((state) => state.kpiNorm.kpiNorms);
	const missions = useSelector((state) => state.mission.missions);
	const [missionOption, setMissionOption] = useState({});
	const [userOption, setUserOption] = useState({ label: '', value: '' });
	const [mission, setMission] = React.useState({});
	const [isOpen, setIsOpen] = React.useState(false);

	useEffect(() => {
		dispatch(fetchDepartmentList());
	}, [dispatch]);
	useEffect(() => {
		dispatch(fetchKeyList());
	}, [dispatch]);
	useEffect(() => {
		dispatch(fetchMissionList());
	}, [dispatch]);
	useEffect(() => {
		dispatch(fetchEmployeeList());
	}, [dispatch]);
	useEffect(() => {
		dispatch(fetchKpiNormList());
	}, [dispatch]);
	useEffect(() => {
		dispatch(fetchUnitList());
	}, [dispatch]);
	useEffect(() => {
		setMission({ ...item });
		// setKpiNormOptions(item?.kpiNorm || []);
		setMissionOption({ ...item?.parent });
		setUserOption({ ...item?.user });
	}, [item]);
	// show toast
	const handleChange = (e) => {
		const { value, name } = e.target;
		setMission({
			...mission,
			[name]: value,
		});
	};
	const handleSubmit = async () => {
		const dataValue = {
			kpiNorm_id: item.id,
			parent_id: null,
			mission_id: missionOption?.id,
			quantity: parseInt(mission?.quantity, 10),
			user_id: userOption?.id,
			priority: parseInt(mission?.priority, 10),
			note: mission?.note,
			description: item?.description,
			deadline: mission?.deadlineDate,
			startDate: mission?.startDate,
		};
		addWorktrack(dataValue).then((res) => {
			dataSubMission.forEach(async (item) => {
				await addWorktrack({
					priority: parseInt(mission?.priority, 10),
					note: mission?.note,
					description: item?.description,
					deadline: mission?.deadlineDate,
					startDate: mission?.startDate,
					kpiNorm_id: item.id,
					parent_id: res.data.data.id,
					quantity: item.quantity,
					user_id: userOption?.id,
				});
			});
		});
		fetch();
		onClose();
		setMission({});
		setMissionOption({});
		setUserOption({});
	};
	const handleShowPickListKpiNorm = () => {
		setIsOpen(!isOpen);
	};

	return (
		<Modal show={show} onHide={onClose} centered size='lg'>
			<div className='row px-3'>
				<Card className='px-0 w-100 m-auto'>
					<CardHeader className='py-2'>
						<CardLabel>
							<CardTitle className='fs-4 ml-0'>Giao nhiệm vụ</CardTitle>
						</CardLabel>
						<CardActions>
							<FormGroup>
								<OverlayTrigger
									overlay={
										<Tooltip id='addSubMission'>Thêm nhiệm vụ con</Tooltip>
									}>
									<Button
										color='success'
										type='button'
										icon='Plus'
										className='d-block w-10'
										onClick={handleShowPickListKpiNorm}>
										Thêm nhiệm vụ con
									</Button>
								</OverlayTrigger>
							</FormGroup>
						</CardActions>
					</CardHeader>
					<div className='col-12 p-4'>
						<div className='row'>
							<table
								style={{
									width: '100%',
									marginLeft: '20px',
									marginBottom: '20px',
								}}>
								<tr style={{ height: '30px' }}>
									<td>
										Tên nhiệm vụ: <b>{item?.name || item?.kpiNorm?.name}</b>
									</td>
									<td>
										Định mức KPI: <b>{item.kpiValue || 'Không'}</b>
									</td>
								</tr>
								<tr style={{ height: '30px' }}>
									<td>
										Loại nhiệm vụ: <b>{item.taskType || 'Thường xuyên'}</b>
									</td>
								</tr>
							</table>
							{/* Thuộc mục tiêu */}
							<div className='row g-2'>
								<div className='col-5'>
									<FormGroup id='task' label='Thuộc mục tiêu'>
										<SelectComponent
											placeholder='Thuộc mục tiêu'
											defaultValue={missionOption}
											value={missionOption}
											onChange={setMissionOption}
											options={missions}
										/>
									</FormGroup>
								</div>
								<div className='col-4'>
									<FormGroup id='userOption' label='Nguời phụ trách'>
										<SelectComponent
											style={customStyles}
											placeholder='Chọn nguời phụ trách'
											defaultValue={userOption}
											value={userOption}
											onChange={setUserOption}
											options={users}
										/>
									</FormGroup>
								</div>
								<div className='col-3'>
									<FormGroup id='quantity' label='Số lượng'>
										<Input
											type='text'
											name='quantity'
											defaultValue=''
											onChange={handleChange}
											value={mission?.quantity}
											placeholder='Số lượng'
											className='border border-2 rounded-0 shadow-none'
										/>
									</FormGroup>
								</div>
							</div>
							<div className='row g-2'>
								<div className='col-4'>
									<FormGroup id='startDate' label='Ngày bắt đầu'>
										<Input
											name='startDate'
											placeholder='Ngày bắt đầu'
											onChange={handleChange}
											value={mission.startDate}
											type='date'
											ariaLabel='Ngày bắt đầu'
											className='border border-2 rounded-0 shadow-none'
										/>
									</FormGroup>
								</div>
								<div className='col-4'>
									<FormGroup id='deadlineDate' label='Hạn ngày hoàn thành'>
										<Input
											name='deadlineDate'
											placeholder='Hạn ngày hoàn thành'
											onChange={handleChange}
											value={
												mission.deadlineDate ||
												moment().add(1, 'days').format('YYYY-MM-DD')
											}
											type='date'
											ariaLabel='Hạn ngày hoàn thành'
											className='border border-2 rounded-0 shadow-none'
										/>
									</FormGroup>
								</div>
								<div className='col-4'>
									<FormGroup id='priority' label='Độ ưu tiên'>
										<Select
											name='priority'
											ariaLabel='Board select'
											className='border border-2 rounded-0 shadow-none'
											placeholder='Độ ưu tiên'
											onChange={handleChange}
											value={mission?.priority}>
											{PRIORITIES.map((priority) => (
												<Option key={priority} value={priority}>
													{`Cấp ${priority}`}
												</Option>
											))}
										</Select>
									</FormGroup>
								</div>
							</div>

							{/* Ghi chú */}
							<div className='row g-2'>
								<div className='col-12'>
									<FormGroup id='note' label='Ghi chú'>
										<Textarea
											name='note'
											onChange={handleChange}
											value={mission?.note || ''}
											ariaLabel='Ghi chú'
											placeholder='Ghi chú'
											className='border border-2 rounded-0 shadow-none'
										/>
									</FormGroup>
								</div>
							</div>
							<div className='row g-2'>
								<div className='col-12'>
									{dataSubMission?.length > 0 && (
										<>
											<h3 className='fs-6'>Danh sách nhiệm vụ con đã chọn</h3>
											<table className='w-100'>
												<thead className='border'>
													<th
														className='border p-2 text-center'
														style={{ width: '20px' }}>
														STT
													</th>
													<th className='border p-2'>Tên nhiệm vụ</th>
													<th className='border p-2 text-center'>
														Số lượng
													</th>
													<td style={{ width: '20px' }} />
												</thead>
												{dataSubMission?.map((item, index) => {
													return (
														<tr key={item.id} className='border'>
															<td
																className='border p-2 text-center'
																style={{ width: '20px' }}>
																{index + 1}
															</td>
															<td className='border p-2'>
																{item.name}
															</td>
															<td className='border p-2 text-center'>
																{item.quantity}
															</td>
															<td className='border p-2 text-center'>
																<Button
																	color='light'
																	variant='light'
																	size='lg'
																	style={{ width: '20px' }}
																	className='bg-transparent border-0 p-0'
																	onClick={() =>
																		setDataSubMission(
																			dataSubMission.filter(
																				(i) =>
																					i.id !==
																					item.id,
																			),
																		)
																	}>
																	<Icon icon='Trash' size='lg' />
																</Button>
															</td>
														</tr>
													);
												})}
											</table>
										</>
									)}
								</div>
							</div>
						</div>
					</div>
					<div className='col-12 my-4'>
						<div className='w-100 mt-4 text-center'>
							<Button
								color='danger'
								className='w-15 p-3 m-1'
								type='button'
								onClick={onClose}>
								Đóng
							</Button>
							<Button
								color='primary'
								className='w-15 p-3 m-1'
								type='button'
								onClick={handleSubmit}>
								Lưu thông tin
							</Button>
						</div>
					</div>
				</Card>
				<ListPickKpiNorm
					setDataSubMission={setDataSubMission}
					show={isOpen}
					data={kpiNorms}
					handleClose={handleShowPickListKpiNorm}
					initItem={item}
				/>
			</div>
		</Modal>
	);
};
// OrderTaskForm.propTypes = {
// 	isEdit: PropTypes.bool,
// };
// OrderTaskForm.defaultProps = {
// 	isEdit: false,
// };
export default memo(OrderTaskForm);
