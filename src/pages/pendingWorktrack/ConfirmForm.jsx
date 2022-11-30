import React from 'react';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import FormGroup from '../../components/bootstrap/forms/FormGroup';
import Input from '../../components/bootstrap/forms/Input';
import validate from './validate';

const ConfirmForm = ({ item, show, handleClose, handleSubmit }) => {
	const formik = useFormik({
		initialValues: {
			kpi_point: '',
		},
		validationSchema: validate,
		enableReinitialize: true,
		onSubmit: (values) => {
			handleSubmit({ ...item, kpi_point: Number(values.kpi_point) });
		},
	});

	return (
		<Modal
			show={show}
			onHide={handleClose}
			aria-labelledby='contained-modal-title-vcenter'
			size='md'
			keyboard={false}
			centered>
			<Modal.Header closeButton className='text-center pb-0'>
				<Modal.Title className='text-center w-100'>Xác nhận duyệt công việc</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<form>
					<div className='row g-4'>
						<div className='col-12'>
							<FormGroup id='kpi_point' label='Điểm đánh giá'>
								<Input
									ariaLabel='Điểm đánh giá'
									placeholder='Điểm đánh giá'
									name='kpi_point'
									size='lg'
									type='text'
									className='border border-2 rounded-0 shadow-none'
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									value={formik.values.kpi_point || ''}
									isValid={formik.isValid}
								/>
							</FormGroup>
						</div>
					</div>
				</form>
			</Modal.Body>
			<Modal.Footer>
				<Button variant='secondary' onClick={handleClose}>
					Đóng
				</Button>
				<Button variant='primary' type='submit' onClick={formik.handleSubmit}>
					Xác nhận
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

ConfirmForm.propTypes = {
	show: PropTypes.bool,
	handleClose: PropTypes.func,
	handleSubmit: PropTypes.func,
	// eslint-disable-next-line react/forbid-prop-types
	item: PropTypes.object.isRequired,
};
ConfirmForm.defaultProps = {
	show: false,
	handleClose: null,
	handleSubmit: null,
};

export default ConfirmForm;
