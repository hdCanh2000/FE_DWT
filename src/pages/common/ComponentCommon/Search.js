import React from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import Button from '../../../components/bootstrap/Button';
import useDarkMode from '../../../hooks/useDarkMode';

const Search = () => {
	const { darkModeStatus } = useDarkMode();
	return (
		<InputGroup className='mb-3'>
			<Form.Control
				placeholder='Search...'
				className='rounded-none outline-none shadow-none'
				style={{
					border: '1px solid',
					borderRadius: '0.5rem',
				}}
			/>
			<Button
				color='info'
				isOutline={!darkModeStatus}
				isLight={darkModeStatus}
				className='text-nowrap ms-2 rounded-0 outline-none shadow-none'
				icon='Search'>
				Tìm kiếm
			</Button>
		</InputGroup>
	);
};

export default Search;
