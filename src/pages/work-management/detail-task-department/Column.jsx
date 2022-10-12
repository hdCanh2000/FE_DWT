/* eslint-disable react/prop-types */
import React, { useCallback, useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import { Form, Dropdown } from 'react-bootstrap';
import { cloneDeep } from 'lodash';
import { Container, Draggable } from 'react-smooth-dnd';
import Button from '../../../components/bootstrap/Button';
import Card, {
	// CardActions,
	CardBody,
	CardFooter,
	CardHeader,
} from '../../../components/bootstrap/Card';
import Icon from '../../../components/icon/Icon';
import { MODAL_ACTION_COLSE, MODAL_ACTION_CONFIRM } from '../../../utils/constants';
import ConfirmModalComponent from './ConfirmModalComponent';
import CardItem from './Card';
import './style.scss';
import { handleContentEditable, selectAllInlineText } from '../../../utils/contentEditable';

// import Dropdown, {
// 	DropdownItem,
// 	DropdownMenu,
// 	DropdownToggle,
// } from '../../../components/bootstrap/Dropdown';

// const CoulmnTitle = styled.span`
// 	font-weight: 700;
// 	font-size: 16px;
// 	color: #212529;
// 	cursor: pointer;
// `;
// const ColumnCount = styled.span`
// 	font-weight: 700;
// 	font-size: 16px;
// 	color: #212529;
// 	cursor: pointer;
// `;
const WrapForm = styled.div``;

// const RenderColumnTitle = ({ columnName, countCard }) => {
// 	return (
// 		// <CardHeader className={`column-drag-handle pt-1 pb-1 bg-l50-${status}`}>
// 		<CardHeader className='column-drag-handle pt-1 pb-1' style={{ background: '#eee' }}>
// 			<div className='column-title'>
// 				<CoulmnTitle className='w-100'>{`${columnName} - ${countCard}`}</CoulmnTitle>
// 			</div>
// 			<div className='column-dropdown-actions'>
// 				<Dropdown>
// 					<Dropdown.Toggle
// 					id='dropdown-basic'
// 					size='sm'
// 					className='dropdown-btn'
// 					/>

// 					<Dropdown.Menu>
// 						<Dropdown.Item>Thêm đầu việc</Dropdown.Item>
// 						<Dropdown.Item>Action 2</Dropdown.Item>
// 						<Dropdown.Item>Action 3</Dropdown.Item>
// 						<Dropdown.Item>Xoá công việc</Dropdown.Item>
// 						{/* <Dropdown.Item>Something else</Dropdown.Item> */}
// 					</Dropdown.Menu>
// 				</Dropdown>
// 			</div>
// 		</CardHeader>
// 	);
// };

const Column = (props) => {
	const { column, onCardDrop, onUpdateColumn } = props;
	// const { cards } = mapOrder(column.cards, column.cardOrder, 'id');
	const { cards } = column;
	const [newCardTitle, setNewCardTitle] = useState('');
	const [openNewCardForm, setOpenNewCardForm] = useState(false);
	const newCardInputRef = useRef(null);
	const [openConfirmModal, setOpenConfirmModal] = useState(false);
	const [columnTitle, setColumnTitle] = useState('');

	useEffect(() => {
		setColumnTitle(column.title);
	}, [column.title]);

	const handleOpenConfirmModal = () => {
		setOpenConfirmModal(true);
	};

	const handleCloseConfirmModal = () => {
		setOpenConfirmModal(false);
	};

	const handleActionConfirmModal = (type) => {
		switch (type) {
			case MODAL_ACTION_COLSE:
				setOpenConfirmModal(false);
				break;
			case MODAL_ACTION_CONFIRM:
				const newColumn = { ...column, _destroy: true };
				onUpdateColumn(newColumn);
				setOpenConfirmModal(false);
				break;
			default:
				setOpenConfirmModal(false);
		}
	};

	const handleNewCardTitleChange = useCallback((e) => {
		setNewCardTitle(e.target.value);
	}, []);

	const handleToggleNewCardForm = () => {
		setOpenNewCardForm(!openNewCardForm);
	};

	const handleCloseNewCardForm = () => {
		setOpenNewCardForm(false);
	};

	const addNewCard = () => {
		if (!newCardTitle) {
			newCardInputRef.current.focus();
			// eslint-disable-next-line no-useless-return
			return;
		}
		const data = {
			id: Math.random().toString(36).substr(2, 5),
			boardId: column.boardId,
			columnId: column.id,
			title: newCardTitle.trim(),
			cover: null,
		};
		// const newColumn = { ...column };
		const newColumn = cloneDeep(column);
		newColumn.cards.push(data);
		newColumn.cardOrder.push(data.id);
		// setColumns(newColumn);
		onUpdateColumn(newColumn);
		setNewCardTitle('');
	};

	const onUpdateCard = (cardToUpdate) => {
		const newColumn = { ...column };
		const cardIndexToUpdate = newColumn.cards.findIndex((item) => item.id === cardToUpdate.id);
		if (cardToUpdate._destroy) {
			// delete card
			newColumn.cards.splice(cardIndexToUpdate, 1);
		} else {
			// update card
			newColumn.cards.splice(cardIndexToUpdate, 1, cardToUpdate);
		}
		onUpdateColumn(newColumn);
	};

	const handleColumnTitleChange = useCallback((e) => {
		setColumnTitle(e.target.value);
	}, []);

	const handleColumnTitleBlur = () => {
		const newColumn = { ...column, title: columnTitle };
		onUpdateColumn(newColumn);
	};

	return (
		<Card className='card-column'>
			{/* <RenderColumnTitle
				status={column?.status}
				columnName={column?.title}
				countCard={column?.cards.length}
			/> */}
			<CardHeader
				className='column-drag-handle pt-1 pb-1'
				style={{ background: '#eee', padding: '1rem' }}>
				<div className='column-title'>
					{/* <CoulmnTitle className='w-100'>{`${column?.title} - ${column?.cards.length}`}</CoulmnTitle> */}
					<Form.Control
						className='rounded-0 content-aditable'
						name='columnTitle'
						size='sm'
						type='text'
						value={columnTitle}
						onChange={handleColumnTitleChange}
						onClick={selectAllInlineText}
						onBlur={handleColumnTitleBlur}
						onKeyDown={handleContentEditable}
						onMouseDown={(e) => e.preventDefault()}
						spellCheck='false'
					/>
				</div>
				<div className='column-dropdown-actions'>
					<Dropdown>
						<Dropdown.Toggle id='dropdown-basic' size='sm' className='dropdown-btn' />
						<Dropdown.Menu>
							<Dropdown.Item>Thêm đầu việc</Dropdown.Item>
							<Dropdown.Item onClick={handleOpenConfirmModal}>
								Xoá công việc
							</Dropdown.Item>
						</Dropdown.Menu>
					</Dropdown>
				</div>
			</CardHeader>
			<CardBody className='cursor-pointer' style={{ padding: '1rem 1rem 0 1rem' }}>
				<Container
					groupName='col'
					onDrop={(dropResult) => onCardDrop(column.id, dropResult)}
					getChildPayload={(index) => cards[index]}
					dragClass='card-ghost'
					dropClass='card-ghost-drop'
					dropPlaceholder={{
						animationDuration: 150,
						showOnTop: true,
						className: 'drop-preview',
					}}
					dropPlaceholderAnimationDuration={200}>
					{cards.map((card) => {
						return (
							<Draggable key={card.id}>
								<CardItem card={card} key={card.id} onUpdateCard={onUpdateCard} />
							</Draggable>
						);
					})}
				</Container>
			</CardBody>
			<CardFooter className='d-block w-100'>
				{openNewCardForm && (
					<WrapForm>
						<Form.Control
							ref={newCardInputRef}
							className='rounded-0 add-column-input add-card-input'
							name='column'
							size='sm'
							type='text'
							as='textarea'
							rows='5'
							placeholder='Nhập công việc'
							autoFocus
							value={newCardTitle}
							onChange={handleNewCardTitleChange}
							onKeyDown={(e) => e.key === 'Enter' && addNewCard()}
						/>
						<div className='d-flex align-items-center'>
							<Button className='add-column-button' color='info' onClick={addNewCard}>
								Thêm công việc
							</Button>
							<Icon
								className='add-column-icon cursor-pointer'
								size='2x'
								icon='XLg'
								onClick={handleCloseNewCardForm}
							/>
						</div>
					</WrapForm>
				)}
				{!openNewCardForm && (
					<Button
						onClick={handleToggleNewCardForm}
						className='d-flex align-items-center cursor-pointer'
						style={{ fontSize: 15, color: '#6C757D', border: '1px solid #6C757D' }}>
						<Icon size='lg' icon='PlusCircle' />
						<span className='mx-2'>Thêm công việc</span>
					</Button>
				)}
			</CardFooter>
			<ConfirmModalComponent
				openModal={openConfirmModal}
				onCloseModal={handleCloseConfirmModal}
				onAction={() => handleActionConfirmModal(MODAL_ACTION_CONFIRM)}
				title='Xoá công việc'
				content={`Xác nhận xoá công việc <strong>${column.title}</strong> ?`}
			/>
		</Card>
	);
};

export default Column;
