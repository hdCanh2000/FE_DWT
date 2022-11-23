import React from 'react';
import PropTypes from 'prop-types';
import { useTable, useExpanded } from 'react-table';

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
					0: true,
					1: true,
					2: true,
					3: true,
					4: true,
					5: true,
					6: true,
					7: true,
					8: true,
					9: true,
					10: true,
				},
			},
		},
		useExpanded,
	);

	return (
		<table {...getTableProps()}>
			<thead>
				{headerGroups.map((headerGroup) => (
					<tr {...headerGroup.getHeaderGroupProps()}>
						{headerGroup.headers.map((column) => (
							<th
								key={column.accessor}
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
	);
};

Table.propTypes = {
	// eslint-disable-next-line react/forbid-prop-types
	columns: PropTypes.any.isRequired,
	// eslint-disable-next-line react/forbid-prop-types
	data: PropTypes.any.isRequired,
};

export default Table;
