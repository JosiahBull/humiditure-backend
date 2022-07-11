export type Node = {
    getId: () => string;
    getValue: () => string;
    setValue: (value: string) => void;
};

export const NodeHandler = (node_id: string): Node => {
    const id = node_id;
    let value = 'not set';

    function getId(): string {
        return id;
    }

    function getValue(): string {
        return value;
    }

    function setValue(new_value: string): void {
        value = new_value;
    }

    return { getId, getValue, setValue };
};
