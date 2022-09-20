import React from 'react';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import classNames from 'classnames';
import { Button, Modal } from 'react-bootstrap';
import Textarea from '../../components/bootstrap/forms/Textarea';
import FormGroup from '../../components/bootstrap/forms/FormGroup';
import Select from '../../components/bootstrap/forms/Select';
import CustomSelect from '../../components/form/CustomSelect';
import Checks from '../../components/bootstrap/forms/Checks';
import Input from '../../components/bootstrap/forms/Input';

const KpiNormDetail = ({ className, show, onClose, item, label, fields, options, ...props }) => {
	console.log(item,'item');
	const formik = useFormik({
		initialValues: { ...item },
		enableReinitialize: true,
	});
	return (
		<Modal
			className={classNames(className, 'p-4')}
			show={show}
			onHide={onClose}
			size='lg'
			scrollable
			centered
			{...props}>
			<Modal.Header closeButton className='p-4'>
				<Modal.Title>{label}</Modal.Title>
			</Modal.Header>
			<Modal.Body className='px-4'>
				<form>
					<div className='row'>
						<div className='col-md-12'>
							<div className='row g-4'>
								{fields?.map((field) => {
									if (field.type === 'singleSelect') {
										return (
											<React.Fragment key={field.id}>
												<FormGroup
													key={field.id}
													className='col-12'
													id={field.id}
													label={field.title}>
													<Select
														disabled
														ariaLabel={field.title || ''}
														list={field.options}
														name={field.id}
														size='lg'
														className='border border-2 rounded-0 shadow-none'
														value={formik.values[field.id]}
														defaultValue={formik.values[field.id]}
													/>
												</FormGroup>
											</React.Fragment>
										);
									}
									if (field.type === 'select') {
										return (
											<React.Fragment key={field.id}>
												<FormGroup
													key={field.id}
													className='col-12'
													id={field.id}
													label={field.title}>
													<CustomSelect
														disabled='true'
														value={formik.values[field.id]}
														options={field.options}
													/>
												</FormGroup>
											</React.Fragment>
										);
									}
									if (!field.isShow) {
										return null;
									}
									if (field.type === 'textarea') {
										return (
											<React.Fragment key={field.id}>
												<FormGroup
													key={field.id}
													className='col-12'
													id={field.id}
													label={field.title}>
													<Textarea
														readOnly
														rows={5}
														placeholder={`Nhập ${field.title}`}
														list={options}
														size='lg'
														name={field.id}
														className='border border-2 rounded-0 shadow-none'
														value={formik.values[field.id]}
													/>
												</FormGroup>
											</React.Fragment>
										);
									}
									if (field.type === 'switch') {
										return (
											<React.Fragment key={field.id}>
												<FormGroup
													key={field.id}
													className='col-12'
													id={field.id}
													label={field.title}>
													<Checks
														readOnly
														id={field.id}
														type='switch'
														size='lg'
														label={
															Number(formik.values[field.id]) === 1
																? 'Đang hoạt động'
																: 'Không hoạt động'
														}
														onChange={formik.handleChange}
														checked={formik.values[field.id]}
													/>
												</FormGroup>
											</React.Fragment>
										);
									}
									return (
										<React.Fragment key={field.id}>
											<FormGroup
												className='col-12'
												id={field.id}
												label={field.title}>
												<Input
													disabled
													type={field.type || 'text'}
													name={field.id}
													value={formik.values[field.id] || ''}
													size='lg'
													className='border border-2 rounded-0 shadow-none'
												/>
											</FormGroup>
										</React.Fragment>
									);
								})}
							</div>
						</div>
					</div>
				</form>
			</Modal.Body>
			<Modal.Footer className='p-4'>
				<Button size='lg' variant='secondary' onClick={onClose}>
					Đóng
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

KpiNormDetail.propTypes = {
	className: PropTypes.string,
	show: PropTypes.bool,
	// eslint-disable-next-line react/forbid-prop-types
	columns: PropTypes.array,
	// eslint-disable-next-line react/forbid-prop-types
	options: PropTypes.array,
	// eslint-disable-next-line react/forbid-prop-types
	item: PropTypes.object,
	// eslint-disable-next-line react/forbid-prop-types
	fields: PropTypes.array,
	// eslint-disable-next-line react/forbid-prop-types
	validate: PropTypes.object,
	onClose: PropTypes.func,
	handleSubmit: PropTypes.func,
	label: PropTypes.string,
};
KpiNormDetail.defaultProps = {
	className: null,
	show: false,
	columns: [],
	options: [],
	fields: [],
	validate: null,
	item: null,
	onClose: null,
	handleSubmit: null,
	label: '',
};

export default KpiNormDetail;
