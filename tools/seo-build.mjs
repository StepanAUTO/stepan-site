/* Генератор SEO-разметки, городских страниц, sitemap и robots.txt.
   Запуск: node tools/seo-build.mjs
   Скрипт идемпотентный: блоки помечены комментариями и пересобираются. */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const SITE = 'https://xn--66-6kcaja0d4a9a3d6a.xn--p1ai';
const LAST_MOD = '2026-10-26';
const BUSINESS_NAME = 'ИП Рямбов Степан Александрович';
const PHONE = '+7 922 225-75-12';
const PHONE_LINK = '+79222257512';
const PHONE2 = '+7 904 542-78-12';
const PHONE2_LINK = '+79045427812';
const EMAIL = 'Ryambovs@mail.ru';
const MAP = 'https://yandex.ru/maps/-/CXByQY9P';
const WHATSAPP = 'https://wa.me/+79222257512';
const MAX = 'https://max.ru/u/f9LHodD0cOKWuLKPFzgdSC1-57bLRzhlyMU_Q0SQUBD5ePsd36Sy8xlXcQ4';
const OG_IMAGE = '/img/og-cover.jpg';
const ADDRESS = {
  '@type': 'PostalAddress',
  streetAddress: 'ул. Якова Свердлова, 40',
  postalCode: '624993',
  addressLocality: 'Серов',
  addressRegion: 'Свердловская область',
  addressCountry: 'RU',
};
const GEO = { '@type': 'GeoCoordinates', latitude: 59.605718, longitude: 60.558729 };

