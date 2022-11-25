/* eslint-disable no-script-url */
/* eslint-disable react/jsx-no-script-url */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import _ from 'lodash';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import FormGroup from '../../components/bootstrap/forms/FormGroup';
import Select from '../../components/bootstrap/forms/Select';
import Textarea from '../../components/bootstrap/forms/Textarea';
import Input from '../../components/bootstrap/forms/Input';
import InputGroup from '../../components/bootstrap/forms/InputGroup';
import validate from './validate';
import { downloadFileReport } from './services';

const DailyWorktrackForm = ({ data, show, handleClose, handleSubmit }) => {
	const formik = useFormik({
		initialValues: {
			note: data.row?.note ? data.row?.note : '',
			quantity: data.row?.quantity ? data.row?.quantity : '',
			status: data.row?.status ? data.row?.status : 'inProgress',
		},
		enableReinitialize: true,
		validationSchema: validate,
		onSubmit: (values) => {
			handleSubmit({
				...values,
				data,
				files: selectedFile,
			});
		},
	});

	const [selectedFile, setSelectedFile] = useState(null);

	const changeHandler = (event) => {
		setSelectedFile(event.target.files);
	};

	const handleDowloadFile = async (file) => {
		const response = await downloadFileReport(file);
		let filename = file;
		const disposition = _.get(response.headers, 'content-disposition');
		if (disposition && disposition.indexOf('attachment') !== -1) {
			const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
			const matches = filenameRegex.exec(disposition);
			if (matches != null && matches[1]) {
				filename = matches[1].replace(/['"]/g, '');
			}
		}
		const url = window.URL.createObjectURL(
			new Blob([response.data], { type: _.get(response.headers, 'content-type') }),
		);
		const link = document.createElement('a');
		link.href = url;
		link.setAttribute('download', filename);
		document.body.appendChild(link);
		link.click();
	};

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
									value={formik.values.note || ''}
									isValid={formik.isValid}
									disabled={data.row?.status}
								/>
							</FormGroup>
							<div className='text-danger mt-1'>
								{formik.errors.note && (
									<span className='error'>{formik.errors.note}</span>
								)}
							</div>
						</div>
						<div className='col-6'>
							<FormGroup id='quantity' label='Số lượng'>
								<Input
									ariaLabel='Số lượng'
									placeholder='Số lượng'
									disabled={data.row?.quantity}
									name='quantity'
									size='lg'
									type='number'
									className='border border-2 rounded-0 shadow-none'
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									value={formik.values.quantity || ''}
									isValid={formik.isValid}
								/>
							</FormGroup>
							<div className='text-danger mt-1'>
								{formik.errors.quantity && (
									<span className='error'>{formik.errors.quantity}</span>
								)}
							</div>
						</div>
						<div className='col-6'>
							<FormGroup id='status' label='Trạng thái'>
								<Select
									ariaLabel='Trạng thái'
									placeholder='Trạng thái'
									disabled={data.row?.status}
									list={[
										{
											id: 1,
											text: 'Đã nhận',
											value: 'inProgress',
										},
										{
											id: 2,
											text: 'Đã hoàn thành',
											value: 'completed',
										},
									]}
									name='status'
									size='lg'
									className='border border-2 rounded-0 shadow-none'
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									value={formik.values.status || 'inProgress'}
									isValid={formik.isValid}
								/>
							</FormGroup>
							<div className='text-danger mt-1'>
								{formik.errors.status && (
									<span className='error'>{formik.errors.status}</span>
								)}
							</div>
						</div>
						{data.row?.status ? (
							<div>
								<h5>Danh sách file báo cáo</h5>
								<ul>
									{JSON.parse(data.row.files)?.map((file) => (
										<li key={file}>
											<a
												href='javascript:void(0)'
												className=''
												onClick={() => handleDowloadFile(file)}>
												{file}
											</a>
										</li>
									))}
								</ul>
							</div>
						) : (
							<div className='col-12'>
								<InputGroup>
									<Input
										type='file'
										disabled={data.row?.status}
										multiple
										onChange={changeHandler}
									/>
								</InputGroup>
							</div>
						)}
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
