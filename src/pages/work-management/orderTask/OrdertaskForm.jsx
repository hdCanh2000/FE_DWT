/* eslint-disable react/prop-types */
/* eslint-disable no-shadow */
import React, { useState, useEffect, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import SelectComponent from 'react-select';
import { Modal } from 'react-bootstrap';
import { get, isEmpty } from 'lodash';
import moment from 'moment';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import Input from '../../../components/bootstrap/forms/Input';
import Select from '../../../components/bootstrap/forms/Select';
import { PRIORITIES } from '../../../utils/constants';
import Option from '../../../components/bootstrap/Option';
import Textarea from '../../../components/bootstrap/forms/Textarea';
import Button from '../../../components/bootstrap/Button';
import Card, { CardHeader, CardLabel, CardTitle } from '../../../components/bootstrap/Card';
import { fetchMissionList } from '../../../redux/slice/missionSlice';
import { fetchEmployeeList } from '../../../redux/slice/employeeSlice';
import { addWorktrack, updateWorktrack } from '../../dailyWorkTracking/services';
import verifyPermissionHOC from '../../../HOC/verifyPermissionHOC';
import { fetchAssignTask } from '../../../redux/slice/worktrackSlice';
import { fetchKeyList } from '../../../redux/slice/keySlice';

const customStyles = {
	control: (provided) => ({
		...provided,
		padding: '10px',
		fontSize: '18px',
		borderRadius: '1.25rem',
	}),
};
const OrderTaskForm = ({ show, onClose, item, fetch }) => {
	const dispatch = useDispatch();
	const keys = useSelector((state) => state.key.keys);
	const users = useSelector((state) => state.employee.employees);
	const missions = useSelector((state) => state.mission.missions);
	const tasks = useSelector((state) => state.worktrack.tasks);
	const [missionOption, setMissionOption] = useState({});
	const [keyOption, setKeyOption] = useState([]);
	const [parentOption, setParentOption] = useState({});
	const [userOption, setUserOption] = useState({});
	const [checkValidate, setCheckValidate] = useState(false);
	const [mission, setMission] = React.useState({
		quantity: '',
		startDate: moment().add(0, 'days').format('YYYY-MM-DD'),
		deadline: '',
		priority: 2,
		note: '',
		name: '',
	});
	useEffect(() => {
		dispatch(fetchKeyList());
		dispatch(fetchMissionList());
		dispatch(fetchEmployeeList());
		dispatch(fetchAssignTask());
	}, [dispatch]);
	useEffect(() => {
		const dataParent = tasks.filter((ele) => ele.id === item?.parent_id);
		setParentOption({
			...dataParent[0],
			label: get(dataParent[0], 'kpiNorm.name'),
			value: get(dataParent[0], 'id'),
		});
		// eslint-disable-next-line prettier/prettier, react-hooks/exhaustive-deps
	},[tasks , item])
	useEffect(() => {
		if (item.id) setMission({ ...item });
		setMissionOption({
			...item.mission,
			label: get(item, 'mission.name'),
			value: get(item, 'mission.name'),
		});
		if (!isEmpty(item?.users)) {
			const userResponsible = item?.users.filter(
				(items) => items?.workTrackUsers?.isResponsible === true,
			);
			setUserOption({
				label: get(userResponsible, '[0].name'),
				value: get(userResponsible, '[0].name'),
				id: get(userResponsible, '[0].id'),
			});
		}
	}, [item]);

	const handleChange = (e) => {
		const { value, name } = e.target;
		setMission({
			...mission,
			[name]: value,
		});
	};
	const handleClose = () => {
		setCheckValidate(false);
		onClose();
		setMission({});
		setMissionOption({});
		setUserOption({});
		setParentOption({});
	};

	const role = localStorage.getItem('roles');
	const userId = localStorage.getItem('userId');

	const handleSubmit = async () => {
		setCheckValidate(true);
		fetch();
		if (!isEmpty(mission.deadline)) {
			if (item.id) {
				const dataValue = {
					parent_id: parentOption?.id || null,
					id: item.id,
					kpiNorm_id: item.kpiNorm_id,
					mission_id: missionOption.id || null,
					key_id: keyOption.id || null,
					quantity: parseInt(mission.quantity, 10) || null,
					user_id: role.includes('user') ? parseInt(userId, 10) : userOption.id,
					priority: parseInt(mission.priority, 10) || null,
					note: mission.note || null,
					description: item.description || null,
					deadline: mission.deadline || null,
					startDate: mission.startDate || null,
					status: role.includes('user') ? 'pending' : 'accepted',
					name: mission.name || null,
				};
				updateWorktrack(dataValue)
					.then(() => {
						toast.success('Cập nhật công việc thành công!', {
							position: toast.POSITION.TOP_RIGHT,
							autoClose: 1000,
						});
						setCheckValidate(false);
						handleClose();
						fetch();
					})
					.catch((err) => {
						toast.success('Cập nhật công việc thành công!', {
							position: toast.POSITION.TOP_RIGHT,
							autoClose: 1000,
						});
						throw err;
					});
			} else {
				const dataValue = {
					parent_id: parentOption?.id || null,
					kpiNorm_id: item.kpiNorm_id,
					mission_id: missionOption.id || null,
					key_id: keyOption.id || null,
					quantity: parseInt(mission.quantity, 10) || null,
					user_id: role.includes('user') ? parseInt(userId, 10) : userOption.id,
					priority: parseInt(mission.priority, 10) || null,
					note: mission.note || null,
					description: item.description || null,
					deadline: mission.deadline || null,
					startDate: mission.startDate || moment().add(0, 'days').format('YYYY-MM-DD'),
					status: role.includes('user') ? 'pending' : 'accepted',
					name: mission.name || null,
				};
				addWorktrack(dataValue)
					.then(() => {
						toast.success('Thêm công việc thành công!', {
							position: toast.POSITION.TOP_RIGHT,
							autoClose: 1000,
						});
						setCheckValidate(false);
						handleClose();
						fetch();
					})
					.catch((err) => {
						toast.error('Thêm công việc thất bại !', {
							position: toast.POSITION.TOP_RIGHT,
							autoClose: 1000,
						});
						throw err;
					});
			}
		}
	};
	return (
		<Modal show={show} onHide={handleClose} centered size='xl'>
			<div className='row px-3'>
				<Card className='px-0 w-100 m-auto'>
					<CardHeader className='py-2'>
						<CardLabel>
							<CardTitle className='fs-4 ml-0'>
								{item?.kpiNorm ? 'Chỉnh sửa nhiệm vụ ' : 'Giao nhiệm vụ'}
							</CardTitle>
						</CardLabel>
					</CardHeader>
					<div className='col-12 p-4'>
						<div className='row'>
							<table className='w-100 mb-4 border'>
								<thead>
									<tr>
										<th className='p-3 border text-left'>Nhiệm vụ</th>
										<th className='p-3 border text-center'>Định mức KPI</th>
										<th className='p-3 border text-center'>Số lượng</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td className='p-3 border text-left'>
											<b>
												{get(item, 'kpiNorm_name')
													? get(item, 'kpiNorm_name')
													: get(mission, 'kpiNorm.name')}
											</b>
										</td>
										<td className='p-3 border text-center'>
											<b>
												{item.id
													? get(item, 'kpiNorm.kpi_value')
													: get(item, 'kpi_value')}
											</b>
										</td>
										<td className='p-3 border text-center'>
											<b>
												{item.id
													? get(item, 'kpiNorm.quantity')
													: get(item, 'quantity')}
											</b>
										</td>
									</tr>
								</tbody>
							</table>
							{/* Thuộc mục tiêu */}
							<div className='row g-2'>
								<div className='col-12'>
									<FormGroup id='name' label='Tên nhiệm vụ'>
										<Input
											name='name'
											placeholder='Tên nhiệm vụ'
											onChange={handleChange}
											value={mission.name}
											type='text'
											ariaLabel='Tên nhiệm vụ'
											className='border border-2 rounded-0 shadow-none'
										/>
									</FormGroup>
								</div>
								<div className='col-4'>
									<FormGroup id='task' label='Thuộc mục tiêu'>
										<SelectComponent
											placeholder='Thuộc mục tiêu'
											value={missionOption}
											defaultValue={missionOption}
											onChange={setMissionOption}
											options={missions}
										/>
									</FormGroup>
								</div>
								<div className='col-4'>
									<FormGroup id='parent' label='Thuộc nhiệm vụ cha'>
										<SelectComponent
											placeholder='Thuộc nhiệm vụ cha'
											value={parentOption}
											defaultValue={parentOption}
											onChange={setParentOption}
											options={tasks.filter(
												(item) => item.id !== parentOption?.id,
											)}
										/>
									</FormGroup>
								</div>
								{verifyPermissionHOC(
									<div className='col-4'>
										<FormGroup id='userOption' label='Nguời phụ trách'>
											<SelectComponent
												style={customStyles}
												placeholder='Chọn nguời phụ trách'
												value={userOption}
												defaultValue={userOption}
												onChange={setUserOption}
												options={users}
											/>
										</FormGroup>
										<div className='text-danger mt-1'>
											{checkValidate && isEmpty(userOption) && (
												<span className='error'>
													Vui lòng chọn người phụ trách
												</span>
											)}
										</div>
									</div>,
									['admin', 'manager'],
								)}
								<div className='col-4'>
									<FormGroup id='startDate' label='Ngày bắt đầu'>
										<Input
											name='startDate'
											placeholder='Ngày bắt đầu'
											onChange={handleChange}
											defaultValue={moment()
												.add(0, 'days')
												.format('YYYY-MM-DD')}
											value={
												mission.startDate ||
												moment().add(0, 'days').format('YYYY-MM-DD')
											}
											type='date'
											ariaLabel='Ngày bắt đầu'
											className='border border-2 rounded-0 shadow-none'
										/>
									</FormGroup>
									<div className='text-danger mt-1'>
										{checkValidate && isEmpty(mission.startDate) && (
											<span className='error'>
												Vui lòng điền ngày bắt đầu
											</span>
										)}
									</div>
								</div>
								<div className='col-4'>
									<FormGroup id='deadline' label='Hạn ngày hoàn thành'>
										<Input
											name='deadline'
											placeholder='Hạn ngày hoàn thành'
											onChange={handleChange}
											value={mission.deadline}
											type='date'
											ariaLabel='Hạn ngày hoàn thành'
											className='border border-2 rounded-0 shadow-none'
										/>
									</FormGroup>
									<div className='text-danger mt-1'>
										{checkValidate && isEmpty(mission.deadline) && (
											<span className='error'>
												Vui lòng điền ngày kết thúc
											</span>
										)}
									</div>
								</div>
								<div className='col-4'>
									<FormGroup id='priority' label='Độ ưu tiên'>
										<Select
											name='priority'
											ariaLabel='Board select'
											className='border border-2 rounded-0 shadow-none'
											placeholder='Độ ưu tiên'
											onChange={handleChange}
											value={mission.priority || 2}>
											{PRIORITIES.map((priority) => (
												<Option key={priority} value={priority}>
													{`Cấp ${priority}`}
												</Option>
											))}
										</Select>
									</FormGroup>
								</div>
								<div className='col-4'>
									<FormGroup id='keys' label='Chỉ số key'>
										<SelectComponent
											placeholder='Chỉ số key'
											value={keyOption}
											defaultValue={keyOption}
											onChange={setKeyOption}
											options={keys}
										/>
									</FormGroup>
								</div>
								<div className='col-4'>
									<FormGroup id='quantity' label='Số lượng'>
										<Input
											type='text'
											name='quantity'
											onChange={handleChange}
											value={mission.quantity || ''}
											placeholder='Số lượng'
											className='border border-2 rounded-0 shadow-none'
										/>
									</FormGroup>
								</div>
								<div className='col-4'>
									<FormGroup id='unit' label='Đơn vị'>
										<Input
											disabled
											type='text'
											name='unit'
											value={item?.unit}
											placeholder='Đơn vị'
											className='border border-2 rounded-0 shadow-none'
										/>
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
											value={mission.note || ''}
											ariaLabel='Ghi chú'
											placeholder='Ghi chú'
											className='border border-2 rounded-0 shadow-none'
										/>
									</FormGroup>
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
								onClick={handleClose}>
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
			</div>
		</Modal>
	);
};
export default memo(OrderTaskForm);
