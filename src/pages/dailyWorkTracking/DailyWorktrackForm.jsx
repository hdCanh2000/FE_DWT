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
			note: data?.row?.note || '',
			status: data?.row?.status || 'inProgress',
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
			size='lg'
			keyboard={false}
			centered>
			<Modal.Header closeButton className='text-center pb-0'>
				<Modal.Title className='text-center w-100'>Báo cáo công việc</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Modal.Title className='pb-4 pt-0 text-center w-100'>
					Ngày: {data.valueForm.date}
				</Modal.Title>
				<form>
					<div className='row g-4'>
						<div className='col-12'>
							<FormGroup id='note' label='Ghi chú'>
								<Textarea
									rows={5}
									ariaLabel='Ghi chú'
									placeholder='Ghi chú'
									size='lg'
									name='note'
									className='border border-2 rounded-0 shadow-none'
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									value={formik.values.note}
									isValid={formik.isValid}
									disabled={data.row?.status}
								/>
							</FormGroup>
						</div>
						<div className='col-12'>
							<FormGroup id='status' label='Trạng thái'>
								<Select
									ariaLabel='Trạng thái'
									placeholder='Trạng thái'
									disabled={data.row?.status}
									list={[
										{
											id: 1,
											text: 'Đang thực hiện',
											value: 'inProgress',
										},
										{
											id: 2,
											text: 'Đã hoàn thành',
											value: 'completed',
										},
										{
											id: 3,
											text: 'Quá hạn',
											value: 'expired',
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
				<Button
					variant='primary'
					type='submit'
					disabled={data.row?.status}
					onClick={formik.handleSubmit}>
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
