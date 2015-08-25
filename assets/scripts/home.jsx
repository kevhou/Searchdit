var React = require('react');
var Router = require('react-router');

var Home = React.createClass({
  mixins: [Router.Navigation],

  getInitialState: function () {
    return {
      search: "",
    };
  },
  handleSubmit: function() {
    if($.trim(this.state.search)){
      this.context.router.transitionTo('/sort=hot&q=' + this.state.search);
    }
  },
  handleChange: function(event) {
    this.setState({search: event.target.value.substr(0, 140)});
  },
  render: function() {
    return(
      <div className="container l-home">
        <a className="row" href="#">
          <img className="img-responsive home-logo" alt="Searchdit" src="assets/images/logo1.png"/>
        </a>
        
        <div className="row">
          <div className="input-group home-search-bar">
             <input value={this.state.search} onChange={this.handleChange} type="text" className="form-control"/>
             <span className="input-group-btn">
                  <button className="btn" onClick={this.handleSubmit}><i className="glyphicon glyphicon-search"></i></button>
             </span>
          </div>
        </div>
      </div>
    )
  }
});

module.exports = Home;