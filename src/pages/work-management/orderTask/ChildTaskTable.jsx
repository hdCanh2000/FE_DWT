/* eslint-disable react/prop-types */
/* eslint-disable react/no-unstable-nested-components */
import React, { useEffect } from 'react';
import { useRowSelect, useTable } from 'react-table';

const Table = ({ columns, data, updateMyData, setSelectedRows }) => {
	const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow, selectedFlatRows } =
		useTable(
			{
				columns,
				data,
				updateMyData,
			},
			useRowSelect,
		);

	useEffect(() => {
		setSelectedRows(selectedFlatRows.map((d) => d.original));
	}, [setSelectedRows, selectedFlatRows]);

	return (
		<>
			<table {...getTableProps()}>
				<thead>
					{headerGroups.map((headerGroup) => (
						<tr {...headerGroup.getHeaderGroupProps()}>
							{headerGroup.headers.map((column) => (
								<th
									{...column.getHeaderProps({
										style: { minWidth: column.minWidth, width: column.width },
									})}>
									{column.render('Header')}
								</th>
							))}
						</tr>
					))}
				</thead>
				<tbody {...getTableBodyProps()}>
					{rows.slice(0, 10).map((row) => {
						prepareRow(row);
						return (
							<tr {...row.getRowProps()}>
								{row.cells.map((cell) => {
									return (
										<td
											{...cell.getCellProps({
												style: {
													minWidth: cell.minWidth,
													width: cell.width,
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
			{/* <p>Selected Rows: {Object.keys(selectedRowIds).length}</p>
			<pre>
				<code>
					{JSON.stringify(
						{
							selectedRowIds,
							'selectedFlatRows[].original': selectedFlatRows.map((d) => d.original),
						},
						null,
						2,
					)}
				</code>
			</pre> */}
		</>
	);
};

export default Table;
