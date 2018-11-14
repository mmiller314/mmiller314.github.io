import React from 'react'
import { render } from 'react-dom'
import Trivia from './components/Trivia';
import "@babel/polyfill";

render((
  <Trivia />
), document.getElementById('react-root'));