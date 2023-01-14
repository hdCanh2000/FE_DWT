import React, { memo, useState } from 'react';
import { Table } from 'antd';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Form } from 'react-bootstrap';
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

	const [textSearch, setTextSearch] = useState(searchvalue);

	const handleChange = (e) => {
		setTextSearch(e.target.value);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		onSubmitSearch({ text: textSearch, page: 1 });
	};

	// const handleFilter = (items) => {
	// 	console.log('search: ', items);
	// 	if ( items ===
	// 		items.name
	// 			.toUpperCase()
	// 			.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'E')
	// 			.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, 'A')
	// 			.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, 'I')
	// 			.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O')
	// 			.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U')
	// 			.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'Y')
	// 			.replace(/Đ/g, 'D')
	// 			.replace(
	// 				/!|@|%|\^|\*|\(|\)|\+|=|<|>|\?|\/|,|\.|:|;|'|"|&|#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,
	// 				' ',
	// 			)
	// 			.replace(/ + /g, ' ')
	// 			.trim()
	// 			.includes(textSearch.toUpperCase())
	// 	) {
	// 		console.log('search: ', items);
	// 		return items;
	// 	}
	// 	if (textSearch === '') {
	// 		return items;
	// 	}
	// 	return items;
	// };

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
			<div className={classNames(className)} {...props}>
				<Table
					className='table table-modern mb-0'
					columns={columns}
					dataSource={data}
					onSubmitSearch={handleSubmit}
					onChangeCurrentPage={handleChangeCurrentPage}
					currentPage={parseInt(currentPage, 10)}
					setCurrentPage={setCurrentPage}
					searchvalue={textSearch}
					isSearch
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
