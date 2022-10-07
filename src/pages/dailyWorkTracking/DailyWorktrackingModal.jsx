// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable jsx-a11y/click-events-have-key-events */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import Modal from 'react-bootstrap/Modal';
import Card from '../../components/bootstrap/Card';
import DailyWorktrackForm from './DailyWorktrackForm';
import { addWorktrackLog, updateWorktrackLog } from './services';
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
			date: `${i >= 10 ? i : `0${i}`}-${date.getMonth() + 1}-${date.getFullYear()}`,
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

// const formatDate = (date = '') => {
// 	const tmp = date.split('-');
// 	const year = tmp[2];
// 	const month = tmp[1];
// 	const d = tmp[0];
// 	return `${month}/${d}/${year}`;
// };

const DailyWorktrackingModal = ({ data, show, handleClose }) => {
	const dispatch = useDispatch();
	const [showForm, setShowForm] = useState(false);
	const [dataShow, setDataShow] = useState({
		row: {},
		column: {},
		valueForm: {},
	});

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
			id: item.data?.row?.id,
			status: item.status,
			date: dataShow.valueForm.date,
			note: item.note,
			workTrack_id: data.id,
		};
		if (item?.data?.row?.id) {
			updateWorktrackLog(dataSubmit)
				.then(() => {
					handleCloseForm();
					dispatch(fetchWorktrackList(data.user_id));
					window.location.reload();
				})
				.catch((err) => {
					// eslint-disable-next-line no-console
					console.log(err);
				});
		} else {
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
		}
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
							<tr className='d-flex flex-wrap'>
								{columns().map((item) => {
									return (
										<th
											key={item?.day}
											style={{
												border: '1px solid #c8c7c7',
												backgroundColor: renderColor(
													data?.workTrackLogs?.find(
														(i) => i?.date === item?.date,
													)?.status,
												),
												// background: renderColor(
												// 	new Date(
												// 		data?.workTrackLogs?.find(
												// 			(i) =>
												// 				new Date(i?.date).getTime() -
												// 					new Date(
												// 						formatDate(item?.date),
												// 					).getTime() ===
												// 				0,
												// 		)?.date,
												// 	).getTime() -
												// 		new Date(
												// 			formatDate(item?.date),
												// 		).getTime() ===
												// 		0
												// 		? data?.workTrackLogs?.find(
												// 				(i) =>
												// 					new Date(i?.date).getTime() -
												// 						new Date(
												// 							formatDate(item?.date),
												// 						).getTime() ===
												// 					0,
												// 		  ).status
												// 		: '',
												// ),
											}}
											onClick={() =>
												handleShowForm(
													data?.workTrackLogs?.find(
														(i) => i?.date === item?.date,
													),
													item,
												)
											}
											className='text-center mb-2 rounded-0 cursor-pointer'>
											<span className='d-block'>Ngày</span>
											{item?.day}
										</th>
									);
								})}
							</tr>
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