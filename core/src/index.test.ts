import test from 'ava';
import { order } from './';

const packets = [250, 500, 1000, 2000, 5000];

test('Order form should return the minimum sweets in the fewest packets', t => {
	t.deepEqual(order(1, packets), { group: [250], total: 250 });
	t.deepEqual(order(250, packets), { group: [250], total: 250 });
	t.deepEqual(order(251, packets), { group: [500], total: 500 });
	t.deepEqual(order(832, packets), { group: [1000], total: 1000 });
	t.deepEqual(order(501, packets), { group: [500, 250], total: 750 });
	t.deepEqual(order(12001, packets), { group: [5000, 5000, 2000, 250], total: 12250 });
});
