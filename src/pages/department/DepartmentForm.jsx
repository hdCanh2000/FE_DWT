import React from 'react';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import classNames from 'classnames';
import { Button, Modal } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import FormGroup from '../../components/bootstrap/forms/FormGroup';
import Select from '../../components/bootstrap/forms/Select';
import CustomSelect from '../../components/form/CustomSelect';
import Textarea from '../../components/bootstrap/forms/Textarea';
import Checks from '../../components/bootstrap/forms/Checks';
import Input from '../../components/bootstrap/forms/Input';
import Icon from '../../components/icon/Icon';
import DeleteDepartment from './deleteDepartment';
import AlertConfirm from '../common/ComponentCommon/AlertConfirm';

const DepartmentForm = ({
	className,
	show,
	onClose,
	item,
	handleSubmit,
	label,
	fields,
	options,
	validate,
	disable,
	onDelete,
	size,
	...props
}) => {
	const [isDelete, setIsDelete] = React.useState(false);
	const [isNotDelete, setIsNotDelete] = React.useState(false);
	const department = useSelector((state) => state.department.departments);
	const formik = useFormik({
		initialValues: { ...item },
		validationSchema: validate,
		enableReinitialize: true,
		onSubmit: (values) => {
			handleSubmit(values);
		},
	});
	const handleDelete = () => {
		const newDepartment = department.filter((items) => items.parent_id === item.id);
		if (_.isEmpty(newDepartment)) {
			setIsDelete(!isDelete);
		} else {
			setIsNotDelete(!isNotDelete);
		}
	};
	return (
		<Modal
			className={classNames(className, 'p-4')}
			show={show}
			onHide={onClose}
			size={size}
			scrollable
			centered
			{...props}>
			<Modal.Header closeButton className='p-4'>
				<Modal.Title>
					{item.name ? item.name : 'Thêm mới cơ cấu tổ chức'}{' '}
					{item?.id && (
						<Icon
							icon='Trash'
							size='lg'
							onClick={() => handleDelete()}
							style={{
								cursor: 'pointer',
								color: 'red',
								background: 'white',
								borderColor: 'red',
							}}
						/>
					)}
				</Modal.Title>
			</Modal.Header>
			<Modal.Body className='px-4'>
				<form>
					<div className='row g-4'>
						{fields?.map((field) => {
							if (field.type === 'singleSelect') {
								return (
									<div
										key={field.id}
										className={field.col ? `col-${field.col}` : 'col-12'}>
										<FormGroup id={field.id} label={field.title}>
											<Select
												ariaLabel={field.title || ''}
												placeholder={`${field.title}`}
												list={field.options}
												name={field.id}
												size='lg'
												className='border border-2 rounded-0 shadow-none'
												onChange={formik.handleChange}
												onBlur={formik.handleBlur}
												value={formik.values[field.id]}
												defaultValue={formik.values[field.id]}
												isValid={formik.isValid}
											/>
										</FormGroup>
										<div className='text-danger mt-1'>
											{formik.errors[field.id] && (
												<span className='error'>
													{formik.errors[field.id]}
												</span>
											)}
										</div>
									</div>
								);
							}
							if (field.type === 'select') {
								return (
									<div
										key={field.id}
										className={field.col ? `col-${field.col}` : 'col-12'}>
										<FormGroup key={field.id} id={field.id} label={field.title}>
											<CustomSelect
												placeholder={`${field.title}`}
												value={formik.values[field.id]}
												onChange={(value) => {
													formik.setFieldValue(field.id, value);
												}}
												isMulti={!!field.isMulti}
												options={field.options}
											/>
										</FormGroup>
										<div className='text-danger mt-1'>
											{formik.errors[field.id] && (
												<span className='error'>
													{formik.errors[field.id]}
												</span>
											)}
										</div>
									</div>
								);
							}
							if (!field.isShow) {
								return null;
							}
							if (field.type === 'textarea') {
								return (
									<div
										key={field.id}
										className={field.col ? `col-${field.col}` : 'col-12'}>
										<FormGroup key={field.id} id={field.id} label={field.title}>
											<Textarea
												rows={3}
												ariaLabel={field.title}
												placeholder={`${field.title}`}
												list={options}
												size='lg'
												name={field.id}
												className='border border-2 rounded-0 shadow-none'
												onChange={formik.handleChange}
												onBlur={formik.handleBlur}
												value={formik.values[field.id]}
												isValid={formik.isValid}
											/>
										</FormGroup>
										<div className='text-danger mt-1'>
											{formik.errors[field.id] && (
												<span className='error'>
													{formik.errors[field.id]}
												</span>
											)}
										</div>
									</div>
								);
							}
							if (field.type === 'switch') {
								return (
									<div
										key={field.id}
										className={field.col ? `col-${field.col}` : 'col-12'}>
										<FormGroup key={field.id} id={field.id} label={field.title}>
											<Checks
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
										<div className='text-danger mt-1'>
											{formik.errors[field.id] && (
												<span className='error'>
													{formik.errors[field.id]}
												</span>
											)}
										</div>
									</div>
								);
							}
							return (
								<div
									key={field.id}
									className={field.col ? `col-${field.col}` : 'col-12'}>
									<FormGroup id={field.id} label={field.title}>
										<Input
											type={field.type || 'text'}
											name={field.id}
											onChange={formik.handleChange}
											value={formik.values[field.id] || ''}
											size='lg'
											placeholder={`${field.title}`}
											className='border border-2 rounded-0 shadow-none'
											onBlur={formik.handleBlur}
											isValid={formik.isValid}
										/>
									</FormGroup>
									<div className='text-danger mt-1'>
										{formik.errors[field.id] && (
											<span className='error'>{formik.errors[field.id]}</span>
										)}
									</div>
								</div>
							);
						})}
					</div>
				</form>
			</Modal.Body>
			<Modal.Footer className='p-4'>
				<Button size='lg' variant='secondary' onClick={onClose}>
					Đóng
				</Button>
				<Button size='lg' variant='primary' type='submit' onClick={formik.handleSubmit}>
					Xác nhận
				</Button>
			</Modal.Footer>
			<AlertConfirm
				openModal={isDelete}
				onCloseModal={handleDelete}
				onConfirm={() => {
					onDelete(item);
					onClose();
				}}
				title='Xoá phòng ban'
				content={`Xác nhận xoá phòng ban <strong>${item?.name}</strong> ?`}
			/>
			<DeleteDepartment openModal={isNotDelete} onCloseModal={setIsNotDelete} />
		</Modal>
	);
};

DepartmentForm.propTypes = {
	className: PropTypes.string,
	disable: PropTypes.string,
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
	onDelete: PropTypes.func,
	label: PropTypes.string,
	size: PropTypes.string,
};
DepartmentForm.defaultProps = {
	className: null,
	disable: null,
	show: false,
	columns: [],
	options: [],
	fields: [],
	validate: null,
	item: null,
	onClose: null,
	handleSubmit: null,
	onDelete: null,
	label: '',
	size: 'lg',
};

export default DepartmentForm;
