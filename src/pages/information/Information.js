import React from 'react';
import Page from '../../layout/Page/Page';
import PageWrapper from '../../layout/PageWrapper/PageWrapper';
import Card, { CardTabItem } from '../../components/bootstrap/Card';
import ChangePass from './ChangePass';
import ChangeInformation from './ChangeInformation';

const Information = () => {
	return (
		<PageWrapper>
			<Page container='fluid'>
				<div>
					<Card hasTab style={{ minWidth: '95%', margin: '0 auto', minHeight: '90vh' }}>
						<CardTabItem id='profile' title='Profile' icon='Contacts'>
							<ChangeInformation />
						</CardTabItem>
						<CardTabItem id='profile2' title='Password' icon='Lock'>
							<ChangePass />
						</CardTabItem>
					</Card>
				</div>
			</Page>
		</PageWrapper>
	);
};

export default Information;
