import React, { memo, useState } from 'react';
// import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Form } from 'react-bootstrap';
// import PaginationButtons from './Pagination';
import Button from '../../../components/bootstrap/Button';
import useDarkMode from '../../../hooks/useDarkMode';

const TableSearchCommon = ({ isSearch, onSubmitSearch, searchvalue }) => {
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

	// const handleChangeCurrentPage = (pageCurrent) => {
	// 	onChangeCurrentPage({ text: textSearch, page: pageCurrent });
	// };

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
		</div>
	);
};

TableSearchCommon.propTypes = {
	isSearch: PropTypes.bool,
	onSubmitSearch: PropTypes.func,
	searchvalue: PropTypes.string,
};
TableSearchCommon.defaultProps = {
	isSearch: false,
	onSubmitSearch: null,
	searchvalue: '',
};

export default memo(TableSearchCommon);
