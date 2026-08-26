(function () {
  const source = window.PORTFOLIO_DATA || { webWorks: [], behance: [] };
  const asset = (path) => String(path || "").replace(/^NierZooM-v3\//, "");

  const titles = {
    "web-greattop": "Greattop Technology",
    "web-matsuo": "Matsuo Corporate Website",
    "web-hikariro": "HikariRO",
    "behance-216540203": "Event Logotype Design",
    "behance-140949083": "Color Contact Lens",
    "behance-139335911": "Eyewear Landing Page",
    "behance-139328113": "Color Contrast Lens",
    "behance-136767675": "Marketlong Fresh",
    "behance-125424853": "Wood Music Box",
    "behance-124789997": "Banner & Illustration",
    "behance-123483253": "Product Photography",
    "behance-123101167": "Baby Body Wash",
    "behance-121241289": "Collagen Packaging",
    "behance-121306305": "Master Tai Chicken Essence",
    "behance-121143993": "Visual Landing Page",
    "behance-120740315": "IC Studio",
    "behance-117426693": "Narrate",
  };

  const details = {
    "behance-216540203": ["01.jpg", "02.jpg", "03.jpg", "04.jpg", "05.jpg", "06.jpg"].map((name) => asset(`assets/projects/04-event-logotype/${name}`)),
    "behance-140949083": ["01.jpg", "02.jpg", "03.jpg", "04.jpg", "05.jpg", "06.jpg"].map((name) => asset(`assets/projects/05-color-contact-lens/${name}`)),
    "behance-139328113": ["01.jpg", "02.jpg", "03.jpg", "04.jpg", "05.jpg"].map((name) => asset(`assets/projects/06-color-contrast-lens/${name}`)),
    "behance-136767675": [
      "馬農生鮮_LOGO_文青版_工作區域 1.jpg",
      "馬農生鮮_LOGO打凹MOCKUP.jpg",
      "馬農生鮮_LOGO蔬果盒展示MOCKUP.jpg",
      "Business Card with Hand Mockup.jpg",
      "free clear plastic food packaging mockup.jpg",
    ].map((name) => asset(`assets/projects/07-marketlong-fresh/${name}`)),
    "behance-123483253": ["01.jpg", "02.jpg", "03.jpg", "04.jpg", "05.jpg", "A01.jpg", "A02.jpg", "A03.jpg"].map((name) => asset(`assets/projects/08-product-photography/${name}`)),
    "behance-123101167": [
      "0807嬰兒沐浴_導購頁_工作區域 1 複本.jpg",
      "0807嬰兒沐浴_導購頁_工作區域 1 複本 3.jpg",
      "0807嬰兒沐浴_導購頁_工作區域 1 複本 4.jpg",
      "0807嬰兒沐浴_導購頁-07.jpg",
    ].map((name) => asset(`assets/projects/09-baby-body-wash/${name}`)),
    "behance-121241289": ["AD6C1649.jpg", "AD6C1677.jpg", "AD6C1695.jpg", "AD6C1742.jpg"].map((name) => asset(`assets/projects/10-collagen-packaging/${name}`)),
    "behance-121306305": [
      "太師傅包裝合成_0610.jpg",
      "太師傅包裝合成_紙盒_單.jpg",
      "太師傅包裝合成_紙盒_雙.jpg",
      "太師傅紙袋合成_漂浮.jpg",
      "太師傅鋁袋合成.jpg",
    ].map((name) => asset(`assets/projects/11-master-tai/${name}`)),
    "behance-120740315": ["IC_封面_工作區域 1.jpg", "LOGO_GRIDE-01.jpg", "Business-Card-Mockup_IC.jpg", "Mockup.jpg", "吊卡.jpg"].map((name) => asset(`assets/projects/13-ic-studio/${name}`)),
    "behance-117426693": ["LOGO_0410-01.jpg", "LOGO_0410-02.jpg", "LOGO1.jpg", "名片04.jpg", "unnamed.jpg"].map((name) => asset(`assets/projects/14-narrate/${name}`)),
  };

  const projectMedia = (folder, files) => files.map((file) => asset(`assets/projects/${folder}/${file}`));

  // Keep this registry aligned with the current numbered project folders.
  Object.assign(details, {
    "behance-216540203": projectMedia("04-event-logotype", ["01.jpg", "02.jpg", "03.jpg", "04.jpg", "05.jpg", "06.jpg", "07.jpg", "08.jpg", "09.jpg", "COVER.png"]),
    "behance-140949083": projectMedia("05-color-contact-lens", ["01.jpg", "02.jpg", "03.jpg", "04.jpg", "05.jpg", "06.jpg"]),
    "behance-139328113": projectMedia("06-color-contrast-lens", ["01.jpg", "02.jpg", "03.jpg", "04.jpg", "05.jpg", "video.mp4"]),
    "behance-136767675": projectMedia("07-marketlong-fresh", ["馬農生鮮_LOGO_文青版-02.jpg", "馬農生鮮_LOGO_文青版-03.jpg", "馬農生鮮_LOGO_文青版-04.jpg", "馬農生鮮_LOGO_文青版-04-2-04.jpg", "馬農生鮮_LOGO_文青版-05.jpg", "馬農生鮮_LOGO_文青版-06.jpg", "馬農生鮮_LOGO_文青版-07.jpg", "馬農生鮮_LOGO_文青版_工作區域 1.jpg", "馬農生鮮_LOGO打凹MOCKUP.jpg", "馬農生鮮_LOGO蔬果盒展示MOCKUP.jpg", "馬農生鮮_文青版名片-09.jpg", "馬農生鮮_文青版名片-10.jpg", "Business Card with Hand Mockup.jpg", "free clear plastic food packaging mockup.jpg", "Mockup.jpg"]),
    "behance-123483253": projectMedia("08-product-photography", ["01.jpg", "02.jpg", "03.jpg", "04.jpg", "05.jpg", "06.jpg", "A01.jpg", "A02.jpg", "A03.jpg", "A04.jpg", "B001.jpg", "CHLOE情境圖01.jpg", "DSC_0527_修.jpg", "RB3680情境.jpg", "ST55185541002情境圖.jpg", "ST55185541003情境圖.jpg"]),
    "behance-123101167": projectMedia("09-baby-body-wash", ["0807嬰兒沐浴_導購頁_工作區域 1 複本.jpg", "0807嬰兒沐浴_導購頁_工作區域 1 複本 3.jpg", "0807嬰兒沐浴_導購頁_工作區域 1 複本 4.jpg", "0807嬰兒沐浴_導購頁_工作區域 1 複本 5.jpg", "0807嬰兒沐浴_導購頁_工作區域 1 複本 6.jpg", "0807嬰兒沐浴_導購頁_工作區域 1 複本 7.jpg", "0807嬰兒沐浴_導購頁-07.jpg", "0807嬰兒沐浴_導購頁-08.jpg"]),
    "behance-121241289": projectMedia("10-collagen-packaging", ["00.png", "01.png", "AD6C1649.jpg", "AD6C1677.jpg", "AD6C1695.jpg", "AD6C1742.jpg", "NARRATE_鋁袋_0908-02.png", "產品3D模型_單包2PNG.png", "單包_側01.png", "單包側.png"]),
    "behance-121306305": projectMedia("11-master-tai", ["太師傅包裝合成_0610.jpg", "太師傅包裝合成_紙盒_掉落_0627.jpg", "太師傅包裝合成_紙盒_單.jpg", "太師傅包裝合成_紙盒_雙.jpg", "太師傅紙袋合成_0610.jpg", "太師傅紙袋合成_漂浮.jpg", "太師傅紙袋合成03.jpg", "太師傅網頁用A01-01-01.jpg", "太師傅網頁用A01-01-02-02.jpg", "太師傅鋁袋合成.jpg", "太師傅鋁袋合成_掉落.jpg"]),
    "behance-120740315": projectMedia("13-ic-studio", ["IC_封面_工作區域 1.jpg", "IC_封面_工作區域 1 複本.jpg", "LOGO_GRIDE-01.jpg", "LOGO_GRIDE-02.jpg", "LOGO_GRIDE-03.jpg", "Business-Card-Mockup_IC.jpg", "Mockup.jpg", "NEWShopping Bag PSD MockUp 2.jpg", "Shopping Bag PSD MockUp 2.jpg", "ALLbranding psd mockup.jpg", "paper.jpg", "吊卡.jpg", "4.jpg", "5-2.jpg"]),
    "behance-117426693": projectMedia("14-narrate", ["Webp.net-gifmaker.gif", "LOGO_0410-01.jpg", "LOGO_0410-02.jpg", "LOGO_0410-03.jpg", "LOGO_0410-04.jpg", "LOGO_0410-05.jpg", "LOGO_0410-06.jpg", "LOGO1.jpg", "LOGO2.jpg", "LOGO3.jpg", "名片04.jpg", "unnamed.jpg"]),
  });

  // Use the current filenames from the numbered project folders, including names in Chinese.
  Object.assign(details, {
    "behance-136767675": projectMedia("07-marketlong-fresh", [
      "馬農生鮮_LOGO_文青版-02.jpg", "馬農生鮮_LOGO_文青版-03.jpg", "馬農生鮮_LOGO_文青版-04.jpg",
      "馬農生鮮_LOGO_文青版-04-2-04.jpg", "馬農生鮮_LOGO_文青版-05.jpg", "馬農生鮮_LOGO_文青版-06.jpg",
      "馬農生鮮_LOGO_文青版-07.jpg", "馬農生鮮_LOGO_文青版_工作區域 1.jpg", "馬農生鮮_LOGO打凹MOCKUP.jpg",
      "馬農生鮮_LOGO蔬果盒展示MOCKUP.jpg", "馬農生鮮_文青版名片-09.jpg", "馬農生鮮_文青版名片-10.jpg",
      "Business Card with Hand Mockup.jpg", "free clear plastic food packaging mockup.jpg", "Mockup.jpg",
    ]),
    "behance-123483253": projectMedia("08-product-photography", [
      "01.jpg", "02.jpg", "03.jpg", "04.jpg", "05.jpg", "06.jpg", "A01.jpg", "A02.jpg", "A03.jpg", "A04.jpg", "B001.jpg",
      "CHLOE情境圖01.jpg", "DSC_0527_修.jpg", "RB3680情境.jpg", "ST55185541002情境圖.jpg", "ST55185541003情境圖.jpg",
    ]),
    "behance-123101167": projectMedia("09-baby-body-wash", [
      "0807嬰兒沐浴_導購頁_工作區域 1 複本.jpg", "0807嬰兒沐浴_導購頁_工作區域 1 複本 3.jpg",
      "0807嬰兒沐浴_導購頁_工作區域 1 複本 4.jpg", "0807嬰兒沐浴_導購頁_工作區域 1 複本 5.jpg",
      "0807嬰兒沐浴_導購頁_工作區域 1 複本 6.jpg", "0807嬰兒沐浴_導購頁_工作區域 1 複本 7.jpg",
      "0807嬰兒沐浴_導購頁-07.jpg", "0807嬰兒沐浴_導購頁-08.jpg",
    ]),
    "behance-121241289": projectMedia("10-collagen-packaging", [
      "00.png", "01.png", "02.png", "04.png", "05.png", "06.png", "07.jpg",
    ]),
    "behance-121306305": projectMedia("11-master-tai", [
      "太師傅包裝合成_0610.jpg", "太師傅包裝合成_紙盒_單.jpg", "太師傅包裝合成_紙盒_掉落_0627.jpg",
      "太師傅包裝合成_紙盒_雙.jpg", "太師傅紙袋合成03.jpg", "太師傅紙袋合成_0610.jpg", "太師傅紙袋合成_漂浮.jpg",
      "太師傅網頁用A01-01-01.jpg", "太師傅網頁用A01-01-02-02.jpg", "太師傅鋁袋合成.jpg", "太師傅鋁袋合成_掉落.jpg",
    ]),
    "behance-120740315": projectMedia("13-ic-studio", [
      "IC_封面_工作區域 1.jpg", "IC_封面_工作區域 1 複本.jpg", "LOGO_GRIDE-01.jpg", "LOGO_GRIDE-02.jpg", "LOGO_GRIDE-03.jpg",
      "Business-Card-Mockup_IC.jpg", "Mockup.jpg", "NEWShopping Bag PSD MockUp 2.jpg", "Shopping Bag PSD MockUp 2.jpg",
      "ALLbranding psd mockup.jpg", "paper.jpg", "吊卡.jpg", "4.jpg", "5-2.jpg",
    ]),
    "behance-117426693": projectMedia("14-narrate", [
      "Webp.net-gifmaker.gif",
      "LOGO_0410-01.jpg", "LOGO_0410-02.jpg", "LOGO_0410-03.jpg", "LOGO_0410-04.jpg", "LOGO_0410-05.jpg", "LOGO_0410-06.jpg",
      "LOGO1.jpg", "LOGO2.jpg", "LOGO3.jpg", "名片04.jpg", "unnamed.jpg",
    ]),
  });

  const webDetails = {
    "web-greattop": projectMedia("01-greattop", [
      "LOGO_Webm.webm", "GreatTop_CIS_Redesign_2025_page-0001.jpg", "GreatTop_CIS_Redesign_2025_page-0002.jpg", "GreatTop_CIS_Redesign_2025_page-0003.jpg",
      "GreatTop_CIS_Redesign_2025_page-0004.jpg", "GreatTop_CIS_Redesign_2025_page-0005.jpg", "GreatTop_CIS_Redesign_2025_page-0006.jpg",
      "GreatTop_CIS_Redesign_2025_page-0007.jpg", "GreatTop_CIS_Redesign_2025_page-0008.jpg", "GreatTop_CIS_Redesign_2025_page-0009.jpg",
      "GreatTop_CIS_Redesign_2025_page-0010.jpg", "GreatTop_CIS_Redesign_2025_page-0011.jpg", "GreatTop_CIS_Redesign_2025_page-0012.jpg",
      "GreatTop_CIS_Redesign_2025_page-0013.jpg", "GreatTop_CIS_Redesign_2025_page-0014.jpg",
    ]),
    "web-hikariro": projectMedia("03-hikariro", [
      "hikariro-entry.mp4",
      "HIKARIRO_CIS_Landscape_2026_v2_page-0001.jpg", "HIKARIRO_CIS_Landscape_2026_v2_page-0002.jpg",
      "HIKARIRO_CIS_Landscape_2026_v2_page-0003.jpg", "HIKARIRO_CIS_Landscape_2026_v2_page-0004.jpg",
      "HIKARIRO_CIS_Landscape_2026_v2_page-0005.jpg", "HIKARIRO_CIS_Landscape_2026_v2_page-0006.jpg",
      "HIKARIRO_CIS_Landscape_2026_v2_page-0007.jpg", "HIKARIRO_CIS_Landscape_2026_v2_page-0008.jpg",
      "HIKARIRO_CIS_Landscape_2026_v2_page-0009.jpg", "HIKARIRO_CIS_Landscape_2026_v2_page-0010.jpg",
      "HIKARIRO_CIS_Landscape_2026_v2_page-0011.jpg", "HIKARIRO_CIS_Landscape_2026_v2_page-0012.jpg",
      "HIKARIRO_CIS_Landscape_2026_v2_page-0013.jpg", "HIKARIRO_CIS_Landscape_2026_v2_page-0014.jpg",
      "HIKARIRO_CIS_Landscape_2026_v2_page-0015.jpg", "HIKARIRO_CIS_Landscape_2026_v2_page-0016.jpg",
      "HIKARIRO_CIS_Landscape_2026_v2_page-0017.jpg", "HIKARIRO_CIS_Landscape_2026_v2_page-0018.jpg",
    ]),
    "web-matsuo": projectMedia("02-matsuo", ["Home_01.png"]),
  };

  const webWorks = source.webWorks.map((item) => {
    const key = `web-${item.id}`;
    const cover = asset(item.optimizedCover || item.localCover);
    return {
      key,
      title: titles[key] || item.title,
      category: item.category || "Web Design",
      year: item.year || 2026,
      cover,
      gallery: webDetails[key]?.length ? webDetails[key] : item.localVideo ? [cover, asset(item.localVideo)] : [cover],
      externalUrl: item.sourceUrl || item.url,
      type: "web",
    };
  });

  const portfolioWorks = source.behance.map((item) => {
    const key = `behance-${item.id}`;
    const cover = asset(item.optimizedCover || item.localCover);
    return {
      key,
      title: titles[key] || item.title,
      category: item.category || "Visual Design",
      year: item.year || 2021,
      cover,
      gallery: details[key]?.length ? details[key] : [cover],
      externalUrl: item.sourceUrl,
      type: "portfolio",
    };
  });

  const collagenPackaging = portfolioWorks.find((item) => item.key === "behance-121241289");
  if (collagenPackaging) collagenPackaging.cover = asset("assets/projects/10-collagen-packaging/06.png");

  const extras = [
    {
      key: "local-scented-card",
      title: "Scented Hanging Card",
      category: "Graphic & Product Design",
      year: 2024,
      cover: asset("assets/projects/15-Scented Hanging Card/香氛吊卡-1.jpg"),
      gallery: ["1", "2", "3", "4", "5", "6"].map((n) => asset(`assets/projects/15-Scented Hanging Card/香氛吊卡-${n}.jpg`)),
      type: "portfolio",
    },
    {
      key: "local-city-god",
      title: "Kinmen City God Festival",
      category: "Campaign & Display Design",
      year: 2024,
      cover: asset("assets/projects/16-/未命名-1_工作區域 1 複本.jpg"),
      gallery: [
        "未命名-1_工作區域 1 複本.jpg",
        "未命名-1_工作區域 1 複本 3.jpg",
        "未命名-1_工作區域 1 複本 4.jpg",
        "金湖虎迎城隍寶抱枕_去背.jpg",
        "金湖虎迎城隍平安袋_去背_1.jpg",
        "金湖虎迎城隍造型扇子_去背_1.jpg",
      ].map((name) => asset(`assets/projects/16-/${name}`)),
      type: "portfolio",
    },
  ];

  const scentedCard = extras.find((item) => item.key === "local-scented-card");
  if (scentedCard) {
    scentedCard.cover = asset("assets/projects/15-Scented Hanging Card/香氛吊卡-1.jpg");
    scentedCard.gallery = projectMedia("15-Scented Hanging Card", ["香氛吊卡-1.jpg", "香氛吊卡-2.jpg", "香氛吊卡-3.jpg", "香氛吊卡-4.jpg", "香氛吊卡-5.jpg", "香氛吊卡-6.jpg", "香氛吊卡-7.jpg", "香氛吊卡-8.jpg", "香氛吊卡-9.jpg", "香氛吊卡-10.jpg"]);
  }
  const cityGod = extras.find((item) => item.key === "local-city-god");
  if (cityGod) {
    cityGod.cover = asset("assets/projects/16-/00.png");
    cityGod.gallery = projectMedia("16-", ["00.png", "01.png", "02.png", "03.png", "04.jpg", "05.jpg", "06.jpg", "07.jpg", "08.jpg"]);
  }

  const hiddenWorkKeys = new Set([
    "behance-139335911",
    "behance-125424853",
    "behance-124789997",
    "behance-121143993",
  ]);

  window.NZ_WORKS = [...webWorks, ...portfolioWorks, ...extras].filter((work) => !hiddenWorkKeys.has(work.key));
  window.NZ_PROFILE = {
    name: "NierZooM",
    email: "sc8154628@gmail.com",
    behance: "https://www.behance.net/sc8154628b5b8",
    intro: "I am a visual designer who believes design is storytelling. Every project begins with a question: what feeling should this leave?",
    statement: "Brand identity, packaging, web visuals and commercial imagery. I work across media, looking for the point where precision meets emotion.",
    services: [
      ["01", "Brand Identity", "Logo, visual identity systems and guidelines that give a brand a distinct, consistent voice."],
      ["02", "Web & Landing Page", "Clear digital experiences shaped by hierarchy, rhythm and purposeful interaction."],
      ["03", "Packaging Design", "Packaging that communicates quality through material, colour and typography."],
      ["04", "Visual Design", "Campaign visuals, display systems, banners and commercial communication."],
      ["05", "Photography & Compositing", "Product photography, art direction, retouching and image compositing."],
      ["06", "Typography & Layout", "Logotypes, custom lettering and editorial layouts for print and screen."],
    ],
    experience: [
      ["2020—2021", "老爺夢國際有限公司", "美術視覺設計 / Visual Design"],
      ["2021—2022", "VLENS 米倫斯國際股份有限公司", "品牌設計專員 / Brand Design"],
      ["2022—2024", "昇恆昌股份有限公司", "平面／陳列設計 / Graphic & Visual Presentation Design"],
      ["2024—NOW", "台灣松尾股份有限公司", "平面／網頁設計 / Graphic & Web Design"],
    ],
  };
})();
