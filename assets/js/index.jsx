import React from 'react';
import ReactDOM from 'react-dom';

const { render } = ReactDOM;

class HelloWorld extends React.Component {
  render() {
    return (
      <div>Hello World</div>
    );
  };
}

render (
  <HelloWorld/>, document.getElementById("react-container")
);