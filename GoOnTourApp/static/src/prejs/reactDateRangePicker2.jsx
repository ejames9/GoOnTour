import React from 'react/addons';
import moment from 'moment';
import {} from 'moment-range';
import DateRangePicker from 'react-daterange-picker';



const DatePickerRange = React.createClass({
  getInitialState() {
    return {
      value: this.props.value,
      states: null,
    };
  },

  handleSelect(value, states) {
    this.setState({value, states});
  },

  render() {
    return (
      <div>
        <DateRangePicker {...this.props} onSelect={this.handleSelect} value={this.state.value} />
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

export var DatePicker = React.createClass({
  getDefaultProps() {
    return {};
  },

  render() {
    var stateDefinitions = {
      available: {
        color: '#ffffff',
        label: 'Available',
      },
      enquire: {
        color: '#ffd200',
        label: 'Enquire',
      },
      unavailable: {
        selectable: false,
        color: '#78818b',
        label: 'Unavailable',
      },
    };

    var dateRanges = [
      {
        state: 'enquire',
        range: moment.range(
          moment().add(2, 'weeks').subtract(5, 'days'),
          moment().add(2, 'weeks').add(6, 'days')
        ),
      },
      {
        state: 'unavailable',
        range: moment.range(
          moment().add(3, 'weeks'),
          moment().add(3, 'weeks').add(5, 'days')
        ),
      },
    ];

    var initialStart = moment().add(1, 'weeks').startOf('day');
    var initialEnd = moment().add(1, 'weeks').add(3, 'days').startOf('day');

    return (
      <DatePickerRange
        firstOfWeek={1}
        numberOfCalendars={2}
        selectionType='range'
        minimumDate={new Date()}
        maximumDate={moment().add(2, 'years').toDate()}
        stateDefinitions={stateDefinitions}
        dateStates={dateRanges}
        defaultState="available"
        value={moment.range(initialStart, initialEnd)}
        showLegend={true}
        />
      );
    },
  });
