// Transcribed from the supplied Coffee 26 PDF. Portions: grams for food, ml for drinks.
const item = (id, name, size, price, description = '', image = null) => ({ id, name, size, price, description, image: id });
export const categories = [
  {id:'breakfast',name:'Завтраки',note:'Готовим до 20:00',unit:'г',items:[
    item('english','Английский завтрак','300','28','Глазунья из двух яиц, бекон, томаты черри, фасоль в томатном соусе, жареные шампиньоны, кремчиз, бриошь.','english'),
    item('salmon-pancakes','Панкейки с лососем','230','25','Панкейки, лосось, сливочно-лимонный соус, огурец, лайм.','pancakes'),
    item('chicken-pancakes','Панкейки с курицей','270','22','Панкейки, курица, соус вишня-барбекю, глазунья, корнишоны.'),
    item('cheese-syrniki','Сырные сырники','200','18','Четыре сырника с сулугуни, сметана, грецкий орех.'),
    item('salmon-syrniki','Сырные сырники с лососем','250','26','Четыре сырника с сулугуни, лосось, сметана.'),
    item('sweet-syrniki','Сладкие сырники','220','18','Четыре сырника, сметана, вишнёвый джем.','syrniki'),
    item('benedict','Яйца бенедикт с беконом','240','25','Бриошь, сыр чеддер, листья шпината, бекон, яйца пашот, сливочный соус.','benedict'),
    item('copenhagen','Копенгаген с лососем','300','28','Бриошь, сливочно-лимонный соус, огурец, шпинат, лосось, яйца пашот, пряное масло.'),
    item('chicken-bowl','Птитим-боул с курицей','280','21','Птитим в шпинатно-сливочном соусе, курица, айсберг, огурец, томаты черри.'),
    item('salmon-bowl','Птитим-боул с лососем','290','25','Птитим в шпинатно-сливочном соусе, лосось, айсберг, огурец, томаты черри.'),
    item('buckwheat','Сливочная гречка с грибами','300','21','Гречка, сливки, пармезан, шампиньоны, бекон.'),
    item('oatmeal','Овсяная каша с яблоками','350','18','Овсяная каша на молоке, карамелизированные яблоки с корицей, грецкие орехи, тахинная карамель.')
  ]},
  {id:'sandwiches',name:'Сэндвичи',note:'На бриоши',unit:'г',items:[
    item('chicken-sandwich','С курицей','180','15','Бриошь, сливочно-чесночный соус, шампиньоны, моцарелла, курица, маринованные корнишоны.'),
    item('pepperoni','С пеперони','190','15','Бриошь, соус вишня-барбекю, томаты, пепперони, моцарелла, чеддер.'),
    item('cheese-cranberry','С сыром и клюквой','170','15','Бриошь, кремчиз, моцарелла, горгонзола, грецкий орех, клюквенный соус.')
  ]},
  {id:'coffee',name:'Кофе',note:'Эспрессо, фильтр и кофе с молоком',unit:'мл',items:[
    item('espresso','Эспрессо','40','7'),
    item('lungo','Австралийский лунго','170','9'),
    item('filter','Фильтр-кофе','200 / 300','8 / 9'),
    item('cappuccino','Капучино','200 / 300','8 / 9'),
    item('flat-white','Флет уайт','200','8,5'),
    item('latte','Латте','300','8'),
    item('raf','Раф','300','11','Ванильный / карамельный / тахини.')
  ]},
  {id:'handbrew',name:'Хендбрю',note:'Ручное заваривание',unit:'мл',items:[
    item('pour-over','Pour over','200','11','V60 / Orea / Octostorm.'),
    item('aeropress','Aeropress','180','12'),
    item('chemex','Chemex','400','15')
  ]},
  {id:'hot',name:'Горячие напитки',note:'Какао, шоколад и пряные напитки',unit:'мл',items:[
    item('cacao','Какао','300','10','Cacao Barry Plein Arome.'),
    item('bean-to-bar','Bean to bar','90 / 200','10 / 13','Горячий шоколад / какао.'),
    item('masala','Масала','200','12'),
    item('decoction','Отвар','300 / 500','12 / 15','Облепиха-имбирь / ягодный.'),
    item('espresso-cherry','Эспрессо-вишня','200','11'),
    item('kissel','Кисель','300','12')
  ]},
  {id:'tea',name:'Чай',note:'Сорта и травяные чаи',unit:'мл',items:[
    ...['Красный Дянь Хун','Зелёный улун Те Гуань Инь','Иван-чай','Ромашка','Мята','Ройбуш','Гречишный чай'].map((name,i)=>item('tea-'+i,name,'300 / 500','7 / 10'))
  ]},
  {id:'matcha',name:'Матча',note:'Чистый вкус или с молоком',unit:'мл',items:[
    item('usucha','Усутя','70','7'),
    item('matcha-latte','Матча латте','300','11','Горячая / холодная.'),
    item('matcha-tonic','Матча тоник','150','11')
  ]},
  {id:'cold',name:'Холодные напитки',note:'Кофе с тоником и смузи',unit:'мл',items:[
    item('espresso-tonic','Эспрессо тоник','150','11'),
    item('smoothie','Смузи','400','15','В ассортименте. Вкусы уточняйте у бариста.')
  ]},
  {id:'cocktails',name:'Коктейли',note:'Алкогольные напитки · 18+',unit:'мл',items:[
    item('sgroppino','Sgroppino','170','25','Лаймовый сорбет, игристое.'),
    item('kodama','Kodama','150','25','Джин Bombay, Indian tonic, матча.'),
    item('liquorice','Liquor’ice','200','25','Лакричная настойка, молоко, тахини.'),
    item('russian','B/W Russian','100','22','Домашний кофейный ликёр, водка, сливки.'),
    item('irish','Irish coffee','180','25','Виски Compass Box, rich syrup, фильтр-кофе, сливки.'),
    item('martini','Espresso martini','180','25','Водка Finland, домашний кофейный ликёр, rich syrup, эспрессо.'),
    item('spritz','Limoncello Spritz','200','25','Домашний лимончелло, содовая, игристое.'),
    item('hot-campari','Hot Campari','200','25','Ликёр Campari, домашний лимончелло, мёд, лимонный сок.')
  ]},
  {id:'wine',name:'Вино и сидр',note:'Игристое и сидр · 18+',unit:'мл',items:[
    item('prosecco','Игристое','125','22','Prosecco DOC Treviso Brut.'),
    item('cider','Сидр','500','17','1 — сухой / 2 — полусухой / 3 — полусладкий.')
  ]}
];
export const extras = [
  {name:'Яйцо: глазунья / пашот',price:'3'},
  {name:'Тост бриошь',price:'3'},
  {name:'Бекон',price:'4'},
  {name:'Курица',price:'5'},
  {name:'Лосось',price:'7'},
  {name:'Салат',price:'4'}
];
export const milk = {name:'Альтернативное молоко',description:'Безлактозное / овсяное / кокосовое',price:'1,2 / 3,5',note:'В меню указаны две доплаты на три вида молока. Доплату за выбранное молоко уточняйте у бариста.'};
export const normalize = value => value.toLocaleLowerCase('ru').replaceAll('ё','е').replaceAll(/[‐‑–—-]/g,' ');
export function searchMenu(query) {
  const words = normalize(query).trim().split(/\s+/).filter(Boolean);
  return categories.flatMap(category => category.items.filter(entry => words.every(word => normalize(`${entry.name} ${entry.description} ${category.name}`).includes(word))).map(entry => ({...entry, categoryId:category.id,categoryName:category.name,unit:category.unit})));
}
