import { log, dom, on } from './alias';
import { goOnTourMapsModule as Map } from './goOnTourMaps';

var React = require('react');



var Title = React.createClass({
  render: function() {
      return (
        <div className='popup-title'>
          <p>{this.props.data.title}</p>
        </div>
      );
  }
});

var PerformersDate = React.createClass({
  render: function() {
      return (
        <div className='popup-date'>
          <p className='date'>
            {this.props.data.startTime}
          </p>
        </div>
      );
  }
});

var DescriptionURL = React.createClass({
  render: function() {
    var thine = this;
    log(['this', thine])
    return (
      <div className='popup-description-url'>
        <p className='description'>
          {
            (function() {
              if (thine.props.data.description === 'null') {
                return "No Description Available.";
              } else {
                return thine.props.data.description;
              }
            }) ()
          }
        </p>
        <p className='url'>
          {' URL: ' + this.props.data.url}
        </p>
      </div>
    );
  }
});

var VenueInfo = React.createClass({
  render: function() {
    return (
      <div className='popup-venue-info'>
        <p className='venue-name'>Performing Live at:
          {'  ' + this.props.data.venueName}
        </p>
        <p className='venue-city'>in
          {'  ' + this.props.data.venueCity + ', ' + this.props.data.venueState}
        </p>
        <p className='venue-address'>
          {this.props.data.venueAddress}
        </p>
        <p className='venue-url'>
          {this.props.data.venueUrl}
        </p>
      </div>
    );
  }
});


export var PopupFooter = React.createClass({

  _handleClick: function() {
    var userData = this.props.datum,
        showData = this.props.coords;
        Map.addDestination(userData, showData);
  },

   render: function() {
     return (
       <div className='popup-footer'>
        <Title data={this.props.data} />
        <PerformersDate data={this.props.data} />
        <DescriptionURL data={this.props.data} />
        <VenueInfo data={this.props.data} />
        <button onClick={this._handleClick} className='route'>Route</button>
       </div>
     );
   }
 });
