const tableTemplate = (amount: number, packets: Array<number>) => {
    const row = Array.from(new Array(amount + 1)).map((_, i) => !i ? i : amount + 1);
    return [
        ...[0, ...packets].map(() => ([
            ...row,
        ])),
    ];
}


const compute = (amount: number, packets: Array<number>, tableTemplate) => {
    const table = [ ...tableTemplate ];

    for (let i = 0; i <= amount; i++) {
        for (let j = 1; j <= packets.length; j++) {
            // if the current packet size is greater than the current value i
            // We assign the current row the same value as the previous row
            // if the packet size is less than the required value
            // wewill want to find the minimum value, between the current value in the previous row
            // and the current active size and the last value with the previous packet
            table[j][i] = (packets[j - 1] > i)
                ? 1//table[j - 1][i]
                : Math.min(table[j - 1][i], 1 + table[j][i - packets[j - 1]]);
        }
    }

    return table;
}

export const order = (amount: number, packets: Array<number>) => {
    if (isNaN(amount) || !amount || amount < 1) {
        return 0;
    }

    const template = tableTemplate(amount, packets);
    const table : Array<Array<any>> = compute(amount, packets, template).splice(1, packets.length);
    let count : number = (table[packets.length - 1][amount] > amount) ? -1 : table[packets.length - 1][amount];

    if (count > 0) {
        return count;
    }

    // TODO
    // Pick all possible solutions
    // Choose the lease amount of sweets
    // That's our answer

    let inc = amount;
    while (count < 0 && inc > 0) {
        count = (table[packets.length - 1][inc] > amount)
            ? -1
            : table[packets.length - 1][inc];
        inc--;
    }

    return count;
}