const CITIES = [
  {
    slug: 'krasnoturinsk',
    nom: 'Краснотурьинск',
    pre: 'Краснотурьинске',
    dist: '≈20 км',
    img: '/img/hero-avtovyshka.webp',
    alt: 'Автовышка АГП-22 на объекте в Краснотурьинске',
    label: 'Краснотурьинск · 20 км от Серова',
    desc: 'Краснотурьинск — вторая точка после Серова, куда езжу чаще всего. Беру и частный сектор, и дворы многоэтажек, и промплощадки.',
    p1: 'В Краснотурьинске много старых тополей и берёз во дворах: они растут вплотную к домам, теплотрассам и проводам, поэтому валить целиком нельзя. Работаю по частям — поднимаюсь в крону на верёвках или подъезжаю автовышкой АГП-22 и спускаю ветки на страховке.',
    p2: 'На предприятиях и у управляющих компаний востребованы высотные работы: герметизация межпанельных швов, покраска фасадов, ремонт кровли, монтаж вывесок. Для этого есть своё снаряжение промальпа, автовышка и бригада до 10 человек. Работаю по договору, с безналом, ЭДО и закрывающими документами.',
    bullets: [
      'Дорога до Краснотурьинска учитывается в смете — цена известна до выезда',
      'Частный дом, двор многоэтажки, магазин, промплощадка',
      'Дерево у стены или проводов — спил по частям, без падения ствола',
      'Пни измельчаю на месте: остаётся ровная земля, а не яма',
    ],
    faq: [
      ['Сколько стоит выезд в Краснотурьинск?', 'Считаю по километражу и включаю в смету. Итоговую сумму называю до выезда, после фото или осмотра.'],
      ['Спилите дерево во дворе многоэтажки?', 'Да. Если дерево на общей земле, нужно разрешение от УК или администрации. Подскажу, что запросить.'],
      ['Работаете с управляющими компаниями?', 'Да: договор, безнал, акты, УПД, ЭДО. Могу работать по сезонному графику.'],
      ['Как быстро приедете?', 'Обычно в день обращения или на следующий. Аварийные деревья — в приоритете, 8:00–21:00 без выходных.'],
    ],
  },
  {
    slug: 'karpinsk',
    nom: 'Карпинск',
    pre: 'Карпинске',
    dist: '≈38 км',
    img: '/portfolio-img/avtovyshka/0e3e0697-c05a-4cde-9b92-76fde0c58305.webp',
    alt: 'АГП-22 во дворе дома в Карпинске',
    label: 'Карпинск · 38 км от Серова',
    desc: 'В Карпинске работаю с частным сектором и организациями: старые деревья, снег на крышах, навесы и высотный ремонт.',
    p1: 'Карпинск — город с большим частным сектором и старой застройкой. Здесь часто нужен не просто спил, а аккуратная уборка участка: дерево стоит у забора, сарая или линии электропередачи. В таких случаях поднимаюсь в крону и спускаю ветки по одной, а ствол снимаю частями.',
    p2: 'Зимой добавляются крыши: снег, наледь, сосульки. Чищу кровлю с верёвок, деревянными лопатами и пластиковыми скребками, без ударов по покрытию. Для организаций делаю сезонный график, чтобы не ждать аварийной ситуации. Навесы, козырьки и веранды собираю под ключ — от каркаса до кровли.',
    bullets: [
      'Частные дома, дачи, гаражи, магазины, промзоны',
      'Спил у забора и построек — без повреждений',
      'Измельчение пней и вывоз остатков',
      'Очистка крыш и монтаж снегоудержателей',
    ],
    faq: [
      ['Дорого ли ехать в Карпинск?', 'Дорога считается по километражу и входит в общую смету. Сумму называю заранее, без сюрпризов на объекте.'],
      ['Можно приехать на оценку бесплатно?', 'Ориентир даю по фото бесплатно. Если нужен осмотр, согласуем время; выезд входит в работу, если заказываете.'],
      ['Чистите крыши зимой?', 'Да, работаю круглый год. Снег и наледь убираю с верёвок, кровлю не ломаю.'],
      ['Делаете навесы и веранды?', 'Да, металлокаркас, профнастил, пол и покраска. Срок — обычно 3–10 дней.'],
    ],
  },
  {
    slug: 'severouralsk',
    nom: 'Североуральск',
    pre: 'Североуральске',
    dist: '≈90 км',
    img: '/portfolio-img/televyshka/P5290095.webp',
    alt: 'Высотные работы на объекте в Североуральске',
    label: 'Североуральск · 90 км от Серова',
    desc: 'Северный выезд планирую сменой: аварийные деревья, кровля, промальп и автовышка. Работаю на объектах любой высоты.',
    p1: 'Североуральск — дальний выезд, поэтому такие работы планирую заранее и стараюсь закрыть за один выезд. Чаще всего это аварийные и ветровальные деревья, которые нужно убрать быстро: после ветра они висят над дорогой, крышей или забором.',
    p2: 'Вторая частая задача — кровля и фасады. Снег с крыш, наледь, ремонт водостоков, герметизация швов, монтаж снегоудержателей. На высоту поднимаюсь на верёвках или на автовышке АГП-22, если позволяет подъезд. Для предприятий готовлю договор, ППР и закрывающие документы.',
    bullets: [
      'Дальний выезд — смена или несколько задач за один день',
      'Аварийные деревья после ветра и снегопада',
      'Кровля, фасады, швы, водостоки',
      'Договор, безнал, ЭДО, акты и УПД',
    ],
    faq: [
      ['Когда сможете приехать в Североуральск?', 'Обычно в течение 1–3 дней, аварийные заявки — в приоритете. Точное время согласуем по телефону.'],
      ['Берёте несколько задач за один выезд?', 'Да, так дешевле: можно совместить спил, очистку крыши и мелкий монтаж.'],
      ['Работаете на предприятиях?', 'Да, с договором, допусками и закрывающими документами. По запросу предоставлю ППР.'],
      ['Есть автовышка в Североуральске?', 'Приезжает своя АГП-22 из Серова. Стоимость дороги включаю в смету заранее.'],
    ],
  },
  {
    slug: 'volchansk',
    nom: 'Волчанск',
    pre: 'Волчанске',
    dist: '≈45 км',
    img: '/portfolio-img/kryshi-sneg/IMG20240121123829.webp',
    alt: 'Очистка кровли от снега в Волчанске',
    label: 'Волчанск · 45 км от Серова',
    desc: 'Волчанск — компактный город рядом с Серовом. Спил деревьев, крыши, навесы, сварка и высотные работы без наценки за дальность.',
    p1: 'Волчанск близко, поэтому выезд стоит недорого и возможен в день обращения. Основные задачи — деревья в частном секторе, старые тополя у домов, уборка участков после зимы и аварийные сухие стволы.',
    p2: 'Кроме спила делаю навесы, козырьки, веранды и металлоконструкции: каркасы, ограждения, усиление. Сварка на объекте, покраска, гарантия на швы. Зимой — очистка крыш и монтаж снегоудержателей, чтобы снег не сходил на дорожку или машину.',
    bullets: [
      'Близкий выезд — можно приехать в день обращения',
      'Спил, кронирование, измельчение пней',
      'Навесы, козырьки, сварка и металлокаркасы',
      'Очистка кровли и снегоудержатели',
    ],
    faq: [
      ['Сколько стоит выезд в Волчанск?', 'Дорога недорогая, считаю по километражу. Для небольших работ можно приехать вместе с другими задачами.'],
      ['Делаете сварку на месте?', 'Да, привожу аппарат и работаю с чёрным металлом на объекте.'],
      ['Спилите сухое дерево у дома?', 'Да. Работаю по частям, чтобы ствол не упал на постройку.'],
      ['Когда лучше чистить крышу?', 'Когда снега больше 30 см или появилась наледь. Аварийные сосульки убираю сразу.'],
    ],
  },
  {
    slug: 'novaya-lyalya',
    nom: 'Новая Ляля',
    pre: 'Новой Ляле',
    dist: '≈62 км',
    img: '/img/hero-arborist.webp',
    alt: 'Арборист в кроне дерева в Новой Ляле',
    label: 'Новая Ляля · 62 км от Серова',
    desc: 'Новая Ляля — лесной край: много деревьев на участках. Спил, кронирование, пни, вывоз остатков и высотные работы.',
    p1: 'В Новой Ляле и вокруг много частных домов, дач и старых деревьев. Часто нужно убрать не одно дерево, а привести в порядок весь участок: спилить сухие стволы, обрезать кроны, измельчить пни и вывезти остатки.',
    p2: 'Работаю и с землей, и с высоты: если дерево растёт у дома, забора или проводов, поднимаюсь в крону и снимаю по частям. Пни измельчаю фрезой на месте — не остаётся ямы, можно сразу ставить постройку или сажать газон. Для организаций и пилорам — договор, безнал, ЭДО.',
    bullets: [
      'Уборка участка целиком: деревья, пни, остатки',
      'Спил в стеснённых условиях — у дома и проводов',
      'Измельчение пней без ямы и разрытой земли',
      'Вывоз или распиловка на дрова — как удобнее',
    ],
    faq: [
      ['Можно спилить несколько деревьев за один выезд?', 'Да, так выгоднее. Оценю объём по фото и назову цену за весь участок.'],
      ['Что делаете с пнями?', 'Измельчаю фрезой на глубину 20–30 см. Щепу можно забрать или оставить на участке.'],
      ['Вывозите остатки?', 'Да, по объёму. Можно распилить на чурки и оставить вам.'],
      ['Работаете зимой?', 'Да, круглый год. Зимой спил проще: меньше листвы и лучше видно ствол.'],
    ],
  },
  {
    slug: 'verhoturie',
    nom: 'Верхотурье',
    pre: 'Верхотурье',
    dist: '≈105 км',
    img: '/img/veranda-sample.webp',
    alt: 'Веранда в Верхотурье',
    label: 'Верхотурье · 105 км от Серова',
    desc: 'Верхотурье — исторический город. Аккуратный спил старых деревьев, кровля, снегоудержатели, навесы и высотные работы.',
    p1: 'В Верхотурье много старых деревьев в исторической части, поэтому работаю особенно аккуратно: спил по частям, без падения ствола, с уборкой веток. У объектов культурного наследия согласование с органами охраны — подскажу, что нужно, и не начну работу без разрешения.',
    p2: 'Кроме деревьев делаю кровельные и высотные работы: снег с крыш, снегоудержатели, водостоки, ремонт фасадов, монтаж на высоте. Также собираю веранды, навесы и козырьки. Для частных домов и организаций — договор, безнал, ЭДО.',
    bullets: [
      'Аккуратный спил старых деревьев в исторической части',
      'Кровля, снегоудержатели, водостоки',
      'Навесы, веранды, козырьки под ключ',
      'Работа по договору, для юрлиц — ЭДО',
    ],
    faq: [
      ['Спилите дерево в историческом центре?', 'Если участок частный — да. Для объектов культурного наследия нужно разрешение; помогу разобраться.'],
      ['Сколько ехать до Верхотурья?', 'Около 105 км от Серова. Дорогу включаю в смету и называю цену до выезда.'],
      ['Делаете снегоудержатели на старую кровлю?', 'Да, подберу крепёж под покрытие и обрешётку, смонтирую с верёвок.'],
      ['Можно заказать только очистку крыши?', 'Да, разовый выезд или сезонный график для УК, ТСЖ и магазинов.'],
    ],
  },
  {
    slug: 'ivdel',
    nom: 'Ивдель',
    pre: 'Ивделе',
    dist: '≈150 км',
    img: '/portfolio-img/arboristika/14aad925-dcf4-4bd6-ad4e-a75447930d72.webp',
    alt: 'Спиливание дерева по частям в Ивделе',
    label: 'Ивдель · 150 км от Серова',
    desc: 'Ивдель — самый северный выезд. Аварийные деревья, кровля, промальп и автовышка. Работы планирую сменой, чтобы уложиться в один выезд.',
    p1: 'Ивдель — дальний северный выезд, поэтому беру задачи, которые можно закрыть за смену: аварийные деревья, уборка участка, кровля, монтаж на высоте. Если объём большой, согласуем несколько дней или вахтовый график.',
    p2: 'В тайге и частном секторе часто нужен спил ветровальных и сухих деревьев, которые падают на дороги, заборы и крыши. Работаю с земли, с верёвок и с автовышки. Зимой добавляются снег и наледь на кровлях, водостоки и снегоудержатели. Для предприятий — договор, безнал, ЭДО, ППР.',
    bullets: [
      'Самый дальний выезд — 150 км, планирую заранее',
      'Ветровальные и аварийные деревья',
      'Кровля, водостоки, снегоудержатели',
      'Бригада до 10 человек для больших объёмов',
    ],
    faq: [
      ['Стоит ли ехать в Ивдель из Серова?', 'Если объектов несколько или работа срочная — да. Стоимость дороги делю на объём и называю заранее.'],
      ['Можно совместить спил и кровлю?', 'Да, так выгоднее: один выезд закрывает несколько задач.'],
      ['Работаете вахтой?', 'Для больших объектов — да, с проживанием и графиком по договору.'],
      ['Как быстро приедете на аварию?', 'По возможности в течение 1–2 дней. Аварийные деревья — в приоритете.'],
    ],
  },
  {
    slug: 'nizhnyaya-tura',
    nom: 'Нижняя Тура',
    pre: 'Нижней Туре',
    dist: '≈105 км',
    img: '/portfolio-img/televyshka/P5290096.webp',
    alt: 'Высотные работы на предприятии в Нижней Туре',
    label: 'Нижняя Тура · 105 км от Серова',
    desc: 'Нижняя Тура — промышленный город. Фасады, межпанельные швы, кровля, вышки, деревья и металлоконструкции по договору.',
    p1: 'В Нижней Туре много многоэтажек и промплощадок, поэтому чаще нужны высотные работы: герметизация швов, покраска фасадов, ремонт кровли, монтаж вывесок и освещения. Работаю на верёвках и с автовышки АГП-22 — без лесов и без остановки производства.',
    p2: 'Для частного сектора — спил деревьев, пни, навесы, сварка. Для организаций — договор, ППР, допуски, безнал и закрывающие документы. Если объект сложный, приезжаю на осмотр и считаю по факту, а не «на глаз».',
    bullets: [
      'Промальп и автовышка для фасадов и кровли',
      'Межпанельные швы, водостоки, вывески',
      'Спил деревьев и измельчение пней',
      'Металлоконструкции, сварка, навесы',
    ],
    faq: [
      ['Работаете на действующем предприятии?', 'Да, с допусками, ППР и согласованием. Могу работать в нерабочие смены.'],
      ['Есть ли допуски промальпа?', 'Да, работаю на верёвках с страховочными системами. Документы — по запросу.'],
      ['Сколько стоит выезд в Нижнюю Туру?', 'Считаю по километражу и включаю в смету. Цена известна до выезда.'],
      ['Можно заказать только спил деревьев?', 'Да, это основная услуга. Приезжаю с инструментом и автовышкой при необходимости.'],
    ],
  },
];

const SERVICES = [
  { file: 'spil-derevyev.html', name: 'Спиливание деревьев', short: 'Спил деревьев' },
  { file: 'arenda-avtovyshki.html', name: 'Аренда автовышки АГП-22', short: 'Автовышка' },
  { file: 'vysotnye-raboty.html', name: 'Высотные работы', short: 'Высотные работы' },
  { file: 'ochistka-krysh.html', name: 'Очистка крыш', short: 'Очистка крыш' },
  { file: 'snegouderzhateli.html', name: 'Снегоудержатели', short: 'Снегоудержатели' },
  { file: 'navesy-verandy.html', name: 'Веранды и навесы', short: 'Веранды и навесы' },
  { file: 'metallokonstrukcii.html', name: 'Металлоконструкции и сварка', short: 'Металлоконструкции' },
  { file: 'uslugi.html', name: 'Все услуги', short: 'Все услуги' },
];

