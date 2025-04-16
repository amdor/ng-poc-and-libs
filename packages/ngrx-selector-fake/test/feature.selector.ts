import { createSelector } from "@ngrx/store";

export interface State {
    flag: boolean;
    value: number;
}

export namespace FeatureStateSelectors {
    export const selectFlag = (state: State) => state.flag;

    export const selectValue = (state: State) => state.value;

    export const memoizedCalculatorSelector = createSelector(selectValue, (val: number): number => {
        return val * 2;
    });

    export const memoizedComplexSelector = createSelector(
        selectFlag,
        memoizedCalculatorSelector,
        // eslint-disable-next-line prettier/prettier
        (flag: boolean, calculated: number) => (flag ? calculated : 0),
    );
}
