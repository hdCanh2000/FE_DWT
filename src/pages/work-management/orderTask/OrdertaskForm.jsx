/* eslint-disable react/prop-types */
/* eslint-disable no-shadow */
import React, { useState, useEffect, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import _ from 'lodash';
import SelectComponent from 'react-select';
import { Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import Input from '../../../components/bootstrap/forms/Input';
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
import ListPickKpiNorm from './ListPickKpiNorm';
import { addWorktrack } from '../../dailyWorkTracking/services';
import verifyPermissionHOC from '../../../HOC/verifyPermissionHOC';

const customStyles = {
	control: (provided) => ({
		...provided,
		padding: '10px',
		fontSize: '18px',
		borderRadius: '1.25rem',
	}),
};
// eslint-disable-next-line react/prop-types, no-unused-vars
const OrderTaskForm = ({ show, onClose, item, fetch }) => {
	const [dataSubMission, setDataSubMission] = React.useState([]);
	const dispatch = useDispatch();
	const users = useSelector((state) => state.employee.employees);
	const kpiNorms = useSelector((state) => state.kpiNorm.kpiNorms);
	const missions = useSelector((state) => state.mission.missions);
	const [missionOption, setMissionOption] = useState({});
	const [userOption, setUserOption] = useState({});
	const [mission, setMission] = React.useState({
		quantity: '',
		startDate: '',
		deadlineDate: '',
		priority: 2,
		note: '',
	});
	const [isOpen, setIsOpen] = React.useState(false);
	useEffect(() => {
		dispatch(fetchMissionList());
		dispatch(fetchEmployeeList());
	}, [dispatch]);

	useEffect(() => {
		dispatch(fetchKpiNormList());
	}, [dispatch]);

	useEffect(() => {
		setMission({ ...item });
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
	// show toast
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
		const dataValue = {
			kpiNorm_id: item.id,
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
		addWorktrack(dataValue).then((res) => {
			dataSubMission.forEach(async (item) => {
				await addWorktrack({
					mission_id: missionOption.id || null,
					priority: parseInt(mission.priority, 10) || null,
					note: mission.note || null,
					description: item.description || null,
					deadline: mission.deadlineDate || null,
					startDate: mission.startDate || null,
					kpiNorm_id: item.id,
					parent_id: res.data.data.id,
					quantity: parseInt(mission.quantity, 10) || null,
					user_id: role.includes('user') ? parseInt(userId, 10) : userOption.id,
					status: role.includes('user') ? 'pending' : 'accepted',
				});
			});
			fetch();
		});
		fetch();
		handleClose();
	};
	const handleShowPickListKpiNorm = () => {
		setIsOpen(!isOpen);
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
							<table className='w-100 mb-4 border'>
								<thead>
									<th className='p-3 border text-left'>Tên nhiệm vụ</th>
									<th className='p-3 border text-center'>Định mức KPI</th>
								</thead>
								<tbody>
									<tr>
										<td className='p-3 border text-left'>
											<b>
												{_.get(mission, 'name')
													? _.get(mission, 'name')
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
											value={
												mission.startDate ||
												moment().add(0, 'days').format('YYYY-MM-DD')
											}
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
											value={
												mission.deadline
												// moment().add(1, 'days').format('YYYY-MM-DD')
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

export default memo(OrderTaskForm);
