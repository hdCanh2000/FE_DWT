import { isEmpty } from 'lodash';
import React from 'react';

const checkIsAccessible = (permission) => {
	const roles = JSON.parse(window.localStorage.getItem('roles'));
	return !isEmpty(roles.filter((element) => permission.includes(element)));
};

const verifyRoleAccessPage = (Component, permission) => {
	const Verify = () => {
		const isAccessible = checkIsAccessible(permission);

		if (!isAccessible) {
			return '';
		}
		return Component;
	};

	return <Verify />;
};

export default verifyRoleAccessPage;