const PAGES = [
  {
    file: 'index.html',
    url: '/',
    title: 'Спил деревьев и автовышка в Серове — Автовышка66',
    desc: 'Спиливание деревьев от 4 000 ₽, аренда автовышки АГП-22 от 2 500 ₽/час, высотные работы. Серов и 150 км. 17 лет, выезд в день обращения.',
    crumb: null,
    image: '/img/hero-arborist.webp',
    preload: '/img/hero-arborist.webp',
    priority: '1.0',
    changefreq: 'weekly',
  },
  {
    file: 'spil-derevyev.html',
    url: '/spil-derevyev.html',
    title: 'Спиливание деревьев в Серове — от 4 000 ₽ за дерево',
    desc: 'Спил аварийных и сухих деревьев, кронирование, измельчение пней. Работа в кроне у дома и проводов. Серов и 150 км, выезд в день обращения.',
    crumb: 'Спиливание деревьев',
    image: '/img/hero-arborist.webp',
    preload: '/img/hero-arborist.webp',
    service: { name: 'Спиливание деревьев', type: 'Спиливание, удаление и кронирование деревьев', price: '4000', unit: 'за дерево' },
    priority: '0.9',
    changefreq: 'monthly',
  },
  {
    file: 'arenda-avtovyshki.html',
    url: '/arenda-avtovyshki.html',
    title: 'Аренда автовышки АГП-22 в Серове — от 2 500 ₽/час',
    desc: 'Автовышка АГП-22: стрела 22 м, вездеходная база, оператор. Час от 2 500 ₽, смена 8 ч от 15 000 ₽. Серов, Краснотурьинск и 150 км.',
    crumb: 'Аренда автовышки',
    image: '/img/hero-avtovyshka.webp',
    preload: '/portfolio-img/avtovyshka/0e3e0697-c05a-4cde-9b92-76fde0c58305.webp',
    service: { name: 'Аренда автовышки АГП-22', type: 'Аренда автовышки с оператором', price: '2500', unit: 'час' },
    priority: '0.9',
    changefreq: 'monthly',
  },
  {
    file: 'vysotnye-raboty.html',
    url: '/vysotnye-raboty.html',
    title: 'Высотные работы в Серове — промальп от 2 500 ₽/час',
    desc: 'Фасады, межпанельные швы, кровля, вывески, монтаж на высоте. Работа на верёвках и с автовышки. Серов и 150 км, договор, ЭДО.',
    crumb: 'Высотные работы',
    image: '/portfolio-img/televyshka/P5290095.webp',
    preload: '/portfolio-img/televyshka/P5290095.webp',
    service: { name: 'Высотные работы и промальп', type: 'Фасады, швы, кровля, монтаж на высоте', price: '2500', unit: 'час' },
    priority: '0.9',
    changefreq: 'monthly',
  },
  {
    file: 'ochistka-krysh.html',
    url: '/ochistka-krysh.html',
    title: 'Очистка крыш от снега и наледи в Серове — от 50 ₽/м²',
    desc: 'Убираю снег, наледь и сосульки с кровли. Частные дома, УК, ТСЖ, магазины. Серов и 150 км. Договор, сезонный график, выезд в день обращения.',
    crumb: 'Очистка крыш',
    image: '/portfolio-img/kryshi-sneg/IMG20240121123829.webp',
    preload: '/portfolio-img/kryshi-sneg/IMG20240121123829.webp',
    service: { name: 'Очистка крыш от снега и наледи', type: 'Очистка кровли, сбивание сосулек', price: '50', unit: 'м²' },
    priority: '0.8',
    changefreq: 'monthly',
  },
  {
    file: 'snegouderzhateli.html',
    url: '/snegouderzhateli.html',
    title: 'Монтаж снегоудержателей в Серове — от 500 ₽/м.п.',
    desc: 'Снегоудержатели на металлочерепицу, профнастил, фальц и мягкую кровлю. Замер, подбор, монтаж с верёвок. Серов и 150 км. Гарантия по договору.',
    crumb: 'Снегоудержатели',
    image: '/portfolio-img/kryshi-sneg/IMG_20210119_152810_452.webp',
    preload: '/portfolio-img/kryshi-sneg/IMG_20210119_152810_452.webp',
    service: { name: 'Монтаж снегоудержателей', type: 'Монтаж снегозадержания на кровлю', price: '500', unit: 'погонный метр' },
    priority: '0.8',
    changefreq: 'monthly',
  },
  {
    file: 'navesy-verandy.html',
    url: '/navesy-verandy.html',
    title: 'Веранды и навесы в Серове под ключ — от 60 000 ₽',
    desc: 'Металлокаркас, профнастил, пол, покраска. Веранды, навесы, козырьки за 3–10 дней. Серов и 150 км. Своя сварка и бригада.',
    crumb: 'Веранды и навесы',
    image: '/img/veranda-sample.webp',
    preload: '/img/veranda-sample.webp',
    service: { name: 'Строительство веранд и навесов', type: 'Металлокаркас, кровля, пол, покраска', price: '60000', unit: 'объект' },
    priority: '0.8',
    changefreq: 'monthly',
  },
  {
    file: 'metallokonstrukcii.html',
    url: '/metallokonstrukcii.html',
    title: 'Металлоконструкции и сварка в Серове — по договору',
    desc: 'Контейнерные площадки, ограждения, каркасы, усиление конструкций. Сварка на объекте. Серов и 150 км. Гарантия на швы от 12 месяцев.',
    crumb: 'Металлоконструкции и сварка',
    image: '/portfolio-img/konteynernye-ploschadki/IMG_20191103_142620.webp',
    preload: '/portfolio-img/konteynernye-ploschadki/IMG_20191103_142620.webp',
    service: { name: 'Металлоконструкции и сварка', type: 'Изготовление и монтаж металлоконструкций, сварка на объекте' },
    priority: '0.7',
    changefreq: 'monthly',
  },
  {
    file: 'uslugi.html',
    url: '/uslugi.html',
    title: 'Услуги в Серове: спил, автовышка, высотные работы',
    desc: 'Спил деревьев, аренда автовышки АГП-22, промальп, очистка крыш, снегоудержатели, навесы и сварка. Серов и 150 км. Цены и фото.',
    crumb: 'Услуги',
    image: '/img/hero-avtovyshka.webp',
    preload: '/img/hero-arborist.webp',
    priority: '0.9',
    changefreq: 'monthly',
  },
  {
    file: 'ceny.html',
    url: '/ceny.html',
    title: 'Цены на спил деревьев и автовышку в Серове — 2026',
    desc: 'Актуальные цены: спил от 4 000 ₽, автовышка от 2 500 ₽/час, очистка крыш от 50 ₽/м², снегоудержатели от 500 ₽/м.п. Расчёт по фото.',
    crumb: 'Цены',
    image: '/img/hero-avtovyshka.webp',
    preload: null,
    priority: '0.9',
    changefreq: 'weekly',
  },
  {
    file: 'portfolio.html',
    url: '/portfolio.html',
    title: 'Портфолио — спил, автовышка, высотные работы в Серове',
    desc: '100+ объектов в Серове и Свердловской области: аварийные деревья, автовышка АГП-22, кровля, снегоудержатели, металлоконструкции. Фото с работ.',
    crumb: 'Работы',
    image: '/img/og-cover.jpg',
    preload: null,
    priority: '0.7',
    changefreq: 'monthly',
  },
  {
    file: 'o-kompanii.html',
    url: '/o-kompanii.html',
    title: 'Степан Рямбов — высотные работы в Серове, 17 лет',
    desc: 'ИП Рямбов С. А.: 17 лет в Серове, своя автовышка АГП-22, фреза для пней, бригада 1–10 человек. Договор, ЭДО, работа с организациями.',
    crumb: 'О себе',
    image: '/img/hero-o-kompanii.webp',
    preload: '/img/hero-o-kompanii.webp',
    priority: '0.6',
    changefreq: 'yearly',
  },
  {
    file: 'kontakty.html',
    url: '/kontakty.html',
    title: 'Контакты — Серов, ул. Я. Свердлова, 40 | Автовышка66',
    desc: 'Телефоны +7 922 225-75-12 и +7 904 542-78-12, WhatsApp, MAX, email. Серов, ул. Я. Свердлова, 40. Работаю 8:00–21:00 без выходных.',
    crumb: 'Контакты',
    image: '/img/og-cover.jpg',
    preload: '/portfolio-img/avtovyshka/0e3e0697-c05a-4cde-9b92-76fde0c58305.webp',
    priority: '0.7',
    changefreq: 'yearly',
  },
  {
    file: 'politika.html',
    url: '/politika.html',
    title: 'Политика обработки персональных данных | Автовышка66',
    desc: 'Политика обработки персональных данных ИП Рямбов С. А. в соответствии с 152-ФЗ. Серов, Свердловская область.',
    crumb: 'Политика конфиденциальности',
    robots: 'noindex, follow',
    image: '/img/og-cover.jpg',
    priority: null,
    changefreq: null,
  },
];

