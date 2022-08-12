// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable react/prop-types */

import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import Select from 'react-select';
import styled from 'styled-components';
import Card, {
	CardBody,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../../../components/bootstrap/Card';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import Input from '../../../components/bootstrap/forms/Input';
import Textarea from '../../../components/bootstrap/forms/Textarea';
import Icon from '../../../components/icon/Icon';
import { getAllDepartments, getMissionById } from './services';

const ErrorText = styled.span`
	font-size: 14px;
	color: #e22828;
	margin-top: 5px;
`;

// const customStyles = {
// 	control: (provided) => ({
// 		...provided,
// 		padding: '4px',
// 		fontSize: '18px',
// 		borderRadius: '1.25rem',
// 	}),
// };

const MissionFormModal = ({ show, onClose, onSubmit, item }) => {
	const [mission, setMission] = useState({});
	const [keysState, setKeysState] = useState([]);
	const [departments, setDepartments] = useState([]);
	const [departmentOption, setDepartmentOption] = useState([]);
	const [errors, setErrors] = useState({
		name: { errorMsg: '' },
		kpiValue: { errorMsg: '' },
		departmentOption: { errorMsg: '' },
	});
	const [logsMision, setLogsMission] = React.useState([]);

	const nameRef = useRef(null);
	const kpiValueRef = useRef(null);
	const departmentRef = useRef(null);

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
		validateFieldForm('kpiValue', mission?.kpiValue);
		validateFieldForm('kpiValue', parseInt(mission?.kpiValue, 10) > 0);
		validateFieldForm('departmentOption', departmentOption.length);
	};

	const handleClearErrorMsgAfterChange = (name) => {
		if (mission?.[name] || departmentOption.length > 0) {
			setErrors((prev) => ({
				...prev,
				[name]: { ...prev[name], errorMsg: '' },
			}));
		}
	};

	useEffect(() => {
		handleClearErrorMsgAfterChange('name');
		handleClearErrorMsgAfterChange('kpiValue');
		handleClearErrorMsgAfterChange('departmentOption');
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [mission?.name, mission?.kpiValue, departmentOption?.length]);

	useEffect(() => {
		if (item?.id) {
			getMissionById(item?.id).then((res) => {
				setMission(res.data);
				setKeysState(res.data.keys);
				setDepartmentOption(
					res.data?.departments?.map((department) => {
						return {
							id: department.id,
							label: department.name,
							value: department.slug,
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
				startTime: moment().add(0, 'days').format('YYYY-MM-DD'),
				endTime: moment().add(0, 'days').format('YYYY-MM-DD'),
				status: 0,
			});
			setKeysState([]);
			setDepartmentOption([]);
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
		async function getDepartments() {
			try {
				const response = await getAllDepartments();
				const data = await response.data;
				setDepartments(
					data.map((department) => {
						return {
							id: department.id,
							label: department.name,
							value: department.slug,
						};
					}),
				);
			} catch (error) {
				setDepartments([]);
			}
		}
		getDepartments();
	}, []);

	// hàm validate cho dynamic field form
	const prevIsValid = () => {
		if (keysState.length === 0) {
			return true;
		}
		const someEmpty = keysState.some((key) => key.keyName === '' || key.keyValue === '');

		if (someEmpty) {
			// eslint-disable-next-line array-callback-return
			keysState.map((key, index) => {
				const allPrev = [...keysState];
				if (keysState[index].keyName === '') {
					allPrev[index].error.keyName = 'Nhập tên chỉ số key!';
				}
				if (keysState[index].keyValue === '') {
					allPrev[index].error.keyValue = 'Nhập giá trị key!';
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
			error: {
				keyName: null,
				keyValue: null,
			},
		};
		if (prevIsValid() && keysState?.length <= 3) {
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
			startTime: moment().add(0, 'days').format('YYYY-MM-DD'),
			endTime: moment().add(0, 'days').format('YYYY-MM-DD'),
			status: 0,
		});
		setKeysState([]);
		setDepartmentOption([]);
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
					missionId: mission?.id,
					missionName: mission?.name,
					time: moment().format('YYYY/MM/DD hh:mm'),
				},
			];
			const data = { ...mission, logs: newLogs };
			data.keys = keysState.map((key) => {
				return {
					keyName: key.keyName,
					keyValue: key.keyValue,
				};
			});
			data.status = 0;
			data.kpiValue = parseInt(data.kpiValue, 10);
			const departmentClone = [...departmentOption];
			data.departments = departmentClone.map((department) => {
				return {
					id: department.id,
					name: department.label,
					slug: department.value,
				};
			});
			validateForm();
			if (!mission?.name) {
				nameRef.current.focus();
				return;
			}
			if (parseInt(mission?.kpiValue, 10) <= 0 || !mission?.kpiValue) {
				kpiValueRef.current.focus();
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
					missionId: mission?.id,
					missionName: mission?.name,
					time: moment().format('YYYY/MM/DD HH:mm'),
				},
			];
			const data = { ...mission, logs: newLogs };
			data.keys = keysState.map((key) => {
				return {
					keyName: key.keyName,
					keyValue: key.keyValue,
				};
			});
			data.status = 0;
			data.kpiValue = parseInt(data.kpiValue, 10);
			const departmentClone = [...departmentOption];
			data.departments = departmentClone.map((department) => {
				return {
					id: department.id,
					name: department.label,
					slug: department.value,
				};
			});
			validateForm();
			if (!mission?.name) {
				nameRef.current.focus();
				return;
			}
			if (parseInt(mission?.kpiValue, 10) <= 0 || !mission?.kpiValue) {
				kpiValueRef.current.focus();
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
			startTime: moment().add(0, 'days').format('YYYY-MM-DD'),
			endTime: moment().add(0, 'days').format('YYYY-MM-DD'),
			status: 0,
		});
		setKeysState([]);
		setDepartmentOption([]);
	};

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
								<CardHeader>
									<CardLabel icon='Info' iconColor='success'>
										<CardTitle>Thông tin mục tiêu</CardTitle>
									</CardLabel>
								</CardHeader>
								<CardBody>
									<div className='row g-4'>
										<FormGroup
											className='col-12'
											id='name'
											label='Tên mục tiêu'>
											<Input
												onChange={handleChange}
												value={mission.name || ''}
												name='name'
												ref={nameRef}
												required
												placeholder='Tên mục tiêu'
												size='lg'
												className='border border-2 rounded-0 shadow-none'
											/>
										</FormGroup>
										{errors?.name?.errorMsg && (
											<ErrorText>Vui lòng nhập tên mục tiêu</ErrorText>
										)}
										<FormGroup
											className='col-12'
											id='description'
											label='Mô tả mục tiêu'>
											<Textarea
												name='description'
												onChange={handleChange}
												value={mission.description || ''}
												required
												size='lg'
												placeholder='Mô tả mục tiêu'
												className='border border-2 rounded-0 shadow-none'
											/>
										</FormGroup>
										<FormGroup
											className='col-12'
											id='kpiValue'
											label='Giá trị KPI'>
											<Input
												ref={kpiValueRef}
												type='number'
												name='kpiValue'
												onChange={handleChange}
												value={mission.kpiValue || ''}
												required
												size='lg'
												placeholder='Giá trị KPI'
												className='border border-2 rounded-0 shadow-none'
											/>
										</FormGroup>
										{errors?.kpiValue?.errorMsg && (
											<ErrorText>Vui lòng nhập giá trị KPI hợp lệ</ErrorText>
										)}
										<FormGroup
											className='col-12'
											id='kpiValue'
											label='Phòng ban phụ trách'>
											<Select
												placeholder='Chọn phòng ban phụ trách'
												defaultValue={departmentOption}
												value={departmentOption}
												onChange={setDepartmentOption}
												isMulti
												options={departments}
												ref={departmentRef}
											/>
										</FormGroup>
										{errors?.departmentOption?.errorMsg && (
											<ErrorText>
												Vui lòng chọn phòng ban cho nhiệm vụ
											</ErrorText>
										)}
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
													value={
														mission.startTime ||
														moment().add(0, 'days').format('YYYY-MM-DD')
													}
													type='date'
													size='lg'
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
													value={
														mission.endTime ||
														moment().add(0, 'days').format('YYYY-MM-DD')
													}
													type='date'
													size='lg'
													className='border border-2 rounded-0 shadow-none'
												/>
											</FormGroup>
										</div>
										<FormGroup>
											<Button variant='success' onClick={handleAddFieldKey}>
												Thêm chỉ số key
											</Button>
										</FormGroup>
										{/* eslint-disable-next-line no-shadow */}
										{keysState?.map((item, index) => {
											return (
												<div
													// eslint-disable-next-line react/no-array-index-key
													key={index}
													className='mt-4 d-flex align-items-center justify-content-between'>
													<div
														style={{
															width: '45%',
															marginRight: 10,
														}}>
														<FormGroup
															className='mr-2'
															id='name'
															label='Tên chỉ số key'>
															<Input
																onChange={(e) =>
																	handleChangeKeysState(index, e)
																}
																value={item?.keyName || ''}
																name='keyName'
																required
																size='lg'
																className='border border-2 rounded-0 shadow-none'
																placeholder='VD: Doanh thu, đơn hàng, ...'
															/>
														</FormGroup>
														{item.error?.keyName && (
															<ErrorText>
																{item.error?.keyName}
															</ErrorText>
														)}
													</div>
													<div style={{ width: '45%', marginLeft: 10 }}>
														<FormGroup
															className='ml-2'
															id='name'
															label='Giá trị key'>
															<Input
																onChange={(e) =>
																	handleChangeKeysState(index, e)
																}
																value={item?.keyValue || ''}
																name='keyValue'
																size='lg'
																required
																className='border border-2 rounded-0 shadow-none'
																placeholder='VD: 100 tỷ, 1000 đơn hàng, ..'
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
															size='lg'
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

export default MissionFormModal;
