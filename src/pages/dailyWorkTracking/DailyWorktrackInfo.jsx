/* eslint-disable react/prop-types */
import React, { useState, useEffect, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SelectComponent from 'react-select';
import { Modal } from 'react-bootstrap';
import { get, isEmpty } from 'lodash';
import FormGroup from '../../components/bootstrap/forms/FormGroup';
import Input from '../../components/bootstrap/forms/Input';
import Select from '../../components/bootstrap/forms/Select';
import { PRIORITIES } from '../../utils/constants';
import Option from '../../components/bootstrap/Option';
import Textarea from '../../components/bootstrap/forms/Textarea';
import { fetchMissionList } from '../../redux/slice/missionSlice';
import { fetchEmployeeList } from '../../redux/slice/employeeSlice';
import verifyPermissionHOC from '../../HOC/verifyPermissionHOC';
import { fetchAssignTask } from '../../redux/slice/worktrackSlice';

const customStyles = {
	control: (provided) => ({
		...provided,
		padding: '10px',
		fontSize: '18px',
		borderRadius: '1.25rem',
	}),
};

const DailyWorktrackInfo = ({ show, onClose, item }) => {
	const dispatch = useDispatch();
	const users = useSelector((state) => state.employee.employees);
	const missions = useSelector((state) => state.mission.missions);
	const tasks = useSelector((state) => state.worktrack.tasks);
	const [missionOption, setMissionOption] = useState({});
	const [parentOption, setParentOption] = useState({});
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
		} else {
			setUserOption({
				label: get(item, 'user.name'),
				value: get(item, 'user.name'),
				id: get(item, 'user.id'),
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
		setParentOption({});
	};

	return (
		<Modal show={show} onHide={handleClose} centered size='xl'>
			<Modal.Header closeButton className='p-4'>
				<Modal.Title>Thông tin nhiệm vụ</Modal.Title>
			</Modal.Header>
			<Modal.Body className='px-4'>
				<div className='row'>
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
												{get(item, 'name')
													? get(item, 'name')
													: get(mission, 'kpiNorm.name')}
											</b>
										</td>
										<td className='p-3 border text-center'>
											<b>{get(item, 'kpi_value', '--')}</b>
										</td>
									</tr>
								</tbody>
							</table>
							{/* Thuộc mục tiêu */}
							<div className='row g-2'>
								<div className='col-4'>
									<FormGroup id='task' label='Thuộc mục tiêu'>
										<SelectComponent
											placeholder='Thuộc mục tiêu'
											value={missionOption}
											defaultValue={missionOption}
											onChange={setMissionOption}
											options={missions}
											isDisabled
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
											options={tasks.filter((i) => i.id !== parentOption?.id)}
											isDisabled
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
												isDisabled
											/>
										</FormGroup>
									</div>,
									['admin', 'manager'],
								)}
								<div className='col-3'>
									<FormGroup id='startDate' label='Ngày bắt đầu'>
										<Input
											name='startDate'
											placeholder='Ngày bắt đầu'
											onChange={handleChange}
											value={mission.startDate || ''}
											type='date'
											ariaLabel='Ngày bắt đầu'
											className='border border-2 rounded-0 shadow-none'
											disabled
										/>
									</FormGroup>
								</div>
								<div className='col-3'>
									<FormGroup id='deadline' label='Hạn ngày hoàn thành'>
										<Input
											name='deadline'
											placeholder='Hạn ngày hoàn thành'
											onChange={handleChange}
											value={mission.deadline || ''}
											type='date'
											ariaLabel='Hạn ngày hoàn thành'
											className='border border-2 rounded-0 shadow-none'
											disabled
										/>
									</FormGroup>
								</div>
								<div className='col-3'>
									<FormGroup id='priority' label='Độ ưu tiên'>
										<Select
											name='priority'
											ariaLabel='Board select'
											className='border border-2 rounded-0 shadow-none'
											placeholder='Độ ưu tiên'
											onChange={handleChange}
											disabled
											value={mission.priority || 2}>
											{PRIORITIES.map((priority) => (
												<Option key={priority} value={priority}>
													{`Cấp ${priority}`}
												</Option>
											))}
										</Select>
									</FormGroup>
								</div>
								<div className='col-3'>
									<FormGroup id='quantity' label='Số lượng'>
										<Input
											type='text'
											name='quantity'
											onChange={handleChange}
											value={mission.quantity || ''}
											placeholder='Số lượng'
											disabled
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
											disabled
											className='border border-2 rounded-0 shadow-none'
										/>
									</FormGroup>
								</div>
							</div>
						</div>
					</div>
				</div>
			</Modal.Body>
		</Modal>
	);
};

export default memo(DailyWorktrackInfo);