const GEO_HUB = {
  file: 'geografiya.html',
  url: '/geografiya.html',
  title: 'География работ — Серов и 150 км | Автовышка66',
  desc: 'Куда выезжаю: Серов, Краснотурьинск, Карпинск, Североуральск, Волчанск, Новая Ляля, Верхотурье, Ивдель, Нижняя Тура. Расстояния и цены.',
  crumb: 'География работ',
  image: '/img/hero-avtovyshka.webp',
  preload: '/img/hero-avtovyshka.webp',
  priority: '0.8',
  changefreq: 'monthly',
};

/* ---------- helpers ---------- */
const escAttr = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const strip = (s) => String(s)
  .replace(/<[^>]+>/g, '')
  .replace(/&nbsp;/g, ' ').replace(/&shy;/g, '').replace(/&mdash;/g, '—').replace(/&ndash;/g, '–')
  .replace(/&laquo;/g, '«').replace(/&raquo;/g, '»').replace(/&quot;/g, '"').replace(/&amp;/g, '&')
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&hellip;/g, '…').replace(/&thinsp;/g, ' ')
  .replace(/\s+/g, ' ').trim();
const abs = (u) => SITE + (u.startsWith('/') ? u : '/' + u);
const write = (file, html) => fs.writeFileSync(path.join(ROOT, file), html.replace(/\r\n/g, '\n'), 'utf8');

function businessNode() {
  return {
    '@type': ['LocalBusiness', 'HomeAndConstructionBusiness'],
    '@id': SITE + '/#business',
    name: BUSINESS_NAME,
    alternateName: 'Автовышка66',
    description: 'Спиливание деревьев, аренда автовышки АГП-22, высотные работы, очистка крыш и снегоудержатели в Серове и Свердловской области. 17 лет опыта.',
    url: SITE + '/',
    image: abs(OG_IMAGE),
    telephone: PHONE_LINK,
    email: EMAIL,
    priceRange: '₽₽',
    currenciesAccepted: 'RUB',
    paymentAccepted: 'Наличные, безналичный расчёт, ЭДО',
    address: ADDRESS,
    geo: GEO,
    hasMap: MAP,
    openingHoursSpecification: [{
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '08:00',
      closes: '21:00',
    }],
    areaServed: [
      { '@type': 'City', name: 'Серов' },
      ...CITIES.map((c) => ({ '@type': 'City', name: c.nom })),
      { '@type': 'AdministrativeArea', name: 'Свердловская область' },
    ],
    founder: { '@type': 'Person', name: 'Степан Рямбов' },
    foundingDate: '2009',
    taxID: '663206460403',
    identifier: { '@type': 'PropertyValue', propertyID: 'ОГРНИП', value: '319665800251233' },
    makesOffer: [
      ['Спиливание деревьев', '4000', 'за дерево'],
      ['Аренда автовышки АГП-22', '2500', 'час'],
      ['Высотные работы', '2500', 'час'],
      ['Очистка крыш от снега', '50', 'м²'],
      ['Монтаж снегоудержателей', '500', 'погонный метр'],
      ['Веранды и навесы', '60000', 'объект'],
    ].map(([name, price, unit]) => ({
      '@type': 'Offer',
      itemOffered: { '@type': 'Service', name },
      priceCurrency: 'RUB',
      price,
      priceSpecification: { '@type': 'PriceSpecification', priceCurrency: 'RUB', minPrice: price, unitText: unit },
      url: abs('/ceny.html'),
    })),
  };
}

function serviceNode(s, url) {
  if (!s) return null;
  return {
    '@type': 'Service',
    '@id': url + '#service',
    name: s.name,
    serviceType: s.type,
    provider: { '@id': SITE + '/#business' },
    areaServed: [{ '@type': 'City', name: 'Серов' }, ...CITIES.map((c) => ({ '@type': 'City', name: c.nom }))],
    url,
    ...(s.price ? {
      offers: {
        '@type': 'Offer',
        priceCurrency: 'RUB',
        price: s.price,
        priceSpecification: { '@type': 'PriceSpecification', priceCurrency: 'RUB', minPrice: s.price, unitText: s.unit },
        availability: 'https://schema.org/InStock',
        url: abs('/ceny.html'),
      },
    } : {}),
  };
}

function breadcrumbNode(crumbs, url) {
  if (!crumbs || !crumbs.length) return null;
  const items = [{ name: 'Главная', item: SITE + '/' }, ...crumbs];
  return {
    '@type': 'BreadcrumbList',
    '@id': url + '#breadcrumb',
    itemListElement: items.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: c.item ? abs(c.item) : url,
    })),
  };
}

function faqNode(faqs, url) {
  if (!faqs || !faqs.length) return null;
  return {
    '@type': 'FAQPage',
    '@id': url + '#faq',
    mainEntity: faqs.map(([q, a]) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };
}

function websiteNode() {
  return {
    '@type': 'WebSite',
    '@id': SITE + '/#website',
    url: SITE + '/',
    name: 'Автовышка66',
    alternateName: 'ИП Рямбов С. А. — высотные работы в Серове',
    inLanguage: 'ru-RU',
    publisher: { '@id': SITE + '/#business' },
  };
}

function pageNode({ url, title, desc, image }) {
  return {
    '@type': 'WebPage',
    '@id': url + '#webpage',
    url,
    name: title,
    description: desc,
    isPartOf: { '@id': SITE + '/#website' },
    about: { '@id': SITE + '/#business' },
    inLanguage: 'ru-RU',
    primaryImageOfPage: { '@type': 'ImageObject', url: abs(image) },
  };
}

function visibleCrumbs(crumbs) {
  if (!crumbs || !crumbs.length) return '';
  const items = crumbs.map((c, i) => (i === crumbs.length - 1 || !c.item)
    ? `<li><span aria-current="page">${c.name}</span></li>`
    : `<li><a href="${c.item.replace(/^\//, '')}">${c.name}</a></li>`).join('');
  return `<nav class="breadcrumbs" aria-label="Хлебные крошки"><div class="wrap"><ol><li><a href="index.html">Главная</a></li>${items}</ol></div></nav>`;
}

const FONT_HEAD = `  <link rel="preload" href="fonts/inter-400-normal-cyrillic.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="fonts/playfair-display-500-normal-cyrillic.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="css/fonts.css">`;

function buildHead({ title, desc, url, robots = 'index, follow, max-image-preview:large', image = OG_IMAGE, preload = null, schema, extra = '' }) {
  const robotsMeta = /noindex/.test(robots) || /max-image-preview/.test(robots)
    ? robots
    : `${robots}, max-image-preview:large`;
  const preloadTag = preload
    ? `\n  <link rel="preload" as="image" href="${abs(encodeURI(preload))}" fetchpriority="high">`
    : '';
  return `<!-- SEO-BLOCK:START -->
  <title>${escAttr(title)}</title>
  <meta name="robots" content="${robotsMeta}">
  <link rel="canonical" href="${url}">
  <meta name="description" content="${escAttr(desc)}">
  <link rel="icon" type="image/svg+xml" href="favicon.svg">
  <link rel="sitemap" type="application/xml" href="${SITE}/sitemap.xml">
  <meta name="yandex-verification" content="cfa644d90c8bdd1a">
${FONT_HEAD}
  <meta name="geo.region" content="RU-SVE">
  <meta name="geo.placename" content="Серов">
  <meta name="geo.position" content="59.605718;60.558729">
  <meta name="ICBM" content="59.605718, 60.558729">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Автовышка66 — ИП Рямбов С. А.">
  <meta property="og:locale" content="ru_RU">
  <meta property="og:title" content="${escAttr(title)}">
  <meta property="og:description" content="${escAttr(desc)}">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="${abs(OG_IMAGE)}">
  <meta property="og:image:type" content="image/jpeg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="Автовышка66 — спил деревьев и высотные работы в Серове">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escAttr(title)}">
  <meta name="twitter:description" content="${escAttr(desc)}">
  <meta name="twitter:image" content="${abs(OG_IMAGE)}">${preloadTag}
  <script type="application/ld+json">
${JSON.stringify(schema, null, 2)}
  </script>
  <noscript><style>[data-animate]{opacity:1!important;transform:none!important}.gallery.is-collapsed>figure:nth-child(n+7){display:block!important}</style></noscript>
  ${extra}<!-- SEO-BLOCK:END -->`;
}

function cleanHead(html) {
  let h = html;
  h = h.replace(/<!-- SEO-BLOCK:START -->[\s\S]*?<!-- SEO-BLOCK:END -->/g, '');
  h = h.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/g, '');
  h = h.replace(/<meta name="robots"[^>]*>/g, '');
  h = h.replace(/<meta name="description"[^>]*>/g, '');
  h = h.replace(/<meta name="keywords"[^>]*>/g, '');
  h = h.replace(/<meta name="geo\.[^"]*"[^>]*>/g, '');
  h = h.replace(/<meta name="ICBM"[^>]*>/g, '');
  h = h.replace(/<link rel="canonical"[^>]*>/g, '');
  h = h.replace(/<link rel="sitemap"[^>]*>/g, '');
  h = h.replace(/<link rel="icon"[^>]*>/g, '');
  h = h.replace(/<link rel="preload" as="image"[^>]*>/g, '');
  h = h.replace(/<link rel="preconnect" href="https:\/\/fonts\.(?:googleapis|gstatic)\.com"[^>]*>/g, '');
  h = h.replace(/<link rel="stylesheet" href="https:\/\/fonts\.googleapis\.com[^"]*"[^>]*>/g, '');
  h = h.replace(/<meta name="yandex-verification"[^>]*>/g, '');
  h = h.replace(/<meta property="og:[^"]*"[^>]*>/g, '');
  h = h.replace(/<meta name="twitter:[^"]*"[^>]*>/g, '');
  h = h.replace(/<title>[\s\S]*?<\/title>/g, '');
  return h;
}

