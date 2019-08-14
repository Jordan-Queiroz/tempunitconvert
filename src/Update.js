import * as R from 'ramda';

export const MSG = {
  LEFT_VALUE: "LEFT_VALUE",
  RIGHT_VALUE: "RIGHT_VALUE",
  CHANGE_LEFT_UNIT: "CHANGE_LEFT_UNIT",
  CHANGE_RIGHT_UNIT: "CHANGE_RIGHT_UNIT"
}

export function leftValueMsg(value) {
  return {
    type: MSG.LEFT_VALUE,
    value
  }
}

export function rightValueMsg(value) {
  return {
    type: MSG.RIGHT_VALUE,
    value
  }
}

export function changeLeftUnitMsg(unit, inputMsg) {
  return {
    type: MSG.CHANGE_LEFT_UNIT,
    unit
  }
}

export function changeRightUnitMsg(unit) {
  return {
    type: MSG.CHANGE_RIGHT_UNIT,
    unit
  }
}

const toInt = R.pipe(parseInt, R.defaultTo(0));

function convert(model) {

  const {leftValue, leftUnit, rightValue, rightUnit} = model;

  const [ unitFrom, tempFrom, unitTo ] = model.sourceLeft
    // return this if model.sourceLeft is true
    ? [leftUnit, leftValue, rightUnit]
    // return this if model.sourceLeft is false
    : [rightUnit, rightValue, leftUnit]

  const convertedValue = R.pipe(
    convertFromToTemp,
    round,
  )(unitFrom, unitTo, tempFrom)

  return model.sourceLeft
    ? {...model, rightValue: convertedValue}
    : {...model, leftValue: convertedValue}
}

function convertFromToTemp(unitFrom, unitTo, tempFrom) {
  const convertFn = R.pathOr(
    R.identity,
    [unitFrom, unitTo],
    UnitConversions);

  return convertFn(tempFrom)
}

function FtoC(temp) {
  return  5 / 9 * (temp - 32);
}

function CtoF(temp) {
  return 9 / 5 * temp + 32;
}

function KtoC(temp) {
  return temp - 273.15;
}

function CtoK(temp) {
  return temp + 273.15;
}

const FtoK = R.pipe(FtoC, CtoK);
const KtoF = R.pipe(KtoC, CtoF);

const UnitConversions = {
  Celsius: {
    Fahrenheit: CtoF,
    Kelvin: CtoK,
  },
  Fahrenheit: {
    Celsius: FtoC,
    Kelvin: FtoK,
  },
  Kelvin: {
    Celsius: KtoC,
    Fahrenheit: KtoF,
  },
};

function round(number) {
  return Math.round(number * 10) / 10;
}

function update (msg, model) {
  switch (msg.type) {
    case MSG.LEFT_VALUE: {
      if (msg.value === '')
        return {...model, sourceLeft: true, leftValue: '', rightValue: ''}
      const leftValue = toInt(msg.value)

      return convert({...model, sourceLeft: true, leftValue})
    }
    case MSG.RIGHT_VALUE: {
      if (msg.value === '')
        return {...model, sourceLeft: false, leftValue: '', rightValue: ''}
      const rightValue = toInt(msg.value)

      return convert({...model, sourceLeft: false, rightValue})
    }
    case MSG.CHANGE_LEFT_UNIT: {
      const leftUnit = msg.unit

      return convert({...model, leftUnit})
    }
    case MSG.CHANGE_RIGHT_UNIT: {
      const rightUnit = msg.unit

      return convert({...model, rightUnit})
    }
  }
  return model;
}

export default update;
