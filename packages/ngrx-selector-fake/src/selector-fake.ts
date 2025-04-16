import { MemoizedSelector, Selector } from "@ngrx/store";
import { SelectorFake } from "./model";

export function fakeSelector(object: Record<string, any>, selectorName: string): SelectorFake {
    const originalSelector = object?.[selectorName];
    if (!originalSelector || !(originalSelector as any).projector) {
        throw new Error(selectorName + " is not a memoized selector");
    }
    const fake = { and: { useSelectors: () => fake, callThrough: () => fake } };

    const useSelectors = (...selectors: any[]): SelectorFake => {
        const fakeSelector = (state: any) => {
            const projectorArgs = (<Selector<any, any>[]>selectors).map((fn) => fn(state));
            return (originalSelector as MemoizedSelector<any, any>).projector(...projectorArgs);
        };
        object[selectorName] = Object.assign(fakeSelector, { ...fake });

        return fake;
    };

    const callThrough = () => {
        object[selectorName] = Object.assign(originalSelector, { ...fake });
        return fake;
    };

    fake.and.useSelectors = useSelectors;
    fake.and.callThrough = callThrough;
    return fake;
}
