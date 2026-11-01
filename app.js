import {categories,extras,milk,searchMenu} from './menu.js';
const $=selector=>document.querySelector(selector);
const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const svg=(name='arrow')=>`<svg class="icon" aria-hidden="true"><use href="#${name}"/></svg>`;
const picture=id=>`assets/menu/${id}.webp`;
const currency=value=>`${escape(value)} <span class="currency">р.</span>`;
const byId=id=>categories.find(category=>category.id===id);
const homeOrder=['coffee','breakfast','sandwiches','tea','matcha','handbrew','hot','cold','cocktails','wine'];
const categoryImages={coffee:'cappuccino',breakfast:'english',sandwiches:'chicken-sandwich',tea:'tea-0',matcha:'matcha-latte',handbrew:'chemex',hot:'cacao',cold:'espresso-tonic',cocktails:'spritz',wine:'prosecco'};
const categorySummary={coffee:'От эспрессо до рафа',breakfast:'12 завтраков · до 20:00',sandwiches:'Три начинки на бриоши',tea:'Сорта и травяные чаи',matcha:'Чистая, с молоком, с тоником',handbrew:'Ручное заваривание',hot:'Какао, шоколад и пряности',cold:'Тоник и смузи',cocktails:'Вечернее меню · 18+',wine:'Игристое и сидр · 18+'};
const descriptions={espresso:'Короткий чёрный кофе. Без молока.',lungo:'Чёрный кофе в большой чашке.',filter:'Фильтр-кофе. Два объёма на выбор.',cappuccino:'Эспрессо, молоко и молочная пена.', 'flat-white':'Эспрессо и молоко с тонким слоем пены.',latte:'Кофе с молоком в большом объёме.',aeropress:'Кофе ручного заваривания в Aeropress.',chemex:'Кофе ручного заваривания в Chemex.',usucha:'Матча в чистом виде, без молока.',masala:'Пряный горячий напиток.',kissel:'Густой ягодный напиток.'};
let wheels=[];
class MenuWheel{
 constructor(root,category,initial=0,onSelect=null){
  this.root=root;this.category=category;this.items=category.items;this.position=initial;this.selected=-1;this.onSelect=onSelect;this.frame=0;this.motion=matchMedia('(prefers-reduced-motion: reduce)');this.drag=null;
  root.classList.add('wheel-shell');root.dataset.category=category.id;
  root.innerHTML=`<div class="wheel-heading" aria-live="polite" aria-atomic="true"><h2 class="wheel-name"></h2><div class="wheel-meta"><span class="wheel-portion"></span><span class="meta-dot" aria-hidden="true"></span><span class="wheel-price"></span></div></div><div class="wheel-stage" tabindex="0" role="region" aria-roledescription="колесо выбора" aria-label="${escape(category.name)}: тяните в сторону или используйте стрелки клавиатуры"><div class="wheel-orbit" aria-hidden="true"></div>${Array.from({length:7},()=>'<button class="wheel-item" type="button" tabindex="-1"><img width="1024" height="1024" draggable="false" alt=""><span class="wheel-item-caption" aria-hidden="true"></span></button>').join('')}</div><div class="wheel-controls"><button class="round-button prev" type="button" aria-label="Предыдущая позиция">${svg()}</button><span class="wheel-position" aria-live="off"></span><button class="round-button next" type="button" aria-label="Следующая позиция">${svg()}</button></div><p class="wheel-instruction">${svg('rotate')}Потяните в сторону, чтобы повернуть</p><p class="wheel-description"></p>`;
  this.stage=root.querySelector('.wheel-stage');this.slots=[...root.querySelectorAll('.wheel-item')];
  root.querySelector('.prev').addEventListener('click',()=>this.go(Math.round(this.position)-1));root.querySelector('.next').addEventListener('click',()=>this.go(Math.round(this.position)+1));
  this.stage.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','Home','End'].includes(e.key)){e.preventDefault();this.go(e.key==='Home'?0:e.key==='End'?this.items.length-1:Math.round(this.position)+(e.key==='ArrowRight'?1:-1));}});
  this.slots.forEach(button=>button.addEventListener('click',e=>{if(!this.suppressClick)this.go(Number(button.dataset.virtual));}));
  this.stage.addEventListener('pointerdown',e=>{if(!e.isPrimary||e.button!==0)return;cancelAnimationFrame(this.frame);this.drag={id:e.pointerId,startX:e.clientX,startY:e.clientY,position:this.position,lastX:e.clientX,lastTime:performance.now(),velocity:0,moved:false,clicked:e.target.closest('.wheel-item')?.dataset.virtual};this.stage.setPointerCapture(e.pointerId);});
  this.stage.addEventListener('pointermove',e=>{
   if(!this.drag||e.pointerId!==this.drag.id)return;const dx=e.clientX-this.drag.startX,dy=e.clientY-this.drag.startY;
   if(!this.drag.moved&&Math.abs(dy)>Math.abs(dx)&&Math.abs(dy)>8){this.cancelDrag();return;}
   if(Math.abs(dx)>5){this.drag.moved=true;this.stage.classList.add('dragging');}
   if(this.drag.moved){const now=performance.now();this.drag.velocity=(e.clientX-this.drag.lastX)/Math.max(now-this.drag.lastTime,8);this.drag.lastX=e.clientX;this.drag.lastTime=now;this.position=this.drag.position-dx/this.pixelsPerStep();this.draw();}
  });
  this.stage.addEventListener('pointerup',e=>{
   if(!this.drag||e.pointerId!==this.drag.id)return;const drag=this.drag;this.drag=null;this.stage.classList.remove('dragging');this.suppressClick=true;
   if(drag.moved){const momentum=performance.now()-drag.lastTime<100?Math.max(-.65,Math.min(.65,-drag.velocity*.26)):0;this.go(Math.round(this.position+momentum));}
   else if(drag.clicked!==undefined)this.go(Number(drag.clicked));else this.go(Math.round(this.position));
   setTimeout(()=>{this.suppressClick=false;},100);
  });
  this.stage.addEventListener('pointercancel',()=>this.cancelDrag());
  // Trackpads can turn the wheel horizontally; vertical scrolling is never intercepted.
  this.stage.addEventListener('wheel',e=>{if(Math.abs(e.deltaX)>Math.abs(e.deltaY)&&Math.abs(e.deltaX)>5){e.preventDefault();if(!this.wheelLock){this.go(Math.round(this.position)+(e.deltaX>0?1:-1));this.wheelLock=setTimeout(()=>{this.wheelLock=null;},350);}}},{passive:false});
  this.resize=new ResizeObserver(()=>this.draw());this.resize.observe(this.stage);this.draw();
 }
 pixelsPerStep(){return this.stage.clientWidth<600?130:215;}
 cancelDrag(){if(!this.drag)return;this.drag=null;this.stage.classList.remove('dragging');this.go(Math.round(this.position));}
 draw(){
  const n=this.items.length,base=Math.floor(this.position),width=this.stage.clientWidth,mobile=width<600,radius=mobile?width*.68:Math.min(450,width*.42);
  this.slots.forEach((button,slot)=>{
   const virtual=base+slot-3,index=((virtual%n)+n)%n,item=this.items[index],distance=virtual-this.position,angle=distance*48*Math.PI/180,absolute=Math.abs(distance);
   const x=Math.sin(angle)*radius,y=(1-Math.cos(angle))*radius*(mobile?.56:.5),scale=1/(1+absolute*(mobile?.82:.72));
   button.style.transform=`translate(-50%,-50%) translate(${x.toFixed(2)}px,${y.toFixed(2)}px) rotate(${(distance*29).toFixed(2)}deg) scale(${scale.toFixed(4)})`;
   button.style.opacity=absolute>2.15?'0':String(absolute<.7?1:Math.max(.24,1-(absolute-.5)*.35));button.style.zIndex=String(10-Math.round(absolute*3));button.style.visibility=absolute>2.15?'hidden':'visible';button.style.pointerEvents=absolute>1.55?'none':'auto';
   button.dataset.index=index;button.dataset.virtual=virtual;button.setAttribute('aria-current',String(absolute<.5));button.setAttribute('aria-hidden',String(absolute>1.55));button.setAttribute('aria-label',`Выбрать: ${item.name}`);
   const caption=button.querySelector('.wheel-item-caption');caption.style.fontSize=`${(14/scale).toFixed(2)}px`;caption.style.opacity=absolute>1.2?'0':'1';
   const image=button.querySelector('img');if(image.dataset.id!==item.id){image.dataset.id=item.id;image.src=picture(item.id);image.alt=`Иллюстрация: ${item.name.toLocaleLowerCase('ru')}`;button.querySelector('.wheel-item-caption').textContent=item.name;}
  });
  const selected=((Math.round(this.position)%n)+n)%n;
  if(selected!==this.selected){this.selected=selected;const item=this.items[selected];this.root.querySelector('.wheel-name').textContent=item.name;this.root.querySelector('.wheel-portion').textContent=`${item.size} ${this.category.unit}`;this.root.querySelector('.wheel-price').innerHTML=currency(item.price);this.root.querySelector('.wheel-position').textContent=`${selected+1} / ${n}`;const description=item.description||descriptions[item.id]||'';this.root.querySelector('.wheel-description').textContent=description;this.root.classList.toggle('no-description',!description);this.root.dataset.selected=item.id;this.onSelect?.(item,selected);}
 }
 go(target){
  cancelAnimationFrame(this.frame);if(this.motion.matches){this.position=target;this.draw();return;}
  const from=this.position,start=performance.now(),duration=620;
  const animate=now=>{const t=Math.min((now-start)/duration,1),ease=1-Math.pow(1-t,4);this.position=from+(target-from)*ease;this.draw();if(t<1)this.frame=requestAnimationFrame(animate);else this.position=target;};this.frame=requestAnimationFrame(animate);
 }
 destroy(){cancelAnimationFrame(this.frame);clearTimeout(this.wheelLock);this.resize.disconnect();}
}
function categoryCard(id){const category=byId(id);return `<a class="category-card" href="#/menu/${id}"><div class="category-image"><img src="${picture(categoryImages[id])}" width="1024" height="1024" alt="${escape(category.name)}" loading="lazy"></div><div class="category-card-body"><div><h3>${escape(category.name)}</h3><p>${escape(categorySummary[id])}</p></div>${svg()}</div></a>`;}
function productCard(item,category,search=false){return `<a class="product-card" href="#/menu/${category.id}/${item.id}" data-product="${item.id}"><div class="product-card-image"><img src="${picture(item.id)}" width="1024" height="1024" alt="Иллюстрация: ${escape(item.name.toLocaleLowerCase('ru'))}" loading="lazy"></div><div class="product-card-body">${search?`<span class="search-result-category">${escape(category.name)}</span>`:''}<h3>${escape(item.name)}</h3><p class="portion">${escape(item.size)} ${category.unit}</p><div class="product-card-bottom"><span class="product-card-price">${currency(item.price)}</span><span class="product-card-arrow" aria-hidden="true">${svg()}</span></div></div></a>`;}
function ribbon(){return `<div class="ribbon"><nav class="wrap ribbon-inner" aria-label="Разделы меню">${homeOrder.map(id=>`<a class="ribbon-item" href="#/menu/${id}"><img src="${picture(categoryImages[id])}" width="48" height="48" alt="">${escape(byId(id).name)}</a>`).join('')}</nav></div>`;}
function home(){
 const coffee=byId('coffee');
 $('#main').innerHTML=`<section class="hero" aria-labelledby="hero-title"><img src="assets/hero-v2.webp" width="1376" height="768" alt="Чашка капучино на деревянном столе — иллюстрация" fetchpriority="high"><div class="wrap hero-content"><h1 id="hero-title">Coffee 26<span class="brand-dot">.</span></h1><p class="hero-copy">Кофе. Завтраки.<br>Хороший день.</p><p class="hero-description">Любимый кофе, тёплая бриошь<br>и время для себя.</p><a class="button rust" href="#/categories">Посмотреть меню${svg()}</a></div><a class="hero-bottom-note" href="#/menu/breakfast">${svg('clock')}Завтраки до 20:00</a></section>${ribbon()}<section class="section wrap home-categories" aria-labelledby="categories-title"><div class="section-title"><div><h2 id="categories-title">Что вам сегодня?</h2></div><p>Выберите раздел. Дальше — только то,<br>что хочется попробовать.</p></div><div class="category-grid">${homeOrder.map(categoryCard).join('')}</div></section><section class="section featured-section" aria-labelledby="coffee-picks-title"><div class="wrap"><div class="section-title"><h2 id="coffee-picks-title">Начнём с кофе</h2><a href="#/menu/coffee" class="text-link">Весь кофе${svg()}</a></div><div class="product-grid">${['cappuccino','latte','flat-white','raf'].map(id=>productCard(coffee.items.find(item=>item.id===id),coffee)).join('')}</div></div></section><section class="section wrap home-wheel-section" aria-labelledby="home-breakfast-title"><div class="home-wheel-heading"><div><h2 id="home-breakfast-title">Завтрак — одним движением</h2><p>Поверните колесо и найдите свой. Готовим до 20:00.</p></div><a href="#/menu/breakfast" class="text-link">Все завтраки${svg()}</a></div><div id="home-breakfast-wheel"></div></section>`;
 wheels.push(new MenuWheel($('#home-breakfast-wheel'),byId('breakfast')));
}
function tabs(active){return `<nav class="category-tabs" aria-label="Разделы меню">${homeOrder.map(id=>`<a href="#/menu/${id}" ${id===active?'aria-current="page"':''}>${escape(byId(id).name)}</a>`).join('')}</nav>`;}
function notice(){return `<p class="menu-notice">Цены в рублях, как в исходном меню. При нескольких объёмах цены указаны в том же порядке. Если у вас есть аллергия, уточните состав у бариста. <a href="assets/menu.pdf" target="_blank" rel="noopener">Исходное меню в PDF</a>.</p>`;}
function categoryPage(id,itemId){
 const category=byId(id);if(!category){categoriesPage();return;}
 const selected=Math.max(0,category.items.findIndex(item=>item.id===itemId));
 $('#main').innerHTML=`<div class="category-page wrap"><div class="breadcrumb"><a href="#/categories">${svg()}Все разделы</a><span>/</span><span>${escape(category.name)}</span></div><div class="category-page-heading"><div><h1>${escape(category.name)}</h1><p>${escape(category.note)}</p></div><div class="category-jump"><label for="category-select">Раздел</label><select id="category-select" aria-label="Перейти в другой раздел">${homeOrder.map(categoryId=>`<option value="${categoryId}" ${categoryId===id?'selected':''}>${escape(byId(categoryId).name)}</option>`).join('')}</select></div></div>${tabs(id)}<div id="category-wheel"></div><section class="category-gallery" aria-labelledby="all-items-title"><div class="section-title"><h2 id="all-items-title">Весь раздел</h2><p>Нажмите на картинку,<br>чтобы выбрать в колесе</p></div><div class="product-grid">${category.items.map(item=>productCard(item,category)).join('')}</div></section>${id==='breakfast'?`<section class="extras-section"><h2>Добавить к завтраку</h2><div class="extras-grid">${extras.map(extra=>`<div class="extra-row"><span>${escape(extra.name)}</span><span>+ ${currency(extra.price)}</span></div>`).join('')}</div></section>`:''}${id==='coffee'?`<section class="extras-section milk-extras"><h2>${escape(milk.name)}</h2><p>${escape(milk.description)}</p><p class="milk-price">+ ${currency(milk.price)}</p><p>${escape(milk.note)}</p></section>`:''}${notice()}</div>`;
 wheels.push(new MenuWheel($('#category-wheel'),category,selected,(item)=>{history.replaceState(null,'',`#/menu/${category.id}/${item.id}`);}));
 $('#category-select').addEventListener('change',e=>{location.hash=`#/menu/${e.target.value}`;});
 const nav=$('.category-tabs'),active=nav.querySelector('[aria-current=page]');nav.scrollLeft=active.offsetLeft-nav.offsetLeft-nav.clientWidth/2+active.clientWidth/2;
}
function categoriesPage(){
 $('#main').innerHTML=`<section class="section wrap categories-page"><div class="breadcrumb"><a href="#/">${svg()}На главную</a></div><div class="section-title"><div><h1>Меню Coffee 26</h1><p style="margin-top:12px">Кофе, завтраки и всё, что к ним.</p></div></div><div class="category-grid">${homeOrder.map(categoryCard).join('')}</div>${notice()}</section>`;
}
function searchPage(query){
 const results=searchMenu(query);
 $('#main').innerHTML=`<section class="wrap search-page"><div class="breadcrumb"><a href="#/categories">${svg()}Все разделы</a></div><h1>Поиск по меню</h1><p class="result-count">«${escape(query)}» · найдено: ${results.length}</p>${results.length?`<div class="product-grid">${results.map(item=>productCard(item,byId(item.categoryId),true)).join('')}</div>`:`<div class="empty-state"><h2>Такого в меню не нашлось</h2><p>Попробуйте другое название или ингредиент. Например, «матча», «лосось» или «сырники».</p><button class="button green" type="button" data-reopen-search>Изменить запрос${svg('search')}</button></div>`}</section>`;
}
function route(){
 wheels.forEach(wheel=>wheel.destroy());wheels=[];
 const raw=location.hash.slice(1)||'/',[path,queryString]=raw.split('?'),parts=path.split('/').filter(Boolean);let title='Coffee 26 — кофе, завтраки и сэндвичи';
 if(parts[0]==='menu'){categoryPage(parts[1],parts[2]);title=`${byId(parts[1])?.name||'Меню'} — Coffee 26`;}
 else if(parts[0]==='categories')categoriesPage();
 else if(parts[0]==='search'){const query=new URLSearchParams(queryString).get('q')||'';searchPage(query);title='Поиск по меню — Coffee 26';}
 else home();
 document.title=title;
 document.querySelectorAll('[data-nav]').forEach(link=>{const current=link.dataset.nav==='home'&&!parts.length||link.dataset.nav==='categories'&&['categories','menu','search'].includes(parts[0])||link.dataset.nav==='breakfast'&&parts[1]==='breakfast';if(current)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');});
 window.scrollTo({top:0,behavior:'instant'});
}
const drawer=$('#header-search'),toggle=$('.search-toggle');
function toggleSearch(open){drawer.hidden=!open;toggle.setAttribute('aria-expanded',String(open));if(open)$('#global-query').focus();else toggle.focus({preventScroll:true});}
toggle.addEventListener('click',()=>toggleSearch(drawer.hidden));$('.search-close').addEventListener('click',()=>toggleSearch(false));
$('#global-search').addEventListener('submit',e=>{e.preventDefault();const query=$('#global-query').value.trim();if(!query){$('#global-query').focus();return;}drawer.hidden=true;toggle.setAttribute('aria-expanded','false');const next='#/search?q='+encodeURIComponent(query);if(location.hash===next)route();else location.hash=next;});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!drawer.hidden)toggleSearch(false);});
document.addEventListener('click',e=>{if(e.target.closest('[data-reopen-search]'))toggleSearch(true);const card=e.target.closest('.product-card');if(card&&card.getAttribute('href')===location.hash){e.preventDefault();$('.wheel-shell')?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});}if(e.target.closest('.skip-link')){e.preventDefault();$('#main').focus();$('#main').scrollIntoView({behavior:'instant',block:'start'});}});
window.addEventListener('hashchange',route);route();
