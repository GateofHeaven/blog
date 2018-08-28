/* @flow */

import React, {Component} from 'react';
import "../css/bootstrap.min.css";
import $ from 'jquery';
class Crudtable extends Component {
        displayName: 'Crudtable';

  		constructor(props) {
  			super(props);
    		this.state = {
    			headers : ["Book", "Author", "Language", "Published", "Sales"],
      			data: [
        					["The Lord of the Rings", "J. R. R. Tolkien", "English", "1954-1955", "150 million"], 
        					["Le Petit Prince (The Little Prince)", "Antoine de Saint-Exupéry", "French", "1943", "140 million"], 
        					["Harry Potter and the Philosopher's Stone", "J. K. Rowling", "English", "1997", "107 million"], 
        					["And Then There Were None", "Agatha Christie", "English", "1939", "100 million"], 
        					["Dream of the Red Chamber", "Cao Xueqin", "Chinese", "1754-1791", "100 million"], 
        					["The Hobbit", "J. R. R. Tolkien", "English", "1937", "100 million"], 
        					["She: A History of Adventure", "H. Rider Haggard", "English", "1887", "100 million"],
						],
     			sortby: null, // headers.id
      			descending: false,
      			edit: null, // {row index, headers.id},
    		};

    		
  		}



        
        _sort(e) {
          var column = e.target.cellIndex;
          var data = this.state.data.slice();
          var descending = this.state.sortby === column && !this.state.descending;
          data.sort((a, b)=>	{
            return descending 
              ? (a[column] < b[column] ? 1 : -1)
              : (a[column] > b[column] ? 1 : -1);
          });
          this.setState({
            data: data,
            sortby: column,
            descending: descending,
          });
        }
        
        _showEditor(e) {
          this.setState({edit: {
            row: parseInt(e.target.dataset.row, 10),
            cell: e.target.cellIndex,
          }});
        }
        
        _save(e) {
          e.preventDefault();
          var input = e.target.firstChild;
          var data = this.state.data.slice();
          data[this.state.edit.row][this.state.edit.cell] = input.value;
          this.setState({
            edit: null,
            data: data,
          });
        }
        
        _preSearchData: null;
        
        _toggleSearch() {
          if (this.state.search) {
            this.setState({
              data: this._preSearchData,
              search: false,
            });
            this._preSearchData = null;
          } else {
            this._preSearchData = this.state.data;
            this.setState({
              search: true,
            });
          }
        }
        
        _search(e) {
          var needle = e.target.value.toLowerCase();
          if (!needle) {
            this.setState({data: this._preSearchData});
            return;
          }
          var idx = e.target.dataset.idx;
          var searchdata = this._preSearchData.filter((row)=> {
            return row[idx].toString().toLowerCase().indexOf(needle) > -1;
          });
          this.setState({data: searchdata});
        }
        
        _download(format, ev) {
          var contents = format === 'json'
            ? JSON.stringify(this.state.data)
            : this.state.data.reduce(function(result, row) {
                return result
                  + row.reduce(function(rowresult, cell, idx) {
                      return rowresult 
                        + '"' 
                        + cell.replace(/"/g, '""')
                        + '"'
                        + (idx < row.length - 1 ? ',' : '');
                    }, '')
                  + "\n";
              }, '');

          var URL = window.URL || window.webkitURL;
          var blob = new Blob([contents], {type: 'text/' + format});
          ev.target.href = URL.createObjectURL(blob);
          ev.target.download = 'data.' + format;
        }
        
        render() {
          return (
            <div className="Crudtable">
              {this._renderToolbar()}
              {this._renderTable()}
            </div>
          );
        }
        
        _renderToolbar() {
          return (
            <div className="toolbar">
              <button onClick={this._toggleSearch.bind(this)}>Search</button>
              <a onClick={this._download.bind(this, 'json')} 
                href="data.json">Export JSON</a>
              <a onClick={this._download.bind(this, 'csv')} 
                href="data.csv">Export CSV</a>
            </div>
          );
        }
        
        _renderSearch() {
          if (!this.state.search) {
            return null;
          }
          return (
            <tr onChange={this._search.bind(this)}>
              {this.state.headers.map((_ignore, idx) =>{
                return <td key={idx}><input type="text" data-idx={idx}/></td>;
              })}
            </tr>
          );
        }
        
        _renderTable() {
          return (
            <table className="table table-bordered table-hover">
              <thead onClick={this._sort.bind(this)}>
                <tr className="info">{
                  this.state.headers.map((title,idx) => {
                    if (this.state.sortby === idx) {
                      title += this.state.descending ? ' \u2191' : ' \u2193';
                    }
                    return <th style={{textAlign:'center',}} key={idx}>{title}</th>;
                  }, this)
                }</tr>
              </thead>
              <tbody onDoubleClick={this._showEditor.bind(this)}>
                {this._renderSearch()}
                {this.state.data.map((row, rowidx)  => {
                  return (
                    <tr key={rowidx}>{
                      row.map((cell, idx) =>{
                        var content = cell;
                        var edit = this.state.edit;
                        if (edit && edit.row === rowidx && edit.cell === idx) {
                          content = (
                            <form onSubmit={this._save.bind(this)}>
                              <input type="text" className="form-control" defaultValue={cell} />
                            </form>
                          );
                        }
                        return <td key={idx} data-row={rowidx}>{content}</td>;
                      }, this)}
                    </tr>
                  );
                }, this)}
              </tbody>
            </table>
          );
        }
      }

export default Crudtable;
