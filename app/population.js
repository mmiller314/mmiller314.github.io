import React from 'react'
import { render } from 'react-dom'
import Comics from './components/Comics';
import "@babel/polyfill";

/* todo: react-router Trivia instead of seperate population.js file */
render((
  <Comics />
), document.getElementById('pop-root'));
