import React, { memo, useState } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Form } from 'react-bootstrap';
import PaginationButtons from './Pagination';
import Button from '../../../components/bootstrap/Button';
import useDarkMode from '../../../hooks/useDarkMode';

const TableCommon = ({
	data,
	columns,
	className,
	isSearch,
	onSubmitSearch,
	onChangeCurrentPage,
	onChangeTextSearch,
	currentPage,
	setCurrentPage,
	totalItem,
	total,
	searchvalue,
	...props
}) => {
	const { darkModeStatus } = useDarkMode();

	// const items = dataPagination(data, currentPage, 10);

	const [textSearch, setTextSearch] = useState(searchvalue);

	const handleChange = (e) => {
		setTextSearch(e.target.value);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		onSubmitSearch({ text: textSearch, page: 1 });
	};

	const handleChangeCurrentPage = (pageCurrent) => {
		onChangeCurrentPage({ text: textSearch, page: pageCurrent });
	};

	return (
		<div>
			{isSearch && (
				<div style={{ maxWidth: '50%' }}>
					<Form className='mb-3 d-flex align-items-center' onSubmit={handleSubmit}>
						<Form.Control
							placeholder='Search...'
							className='rounded-none outline-none shadow-none'
							style={{
								border: '1px solid',
								borderRadius: '0.5rem',
							}}
							onChange={(e) => handleChange(e)}
							value={textSearch}
						/>
						<Button
							color='info'
							isOutline={!darkModeStatus}
							isLight={darkModeStatus}
							onClick={handleSubmit}
							className='text-nowrap ms-2 rounded-0 outline-none shadow-none'
							icon='Search'>
							Tìm kiếm
						</Button>
					</Form>
				</div>
			)}
			<table className={classNames(className)} {...props}>
				<thead>
					<tr>
						{columns?.map((column) => {
							if (column?.key === 'action') {
								return (
									<th
										style={{ fontSize: 14, minWidth: `${column.minWidth}px` }}
										key={column.key}
										className={classNames(
											column.className,
											`text-${column.align ? column.align : 'left'}`,
										)}
										align={column.align ? column.align : 'left'}>
										{column.title}
									</th>
								);
							}
							if (column?.isShow === false) {
								return null;
							}
							return (
								<th
									style={{ fontSize: 14, minWidth: `${column.minWidth}px` }}
									key={column.key}
									className={classNames(
										column.className,
										`text-${column.align ? column.align : 'left'}`,
									)}
									align={column.align ? column.align : 'left'}>
									{column.title}
								</th>
							);
						})}
					</tr>
				</thead>
				<tbody>
					{data?.map((row) => {
						return (
							<tr key={row.id}>
								{columns?.map((column) => {
									const value = row[column.id];
									if (column?.key === 'action') {
										if (column.render) {
											return (
												<td
													key={column.key}
													align={column.align ? column.align : 'left'}
													className={`text-${
														column.align ? column.align : 'left'
													}`}
													style={{ fontSize: 14 }}>
													{column.render(row, value)}
												</td>
											);
										}
									}
									if (column?.isShow === false) {
										return null;
									}
									if (column.render) {
										return (
											<td
												key={column.key}
												align={column.align ? column.align : 'left'}
												className={`text-${
													column.align ? column.align : 'left'
												}`}
												style={{ fontSize: 14 }}>
												{column.render(row, value)}
											</td>
										);
									}
									return (
										<td
											style={{
												fontSize: 14,
												minWidth: `${column.minWidth}px`,
											}}
											key={column.key}
											className={classNames(
												column.className,
												`text-${column.align ? column.align : 'left'}`,
											)}
											align={column.align ? column.align : 'left'}>
											{column.format ? column.format(value) : value}
										</td>
									);
								})}
							</tr>
						);
					})}
				</tbody>
			</table>
			<hr />
			<div>
				<PaginationButtons
					data={data}
					setCurrentPage={setCurrentPage}
					currentPage={parseInt(currentPage, 10)}
					onChangeCurrentPage={handleChangeCurrentPage}
					totalItem={totalItem}
					total={total}
				/>
			</div>
		</div>
	);
};

TableCommon.propTypes = {
	className: PropTypes.string,
	// eslint-disable-next-line react/forbid-prop-types
	data: PropTypes.array,
	// eslint-disable-next-line react/forbid-prop-types
	columns: PropTypes.array,
	isSearch: PropTypes.bool,
	onSubmitSearch: PropTypes.func,
	onChangeCurrentPage: PropTypes.func,
	onChangeTextSearch: PropTypes.func,
	currentPage: PropTypes.number,
	setCurrentPage: PropTypes.func,
	totalItem: PropTypes.number,
	total: PropTypes.number,
	searchvalue: PropTypes.string,
};
TableCommon.defaultProps = {
	className: null,
	data: [],
	columns: [],
	isSearch: false,
	onSubmitSearch: null,
	onChangeCurrentPage: null,
	onChangeTextSearch: null,
	currentPage: 1,
	setCurrentPage: null,
	searchvalue: '',
	totalItem: 10,
	total: 10,
};

export default memo(TableCommon);
