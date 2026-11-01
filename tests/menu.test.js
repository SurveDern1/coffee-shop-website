import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {categories,extras,milk,searchMenu} from '../menu.js';
test('ten distinct categories cover the requested menu',()=>{
 assert.equal(categories.length,10);assert.equal(new Set(categories.map(c=>c.id)).size,10);
 assert.deepEqual(categories.map(c=>c.items.length),[12,3,7,3,6,7,3,2,8,2]);
});
test('every item has a unique id, name, portion and price',()=>{
 const items=categories.flatMap(c=>c.items);assert.equal(new Set(items.map(i=>i.id)).size,items.length);
 for(const item of items){assert.ok(item.name);assert.match(item.size,/\d/);assert.match(item.price,/^\d+(,\d+)?( \/ \d+(,\d+)?)*$/);}
});
test('source-sensitive prices and sizes are preserved',()=>{
 const find=id=>categories.flatMap(c=>c.items).find(i=>i.id===id);
 assert.equal(find('flat-white').price,'8,5');assert.equal(find('cappuccino').price,'8 / 9');
 assert.equal(find('bean-to-bar').size,'90 / 200');assert.equal(find('bean-to-bar').price,'10 / 13');
 assert.equal(find('decoction').price,'12 / 15');assert.equal(find('english').price,'28');
 assert.equal(find('benedict').size,'240');assert.equal(find('chicken-bowl').size,'280');
 assert.equal(milk.price,'1,2 / 3,5');assert.equal(extras.length,6);
});
test('search spans categories and ingredients, normalizes ё and word order',()=>{
 assert.ok(searchMenu('лосось').length>=4);assert.equal(searchMenu('ГРЕЧИШНЫЙ')[0].name,'Гречишный чай');
 assert.equal(searchMenu('вишневый')[0].id,'sweet-syrniki');assert.ok(searchMenu('курица панкейки').some(i=>i.id==='chicken-pancakes'));
 assert.equal(searchMenu('несуществующийзапрос').length,0);assert.equal(searchMenu('<script>').length,0);
});
test('all 53 individual menu images and local fonts exist',()=>{
 for(const item of categories.flatMap(c=>c.items)){assert.ok(fs.existsSync(new URL(`../assets/menu/${item.id}.webp`,import.meta.url)));}
 for(const file of ['hero-v2.webp','fonts.css','manrope-400.ttf','prata-400.ttf','menu.pdf'])assert.ok(fs.existsSync(new URL('../assets/'+file,import.meta.url)));
});
