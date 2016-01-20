
//Entry point file for the react-daterange-picker.
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _reactAddons = require('react/addons');

var _reactAddons2 = _interopRequireDefault(_reactAddons);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

require('moment-range');

var _reactDaterangePicker = require('react-daterange-picker');

var _reactDaterangePicker2 = _interopRequireDefault(_reactDaterangePicker);

var _conStruction = require('./conStruction');

var _alias = require('./alias');

var DatePicker = _reactAddons2['default'].createClass({
  displayName: 'DatePicker',

  getInitialState: function getInitialState() {
    //Initial state of the DatePicker.
    return {
      value: this.props.value,
      states: null
    };
  },

  handleSelect: function handleSelect(value, states) {
    //Select function, is called when a date-range is selected. It calls the showSearchOperations() function
    this.setState({ value: value, states: states });(0, _alias.log)(value); //from the conStructionModule.
    // var elData = dom('#data-bridge'); log(elData);        //FIXME: This needs attention, at some point. Not super important.
    // var dataBridge = elData.getAttribute('data-bridge');
    _conStruction.conStructionModule.showSearchOperations(); //conStructionModule.showSearchOperations()
  },

  render: function render() {
    //Renders the DateRangePicker element. It is actually added to an invisible element in the initiate.js module.
    return _reactAddons2['default'].createElement(
      'div',
      null,
      _reactAddons2['default'].createElement(_reactDaterangePicker2['default'], _extends({}, this.props, {
        firstOfWeek: 1,
        numberOfCalendars: 2,
        selectionType: 'range',
        minimumDate: new Date(),
        onSelect: this.handleSelect,
        value: this.state.value })),
      _reactAddons2['default'].createElement(
        'div',
        null,
        _reactAddons2['default'].createElement('input', { type: 'text',
          value: this.state.value ? this.state.value.start.format('LL') : null,
          readOnly: true,
          className: 'drpInputS',
          placeholder: 'Start date' }),
        _reactAddons2['default'].createElement('input', { type: 'text',
          value: this.state.value ? this.state.value.end.format('LL') : null,
          readOnly: true,
          className: 'drpInputE',
          placeholder: 'End date' })
      )
    );
  }
});
exports.DatePicker = DatePicker;