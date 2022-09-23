import React from 'react';
import { Form, InputGroup } from 'react-bootstrap';
// import Button from '../../../components/bootstrap/Button';

const Search = () => {
	return (
		<InputGroup className='mb-3'>
			<Form.Control
				placeholder='Search...'
				style={{
					border: '1px solid',
					borderRadius: '5px',
				}}
			/>
			{/* <Button
				style={{
					border: '1px solid',
					width: '13%',
					height: '36px',
				}}
				variant='outline-secondary'
				id='button-addon2'
				icon='Search'
			/> */}
		</InputGroup>
	);
};

export default Search;
