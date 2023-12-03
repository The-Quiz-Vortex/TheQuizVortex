import { useState } from "react";


export function useCounter(initialState: number) {
    const [value, setValue] = useState<number>(initialState);
    const reset = () => setValue(0);

    const add = () => setValue((value) => (value += 1));

    const set = (v) => setValue(v);

    return { value, add, reset, set};
}