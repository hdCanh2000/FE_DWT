/* eslint-disable react/prop-types */
import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Button, Dropdown, Form } from 'react-bootstrap';
import Avatar, { AvatarGroup } from '../../../components/Avatar';
import Card, { CardBody, CardHeader, CardTitle } from '../../../components/bootstrap/Card';
import Icon from '../../../components/icon/Icon';
import './style.scss';

const USER = {
	id: 4,
	username: 'ryan',
	name: 'Ryan',
	surname: 'McGrath',
	position: 'Worker',
	src: '',
	srcSet: '',
	isOnline: false,
	color: 'info',
};

const Time = styled.div`
	font-weight: 500;
	font-size: 12px;
	color: #6c757d;
	display: flex;
	align-items: center;
`;

// const CardTitle = styled.span`
// 	font-weight: 500;
// 	font-size: 16px;
// 	color: #000000;
// `;

const CardItem = (props) => {
	const { card, onUpdateCard } = props;
	const [cardTitle, setCardTitle] = useState('');
	const [openFormEditCard, setOpenFormEditCard] = useState(false);

	const handleOpenFormEditCard = (e) => {
		setOpenFormEditCard(true);
		// selectAllInlineText(e);
		e.target.focus();
	};

	const handleCloseFormEditCard = () => {
		setOpenFormEditCard(false);
	};

	useEffect(() => {
		setCardTitle(card.title);
	}, [card.title]);

	const handleCardTitleChange = useCallback((e) => {
		setCardTitle(e.target.value);
	}, []);

	const handleSubmitCardChangeTitle = () => {
		const newCard = { ...card, title: cardTitle };
		onUpdateCard(newCard);
		handleCloseFormEditCard();
	};

	return (
		<Card style={{ borderTop: '1px solid #BFC6CD' }}>
			<CardHeader style={{ padding: '1rem' }} className='d-flex align-items-baseline'>
				{!openFormEditCard && <CardTitle>{card.title}</CardTitle>}
				{openFormEditCard && (
					<div className='card-title'>
						<Form.Control
							className='rounded-0 content-aditable-card'
							name='cardTitle'
							size='sm'
							type='text'
							as='textarea'
							value={cardTitle}
							onChange={handleCardTitleChange}
							// onBlur={handleCloseFormEditCard}
						/>
						<Button
							className='add-column-button'
							color='info'
							onClick={handleSubmitCardChangeTitle}>
							Sửa đầu việc
						</Button>
					</div>
				)}
				<div className='column-dropdown-actions'>
					<Dropdown>
						<Dropdown.Toggle
							id='dropdown-button-drop-end'
							size='sm'
							className='dropdown-btn'
						/>
						<Dropdown.Menu>
							<Dropdown.Item>Xem danh sách</Dropdown.Item>
							<Dropdown.Item onClick={handleOpenFormEditCard}>
								Sửa công việc
							</Dropdown.Item>
							<Dropdown.Item
								onClick={() => onUpdateCard({ ...card, _destroy: true })}>
								Xoá công việc
							</Dropdown.Item>
						</Dropdown.Menu>
					</Dropdown>
				</div>
			</CardHeader>
			<CardBody style={{ paddingTop: 0 }}>
				<div className='d-flex align-items-center justify-content-between'>
					<AvatarGroup>
						<Avatar
							srcSet={USER.srcSet}
							src={USER.src}
							userName={`${USER.name} ${USER.surname}`}
							color={USER.color}
						/>
						<Avatar
							srcSet={USER.srcSet}
							src={USER.src}
							userName={`${USER.name} ${USER.surname}`}
							color={USER.color}
						/>
					</AvatarGroup>
					<Time>
						<Icon size='lg' icon='Clock' style={{ marginRight: 5 }} />
						{/* {time} */}
						20/03-27/09
					</Time>
				</div>
			</CardBody>
		</Card>
	);
};

export default CardItem;
