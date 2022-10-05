// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable jsx-a11y/click-events-have-key-events */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import Modal from 'react-bootstrap/Modal';
import Card from '../../components/bootstrap/Card';
import DailyWorktrackForm from './DailyWorktrackForm';
import { addWorktrackLog } from './services';
import { fetchWorktrackList } from '../../redux/slice/worktrackSlice';

const styleHead = {
	border: '1px solid #c8c7c7',
	width: '100%',
	height: '75px',
	padding: '15px',
};

const columns = () => {
	const date = new Date();
	const days = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
	const result = [];
	for (let i = 1; i <= days; i += 1) {
		result.push({
			day: i,
			date: `${i > 10 ? i : `0${i}`}-${date.getMonth() + 1}-${date.getFullYear()}`,
		});
	}
	return result;
};

const renderColor = (status) => {
	switch (status) {
		case 'inProgress':
			return '#ffc000';
		case 'completed':
			return '#c5e0b3';
		case 'expired':
			return '#f97875';
		default:
			return 'transparent';
	}
};

const DailyWorktrackingModal = ({ data, show, handleClose }) => {
	const dispatch = useDispatch();
	const [showForm, setShowForm] = useState(false);
	const [dataShow, setDataShow] = useState({
		row: {},
		column: {},
		valueForm: {},
	});

	useEffect(() => {
		dispatch(fetchWorktrackList(data.user_id));
	}, [dispatch, data.user_id, showForm]);

	const handleCloseForm = () => {
		setShowForm(false);
		setDataShow({
			valueForm: {},
			row: {},
		});
	};

	const handleShowForm = (row, item) => {
		setShowForm(true);
		setDataShow({
			valueForm: item,
			row,
		});
	};

	const handleSubmit = (item) => {
		const dataSubmit = {
			status: item.status,
			date: dataShow.valueForm.date,
			note: item.note,
			workTrack_id: data.id,
		};
		addWorktrackLog(dataSubmit)
			.then(() => {
				handleCloseForm();
				dispatch(fetchWorktrackList(data.user_id));
				window.location.reload();
			})
			.catch((err) => {
				// eslint-disable-next-line no-console
				console.log(err);
			});
	};

	return (
		<Modal
			show={show}
			onHide={handleClose}
			aria-labelledby='contained-modal-title-vcenter'
			backdrop='static'
			size='xl'
			keyboard={false}
			centered>
			<Modal.Header closeButton className='text-center pb-0'>
				<Modal.Title className='text-center w-100'>
					Báo cáo công việc: {data?.kpiNorm?.name}
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Card className='w-100 h-100 p-4'>
					<div
						style={styleHead}
						className='d-flex justify-content-center align-items-center'>
						<p className='m-0 d-block text-center fs-4 fw-bold'>Nhật trình công việc</p>
					</div>
					<table className='table table-modern mb-0 py-4'>
						<thead>
							{data?.workTrackLogs?.length > 0 ? (
								data?.workTrackLogs?.map((row, index) => {
									return (
										// eslint-disable-next-line react/no-array-index-key
										<tr key={index} className='d-flex flex-wrap'>
											{columns().map((item) => {
												return (
													<th
														key={item?.day}
														style={{
															border: '1px solid #c8c7c7',
															background: renderColor(
																new Date(row.date).getTime() -
																	new Date(
																		item.date,
																	).getTime() ===
																	0
																	? row.status
																	: '',
															),
														}}
														onClick={() => handleShowForm(row, item)}
														className='text-center mb-2 rounded-0 cursor-pointer'>
														<span className='d-block'>Ngày</span>
														{item?.day}
													</th>
												);
											})}
										</tr>
									);
								})
							) : (
								<tr className='d-flex flex-wrap'>
									{columns().map((item) => {
										return (
											<th
												key={item?.day}
												style={{
													border: '1px solid #c8c7c7',
												}}
												onClick={() => handleShowForm({}, item)}
												className='text-center mb-2 rounded-0 cursor-pointer'>
												<span className='d-block'>Ngày</span>
												{item?.day}
											</th>
										);
									})}
								</tr>
							)}
						</thead>
					</table>
				</Card>
			</Modal.Body>
			<DailyWorktrackForm
				data={dataShow}
				show={showForm}
				handleClose={handleCloseForm}
				handleSubmit={handleSubmit}
			/>
		</Modal>
	);
};

DailyWorktrackingModal.propTypes = {
	show: PropTypes.bool,
	handleClose: PropTypes.func,
	// eslint-disable-next-line react/forbid-prop-types
	data: PropTypes.object,
};
DailyWorktrackingModal.defaultProps = {
	show: false,
	handleClose: null,
	data: null,
};

export default DailyWorktrackingModal;
