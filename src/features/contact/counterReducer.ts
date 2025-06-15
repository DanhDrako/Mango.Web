import { createSlice } from "@reduxjs/toolkit";

export type CounterState = {
  data: number;
};

const initialState: CounterState = {
  data: 42,
};

export const counterSlice = createSlice({
  name: "counter",
  initialState: {
    value: initialState.data,
  },
  reducers: {
    increment: (state, action) => {
      state.value += action.payload;
    },
    decrement: (state, action) => {
      state.value -= action.payload;
    },
  },
});

export const { increment, decrement } = counterSlice.actions;

export const incrementLegacy = (amount: number = 1) => {
  return {
    type: "increment",
    payload: amount,
  };
};

export const decrementLegacy = (amount: number = 1) => {
  return {
    type: "decrement",
    payload: amount,
  };
};
