import { render, screen } from '@testing-library/react';
import React, { Component } from 'react';
import { act } from "react-dom/test-utils";
import App from './App';
import {Provider} from 'react-redux'
import store from './redux/store.js'

test('renders react tickets', () => {
	render(<Provider store={store}>
			<App />
		</Provider>);
	
	const linkElement = screen.getByText(/stop/i);
	
	expect(linkElement).toBeInTheDocument();
});
