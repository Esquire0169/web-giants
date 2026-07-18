export type Lang = 'en' | 'ru'

export interface Dict {
  meta: { title: string; description: string }
  header: {
    nav: { label: string; href: string }[]
    cta: string
    langLabel: string
    menuOpen: string
    menuClose: string
  }
  hero: {
    kicker: string
    l1: string
    l2: string
    l3: string
    support: string
    ctaPrimary: string
    ctaSecondary: string
    trust: string[]
  }
  services: {
    kicker: string
    titlePre: string
    titleAccent: string
    sub: string
    openHint: string
    closeHint: string
    items: {
      num: string
      title: string
      promise: string
      body: string
      metric: string
      tags: string[]
    }[]
  }
  work: {
    kicker: string
    titlePre: string
    titleAccent: string
    sub: string
    problemLabel: string
    solutionLabel: string
    openExternal: string
    openPrivate: string
    /** Template with `{price}`, e.g. "from {price}" */
    priceFrom: string
    status: {
      live: string
      wip: string
      /** Template with `{eta}` after the WIP label */
      wipWithEta: string
      eta: {
        '7d': string
        '1m': string
        '2m': string
        '6m': string
      }
    }
    othersKicker: string
    othersTitle: string
    othersBody: string
    private: {
      badge: string
      back: string
      noticeTitle: string
      noticeBody: string
      cta: string
      galleryLabel: string
    }
    cases: {
      category: string
      problem: string
      solution: string
      result: string
    }[]
  }
  process: {
    kicker: string
    titlePre: string
    titleAccent: string
    sub: string
    steps: { num: string; title: string; line: string; detail: string }[]
  }
  stack: {
    kicker: string
    titlePre: string
    titleAccent: string
    stats: { value: string; label: string }[]
    groups: { label: string; items: string[] }[]
  }
  contact: {
    kicker: string
    titlePre: string
    titleAccent: string
    support: string
    assurances: { title: string; body: string }[]
    location: string
    channels: {
      kicker: string
      lead: string
      ariaGroup: string
      telegramChannel: string
      telegramAccount: string
      /** Short label for header / dense UI */
      accountShort: string
      phone: string
      email: string
      preferred: string
    }
    form: {
      name: string
      namePlaceholder: string
      email: string
      emailPlaceholder: string
      projectType: string
      projectTypes: string[]
      budget: string
      budgets: string[]
      message: string
      messagePlaceholder: string
      attachments: string
      attachmentsHint: string
      attachmentsAdd: string
      attachmentsRemove: string
      errName: string
      errEmail: string
      errSubmit: string
      errAttachmentsMax: string
      errAttachmentsType: string
      errAttachmentsSize: string
      send: string
      sending: string
      sent: string
      privacy: string
      successTitlePre: string
      successTitleAccent: string
      successBody: string
      successFallbackName: string
      successAgain: string
    }
    delivery: {
      cargo: string
      idea: string
      handleCare: string
      brandMark: string
      skip: string
      statusPlaying: string
      statusDone: string
    }
  }
  footer: {
    tagline: string
    navKicker: string
    nav: { label: string; href: string }[]
    rights: string
    eggAria: string
  }
}

