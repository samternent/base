import test from 'ava';
import { order } from './';

const packets = [250, 500, 1000, 2000, 5000];

test('order will find combinations using exact matches', t => {
	t.is(order(250, packets), 1);
	t.is(order(750, packets), 2);
	t.is(order(1250, packets), 2);
	t.is(order(12000, packets), 3);
	t.is(order(32750, packets), 9);
});


test('order will find the optimal packets size for an order, but well send too many sweets', t => {
	t.is(order(250, packets), 1);
	t.is(order(251, packets), 1);
	t.is(order(501, packets), 1);
	t.is(order(12001, packets), 3);
	t.is(order(32750, packets), 9);
});


test('we will get it right', t => {
	t.is(order(250, packets), 1);
	t.is(order(251, packets), 1);
	t.is(order(501, packets), 1);
	t.is(order(12001, packets), 4);
});
