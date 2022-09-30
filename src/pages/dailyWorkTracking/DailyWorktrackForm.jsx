import React from 'react';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import FormGroup from '../../components/bootstrap/forms/FormGroup';
import Select from '../../components/bootstrap/forms/Select';
import Textarea from '../../components/bootstrap/forms/Textarea';

const DailyWorktrackForm = ({ data, show, handleClose, handleSubmit }) => {
	const formik = useFormik({
		initialValues: {
			message: data.valueForm?.message || '',
			status: data.valueForm?.status || 1,
		},
		enableReinitialize: true,
		onSubmit: (values, { resetForm }) => {
			handleSubmit({
				...values,
				data,
			});
			resetForm();
		},
	});
	return (
		<Modal
			show={show}
			onHide={handleClose}
			aria-labelledby='contained-modal-title-vcenter'
			backdrop='static'
			size='lg'
			keyboard={false}
			centered>
			<Modal.Header closeButton className='text-center pb-0'>
				<Modal.Title className='text-center w-100'>
					Báo cáo công việc: {data.row.name}
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Modal.Title className='pb-4 pt-0 text-center w-100'>
					Ngày:{' '}
					{`${data.column?.day}/${new Date().getMonth() + 1}/${new Date().getFullYear()}`}
				</Modal.Title>
				<form>
					<div className='row g-4'>
						<div className='col-12'>
							<FormGroup id='message' label='Ghi chú'>
								<Textarea
									rows={5}
									ariaLabel='Ghi chú'
									placeholder='Ghi chú'
									size='lg'
									name='message'
									className='border border-2 rounded-0 shadow-none'
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									value={formik.values.message}
									isValid={formik.isValid}
								/>
							</FormGroup>
						</div>
						<div className='col-12'>
							<FormGroup id='status' label='Trạng thái'>
								<Select
									ariaLabel='Trạng thái'
									placeholder='Trạng thái'
									list={[
										{
											id: 1,
											text: 'Đang thực hiện',
											value: 1,
										},
										{
											id: 2,
											text: 'Đã hoàn thành',
											value: 2,
										},
										{
											id: 3,
											text: 'Quá hạn',
											value: 3,
										},
									]}
									name='status'
									size='lg'
									className='border border-2 rounded-0 shadow-none'
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									value={formik.values.status}
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

DailyWorktrackForm.propTypes = {
	show: PropTypes.bool,
	handleClose: PropTypes.func,
	handleSubmit: PropTypes.func,
	// eslint-disable-next-line react/forbid-prop-types
	data: PropTypes.object,
};
DailyWorktrackForm.defaultProps = {
	show: false,
	handleClose: null,
	handleSubmit: null,
	data: null,
};

export default DailyWorktrackForm;