function extractFaqs(body) {
  const out = [];
  const re = /<details[^>]*>[\s\S]*?<summary[^>]*>([\s\S]*?)<\/summary>[\s\S]*?<p[^>]*>([\s\S]*?)<\/p>[\s\S]*?<\/details>/g;
  let m;
  while ((m = re.exec(body))) {
    const q = strip(m[1]);
    const a = strip(m[2]);
    if (q && a) out.push([q, a]);
  }
  return out;
}

function footerSeo() {
  const serviceLinks = SERVICES.map((s) => `<li><a href="${s.file}">${s.short}</a></li>`).join('');
  const cityLinks = CITIES.map((c) => `<li><a href="${c.slug}.html">${c.nom}</a></li>`).join('');
  return `<nav class="footer__seo" aria-label="Услуги и география работ">
      <div class="footer__seo-col">
        <h4>Услуги</h4>
        <ul class="footer__list">${serviceLinks}</ul>
      </div>
      <div class="footer__seo-col">
        <h4>География</h4>
        <ul class="footer__list">${cityLinks}<li><a href="geografiya.html">Все города и расстояния</a></li></ul>
      </div>
    </nav>
`;
}

function addBodyBits(html, { crumbs, cityPage = false }) {
  let h = html;
  h = h.replace(/<nav class="breadcrumbs"[\s\S]*?<\/nav>/g, '');
  h = h.replace(/<nav class="footer__seo"[\s\S]*?<\/nav>\s*/g, '');
  if (crumbs && crumbs.length) {
    h = h.replace(/<main(\s[^>]*)?>/, (m) => m + '\n' + visibleCrumbs(crumbs));
  }
  if (h.includes('<div class="footer__bottom">')) {
    h = h.replace('<div class="footer__bottom">', footerSeo() + '    <div class="footer__bottom">');
  }
  // Ленивая загрузка/декодирование для всех картинок
  h = h.replace(/<img\b(?![^>]*\bdecoding=)/g, '<img decoding="async"');
  h = h.replace(/<img\b(?=[^>]*\bloading="eager")(?![^>]*\bfetchpriority=)/g, '<img fetchpriority="high"');
  return h;
}

function buildExistingPage(cfg) {
  const absPath = path.join(ROOT, cfg.file);
  let raw = fs.readFileSync(absPath, 'utf8');
  raw = raw.replace(/https:\/\/timarambov-art\.github\.io\/stepan-site/g, SITE);
  const body = raw.replace(/[\s\S]*?<\/head>/i, '');
  const faqs = extractFaqs(body);
  const url = SITE + cfg.url;

  const crumbs = cfg.crumb ? [{ name: cfg.crumb, item: cfg.url }] : [];
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      businessNode(),
      websiteNode(),
      pageNode({ url, title: cfg.title, desc: cfg.desc, image: cfg.image }),
      breadcrumbNode(crumbs.map((c) => ({ name: c.name, item: c.item })), url),
      serviceNode(cfg.service, url),
      faqNode(faqs, url),
    ].filter(Boolean),
  };

  // чистим head и вставляем заново
  const headEnd = raw.search(/<\/head>/i);
  let head = raw.slice(0, headEnd);
  const rest = raw.slice(headEnd);
  head = cleanHead(head);
  const marker = /<meta name="theme-color" content="#3b5a3a">/;
  if (!marker.test(head)) throw new Error('theme-color not found in ' + cfg.file);
  const seo = buildHead({
    title: cfg.title,
    desc: cfg.desc,
    url,
    robots: cfg.robots || 'index, follow',
    image: cfg.image,
    preload: cfg.preload || null,
    schema,
  });
  head = head.replace(marker, (m) => m + '\n  ' + seo);

  // визуальные хлебные крошки + футер + img-атрибуты
  let out = addBodyBits(head + rest, { crumbs });

  // для главной — ссылки на города в блоке «Куда выезжаю»
  if (cfg.file === 'index.html') {
    out = out.replace(
      /<p style="font-family:var\(--font-head\); font-size:1\.3rem; font-style:italic; color:var\(--ink\); line-height:1\.4; margin:0;">[\s\S]*?<\/p>/,
      `<p class="areas-line">Серов · ${CITIES.map((c) => `<a href="${c.slug}.html">${c.nom}</a>`).join(' · ')}</p>
          <div class="btn-row" style="margin-top:20px">
            <a class="btn btn--ghost btn--sm" href="geografiya.html">Все города и расстояния →</a>
          </div>`,
    );
  }

  write(cfg.file, out);
  return { file: cfg.file, title: cfg.title.length, desc: cfg.desc.length, faqs: faqs.length };
}

/* ---------- city pages ---------- */
const CITY_CARDS = [
  ['Спиливание деревьев', 'spil-derevyev.html', 'Аварийные и сухие деревья, спил по частям у дома и проводов, кронирование.'],
  ['Измельчение пней', 'spil-derevyev.html#stump', 'Пень в щепу за 20–40 минут. Без ямы — ровная земля.'],
  ['Аренда автовышки', 'arenda-avtovyshki.html', 'АГП-22, стрела 22 м, вездеходная база, всегда с оператором.'],
  ['Высотные работы', 'vysotnye-raboty.html', 'Фасады, швы, кровля, вывески и монтаж на высоте — с верёвок или вышки.'],
  ['Очистка крыш', 'ochistka-krysh.html', 'Снег, наледь, сосульки. Частные дома, УК, ТСЖ, магазины.'],
  ['Снегоудержатели', 'snegouderzhateli.html', 'Монтаж на металлочерепицу, профнастил, фальц и мягкую кровлю.'],
  ['Веранды и навесы', 'navesy-verandy.html', 'Металлокаркас, профнастил, пол, покраска. Срок — 3–10 дней.'],
  ['Сварка и металл', 'metallokonstrukcii.html', 'Каркасы, ограждения, контейнерные площадки, усиление конструкций.'],
];

