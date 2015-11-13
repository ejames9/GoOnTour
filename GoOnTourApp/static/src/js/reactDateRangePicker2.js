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

var DatePickerRange = _reactAddons2['default'].createClass({
  displayName: 'DatePickerRange',

  getInitialState: function getInitialState() {
    return {
      value: this.props.value,
      states: null
    };
  },

  handleSelect: function handleSelect(value, states) {
    this.setState({ value: value, states: states });
  },

  render: function render() {
    return _reactAddons2['default'].createElement(
      'div',
      null,
      _reactAddons2['default'].createElement(_reactDaterangePicker2['default'], _extends({}, this.props, { onSelect: this.handleSelect, value: this.state.value })),
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

var DatePicker = _reactAddons2['default'].createClass({
  displayName: 'DatePicker',

  getDefaultProps: function getDefaultProps() {
    return {};
  },

  render: function render() {
    var stateDefinitions = {
      available: {
        color: '#ffffff',
        label: 'Available'
      },
      enquire: {
        color: '#ffd200',
        label: 'Enquire'
      },
      unavailable: {
        selectable: false,
        color: '#78818b',
        label: 'Unavailable'
      }
    };

    var dateRanges = [{
      state: 'enquire',
      range: _moment2['default'].range((0, _moment2['default'])().add(2, 'weeks').subtract(5, 'days'), (0, _moment2['default'])().add(2, 'weeks').add(6, 'days'))
    }, {
      state: 'unavailable',
      range: _moment2['default'].range((0, _moment2['default'])().add(3, 'weeks'), (0, _moment2['default'])().add(3, 'weeks').add(5, 'days'))
    }];

    var initialStart = (0, _moment2['default'])().add(1, 'weeks').startOf('day');
    var initialEnd = (0, _moment2['default'])().add(1, 'weeks').add(3, 'days').startOf('day');

    return _reactAddons2['default'].createElement(DatePickerRange, {
      firstOfWeek: 1,
      numberOfCalendars: 2,
      selectionType: 'range',
      minimumDate: new Date(),
      maximumDate: (0, _moment2['default'])().add(2, 'years').toDate(),
      stateDefinitions: stateDefinitions,
      dateStates: dateRanges,
      defaultState: 'available',
      value: _moment2['default'].range(initialStart, initialEnd),
      showLegend: true
    });
  }
});
exports.DatePicker = DatePicker;