const en: Dict = {
  meta: {
    title: 'Web Giants — Elite Digital Production Studio',
    description:
      'Web Giants is a premium digital production studio crafting websites, apps, games and interactive experiences for brands that refuse to be ordinary.',
  },
  header: {
    nav: [
      { label: 'Services', href: '#services' },
      { label: 'Work', href: '#work' },
      { label: 'Process', href: '#process' },
      { label: 'Studio', href: '#studio' },
      { label: 'Cases', href: '#work' },
    ],
    cta: 'Start a Project',
    langLabel: 'Language',
    menuOpen: 'Open menu',
    menuClose: 'Close menu',
  },
  hero: {
    kicker: 'Digital Production Studio — Est. MMXVIII',
    l1: 'We Build',
    l2: 'Digital',
    l3: 'Worlds\u200B.',
    support:
      'An elite production house crafting websites, apps, games and interactive experiences for brands that refuse to be ordinary.',
    ctaPrimary: 'Start a Project',
    ctaSecondary: 'View Work',
    trust: ['Games', 'Apps', 'Software', 'Web', 'AI', 'Interactive Experiences'],
  },
  services: {
    kicker: 'Services',
    titlePre: 'What we',
    titleAccent: 'craft',
    sub: 'Six disciplines, one standard: every deliverable engineered to perform like a flagship product.',
    openHint: 'Open',
    closeHint: 'Close',
    items: [
      {
        num: '01',
        title: 'Game Development',
        promise: 'Worlds players never want to leave.',
        body: 'Full-cycle production of PC, console and browser titles — from concept art and narrative design to shipped, optimized builds.',
        metric: '14 titles shipped',
        tags: ['Unity', 'Unreal', 'Godot'],
      },
      {
        num: '02',
        title: 'Web Design & Development',
        promise: 'Websites engineered to convert.',
        body: 'Award-calibre marketing sites, e-commerce and platforms built on modern stacks with obsessive performance budgets.',
        metric: '98+ avg. Lighthouse',
        tags: ['Next.js', 'React', 'WebGL'],
      },
      {
        num: '03',
        title: 'Mobile Apps',
        promise: 'Native feel. Zero compromise.',
        body: 'iOS and Android products designed around retention — fluid interfaces, offline-first architecture, ruthless polish.',
        metric: '4.8★ avg. store rating',
        tags: ['Swift', 'Kotlin', 'React Native'],
      },
      {
        num: '04',
        title: 'AI & Interactive Systems',
        promise: 'Intelligence woven into the experience.',
        body: 'Custom AI pipelines, real-time 3D and generative interfaces that turn visitors into participants.',
        metric: '31 systems in production',
        tags: ['AI Systems', 'Three.js', 'LLM Ops'],
      },
      {
        num: '05',
        title: 'CRM System Development',
        promise: 'Operations that finally stay in sync.',
        body: 'Custom CRM platforms tailored to your sales, ops and support flows — pipelines, roles, automations and reporting without the bloat of off-the-shelf suites.',
        metric: 'End-to-end business workflows',
        tags: ['CRM', 'Dashboards', 'Automations'],
      },
      {
        num: '06',
        title: 'Web Editors & Tools',
        promise: 'Professional tools, right in the browser.',
        body: 'Browser-based editors and internal instruments — 3D planners, configurators, document tools and admin workplaces that feel as sharp as desktop software.',
        metric: 'Desktop-grade in the browser',
        tags: ['Editors', 'Configurators', 'WebGL'],
      },
    ],
  },
  work: {
    kicker: 'Selected Work',
    titlePre: 'Proof, not',
    titleAccent: 'promises',
    sub: 'A selection of engagements where craft translated directly into measurable outcomes.',
    problemLabel: 'Problem',
    solutionLabel: 'Solution',
    openExternal: 'Open project',
    openPrivate: 'View case',
    priceFrom: 'from {price}',
    status: {
      live: 'Live',
      wip: 'In development',
      wipWithEta: 'In development ({eta})',
      eta: {
        '7d': 'ETA 7 days',
        '1m': 'ETA 1 month',
        '2m': 'ETA 2 months',
        '6m': 'ETA 6 months',
      },
    },
    othersKicker: 'Archive',
    othersTitle: 'And others',
    othersBody:
      'There are more engagements in our archive. We do not publish them publicly — NDAs, active products, and client privacy come first.',
    private: {
      badge: 'Private project',
      back: 'Back to work',
      noticeTitle: 'Available on request',
      noticeBody:
        'This is a private engagement. We can share a detailed description, scope and walkthrough individually — after a short intro call.',
      cta: 'Request a briefing',
      galleryLabel: 'Visual direction',
    },
    cases: [
      {
        category: 'AI Product / Esoterica',
        problem:
          'Esoteric services were scattered across tools with weak monetization and no product spine.',
        solution:
          'An AI platform for tarot, runes, natal charts and numerology — credit store, request history, and a polished reading flow.',
        result: 'Shipped end-to-end product with credits commerce and retained reading sessions',
      },
      {
        category: 'Legal Website',
        problem: 'A law practice needed a premium digital facade with a clear path to consultation.',
        solution:
          'A dark editorial site: practices, team, trust signals, and a frictionless CTA to book a call.',
        result: 'Conversion-focused launch with strong visual hierarchy and deploy-ready stack',
      },
      {
        category: 'Furniture / 3D Configurator',
        problem:
          'A furniture brand needed more than a catalog — customers had to design kitchens, wardrobes and TV units themselves.',
        solution:
          'A modern site with in-browser 3D design: kitchens (including U-shaped), wardrobe systems, TV stands and tailored configurations with full pricing.',
        result: 'Customers explore, configure and get a personal setup — all on one platform',
      },
      {
        category: '3D Editor / Interior',
        problem:
          'Kitchen and interior planning lived in desktop software — hard to share, hard to sell online.',
        solution:
          'A browser planner: top plan, elevations, real-time 3D, BOM, DXF/PDF export — built for both beginners and pros.',
        result: 'PRO100-class web editor with snap, facades, assembly packs and pricing',
      },
      {
        category: 'Web App / Sports Ops',
        problem:
          'Kids training schedules lived in spreadsheets and messengers — lost data, chaotic calendars.',
        solution:
          'A unified ops interface: calendar, dashboards, directories, and reporting for coaches and admins.',
        result: 'Production system on VPS with exports, backups and role-based access',
      },
      {
        category: 'Personal OS / Dashboard',
        problem: 'Projects, tasks, contacts and life domains were scattered across tools.',
        solution:
          'A local life OS: profile, projects, tasks, contacts, spheres — one surface for personal operations.',
        result: 'Unified personal system with charts, drag-and-drop planning and local-first data',
      },
    ],
  },
  process: {
    kicker: 'Process',
    titlePre: 'How giants',
    titleAccent: 'move',
    sub: 'A disciplined five-phase system refined over eight years and a hundred launches. No chaos, no black box — you see everything.',
    steps: [
      {
        num: '01',
        title: 'Discovery',
        line: 'We interrogate the brief until the real problem surfaces.',
        detail: 'Stakeholder workshops · market teardown · success metrics',
      },
      {
        num: '02',
        title: 'Strategy',
        line: 'Every decision gets mapped to a business outcome before a pixel moves.',
        detail: 'Experience architecture · technical blueprint · roadmap',
      },
      {
        num: '03',
        title: 'Design',
        line: 'Cinematic direction, prototyped in motion — not static mockups.',
        detail: 'Art direction · design system · interactive prototypes',
      },
      {
        num: '04',
        title: 'Build',
        line: 'Production-grade engineering with performance budgets enforced in CI.',
        detail: 'Weekly demos · automated QA · zero-surprise delivery',
      },
      {
        num: '05',
        title: 'Launch & Scale',
        line: 'We ship, measure, and stay in the trenches after go-live.',
        detail: 'Analytics · A/B iteration · long-term partnership',
      },
    ],
  },
  stack: {
    kicker: 'Capability & Trust',
    titlePre: 'Modern stack,',
    titleAccent: 'mastered',
    stats: [
      { value: '120+', label: 'Projects delivered' },
      { value: '8 yrs', label: 'In production' },
      { value: '19', label: 'Industry awards' },
      { value: '96%', label: 'Clients return' },
    ],
    groups: [
      { label: 'Engineering', items: ['React', 'Next.js', 'TypeScript', 'Node.js', 'Rust / WASM'] },
      { label: 'Real-time & 3D', items: ['WebGL', 'Three.js', 'WebGPU', 'Unity', 'Unreal', 'Godot'] },
      { label: 'Design & Systems', items: ['Figma', 'Webflow', 'AI Systems', 'Design Tokens', 'Motion'] },
    ],
  },
  contact: {
    kicker: 'Start Here',
    titlePre: 'Ready to build something',
    titleAccent: 'giant?',
    support:
      "Tell us where you want to be. We'll bring the strategy, the craft, and the engineering to get you there — on schedule.",
    assurances: [
      {
        title: 'Reply within 24h',
        body: 'A senior partner answers personally — no sales bots, no queues.',
      },
      {
        title: 'NDA-friendly',
        body: 'Happy to sign before you share a single detail of the idea.',
      },
      {
        title: 'Straight answers',
        body: 'You get a realistic scope, timeline and budget after the first call.',
      },
    ],
    location: 'Worldwide · Remote-first',
    channels: {
      kicker: 'Direct lines',
      lead: 'Reach a partner directly — no tickets, no bots.',
      ariaGroup: 'Studio contact channels',
      telegramChannel: 'Telegram Channel',
      telegramAccount: 'Telegram Account',
      accountShort: 'Account',
      phone: 'Phone',
      email: 'Email',
      preferred: 'Fastest reply',
    },
    form: {
      name: 'Name',
      namePlaceholder: 'Ada Lovelace',
      email: 'Email',
      emailPlaceholder: 'you@company.com',
      projectType: 'Project type',
      projectTypes: ['Website', 'Mobile App', 'Game', 'AI / Interactive', 'Something else'],
      budget: 'Budget range',
      budgets: ['$1.5–4k', '$4–10k', '$10–25k', '$25–50k', '$50k+', 'Not sure yet'],
      message: 'Message',
      messagePlaceholder:
        'A few lines about your goals, timeline, or the world you want to build\u2026',
      attachments: 'Attachments',
      attachmentsHint: 'Optional — PDF, PNG, DOC and more. Up to 5 files, 8 MB each.',
      attachmentsAdd: 'Add files',
      attachmentsRemove: 'Remove file',
      errName: 'Please tell us your name.',
      errEmail: 'Please enter a valid email.',
      errSubmit: 'Something went wrong. Please try again — or email us directly.',
      errAttachmentsMax: 'You can attach up to 5 files.',
      errAttachmentsType: 'That file type is not supported.',
      errAttachmentsSize: 'Each file must be 8 MB or smaller.',
      send: 'Send Request',
      sending: 'Sending\u2026',
      sent: 'Request Sent',
      privacy: 'No newsletters, no spam — your details stay with us.',
      successTitlePre: 'Request',
      successTitleAccent: 'received',
      successBody: "Thank you, {name}. We'll get back to you within 24 hours — usually much sooner.",
      successFallbackName: 'friend',
      successAgain: 'Send another request',
    },
    delivery: {
      cargo: 'Cargo',
      idea: 'IDEA',
      handleCare: 'Handle with care',
      brandMark: 'Web Giants',
      skip: 'Skip',
      statusPlaying: 'Sending your request…',
      statusDone: 'Request received.',
    },
  },
  footer: {
    tagline: 'Built by giants, for brands that think big.',
    navKicker: 'Navigate',
    nav: [
      { label: 'Services', href: '#services' },
      { label: 'Work', href: '#work' },
      { label: 'Process', href: '#process' },
      { label: 'Contact', href: '#contact' },
    ],
    rights: 'Web Giants Studio',
    eggAria: 'A secret from 1998',
  },
}

