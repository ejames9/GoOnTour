import React from 'react/addons';
import moment from 'moment';
import {} from 'moment-range';
import DateRangePicker from 'react-daterange-picker';
import { conStructionModule as Construct } from './conStruction';
import { log, dom } from './alias';



export const DatePicker = React.createClass({
  getInitialState() {
    return {
      value: this.props.value,
      states: null,
    };
  },

  handleSelect(value, states) {
    this.setState({value, states});    log(value);
    var elData = dom('#data-bridge');
    var dataBridge = elData.getAttribute('data-bridge');  
        Construct.showSearchOperations(dataBridge);
  },

  render() {
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
