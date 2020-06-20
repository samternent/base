import test from 'ava';
import { order } from './';

const packets = [250, 500, 1000, 2000, 5000];

test('we will get it right', t => {
	t.is(order(1, packets), 1);
	t.is(order(250, packets), 1);
	t.is(order(251, packets), 1);
	t.is(order(501, packets), 2);
	t.is(order(12001, packets), 4);
});
