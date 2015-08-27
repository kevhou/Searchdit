var React = require('react');
var Router = require('react-router');

var Home = React.createClass({
  mixins: [Router.Navigation],

  getInitialState: function () {
    return {
      search: "",
    };
  },
  handleSubmit: function(e) {
    e.preventDefault();

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
          <form className="input-group home-search-bar" onSubmit={this.handleSubmit}>
             <input className="form-control" value={this.state.search} onChange={this.handleChange} type="text" autoFocus={true}/>
             <span className="input-group-btn">
                  <button className="btn" type="submit"><i className="glyphicon glyphicon-search"></i></button>
             </span>
          </form>
        </div>
      </div>
    )
  }
});

module.exports = Home;