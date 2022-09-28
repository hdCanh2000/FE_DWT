import React from 'react';
import PropTypes from 'prop-types';
import Card from '../../components/bootstrap/Card';

const border = {
	border: '1px solid #c8c7c7',
	minWidth: 50,
	borderLeft: 0,
};

const styleHead = {
	border: '1px solid #c8c7c7',
	width: '100%',
	height: '50px',
	lineHeight: '50px',
	borderLeft: 0,
	borderBottom: 0,
};

const TableCalendar = ({ rowsState }) => {
	const columns = () => {
		const date = new Date();
		const days = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
		const result = [];
		for (let i = 1; i <= days; i += 1) {
			result.push(i);
		}
		return result;
	};

	return (
		<Card className='w-100 h-100 card-body-scrollable'>
			<div style={styleHead}>
				<p className='m-0 d-block text-center fs-4 fw-bold'>Nhật trình công việc</p>
			</div>
			<table className='table table-modern mb-0'>
				<thead>
					<tr>
						{columns().map((item) => {
							return (
								<th key={item} style={border} className='text-center'>
									{item}
								</th>
							);
						})}
					</tr>
				</thead>
				<tbody>
					{rowsState?.map((row, index) => (
						// eslint-disable-next-line react/no-array-index-key
						<tr key={index}>
							{columns()?.map((column, i) => (
								<td
									// eslint-disable-next-line react/no-array-index-key
									key={i}
									style={border}
									className='w-100 h-100 text-center cursor-pointer'>
									{column}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
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
