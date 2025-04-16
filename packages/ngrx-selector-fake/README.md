# ngrx-selector-fake
For tests where we don't want to mock/stub/spy the whole selector, only a select few dependent selectors that are not relevant for the test case/suite.

## Installation

`npm i --save ngrx-selector-fake`

## Usage
We were aiming at creating a similar experience to Jest/Jasmine `Spy`s.

### `fakeSelector(object, selectorName)`
Creates fake object, returns a SelectorFake.
Example:
```typescript
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
        (flag: boolean, calculated: number) => flag ? calculated : 0
    );
}
```

Test example:
```typescript
describe("when the subselectors are partially faked", () => {
        beforeEach(() => {
            fakeSelector(FeatureStateSelectors, "memoizedComplexSelector").and.useSelectors(
                () => true, // stubbing the first dependent selector
                FeatureStateSelectors.memoizedCalculatorSelector, // using the original for the second dependent
            );
        });
        it("should get the state as faked, and calculate with that", (done) => {
            store.select(FeatureStateSelectors.memoizedComplexSelector).subscribe((val) => {
                expect(val).toBe(2);
                done();
            });
        });
    });
```

See more exapmles in [tests](https://github.com/amdor/ngrx-selector-fake/blob/main/test/selector-fake.spec.ts)