function cityPage(city) {
  const url = SITE + '/' + city.slug + '.html';
  const title = `Спил деревьев и автовышка в ${city.pre} — Автовышка66`;
  const desc = `Спил деревьев от 4 000 ₽, аренда автовышки АГП-22 от 2 500 ₽/час, высотные работы и очистка крыш. ${city.nom} — ${city.dist} от Серова. 17 лет опыта.`;
  const crumbs = [
    { name: 'География', item: '/geografiya.html' },
    { name: city.nom, item: null },
  ];
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      businessNode(),
      websiteNode(),
      pageNode({ url, title, desc, image: city.img }),
      breadcrumbNode([{ name: 'География', item: '/geografiya.html' }, { name: city.nom }], url),
      {
        '@type': 'Service',
        '@id': url + '#service',
        name: `Спил деревьев и высотные работы в ${city.pre}`,
        serviceType: 'Спиливание деревьев, аренда автовышки, высотные работы, очистка крыш',
        provider: { '@id': SITE + '/#business' },
        areaServed: { '@type': 'City', name: city.nom },
        url,
      },
      faqNode(city.faq, url),
    ].filter(Boolean),
  };

  const head = buildHead({
    title, desc, url, image: city.img, preload: city.img, schema,
  });

  const cards = CITY_CARDS.map(([name, href, text]) => `<a class="card" data-animate href="${href}">
              <h3>${name}</h3>
              <p>${text}</p>
              <span class="card__more">Подробнее</span>
            </a>`).join('\n            ');

  const faqs = city.faq.map(([q, a]) => `<details data-animate><summary>${q}</summary><p>${a}</p></details>`).join('\n            ');
  const bullets = city.bullets.map((b) => `<li>${b}</li>`).join('\n              ');

  return `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <meta name="theme-color" content="#3b5a3a">
  ${head}
  <link rel="stylesheet" href="css/styles.css">
</head>
<body>
  <header class="site-header">
    <div class="wrap">
      <a class="logo" href="index.html" aria-label="На главную"><i></i><span>АВТОВЫШКА66<small>высотные работы · Серов</small></span></a>
      <input type="checkbox" id="nav-toggle" class="nav-toggle" aria-label="Меню">
      <label for="nav-toggle" class="burger" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18"/></svg></label>
      <nav class="nav" aria-label="Основная навигация">
        <a href="index.html">Главная</a>
        <a href="uslugi.html">Услуги</a>
        <a href="ceny.html">Цены</a>
        <a href="portfolio.html">Работы</a>
        <a href="o-kompanii.html">О себе</a>
        <a href="kontakty.html">Контакты</a>
      </nav>
      <a class="header-tel" href="tel:${PHONE_LINK}"><svg aria-hidden="true" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M22 16.9v3a2 2 0 0 1-2.2 2A20 20 0 0 1 2 4.2 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.7l.6 3a2 2 0 0 1-.5 1.9L7.9 10a16 16 0 0 0 6 6l1.4-1.2a2 2 0 0 1 1.9-.5l3 .6A2 2 0 0 1 22 16.9z"/></svg> ${PHONE}</a>
    </div>
  </header>
  <main>
    ${visibleCrumbs(crumbs)}
    <section class="hero">
      <div class="wrap">
        <div class="hero__panel">
          <div class="hero__text">
            <span class="label">${city.label}</span>
            <h1>Спил деревьев и автовышка в ${city.pre}</h1>
            <p class="lead">${city.desc}</p>
            <div class="hero__ctas">
              <a class="btn" href="#form">Оценить по фото <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M4 12h15M13 6l6 6-6 6"/></svg></a>
              <a class="btn btn--ghost" href="tel:${PHONE_LINK}">${PHONE}</a>
            </div>
            <p class="hero__alt-tel">Второй номер: <a href="tel:${PHONE2_LINK}">${PHONE2}</a></p>
            <ul class="hero__bullets">
              <li>Выезд в ${city.nom} — ${city.dist} от Серова</li>
              <li>17 лет опыта, своя техника и снаряжение</li>
              <li>8:00 – 21:00, без выходных</li>
            </ul>
          </div>
          <figure class="hero__photo">
            <img src="${city.img.replace(/^\//, '')}" alt="${city.alt}" loading="eager" fetchpriority="high">
            <figcaption><b>Из работ.</b> ${city.nom} и Серовский район.</figcaption>
          </figure>
        </div>
      </div>
    </section>

    <section class="sec" id="services" aria-labelledby="t-srv">
      <div class="wrap">
        <div class="sec__inner">
          <div class="sec__head" data-animate>
            <span class="label">Услуги</span>
            <h2 id="t-srv">Что делаю в ${city.pre}</h2>
            <p class="lead">От спила дерева во дворе до высотного монтажа на предприятии. Всё — со своей техникой и инструментом.</p>
          </div>
          <div class="grid grid--cards-3">
            ${cards}
          </div>
        </div>
      </div>
    </section>

    <section class="sec" id="local" aria-labelledby="t-local">
      <div class="wrap">
        <div class="sec__inner">
          <div class="sec__head" data-animate>
            <span class="label">Город</span>
            <h2 id="t-local">Особенности работ в ${city.pre}</h2>
          </div>
          <div class="split">
            <div>
              <p class="lead">${city.p1}</p>
              <p>${city.p2}</p>
            </div>
            <div>
              <ul class="ticks">
                ${bullets}
              </ul>
              <table class="spec" style="margin-top:24px">
                <tbody>
                  <tr><th>Расстояние от Серова</th><td>${city.dist}</td></tr>
                  <tr><th>Дорога</th><td>входит в смету, цена до выезда</td></tr>
                  <tr><th>Выезд</th><td>в день обращения или на следующий</td></tr>
                  <tr><th>График</th><td>8:00 – 21:00, без выходных</td></tr>
                  <tr><th>Документы</th><td>договор, безнал, ЭДО, акты, УПД</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="sec" id="price" aria-labelledby="t-price">
      <div class="wrap">
        <div class="sec__inner">
          <div class="sec__head" data-animate>
            <span class="label">Цены</span>
            <h2 id="t-price">Сколько стоит в ${city.pre}</h2>
            <p class="lead">Цены те же, что и в Серове. Дорога считается отдельно и заранее — сюрпризов на объекте нет.</p>
          </div>
          <div class="split">
            <div>
              <table class="spec">
                <tbody>
                  <tr><th>Спил дерева</th><td>от 4 000 ₽</td></tr>
                  <tr><th>Измельчение пня</th><td>от 1 500 ₽</td></tr>
                  <tr><th>Автовышка, час</th><td>от 2 500 ₽</td></tr>
                  <tr><th>Автовышка, смена 8 ч</th><td>от 15 000 ₽</td></tr>
                  <tr><th>Высотные работы</th><td>от 2 500 ₽/час</td></tr>
                  <tr><th>Очистка крыши</th><td>от 50 ₽/м²</td></tr>
                  <tr><th>Снегоудержатели</th><td>от 500 ₽/м.п.</td></tr>
                  <tr><th>Веранда или навес</th><td>от 60 000 ₽</td></tr>
                </tbody>
              </table>
              <div class="btn-row" style="margin-top:16px">
                <a class="btn btn--ghost btn--sm" href="ceny.html">Полный прайс →</a>
              </div>
            </div>
            <div>
              <ul class="ticks">
                <li>Точная цена — по фото или после осмотра</li>
                <li>Дорога до ${city.nom} — по километражу</li>
                <li>Аварийные заявки — в приоритете</li>
                <li>Для юрлиц — договор и закрывающие документы</li>
                <li>Оплата: наличные, безнал, ЭДО</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="sec" id="portfolio-sec">
      <div class="wrap">
        <div class="sec__inner">
          <div class="sec__head" data-animate>
            <span class="label">Работы</span>
            <h2>Что уже делал</h2>
            <p class="lead">100+ объектов в Серове и районе. Фото — на странице портфолио.</p>
          </div>
          <div class="gallery">
            <figure data-animate><img src="portfolio-img/avtovyshka/0e3e0697-c05a-4cde-9b92-76fde0c58305.webp" alt="Автовышка АГП-22 на объекте" loading="lazy"></figure>
            <figure data-animate><img src="portfolio-img/kryshi-sneg/IMG20240121123829.webp" alt="Очистка кровли от снега" loading="lazy"></figure>
            <figure data-animate><img src="portfolio-img/televyshka/P5290095.webp" alt="Высотные работы на телевышке" loading="lazy"></figure>
          </div>
          <div class="btn-row" style="margin-top:24px">
            <a class="btn btn--ghost" href="portfolio.html">Все работы →</a>
          </div>
        </div>
      </div>
    </section>

    <section class="sec" id="faq" aria-labelledby="t-faq">
      <div class="wrap">
        <div class="sec__inner">
          <div class="sec__head" data-animate>
            <span class="label">FAQ</span>
            <h2 id="t-faq">Вопросы по ${city.nom}</h2>
          </div>
          <div class="faq">
            ${faqs}
          </div>
        </div>
      </div>
    </section>

    <section class="sec" id="contact" aria-labelledby="t-cta">
      <div class="wrap">
        <div class="cta-block">
          <div>
            <span class="label">Заявка</span>
            <h2 id="t-cta" style="margin-bottom:16px">Пришлите фото — назову цену</h2>
            <p class="lead" style="margin:0 0 22px">Напишите в WhatsApp или MAX, приложите фото объекта и адрес. Ориентир дам сразу, точную цену — после осмотра.</p>
            <div class="btn-row">
              <a class="btn btn--amber" href="${WHATSAPP}?text=${encodeURIComponent('Здравствуйте, нужен спил/высотные работы в ' + city.pre)}" target="_blank" rel="noopener">WhatsApp <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M4 12h15M13 6l6 6-6 6"/></svg></a>
              <a class="btn" href="${MAX}" target="_blank" rel="noopener">MAX</a>
              <a class="btn btn--ghost" href="tel:${PHONE_LINK}">${PHONE}</a><a class="btn btn--ghost" href="tel:${PHONE2_LINK}">${PHONE2}</a>
            </div>
          </div>
          <div id="form">
            <form class="form" name="zayavka" method="POST" action="https://formsubmit.co/${EMAIL}">
              <input type="hidden" name="source" value="${city.slug}"><input type="hidden" name="_subject" value="Заявка с сайта: ${city.slug}"><input type="hidden" name="_captcha" value="false"><input type="hidden" name="_template" value="table"><input type="hidden" name="_next" value="${SITE}/spasibo.html">
              <h3>Заявка</h3>
              <div class="field"><label for="${city.slug}-name">Имя</label><input id="${city.slug}-name" type="text" name="name" autocomplete="name" placeholder="Как к вам обращаться"></div>
              <div class="field"><label for="${city.slug}-tel">Телефон</label><input id="${city.slug}-tel" type="tel" name="phone" autocomplete="tel" inputmode="tel" placeholder="+7 ___ ___-__-__" required></div>
              <div class="field"><label for="${city.slug}-msg">Что нужно сделать</label><textarea id="${city.slug}-msg" name="message" placeholder="Например: спилить сосну у дома, ${city.nom}"></textarea></div>
              <input class="hp" type="text" name="_honey" tabindex="-1" autocomplete="off" aria-hidden="true">
              <label class="form__consent"><input type="checkbox" name="consent" value="yes" required><span>Согласен(-на) на обработку персональных данных в соответствии с <a href="politika.html" target="_blank" rel="noopener">Политикой</a></span></label>
              <button class="btn btn--block" type="submit">Отправить заявку <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M4 12h15M13 6l6 6-6 6"/></svg></button>
            </form>
          </div>
        </div>
      </div>
    </section>
  </main>
  <footer class="site-footer">
    <div class="wrap">
      <div class="footer__top">
        <a class="logo" href="index.html" aria-label="На главную"><i></i><span>АВТОВЫШКА66<small>высотные работы · Серов</small></span></a>
        <a class="footer__tel" href="tel:${PHONE_LINK}">${PHONE}</a>
      </div>
      <div class="footer__cols">
        <div class="footer__col">
          <h4>Разделы</h4>
          <ul class="footer__list">
            <li><a href="uslugi.html">Услуги</a></li>
            <li><a href="ceny.html">Цены</a></li>
            <li><a href="portfolio.html">Работы</a></li>
            <li><a href="o-kompanii.html">О себе</a></li>
            <li><a href="kontakty.html">Контакты</a></li>
          </ul>
        </div>
        <div class="footer__col">
          <h4>Контакты</h4>
          <p>Индивидуальный предприниматель Рямбов Степан Александрович<br>Серов, ул. Я. Свердлова, 40<br>8:00 – 21:00, без выходных</p>
          <div class="footer__contacts">
            <a href="tel:${PHONE_LINK}">${PHONE}</a>
            <a href="tel:${PHONE2_LINK}">${PHONE2}</a>
            <a href="${WHATSAPP}" target="_blank" rel="noopener">WhatsApp</a>
            <a href="${MAX}" target="_blank" rel="noopener">MAX</a>
          </div>
        </div>
      </div>
      ${footerSeo()}      <div class="footer__bottom">
        <span>© 2026 Индивидуальный предприниматель Рямбов С. А.</span>
        <a href="politika.html">Политика конфиденциальности</a>
      </div>
    </div>
  </footer>
  <nav class="stickybar" aria-label="Быстрая связь">
    <a href="tel:${PHONE_LINK}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2A20 20 0 0 1 2 4.2 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.7l.6 3a2 2 0 0 1-.5 1.9L7.9 10a16 16 0 0 0 6 6l1.4-1.2a2 2 0 0 1 1.9-.5l3 .6A2 2 0 0 1 22 16.9z"/></svg> Позвонить</a>
    <a href="${WHATSAPP}?text=${encodeURIComponent('Здравствуйте, нужен спил/высотные работы в ' + city.pre)}" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 21l1.6-4.6A8.5 8.5 0 1 1 8 19.6L3 21z"/></svg> Написать в WhatsApp</a>
  </nav>
  <script defer src="js/animations.js"></script><script defer src="js/modal.js"></script><script defer src="js/lightbox.js"></script>
</body>
</html>
`;
}

