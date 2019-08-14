import * as R from 'ramda';
import hh from 'hyperscript-helpers';
import { h } from 'virtual-dom';

import {
  leftValueMsg,
  rightValueMsg,
  changeLeftUnitMsg,
  changeRightUnitMsg
} from './Update'

const {
  div,
  h1,
  pre,
  input,
  select,
  option
} = hh(h);

const UNITS = [
  'Celsius',
  'Fahrenheit',
  'Kelvin'
]

function unitOptions(selectedUnit) {
  return R.map(
    unit => option({value: unit, selected: unit === selectedUnit}, unit),
    UNITS
  )
}

function unitSelection(dispatch, unit, value, inputMsg, changeUnitMsg) {
  return div({className: 'w-50 ma1'}, [
    input({
      className: 'db w-100 mv2 pa2 input-reset ba',
      type: 'text',
      value,
      oninput: v => dispatch(inputMsg(v.target.value))
    }),
    select(
      {
        className: 'db w-100 pa2 ba input-reset br1 bg-white ba b--black',
        onchange: u => dispatch(changeUnitMsg(u.target.value))
      },
      unitOptions(unit)
    )
  ]);
}

function tempConverter(dispatch, model) {
  const leftUnitSelector = unitSelection(dispatch, model.leftUnit, model.leftValue, leftValueMsg, changeLeftUnitMsg)
  const rightUnitSelector = unitSelection(dispatch, model.rightUnit, model.rightValue, rightValueMsg,changeRightUnitMsg)

  return div({className: 'flex'}, [
    leftUnitSelector,
    rightUnitSelector
  ]);
}

function view(dispatch, model) {
  return div({ className: 'mw6 center' }, [
    h1({ className: 'f2 pv2 bb' }, 'Temperature Unit Converter'),
    tempConverter(dispatch, model),
    pre(JSON.stringify(model, null, 2)),
  ]);
}

export default view;
