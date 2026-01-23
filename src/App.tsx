import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// Configure your download links here
// Options: Direct URLs, Lemon Squeezy links, Cloudflare R2, or public/downloads folder
const DOWNLOAD_LINKS = {
  windows: "/downloads/ZooDB-Setup.exe",
  macos: "/downloads/ZooDB.dmg",
  linux: "/downloads/ZooDB.AppImage",
  // Alternative: Use external hosting
  // windows: 'https://your-r2-bucket.r2.dev/ZooDB-Setup.exe',
  // Or Lemon Squeezy: 'https://zoodb.lemonsqueezy.com/checkout/buy/...'
};

const GITHUB_URL = "https://github.com/Only0neHpLeft/zoodb-app";

const translations = {
  en: {
    nav: { features: "Features", download: "Download", faq: "FAQ", documentation: "Documentation", support: "Support" },
    hero: {
      tag: "Educational Software",
      title: "Learn SQL",
      titleHighlight: "interactively.",
      subtitle:
        "A desktop application designed for students to master SQL through hands-on practice with a real zoo database. Track progress, earn certificates, and learn at your own pace.",
      cta: "Download Free",
      secondary: "View Source",
    },
    stats: {
      items: [
        { value: "26", label: "Lessons" },
        { value: "68+", label: "Tasks" },
        { value: "3", label: "Platforms" },
      ],
    },
    features: {
      tag: "Features",
      title: "Everything you need to master SQL",
      subtitle:
        "Built for students and teachers who want a structured, hands-on learning experience.",
      items: [
        {
          title: "Real Database",
          desc: "Practice with a complete zoo database containing animals, caretakers, types, and relationships. No setup required.",
          highlight: true,
        },
        {
          title: "Progressive Difficulty",
          desc: "Start with basic SELECT queries and advance through joins, subqueries, aggregations, and complex relationships.",
          highlight: false,
        },
        {
          title: "Instant Feedback",
          desc: "Run queries and see results immediately. Understand what works and what needs improvement.",
          highlight: false,
        },
        {
          title: "Smart Hints",
          desc: "Stuck on a problem? Get contextual hints that guide you toward the solution without giving it away.",
          highlight: false,
        },
        {
          title: "Progress Tracking",
          desc: "Monitor completion rates, time spent, and performance across all categories. See your improvement over time.",
          highlight: false,
        },
        {
          title: "Class Management",
          desc: "Teachers can create classes, invite students with a code, and track individual and group progress.",
          highlight: false,
        },
        {
          title: "Certificates",
          desc: "Complete categories to earn certificates. Validate your SQL knowledge with shareable achievements.",
          highlight: false,
        },
        {
          title: "Works Offline",
          desc: "Everything runs locally. No internet connection needed once installed. Learn anywhere.",
          highlight: false,
        },
      ],
    },
    categories: {
      tag: "Curriculum",
      title: "Structured learning path",
      subtitle:
        "Progress through carefully designed categories from fundamentals to advanced topics.",
      items: [
        {
          name: "Basic Queries",
          tasks: "4 tasks",
          level: "Beginner",
          free: true,
        },
        {
          name: "Advanced Searching",
          tasks: "5 tasks",
          level: "Beginner",
          free: false,
        },
        {
          name: "Sorting and Limits",
          tasks: "4 tasks",
          level: "Beginner",
          free: false,
        },
        {
          name: "Complex Conditions",
          tasks: "5 tasks",
          level: "Intermediate",
          free: false,
        },
        {
          name: "Advanced Queries",
          tasks: "6 tasks",
          level: "Intermediate",
          free: false,
        },
        {
          name: "Subqueries",
          tasks: "5 tasks",
          level: "Intermediate",
          free: false,
        },
        {
          name: "Table Relationships",
          tasks: "5 tasks",
          level: "Intermediate",
          free: false,
        },
        {
          name: "Complex Joins",
          tasks: "6 tasks",
          level: "Advanced",
          free: false,
        },
        {
          name: "Aggregate Functions",
          tasks: "5 tasks",
          level: "Advanced",
          free: false,
        },
        { name: "SQL Theory", tasks: "4 tasks", level: "Theory", free: false },
      ],
    },
    howItWorks: {
      tag: "How it works",
      title: "Simple. Effective. Offline.",
      steps: [
        {
          num: "01",
          title: "Download & Install",
          desc: "Get the app for Windows, macOS, or Linux. No account required to start learning.",
        },
        {
          num: "02",
          title: "Choose a Category",
          desc: "Browse the curriculum and select a topic. Start with basics or jump to where you need practice.",
        },
        {
          num: "03",
          title: "Solve Tasks",
          desc: "Write SQL queries to solve real problems. Get instant feedback and use hints when needed.",
        },
        {
          num: "04",
          title: "Track Progress",
          desc: "See your completion rates, earn certificates, and identify areas for improvement.",
        },
      ],
    },
    faq: {
      tag: "FAQ",
      title: "Frequently asked questions",
      items: [
        {
          q: "Is ZooDB really free?",
          a: "The app is free to download and includes the Basic Queries category. Additional categories require a membership.",
        },
        {
          q: "Do I need an internet connection?",
          a: "No. Once installed, ZooDB works completely offline. The database and all tasks are stored locally.",
        },
        {
          q: "What SQL dialect does it teach?",
          a: "ZooDB uses SQLite, which follows standard SQL syntax. The skills you learn transfer to MySQL, PostgreSQL, and other databases.",
        },
        {
          q: "Can teachers track student progress?",
          a: "Yes. Teachers can create a class, share a join code with students, and view individual and aggregate progress.",
        },
        {
          q: "What platforms are supported?",
          a: "ZooDB runs on Windows, macOS, and Linux. It is built with Tauri for native performance on all platforms.",
        },
        {
          q: "How do I get support?",
          a: "Visit our GitHub repository to report issues or request features. Premium members get priority support.",
        },
      ],
    },
    testimonials: {
      tag: "Testimonials",
      title: "Loved by students and teachers",
      items: [
        {
          quote: "ZooDB made SQL finally click for me. The hands-on approach with a real database is so much better than just reading documentation.",
          author: "Martin K.",
          role: "Computer Science Student",
        },
        {
          quote: "I use ZooDB in my database courses. Students can practice at their own pace, and I can track their progress easily.",
          author: "Dr. Jana Nováková",
          role: "University Lecturer",
        },
        {
          quote: "The progressive difficulty is perfect. I started knowing nothing about SQL and now I can write complex queries with confidence.",
          author: "Petr S.",
          role: "Self-taught Developer",
        },
      ],
    },
    whyZooDB: {
      tag: "Why ZooDB?",
      title: "Built different",
      subtitle: "See how ZooDB compares to other SQL learning resources.",
      features: [
        { name: "Works offline", zoodb: true, others: false },
        { name: "Real database practice", zoodb: true, others: "Limited" },
        { name: "Progress tracking", zoodb: true, others: true },
        { name: "Class management", zoodb: true, others: false },
        { name: "Certificates", zoodb: true, others: "Premium only" },
        { name: "Instant feedback", zoodb: true, others: true },
        { name: "Desktop app", zoodb: true, others: false },
      ],
      labels: { zoodb: "ZooDB", others: "Online Platforms" },
    },
    download: {
      tag: "Download",
      title: "Start learning today",
      subtitle: "Free to download. No account required. Works offline.",
      platforms: {
        windows: "Windows",
        macos: "macOS",
        linux: "Linux",
      },
      version: "v0.0.1",
      requirements: "Requires 64-bit OS",
      features: {
        title: "What you get",
        items: [
          "Complete zoo database with real data",
          "26 structured lessons from basics to advanced",
          "68+ hands-on SQL tasks",
          "Instant feedback on your queries",
          "Progress tracking and certificates",
          "Works completely offline",
        ],
      },
      quickStart: {
        title: "Quick Start",
        steps: [
          "Download the installer for your platform",
          "Run the installer and follow the setup wizard",
          "Launch ZooDB and start with Basic Queries",
          "No registration or internet required",
        ],
      },
      systemRequirements: {
        title: "System Requirements",
        windows: "Windows 10 or later (64-bit)",
        macos: "macOS 11.0 or later",
        linux: "Linux with AppImage support",
        storage: "100 MB free disk space",
        ram: "4 GB RAM recommended",
      },
    },
    membership: {
      title: "Membership",
      description: "Choose the plan that fits your learning goals. Unlock all 26 lessons and master SQL.",
      currentPlan: "Current Plan",
      upgradePlan: "Upgrade Your Plan",
      downgradePlan: "Downgrade Your Plan",
      betterPlan: "You already have a better plan",
      free: {
        name: "Free",
        price: "$0",
        description: "Perfect for getting started with SQL basics",
        features: {
          categories: "3 lessons (first 3 categories)",
          tasks: "Basic SQL queries only",
          support: "Community forum access",
          updates: "Local database storage",
        },
      },
      zoo: {
        name: "Zoo",
        price: "$9.99",
        period: "per month",
        description: "Unlock all 26 lessons with flexible monthly billing",
        features: {
          categories: "All 26 lessons unlocked (+23 more)",
          tasks: "Unlimited SQL queries",
          support: "Discord support",
          updates: "Progress sync across devices",
          hints: "Monthly SQL challenges",
          progress: "Advanced progress tracking",
          certificates: "Certificate of completion",
          earlyAccess: "Early access to new features",
        },
        popular: "Most Popular",
      },
      zooPlus: {
        name: "Zoo+",
        price: "$99",
        period: "per year",
        description: "Best value! Save 2 months compared to monthly billing",
        features: {
          categories: "All 26 lessons unlocked",
          tasks: "Unlimited SQL queries",
          support: "Premium discord support",
          updates: "Early access to new features",
          hints: "Exclusive bonus lessons",
          progress: "Advanced progress tracking",
          certificates: "Certificate of completion",
          lifetime: "2 months FREE vs monthly",
          noBilling: "Lifetime updates within year",
        },
        badge: "Best Value",
      },
      perks: "Key Benefits",
      getStarted: "Get Started",
      comingSoon: "Payments coming soon. Stay tuned!",
      becomeMember: "Become a Member",
      activateLicense: "Activate License",
      premiumFeature: "Premium Feature",
      sqlEditorPremium: "The SQL Editor is available for Zoo and Zoo+ members. Upgrade your plan to unlock this feature.",
      viewPlans: "View Plans",
    },
    footer: {
      tagline: "Learn SQL by doing.",
      sections: {
        product: {
          title: "Product",
          links: ["Features", "Download", "Pricing"],
        },
        resources: {
          title: "Resources",
          links: ["Documentation", "FAQ", "Support"],
        },
        legal: {
          title: "Legal",
          links: ["Privacy", "Terms"],
        },
      },
      copy: "2025 ZooDB. All rights reserved.",
    },
  },
  cz: {
    nav: { features: "Funkce", download: "Stahnout", faq: "FAQ", documentation: "Dokumentace", support: "Podpora" },
    hero: {
      tag: "Vzdelavaci software",
      title: "Naucte se SQL",
      titleHighlight: "interaktivne.",
      subtitle:
        "Desktopova aplikace navrzena pro studenty k zvladnuti SQL prostrednictvim prakticke prace s realnou databazi zoo. Sledujte pokrok, ziskavejte certifikaty a ucte se vlastnim tempem.",
      cta: "Stahnout zdarma",
      secondary: "Zobrazit zdroj",
    },
    stats: {
      items: [
        { value: "26", label: "Lekci" },
        { value: "68+", label: "Ukolu" },
        { value: "3", label: "Platformy" },
      ],
    },
    features: {
      tag: "Funkce",
      title: "Vse, co potrebujete k zvladnuti SQL",
      subtitle:
        "Vytvoreno pro studenty a ucitele, kteri chteji strukturovany, prakticky zazitky z uceni.",
      items: [
        {
          title: "Realna databaze",
          desc: "Cvicte s kompletni databazi zoo obsahujici zvirata, osetrovatele, typy a vztahy. Zadne nastavovani.",
          highlight: true,
        },
        {
          title: "Postupna obtiznost",
          desc: "Zacnete se zakladnimi SELECT dotazy a pokracujte pres joiny, poddotazy, agregace a slozite vztahy.",
          highlight: false,
        },
        {
          title: "Okamzita zpetna vazba",
          desc: "Spustte dotazy a okamzite vidte vysledky. Pochopte, co funguje a co je potreba zlepsit.",
          highlight: false,
        },
        {
          title: "Chytre napovedy",
          desc: "Zastavili jste se u problemu? Ziskejte kontextove napovedy, ktere vas vedou k reseni bez jeho prozrazeni.",
          highlight: false,
        },
        {
          title: "Sledovani pokroku",
          desc: "Sledujte miru dokonceni, straveny cas a vykon ve vsech kategoriich. Vidte sve zlepseni v case.",
          highlight: false,
        },
        {
          title: "Sprava trid",
          desc: "Ucitele mohou vytvaret tridy, zvat studenty pomoci kodu a sledovat individualni i skupinovy pokrok.",
          highlight: false,
        },
        {
          title: "Certifikaty",
          desc: "Dokoncete kategorie a ziskejte certifikaty. Overujte sve SQL znalosti se sdilitelnymi uspechy.",
          highlight: false,
        },
        {
          title: "Funguje offline",
          desc: "Vse bezi lokalne. Po instalaci neni potreba internetove pripojeni. Ucte se kdekoli.",
          highlight: false,
        },
      ],
    },
    categories: {
      tag: "Osnova",
      title: "Strukturovana cesta ucenim",
      subtitle:
        "Postupujte pres pecilive navrzene kategorie od zakladu k pokrocilym tematum.",
      items: [
        {
          name: "Zakladni dotazy",
          tasks: "4 ukoly",
          level: "Zacatecnik",
          free: true,
        },
        {
          name: "Pokrocile hledani",
          tasks: "5 ukolu",
          level: "Zacatecnik",
          free: false,
        },
        {
          name: "Razeni a limity",
          tasks: "4 ukoly",
          level: "Zacatecnik",
          free: false,
        },
        {
          name: "Slozite podminky",
          tasks: "5 ukolu",
          level: "Stredni",
          free: false,
        },
        {
          name: "Pokrocile dotazy",
          tasks: "6 ukolu",
          level: "Stredni",
          free: false,
        },
        { name: "Poddotazy", tasks: "5 ukolu", level: "Stredni", free: false },
        {
          name: "Vztahy tabulek",
          tasks: "5 ukolu",
          level: "Stredni",
          free: false,
        },
        {
          name: "Slozite joiny",
          tasks: "6 ukolu",
          level: "Pokrocily",
          free: false,
        },
        {
          name: "Agregacni funkce",
          tasks: "5 ukolu",
          level: "Pokrocily",
          free: false,
        },
        { name: "SQL teorie", tasks: "4 ukoly", level: "Teorie", free: false },
      ],
    },
    howItWorks: {
      tag: "Jak to funguje",
      title: "Jednoduche. Efektivni. Offline.",
      steps: [
        {
          num: "01",
          title: "Stahnete a nainstalujte",
          desc: "Ziskejte aplikaci pro Windows, macOS nebo Linux. K uceni neni potreba ucet.",
        },
        {
          num: "02",
          title: "Vyberte kategorii",
          desc: "Prochazejte osnovu a vyberte tema. Zacnete se zaklady nebo skocte tam, kde potrebujete cvicit.",
        },
        {
          num: "03",
          title: "Resit ukoly",
          desc: "Piste SQL dotazy k reseni realnych problemu. Ziskejte okamzitou zpetnou vazbu a pouzivejte napovedy.",
        },
        {
          num: "04",
          title: "Sledujte pokrok",
          desc: "Vidte miru dokonceni, ziskavejte certifikaty a identifikujte oblasti ke zlepseni.",
        },
      ],
    },
    faq: {
      tag: "FAQ",
      title: "Casto kladene otazky",
      items: [
        {
          q: "Je ZooDB opravdu zdarma?",
          a: "Aplikace je zdarma ke stazeni a obsahuje kategorii Zakladni dotazy. Dalsi kategorie vyzaduji clenstvi.",
        },
        {
          q: "Potrebuji internetove pripojeni?",
          a: "Ne. Po instalaci ZooDB funguje zcela offline. Databaze a vsechny ukoly jsou ulozeny lokalne.",
        },
        {
          q: "Jaky SQL dialekt uci?",
          a: "ZooDB pouziva SQLite, ktery nasleduje standardni SQL syntaxi. Dovednosti se prenasi na MySQL, PostgreSQL a dalsi databaze.",
        },
        {
          q: "Mohou ucitele sledovat pokrok studentu?",
          a: "Ano. Ucitele mohou vytvorit tridu, sdilet kod pro pripojeni se studenty a zobrazit individualni i souhrnny pokrok.",
        },
        {
          q: "Jake platformy jsou podporovany?",
          a: "ZooDB bezi na Windows, macOS a Linux. Je postaven s Tauri pro nativni vykon na vsech platformach.",
        },
        {
          q: "Jak ziskam podporu?",
          a: "Navstivte nas GitHub repozitar pro nahlaseni problemu nebo pozadavky na funkce. Premioví clenove maji prioritni podporu.",
        },
      ],
    },
    testimonials: {
      tag: "Reference",
      title: "Oblíbené studenty a učiteli",
      items: [
        {
          quote: "ZooDB mi konečně pomohlo pochopit SQL. Praktický přístup s reálnou databází je mnohem lepší než jen čtení dokumentace.",
          author: "Martin K.",
          role: "Student informatiky",
        },
        {
          quote: "Používám ZooDB ve svých kurzech databází. Studenti mohou cvičit vlastním tempem a já mohu snadno sledovat jejich pokrok.",
          author: "Dr. Jana Nováková",
          role: "Vysokoškolský lektor",
        },
        {
          quote: "Postupná obtížnost je perfektní. Začal jsem neznaje nic o SQL a teď píšu složité dotazy s jistotou.",
          author: "Petr S.",
          role: "Samouk vývojář",
        },
      ],
    },
    whyZooDB: {
      tag: "Proč ZooDB?",
      title: "Jinak postavené",
      subtitle: "Podívejte se, jak se ZooDB srovnává s jinými zdroji pro učení SQL.",
      features: [
        { name: "Funguje offline", zoodb: true, others: false },
        { name: "Praxe s reálnou databází", zoodb: true, others: "Omezené" },
        { name: "Sledování pokroku", zoodb: true, others: true },
        { name: "Správa tříd", zoodb: true, others: false },
        { name: "Certifikáty", zoodb: true, others: "Pouze premium" },
        { name: "Okamžitá zpětná vazba", zoodb: true, others: true },
        { name: "Desktopová aplikace", zoodb: true, others: false },
      ],
      labels: { zoodb: "ZooDB", others: "Online platformy" },
    },
    download: {
      tag: "Stahnout",
      title: "Zacnete se ucit dnes",
      subtitle: "Zdarma ke stazeni. Bez potreby uctu. Funguje offline.",
      platforms: {
        windows: "Windows",
        macos: "macOS",
        linux: "Linux",
      },
      version: "v0.0.1",
      requirements: "Vyzaduje 64bitovy OS",
      features: {
        title: "Co ziskate",
        items: [
          "Kompletni databaze zoo s realnymi daty",
          "26 strukturovanych lekcí od zakladu k pokrocilym",
          "68+ praktickych SQL ukolu",
          "Okamzita zpetna vazba na vase dotazy",
          "Sledovani pokroku a certifikaty",
          "Funguje zcela offline",
        ],
      },
      quickStart: {
        title: "Rychly Start",
        steps: [
          "Stahnete instalacni soubor pro vasu platformu",
          "Spustte instalacni program a postupujte podle navodu",
          "Spustte ZooDB a zacnete se zakladnimi dotazy",
          "Zadna registrace ani internet neni potreba",
        ],
      },
      systemRequirements: {
        title: "Systemove Pozadavky",
        windows: "Windows 10 nebo novejsi (64-bit)",
        macos: "macOS 11.0 nebo novejsi",
        linux: "Linux s podporou AppImage",
        storage: "100 MB volneho misto na disku",
        ram: "4 GB RAM doporuceno",
      },
    },
    membership: {
      title: "Členství",
      description: "Vyberte si plán, který odpovídá vašim cílům. Odemkněte všech 26 lekcí a ovládněte SQL.",
      currentPlan: "Aktuální Plán",
      upgradePlan: "Upgradovat Plán",
      downgradePlan: "Downgradovat Plán",
      betterPlan: "Už máte lepší plán",
      free: {
        name: "Zdarma",
        price: "0 Kč",
        description: "Ideální pro začátek s SQL základy",
        features: {
          categories: "3 lekce (první 3 kategorie)",
          tasks: "Pouze základní SQL dotazy",
          support: "Přístup ke komunitnímu fóru",
          updates: "Lokální databázové úložiště",
        },
      },
      zoo: {
        name: "Zoo",
        price: "249 Kč",
        period: "za měsíc",
        description: "Odemkněte všech 26 lekcí s flexibilní měsíční fakturací",
        features: {
          categories: "Všech 26 lekcí odemčeno (+23 dalších)",
          tasks: "Neomezené SQL dotazy",
          support: "Discord podpora",
          updates: "Synchronizace pokroku mezi zařízeními",
          hints: "Měsíční SQL výzvy",
          progress: "Pokročilé sledování pokroku",
          certificates: "Certifikát o dokončení",
          earlyAccess: "Předčasný přístup k novým funkcím",
        },
        popular: "Nejoblíbenější",
      },
      zooPlus: {
        name: "Zoo+",
        price: "2 490 Kč",
        period: "za rok",
        description: "Nejlepší hodnota! Ušetřete 2 měsíce oproti měsíční fakturaci",
        features: {
          categories: "Všech 26 lekcí odemčeno",
          tasks: "Neomezené SQL dotazy",
          support: "Prémiová Discord podpora",
          updates: "Předčasný přístup k novým funkcím",
          hints: "Exkluzivní bonusové lekce",
          progress: "Pokročilé sledování pokroku",
          certificates: "Certifikát o dokončení",
          lifetime: "2 měsíce ZDARMA oproti měsíční platbě",
          noBilling: "Celoroční aktualizace v ceně",
        },
        badge: "Nejlepší Hodnota",
      },
      perks: "Klíčové Výhody",
      getStarted: "Začít",
      comingSoon: "Platby již brzy. Zůstaňte naladěni!",
      becomeMember: "Stát se členem",
      activateLicense: "Aktivovat Licenci",
      premiumFeature: "Prémiová Funkce",
      sqlEditorPremium: "SQL Editor je dostupný pro členy Zoo a Zoo+. Upgradujte svůj plán pro odemknutí této funkce.",
      viewPlans: "Zobrazit Plány",
    },
    footer: {
      tagline: "Ucte se SQL praci.",
      sections: {
        product: {
          title: "Produkt",
          links: ["Funkce", "Stahnout", "Cenik"],
        },
        resources: {
          title: "Zdroje",
          links: ["Dokumentace", "FAQ", "Podpora"],
        },
        legal: {
          title: "Pravni",
          links: ["Soukromi", "Podminky"],
        },
      },
      copy: "2025 ZooDB. Vsechna prava vyhrazena.",
    },
  },
};

