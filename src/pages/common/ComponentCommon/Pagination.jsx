import React from 'react';
import PropTypes from 'prop-types';
import { CardFooter, CardFooterLeft, CardFooterRight } from '../../../components/bootstrap/Card';
import Pagination, { PaginationItem } from '../../../components/bootstrap/Pagination';

export const PER_COUNT = {
	3: 3,
	5: 5,
	10: 10,
	25: 25,
	50: 50,
};

export const dataPagination = (data, currentPage, perPage) => {
	return data?.filter(
		(i, index) => index + 1 > (currentPage - 1) * perPage && index + 1 <= currentPage * perPage,
	);
};

const PaginationButtons = ({
	setCurrentPage,
	currentPage,
	onChangeCurrentPage,
	perPage,
	totalItem,
	total,
	label,
}) => {
	const totalItems = total;
	const totalPage = Math.ceil(totalItems / perPage);

	const handleChangeCurrentPage = (page) => {
		setCurrentPage(page);
		onChangeCurrentPage(page);
	};

	const pagination = () => {
		let items = [];

		let i = currentPage - 1;
		while (i >= currentPage - 1 && i > 0) {
			items.push(
				<PaginationItem
					key={i}
					onClick={() => {
						handleChangeCurrentPage(currentPage - 1);
					}}>
					{i}
				</PaginationItem>,
			);

			i -= 1;
		}

		items = items.reverse();

		items.push(
			<PaginationItem
				key={currentPage}
				isActive
				onClick={() => {
					handleChangeCurrentPage(currentPage);
				}}>
				{currentPage}
			</PaginationItem>,
		);

		i = currentPage + 1;
		while (i <= currentPage + 1 && i <= totalPage) {
			items.push(
				<PaginationItem
					key={i}
					onClick={() => {
						handleChangeCurrentPage(currentPage + 1);
					}}>
					{i}
				</PaginationItem>,
			);

			i += 1;
		}

		return items;
	};

	const getInfo = () => {
		// const start = perPage * (currentPage - 1) + 1;

		const end = perPage * currentPage;

		return (
			<span className='pagination__desc'>
				{/* Showing {start} to {end > totalItems ? totalItems : end} of {totalItems} {label} */}
				Hiển thị {end > totalItem ? totalItem : end} trên {total} bản ghi
				{/* {label} */}
			</span>
		);
	};

	return (
		<CardFooter>
			<CardFooterLeft>
				<span className='text-muted'>{getInfo()}</span>
			</CardFooterLeft>

			<CardFooterRight className='d-flex'>
				{totalPage > 1 && (
					<Pagination ariaLabel={label}>
						<PaginationItem
							isFirst
							isDisabled={!(currentPage - 1 > 0)}
							onClick={() => {
								handleChangeCurrentPage(1);
							}}
						/>
						<PaginationItem
							isPrev
							isDisabled={!(currentPage - 1 > 0)}
							onClick={() => {
								handleChangeCurrentPage(currentPage - 1);
							}}
						/>
						{currentPage - 1 > 1 && (
							<PaginationItem
								onClick={() => {
									handleChangeCurrentPage(currentPage - 2);
								}}>
								...
							</PaginationItem>
						)}
						{pagination()}
						{currentPage + 1 < totalPage && (
							<PaginationItem
								onClick={() => {
									handleChangeCurrentPage(currentPage + 2);
								}}>
								...
							</PaginationItem>
						)}
						<PaginationItem
							isNext
							isDisabled={!(currentPage + 1 <= totalPage)}
							onClick={() => {
								handleChangeCurrentPage(currentPage + 1);
							}}
						/>
						<PaginationItem
							isLast
							isDisabled={!(currentPage + 1 <= totalPage)}
							onClick={() => {
								handleChangeCurrentPage(totalPage);
							}}
						/>
					</Pagination>
				)}
			</CardFooterRight>
		</CardFooter>
	);
};
PaginationButtons.propTypes = {
	setCurrentPage: PropTypes.func.isRequired,
	currentPage: PropTypes.number.isRequired,
	perPage: PropTypes.number,
	label: PropTypes.string,
	onChangeCurrentPage: PropTypes.func,
	totalItem: PropTypes.number.isRequired,
	total: PropTypes.number.isRequired,
};
PaginationButtons.defaultProps = {
	label: 'items',
	onChangeCurrentPage: null,
	perPage: 10,
};

export default PaginationButtons;