const ru: Dict = {
  meta: {
    title: 'Web Giants — элитная студия цифрового продакшена',
    description:
      'Web Giants — премиальная студия цифрового продакшена: сайты, приложения, игры и интерактивные впечатления для брендов, которые не согласны быть обычными.',
  },
  header: {
    nav: [
      { label: 'Услуги', href: '#services' },
      { label: 'Работы', href: '#work' },
      { label: 'Процесс', href: '#process' },
      { label: 'Студия', href: '#studio' },
      { label: 'Кейсы', href: '#work' },
    ],
    cta: 'Начать проект',
    langLabel: 'Язык',
    menuOpen: 'Открыть меню',
    menuClose: 'Закрыть меню',
  },
  hero: {
    kicker: 'Студия цифрового продакшена — с 2018 года',
    l1: 'Мы строим',
    l2: 'Цифровые',
    l3: 'Миры\u200B.',
    support:
      'Элитный продакшен-хаус: сайты, приложения, игры и интерактивные впечатления для брендов, которые не согласны быть обычными.',
    ctaPrimary: 'Начать проект',
    ctaSecondary: 'Смотреть работы',
    trust: ['Игры', 'Приложения', 'Софт', 'Веб', 'AI', 'Интерактив'],
  },
  services: {
    kicker: 'Услуги',
    titlePre: 'Что мы',
    titleAccent: 'создаём',
    sub: 'Шесть дисциплин, один стандарт: каждый результат спроектирован работать как флагманский продукт.',
    openHint: 'Открыть',
    closeHint: 'Закрыть',
    items: [
      {
        num: '01',
        title: 'Разработка игр',
        promise: 'Миры, в которые хочется возвращаться.',
        body: 'Полный цикл производства PC, консольных и браузерных игр — от концепт-арта и нарратива до отгруженных оптимизированных сборок.',
        metric: '14 выпущенных игр',
        tags: ['Unity', 'Unreal', 'Godot'],
      },
      {
        num: '02',
        title: 'Веб-дизайн и разработка',
        promise: 'Сайты, которые конвертируют.',
        body: 'Маркетинговые сайты уровня наград, e-commerce и платформы на современном стеке с жёсткими бюджетами производительности.',
        metric: 'Lighthouse 98+ в среднем',
        tags: ['Next.js', 'React', 'WebGL'],
      },
      {
        num: '03',
        title: 'Мобильные приложения',
        promise: 'Нативное ощущение. Без компромиссов.',
        body: 'iOS- и Android-продукты, спроектированные вокруг удержания: плавные интерфейсы, offline-first архитектура, безжалостная полировка.',
        metric: '4.8★ средний рейтинг в сторах',
        tags: ['Swift', 'Kotlin', 'React Native'],
      },
      {
        num: '04',
        title: 'AI и интерактивные системы',
        promise: 'Интеллект, вплетённый в опыт.',
        body: 'Кастомные AI-пайплайны, real-time 3D и генеративные интерфейсы, которые превращают посетителей в участников.',
        metric: '31 система в продакшене',
        tags: ['AI Systems', 'Three.js', 'LLM Ops'],
      },
      {
        num: '05',
        title: 'Разработка CRM-систем',
        promise: 'Операции, которые наконец синхронизированы.',
        body: 'Кастомные CRM под ваши продажи, операции и поддержку — воронки, роли, автоматизации и отчёты без лишнего веса коробочных решений.',
        metric: 'Сквозные бизнес-процессы',
        tags: ['CRM', 'Дашборды', 'Автоматизации'],
      },
      {
        num: '06',
        title: 'Веб-редакторы и инструменты',
        promise: 'Профессиональные инструменты прямо в браузере.',
        body: 'Браузерные редакторы и внутренние инструменты — 3D-планировщики, конфигураторы, документные модули и рабочие места, острые как десктопный софт.',
        metric: 'Уровень десктопа в браузере',
        tags: ['Редакторы', 'Конфигураторы', 'WebGL'],
      },
    ],
  },
  work: {
    kicker: 'Избранные работы',
    titlePre: 'Факты, а не',
    titleAccent: 'обещания',
    sub: 'Подборка проектов, где мастерство напрямую превратилось в измеримый результат.',
    problemLabel: 'Задача',
    solutionLabel: 'Решение',
    openExternal: 'Открыть проект',
    openPrivate: 'Смотреть кейс',
    priceFrom: 'от {price}',
    status: {
      live: 'Работает',
      wip: 'В разработке',
      wipWithEta: 'В разработке ({eta})',
      eta: {
        '7d': 'Срок 7 дней',
        '1m': 'Срок 1 месяц',
        '2m': 'Срок 2 мес',
        '6m': 'Срок 6 мес',
      },
    },
    othersKicker: 'Архив',
    othersTitle: 'И другие',
    othersBody:
      'В архиве есть и другие проекты. Мы не публикуем их открыто — NDA, активные продукты и приватность клиентов важнее витрины.',
    private: {
      badge: 'Частный проект',
      back: 'К работам',
      noticeTitle: 'Описание — индивидуально',
      noticeBody:
        'Это закрытый проект. Подробное описание, скоуп и демонстрацию можем предоставить только индивидуально — после короткого знакомства.',
      cta: 'Запросить брифинг',
      galleryLabel: 'Визуальное направление',
    },
    cases: [
      {
        category: 'AI-продукт / Эзотерика',
        problem:
          'Эзотерика без продукта: разрозненные сервисы и слабая монетизация.',
        solution:
          'AI-платформа: таро, руны, натал, нумерология, магазин кредитов и история запросов.',
        result: 'Готовый пользовательский поток с монетизацией и удержанием сессий',
      },
      {
        category: 'Юридический сайт',
        problem: 'Юридической практике нужен премиальный цифровой фасад с ясным CTA.',
        solution:
          'Тёмный editorial-сайт: практики, команда, доверие и путь к консультации.',
        result: 'Конверсионный лендинг с деплоем и сильной визуальной иерархией',
      },
      {
        category: 'Мебель / 3D-конфигуратор',
        problem:
          'Мебельной компании нужен был не просто каталог — клиент должен сам собрать кухню, шкаф или ТВ-тумбу.',
        solution:
          'Современный сайт с 3D-проектированием: кухни (включая П-образные), гардеробные системы, ТВ-тумбы и индивидуальный подбор с полным просчётом вариантов.',
        result: 'Клиент заходит, знакомится со всеми возможностями и получает конфигурацию под себя',
      },
      {
        category: '3D-редактор / Интерьер',
        problem:
          'Планировка кухонь и интерьеров жила в десктопном софте — сложно делиться и продавать онлайн.',
        solution:
          'Браузерный планировщик: план, фасады, real-time 3D, смета, экспорт DXF/PDF — для новичков и профи.',
        result: 'Веб-редактор уровня PRO100: снап, фасады, сборочные комплекты и прайсинг',
      },
      {
        category: 'Веб-приложение / Спорт',
        problem:
          'Ручной учёт тренировок в таблицах и мессенджерах — потеря данных и хаос в расписании.',
        solution:
          'Единый веб-интерфейс: календарь, дашборд, справочники и отчётность для тренеров и админов.',
        result: 'Production-ready система на VPS с экспортом, бэкапами и ролевым доступом',
      },
      {
        category: 'Personal OS / Дашборд',
        problem: 'Личные проекты, задачи и связи размазаны по инструментам.',
        solution:
          'Локальный life OS: профиль, проекты, задачи, контакты, сферы — одна поверхность для личных операций.',
        result: 'Единая персональная система с графиками, drag-and-drop планированием и local-first данными',
      },
    ],
  },
  process: {
    kicker: 'Процесс',
    titlePre: 'Как движутся',
    titleAccent: 'гиганты',
    sub: 'Дисциплинированная система из пяти фаз, отточенная за восемь лет и сотню запусков. Без хаоса и чёрного ящика — вы видите всё.',
    steps: [
      {
        num: '01',
        title: 'Погружение',
        line: 'Допрашиваем бриф, пока не проявится настоящая задача.',
        detail: 'Воркшопы со стейкхолдерами · разбор рынка · метрики успеха',
      },
      {
        num: '02',
        title: 'Стратегия',
        line: 'Каждое решение привязывается к бизнес-результату до того, как сдвинется первый пиксель.',
        detail: 'Архитектура опыта · технический блюпринт · дорожная карта',
      },
      {
        num: '03',
        title: 'Дизайн',
        line: 'Кинематографичное направление, прототипы в движении — не статичные макеты.',
        detail: 'Арт-дирекшн · дизайн-система · интерактивные прототипы',
      },
      {
        num: '04',
        title: 'Разработка',
        line: 'Инженерия продакшен-уровня с бюджетами производительности, зашитыми в CI.',
        detail: 'Еженедельные демо · автоматизированный QA · поставка без сюрпризов',
      },
      {
        num: '05',
        title: 'Запуск и рост',
        line: 'Выпускаем, измеряем и остаёмся в окопах после релиза.',
        detail: 'Аналитика · A/B-итерации · долгосрочное партнёрство',
      },
    ],
  },
  stack: {
    kicker: 'Компетенции и доверие',
    titlePre: 'Современный стек —',
    titleAccent: 'в совершенстве',
    stats: [
      { value: '120+', label: 'Проектов выпущено' },
      { value: '8 лет', label: 'В продакшене' },
      { value: '19', label: 'Отраслевых наград' },
      { value: '96%', label: 'Клиентов возвращаются' },
    ],
    groups: [
      { label: 'Инженерия', items: ['React', 'Next.js', 'TypeScript', 'Node.js', 'Rust / WASM'] },
      { label: 'Real-time и 3D', items: ['WebGL', 'Three.js', 'WebGPU', 'Unity', 'Unreal', 'Godot'] },
      { label: 'Дизайн и системы', items: ['Figma', 'Webflow', 'AI Systems', 'Design Tokens', 'Motion'] },
    ],
  },
  contact: {
    kicker: 'Начните здесь',
    titlePre: 'Готовы построить нечто',
    titleAccent: 'гигантское?',
    support:
      'Расскажите, где вы хотите оказаться. Мы принесём стратегию, мастерство и инженерию, чтобы вы туда добрались — в срок.',
    assurances: [
      {
        title: 'Ответ в течение 24 часов',
        body: 'Отвечает лично старший партнёр — без сейлз-ботов и очередей.',
      },
      {
        title: 'Дружим с NDA',
        body: 'Подпишем до того, как вы поделитесь хоть одной деталью идеи.',
      },
      {
        title: 'Прямые ответы',
        body: 'После первого созвона вы получите реалистичный скоуп, сроки и бюджет.',
      },
    ],
    location: 'По всему миру · Remote-first',
    channels: {
      kicker: 'Прямые линии',
      lead: 'Пишите партнёру напрямую — без тикетов и ботов.',
      ariaGroup: 'Контакты студии',
      telegramChannel: 'Telegram-канал',
      telegramAccount: 'Telegram-аккаунт',
      accountShort: 'Аккаунт',
      phone: 'Телефон',
      email: 'Email',
      preferred: 'Самый быстрый ответ',
    },
    form: {
      name: 'Имя',
      namePlaceholder: 'Ада Лавлейс',
      email: 'Email',
      emailPlaceholder: 'you@company.com',
      projectType: 'Тип проекта',
      projectTypes: ['Сайт', 'Мобильное приложение', 'Игра', 'AI / Интерактив', 'Что-то другое'],
      budget: 'Бюджет',
      budgets: ['$1.5–4k', '$4–10k', '$10–25k', '$25–50k', '$50k+', 'Пока не знаю'],
      message: 'Сообщение',
      messagePlaceholder:
        'Несколько строк о целях, сроках или мире, который вы хотите построить\u2026',
      attachments: 'Файлы',
      attachmentsHint: 'По желанию — PDF, PNG, DOC и другие. До 5 файлов, до 8 МБ каждый.',
      attachmentsAdd: 'Прикрепить файлы',
      attachmentsRemove: 'Удалить файл',
      errName: 'Представьтесь, пожалуйста.',
      errEmail: 'Введите корректный email.',
      errSubmit: 'Не удалось отправить. Попробуйте ещё раз — или напишите нам напрямую.',
      errAttachmentsMax: 'Можно прикрепить не больше 5 файлов.',
      errAttachmentsType: 'Этот тип файла не поддерживается.',
      errAttachmentsSize: 'Каждый файл — не больше 8 МБ.',
      send: 'Отправить заявку',
      sending: 'Отправляем\u2026',
      sent: 'Заявка отправлена',
      privacy: 'Никаких рассылок и спама — ваши данные остаются у нас.',
      successTitlePre: 'Заявка',
      successTitleAccent: 'получена',
      successBody: 'Спасибо, {name}. Ответим в течение 24 часов — обычно намного быстрее.',
      successFallbackName: 'друг',
      successAgain: 'Отправить ещё одну',
    },
    delivery: {
      cargo: 'Груз',
      idea: 'ИДЕЯ',
      handleCare: 'Хрупкое',
      brandMark: 'Web Giants',
      skip: 'Пропустить',
      statusPlaying: 'Отправляем вашу заявку…',
      statusDone: 'Заявка получена.',
    },
  },
  footer: {
    tagline: 'Создано гигантами — для брендов, которые мыслят масштабно.',
    navKicker: 'Навигация',
    nav: [
      { label: 'Услуги', href: '#services' },
      { label: 'Работы', href: '#work' },
      { label: 'Процесс', href: '#process' },
      { label: 'Контакт', href: '#contact' },
    ],
    rights: 'Web Giants Studio',
    eggAria: 'Секрет из 1998 года',
  },
}

export const DICTS: Record<Lang, Dict> = { en, ru }
