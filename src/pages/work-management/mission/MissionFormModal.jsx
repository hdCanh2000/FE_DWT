// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable react/prop-types */
import React, { useEffect, useRef, useState, memo } from 'react';
import moment from 'moment';
import { Button, Modal } from 'react-bootstrap';
import SelectComponent from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import Card, { CardBody } from '../../../components/bootstrap/Card';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import Input from '../../../components/bootstrap/forms/Input';
import Textarea from '../../../components/bootstrap/forms/Textarea';
import Icon from '../../../components/icon/Icon';
import Option from '../../../components/bootstrap/Option';
import Select from '../../../components/bootstrap/forms/Select';
import { fetchDepartmentList } from '../../../redux/slice/departmentSlice';
import { getMissionById, getAllKeys } from './services';
import { fetchUnitList } from '../../../redux/slice/unitSlice';

const ErrorText = styled.span`
	font-size: 14px;
	color: #e22828;
	margin-top: 5px;
`;

const MissionFormModal = ({ show, onClose, onSubmit, item }) => {
	const dispatch = useDispatch();
	const departments = useSelector((state) => state.department.departments);
	const units = useSelector((state) => state.unit.units);

	const [mission, setMission] = useState({});
	const [keysState, setKeysState] = useState([]);
	const [unitOption, setUnitOption] = useState({ label: '', value: '' });
	const [departmentOption, setDepartmentOption] = useState({ label: '', value: '' });
	const [departmentReplatedOption, setDepartmentRelatedOption] = useState([]);
	const [keyOption, setKeyOption] = useState([]);
	const [errors, setErrors] = useState({
		name: { errorMsg: '' },
		departmentOption: { errorMsg: '' },
	});
	const [logsMision, setLogsMission] = React.useState([]);

	const nameRef = useRef(null);
	const departmentRef = useRef(null);

	useEffect(() => {
		dispatch(fetchDepartmentList());
		dispatch(fetchUnitList());
	}, [dispatch]);

	const onValidate = (value, name) => {
		setErrors((prev) => ({
			...prev,
			[name]: { ...prev[name], errorMsg: value },
		}));
	};

	const validateFieldForm = (field, value) => {
		if (!value) {
			onValidate(true, field);
		}
	};

	const validateForm = () => {
		validateFieldForm('name', mission?.name);
		validateFieldForm('departmentOption', departmentOption?.value);
	};

	const handleClearErrorMsgAfterChange = (name) => {
		if (mission?.[name] || departmentOption?.value) {
			setErrors((prev) => ({
				...prev,
				[name]: { ...prev[name], errorMsg: '' },
			}));
		}
	};

	useEffect(() => {
		handleClearErrorMsgAfterChange('name');
		handleClearErrorMsgAfterChange('departmentOption');
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [mission?.name, departmentOption?.value]);

	useEffect(() => {
		if (item?.id) {
			getMissionById(item?.id).then((res) => {
				setMission(res.data?.data);
				setKeysState(res.data?.data?.keys);
				setDepartmentOption({
					...res.data?.data?.departments?.[0],
					id: res.data?.data?.departments?.[0].id,
					label: res.data?.data?.departments?.[0].name,
					value: res.data?.data?.departments?.[0].id,
				});
				setUnitOption({
					...res.data?.data?.unit,
					id: res.data?.data?.unit?.id,
					label: res.data?.data?.unit?.name,
					value: res.data?.data?.unit?.id,
				});
				setDepartmentRelatedOption(
					res.data?.data?.departments?.slice(1)?.map((department) => {
						return {
							id: department.id,
							label: department.name,
							value: department.id,
						};
					}),
				);
			});
		} else {
			setMission({
				id: null,
				name: '',
				description: '',
				kpiValue: '',
				startTime: '',
				endTime: '',
				status: 1,
				manday: '',
				quantity: '',
			});
			setKeysState([]);
			setUnitOption({});
			setDepartmentOption({});
			setDepartmentRelatedOption([]);
		}
	}, [item?.id]);

	// data logs mission
	useEffect(() => {
		if (item?.id) {
			getMissionById(item?.id).then((res) => {
				setLogsMission(res.data.logs);
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [mission]);
	useEffect(() => {
		async function getKey() {
			try {
				const response = await getAllKeys();
				const data = await response.data;
				setKeyOption(data);
			} catch (error) {
				setKeyOption([]);
			}
		}
		getKey();
	}, []);
	// hàm validate cho dynamic field form
	const prevIsValid = () => {
		if (keysState.length === 0) {
			return true;
		}
		const someEmpty = keysState.some(
			(key) => key.keyName === '' || key.keyValue === '' || key.keyType === '',
		);

		if (someEmpty) {
			// eslint-disable-next-line array-callback-return
			keysState.map((key, index) => {
				const allPrev = [...keysState];
				if (keysState[index].keyName === '') {
					allPrev[index].error.keyName = 'Nhập Tên chỉ số đánh giá!';
				}
				if (keysState[index].keyValue === '') {
					allPrev[index].error.keyValue = 'Nhập giá trị!';
				}
				if (keysState[index].keyType === '') {
					allPrev[index].error.keyType = 'Nhập loại key!';
				}
				setKeysState(allPrev);
			});
		}

		return !someEmpty;
	};

	// thêm field cho các giá trị key
	const handleAddFieldKey = () => {
		const initKeyState = {
			keyName: '',
			keyValue: '',
			keyType: '',
			error: {
				keyName: null,
				keyValue: null,
				keyType: null,
			},
		};
		if (prevIsValid()) {
			setKeysState((prev) => [...prev, initKeyState]);
		}
	};

	const handleChange = (e) => {
		const { value } = e.target;
		setMission({
			...mission,
			[e.target.name]: value,
		});
	};

	// hàm onchange cho input key
	const handleChangeKeysState = (index, event) => {
		event.preventDefault();
		event.persist();
		setKeysState((prev) => {
			return prev.map((key, i) => {
				if (i !== index) return key;
				return {
					...key,
					[event.target.name]: event.target.value,
					error: {
						...key.error,
						[event.target.name]:
							event.target.value.length > 0
								? null
								: `Vui lòng nhập đầy đủ thông tin!`,
					},
				};
			});
		});
	};

	// xoá các key theo index
	const handleRemoveKeyField = (e, index) => {
		setKeysState((prev) => prev.filter((state) => state !== prev[index]));
	};

	// close form
	const handleCloseForm = () => {
		onClose();
		setMission({
			id: null,
			name: '',
			description: '',
			kpiValue: '',
			startTime: '',
			endTime: '',
			status: 0,
			quantity: '',
			manday: '',
		});
		setKeysState([]);
		setUnitOption({});
		setDepartmentOption({});
		setDepartmentRelatedOption([]);
		setErrors({});
	};

	const userLogin = window.localStorage.getItem('name');
	const handleSubmit = () => {
		if (!mission?.id) {
			const newWorks = JSON.parse(JSON.stringify([]));
			const newLogs = [
				...newWorks,
				{
					id: 1,
					user: userLogin,
					type: 2,
					prevStatus: null,
					nextStatus: `Thêm mới`,
					missionName: mission?.name,
					time: moment().format('YYYY/MM/DD hh:mm'),
				},
			];
			const data = { ...mission, logs: newLogs };
			data.keys = keysState.map((key) => {
				return {
					keyName: key.keyName,
					keyValue: key.keyValue,
					keyType: key.keyType,
				};
			});
			data.status = 1;
			data.quantity = parseInt(data?.quantity, 10) || '';
			data.manday = parseInt(data?.manday, 10) || '';
			data.kpiValue = parseInt(data?.kpiValue, 10) || '';
			data.departmentId = departmentOption.id;
			data.departments = [
				{
					id: departmentOption.id,
					name: departmentOption.label,
				},
				...departmentReplatedOption.map((department) => {
					return {
						id: department.id,
						name: department.label,
					};
				}),
			];
			data.unitId = unitOption.id;
			data.unit = {
				id: unitOption.id,
				name: unitOption.label,
			};
			validateForm();
			if (!mission?.name) {
				nameRef.current.focus();
				return;
			}
			if (!prevIsValid()) {
				return;
			}
			onSubmit(data);
		} else {
			const newWorks = JSON.parse(JSON.stringify(logsMision || []));
			const newLogs = [
				...newWorks,
				{
					// eslint-disable-next-line no-unsafe-optional-chaining
					id: mission?.logs?.length + 1,
					user: userLogin,
					type: 2,
					prevStatus: null,
					nextStatus: `Chỉnh sửa`,
					missionName: mission?.name,
					time: moment().format('YYYY/MM/DD HH:mm'),
				},
			];
			const data = { ...mission, logs: newLogs };
			data.keys = keysState.map((key) => {
				return {
					keyName: key.keyName,
					keyValue: key.keyValue,
					keyType: key.keyType,
				};
			});
			data.status = 1;
			data.quantity = parseInt(data?.quantity, 10) || '';
			data.manday = parseInt(data?.manday, 10) || '';
			data.kpiValue = parseInt(data?.kpiValue, 10) || '';
			data.departmentId = departmentOption.id;
			data.departments = [
				{
					id: departmentOption.id,
					name: departmentOption.label,
				},
				...departmentReplatedOption.map((department) => {
					return {
						id: department.id,
						name: department.label,
					};
				}),
			];
			data.unitId = unitOption.id;
			data.unit = {
				id: unitOption.id,
				name: unitOption.label,
			};
			validateForm();
			if (!mission?.name) {
				nameRef.current.focus();
				return;
			}
			if (!prevIsValid()) {
				return;
			}
			onSubmit(data);
		}
		setMission({
			id: null,
			name: '',
			description: '',
			kpiValue: '',
			quantity: '',
			manday: '',
			startTime: '',
			endTime: '',
			status: 0,
		});
		setKeysState([]);
		setDepartmentOption({});
		setUnitOption({});
		setDepartmentRelatedOption([]);
	};
	const compare = ['>', '=', '<', '<=', '>='];
	return (
		<Modal show={show} onHide={handleCloseForm} size='lg' scrollable centered>
			<Modal.Header closeButton>
				<Modal.Title>{item?.id ? 'Cập nhật mục tiêu' : 'Thêm mới mục tiêu'}</Modal.Title>
			</Modal.Header>
			<Modal.Body className='px-4'>
				<div className='row'>
					<div className='col-md-12'>
						<form>
							<Card shadow='sm'>
								<CardBody>
									<div className='row g-4'>
										<FormGroup
											color='red'
											className='col-12'
											id='name'
											label='Tên mục tiêu'>
											<Input
												onChange={handleChange}
												value={mission.name || ''}
												name='name'
												ref={nameRef}
												placeholder='Tên mục tiêu'
												className='border border-2 rounded-0 shadow-none'
											/>
										</FormGroup>
										{errors?.name?.errorMsg && (
											<ErrorText>Vui lòng nhập tên mục tiêu</ErrorText>
										)}
										{/* Số lương - Đơn vị tính - Manday */}
										<FormGroup className='col-2' id='quantity' label='Số lượng'>
											<Input
												type='number'
												name='quantity'
												onChange={handleChange}
												value={mission.quantity || ''}
												placeholder='Số lượng'
												className='border border-2 rounded-0 shadow-none'
											/>
										</FormGroup>
										<FormGroup className='col-3' id='unit' label='Đơn vị tính'>
											<SelectComponent
												placeholder='Đơn vị tính'
												defaultValue={unitOption}
												value={unitOption}
												onChange={setUnitOption}
												options={units}
											/>
										</FormGroup>
										<FormGroup
											className='col-4'
											id='manday'
											label='Số ngày công cần thiết'>
											<Input
												type='number'
												name='manday'
												onChange={handleChange}
												value={mission.manday || ''}
												placeholder='Số ngày công cần thiết'
												className='border border-2 rounded-0 shadow-none'
											/>
										</FormGroup>
										{/* Giá trị KPI */}
										<FormGroup
											className='col-3'
											id='kpiValue'
											label='Giá trị KPI'>
											<Input
												type='number'
												name='kpiValue'
												onChange={handleChange}
												value={mission.kpiValue || ''}
												placeholder='Giá trị KPI'
												className='border border-2 rounded-0 shadow-none'
											/>
										</FormGroup>
										<FormGroup
											color='red'
											className='col-4'
											id='department'
											label='Phòng ban phụ trách'>
											<SelectComponent
												placeholder='Chọn phòng ban phụ trách'
												defaultValue={departmentOption}
												value={departmentOption}
												onChange={setDepartmentOption}
												options={departments}
												ref={departmentRef}
											/>
										</FormGroup>
										{errors?.departmentOption?.errorMsg && (
											<ErrorText>Vui lòng chọn phòng ban phụ trách</ErrorText>
										)}
										<FormGroup
											className='col-8'
											id='departmentReplatedOption'
											label='Phòng ban liên quan'>
											<SelectComponent
												placeholder=''
												defaultValue={departmentReplatedOption}
												value={departmentReplatedOption}
												onChange={setDepartmentRelatedOption}
												options={departments.filter(
													(department) =>
														department.id !== departmentOption?.id,
												)}
												isMulti
											/>
										</FormGroup>
										<div className='d-flex align-items-center justify-content-between'>
											<FormGroup
												className='w-50 mr-2'
												style={{ width: '45%', marginRight: 10 }}
												id='startTime'
												label='Ngày bắt đầu mục tiêu'
												isFloating>
												<Input
													name='startTime'
													placeholder='Ngày bắt đầu mục tiêu'
													onChange={handleChange}
													value={mission.startTime || ''}
													type='date'
													className='border border-2 rounded-0 shadow-none'
												/>
											</FormGroup>
											<FormGroup
												className='w-50 ml-2'
												style={{ width: '45%', marginLeft: 10 }}
												id='endTime'
												label='Ngày kết thúc mục tiêu'
												isFloating>
												<Input
													name='endTime'
													placeholder='Ngày kết thúc mục tiêu'
													onChange={handleChange}
													value={mission.endTime || ''}
													type='date'
													className='border border-2 rounded-0 shadow-none'
												/>
											</FormGroup>
										</div>
										<FormGroup
											className='col-12'
											id='description'
											label='Mô tả mục tiêu'>
											<Textarea
												name='description'
												onChange={handleChange}
												value={mission.description || ''}
												placeholder='Mô tả mục tiêu'
												className='border border-2 rounded-0 shadow-none'
											/>
										</FormGroup>
										<FormGroup>
											<Button variant='success' onClick={handleAddFieldKey}>
												Thêm tiêu chí đánh giá
											</Button>
										</FormGroup>
										{/* eslint-disable-next-line no-shadow */}
										{keysState?.map((item, index) => {
											return (
												<div
													// eslint-disable-next-line react/no-array-index-key
													key={index}
													className='mt-4 d-flex align-items-center justify-content-between'>
													<div style={{ width: '50%', marginRight: 5 }}>
														<FormGroup
															className='mr-2'
															id='name'
															label={`Chỉ số key ${index + 1}`}>
															<Select
																name='keyName'
																ariaLabel={`Chỉ số key ${
																	index + 1
																}`}
																className='border border-2 rounded-0 shadow-none'
																placeholder='Chọn chỉ số Key'
																value={item?.keyName}
																onChange={(e) =>
																	handleChangeKeysState(index, e)
																}>
																{keyOption.map((key) => (
																	<Option
																		key={`${key.name} (${key?.unit?.name})`}
																		value={`${key.name} (${key?.unit?.name})`}>
																		{`${key?.name} (${key?.unit?.name})`}
																	</Option>
																))}
															</Select>
														</FormGroup>
														{item.error?.keyName && (
															<ErrorText>
																{item.error?.keyName}
															</ErrorText>
														)}
													</div>
													<div style={{ width: '15%' }}>
														<FormGroup
															className='ml-2'
															id='type'
															label='So sánh'>
															<Select
																onChange={(e) =>
																	handleChangeKeysState(index, e)
																}
																value={item?.keyType}
																name='keyType'
																ariaLabel='So sánh'
																className='border border-2 rounded-0 shadow-none'
																placeholder='> = <'>
																{compare.map((element) => (
																	<Option
																		key={`${element}`}
																		value={`${element}`}>
																		{`${element}`}
																	</Option>
																))}
															</Select>
														</FormGroup>
														{item.error?.keyType && (
															<ErrorText>
																{item.error?.keyType}
															</ErrorText>
														)}
													</div>
													<div style={{ width: '30%', marginLeft: 5 }}>
														<FormGroup
															className='ml-2'
															id='name'
															label='Giá trị'>
															<Input
																onChange={(e) =>
																	handleChangeKeysState(index, e)
																}
																value={item?.keyValue || ''}
																name='keyValue'
																ariaLabel='Giá trị'
																className='border border-2 rounded-0 shadow-none'
																placeholder='VD: 100 , 1000 , ..'
															/>
														</FormGroup>
														{item.error?.keyValue && (
															<ErrorText>
																{item.error?.keyValue}
															</ErrorText>
														)}
													</div>
													<FormGroup>
														<Button
															color='light'
															variant='light'
															style={{
																background: 'transparent',
																border: 0,
															}}
															className='mt-4 h-100'
															onClick={(e) =>
																handleRemoveKeyField(e, index)
															}>
															<Icon icon='Trash' size='lg' />
														</Button>
													</FormGroup>
												</div>
											);
										})}
									</div>
								</CardBody>
							</Card>
						</form>
					</div>
				</div>
			</Modal.Body>
			<Modal.Footer>
				<Button variant='secondary' onClick={handleCloseForm}>
					Đóng
				</Button>
				<Button variant='primary' type='submit' onClick={handleSubmit}>
					Lưu mục tiêu
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default memo(MissionFormModal);
