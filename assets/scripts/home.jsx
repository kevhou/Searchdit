var React = require('react');
var Router = require('react-router');
var Link = Router.Link;
var DocumentTitle = require("react-document-title");

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
      <DocumentTitle title="Searchdit">
        <div id="content">
          <div className="l-home">
            <a className="home-logo" href="#">
              <img className="img-responsive" alt="Searchdit" src="assets/images/logo1.png"/>
            </a>
            
            <form className="input-group home-search-bar" onSubmit={this.handleSubmit}>
               <input className="form-control" value={this.state.search} onChange={this.handleChange} type="text" autoFocus={true}/>
               <span className="input-group-btn">
                    <button className="btn" type="submit"><i className="glyphicon glyphicon-search"></i></button>
               </span>
            </form>
          </div>

          <div className="m-footer">
            <Link to="home">Home</Link>
            <Link to="help">Help</Link>
            <Link to="about">About</Link>
            <Link to="search" params={{sort: "hot", splat:"/r/random"}}>Random</Link>
          </div>
        </div>
      </DocumentTitle>
    )
  }
});

module.exports = Home;