import { isEmpty } from 'lodash';
import React from 'react';

const checkIsAccessible = (permission) => {
	const roles = JSON.parse(window.localStorage.getItem('roles'));
	return !isEmpty(roles.filter((element) => permission.includes(element)));
};

const verifyPermissionHOC = (Component, permission, OtherComponent) => {
	const Verify = () => {
		const isAccessible = checkIsAccessible(permission);

		if (!isAccessible) {
			return OtherComponent || '';
		}
		return Component;
	};

	return <Verify />;
};

export default verifyPermissionHOC;
