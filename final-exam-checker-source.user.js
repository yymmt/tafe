// ==UserScript==
// @name         最終課題チェッカー2 - ソースコード部分
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  最終課題チェッカー2 - ソースコード部分
// @author       You
// @match        http://*/final-exam/*
// @match        http://*/*/final-exam/*
// @match        https://*/final-exam/*
// @match        https://*/*/final-exam/*
// @icon         https://demo.techacademy.jp/favicon.ico
// @grant        none
// @updateURL    https://raw.githubusercontent.com/yymmt/tafe/main/final-exam-checker-source.user.js
// @downloadURL  https://raw.githubusercontent.com/yymmt/tafe/main/final-exam-checker-source.user.js
// ==/UserScript==

window.onload = async () => {
  const indexHtmlSource = document.documentElement.outerHTML;

  const linkElement = document.querySelector('link[href*="style.css"]');
  const styleCssPath = linkElement.href;
  let styleCssSource = await (await fetch(styleCssPath)).text();

  const scriptElement = document.querySelector('script[src*="main.js"]');
  const mainJsPath = scriptElement.src;
  let mainJsSource = await (await fetch(mainJsPath)).text();

  let analyzeHtmlElm = (title, pattern, outFns) => {
    console.log(`◆ ${title}`);
    const matches = indexHtmlSource.match(pattern);
    if (matches) {
      matches.forEach((match) => {
        console.log(match);
        const div = document.createElement('div');
        div.innerHTML = match;
        const e = div.firstElementChild;
        if (e) {
          outFns.forEach(f => console.log("  "+ f(e).replace(/\s/g, '') ));
        }
      });
    }
  };

  console.log("■ index.html");
  analyzeHtmlElm('Headings', /<h[1-6].*?>[\s\S]*?<\/h[1-6]>/gi, [
    e => e.tagName,
    e => `text: ${e.textContent}`,
  ]);
  analyzeHtmlElm('Anchors', /<a\s.*?>[\s\S]*?<\/a>/gi, [
    e => `text: ${e.textContent}`,
    e => `href: ${e.getAttribute('href')}`,
  ]);
  analyzeHtmlElm('Images', /<img\s[^>]*>/gi, [
    e => `src: ${e.getAttribute('src')}`,
    e => `alt: ${e.getAttribute('alt')}`,
  ]);
  analyzeHtmlElm('Breaks', /<.*?>.*?<br.*?>.*?<\/.*?>/gi, []);
  analyzeHtmlElm('Comments', /<!--[\s\S]*?-->/g, []);
  analyzeHtmlElm('Title', /<title.*?>.*?<\/title>/gi, [
    e => e.textContent == 'Kira-Kira English｜キラキライングリッシュ キッズオンライン英会話教室' ? 'OK': 'NG',
  ]);
  analyzeHtmlElm('Description', /<meta.*?name=.*?description.*?>/gi, [
    e => e.getAttribute('content') == 'Kira-Kira English(キラキライングリッシュ)は、お子様向けのオンライン英会話教室です。0歳から15歳までのお子様向けに楽しく学べて“使える英語力”が身につき幅広いレッスンが受講でき、家族割やきょうだい割も大好評！ご希望に合わせて英語検定受験コース、高校受験向けコースも開講しています。' ? 'OK': 'NG',
  ]);
  analyzeHtmlElm('header, nav, main, section, footer', /<(header|nav|main|section|footer).*?>/gi, [
  ]);

  let analyzeCssRule = (title, pattern) => {
    console.log(`◆ ${title}`);
    const flags = pattern.flags.includes('g') ? pattern.flags : pattern.flags + 'g';
    const regex = new RegExp(pattern, flags);
    let match;
    while ((match = regex.exec(styleCssSource)) !== null) {
      const matchIndex = match.index;
      const matchStr = match[0];
      const openBraceIndex = styleCssSource.lastIndexOf('{', matchIndex);
      const closeBraceIndex = styleCssSource.lastIndexOf('}', matchIndex);
      if (openBraceIndex === -1 || closeBraceIndex > openBraceIndex) {
        console.log(`  ${matchStr.trim()}`);
        continue;
      }
      let selectorStartIndex = 0;
      const stopChars = ['}', ';', '{'];
      let maxIndex = -1;
      for (const char of stopChars) {
        const idx = styleCssSource.lastIndexOf(char, openBraceIndex - 1);
        if (idx > maxIndex) maxIndex = idx;
      }
      if (maxIndex !== -1) selectorStartIndex = maxIndex + 1;
      let selector = styleCssSource.substring(selectorStartIndex, openBraceIndex).trim();
      selector = selector.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\r?\n/g, ' ').trim();
      console.log(`  ${selector} { ... ${matchStr.trim()} ... }`);
    }
  };
  let analyzeCssColor = () => {
    console.log('◆ Colors Check');

    const allowedRgbas = [
      [0, 0, 0, 255],       // #000000
      [34, 34, 34, 255],    // #222222
      [51, 51, 51, 255],    // #333333
      [85, 85, 85, 255],    // #555555
      [102, 102, 102, 255], // #666666
      [153, 153, 153, 255], // #999999
      [221, 221, 221, 255], // #dddddd
      [255, 255, 255, 255], // #ffffff
      [242, 161, 24, 255],  // #f2a118
      [242, 102, 24, 255],  // #f26618
      [70, 192, 23, 255],   // #46c017
      [0, 121, 242, 255],   // #0079f2
      [241, 31, 141, 255],  // #f11f8d
      [240, 240, 240, 255], // #f0f0f0
      [255, 237, 204, 255], // #ffedcc
      [255, 238, 229, 255], // #ffeee5
      [255, 246, 229, 255], // #fff6e5
      [245, 245, 245, 255], // #f5f5f5
      [0, 121, 242, 13],
      [0,0,0,51],
      [255,255,255,204],
    ];

    const parseColor = (color) => {
      let c = color.toLowerCase().trim();
      if (c.startsWith('#')) {
        c = c.replace('#', '');
        let r, g, b, a = 255;
        if (c.length === 3 || c.length === 4) {
          r = parseInt(c[0] + c[0], 16);
          g = parseInt(c[1] + c[1], 16);
          b = parseInt(c[2] + c[2], 16);
          if (c.length === 4) a = parseInt(c[3] + c[3], 16);
        } else if (c.length === 6 || c.length === 8) {
          r = parseInt(c.substring(0, 2), 16);
          g = parseInt(c.substring(2, 4), 16);
          b = parseInt(c.substring(4, 6), 16);
          if (c.length === 8) a = parseInt(c.substring(6, 8), 16);
        } else {
          return null;
        }
        return [r, g, b, a];
      }
      if (c.startsWith('rgb')) {
        const m = c.match(/rgba?\((.+)\)/);
        if (!m) return null;
        const parts = m[1].split(/[,/\s]+/).filter(p => p.length > 0);
        if (parts.length < 3) return null;
        const r = parseFloat(parts[0]);
        const g = parseFloat(parts[1]);
        const b = parseFloat(parts[2]);
        let a = 255;
        if (parts.length >= 4) {
          const aStr = parts[3];
          if (aStr.includes('%')) {
            a = Math.round(parseFloat(aStr) / 100 * 255);
          } else {
            a = Math.round(parseFloat(aStr) * 255);
          }
        }
        return [r, g, b, a];
      }
      return null;
    };

    const colorPattern = /#[0-9a-f]{3,8}|rgba?\([\d\s,./%]+\)/gi;

    let match;
    while ((match = colorPattern.exec(styleCssSource)) !== null) {
      const color = match[0];
      const rgba = parseColor(color);

      if (rgba) {
        const isAllowed = allowedRgbas.some(allowed =>
          allowed[0] === rgba[0] &&
          allowed[1] === rgba[1] &&
          allowed[2] === rgba[2] &&
          Math.abs(allowed[3] - rgba[3]) <= 1
        );

        if (!isAllowed) {
          const rgbaStr = rgba.join(',');
          const matchIndex = match.index;
          const openBraceIndex = styleCssSource.lastIndexOf('{', matchIndex);
          let selector = "unknown";
          if (openBraceIndex !== -1) {
            let selectorStartIndex = 0;
            const stopChars = ['}', ';', '{'];
            let maxIndex = -1;
            for (const char of stopChars) {
              const idx = styleCssSource.lastIndexOf(char, openBraceIndex - 1);
              if (idx > maxIndex) maxIndex = idx;
            }
            if (maxIndex !== -1) selectorStartIndex = maxIndex + 1;
            selector = styleCssSource.substring(selectorStartIndex, openBraceIndex).trim();
            selector = selector.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\r?\n/g, ' ').trim();
          }
          console.log(`  NG: ${color} (parsed: ${rgbaStr}) in ${selector}`);
        }
      }
    }
  };

  console.log("■ style.css");
  analyzeCssRule('Negative Margins', /margin(-[a-z]+)?\s*:.*?-[0-9\.].*?;/gi);
  analyzeCssRule('Position', /position\s*:.*?;/gi);
  analyzeCssRule('Transform', /transform\s*:.*?;/gi);
  analyzeCssRule('Media Queries', /@media.*?\)/gi);
  analyzeCssRule('Comments', /\/\*[\s\S]*?\*\//g);
  analyzeCssColor();

  let analyzeJs = (title, pattern) => {
    console.log(`◆ ${title}`);
    const matches = mainJsSource.match(pattern);
    if(matches) {
      matches.forEach((match) => {
        console.log(match);
      });
    }
  }
  console.log("■ main.js");
  analyzeJs('Comments (Single)', /\/\/.*/g);
  analyzeJs('Comments (Multi)', /\/\*[\s\S]*?\*\//g);
  analyzeJs('Slick / autoplay', /\.slick[\s\S]*?\}/g);
  analyzeJs('SmartTab / autoAdjustHeight', /\.smartTab[\s\S]*?\}/g);
}
