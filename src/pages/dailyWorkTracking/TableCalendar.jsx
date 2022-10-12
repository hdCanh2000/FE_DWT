/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Card from '../../components/bootstrap/Card';
import DailyWorktrackForm from './DailyWorktrackForm';

const border = {
	border: '1px solid #c8c7c7',
	minWidth: 50,
	borderLeft: 0,
};

const styleHead = {
	border: '1px solid #c8c7c7',
	width: '100%',
	height: '75px',
	padding: '15px',
	borderLeft: 0,
	borderBottom: 0,
};

const columns = () => {
	const date = new Date();
	const days = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
	const result = [];
	for (let i = 1; i <= days; i += 1) {
		result.push({
			day: i,
			date: `${i}/${date.getMonth() + 1}/${date.getFullYear()}`,
		});
	}
	return result;
};

const TableCalendar = ({ rowsState }) => {
	const [show, setShow] = useState(false);
	const [data, setData] = useState({
		row: {},
		column: {},
		valueForm: {},
	});

	const handleClose = () => setShow(false);

	const handleShow = (row, column) => {
		setShow(true);
		setData({
			row,
			column,
			valueForm: row?.trackings?.find(
				(item) => new Date(item.date).getTime() - new Date(column.date).getTime() === 0,
			),
		});
	};

	const renderColor = (status) => {
		switch (status) {
			case 1:
				return '#ffc000';
			case 2:
				return '#c5e0b3';
			case 3:
				return '#f97875';
			default:
				return 'transparent';
		}
	};

	const handleSubmit = (item) => {
		// eslint-disable-next-line no-console
		console.log(item);
	};

	return (
		<Card className='w-100 h-100 card-body-scrollable'>
			<div style={styleHead} className='d-flex justify-content-center align-items-center'>
				<p className='m-0 d-block text-center fs-4 fw-bold'>Nhật trình công việc</p>
			</div>
			<table className='table table-modern mb-0'>
				<thead>
					<tr>
						{columns().map((item) => {
							return (
								<th key={item.day} style={border} className='text-center rounded-0'>
									{item.day}
								</th>
							);
						})}
					</tr>
				</thead>
				<tbody>
					{rowsState?.map((row, index) => (
						// eslint-disable-next-line react/no-array-index-key
						<tr key={index}>
							{columns()?.map((column) => (
								<td
									key={column.day}
									style={{
										border: '1px solid #c8c7c7',
										minWidth: 50,
										borderLeft: 0,
										background: renderColor(
											row?.trackings?.find(
												(item) =>
													new Date(item.date).getTime() -
														new Date(column.date).getTime() ===
													0,
											)?.status,
										),
									}}
									onClick={() => handleShow(row, column)}
									className='w-100 h-100 text-center rounded-0 cursor-pointer'>
									{column?.day}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
			<DailyWorktrackForm
				data={data}
				show={show}
				handleClose={handleClose}
				handleSubmit={handleSubmit}
			/>
		</Card>
	);
};

TableCalendar.propTypes = {
	// eslint-disable-next-line react/forbid-prop-types
	rowsState: PropTypes.array,
};
TableCalendar.defaultProps = {
	rowsState: [],
};

export default TableCalendar;
