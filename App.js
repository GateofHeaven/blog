import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Logo from './components/Logo';
import Crudtable from './components/Crudtable';


class App extends Component {

  render() {
  var dataset=[
                  ["The Lord of the Rings", "J. R. R. Tolkien", "English", "1954-1955", "150 million"], 
                  ["Le Petit Prince (The Little Prince)", "Antoine de Saint-Exupéry", "French", "1943", "140 million"], 
                  ["Harry Potter and the Philosopher's Stone", "J. K. Rowling", "English", "1997", "107 million"], 
                  ["And Then There Were None", "Agatha Christie", "English", "1939", "100 million"], 
                  ["Dream of the Red Chamber", "Cao Xueqin", "Chinese", "1754-1791", "100 million"], 
                  ["The Hobbit", "J. R. R. Tolkien", "English", "1937", "100 million"], 
                  ["She: A History of Adventure", "H. Rider Haggard", "English", "1887", "100 million"],
            ];
  var header= ["Book", "Author", "Language", "Published", "Sales"];
    return (

      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <Logo />
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <Logo />
        <Crudtable  title={header} contentset={dataset} />
      </div>
    );
  }
}

export default App;