/* ---------- geo hub ---------- */
function geoHubPage() {
  const cfg = GEO_HUB;
  const url = SITE + cfg.url;
  const faqs = [
    ['Куда выезжаете?', 'База — Серов. Работаю в радиусе 150 км: Краснотурьинск, Карпинск, Североуральск, Волчанск, Новая Ляля, Верхотурье, Ивдель, Нижняя Тура, Лесной, Качканар и посёлки между ними.'],
    ['Дорога входит в цену?', 'Считаю по километражу и включаю в смету. Цену называю до выезда, после фото или осмотра.'],
    ['Можно за один выезд закрыть несколько задач?', 'Да. Часто совмещаю спил, измельчение пней и очистку крыши — так дорога делится на объём и выходит дешевле.'],
    ['Как быстро приедете в район?', 'В Серове и ближних городах — в день обращения. Дальние выезды планирую на 1–3 дня, аварийные — в приоритете.'],
  ];
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      businessNode(),
      websiteNode(),
      pageNode({ url, title: cfg.title, desc: cfg.desc, image: cfg.image }),
      breadcrumbNode([{ name: cfg.crumb, item: cfg.url }], url),
      faqNode(faqs, url),
      {
        '@type': 'ItemList',
        '@id': url + '#cities',
        name: 'Города выезда',
        itemListElement: CITIES.map((c, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: c.nom,
          url: SITE + '/' + c.slug + '.html',
        })),
      },
    ],
  };
  const head = buildHead({ title: cfg.title, desc: cfg.desc, url, image: cfg.image, preload: cfg.preload, schema });
  const rows = CITIES.map((c) => `<tr>
                <th><a class="link" href="${c.slug}.html">${c.nom}</a></th>
                <td>${c.dist}</td>
                <td>Спил, автовышка, высотные работы, крыши</td>
              </tr>`).join('\n              ');
  const faqHtml = faqs.map(([q, a]) => `<details data-animate><summary>${q}</summary><p>${a}</p></details>`).join('\n            ');

  return `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <meta name="theme-color" content="#3b5a3a">
  ${head}
  <link rel="stylesheet" href="css/styles.css">
</head>
<body>
  <header class="site-header">
    <div class="wrap">
      <a class="logo" href="index.html" aria-label="На главную"><i></i><span>АВТОВЫШКА66<small>высотные работы · Серов</small></span></a>
      <input type="checkbox" id="nav-toggle" class="nav-toggle" aria-label="Меню">
      <label for="nav-toggle" class="burger" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18"/></svg></label>
      <nav class="nav" aria-label="Основная навигация">
        <a href="index.html">Главная</a>
        <a href="uslugi.html">Услуги</a>
        <a href="ceny.html">Цены</a>
        <a href="portfolio.html">Работы</a>
        <a href="o-kompanii.html">О себе</a>
        <a href="kontakty.html">Контакты</a>
      </nav>
      <a class="header-tel" href="tel:${PHONE_LINK}"><svg aria-hidden="true" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M22 16.9v3a2 2 0 0 1-2.2 2A20 20 0 0 1 2 4.2 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.7l.6 3a2 2 0 0 1-.5 1.9L7.9 10a16 16 0 0 0 6 6l1.4-1.2a2 2 0 0 1 1.9-.5l3 .6A2 2 0 0 1 22 16.9z"/></svg> ${PHONE}</a>
    </div>
  </header>
  <main>
    ${visibleCrumbs([{ name: cfg.crumb, item: null }])}
    <section class="hero">
      <div class="wrap">
        <div class="hero__panel">
          <div class="hero__text">
            <span class="label">Серов · радиус 150 км</span>
            <h1>География работ: Серов и 150 км</h1>
            <p class="lead">Спил деревьев, автовышка, высотные работы и кровля — в Серове, Краснотурьинске, Карпинске, Североуральске и соседних городах. Дорогу считаю по километражу и называю цену до выезда.</p>
            <div class="hero__ctas">
              <a class="btn" href="#form">Оценить по фото <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M4 12h15M13 6l6 6-6 6"/></svg></a>
              <a class="btn btn--ghost" href="tel:${PHONE_LINK}">${PHONE}</a>
            </div>
            <ul class="hero__bullets">
              <li>8 городов и посёлки между ними</li>
              <li>Аварийные заявки — в приоритете</li>
              <li>Договор, безнал, ЭДО</li>
            </ul>
          </div>
          <figure class="hero__photo">
            <img src="img/hero-avtovyshka.webp" alt="Автовышка АГП-22 на выезде в Свердловской области" loading="eager" fetchpriority="high">
            <figcaption><b>Своя техника.</b> АГП-22 на вездеходной базе.</figcaption>
          </figure>
        </div>
      </div>
    </section>

    <section class="sec" id="cities" aria-labelledby="t-cities">
      <div class="wrap">
        <div class="sec__inner">
          <div class="sec__head" data-animate>
            <span class="label">Города</span>
            <h2 id="t-cities">Куда выезжаю</h2>
            <p class="lead">База — Серов. Ближние города закрываю в день обращения, дальние — сменой или несколькими днями.</p>
          </div>
          <table class="spec">
            <tbody>
              <tr><th>Город</th><th>Расстояние</th><th>Что делаю</th></tr>
              ${rows}
              <tr><th>Лесной, Качканар</th><td>≈110–130 км</td><td>По согласованию, смена или несколько задач</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <section class="sec" id="rules" aria-labelledby="t-rules">
      <div class="wrap">
        <div class="sec__inner">
          <div class="sec__head" data-animate>
            <span class="label">Выезд</span>
            <h2 id="t-rules">Как считаю дорогу и работу</h2>
          </div>
          <div class="split">
            <div>
              <p class="lead">Цена работы не зависит от города: спил от 4 000 ₽, автовышка от 2 500 ₽/час, очистка крыши от 50 ₽/м². Отдельно считается дорога — по километражу от Серова.</p>
              <p>Если задач несколько, дорога делится на весь объём: например, спил дерева, измельчение пня и очистка крыши за один выезд выходят дешевле, чем три отдельные поездки. Для дальних городов — Североуральск, Ивдель, Верхотурье — планирую смену, чтобы уложиться в один день.</p>
            </div>
            <div>
              <ul class="ticks">
                <li>Ориентир по фото — бесплатно</li>
                <li>Точная смета — после осмотра или замера</li>
                <li>Дорога — по километражу, без скрытых доплат</li>
                <li>Аварийные деревья — вне очереди</li>
                <li>Для организаций — договор, ППР, ЭДО</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="sec" id="faq" aria-labelledby="t-faq">
      <div class="wrap">
        <div class="sec__inner">
          <div class="sec__head" data-animate>
            <span class="label">FAQ</span>
            <h2 id="t-faq">Вопросы о выезде</h2>
          </div>
          <div class="faq">
            ${faqHtml}
          </div>
        </div>
      </div>
    </section>

    <section class="sec" id="contact" aria-labelledby="t-cta">
      <div class="wrap">
        <div class="cta-block">
          <div>
            <span class="label">Заявка</span>
            <h2 id="t-cta" style="margin-bottom:16px">Пришлите фото — назову цену</h2>
            <p class="lead" style="margin:0 0 22px">Укажите город, адрес и что нужно сделать. Приложите фото — так оценка будет точнее.</p>
            <div class="btn-row">
              <a class="btn btn--amber" href="${WHATSAPP}" target="_blank" rel="noopener">WhatsApp <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M4 12h15M13 6l6 6-6 6"/></svg></a>
              <a class="btn" href="${MAX}" target="_blank" rel="noopener">MAX</a>
              <a class="btn btn--ghost" href="tel:${PHONE_LINK}">${PHONE}</a><a class="btn btn--ghost" href="tel:${PHONE2_LINK}">${PHONE2}</a>
            </div>
          </div>
          <div id="form">
            <form class="form" name="zayavka" method="POST" action="https://formsubmit.co/${EMAIL}">
              <input type="hidden" name="source" value="geografiya"><input type="hidden" name="_subject" value="Заявка с сайта: geografiya"><input type="hidden" name="_captcha" value="false"><input type="hidden" name="_template" value="table"><input type="hidden" name="_next" value="${SITE}/spasibo.html">
              <h3>Заявка</h3>
              <div class="field"><label for="geo-name">Имя</label><input id="geo-name" type="text" name="name" autocomplete="name" placeholder="Как к вам обращаться"></div>
              <div class="field"><label for="geo-tel">Телефон</label><input id="geo-tel" type="tel" name="phone" autocomplete="tel" inputmode="tel" placeholder="+7 ___ ___-__-__" required></div>
              <div class="field"><label for="geo-msg">Город и задача</label><textarea id="geo-msg" name="message" placeholder="Например: Краснотурьинск, спилить тополь во дворе"></textarea></div>
              <input class="hp" type="text" name="_honey" tabindex="-1" autocomplete="off" aria-hidden="true">
              <label class="form__consent"><input type="checkbox" name="consent" value="yes" required><span>Согласен(-на) на обработку персональных данных в соответствии с <a href="politika.html" target="_blank" rel="noopener">Политикой</a></span></label>
              <button class="btn btn--block" type="submit">Отправить заявку <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M4 12h15M13 6l6 6-6 6"/></svg></button>
            </form>
          </div>
        </div>
      </div>
    </section>
  </main>
  <footer class="site-footer">
    <div class="wrap">
      <div class="footer__top">
        <a class="logo" href="index.html" aria-label="На главную"><i></i><span>АВТОВЫШКА66<small>высотные работы · Серов</small></span></a>
        <a class="footer__tel" href="tel:${PHONE_LINK}">${PHONE}</a>
      </div>
      <div class="footer__cols">
        <div class="footer__col">
          <h4>Разделы</h4>
          <ul class="footer__list">
            <li><a href="uslugi.html">Услуги</a></li>
            <li><a href="ceny.html">Цены</a></li>
            <li><a href="portfolio.html">Работы</a></li>
            <li><a href="o-kompanii.html">О себе</a></li>
            <li><a href="kontakty.html">Контакты</a></li>
          </ul>
        </div>
        <div class="footer__col">
          <h4>Контакты</h4>
          <p>Индивидуальный предприниматель Рямбов Степан Александрович<br>Серов, ул. Я. Свердлова, 40<br>8:00 – 21:00, без выходных</p>
          <div class="footer__contacts">
            <a href="tel:${PHONE_LINK}">${PHONE}</a>
            <a href="tel:${PHONE2_LINK}">${PHONE2}</a>
            <a href="${WHATSAPP}" target="_blank" rel="noopener">WhatsApp</a>
            <a href="${MAX}" target="_blank" rel="noopener">MAX</a>
          </div>
        </div>
      </div>
      ${footerSeo()}      <div class="footer__bottom">
        <span>© 2026 Индивидуальный предприниматель Рямбов С. А.</span>
        <a href="politika.html">Политика конфиденциальности</a>
      </div>
    </div>
  </footer>
  <nav class="stickybar" aria-label="Быстрая связь">
    <a href="tel:${PHONE_LINK}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2A20 20 0 0 1 2 4.2 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.7l.6 3a2 2 0 0 1-.5 1.9L7.9 10a16 16 0 0 0 6 6l1.4-1.2a2 2 0 0 1 1.9-.5l3 .6A2 2 0 0 1 22 16.9z"/></svg> Позвонить</a>
    <a href="${WHATSAPP}" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 21l1.6-4.6A8.5 8.5 0 1 1 8 19.6L3 21z"/></svg> Написать в WhatsApp</a>
  </nav>
  <script defer src="js/animations.js"></script><script defer src="js/modal.js"></script><script defer src="js/lightbox.js"></script>
</body>
</html>
`;
}