const Icons = {
  windows: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 5.5L10 4.5V11H3V5.5ZM3 18.5L10 19.5V13H3V18.5ZM11 19.6L21 21V13H11V19.6ZM11 4.4V11H21V3L11 4.4Z" />
    </svg>
  ),
  apple: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.1 22C7.79 22.05 6.8 20.68 5.96 19.47C4.25 17 2.94 12.45 4.7 9.39C5.57 7.87 7.13 6.91 8.82 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z" />
    </svg>
  ),
  linux: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.5 2C11.03 2 9.78 3.12 9.38 4.61L9.2 5.22C9.04 5.81 8.79 6.31 8.38 6.68C7.82 7.18 7.63 7.93 7.63 8.68C7.63 9.23 7.82 9.78 8.08 10.23C7.53 10.53 7.16 10.88 6.93 11.31C6.53 12.04 6.63 12.96 7.16 13.6C7.04 13.96 6.88 14.35 6.63 14.73C5.79 16.08 4.88 18.21 5.96 19.71C6.33 20.25 6.88 20.62 7.5 20.8C8.03 20.95 8.6 20.97 9.13 20.81C9.65 20.65 10.12 20.35 10.5 19.95C10.85 19.57 11.15 19.12 11.38 18.62C11.59 18.17 11.74 17.68 11.82 17.17C11.91 17.18 12 17.18 12.09 17.18C12.22 17.18 12.35 17.17 12.47 17.15C12.55 17.68 12.71 18.2 12.95 18.67C13.18 19.15 13.48 19.59 13.83 19.95C14.21 20.35 14.68 20.65 15.2 20.81C15.73 20.97 16.3 20.95 16.83 20.8C17.45 20.62 18 20.25 18.37 19.71C19.45 18.21 18.54 16.08 17.7 14.73C17.45 14.35 17.29 13.96 17.17 13.6C17.7 12.96 17.8 12.04 17.4 11.31C17.17 10.88 16.8 10.53 16.25 10.23C16.51 9.78 16.7 9.23 16.7 8.68C16.7 7.93 16.51 7.18 15.95 6.68C15.54 6.31 15.29 5.81 15.13 5.22L14.95 4.61C14.55 3.12 13.3 2 11.83 2H12.5ZM12 4C12.55 4 13 4.45 13 5C13 5.55 12.55 6 12 6C11.45 6 11 5.55 11 5C11 4.45 11.45 4 12 4Z" />
    </svg>
  ),
  download: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
    </svg>
  ),
  github: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
    </svg>
  ),
  check: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  ),
  chevron: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  ),
  sun: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  ),
  moon: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  ),
};

