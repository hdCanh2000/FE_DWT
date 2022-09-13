import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useFormik } from 'formik';
import Card, {
	CardActions,
	CardBody,
	CardFooter,
	CardFooterLeft,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../../../../components/bootstrap/Card';
import Button from '../../../../components/bootstrap/Button';
import Badge from '../../../../components/bootstrap/Badge';
import BoardCard from './BoardCard';
import Modal, {
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
} from '../../../../components/bootstrap/Modal';
import FormGroup from '../../../../components/bootstrap/forms/FormGroup';
import Input from '../../../../components/bootstrap/forms/Input';
import Textarea from '../../../../components/bootstrap/forms/Textarea';
import Select from '../../../../components/bootstrap/forms/Select';
import Option from '../../../../components/bootstrap/Option';
// import { getAllUser } from '../services';

const BoardGroup = ({ groups, data, setData, subtask, onAddStep }) => {
	const [editModalStatus, setEditModalStatus] = useState(false);
	// const [users, setUsers] = useState([]);
	const _cardCount = groups?.cards?.length;
	const formik = useFormik({
		initialValues: {
			name: '',
			description: '',
			status: groups.status,
			partner: '',
		},
		onSubmit: (values, { resetForm }) => {
			const valuesClone = { ...values };
			const subtaskClone = { ...subtask };
			const { steps } = subtaskClone;
			const stepsClone = [...steps];
			valuesClone.subtaskId = subtaskClone?.id;
			valuesClone.status = parseInt(values.status, 10);
			valuesClone.id = steps.length + 1;
			stepsClone.push(valuesClone);
			subtaskClone.steps = stepsClone;
			onAddStep(subtaskClone);
			setEditModalStatus(false);
			resetForm();
		},
	});

	// useEffect(() => {
	// 	async function fetchDataUsers() {
	// 		const response = await getAllUser();
	// 		const result = await response.data;
	// 		setUsers(result);
	// 	}
	// 	fetchDataUsers();
	// }, []);
	return (
		<>
			<div className='col'>
				<Card
					stretch={_cardCount > 3}
					className={classNames(`board-group shadow-3d-${groups.color}`)}>
					<CardHeader>
						<CardLabel icon={groups.icon} iconColor={groups.color}>
							<CardTitle>
								{groups.title}{' '}
								<Badge color={groups.color} isLight>
									{_cardCount}
								</Badge>
							</CardTitle>
						</CardLabel>
						<CardActions>
							<Button
								size='lg'
								className='rounded-50'
								color='light'
								icon='Plus'
								onClick={() => setEditModalStatus(true)}
							/>
						</CardActions>
					</CardHeader>
					{!!_cardCount && (
						<CardBody className='cursor-pointer h-100'>
							{groups.cards.map((card) => (
								<BoardCard
									key={card.id}
									status={card.status}
									card={card}
									data={data}
									setData={setData}
									subtask={subtask}
									onAddStep={onAddStep}
								/>
							))}
						</CardBody>
					)}
					<CardFooter>
						<CardFooterLeft>
							<Button
								color={groups.color}
								isLight
								icon='AddTask'
								onClick={() => setEditModalStatus(true)}>
								Thêm mới
							</Button>
						</CardFooterLeft>
					</CardFooter>
				</Card>
			</div>

			<Modal
				setIsOpen={setEditModalStatus}
				isOpen={editModalStatus}
				size='lg'
				isScrollable
				isCentered>
				<ModalHeader className='px-4' setIsOpen={setEditModalStatus}>
					<ModalTitle id='project-edit'>Thêm bước thực hiện</ModalTitle>
				</ModalHeader>
				<ModalBody className='px-4'>
					<div className='row'>
						<div className='col-md-8'>
							<Card shadow='sm'>
								<CardHeader>
									<CardLabel icon='Info' iconColor='success'>
										<CardTitle>Thông tin</CardTitle>
									</CardLabel>
								</CardHeader>
								<CardBody>
									<div className='row g-4'>
										<FormGroup className='col-12' id='name' label='Tên bước'>
											<Input
												ariaLabel='Name'
												onChange={formik.handleChange}
												value={formik.values.name}
											/>
										</FormGroup>
										<FormGroup
											className='col-12'
											id='description'
											label='Mô tả'>
											<Textarea
												ariaLabel='Description'
												onChange={formik.handleChange}
												value={formik.values.description}
											/>
										</FormGroup>
									</div>
								</CardBody>
							</Card>
						</div>
						<div className='col-md-4'>
							<div className='row g-4 sticky-top'>
								<FormGroup className='col-12' id='status' label='Trạng thái'>
									<Select
										disabled
										ariaLabel='Board select'
										placeholder='Chọn trạng thái'
										onChange={formik.handleChange}
										value={formik.values.status}>
										{data.map((group) => (
											<Option key={group.id} value={group.status}>
												{group.title}
											</Option>
										))}
									</Select>
								</FormGroup>
								{/* <FormGroup className='col-12' id='partner' label='Cần phối hợp'>
									<Select
										ariaLabel='Board select'
										placeholder='Chọn người phối hợp'
										onChange={formik.handleChange}
										value={formik.values.partner}>
										{users.map((u) => (
											<Option key={u.id} value={u.id}>
												{`${u.name}`}
											</Option>
										))}
									</Select>
								</FormGroup> */}
							</div>
						</div>
					</div>
				</ModalBody>
				<ModalFooter className='px-4 pb-4'>
					<Button
						color='primary'
						className='w-100 py-3'
						type='submit'
						onClick={formik.handleSubmit}>
						Lưu lại
					</Button>
				</ModalFooter>
			</Modal>
		</>
	);
};
BoardGroup.propTypes = {
	// eslint-disable-next-line react/forbid-prop-types
	groups: PropTypes.object.isRequired,
	// eslint-disable-next-line react/forbid-prop-types
	data: PropTypes.array.isRequired,
	// eslint-disable-next-line react/forbid-prop-types
	subtask: PropTypes.object.isRequired,
	setData: PropTypes.func.isRequired,
	onAddStep: PropTypes.func.isRequired,
};

export default BoardGroup;
