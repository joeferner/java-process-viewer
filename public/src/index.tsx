import React from 'react';
import ReactDOM from 'react-dom';
import 'typeface-roboto';
import { App } from './App';

const whyDidYouRender = require('@welldone-software/why-did-you-render');
whyDidYouRender(React);

ReactDOM.render(<App />, document.getElementById('app'));
