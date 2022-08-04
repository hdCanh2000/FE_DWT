import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

const TableCommon = ({ data, columns, actions, className, ...props }) => {
	return (
		<table className={classNames(className)} {...props}>
			<thead>
				<tr>
					{columns.map((column) => {
						return (
							<td
								style={{ minWidth: `${column.minWidth}px` }}
								key={column.key}
								className={column.className}>
								{column.title}
							</td>
						);
					})}
					<td />
				</tr>
			</thead>
			<tbody>
				{data?.map((row) => {
					return (
						<tr key={row.id}>
							{columns.map((column) => {
								const value = row[column.id];
								if (column.render) {
									return <td key={column.key}>{column.render(row, value)}</td>;
								}
								return (
									<td
										style={{ minWidth: `${column.minWidth}px` }}
										key={column.key}
										className={column.className}>
										{column.format ? column.format(value) : value}
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

TableCommon.propTypes = {
	className: PropTypes.string,
	// eslint-disable-next-line react/forbid-prop-types
	data: PropTypes.array,
	// eslint-disable-next-line react/forbid-prop-types
	columns: PropTypes.array,
	actions: PropTypes.node.isRequired,
};
TableCommon.defaultProps = {
	className: null,
	data: [],
	columns: [],
};

export default TableCommon;
