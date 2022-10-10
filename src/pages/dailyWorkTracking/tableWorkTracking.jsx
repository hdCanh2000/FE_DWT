/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect } from 'react';
import SelectComponent from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import ContentEditable from 'react-contenteditable';
import Card from '../../components/bootstrap/Card';
import Input from '../../components/bootstrap/forms/Input';
import { fetchUnitList } from '../../redux/slice/unitSlice';

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
	height: '75px',
	padding: '15px',
	borderBottom: 0,
};

const TableWorkTracking = ({ rowsState, handleChangeRowState }) => {
	const columns = ['STT', 'Nhiệm vụ', 'Số lượng', 'ĐVT', 'Ghi chú', 'Thời hạn', 'KH dự kiến'];
	const dispatch = useDispatch();
	const units = useSelector((state) => state.unit.units);

	useEffect(() => {
		dispatch(fetchUnitList());
	}, [dispatch]);

	return (
		<Card className='w-100 h-100'>
			<div style={styleHead} className='d-flex justify-content-between align-items-center'>
				<p className='m-0 d-block fs-4 fw-bold'>Danh sách nhiệm vụ</p>
			</div>
			<table className='table table-modern mb-0'>
				<thead>
					<tr>
						{columns.map((item) => {
							return (
								<th key={item} style={border} className='text-center'>
									{item}
								</th>
							);
						})}
					</tr>
				</thead>
				<tbody>
					{rowsState?.map((item, index) => {
						return (
							// eslint-disable-next-line react/no-array-index-key
							<tr key={index}>
								<td className='text-center' style={styleIndex}>
									{index + 1}
								</td>
								<ContentEditable
									tagName='td'
									style={minWith150}
									html={item?.name}
									disabled
									onChange={(e) => handleChangeRowState(index, e, 'name')}
								/>
								<ContentEditable
									tagName='td'
									html={`${item?.quantity}`}
									disabled
									onChange={(e) => handleChangeRowState(index, e, 'quantity')}
								/>
								<td style={{ border: '1px solid #c8c7c7', padding: 0 }}>
									<SelectComponent
										placeholder='Đơn vị tính'
										defaultValue={item?.unit}
										value={item?.unit}
										onChange={(e) => handleChangeRowState(index, e, 'unit')}
										options={units}
										isDisabled
									/>
								</td>
								<ContentEditable
									tagName='td'
									html={item?.note}
									disabled
									onChange={(e) => handleChangeRowState(index, e, 'note')}
								/>
								<td style={{ border: '1px solid #c8c7c7', padding: 0 }}>
									<Input
										name='deadline'
										placeholder='Thời hạn'
										onChange={(e) => handleChangeRowState(index, e, 'deadline')}
										value={item?.deadline}
										type='date'
										disabled
										ariaLabel='Thời hạn'
										className='border border-2 rounded-0 shadow-none'
									/>
								</td>
								<ContentEditable
									tagName='td'
									html={item?.plan}
									disabled
									onChange={(e) => handleChangeRowState(index, e, 'plan')}
								/>
							</tr>
						);
					})}
				</tbody>
			</table>
		</Card>
	);
};

TableWorkTracking.propTypes = {
	// eslint-disable-next-line react/forbid-prop-types
	rowsState: PropTypes.array,
	handleChangeRowState: PropTypes.func,
};
TableWorkTracking.defaultProps = {
	rowsState: [],
	handleChangeRowState: null,
};

export default TableWorkTracking;
