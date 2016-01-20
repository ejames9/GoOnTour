
//Entry point file for the react-daterange-picker.
import React from 'react/addons';
import moment from 'moment';
import {} from 'moment-range';
import DateRangePicker from 'react-daterange-picker';
import { conStructionModule as Construct } from './conStruction';
import { log, dom } from './alias';



export const DatePicker = React.createClass({
  getInitialState() {                              //Initial state of the DatePicker.
    return {
      value: this.props.value,
      states: null,
    };
  },

  handleSelect(value, states) {                              //Select function, is called when a date-range is selected. It calls the showSearchOperations() function
    this.setState({value, states});    log(value);           //from the conStructionModule.
    // var elData = dom('#data-bridge'); log(elData);        //FIXME: This needs attention, at some point. Not super important.
    // var dataBridge = elData.getAttribute('data-bridge');
        Construct.showSearchOperations();                    //conStructionModule.showSearchOperations()
  },

  render() {               //Renders the DateRangePicker element. It is actually added to an invisible element in the initiate.js module.
    return (
      <div>
        <DateRangePicker {...this.props}
        firstOfWeek={1}
        numberOfCalendars={2}
        selectionType='range'
        minimumDate={new Date()}
        onSelect={this.handleSelect}
        value={this.state.value} />
        <div>
          <input type="text"
            value={this.state.value ? this.state.value.start.format('LL') : null}
            readOnly={true}
            className='drpInputS'
            placeholder="Start date"/>
          <input type="text"
            value={this.state.value ? this.state.value.end.format('LL') : null}
            readOnly={true}
            className='drpInputE'
            placeholder="End date" />
        </div>
      </div>
    );
  },
});
