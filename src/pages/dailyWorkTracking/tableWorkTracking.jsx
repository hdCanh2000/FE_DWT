// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect } from 'react';
import SelectComponent from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import ContentEditable from 'react-contenteditable';
import Button from '../../components/bootstrap/Button';
import Card from '../../components/bootstrap/Card';
import Icon from '../../components/icon/Icon';
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

// eslint-disable-next-line no-unused-vars
const TableWorkTracking = ({
	rowsState,
	handleAddRow,
	handleChangeRowState,
	handleRemoveRowField,
	handleSubmit,
}) => {
	const columns = ['STT', 'Nhiệm vụ', 'Số lượng', 'ĐVT', 'Ghi chú', 'Thời hạn', 'KH dự kiến'];
	const dispatch = useDispatch();
	const units = useSelector((state) => state.unit.units);

	useEffect(() => {
		dispatch(fetchUnitList());
	}, [dispatch]);

	return (
		<Card className='w-100 h-100'>
			<div style={styleHead} className='d-flex justify-content-between align-items-center'>
				<p className='m-0 d-block fs-4 fw-bold'>Hạng mục</p>
				<div className=''>
					{rowsState?.[0]?.status !== 1 && (
						<Button
							color='primary'
							size='lg'
							isLight
							className='mt-0 border'
							icon='Check'
							isDisable={rowsState?.[0]?.status === 1}
							onClick={handleSubmit}>
							Lưu lại
						</Button>
					)}
				</div>
			</div>
			<table className='table table-modern mb-0'>
				<thead>
					<tr>
						{columns.map((item, index) => {
							if (index === 0)
								return (
									<th
										key={item}
										colSpan={rowsState?.[0]?.status === 1 ? 1 : 2}
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
					{rowsState?.map((item, index) => {
						return (
							// eslint-disable-next-line react/no-array-index-key
							<tr key={index}>
								<td className='text-center' style={styleIndex}>
									{index + 1}
								</td>
								{item.status !== 1 && (
									<td
										onClick={(e) => handleRemoveRowField(e, index)}
										className='text-center cursor-pointer'
										style={styleIndex}>
										<Icon icon='Delete' size='lg' />
									</td>
								)}
								<ContentEditable
									tagName='td'
									style={minWith150}
									html={item?.name}
									disabled={item.status === 1}
									onChange={(e) => handleChangeRowState(index, e, 'name')}
								/>
								<ContentEditable
									tagName='td'
									html={`${item?.quantity}`}
									disabled={item.status === 1}
									onChange={(e) => handleChangeRowState(index, e, 'quantity')}
								/>
								<td style={{ border: '1px solid #c8c7c7', padding: 0 }}>
									<SelectComponent
										placeholder='Đơn vị tính'
										defaultValue={item?.unit}
										value={item?.unit}
										onChange={(e) => handleChangeRowState(index, e, 'unit')}
										options={units}
										isDisabled={item.status === 1}
									/>
								</td>
								<ContentEditable
									tagName='td'
									html={item?.note}
									disabled={item.status === 1}
									onChange={(e) => handleChangeRowState(index, e, 'note')}
								/>
								<td style={{ border: '1px solid #c8c7c7', padding: 0 }}>
									<Input
										name='deadline'
										placeholder='Thời hạn'
										onChange={(e) => handleChangeRowState(index, e, 'deadline')}
										value={item?.deadline}
										type='date'
										disabled={item.status === 1}
										ariaLabel='Thời hạn'
										className='border border-2 rounded-0 shadow-none'
									/>
								</td>
								<ContentEditable
									tagName='td'
									disabled={item.status === 1}
									html={item?.plan}
									onChange={(e) => handleChangeRowState(index, e, 'plan')}
								/>
							</tr>
						);
					})}
				</tbody>
			</table>
			{rowsState?.[0]?.status !== 1 ? (
				<Button
					color='success'
					size='lg'
					isLight
					className='my-4 w-50 h-50 m-auto btn-circle border'
					icon='Add'
					isDisable={rowsState?.[0]?.status === 1}
					onClick={handleAddRow}
				/>
			) : (
				<div className='mt-4 text-center w-100'>
					<p className='m-0 text-black'>
						<span className='mr-2' style={{ color: 'red' }}>
							*
						</span>
						Nếu muốn thêm/sửa công việc, vui lòng liên hệ admin
					</p>
				</div>
			)}
		</Card>
	);
};

TableWorkTracking.propTypes = {
	// eslint-disable-next-line react/forbid-prop-types
	rowsState: PropTypes.array,
	handleAddRow: PropTypes.func,
	handleChangeRowState: PropTypes.func,
	handleRemoveRowField: PropTypes.func,
	handleSubmit: PropTypes.func,
};
TableWorkTracking.defaultProps = {
	rowsState: [],
	handleAddRow: null,
	handleChangeRowState: null,
	handleRemoveRowField: null,
	handleSubmit: null,
};

export default TableWorkTracking;
