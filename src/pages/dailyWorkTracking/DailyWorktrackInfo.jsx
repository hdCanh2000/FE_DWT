/* eslint-disable no-script-url */
/* eslint-disable react/jsx-no-script-url */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/prop-types */
import React, { useState, useEffect, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal } from 'react-bootstrap';
import { get, isEmpty } from 'lodash';
import styled from 'styled-components';
import { LIST_STATUS } from '../../utils/constants';
import { fetchMissionList } from '../../redux/slice/missionSlice';
import { fetchEmployeeList } from '../../redux/slice/employeeSlice';
import { fetchAssignTask } from '../../redux/slice/worktrackSlice';
import { downloadFileReport } from './services';

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
						<h5 className='text-info mb-2'>Thông tin định mức lao động</h5>
						<table className='w-100 border'>
							<thead>
								<tr>
									<th className='p-2 border text-left'>Tên định mức lao động</th>
									<th className='p-2 border text-center'>Định mức KPI</th>
									<th className='p-2 border text-center'>Số lượng</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td className='p-2 border text-left'>
										<b>
											{get(item, 'kpiNorm_name')
												? get(item, 'kpiNorm_name')
												: get(mission, 'kpiNorm.name')}
										</b>
									</td>
									<td className='p-2 border text-center'>
										<b>
											{item.id
												? get(item, 'kpiNorm.kpi_value')
												: get(item, 'kpi_value')}
										</b>
									</td>
									<td className='p-2 border text-center'>
										<b>
											{item.id
												? get(item, 'kpiNorm.quantity')
												: get(item, 'quantity')}
										</b>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
					<div className='col-12 px-4'>
						<h5 className='text-info mb-2'>Thông tin nhiệm vụ</h5>
						<table className='w-100 border'>
							<tr>
								<th className='p-2 border text-left'>Tên nhiệm vụ</th>
								<td className='p-2 border text-left'>{mission.name}</td>
							</tr>
							<tr>
								<th className='p-2 border text-left'>Nhiệm vụ cha</th>
								<td className='p-2 border text-left'>{parentOption.label}</td>
							</tr>
							<tr>
								<th className='p-2 border text-left'>Thuộc mục tiêu</th>
								<td className='p-2 border text-left'>{missionOption.label}</td>
							</tr>
							<tr>
								<th className='p-2 border text-left'>Người phụ trách</th>
								<td className='p-2 border text-left'>{userOption.label}</td>
							</tr>
							<tr>
								<th className='p-2 border text-left'>Ngày bắt đầu</th>
								<td className='p-2 border text-left'>{mission.startDate}</td>
							</tr>
							<tr>
								<th className='p-2 border text-left'>Hạn hoàn thành</th>
								<td className='p-2 border text-left'>{mission.deadline}</td>
							</tr>
							<tr>
								<th className='p-2 border text-left'>Độ ưu tiên</th>
								<td className='p-2 border text-left'>{`Cấp ${mission.priority}`}</td>
							</tr>
							<tr>
								<th className='p-2 border text-left'>Số lượng</th>
								<td className='p-2 border text-left'>{mission.quantity}</td>
							</tr>
							<tr>
								<th className='p-2 border text-left'>Ghi chú</th>
								<td className='p-2 border text-left'>{mission.note}</td>
							</tr>
						</table>
					</div>
					<div className='col-12 p-4'>
						{/* Tracking công việc */}
						<h5 className='text-info mb-2'>Danh sách tracking công việc</h5>
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
													)?.label
												}
											</td>
											<td>
												<ul className='mb-0'>
													{log?.files &&
														JSON.parse(log?.files)?.map((file) => (
															<li key={file}>
																<a
																	href='javascript:void(0)'
																	className=''
																	onClick={() =>
																		handleDowloadFile(file)
																	}>
																	{file}
																</a>
															</li>
														))}
												</ul>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</Styles>
					</div>
				</div>
			</Modal.Body>
		</Modal>
	);
};

export default memo(DailyWorktrackInfo);
