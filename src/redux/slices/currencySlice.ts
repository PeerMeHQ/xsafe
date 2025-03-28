import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CurrencySlice {
  currencyConverted: number;
  selectedCurrency: string;
  previousCurrency: string;
  multisigValueInUsd: number;
}

const initialState: CurrencySlice = {
  currencyConverted: 0,
  selectedCurrency: 'USD',
  previousCurrency: 'USD',
  multisigValueInUsd: 0,
};

export const currencySlice = createSlice({
  name: 'currencySlice',
  initialState,
  reducers: {
    setTotalValueConverted(
      state: CurrencySlice,
      action: PayloadAction<number>,
    ) {
      return {
        ...state,
        currencyConverted: action.payload,
      };
    },
    setSelectedCurrency(state: CurrencySlice, action: PayloadAction<string>) {
      return {
        ...state,
        previousCurrency:
          action.payload !== state.selectedCurrency
            ? state.selectedCurrency
            : state.previousCurrency,
        selectedCurrency: action.payload,
      };
    },
    setValueInUsd(state: CurrencySlice, action: PayloadAction<number>) {
      return { ...state, valueInUsd: action.payload };
    },
  },
});

export const { setTotalValueConverted, setSelectedCurrency, setValueInUsd } =
  currencySlice.actions;

export default currencySlice.reducer;
