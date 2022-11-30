import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useTable, useExpanded } from 'react-table';
import { useSticky } from 'react-table-sticky';
import { isEmpty } from 'lodash';

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
			background-color: #fff;
			:last-child {
				border-right: 1px;
			}
			:first-child {
				border-right: 0;
			}
		}
		&.sticky {
			overflow: scroll;
			.header,
			.footer {
				position: sticky;
				z-index: 1;
				width: fit-content;
			}

			.body {
				position: relative;
				z-index: 0;
			}

			[data-sticky-td] {
				position: sticky;
			}
		}
	}
`;

const TableContainerOuter = styled.div`
	width: 100%;
	height: 100%;
	overflow-y: hidden;
	padding-bottom: 20px;
`;

const TableContainer = styled.div`
	width: 100%;
	height: 100%;
	min-width: 900px;
`;

const Table = ({ columns: userColumns, data }) => {
	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		rows,
		prepareRow,
		// eslint-disable-next-line no-unused-vars
		state: { expanded },
	} = useTable(
		{
			columns: userColumns,
			data,
			initialState: {
				expanded: {
					// 0: true,
					// 1: true,
					// 2: true,
					// 3: true,
					// 4: true,
					// 5: true,
					// 6: true,
					// 7: true,
					// 8: true,
					// 9: true,
					// 10: true,
				},
			},
		},
		useExpanded,
		useSticky,
	);

	return (
		<TableContainerOuter>
			{isEmpty(data) ? (
				<h5
					style={{
						textAlign: 'center',
						border: '1px solid',
						padding: '20px',
					}}>
					Chưa có nhiệm vụ nào !
				</h5>
			) : (
				<TableContainer>
					<Styles>
						<table {...getTableProps()} className='sticky'>
							<thead>
								{headerGroups.map((headerGroup) => (
									<tr {...headerGroup.getHeaderGroupProps()}>
										{headerGroup.headers.map((column) => (
											<th
												key={column.accessor}
												{...column.getHeaderProps({
													style: {
														minWidth: column.minWidth,
														width: column.width,
														textAlign: column.align,
													},
												})}>
												{column.render('Header')}
											</th>
										))}
									</tr>
								))}
							</thead>
							<tbody {...getTableBodyProps()} className='body'>
								{rows.map((row) => {
									prepareRow(row);
									return (
										<tr {...row.getRowProps()}>
											{row.cells.map((cell) => {
												return (
													<td
														key={cell.accessor}
														{...cell.getCellProps({
															style: {
																minWidth: cell.column.minWidth,
																width: cell.column.width,
																textAlign: cell.column.align,
															},
														})}>
														{cell.render('Cell')}
													</td>
												);
											})}
										</tr>
									);
								})}
							</tbody>
						</table>
					</Styles>
				</TableContainer>
			)}
		</TableContainerOuter>
	);
};

Table.propTypes = {
	// eslint-disable-next-line react/forbid-prop-types
	columns: PropTypes.any.isRequired,
	// eslint-disable-next-line react/forbid-prop-types
	data: PropTypes.any.isRequired,
};

export default Table;
