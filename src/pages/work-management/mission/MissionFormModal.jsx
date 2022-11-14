/* eslint-disable react/prop-types */
import React, { useEffect, useRef, useState, memo } from 'react';
import _ from 'lodash';
import { toast } from 'react-toastify';
import { Button, Modal } from 'react-bootstrap';
import SelectComponent from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import Card, { CardBody } from '../../../components/bootstrap/Card';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import Input from '../../../components/bootstrap/forms/Input';
import Textarea from '../../../components/bootstrap/forms/Textarea';
import { fetchDepartmentList } from '../../../redux/slice/departmentSlice';
import { fetchUnitList } from '../../../redux/slice/unitSlice';
import { fetchMissionList } from '../../../redux/slice/missionSlice';
import { addResource, updateResouce } from '../../../api/fetchApi';

const ErrorText = styled.span`
	font-size: 14px;
	color: #e22828;
	margin-top: 5px;
`;
const MissionFormModal = ({ show, onClose, item }) => {
	const dispatch = useDispatch();
	const departments = useSelector((state) => state.department.departments);
	const units = useSelector((state) => state.unit.units);
	const [mission, setMission] = useState({});
	const [unitOption, setUnitOption] = useState({ label: '', value: '' });
	const [departmentOption, setDepartmentOption] = useState({ label: '', value: '' });
	const [departmentReplatedOption, setDepartmentRelatedOption] = useState({
		label: '',
		value: '',
	});
	const [errors, setErrors] = useState({
		name: { errorMsg: '' },
		departmentOption: { errorMsg: '' },
	});
	const nameRef = useRef(null);
	const departmentRef = useRef(null);

	useEffect(() => {
		dispatch(fetchDepartmentList());
		dispatch(fetchUnitList());
	}, [dispatch]);

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
		setMission(item);
		if (!item.id) {
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
			setUnitOption({});
			setDepartmentOption({});
			setDepartmentRelatedOption({});
		} else {
			setMission({ ...item });
			setUnitOption({
				...item.unit,
				label: _.get(item, 'unit.name'),
				value: _.get(item, 'unit.id'),
			});
			setDepartmentOption({
				...item.departments.filter((i) => i.missionDepartments?.isResponsible)[0],
				label: item.departments.filter((i) => i.missionDepartments?.isResponsible)[0]?.name,
				value: item.departments.filter((i) => i.missionDepartments?.isResponsible)[0]?.id,
			});
			setDepartmentRelatedOption({
				...item.departments.filter((i) => !i.missionDepartments?.isResponsible)[0],
				label: item.departments.filter((i) => !i.missionDepartments?.isResponsible)[0]
					?.name,
				value: item.departments.filter((i) => !i.missionDepartments?.isResponsible)[0]?.id,
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [item?.id]);

	const handleChange = (e) => {
		const { value } = e.target;
		setMission({
			...mission,
			[e.target.name]: value,
		});
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
		setUnitOption({});
		setDepartmentOption({});
		setDepartmentRelatedOption({});
		setErrors({});
	};

	const handleSubmitMissionForm = async () => {
		const data = { ...mission };
		data.quantity = parseInt(mission.quantity, 10) || null;
		data.manday = parseInt(mission.manday, 10) || null;
		data.kpiValue = parseInt(mission.kpiValue, 10) || null;
		data.responsibleDepartment_id = departmentOption.id;
		data.relatedDepartment_id = departmentReplatedOption.id || null;
		data.unit_id = unitOption.id || null;
		if (data.id) {
			try {
				const response = await updateResouce('/api/missions', data);
				await response.data;
				toast.success('Cập nhật mục tiêu thành công!', {
					position: toast.POSITION.TOP_RIGHT,
					autoClose: 1000,
				});
				dispatch(fetchMissionList());
				handleCloseForm();
			} catch (error) {
				toast.error('Cập nhật mục tiêu không thành công!', {
					position: toast.POSITION.TOP_RIGHT,
					autoClose: 1000,
				});
			}
		} else {
			try {
				const response = await addResource('/api/missions', data);
				await response.data;
				toast.success('Thêm mục tiêu thành công!', {
					position: toast.POSITION.TOP_RIGHT,
					autoClose: 1000,
				});
				dispatch(fetchMissionList());
				handleCloseForm();
			} catch (error) {
				toast.error('Thêm mục tiêu không thành công!', {
					position: toast.POSITION.TOP_RIGHT,
					autoClose: 1000,
				});
			}
		}
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
				<Button variant='primary' type='submit' onClick={handleSubmitMissionForm}>
					Lưu mục tiêu
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default memo(MissionFormModal);