/* ---------- sitemap / robots ---------- */
function buildSitemap() {
  const entries = [
    ...PAGES.filter((p) => p.priority).map((p) => ({
      loc: SITE + (p.url === '/' ? '/' : p.url),
      priority: p.priority,
      changefreq: p.changefreq,
      image: p.image,
    })),
    { loc: SITE + '/geografiya.html', priority: '0.8', changefreq: 'monthly', image: '/img/hero-avtovyshka.webp' },
    ...CITIES.map((c) => ({ loc: SITE + '/' + c.slug + '.html', priority: '0.7', changefreq: 'monthly', image: c.img })),
  ];
  const urls = entries.map((e) => `  <url>
    <loc>${e.loc}</loc>
    <lastmod>${LAST_MOD}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
    <image:image>
      <image:loc>${abs(e.image)}</image:loc>
      <image:title>Автовышка66 — ${e.loc === SITE + '/' ? 'спил деревьев и высотные работы в Серове' : 'работы в Серове и Свердловской области'}</image:title>
    </image:image>
  </url>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls}
</urlset>
`;
}

const robots = `# robots.txt для https://автовышка66.рф
User-agent: *
Allow: /
# Служебные страницы закрыты через noindex, поэтому не запрещаем их обход.
Disallow: /tools/

# Яндекс: не учитывать рекламные метки
Clean-param: utm_source&utm_medium&utm_campaign&utm_term&utm_content&yclid&gclid&fbclid

Sitemap: ${SITE}/sitemap.xml
`;

/* ---------- run ---------- */
const report = [];
for (const p of [...PAGES, GEO_HUB]) {
  if (p === GEO_HUB) {
    write(GEO_HUB.file, geoHubPage());
    report.push({ file: GEO_HUB.file, title: GEO_HUB.title.length, desc: GEO_HUB.desc.length, faqs: 4 });
  } else {
    report.push(buildExistingPage(p));
  }
}
for (const c of CITIES) {
  const title = `Спил деревьев и автовышка в ${c.pre} — Автовышка66`;
  const desc = `Спил деревьев от 4 000 ₽, аренда автовышки АГП-22 от 2 500 ₽/час, высотные работы и очистка крыш. ${c.nom} — ${c.dist} от Серова. 17 лет опыта.`;
  write(c.slug + '.html', cityPage(c));
  report.push({ file: c.slug + '.html', title: title.length, desc: desc.length, faqs: c.faq.length });
}

write('sitemap.xml', buildSitemap());
write('robots.txt', robots.replace(/\r\n/g, '\n'));
write('.nojekyll', '');

try {
  execFileSync('python', [path.join(ROOT, 'tools', 'add-img-dims.py')], { stdio: 'inherit' });
} catch (err) {
  console.warn('image dimensions skipped:', err.message);
}

console.log('SEO build complete');
for (const r of report) console.log(`${r.file}: title=${r.title}, desc=${r.desc}, faq=${r.faqs}`);
