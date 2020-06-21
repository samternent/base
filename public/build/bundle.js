
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function to_number(value) {
        return value === '' ? undefined : +value;
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const prop_values = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if ($$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set() {
            // overridden by instance, if it has props
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.23.2' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev("SvelteDOMInsert", { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev("SvelteDOMInsert", { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev("SvelteDOMRemove", { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ["capture"] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev("SvelteDOMAddEventListener", { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev("SvelteDOMRemoveEventListener", { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev("SvelteDOMRemoveAttribute", { node, attribute });
        else
            dispatch_dev("SvelteDOMSetAttribute", { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.data === data)
            return;
        dispatch_dev("SvelteDOMSetData", { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error(`'target' is a required option`);
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn(`Component was already destroyed`); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src/components/Tailwindcss.svelte generated by Svelte v3.23.2 */

    function create_fragment(ctx) {
    	const block = {
    		c: noop,
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props) {
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Tailwindcss> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Tailwindcss", $$slots, []);
    	return [];
    }

    class Tailwindcss extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Tailwindcss",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    function __spreadArrays() {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    }

    // Uses lookup table to find optimised packet groups for the given amount.
    var getGroup = function (table, packets, maxAmount, activeSolution) {
        var group = [];
        var inc = table.length - 1;
        while (inc >= 0) {
            if (table[packets.length - 1][activeSolution] > maxAmount) {
                activeSolution--;
            }
            if (!table[inc - 1] || table[inc][activeSolution] !== table[inc - 1][activeSolution]) {
                var amount = Math.floor(activeSolution / packets[inc]);
                if (amount * packets[inc] <= activeSolution) {
                    group = __spreadArrays(group, Array.from(new Array(amount)).map(function () { return packets[inc]; }));
                }
                activeSolution = activeSolution - (amount * packets[inc]);
            }
            inc--;
        }
        return group;
    };
    // Creates a blank table template we can pass to the compute method
    var tableTemplate = function (amount, packets) {
        var row = Array.from(new Array(amount + 1)).map(function (_, i) { return !i ? i : amount + 1; });
        return __spreadArrays(__spreadArrays([0], packets).map(function () { return (__spreadArrays(row)); }));
    };
    // Populates a given table with all possible combination values.
    var compute = function (amount, packets, tableTemplate) {
        var table = __spreadArrays(tableTemplate);
        for (var i = 0; i <= amount; i++) {
            for (var j = 1; j <= packets.length; j++) {
                // if the current packet size is greater than the current value i
                // We assign the current row the same value as the previous row
                // if the packet size is less than the required value
                // wewill want to find the minimum value, between the current value in the previous row
                // and the current active size and the last value with the previous packet
                table[j][i] = (packets[j - 1] > i)
                    ? table[j - 1][i]
                    : Math.min(table[j - 1][i], 1 + table[j][i - packets[j - 1]]);
            }
        }
        return table;
    };
    var order = function (amount, packets) {
        if (isNaN(amount) || !amount || amount < 1) {
            return 0;
        }
        // To avoid wastage we want to include the amount + our smallest packet size in our table.
        // We can then use that as our upper limit if an exact match isn't found.
        var maxAmount = amount + packets[0];
        var template = tableTemplate(maxAmount, packets);
        var table = compute(maxAmount, packets, template).splice(1, packets.length);
        var solution = amount;
        var count = (table[packets.length - 1][solution] > solution) ? -1 : table[packets.length - 1][solution];
        var group = getGroup(table, packets, maxAmount, amount);
        var activeSolution = maxAmount - 1;
        while (count < 0 && activeSolution > 0) {
            if (table[packets.length - 1][activeSolution] > maxAmount) {
                count = -1;
            }
            else {
                count = table[packets.length - 1][activeSolution];
                group = getGroup(table, packets, maxAmount, activeSolution);
                break;
            }
            activeSolution--;
        }
        return {
            group: group,
            total: group.reduce(function (a, b) { return a + b; }, 0),
        };
    };

    /* src/components/SimonsSweetShop.svelte generated by Svelte v3.23.2 */

    const { Object: Object_1 } = globals;
    const file = "src/components/SimonsSweetShop.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	return child_ctx;
    }

    // (35:4) {#each Object.keys(combinations).reverse() as packet}
    function create_each_block(ctx) {
    	let p;
    	let span0;
    	let t0_value = /*packet*/ ctx[6] + "";
    	let t0;
    	let t1;
    	let span2;
    	let span1;
    	let t3;
    	let t4_value = (/*combinations*/ ctx[2][/*packet*/ ctx[6]] || 0) + "";
    	let t4;
    	let t5;

    	const block = {
    		c: function create() {
    			p = element("p");
    			span0 = element("span");
    			t0 = text(t0_value);
    			t1 = space();
    			span2 = element("span");
    			span1 = element("span");
    			span1.textContent = "🛍️";
    			t3 = text(" x");
    			t4 = text(t4_value);
    			t5 = space();
    			add_location(span0, file, 36, 8, 1248);
    			attr_dev(span1, "class", "text-l mr-2");
    			add_location(span1, file, 37, 32, 1302);
    			attr_dev(span2, "class", "font-thin");
    			add_location(span2, file, 37, 8, 1278);
    			attr_dev(p, "class", "bg-gray-200 font-normal flex justify-between rounded-full px-3 py-1 text-sm text-gray-700 m-2");
    			add_location(p, file, 35, 6, 1134);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, span0);
    			append_dev(span0, t0);
    			append_dev(p, t1);
    			append_dev(p, span2);
    			append_dev(span2, span1);
    			append_dev(span2, t3);
    			append_dev(span2, t4);
    			append_dev(p, t5);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*combinations*/ 4 && t0_value !== (t0_value = /*packet*/ ctx[6] + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*combinations*/ 4 && t4_value !== (t4_value = (/*combinations*/ ctx[2][/*packet*/ ctx[6]] || 0) + "")) set_data_dev(t4, t4_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(35:4) {#each Object.keys(combinations).reverse() as packet}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let t0;
    	let div2;
    	let div0;
    	let h2;
    	let t2;
    	let input0;
    	let t3;
    	let input1;
    	let t4;
    	let p;
    	let strong;
    	let t6;
    	let t7_value = /*results*/ ctx[1].total + "";
    	let t7;
    	let t8;
    	let div1;
    	let mounted;
    	let dispose;
    	let each_value = Object.keys(/*combinations*/ ctx[2]).reverse();
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			t0 = space();
    			div2 = element("div");
    			div0 = element("div");
    			h2 = element("h2");
    			h2.textContent = "Simons Sweet Shop";
    			t2 = space();
    			input0 = element("input");
    			t3 = space();
    			input1 = element("input");
    			t4 = space();
    			p = element("p");
    			strong = element("strong");
    			strong.textContent = "Total Order:";
    			t6 = space();
    			t7 = text(t7_value);
    			t8 = space();
    			div1 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			document.title = "🛍️ Simons Sweet Shop";
    			attr_dev(h2, "class", "font-extrabold text-primary text-3xl mb-4");
    			add_location(h2, file, 26, 6, 555);
    			attr_dev(input0, "class", "appearance-none block w-full bg-gray-100 text-gray-700 border rounded py-3 px-4 mb-2 leading-tight focus:outline-none focus:bg-white");
    			attr_dev(input0, "type", "number");
    			attr_dev(input0, "min", "1");
    			attr_dev(input0, "max", "50000");
    			add_location(input0, file, 27, 6, 638);
    			attr_dev(input1, "type", "range");
    			attr_dev(input1, "min", "1");
    			attr_dev(input1, "max", "50000");
    			attr_dev(input1, "class", "my-4 w-full");
    			add_location(input1, file, 28, 6, 839);
    			add_location(strong, file, 30, 8, 978);
    			attr_dev(p, "class", "text-gray-700 text-base pt-2 text-right");
    			add_location(p, file, 29, 6, 918);
    			attr_dev(div0, "class", "px-6 py-4");
    			add_location(div0, file, 25, 2, 525);
    			attr_dev(div1, "class", "px-6 py-2");
    			add_location(div1, file, 33, 2, 1046);
    			attr_dev(div2, "class", "max-w-sm bg-white rounded shadow-lg mx-auto my-4 h-auto");
    			add_location(div2, file, 24, 0, 453);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div0, h2);
    			append_dev(div0, t2);
    			append_dev(div0, input0);
    			set_input_value(input0, /*value*/ ctx[0]);
    			append_dev(div0, t3);
    			append_dev(div0, input1);
    			set_input_value(input1, /*value*/ ctx[0]);
    			append_dev(div0, t4);
    			append_dev(div0, p);
    			append_dev(p, strong);
    			append_dev(p, t6);
    			append_dev(p, t7);
    			append_dev(div2, t8);
    			append_dev(div2, div1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div1, null);
    			}

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[3]),
    					listen_dev(input1, "change", /*input1_change_input_handler*/ ctx[4]),
    					listen_dev(input1, "input", /*input1_change_input_handler*/ ctx[4])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*value*/ 1 && to_number(input0.value) !== /*value*/ ctx[0]) {
    				set_input_value(input0, /*value*/ ctx[0]);
    			}

    			if (dirty & /*value*/ 1) {
    				set_input_value(input1, /*value*/ ctx[0]);
    			}

    			if (dirty & /*results*/ 2 && t7_value !== (t7_value = /*results*/ ctx[1].total + "")) set_data_dev(t7, t7_value);

    			if (dirty & /*combinations, Object*/ 4) {
    				each_value = Object.keys(/*combinations*/ ctx[2]).reverse();
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div1, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div2);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let value = 250;
    	let bags = [250, 500, 1000, 2000, 5000];
    	let results;
    	let combinations = {};
    	const writable_props = [];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<SimonsSweetShop> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("SimonsSweetShop", $$slots, []);

    	function input0_input_handler() {
    		value = to_number(this.value);
    		$$invalidate(0, value);
    	}

    	function input1_change_input_handler() {
    		value = to_number(this.value);
    		$$invalidate(0, value);
    	}

    	$$self.$capture_state = () => ({
    		order,
    		value,
    		bags,
    		results,
    		combinations
    	});

    	$$self.$inject_state = $$props => {
    		if ("value" in $$props) $$invalidate(0, value = $$props.value);
    		if ("bags" in $$props) $$invalidate(5, bags = $$props.bags);
    		if ("results" in $$props) $$invalidate(1, results = $$props.results);
    		if ("combinations" in $$props) $$invalidate(2, combinations = $$props.combinations);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*value, results*/ 3) {
    			 {
    				$$invalidate(1, results = order(parseInt(value, 10), bags));

    				if (results.group) {
    					$$invalidate(2, combinations = results.group.reduce(
    						(acc, curr) => ({
    							...acc,
    							[curr]: acc[curr] ? acc[curr] + 1 : 1
    						}),
    						{}
    					));
    				}
    			}
    		}
    	};

    	return [
    		value,
    		results,
    		combinations,
    		input0_input_handler,
    		input1_change_input_handler
    	];
    }

    class SimonsSweetShop extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SimonsSweetShop",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* node_modules/svelte-feather-icons/src/icons/GithubIcon.svelte generated by Svelte v3.23.2 */

    const file$1 = "node_modules/svelte-feather-icons/src/icons/GithubIcon.svelte";

    function create_fragment$2(ctx) {
    	let svg;
    	let path;
    	let svg_class_value;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22");
    			add_location(path, file$1, 12, 231, 487);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", /*size*/ ctx[0]);
    			attr_dev(svg, "height", /*size*/ ctx[0]);
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "stroke", "currentColor");
    			attr_dev(svg, "stroke-width", "2");
    			attr_dev(svg, "stroke-linecap", "round");
    			attr_dev(svg, "stroke-linejoin", "round");
    			attr_dev(svg, "class", svg_class_value = "feather feather-github " + /*customClass*/ ctx[1]);
    			add_location(svg, file$1, 12, 0, 256);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*size*/ 1) {
    				attr_dev(svg, "width", /*size*/ ctx[0]);
    			}

    			if (dirty & /*size*/ 1) {
    				attr_dev(svg, "height", /*size*/ ctx[0]);
    			}

    			if (dirty & /*customClass*/ 2 && svg_class_value !== (svg_class_value = "feather feather-github " + /*customClass*/ ctx[1])) {
    				attr_dev(svg, "class", svg_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { size = "100%" } = $$props;
    	let { class: customClass = "" } = $$props;

    	if (size !== "100%") {
    		size = size.slice(-1) === "x"
    		? size.slice(0, size.length - 1) + "em"
    		: parseInt(size) + "px";
    	}

    	const writable_props = ["size", "class"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<GithubIcon> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("GithubIcon", $$slots, []);

    	$$self.$set = $$props => {
    		if ("size" in $$props) $$invalidate(0, size = $$props.size);
    		if ("class" in $$props) $$invalidate(1, customClass = $$props.class);
    	};

    	$$self.$capture_state = () => ({ size, customClass });

    	$$self.$inject_state = $$props => {
    		if ("size" in $$props) $$invalidate(0, size = $$props.size);
    		if ("customClass" in $$props) $$invalidate(1, customClass = $$props.customClass);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [size, customClass];
    }

    class GithubIcon extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { size: 0, class: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "GithubIcon",
    			options,
    			id: create_fragment$2.name
    		});
    	}

    	get size() {
    		throw new Error("<GithubIcon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<GithubIcon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<GithubIcon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<GithubIcon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/MadeWith.svelte generated by Svelte v3.23.2 */
    const file$2 = "src/components/MadeWith.svelte";

    function create_fragment$3(ctx) {
    	let p;
    	let t0;
    	let a;
    	let githubicon;
    	let t1;
    	let current;

    	githubicon = new GithubIcon({
    			props: { size: "1.5x", class: "inline font-thin" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text("Source on ");
    			a = element("a");
    			create_component(githubicon.$$.fragment);
    			t1 = text(" Github");
    			attr_dev(a, "href", "https://github.com/samternent/base/tree/simons-sweet-shop");
    			attr_dev(a, "class", "hover:text-primary");
    			add_location(a, file$2, 4, 12, 104);
    			attr_dev(p, "class", "font-thin");
    			add_location(p, file$2, 3, 0, 70);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, a);
    			mount_component(githubicon, a, null);
    			append_dev(a, t1);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(githubicon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(githubicon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    			destroy_component(githubicon);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<MadeWith> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("MadeWith", $$slots, []);
    	$$self.$capture_state = () => ({ GithubIcon });
    	return [];
    }

    class MadeWith extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MadeWith",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.23.2 */
    const file$3 = "src/App.svelte";

    function create_fragment$4(ctx) {
    	let main;
    	let simonssweetshop;
    	let t0;
    	let madewith;
    	let t1;
    	let tailwindcss;
    	let current;
    	simonssweetshop = new SimonsSweetShop({ $$inline: true });
    	madewith = new MadeWith({ $$inline: true });
    	tailwindcss = new Tailwindcss({ $$inline: true });

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(simonssweetshop.$$.fragment);
    			t0 = space();
    			create_component(madewith.$$.fragment);
    			t1 = space();
    			create_component(tailwindcss.$$.fragment);
    			attr_dev(main, "class", "flex flex-col text-center h-screen w-screen");
    			add_location(main, file$3, 6, 0, 205);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(simonssweetshop, main, null);
    			append_dev(main, t0);
    			mount_component(madewith, main, null);
    			insert_dev(target, t1, anchor);
    			mount_component(tailwindcss, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(simonssweetshop.$$.fragment, local);
    			transition_in(madewith.$$.fragment, local);
    			transition_in(tailwindcss.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(simonssweetshop.$$.fragment, local);
    			transition_out(madewith.$$.fragment, local);
    			transition_out(tailwindcss.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(simonssweetshop);
    			destroy_component(madewith);
    			if (detaching) detach_dev(t1);
    			destroy_component(tailwindcss, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("App", $$slots, []);
    	$$self.$capture_state = () => ({ Tailwindcss, SimonsSweetShop, MadeWith });
    	return [];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    const app = new App({
        target: document.body,
        props: {},
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
