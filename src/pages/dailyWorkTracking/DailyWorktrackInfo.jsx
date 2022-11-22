/* eslint-disable no-script-url */
/* eslint-disable react/jsx-no-script-url */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/prop-types */
import React, { useState, useEffect, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SelectComponent from 'react-select';
import { Modal } from 'react-bootstrap';
import { get, isEmpty } from 'lodash';
import styled from 'styled-components';
import FormGroup from '../../components/bootstrap/forms/FormGroup';
import Input from '../../components/bootstrap/forms/Input';
import Select from '../../components/bootstrap/forms/Select';
import { LIST_STATUS, PRIORITIES } from '../../utils/constants';
import Option from '../../components/bootstrap/Option';
import Textarea from '../../components/bootstrap/forms/Textarea';
import { fetchMissionList } from '../../redux/slice/missionSlice';
import { fetchEmployeeList } from '../../redux/slice/employeeSlice';
import { fetchAssignTask } from '../../redux/slice/worktrackSlice';
import { downloadFileReport } from './services';

const customStyles = {
	control: (provided) => ({
		...provided,
		padding: '10px',
		fontSize: '18px',
		borderRadius: '1.25rem',
	}),
};

const Styles = styled.div`
	table {
		border-spacing: 0;
		border: 1px solid black;
		width: 100%;
		tbody {
			overflow-y: auto;
		}
		tr {
			:last-child {
				td {
					border-bottom: 0;
				}
			}
		}

		th,
		td {
			margin: 0;
			padding: 0.5rem;
			border-bottom: 1px solid black;
			border-right: 1px solid black;

			:last-child {
				border-right: 1px;
			}
		}
	}
`;

const DailyWorktrackInfo = ({ show, onClose, item }) => {
	const dispatch = useDispatch();
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
		const dataParent = tasks?.find((ele) => ele.id === item?.parent_id);
		if (dataParent) {
			const userResponsible = dataParent?.users?.find(
				(user) => user.workTrackUsers.isResponsible === true,
			);
			setParentOption({
				...dataParent,
				label: `${get(dataParent, 'kpiNorm.name')} - ${get(userResponsible, 'name')}`,
				value: get(dataParent, 'id'),
			});
		}
	}, [tasks, item]);

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

	const handleClose = () => {
		onClose();
		setMission({});
		setMissionOption({});
		setUserOption({});
		setParentOption({});
	};

	const handleDowloadFile = async (file) => {
		const response = await downloadFileReport(file);
		let filename = file;
		const disposition = get(response.headers, 'content-disposition');
		if (disposition && disposition.indexOf('attachment') !== -1) {
			const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
			const matches = filenameRegex.exec(disposition);
			if (matches != null && matches[1]) {
				filename = matches[1].replace(/['"]/g, '');
			}
		}
		const url = window.URL.createObjectURL(
			new Blob([response.data], { type: get(response.headers, 'content-type') }),
		);
		const link = document.createElement('a');
		link.href = url;
		link.setAttribute('download', filename);
		document.body.appendChild(link);
		link.click();
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
										<th className='p-3 border text-left'>
											Tên định mức lao động
										</th>
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
											value={mission.name}
											type='text'
											disabled
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
											isDisabled
										/>
									</FormGroup>
								</div>
								<div className='col-4'>
									<FormGroup id='parent' label='Thuộc nhiệm vụ cha'>
										<SelectComponent
											placeholder='Thuộc nhiệm vụ cha'
											value={parentOption}
											isDisabled
										/>
									</FormGroup>
								</div>
								<div className='col-4'>
									<FormGroup id='userOption' label='Nguời phụ trách'>
										<SelectComponent
											style={customStyles}
											placeholder='Chọn nguời phụ trách'
											value={userOption}
											isDisabled
										/>
									</FormGroup>
								</div>
								<div className='col-3'>
									<FormGroup id='startDate' label='Ngày bắt đầu'>
										<Input
											name='startDate'
											placeholder='Ngày bắt đầu'
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
											value={mission.quantity || ''}
											placeholder='Số lượng'
											disabled
											className='border border-2 rounded-0 shadow-none'
										/>
									</FormGroup>
								</div>
								<div className='col-12'>
									<FormGroup id='note' label='Ghi chú'>
										<Textarea
											name='note'
											value={mission.note || ''}
											ariaLabel='Ghi chú'
											placeholder='Ghi chú'
											disabled
											className='border border-2 rounded-0 shadow-none'
										/>
									</FormGroup>
								</div>
							</div>
							{/* Tracking công việc */}
							<div className='row g-2'>
								<div className='col-12'>
									<h5>Danh sách tracking công việc</h5>
									<Styles>
										<table>
											<thead>
												<tr>
													<th className='text-center'>Ngày thực hiện</th>
													<th>Trạng thái công việc</th>
													<th>Danh sách file báo cáo</th>
												</tr>
											</thead>
											<tbody className='overflow-scroll'>
												{item?.workTrackLogs?.map((log) => (
													<tr>
														<td className='text-center'>{log?.date}</td>
														<td>
															{
																LIST_STATUS.find(
																	(st) => st.value === log.status,
																).label
															}
														</td>
														<td>
															<ul className='mb-0'>
																{JSON.parse(log.files)?.map(
																	(file) => (
																		<li key={file}>
																			<a
																				href='javascript:void(0)'
																				className=''
																				onClick={() =>
																					handleDowloadFile(
																						file,
																					)
																				}>
																				{file}
																			</a>
																		</li>
																	),
																)}
															</ul>
														</td>
													</tr>
												))}
											</tbody>
										</table>
									</Styles>
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
