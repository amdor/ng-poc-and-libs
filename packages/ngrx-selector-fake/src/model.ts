export interface FakeAnd {
    useSelectors: (...selectors: any[]) => SelectorFake;
    callThrough: () => SelectorFake;
}

export interface SelectorFake {
    and: FakeAnd;
}
