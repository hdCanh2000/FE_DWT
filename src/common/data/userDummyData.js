import SERVICES from './serviceDummyData';
import UserImage6 from '../../assets/img/wanna/wanna6.png';
import UserImage6Webp from '../../assets/img/wanna/wanna6.webp';

const john = {
	id: 1,
	username: 'john',
	name: 'John',
	surname: 'Doe',
	position: 'CEO, Founder',
	src: '',
	srcSet: '',
	isOnline: true,
	isReply: true,
	color: 'primary',
	services: [SERVICES.SURFING, SERVICES.KITE_SURFING, SERVICES.TENNIS],
};

const grace = {
	id: 2,
	username: 'grace',
	name: 'Grace',
	surname: 'Buckland',
	position: 'Staff',
	src: '',
	srcSet: '',
	isOnline: true,
	color: 'warning',
	services: [SERVICES.SNOWBOARDING, SERVICES.ICE_SKATING, SERVICES.KITE_SURFING],
};

const jane = {
	id: 3,
	username: 'jane',
	name: 'Jane',
	surname: 'Lee',
	position: 'Staff',
	src: '',
	srcSet: '',
	isOnline: true,
	color: 'secondary',
	services: [SERVICES.YOGA, SERVICES.HANDBALL, SERVICES.CRICKET],
};

const ryan = {
	id: 4,
	username: 'ryan',
	name: 'Ryan',
	surname: 'McGrath',
	position: 'Worker',
	src: '',
	srcSet: '',
	isOnline: false,
	color: 'info',
	services: [SERVICES.HIKING, SERVICES.FOOTBALL, SERVICES.HANDBALL],
};

const ella = {
	id: 5,
	username: 'ella',
	name: 'Ella',
	surname: 'Oliver',
	position: 'Worker',
	src: '',
	srcSet: '',
	isOnline: false,
	color: 'success',
	services: [SERVICES.ICE_SKATING, SERVICES.TENNIS, SERVICES.SNOWBOARDING, SERVICES.YOGA],
};

const chloe = {
	id: 6,
	username: 'chloe',
	name: 'Chloe',
	surname: 'Walker',
	position: 'Staff',
	src: UserImage6,
	srcSet: UserImage6Webp,
	isOnline: true,
	color: 'warning',
	services: [SERVICES.VOLLEYBALL, SERVICES.CRICKET],
};

const sam = {
	id: 7,
	username: 'sam',
	name: 'Sam',
	surname: 'Roberts',
	position: 'Worker',
	src: '',
	srcSet: '',
	isOnline: false,
	color: 'danger',
	fullImage: '',
};

const employeeTest = {
	id: 6,
	username: 'test',
	fullname: 'Nguyễn Văn A',
	position: 'Chuyên viên HCNS',
	src: '',
	srcSet: '',
	isOnline: true,
	color: 'warning',
	services: [SERVICES.VOLLEYBALL, SERVICES.CRICKET],
};

const USERS = {
	JOHN: john,
	GRACE: grace,
	JANE: jane,
	RYAN: ryan,
	ELLA: ella,
	CHLOE: chloe,
	SAM: sam,
	EMPLOYEETEST: employeeTest,
};

export function getUserDataWithUsername(username) {
	return USERS[Object.keys(USERS).filter((f) => USERS[f].username.toString() === username)];
}

export function getUserDataWithId(id) {
	return USERS[Object.keys(USERS).filter((f) => USERS[f].id.toString() === id.toString())];
}

export default USERS;
