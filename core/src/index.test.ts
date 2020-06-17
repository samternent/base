import test from 'ava';
import { start } from './';

test('start returns hi', t => {
	t.is(start(), 'hi');
});
