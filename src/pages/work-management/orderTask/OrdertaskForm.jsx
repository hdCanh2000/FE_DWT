// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable react/prop-types */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable eslint-comments/no-duplicate-disable */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-shadow */
import React, { useState, useEffect, memo } from 'react';
// import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import SelectComponent from 'react-select';
import { Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';
import Page from '../../../layout/Page/Page';
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
import Icon from '../../../components/icon/Icon';
import CustomSelect from '../../../components/form/CustomSelect';
import { fetchUnitList } from '../../../redux/slice/unitSlice';
import verifyPermissionHOC from '../../../HOC/verifyPermissionHOC';
import NotPermission from '../../presentation/auth/NotPermission';
import ListPickKpiNorm from './ListPickKpiNorm';
import { addWorktrack } from '../../dailyWorkTracking/services';
// import ListPickKpiNorm from './ListPickKpiNorm';
const customStyles = {
	control: (provided) => ({
		...provided,
		padding: '10px',
		fontSize: '18px',
		borderRadius: '1.25rem',
	}),
};
// eslint-disable-next-line react/prop-types, no-unused-vars
const OrderTaskForm = ({ show, onClose, item  }) => {
	const [dataSubMission, setDataSubMission] = React.useState([]);
	const dispatch = useDispatch();
	const departments = useSelector((state) => state.department.departments);
	const users = useSelector((state) => state.employee.employees);
	const kpiNorms = useSelector((state) => state.kpiNorm.kpiNorms);
	const missions = useSelector((state) => state.mission.missions);
	const [kpiNormOptions, setKpiNormOptions] = useState([]);
	const [missionOption, setMissionOption] = useState({});
	const [departmentReplatedOption, setDepartmentRelatedOption] = useState([]);
	const [userOption, setUserOption] = useState({ label: '', value: '' });
	const [userReplatedOption, setUserRelatedOption] = useState([]);
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
		setKpiNormOptions(item?.kpiNorm || []);
		setMissionOption({ ...item?.parent });
		// eslint-disable-next-line no-unsafe-optional-chaining
		setDepartmentRelatedOption(item?.departmentReplated || []);
		setUserOption({ ...item?.user });
		// eslint-disable-next-line no-unsafe-optional-chaining
		setUserRelatedOption(item?.userReplated || []);
	}, [item]);
	// show toast
	const handleChange = (e) => {
		const { value, name } = e.target;
		setMission({
			...mission,
			[name]: value,
		});
	};
	// hàm onchange chọn nhiệm vụ
	const handleChangeKpiNormOption = (index, event) => {
		setKpiNormOptions((prev) => {
			return prev.map((key, i) => {
				if (i !== index) return key;
				return {
					...key,
					...event,
					[event?.target?.name]: event?.target?.value,
				};
			});
		});
	};
	// xoá các nhiệm vụ theo index
	const handleRemoveKpiNormField = (e, index) => {
		setKpiNormOptions((prev) => prev.filter((state) => state !== prev[index]));
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
					kpiNorm_id: item.id,
					parent_id: res.data.data.id,
					quantity: item.quantity,
				});
			});
		});
		onClose();
		setMission({});
		setKpiNormOptions([]);
		setMissionOption({});
		setDepartmentRelatedOption([]);
		setUserOption({});
		setUserRelatedOption([]);
	};
	const handleShowPickListKpiNorm = () => {
		setIsOpen(!isOpen);
	};
	return (
		<Modal show={show} onHide={onClose} size='lg'>
			<Page container='fluid'>
				{verifyPermissionHOC(
					<div className='row mx-4 px-4 my-4'>
						<Card className='p-4 w-100 m-auto'>
							<CardHeader className='py-2'>
								<CardLabel>
									<CardTitle className='fs-4 ml-0'>Giao nhiệm vụ</CardTitle>
								</CardLabel>
								<CardActions>
									<FormGroup>
										<OverlayTrigger
											overlay={
												<Tooltip id='addSubMission'>
													Thêm nhiệm vụ phụ
												</Tooltip>
											}>
											<Button
												color='success'
												type='button'
												icon='Plus'
												className='d-block w-10'
												onClick={handleShowPickListKpiNorm}>
												Thêm nhiệm vụ
											</Button>
										</OverlayTrigger>
									</FormGroup>
								</CardActions>
							</CardHeader>
							<div className='col-12 p-4'>
								<div className='row g-4'>
									<Card>
										<CardHeader className='py-2'>
											<CardLabel>
												<CardTitle className='fs-5 ml-0'>
													Thông tin chi tiết nhiệm vụ
												</CardTitle>
											</CardLabel>
										</CardHeader>
										<div className='col-12'>
											<table
												style={{
													width: '100%',
													marginLeft: '20px',
													marginBottom: '20px',
												}}>
												<tr style={{ height: '30px' }}>
													<td colSpan='2'>Tên nhiệm vụ : {item?.name}</td>
												</tr>
												<tr style={{ height: '30px' }}>
													<td>Đơn vị :{item?.unit?.name}</td>
													<td>Số ngày công cần thiết : {item?.manday}</td>
												</tr>
												<tr style={{ height: '30px' }}>
													<td>
														Vị trí chuyên môn : {item?.position?.name}
													</td>
													<td>
														Thuộc phòng ban : {item?.department?.name}
													</td>
												</tr>
												<tr style={{ height: '30px' }}>
													<td colSpan='2'>
														Mô tả nhiệm vụ : {item?.description}
													</td>
												</tr>
											</table>
										</div>
									</Card>
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
										<div className='col-6'>
											<FormGroup
												id='departmentReplatedOption'
												label='Phòng ban hỗ trợ'>
												<SelectComponent
													style={customStyles}
													placeholder=''
													defaultValue={departmentReplatedOption}
													value={departmentReplatedOption}
													onChange={setDepartmentRelatedOption}
													options={departments.filter(
														(department) =>
															department.id !== item?.departmentId,
													)}
													isMulti
												/>
											</FormGroup>
										</div>
										<div className='col-6'>
											<FormGroup id='userReplatedOption' label='Người hỗ trợ'>
												<SelectComponent
													style={customStyles}
													placeholder=''
													defaultValue={userReplatedOption}
													value={userReplatedOption}
													onChange={setUserRelatedOption}
													options={users.filter(
														(user) => user.id !== userOption?.id,
													)}
													isMulti
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
											<FormGroup
												id='deadlineDate'
												label='Hạn ngày hoàn thành'>
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
									{/* Thời gian bắt đầu - Thời gian dự kiến */}
									
									{/* Hạn ngày hoàn thành - Thời hạn hoàn thành */}
									<div className='row g-2'>
										<div className='col-12'>
											{/* eslint-disable-next-line no-shadow */}
											{kpiNormOptions?.map((item, index) => {
												return (
													<div
														// eslint-disable-next-line react/no-array-index-key
														key={index}
														className='row mt-4 d-flex align-items-center justify-content-between'>
														<div
															style={{
																width: '4%',
																marginLeft: '5px',
															}}>
															{index + 1}.
														</div>
														<div style={{ width: '90%' }}>
															<div className='w-100'>
																<FormGroup id='name'>
																	<OverlayTrigger
																		overlay={
																			<Tooltip id='addSubMission'>
																				Chọn nhiệm vụ phụ
																			</Tooltip>
																		}>
																		<CustomSelect
																			placeholder='Chọn nhiệm vụ phụ'
																			value={item}
																			onChange={(e) => {
																				handleChangeKpiNormOption(
																					index,
																					e,
																				);
																			}}
																			options={kpiNorms}
																		/>
																	</OverlayTrigger>
																</FormGroup>
															</div>
														</div>
														<div style={{ width: '4%' }}>
															<div className='w-100'>
																<Button
																	color='light'
																	variant='light'
																	size='lg'
																	className='h-100 bg-transparent border-0'
																	onClick={(e) =>
																		handleRemoveKpiNormField(
																			e,
																			index,
																		)
																	}>
																	<Icon icon='Trash' size='lg' />
																</Button>
															</div>
														</div>
													</div>
												);
											})}
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
					</div>,
					['admin'],
					<NotPermission />,
				)}
			</Page>
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
