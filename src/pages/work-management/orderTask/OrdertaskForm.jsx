/* eslint-disable react/prop-types */
/* eslint-disable no-shadow */
import React, { useState, useEffect, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import { toast } from 'react-toastify';
import SelectComponent from 'react-select';
import { Modal } from 'react-bootstrap';
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
import { fetchKpiNormList } from '../../../redux/slice/kpiNormSlice';
import { addWorktrack, updateWorktrack } from '../../dailyWorkTracking/services';
import verifyPermissionHOC from '../../../HOC/verifyPermissionHOC';

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
	const users = useSelector((state) => state.employee.employees);
	const missions = useSelector((state) => state.mission.missions);
	const [missionOption, setMissionOption] = useState({});
	const [userOption, setUserOption] = useState({});
	const [mission, setMission] = React.useState({
		quantity: '',
		startDate: '',
		deadline: '',
		priority: 2,
		note: '',
	});

	useEffect(() => {
		dispatch(fetchMissionList());
		dispatch(fetchEmployeeList());
	}, [dispatch]);

	useEffect(() => {
		dispatch(fetchKpiNormList());
	}, [dispatch]);

	useEffect(() => {
		if (item.id) setMission({ ...item });
		setMissionOption({
			...item.mission,
			label: _.get(item, 'mission.name'),
			value: _.get(item, 'mission.name'),
		});
		if (!_.isEmpty(item?.users)) {
			const userResponsible = item?.users.filter(
				(items) => items?.workTrackUsers?.isResponsible === true,
			);
			setUserOption({
				label: _.get(userResponsible, '[0].name'),
				value: _.get(userResponsible, '[0].name'),
				id: _.get(userResponsible, '[0].id'),
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
		onClose();
		setMission({});
		setMissionOption({});
		setUserOption({});
	};

	const role = localStorage.getItem('roles');
	const userId = localStorage.getItem('userId');

	const handleSubmit = async () => {
		if (item.id) {
			const dataValue = {
				id: item.id,
				kpiNorm_id: item.kpiNorm_id,
				mission_id: missionOption.id || null,
				quantity: parseInt(mission.quantity, 10) || null,
				user_id: role.includes('user') ? parseInt(userId, 10) : userOption.id,
				priority: parseInt(mission.priority, 10) || null,
				note: mission.note || null,
				description: item.description || null,
				deadline: mission.deadline || null,
				startDate: mission.startDate || null,
				status: role.includes('user') ? 'pending' : 'accepted',
			};
			updateWorktrack(dataValue)
				.then(() => {
					toast.success('Cập nhật công việc thành công!', {
						position: toast.POSITION.TOP_RIGHT,
						autoClose: 1000,
					});
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
				kpiNorm_id: item.kpiNorm_id,
				mission_id: missionOption.id || null,
				quantity: parseInt(mission.quantity, 10) || null,
				user_id: role.includes('user') ? parseInt(userId, 10) : userOption.id,
				priority: parseInt(mission.priority, 10) || null,
				note: mission.note || null,
				description: item.description || null,
				deadline: mission.deadline || null,
				startDate: mission.startDate || null,
				status: role.includes('user') ? 'pending' : 'accepted',
			};
			addWorktrack(dataValue)
				.then(() => {
					toast.success('Thêm công việc thành công!', {
						position: toast.POSITION.TOP_RIGHT,
						autoClose: 1000,
					});
					handleClose();
					fetch();
				})
				.catch((err) => {
					toast.success('Thêm công việc thành công!', {
						position: toast.POSITION.TOP_RIGHT,
						autoClose: 1000,
					});
					throw err;
				});
		}
	};

	return (
		<Modal show={show} onHide={handleClose} centered size='lg'>
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
										<th className='p-3 border text-left'>Tên nhiệm vụ</th>
										<th className='p-3 border text-center'>Định mức KPI</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td className='p-3 border text-left'>
											<b>
												{_.get(item, 'kpiNorm_name')
													? _.get(item, 'kpiNorm_name')
													: _.get(mission, 'kpiNorm.name')}
											</b>
										</td>
										<td className='p-3 border text-center'>
											<b>{_.get(item, 'kpi_value', '--')}</b>
										</td>
									</tr>
								</tbody>
							</table>
							{/* Thuộc mục tiêu */}
							<div className='row g-2'>
								<div className='col-5'>
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
									</div>,
									['admin', 'manager'],
								)}

								<div className='col-3'>
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