export default function App() {
  // Lazy state initialization for theme (could read from localStorage in future)
  const [lang, setLang] = useState<"en" | "cz">(() => {
    // Could read from localStorage here if needed
    return "en";
  });
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    // Could read from localStorage here if needed
    return "dark";
  });
  const t = translations[lang];

  // Functional setState to prevent stale closures (rerender-functional-setstate)
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

  // Memoize theme classes to prevent recreation on every render (rendering-hoist-jsx)
  const themeClasses = useMemo(() => ({
    bg: theme === "dark" ? "bg-[#0a0a0a]" : "bg-white",
    text: theme === "dark" ? "text-[#fafafa]" : "text-[#0a0a0a]",
    textSecondary: theme === "dark" ? "text-[#a1a1a1]" : "text-[#666]",
    textMuted: theme === "dark" ? "text-[#999]" : "text-[#888]",
    border: theme === "dark" ? "border-white/10" : "border-black/10",
    borderLight: theme === "dark" ? "border-white/5" : "border-black/5",
    bgNav: theme === "dark" ? "bg-[#0a0a0a]/80" : "bg-white/80",
    bgCard: theme === "dark" ? "bg-white/2" : "bg-black/2",
    bgCardHover: theme === "dark" ? "bg-white/5" : "bg-black/5",
    bgBadge: theme === "dark" ? "bg-white/5" : "bg-black/5",
    hoverText: theme === "dark" ? "hover:text-white" : "hover:text-black",
    hoverBg: theme === "dark" ? "hover:bg-white/5" : "hover:bg-black/5",
    separator: theme === "dark" ? "text-[#666]" : "text-[#999]",
    accent: theme === "dark" ? "text-[#ffe0c2]" : "text-[#e6c9a8]",
  }), [theme]);

  return (
    <div className={`min-h-screen w-full ${themeClasses.bg} ${themeClasses.text}`}>
      {/* Navigation */}
      <nav className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 ${themeClasses.bgNav} backdrop-blur-xl ${themeClasses.border} rounded-full px-8 shadow-lg`}>
        <div className="h-14 flex items-center justify-center gap-8">
          <a
            href="#download"
            className={`text-sm ${themeClasses.textSecondary} ${themeClasses.hoverText} transition-colors`}
          >
            {t.nav.features}
          </a>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-sm ${themeClasses.textSecondary} ${themeClasses.hoverText} transition-colors`}
          >
            {t.nav.documentation}
          </a>
          <a
            href="#download"
            className={`text-sm ${themeClasses.textSecondary} ${themeClasses.hoverText} transition-colors`}
          >
            {t.nav.support}
          </a>
          <Button
            asChild
            size="sm"
            className={theme === "dark" ? "bg-white text-black hover:bg-white/90 font-medium" : "bg-black text-white hover:bg-black/90 font-medium"}
          >
            <a href="#download">{t.nav.download}</a>
          </Button>
          <span className={themeClasses.separator}>|</span>
          <button
            onClick={() => setLang((prevLang) => (prevLang === "en" ? "cz" : "en"))}
            className={`text-sm ${themeClasses.textSecondary} ${themeClasses.hoverText} transition-colors`}
          >
            {lang === "en" ? "CZ" : "EN"}
          </button>
          <button
            onClick={toggleTheme}
            className={`${themeClasses.textSecondary} ${themeClasses.hoverText} transition-colors`}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? Icons.sun : Icons.moon}
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Title and Content */}
            <div>
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${themeClasses.bgBadge} ${themeClasses.border} text-xs ${themeClasses.textSecondary} mb-6`}>
                {t.hero.tag}
              </div>
              <h1 className={`text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6 ${themeClasses.text}`}>
                {t.hero.title}
                <br />
                <span className={themeClasses.accent}>{t.hero.titleHighlight}</span>
              </h1>
              <p className={`text-lg sm:text-xl ${themeClasses.textSecondary} leading-relaxed mb-10`}>
                {t.hero.subtitle}
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <Button
                  asChild
                  size="lg"
                  className={theme === "dark" ? "bg-white text-black hover:bg-white/90 font-medium gap-2 h-12 px-6" : "bg-black text-white hover:bg-black/90 font-medium gap-2 h-12 px-6"}
                >
                  <a href="#download">
                    {Icons.download}
                    {t.hero.cta}
                  </a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className={`${themeClasses.border} bg-transparent ${themeClasses.hoverBg} ${theme === "dark" ? "hover:text-white" : "hover:text-black"} font-medium gap-2 h-12 px-6 ${themeClasses.textSecondary}`}
                >
                  <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
                    {Icons.github}
                    {t.hero.secondary}
                  </a>
                </Button>
              </div>
            </div>

            {/* Right side - Image */}
            <div className={`relative rounded-xl ${themeClasses.border} overflow-hidden ${theme === "dark" ? "shadow-2xl shadow-black/50" : "shadow-2xl shadow-black/20"} scale-110`}>
              <img
                src="/images/main_image.png"
                alt="ZooDB Application"
                className="w-full h-auto"
              />
            </div>
          </div>

          {/* Stats */}
          <div className={`flex flex-wrap gap-8 sm:gap-16 mt-16 pt-8 ${themeClasses.borderLight} justify-center`}>
            {t.stats.items.map((stat, i) => (
              <div key={i} className="text-center">
                <div className={`text-3xl sm:text-4xl font-bold ${themeClasses.accent}`}>
                  {stat.value}
                </div>
                <div className={`text-sm ${themeClasses.textSecondary} mt-1`}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Download */}
      <section
        id="download"
        className={`py-32 px-6 ${themeClasses.borderLight}`}
      >
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-20">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${themeClasses.bgBadge} ${themeClasses.border} text-xs ${themeClasses.textSecondary} mb-8`}>
              {t.download.tag}
            </div>
            <h2 className={`text-5xl sm:text-6xl font-bold tracking-tight mb-6 ${themeClasses.text}`}>
              {t.download.title}
            </h2>
            <p className={`text-xl sm:text-2xl ${themeClasses.textSecondary} max-w-3xl mx-auto leading-relaxed`}>
              {t.download.subtitle}
            </p>
          </div>

          {/* Download Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto mb-20">
            {[
              {
                icon: Icons.windows,
                name: t.download.platforms.windows,
                link: DOWNLOAD_LINKS.windows,
                ext: ".exe",
              },
              {
                icon: Icons.apple,
                name: t.download.platforms.macos,
                link: DOWNLOAD_LINKS.macos,
                ext: ".dmg",
              },
              {
                icon: Icons.linux,
                name: t.download.platforms.linux,
                link: DOWNLOAD_LINKS.linux,
                ext: ".AppImage",
              },
            ].map((platform, i) => (
              <a key={i} href={platform.link} className="group">
                <Card className={`${themeClasses.bgCard} ${themeClasses.border} ${themeClasses.hoverBg} ${theme === "dark" ? "hover:border-white/20" : "hover:border-black/20"} transition-all h-full ${themeClasses.text}`}>
                  <CardContent className="p-12 flex flex-col items-center gap-6">
                    <div className={`${themeClasses.text} ${theme === "dark" ? "group-hover:text-[#ffe0c2]" : "group-hover:text-[#e6c9a8]"} transition-colors scale-150`}>
                      {platform.icon}
                    </div>
                    <div className={`text-center ${themeClasses.text}`}>
                      <div className={`font-semibold text-xl mb-2 ${themeClasses.text}`}>{platform.name}</div>
                      <div className={`text-sm ${themeClasses.textSecondary} font-mono`}>
                        {platform.ext}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* What you get */}
            <div>
              <h3 className={`text-2xl font-bold ${themeClasses.text} mb-6`}>{t.download.features.title}</h3>
              <ul className="space-y-4">
                {t.download.features.items.map((item, i) => (
                  <li key={i} className={`flex items-start gap-3 ${themeClasses.textSecondary}`}>
                    <span className={`${themeClasses.accent} mt-1`}>{Icons.check}</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Start */}
            <div>
              <h3 className={`text-2xl font-bold ${themeClasses.text} mb-6`}>{t.download.quickStart.title}</h3>
              <ol className="space-y-4">
                {t.download.quickStart.steps.map((step, i) => (
                  <li key={i} className={`flex items-start gap-3 ${themeClasses.textSecondary}`}>
                    <span className={`flex-shrink-0 w-6 h-6 rounded-full ${themeClasses.bgBadge} ${themeClasses.border} flex items-center justify-center text-sm ${themeClasses.accent} font-semibold`}>
                      {i + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* System Requirements */}
          <div className={`rounded-xl ${themeClasses.border} ${themeClasses.bgCard} p-8 mb-12`}>
            <h3 className={`text-2xl font-bold ${themeClasses.text} mb-6`}>{t.download.systemRequirements.title}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <div className={`text-sm ${themeClasses.textMuted} mb-1`}>{t.download.platforms.windows}</div>
                <div className={themeClasses.textSecondary}>{t.download.systemRequirements.windows}</div>
              </div>
              <div>
                <div className={`text-sm ${themeClasses.textMuted} mb-1`}>{t.download.platforms.macos}</div>
                <div className={themeClasses.textSecondary}>{t.download.systemRequirements.macos}</div>
              </div>
              <div>
                <div className={`text-sm ${themeClasses.textMuted} mb-1`}>{t.download.platforms.linux}</div>
                <div className={themeClasses.textSecondary}>{t.download.systemRequirements.linux}</div>
              </div>
              <div>
                <div className={`text-sm ${themeClasses.textMuted} mb-1`}>{lang === "en" ? "Storage" : "Úložiště"}</div>
                <div className={themeClasses.textSecondary}>{t.download.systemRequirements.storage}</div>
              </div>
              <div>
                <div className={`text-sm ${themeClasses.textMuted} mb-1`}>RAM</div>
                <div className={themeClasses.textSecondary}>{t.download.systemRequirements.ram}</div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className={`py-12 px-6 ${themeClasses.borderLight}`}>
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <div className={`font-semibold text-lg ${themeClasses.text}`}>ZooDB</div>
              <p className={`text-sm ${themeClasses.textMuted}`}>{t.footer.tagline}</p>
            </div>
            <div className="flex items-center gap-6">
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={`${themeClasses.textMuted} ${themeClasses.hoverText} transition-colors`}
              >
                {Icons.github}
              </a>
              <p className={`text-sm ${themeClasses.textMuted}`}>{t.footer.copy}</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
