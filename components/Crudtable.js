/* @flow */

import React, {Component} from 'react';
import "../css/bootstrap.min.css";
class Crudtable extends Component {
        displayName: 'Crudtable';

  		constructor(props) {
  			super(props);
    		this.state = {
    			headers : props.title,
      			data: props.contentset,
     			sortby: null, // headers.id
      			descending: false,
      			edit: null, // {row index, headers.id},
      			search:false
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
        
        _preSearchData: null
        
        _toggleSearch() {
          if (this.state.search) {
          	this.state.data=this._preSearchData;
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
          var searchdata=this._preSearchData;
          this.state.headers.map((title,idx)=>{
			var needle=this.refs[title].value.toLowerCase();
			if (needle){
				searchdata=searchdata.filter((row)=> {
            		return row[idx].toString().toLowerCase().indexOf(needle) > -1;
          		});
			}
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
            <div className="searchbar form-inline">
              {this.state.headers.map((title, idx) =>{
                return (
                	
                	<div className="form-group">
                	<input className="form-control" type="text" placeholder={title} data-idx={idx} ref={title} key={idx} data-toggle="popover" data-placement="top" 
			data-content={title} data-trigger="focus" />
                	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                	</div>
                );
              })}
              <button className="btn btn-primary" onClick={this._search.bind(this)}>Search</button>
            </div>
          );
        }
        
        _renderTable() {
          return (
          	<div>
          	{this._renderSearch()}
          	<br/>
            <table className="table table-bordered table-hover">
              <thead onClick={this._sort.bind(this)}>
                <tr className="info">{
                  this.state.headers.map((title,idx) => {
                    if (this.state.sortby === idx) {
                      title += this.state.descending ? ' \u2191' : ' \u2193';
                    }
                    return <th style={{textAlign:'center',}} key={idx}>{title}</th>;
                  }, this)
                }
				<th><center><button type="button" className="btn btn-default btn-xs" onClick={()=>this._toggleSearch()} ><span className="glyphicon glyphicon-filter"></span></button></center></th>
                </tr>
              </thead>
              <tbody onDoubleClick={this._showEditor.bind(this)}>
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
            </div>
          );
        }
      }

export default Crudtable;
