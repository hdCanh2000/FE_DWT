// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import PropTypes from 'prop-types';
// import ContentEditable from 'react-contenteditable';
import Button from '../../components/bootstrap/Button';
import Card from '../../components/bootstrap/Card';
import Icon from '../../components/icon/Icon';

const minWith150 = {
	minWidth: 150,
};

const styleIndex = {
	border: '1px solid #c8c7c7',
	maxWidth: 35,
};

const border = {
	border: '1px solid #c8c7c7',
};

const styleHead = {
	border: '1px solid #c8c7c7',
	width: '100%',
	height: '50px',
	lineHeight: '50px',
	borderBottom: 0,
};

// eslint-disable-next-line no-unused-vars
const TableWorkTrack = ({
	rowsState,
	handleAddRow,
	// handleChangeRowState,
	handleRemoveRowField,
}) => {
	const columns = ['STT', 'Nhiệm vụ', 'Số lượng', 'ĐVT', 'Ghi chú', 'Thời hạn', 'KH dự kiến'];

	return (
		<Card className='w-100 h-100'>
			<div style={styleHead}>
				<p className='m-0 d-block text-center fs-4 fw-bold'>Hạng mục</p>
			</div>
			<table className='table table-modern mb-0'>
				<thead>
					<tr>
						{columns.map((item, index) => {
							if (index === 0)
								return (
									<th
										key={item}
										colSpan='2'
										style={border}
										className='text-center'>
										{item}
									</th>
								);
							return (
								<th key={item} style={border} className='text-center'>
									{item}
								</th>
							);
						})}
					</tr>
				</thead>
				<tbody>
					{rowsState?.map((item, index) => (
						// eslint-disable-next-line react/no-array-index-key
						<tr key={index}>
							<td className='text-center' style={styleIndex}>
								{index + 1}
							</td>
							<td
								onClick={(e) => handleRemoveRowField(e, index)}
								className='text-center cursor-pointer'
								style={styleIndex}>
								<Icon icon='Delete' size='lg' />
							</td>
							<td style={minWith150} contentEditable>
								<div>{item.name}</div>
							</td>
							<td contentEditable>{item.amount}</td>
							<td contentEditable>{item.unit}</td>
							<td contentEditable>{item.descriptions}</td>
							<td contentEditable>{item.dateLine}</td>
							<td contentEditable>{item.plant}</td>
						</tr>
					))}
				</tbody>
			</table>
			<Button
				color='success'
				size='lg'
				isLight
				className='mt-4 w-100 h-100 btn-circle border'
				icon='Add'
				onClick={handleAddRow}
			/>
		</Card>
	);
};

TableWorkTrack.propTypes = {
	// eslint-disable-next-line react/forbid-prop-types
	rowsState: PropTypes.array,
	handleAddRow: PropTypes.func,
	// handleChangeRowState: PropTypes.func,
	handleRemoveRowField: PropTypes.func,
};
TableWorkTrack.defaultProps = {
	rowsState: [],
	handleAddRow: null,
	// handleChangeRowState: null,
	handleRemoveRowField: null,
};

export default TableWorkTrack;
