
//This file builds the reactFlickrPopupFooter.

import { log, dom, on } from './alias';
import { goOnTourMapsModule as Map } from './goOnTourMaps';

var React = require('react');


//Here, all the mini-components of the popup footer are prepared for incorporation into the final element. The 'props' are passed in when
//the app is added to the DOM.
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

  _handleClick: function() {             //This function handles the click of the "route" button. When clicked, it calls the addDestination() function from the
    var userData = this.props.datum,     //goOnTourMapsModule, with userData and showData in tow.
        showData = this.props.coords;
        Map.addDestination(userData, showData);   //goOnTourMapsModule.addDestination().
  },

   render: function() {                  //Render instructions for the app.
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
