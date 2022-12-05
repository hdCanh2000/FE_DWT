import React from 'react';
import 'antd/dist/reset.css';
import ReactDOM from 'react-dom'; // For React 17
// import { createRoot } from 'react-dom/client'; // For React 18
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { registerLicense } from '@syncfusion/ej2-base';
import 'react-toastify/dist/ReactToastify.css';
import './styles/styles.scss';
import App from './App/App';
import reportWebVitals from './reportWebVitals';
import { ThemeContextProvider } from './contexts/themeContext';
import { store } from './redux/store/index';
import './i18n';

registerLicense(
	'ORg4AjUWIQA/Gnt2VVhjQlFac1lJXHxKYVF2R2BJfl96cVRMYVRBJAtUQF1hS39RdkFhWnpadXxURGdc',
);

const children = (
	<Router>
		<Provider store={store}>
			<ThemeContextProvider>
				<ToastContainer />
				<App />
			</ThemeContextProvider>
		</Provider>
	</Router>
);

const container = document.getElementById('root');

ReactDOM.render(children, container); // For React 17
// createRoot(container).render(children); // For React 18

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
