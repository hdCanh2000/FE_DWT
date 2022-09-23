import React, { memo } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Search from './Search';

const TableCommon = ({ data, columns, className, ...props }) => {
	return (
		<div>
			<div style={{ maxWidth: '25%' }}>
				<Search />
			</div>
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
											`text-${
												// eslint-disable-next-line no-nested-ternary
												column.align === 'right'
													? 'right'
													: column.align === 'center'
													? 'center'
													: 'left'
											}`,
										)}
										align={
											// eslint-disable-next-line no-nested-ternary
											column.align === 'right'
												? 'right'
												: column.align === 'center'
												? 'center'
												: 'left'
										}>
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
										`text-${
											// eslint-disable-next-line no-nested-ternary
											column.align === 'right'
												? 'right'
												: column.align === 'center'
												? 'center'
												: 'left'
										}`,
									)}
									align={
										// eslint-disable-next-line no-nested-ternary
										column.align === 'right'
											? 'right'
											: column.align === 'center'
											? 'center'
											: 'left'
									}>
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
													align={
														// eslint-disable-next-line no-nested-ternary
														column.align === 'right'
															? 'right'
															: column.align === 'center'
															? 'center'
															: 'left'
													}
													className={`text-${
														// eslint-disable-next-line no-nested-ternary
														column.align === 'right'
															? 'right'
															: column.align === 'center'
															? 'center'
															: 'left'
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
												align={
													// eslint-disable-next-line no-nested-ternary
													column.align === 'right'
														? 'right'
														: column.align === 'center'
														? 'center'
														: 'left'
												}
												className={`text-${
													// eslint-disable-next-line no-nested-ternary
													column.align === 'right'
														? 'right'
														: column.align === 'center'
														? 'center'
														: 'left'
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
												`text-${
													// eslint-disable-next-line no-nested-ternary
													column.align === 'right'
														? 'right'
														: column.align === 'center'
														? 'center'
														: 'left'
												}`,
											)}
											align={
												// eslint-disable-next-line no-nested-ternary
												column.align === 'right'
													? 'right'
													: column.align === 'center'
													? 'center'
													: 'left'
											}>
											{column.format ? column.format(value) : value}
										</td>
									);
								})}
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
};

TableCommon.propTypes = {
	className: PropTypes.string,
	// eslint-disable-next-line react/forbid-prop-types
	data: PropTypes.array,
	// eslint-disable-next-line react/forbid-prop-types
	columns: PropTypes.array,
};
TableCommon.defaultProps = {
	className: null,
	data: [],
	columns: [],
};

export default memo(TableCommon);
