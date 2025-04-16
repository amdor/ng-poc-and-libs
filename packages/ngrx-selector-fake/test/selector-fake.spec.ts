import { select, Store } from "@ngrx/store";
import { withLatestFrom } from "rxjs/operators";
import { TestBed } from "@angular/core/testing";
import { fakeSelector, SelectorFake } from "../src";
import { MockStore, provideMockStore } from "@ngrx/store/testing";
import { FeatureStateSelectors, State } from "./feature.selector";

const INITIAL_STATE = {
    flag: false,
    value: 1,
};

describe("fakeSelector", () => {
    let store: Store<State>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideMockStore({ initialState: INITIAL_STATE })],
        });
        store = TestBed.inject(MockStore);
    });

    it("should set initial state as normal", (done) => {
        store
            .pipe(
                select(FeatureStateSelectors.memoizedCalculatorSelector),
                withLatestFrom(store.select(FeatureStateSelectors.memoizedComplexSelector)),
            )
            .subscribe(([calcVal, complexVal]) => {
                expect(calcVal).toBe(2);
                expect(complexVal).toBe(0);
                done();
            });
    });

    describe("when all the subselectors are faked", () => {
        beforeEach(() => {
            fakeSelector(FeatureStateSelectors, "memoizedCalculatorSelector").and.useSelectors(() => 3);
        });
        it("should get the state as faked, and calculate with that", (done) => {
            store.select(FeatureStateSelectors.memoizedCalculatorSelector).subscribe((val) => {
                expect(val).toBe(6);
                done();
            });
        });
    });

    describe("when the subselectors are partially faked", () => {
        beforeEach(() => {
            // only needed in case the testsuite does note reinitialize the module/namespace the selectors are in
            (FeatureStateSelectors.memoizedCalculatorSelector as unknown as SelectorFake).and?.callThrough();
            fakeSelector(FeatureStateSelectors, "memoizedComplexSelector").and.useSelectors(
                () => true,
                FeatureStateSelectors.memoizedCalculatorSelector,
            );
        });
        it("should get the state as faked, and calculate with that", (done) => {
            store.select(FeatureStateSelectors.memoizedComplexSelector).subscribe((val) => {
                expect(val).toBe(2);
                done();
            });
        });
    });
});
