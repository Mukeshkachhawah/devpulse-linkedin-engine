/**
 * Software Engineering Learning Sheet — Professional
 * Paste into Apps Script → Save → Run: setup
 *
 * Tabs: Revision Q&A | Glossary | Scenario Q&A
 * Content: MODULE 01 + MODULE 02 + MODULE 03 + Scenario Phase 1 (Basics + Frontend)
 *
 * Language: English UI labels + simple Hinglish teaching answers
 */

var THEME = {
  navy: '#0F172A',
  slate: '#1E293B',
  accent: '#0D9488',
  accentSoft: '#CCFBF1',
  accentText: '#115E59',
  headerFg: '#F8FAFC',
  muted: '#64748B',
  rowOdd: '#F8FAFC',
  border: '#CBD5E1',
  qBg: '#FFFBEB',
  qFg: '#1E293B',
  aBg: '#F0FDFA',
  aTagBg: '#99F6E4',
  aTagFg: '#115E59',
  mustKnow: '#0F766E',
  interview: '#C2410C',
  moduleColors: [
    '#0F766E', '#0369A1', '#7C3AED', '#B45309',
    '#BE123C', '#15803D', '#1D4ED8', '#0E7490'
  ]
};

// ================================================================
// SETUP
// ================================================================
function setup() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  ss.rename('Software Engineering Masterclass — Learning Sheet');

  createRevisionQA_(ss);
  createGlossary_(ss);
  createScenarioQA_(ss);
  removeUnusedSheets_(ss);

  ss.setActiveSheet(ss.getSheetByName('Revision Q&A'));
  SpreadsheetApp.flush();
  SpreadsheetApp.getUi().alert(
    'Ready!\n\n' +
    'Tabs: Revision Q&A + Glossary + Scenario Q&A\n' +
    'Loaded: Module 01 + Module 02 + Module 03\n' +
    'Scenario tab: Basics + Frontend (1–5 YOE)\n' +
    'Collapse: checkbox “Padh liya?” / left ▶/▼ / menu SE Learning\n\n' +
    'Reload sheet once if menu SE Learning nahi dikhe.'
  );
}

/** Custom menu — sheet open hone pe */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('SE Learning')
    .addItem('Collapse Module 01', 'collapseModule01')
    .addItem('Expand Module 01', 'expandModule01')
    .addSeparator()
    .addItem('Collapse Module 02', 'collapseModule02')
    .addItem('Expand Module 02', 'expandModule02')
    .addSeparator()
    .addItem('Collapse Module 03', 'collapseModule03')
    .addItem('Expand Module 03', 'expandModule03')
    .addToUi();
}

// ================================================================
// HELPERS
// ================================================================
function getOrRecreateSheet_(ss, name, index) {
  var existing = ss.getSheetByName(name);
  if (existing) ss.deleteSheet(existing);
  return ss.insertSheet(name, index);
}

function removeUnusedSheets_(ss) {
  var keep = { 'Revision Q&A': true, 'Glossary': true, 'Scenario Q&A': true };
  var toDelete = ss.getSheets().filter(function (s) {
    return !keep[s.getName()];
  });
  toDelete.forEach(function (s) {
    if (ss.getSheets().length > 1) {
      try { ss.deleteSheet(s); } catch (e) {}
    }
  });
}

/** Answer shape: Intuition → Engineering (hard words explained) → Must remember */
function answerBlock_(intuition, engineering, mustRemember) {
  return (
    'Intuition: ' + intuition + '\n\n' +
    'Engineering:\n' + engineering + '\n\n' +
    'Must remember:\n' + mustRemember
  );
}

// ================================================================
// REVISION Q&A
// ================================================================
function createRevisionQA_(ss) {
  var sheet = getOrRecreateSheet_(ss, 'Revision Q&A', 0);
  sheet.setTabColor(THEME.accent);

  // Extra column for collapse checkbox
  sheet.setColumnWidth(1, 92);
  sheet.setColumnWidth(2, 680);
  sheet.setColumnWidth(3, 180);
  sheet.setColumnWidth(4, 100);
  sheet.setColumnWidth(5, 160);

  sheet.getRange('A1:E1').merge();
  sheet.getRange('A1')
    .setValue('Software Engineering — Revision Q&A  |  Modules 01–03')
    .setFontFamily('Arial').setFontSize(16).setFontWeight('bold')
    .setFontColor(THEME.headerFg).setBackground(THEME.navy)
    .setVerticalAlignment('middle');
  sheet.setRowHeight(1, 42);

  sheet.getRange('A2:E2').merge();
  sheet.getRange('A2')
    .setValue('Format: Intuition → Engineering (hard words explained) → Must remember.  |  Collapse: left ▶/▼  OR  Module row pe “Padh liya?” checkbox  OR  menu SE Learning')
    .setFontFamily('Arial').setFontSize(10).setFontColor('#334155')
    .setBackground(THEME.accentSoft).setVerticalAlignment('middle');
  sheet.setRowHeight(2, 28);

  sheet.getRange(3, 1, 1, 5)
    .setValues([['Type', 'Content', 'Key Terms', 'Module', 'Padh liya?']])
    .setFontFamily('Arial').setFontSize(11).setFontWeight('bold')
    .setFontColor(THEME.headerFg).setBackground(THEME.slate)
    .setHorizontalAlignment('center').setVerticalAlignment('middle');
  sheet.setRowHeight(3, 28);
  sheet.setFrozenRows(3);

  var topics = getRevisionData_();
  var row = 4;
  var qCounter = 0;
  var moduleMeta = {}; // id -> { titleRow, contentStart, contentEnd }

  topics.forEach(function (topic, topicIndex) {
    var moduleId = topic.moduleId || ('0' + (topicIndex + 1)).slice(-2);

    var titleRow = row;
    sheet.getRange(row, 1, 1, 4).merge();
    sheet.getRange(row, 1)
      .setValue(topic.title + '   ←  checkbox right pe tick = collapse')
      .setFontFamily('Arial').setFontSize(12).setFontWeight('bold')
      .setFontColor('#FFFFFF')
      .setBackground(THEME.moduleColors[topicIndex % THEME.moduleColors.length])
      .setVerticalAlignment('middle');

    // Collapse checkbox (Padh liya?)
    var checkCell = sheet.getRange(row, 5);
    checkCell.insertCheckboxes();
    checkCell.setValue(false);
    checkCell.setBackground('#FEF3C7');
    checkCell.setHorizontalAlignment('center');
    checkCell.setVerticalAlignment('middle');
    checkCell.setNote('Padh liya? Tick = Module collapse (hide Q&A). Untick = expand.');

    sheet.setRowHeight(row, 36);
    row++;

    var contentStart = row;

    if (topic.subtitle) {
      sheet.getRange(row, 1, 1, 5).merge();
      sheet.getRange(row, 1)
        .setValue(topic.subtitle)
        .setFontFamily('Arial').setFontSize(10).setFontStyle('italic')
        .setFontColor('#0F172A').setBackground('#E0F2FE')
        .setVerticalAlignment('middle');
      sheet.setRowHeight(row, 24);
      row++;
    }

    topic.qa.forEach(function (item) {
      qCounter++;
      var tag = item.mustKnow ? 'Must Know' : ('Q' + qCounter);

      sheet.getRange(row, 1)
        .setValue(tag)
        .setFontFamily('Arial').setFontSize(10).setFontWeight('bold')
        .setFontColor('#FFFFFF')
        .setBackground(item.mustKnow ? THEME.mustKnow : THEME.interview)
        .setHorizontalAlignment('center').setVerticalAlignment('middle');

      sheet.getRange(row, 2)
        .setValue(item.q)
        .setFontFamily('Arial').setFontSize(11).setFontWeight('bold')
        .setFontColor(THEME.qFg).setBackground(THEME.qBg)
        .setWrap(true).setVerticalAlignment('middle');

      sheet.getRange(row, 3)
        .setValue(item.terms || '')
        .setFontFamily('Arial').setFontSize(9).setFontColor('#854D0E')
        .setBackground(THEME.qBg).setWrap(true).setVerticalAlignment('middle');

      sheet.getRange(row, 4)
        .setValue(item.module || moduleId)
        .setFontFamily('Arial').setFontSize(9).setFontColor('#334155')
        .setBackground(THEME.qBg).setWrap(true).setVerticalAlignment('middle');

      sheet.getRange(row, 5).setBackground(THEME.qBg);
      sheet.setRowHeight(row, 44);
      row++;

      sheet.getRange(row, 1)
        .setValue('Answer')
        .setFontFamily('Arial').setFontSize(10).setFontWeight('bold')
        .setFontColor(THEME.aTagFg).setBackground(THEME.aTagBg)
        .setHorizontalAlignment('center').setVerticalAlignment('top');

      sheet.getRange(row, 2, 1, 3).merge();
      sheet.getRange(row, 2)
        .setValue(item.a)
        .setFontFamily('Arial').setFontSize(10).setFontColor('#0F172A')
        .setBackground(THEME.aBg).setWrap(true).setVerticalAlignment('top');

      sheet.getRange(row, 5).setBackground(THEME.aBg);

      var lines = Math.max(10, Math.ceil(String(item.a).length / 85));
      sheet.setRowHeight(row, Math.min(48 + lines * 14, 409));
      row++;

      sheet.getRange(row, 1, 1, 5).setBackground('#FFFFFF');
      sheet.setRowHeight(row, 8);
      row++;
    });

    var contentEnd = row - 1;
    moduleMeta[moduleId] = {
      titleRow: titleRow,
      contentStart: contentStart,
      contentEnd: contentEnd,
      checkA1: 'E' + titleRow
    };

    // Native Sheets group = left gutter ▶/▼ button
    if (contentEnd >= contentStart) {
      try {
        sheet.getRange(contentStart, 1, contentEnd - contentStart + 1, 1).shiftRowGroupDepth(1);
      } catch (e) {}
    }
  });

  sheet.getRange(row, 1, 1, 5).merge();
  sheet.getRange(row, 1)
    .setValue('Legend: Orange = Interview Q  |  Teal = Must Know  |  Total Qs: ' + qCounter + '  |  Collapse = checkbox / left ▶ / menu SE Learning')
    .setFontFamily('Arial').setFontSize(9).setFontColor(THEME.muted)
    .setBackground(THEME.rowOdd).setVerticalAlignment('middle');

  sheet.getRange(3, 1, Math.max(1, row - 3), 5)
    .setBorder(true, true, true, true, true, true, THEME.border, SpreadsheetApp.BorderStyle.SOLID);

  // Persist ranges for checkbox + menu
  PropertiesService.getDocumentProperties().setProperty(
    'SE_MODULE_META',
    JSON.stringify(moduleMeta)
  );
}

/** Checkbox tick/untick → collapse/expand */
function onEdit(e) {
  if (!e || !e.range) return;
  var sheet = e.range.getSheet();
  if (sheet.getName() !== 'Revision Q&A') return;
  if (e.range.getColumn() !== 5) return;

  var meta;
  try {
    meta = JSON.parse(PropertiesService.getDocumentProperties().getProperty('SE_MODULE_META') || '{}');
  } catch (err) {
    return;
  }

  var editedRow = e.range.getRow();
  var moduleId = null;
  Object.keys(meta).forEach(function (id) {
    if (meta[id].titleRow === editedRow) moduleId = id;
  });
  if (!moduleId) return;

  var checked = e.range.getValue() === true;
  if (checked) {
    collapseModuleById_(moduleId);
  } else {
    expandModuleById_(moduleId);
  }
}

function collapseModule01() {
  collapseModuleById_('01');
  syncCheckbox_('01', true);
}

function expandModule01() {
  expandModuleById_('01');
  syncCheckbox_('01', false);
}

function collapseModule02() {
  collapseModuleById_('02');
  syncCheckbox_('02', true);
}

function expandModule02() {
  expandModuleById_('02');
  syncCheckbox_('02', false);
}

function collapseModule03() {
  collapseModuleById_('03');
  syncCheckbox_('03', true);
}

function expandModule03() {
  expandModuleById_('03');
  syncCheckbox_('03', false);
}

function collapseModuleById_(moduleId) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Revision Q&A');
  var meta = getModuleMeta_();
  var m = meta[moduleId];
  if (!sheet || !m) {
    SpreadsheetApp.getUi().alert('Module ' + moduleId + ' range not found. Run setup() again.');
    return;
  }
  sheet.hideRows(m.contentStart, m.contentEnd - m.contentStart + 1);
  try {
    var group = sheet.getRowGroup(m.contentStart, 1);
    if (group) group.collapse();
  } catch (err) {}
}

function expandModuleById_(moduleId) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Revision Q&A');
  var meta = getModuleMeta_();
  var m = meta[moduleId];
  if (!sheet || !m) {
    SpreadsheetApp.getUi().alert('Module ' + moduleId + ' range not found. Run setup() again.');
    return;
  }
  sheet.showRows(m.contentStart, m.contentEnd - m.contentStart + 1);
  try {
    var group = sheet.getRowGroup(m.contentStart, 1);
    if (group) group.expand();
  } catch (err) {}
}

function syncCheckbox_(moduleId, checked) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Revision Q&A');
  var meta = getModuleMeta_();
  var m = meta[moduleId];
  if (!sheet || !m) return;
  sheet.getRange(m.titleRow, 5).setValue(!!checked);
}

function getModuleMeta_() {
  try {
    return JSON.parse(PropertiesService.getDocumentProperties().getProperty('SE_MODULE_META') || '{}');
  } catch (e) {
    return {};
  }
}

// ================================================================
// GLOSSARY
// ================================================================
function createGlossary_(ss) {
  var sheet = getOrRecreateSheet_(ss, 'Glossary', 1);
  sheet.setTabColor('#7C3AED');

  sheet.getRange('A1:D1').merge();
  sheet.getRange('A1')
    .setValue('Glossary — Modules 01–03 terms (hard words explained)')
    .setFontFamily('Arial').setFontSize(16).setFontWeight('bold')
    .setFontColor(THEME.headerFg).setBackground(THEME.navy)
    .setVerticalAlignment('middle');
  sheet.setRowHeight(1, 38);

  sheet.getRange('A2:D2').merge();
  sheet.getRange('A2')
    .setValue('Naya word dikhe toh yahan meaning dekh lo. Phir Revision Q&A mein wapas jao.')
    .setFontFamily('Arial').setFontSize(10).setFontColor('#334155')
    .setBackground(THEME.accentSoft).setVerticalAlignment('middle');
  sheet.setRowHeight(2, 24);

  sheet.getRange(3, 1, 1, 4)
    .setValues([['#', 'Term', 'Simple Meaning (Hinglish)', 'Related Topic']])
    .setFontFamily('Arial').setFontSize(11).setFontWeight('bold')
    .setFontColor(THEME.headerFg).setBackground(THEME.slate)
    .setHorizontalAlignment('center').setVerticalAlignment('middle');
  sheet.setRowHeight(3, 28);
  sheet.setFrozenRows(3);

  var terms = getGlossaryData_();
  var values = terms.map(function (t, i) {
    return [i + 1, t.term, t.meaning, t.topic];
  });

  var start = 4;
  sheet.getRange(start, 1, values.length, 4)
    .setValues(values)
    .setFontFamily('Arial').setFontSize(10)
    .setWrap(true).setVerticalAlignment('top');

  for (var i = 0; i < values.length; i++) {
    var r = start + i;
    sheet.getRange(r, 1, 1, 4).setBackground(i % 2 === 0 ? '#FFFFFF' : THEME.rowOdd);
    sheet.getRange(r, 1).setHorizontalAlignment('center').setFontWeight('bold').setFontColor(THEME.accentText);
    sheet.getRange(r, 2).setFontWeight('bold').setFontColor(THEME.navy);
    sheet.getRange(r, 4).setFontColor('#0369A1');
    var gLines = Math.max(2, Math.ceil(String(values[i][2]).length / 90));
    sheet.setRowHeight(r, Math.min(32 + gLines * 12, 180));
  }

  sheet.setColumnWidth(1, 40);
  sheet.setColumnWidth(2, 200);
  sheet.setColumnWidth(3, 640);
  sheet.setColumnWidth(4, 160);
  sheet.getRange(3, 1, values.length + 1, 4)
    .setBorder(true, true, true, true, true, true, THEME.border, SpreadsheetApp.BorderStyle.SOLID);
}

// ================================================================
// SCENARIO Q&A — Basics + Frontend (1–5 YOE)
// ================================================================
function createScenarioQA_(ss) {
  var sheet = getOrRecreateSheet_(ss, 'Scenario Q&A', 2);
  sheet.setTabColor('#B45309');

  sheet.setColumnWidth(1, 92);
  sheet.setColumnWidth(2, 720);
  sheet.setColumnWidth(3, 200);
  sheet.setColumnWidth(4, 140);

  sheet.getRange('A1:D1').merge();
  sheet.getRange('A1')
    .setValue('Scenario Q&A  |  Basics/day-to-day + Frontend  |  Level: 1–5 YOE interview scenarios')
    .setFontFamily('Arial').setFontSize(16).setFontWeight('bold')
    .setFontColor(THEME.headerFg).setBackground(THEME.navy)
    .setVerticalAlignment('middle');
  sheet.setRowHeight(1, 42);

  sheet.getRange('A2:D2').merge();
  sheet.getRange('A2')
    .setValue('Format: Intuition → Engineering → Must remember.  |  Topic 1–2 = Basics + Frontend (1–5 YOE)  |  Backend/DevOps/System Design baad mein')
    .setFontFamily('Arial').setFontSize(10).setFontColor('#334155')
    .setBackground(THEME.accentSoft).setVerticalAlignment('middle');
  sheet.setRowHeight(2, 28);

  sheet.getRange(3, 1, 1, 4)
    .setValues([['Type', 'Content', 'Key Terms', 'Area']])
    .setFontFamily('Arial').setFontSize(11).setFontWeight('bold')
    .setFontColor(THEME.headerFg).setBackground(THEME.slate)
    .setHorizontalAlignment('center').setVerticalAlignment('middle');
  sheet.setRowHeight(3, 28);
  sheet.setFrozenRows(3);

  var topics = getScenarioData_();
  var row = 4;
  var qCounter = 0;

  topics.forEach(function (topic, topicIndex) {
    sheet.getRange(row, 1, 1, 4).merge();
    sheet.getRange(row, 1)
      .setValue(topic.title)
      .setFontFamily('Arial').setFontSize(12).setFontWeight('bold')
      .setFontColor('#FFFFFF')
      .setBackground(THEME.moduleColors[topicIndex % THEME.moduleColors.length])
      .setVerticalAlignment('middle');
    sheet.setRowHeight(row, 36);
    row++;

    if (topic.subtitle) {
      sheet.getRange(row, 1, 1, 4).merge();
      sheet.getRange(row, 1)
        .setValue(topic.subtitle)
        .setFontFamily('Arial').setFontSize(10).setFontStyle('italic')
        .setFontColor('#0F172A').setBackground('#E0F2FE')
        .setVerticalAlignment('middle');
      sheet.setRowHeight(row, 24);
      row++;
    }

    topic.qa.forEach(function (item) {
      qCounter++;
      var tag = item.mustKnow ? 'Must Know' : ('Q' + qCounter);

      sheet.getRange(row, 1)
        .setValue(tag)
        .setFontFamily('Arial').setFontSize(10).setFontWeight('bold')
        .setFontColor('#FFFFFF')
        .setBackground(item.mustKnow ? THEME.mustKnow : THEME.interview)
        .setHorizontalAlignment('center').setVerticalAlignment('middle');

      sheet.getRange(row, 2)
        .setValue(item.q)
        .setFontFamily('Arial').setFontSize(11).setFontWeight('bold')
        .setFontColor(THEME.qFg).setBackground(THEME.qBg)
        .setWrap(true).setVerticalAlignment('middle');

      sheet.getRange(row, 3)
        .setValue(item.terms || '')
        .setFontFamily('Arial').setFontSize(9).setFontColor('#854D0E')
        .setBackground(THEME.qBg).setWrap(true).setVerticalAlignment('middle');

      sheet.getRange(row, 4)
        .setValue(item.area || topic.area || '')
        .setFontFamily('Arial').setFontSize(9).setFontColor('#334155')
        .setBackground(THEME.qBg).setWrap(true).setVerticalAlignment('middle');

      sheet.setRowHeight(row, 44);
      row++;

      sheet.getRange(row, 1)
        .setValue('Answer')
        .setFontFamily('Arial').setFontSize(10).setFontWeight('bold')
        .setFontColor(THEME.aTagFg).setBackground(THEME.aTagBg)
        .setHorizontalAlignment('center').setVerticalAlignment('top');

      sheet.getRange(row, 2, 1, 3).merge();
      sheet.getRange(row, 2)
        .setValue(item.a)
        .setFontFamily('Arial').setFontSize(10).setFontColor('#0F172A')
        .setBackground(THEME.aBg).setWrap(true).setVerticalAlignment('top');

      var lines = Math.max(10, Math.ceil(String(item.a).length / 85));
      sheet.setRowHeight(row, Math.min(48 + lines * 14, 409));
      row++;

      sheet.getRange(row, 1, 1, 4).setBackground('#FFFFFF');
      sheet.setRowHeight(row, 8);
      row++;
    });
  });

  sheet.getRange(row, 1, 1, 4).merge();
  sheet.getRange(row, 1)
    .setValue('Legend: Orange = Interview scenario  |  Teal = Must Know  |  Total scenarios: ' + qCounter + '  |  Phase 1 = Basics + Frontend')
    .setFontFamily('Arial').setFontSize(9).setFontColor(THEME.muted)
    .setBackground(THEME.rowOdd).setVerticalAlignment('middle');

  sheet.getRange(3, 1, Math.max(1, row - 3), 4)
    .setBorder(true, true, true, true, true, true, THEME.border, SpreadsheetApp.BorderStyle.SOLID);
}

function getScenarioData_() {
  return getScenarioBasics_().concat(getScenarioFrontend_());
}

function getRevisionData_() {
  return getM01_().concat(getM02_()).concat(getM03_());
}

// ================================================================
// MODULE 01 — Computer Basics (COMPLETE + IN-DEPTH)
// ================================================================
function getM01_() {
  return [{
    moduleId: '01',
    title: 'MODULE 01 — Computer Basics',
    subtitle: 'Pehle machine samjho, phir code. Format: Intuition → Engineering (hard words explained) → Must remember.',
    qa: [
      {
        mustKnow: true, module: '01', terms: 'Computer, Input, Output, Program, Algorithm',
        q: 'Computer kya hai? Software engineer ke liye yeh definition kyun zaroori hai?',
        a: answerBlock_(
          'Computer ek super-tez assistant hai jo clear instructions ko bar-bar bilkul same tarike se follow karta hai — thak’ta nahi, “andar se feel” karke guess nahi karta.',
          'Daily life: tum kisi helper ko list dete ho — “pehla yeh, phir yeh, phir yeh.” Computer wahi karta hai, bas crores of times faster. Agar list unclear ya galt hai, result bhi galt aayega. Isliye log kehte hain “computer ne galt kiya,” lekin asal mein aksar instructions / data / assumptions galt the.\n\nProgram = woh instructions (plus data) jo computer follow karta hai. Algorithm = problem solve karne ka step-by-step plan (language se pehle soch). Engineer ka kaam: messy real problem ko clear steps mein todna, edge cases sochna, phir code likhna.\n\nPhone, laptop, smartwatch, server — sab computers hain (alag size/power). Calculator limited hai; general-purpose computer alag programs chala sakta hai.',
          'Definition: programmable machine that transforms input → process → output.\n• Input examples: keyboard, mouse, touch, network request, file, sensor\n• Process: CPU instructions execute karta hai (OS + your program)\n• Output: screen, sound, file write, network response, print\n• Program = instructions + data; Algorithm = language-independent plan\n• General-purpose vs special-purpose (router firmware, calculator)\n• Common myth: “AI/computer sochta hai” — woh patterns/instructions follow karta hai; responsibility clarity ki tumhari hai\n• Engineer skill tested in interviews: break problem → steps → edge cases → complexity later\n• Follow-up ready: “What is a program vs process?” → program = recipe on disk; process = running instance in memory'
        )
      },
      {
        mustKnow: true, module: '01', terms: 'Hardware, Software, Firmware, Application',
        q: 'Hardware aur software mein farq kya hai? Examples do.',
        a: answerBlock_(
          'Hardware = jo physically chhoo sakte ho (laptop body, chip, screen). Software = uske andar chal rahi instructions (Windows, Chrome, tumhara code) — jaise body vs uske andar ki soch/recipe.',
          'Bina hardware ke software sirf text/file hai — kuch “chal” nahi sakta. Bina software ke hardware dead box jaisa. Dono saath kaam karte hain.\n\nSoftware levels (yaad rakho):\n1) System software — OS (Windows/Linux) jo machine manage karta hai\n2) Application software — Chrome, VS Code, WhatsApp, tumhari website\n3) Firmware — chip/device ke andar chhota special software (BIOS/UEFI, router)\n\nTumhari .js/.cpp/.py file software (source) hai. Compile/build ke baad bhi software hi rehta hai, bas form badal sakta hai. Laptop/phone/keyboard hardware hain.\n\nCommon confusion: “Is cloud software or hardware?” — cloud = remote computers (hardware) + services (software) jo internet pe milte hain.',
          '• Hardware: CPU, RAM, SSD/HDD, motherboard, GPU, NIC, keyboard, display\n• Software: OS, drivers (bridge), browsers, editors, games, your apps\n• Firmware: low-level software burned/near hardware (update carefully)\n• App usually means end-user program; “software” broader term\n• Abstraction: apps rarely talk raw hardware — OS + drivers beech mein\n• Interview angle: layers — hardware → firmware/OS → runtime → application\n• Mistake: renaming .jpg to .png does not truly convert — type ≠ only extension\n• Follow-up: “What is a driver?” → OS ko specific hardware samjhane wala software'
        )
      },
      {
        mustKnow: true, module: '01', terms: 'CPU, RAM, Storage, Cache, SSD, HDD, Virtual memory',
        q: 'CPU, RAM aur storage ka simple farq? Slow laptop kab hota hai?',
        a: answerBlock_(
          'Kitchen: chef = CPU (kaam karta hai), counter = RAM (abhi jo ingredients table pe hain), fridge = storage (baad ke liye). Agar counter chhota / fridge door bar-bar kholna padhe → slow cooking.',
          'CPU (Central Processing Unit): instructions execute karta hai — “brain + hands”. Cores = parallel helpers (rough idea). Clock speed = kitni tez ticks (sirf isse compare mat karo blindly).\n\nRAM (Random Access Memory): abhi chal rahe programs ka working space. Bohot tez, lekin volatile — power off / restart pe clear. Agar RAM full → OS disk pe swap/page file use karta hai (virtual memory) → suddenly slow.\n\nStorage (SSD/HDD): files permanently (almost) rehti hain — OS, photos, projects. HDD spinning disk (aksar sasta/bada, slow). SSD flash chips (tez, modern laptops). Storage full hone pe bhi slow / updates fail.\n\nCache (CPU cache): chef ke pocket spices — RAM se bhi tez, bohot chhota. Detail baad mein; abhi itna: hierarchy = Cache > RAM > SSD > HDD (speed down, size up typically).\n\nSlow laptop common reasons: RAM pressure, 100% disk, too many startup apps, thermal throttle (garam), malware, outdated HDD, browser tabs explosion.',
          '• Speed hierarchy (typical): CPU registers/cache → RAM → SSD → HDD → network\n• Volatile = RAM; Persistent = disk/SSD\n• More RAM helps multitasking; faster storage helps boot/load; CPU helps heavy compute\n• Task Manager / Activity Monitor se CPU, Memory, Disk check karo\n• Virtual memory/swap: safety net, not free speed\n• “8GB vs 16GB” interviews: depends workload (browsers+IDE+Docker hungry)\n• Follow-ups: What is thrashing? → too much paging, little real work\n• What is GPU? → graphics/parallel workloads (ML, games) — separate from CPU story'
        )
      },
      {
        mustKnow: true, module: '01', terms: 'Operating System, Kernel, Process, Thread, Driver, Permission',
        q: 'Operating System (OS) kya karta hai? Bina OS ke kya problem hoti?',
        a: answerBlock_(
          'OS school ka principal + timetable + security guard: har class (app) ko kab room (CPU), kitni copy (RAM), kaunsi almari (files) milegi — rules ke saath.',
          'Bina OS ke har program ko khud hardware details likhni padti — different keyboards, disks, screens. Impossible-level complexity for normal apps. OS ek stable platform deta hai: “file kholo”, “memory do”, “network se bhejo”.\n\nOS examples: Windows, macOS, Linux (Ubuntu…), Android, iOS. Servers pe Linux common.\n\nKernel = OS ka core — hardware ke nearest. Apps seedha kernel pe jump nahi karti casually; system calls / APIs se kaam maangti hain.\n\nProcess = chal raha program ka instance (Chrome ke multiple processes ho sakte). Thread = process ke andar lighter worker (advanced Module later).\n\nPermissions: camera/mic/files access OS control karta hai — security + privacy. Drivers = specific hardware (printer, GPU) ko OS se jodne wale pieces.\n\nBoot rough flow: power → firmware (BIOS/UEFI) → bootloader → kernel → OS services → login/apps.',
          '• Jobs of OS: process scheduling, memory management, file system, device I/O, networking, security/users\n• User space vs kernel space (apps vs privileged core)\n• System call = app requesting OS service\n• Multi-tasking = CPU time sharing (appears parallel)\n• Crash isolation: one app crash ideally should not kill whole OS (not always perfect)\n• Package managers / installers sit on top of OS\n• Interview: “OS vs application?” → OS manages resources; apps consume them\n• Follow-up: “What is a process ID (PID)?” → OS assigns id to running process'
        )
      },
      {
        mustKnow: true, module: '01', terms: 'File, Folder, Directory, Extension, File system',
        q: 'File aur folder kya hain? File extension (.js, .png) ka kya kaam?',
        a: answerBlock_(
          'Folder/directory = almari. File = uske andar rakha document/photo/code. Extension = naam ke end ka label (.pdf, .js) jo hint deta hai “yeh kis tarah ki cheez hai”.',
          'Almost sab kuch file ki form mein store hota hai: code, images, videos, configs, even programs. Folder (directory) unhe tree structure mein organize karta hai — project clean rakhne ka foundation.\n\nFile system = OS ka tarika disk pe files organize/store karne ka (NTFS Windows, APFS mac, ext4 Linux — names yaad optional, idea zaroori).\n\nExtension: app.js → JavaScript likely; photo.png → image; notes.md → markdown text. Yeh convention + OS association hai. Sirf extension badalne se format convert nahi hota (jpg ko png rename ≠ real conversion).\n\nHidden files: Linux/mac pe .env, .git aksar hidden. Windows pe hidden attribute. Config/secrets ke liye common — care with .env (secrets commit mat karo — Git module).\n\nBinary vs text files: .txt/.js padhne layak text; .png/.exe binary. Galat editor se binary kholna garbage dikha sakta hai.',
          '• Directory = folder (same concept)\n• Path tree: root → folders → file\n• Metadata: name, size, modified time, permissions\n• Permissions (Linux idea): read/write/execute for user/group/other\n• Good project layout: src/, public/, README.md, .gitignore\n• MIME types on web related to file type (later HTTP)\n• Mistake: huge node_modules / build folders copy-paste blindly\n• Follow-up: “What is a file descriptor?” → OS handle/number for open file (advanced)'
        )
      },
      {
        mustKnow: true, module: '01', terms: 'Path, Absolute path, Relative path, CWD, Working directory',
        q: 'Path kya hota hai? Absolute vs relative path examples ke saath?',
        a: answerBlock_(
          'Path = address. Absolute = ghar ka poora permanent address. Relative = “yahan se do kadam left” — depends tum abhi kahan khade ho.',
          'Computer ko exact batana padta hai resource kahan hai. Galat path = “file not found” — sabse common beginner error.\n\nAbsolute path: har jagah se same.\n• Windows: C:\\Users\\Hp\\Link\\app.js\n• Linux/mac: /home/hp/Link/app.js\n\nRelative path: current working directory (CWD) se.\n• ./src/app.js = isi folder ke andar src/app.js\n• ../images/logo.png = ek upar folder, phir images\n• . = current folder; .. = parent\n\nTerminal mein pwd (Linux/mac) / cd (change directory) se samajh aata hai tum kahan ho. Scripts/tools aksar CWD pe depend karti hain — isliye “mere laptop pe chala, CI pe nahi” kabhi path issues se hota hai.\n\nURL path (/users/1) alag concept hai (web) — similar “address” idea, different system.',
          '• Always know your working directory before relative paths\n• Prefer clear project-root relative imports in apps (tooling helps)\n• Escape/slashes: Windows \\ vs Unix / — many tools both accept /\n• Spaces in paths need quotes in terminal: \"My Documents\"\n• Symlink = shortcut-like path pointing elsewhere (advanced)\n• Security: path traversal ../ attacks on servers (later security)\n• Interview tip: draw a tiny folder tree and point absolute vs relative\n• Follow-up: “What is PATH env variable?” → where OS searches for programs'
        )
      },
      {
        mustKnow: true, module: '01', terms: 'Terminal, CLI, GUI, Shell, Command, Script',
        q: 'Terminal / command line kya hai? GUI se farq? Engineer kyun use karte hain?',
        a: answerBlock_(
          'GUI = buttons/windows/mouse se baat (restaurant menu). CLI/Terminal = typed commands se baat (seedha kitchen ko order dena). Shell = woh program jo tumhari command samajh ke OS se kaam karwata hai.',
          'Terminal ek text window hai. Tum command likhte ho → Enter → output text mein. Beginners darte hain, lekin yeh superpower hai: tez, precise, repeatable, remote server pe bhi same.\n\nGUI accha hai explore/visual kaam ke liye. CLI accha hai automation, servers, Git, installs, logs, scripting ke liye. Professional workflow dono use karta hai.\n\nShell examples: PowerShell / cmd (Windows), bash/zsh (mac/Linux). “Terminal” window; “shell” uske andar language.\n\nEssential commands (practice):\n• Where am I: pwd (Unix) / cd (print in PowerShell: pwd)\n• List: ls / dir\n• Move: cd folder\n• Make folder: mkdir\n• Clear screen: clear / cls\n• Help: man cmd (Unix) / cmd --help\n\nScript = commands ki saved list (.sh / .ps1) — ek baar likho, bar-bar chalao. CI/CD isi family se judta hai.',
          '• CLI = Command Line Interface; GUI = Graphical User Interface\n• Why engineers: speed, SSH remote, automation, less ambiguity, logs\n• Flags/options: ls -la , git commit -m \"msg\"\n• Exit codes: 0 usually success; non-zero = error (scripts/CI care)\n• Pipes: cmd1 | cmd2 (output to next) — power feature\n• Never paste unknown commands from internet blindly\n• Admin/sudo = elevated power — dangerous if misused\n• Follow-up: “Terminal vs shell vs console?” → related terms, often used loosely; shell interprets commands'
        )
      },
      {
        mustKnow: true, module: '01', terms: 'Bit, Byte, Binary, Encoding, ASCII, UTF-8',
        q: 'Bit aur byte kya hai? Computer 0 aur 1 kyun use karta hai?',
        a: answerBlock_(
          'Har chhoti light switch on/off. Bit = ek switch (0 ya 1). Byte = 8 switches ka bundle. Computer ke andar billions switches jaisa model.',
          'Physics/engineering simple reliable states pasand karti hai — high/low voltage ko hum 1/0 model karte hain. Isliye binary counting. Tumhe manually bits nahi ginne; lekin samajhna zaroori hai kyunki files, images, networks, encryption sab bits pe built hain.\n\nSizes (approx common usage):\n• 8 bits = 1 byte\n• 1024 bytes ≈ 1 KB (binary kilo; marketing sometimes 1000)\n• MB, GB, TB…\n\nText kaise bits banta hai? Encoding maps characters → numbers → bits. Purana ASCII mostly English. Aaj UTF-8 common (Hindi/emoji bhi). Isliye kabhi “????” garbled text = encoding mismatch.\n\nImage/video bhi bits hain, bas structure alag (compression). “Everything is bits” = powerful mental model for computers.',
          '• Binary base-2; decimal base-10; hex base-16 (debugging colors, memory)\n• 1 byte often historically tied to character storage (not always with UTF-8 variable length)\n• Bitrate = bits per second (networks/video)\n• Boolean logic (AND/OR/NOT) builds circuits/conditions\n• Signed integers / overflow later in programming — root is fixed bit width\n• Storage vs speed tradeoffs everywhere\n• Interview: explain why computers use binary without deep electronics\n• Follow-up: “What is UTF-8?” → variable-width Unicode encoding, web default'
        )
      },
      {
        mustKnow: true, module: '01', terms: 'Source code, Compile, Interpret, Runtime, JIT, Machine code, Bytecode',
        q: 'Program “chalna” ka matlab? Compile vs interpret simple mein?',
        a: answerBlock_(
          'Source code = insaan-padhne layak recipe. CPU ko apni language (machine instructions) chahiye. Compile = pehle poori book translate karke rakh lo. Interpret = translator saath khada rehke line-by-line bole. JIT = beech ka smart mix (chalate hue translate/optimize).',
          '“Program chalna” = OS process banata hai, code memory mein aata hai, CPU instructions execute karti hain, input/output hota hai, end/crash/exit.\n\nSource code: tumhari .cpp / .js / .py files.\n\nCompiled languages (typical story): C/C++ → compiler → machine code binary → run fast, distribute executable. Compile-time pe kai errors pakad sakte ho.\n\nInterpreted (typical story): source ko runtime pe language engine padhta hai. JavaScript browsers/Node engine se; Python interpreter se. Aaj pure “only interpret” rare — engines optimize karti hain.\n\nJava-like: compile to bytecode → JVM interpret/JIT. Mental model: multiple stages possible.\n\nRuntime = jab program actually execute ho raha ho. Runtime error example: divide by zero, null access, file missing — compile clean hone ke baad bhi.\n\nImportant: language “compiled or interpreted” strict boxes mein nahi — implementation matter karti hai. Interview mein typical examples + nuance bolo.',
          '• Pipeline: source → build/transpile → runnable form → process → exit\n• Compile-time vs runtime vs logic errors (teen alag buckets)\n• Artifact: .exe / binary / bundle / bytecode\n• Debug symbols / source maps help map running code back to source\n• Performance: native compiled often faster; productivity languages optimize DX\n• Transpile (TypeScript→JS) related but not same as native compile\n• Follow-ups ready:\n  - What is an interpreter?\n  - What is JIT?\n  - Why does JS need an engine (V8)?\n  - What is a runtime environment (browser vs Node)?'
        )
      },
      {
        mustKnow: true, module: '01', terms: 'Localhost, Server, Client, Deployment, Domain, IP, Hosting, Environment',
        q: 'Local pe chalana vs internet pe host karna — farq kya hai?',
        a: answerBlock_(
          'Ghar pe cake banana aur khud khana = local. Bakery mein rakhke customers ko dena = deploy/host. localhost = “yehi ghar ka kitchen address”.',
          'Local development: code tumhare laptop pe chalta hai. URL aksar http://localhost:3000 — sirf tum (ya same network pe limited) access. Fast iteration, debugging easy, secrets safer if careful.\n\nServer: woh computer (ya container) jo requests sun’ta hai aur response deta hai. “Cloud” = kisi company ke data center mein servers rent pe.\n\nDeployment: apna code + config server pe aise rakhna ki users internet se use karein. Hosting platforms: Vercel/Netlify (frontend common), Railway/Render, AWS/GCP/Azure, VPS.\n\nDomain: example.com — yaad rakhne layak naam. Peeche DNS naam ko IP (machine address) se map karta hai. IP = number address; domain = friendly name.\n\nEnvironments: development (local), staging (test copy), production (real users). Alag configs/secrets. Prod pe galt experiment = outage.\n\nPublic hone pe nayi zimmedari: HTTPS, secrets not in code, backups, monitoring, cost, legal/privacy.',
          '• localhost / 127.0.0.1 = loopback to same machine\n• Port (:3000) = us machine pe kaunsa program sun raha hai\n• Deploy ≠ only upload files; often build + env + reverse proxy + SSL\n• Dev vs Prod parity goal: same behavior as much as possible\n• “It works on my machine” classic gap → containers/CI help later\n• DNS propagation / TTL basic awareness\n• Interview story: local test → git push → CI → deploy → users hit domain\n• Follow-up: “What is a port?” → number addressing an app on a host'
        )
      },
      {
        mustKnow: true, module: '01', terms: 'Client, Server, Request, Response, API, Protocol',
        q: 'Client-server simple idea kya hai? (Website kholte waqt)',
        a: answerBlock_(
          'Restaurant: tum client (order dete ho). Kitchen server (order sun’ta hai, dish bhejta hai). Waiter protocol/rules follow karta hai — kaise order, kaise serve.',
          'Website kholte waqt browser aksar client hota hai. Website jis machine/service pe host hai woh server. Client request bhejta hai (“google.com do” / “API se users list do”). Server response bhejta hai (HTML, JSON, error).\n\nYeh model isliye strong hai kyunki:\n• Central data/logic server pe update karo → sab clients benefit\n• Clients thin reh sakte hain (browser)\n• Security/business rules server pe enforce\n\nAPI = agreed contract: kaunse URLs/methods/data format se baat hogi. Protocol = rules of conversation (HTTP common on web).\n\nNot everything client-server dikhta: opening a local PDF offline peer-to-peer games — alag models. Lekin web engineering ka default picture client-server hai.\n\nFrontend = mostly client-side UI. Backend = server-side logic/data. Full-stack = dono. (Labels thode blurry ho sakte hain.)',
          '• Request contains: what you want + headers/auth/body sometimes\n• Response contains: status + headers + body\n• Stateless HTTP idea later: each request carries needed info\n• Reverse roles possible (your machine can be server on localhost)\n• Load balancer = traffic police in front of many servers\n• API types preview: REST, GraphQL, RPC, WebSocket (realtime)\n• Interview: draw box client —arrow request→ server —arrow response→ client\n• Follow-up: “Can a machine be both client and server?” → yes (very common)'
        )
      },
      {
        mustKnow: true, module: '01', terms: 'Text editor, IDE, Compiler toolchain, Version control, Git',
        q: 'Code kahan likhte hain? Notepad vs VS Code / IDE? Git abhi sirf idea level pe kya hai?',
        a: answerBlock_(
          'Code plain text hai — bilkul diary jaisa characters. Simple notepad = sirf pencil. VS Code = desk with lamp, drawers, terminal. IDE = full workshop (editor + build + debug tightly integrated).',
          'Tum kahi bhi text likh sakte ho, lekin professional editor/IDE life easy banata hai: syntax colors, file tree, search, extensions, integrated terminal, git UI, errors underline.\n\nVS Code bohot popular (editor + extensions ≈ IDE feel). JetBrains, Visual Studio, Xcode — stronger built-in tooling depending language.\n\nProject = folder of related files, not single random file. README batata hai kaise chalana hai.\n\nGit (Module 03 detail): version control — code ki history/checkpoints. Commit = save point with message. Branch = parallel experiment. Remote (GitHub) = backup + collaboration. Abhi Module 01 level: “bina Git ke darr = overwrite / lost work / kaun kisne bigada”.\n\nHabit: chhote clear files, meaningful names, mat rakhna secrets in code.',
          '• Editor vs IDE: spectrum, not pure binary\n• Language servers / IntelliSense = smart autocomplete\n• Formatter + linter = style + catch smells\n• Debugger > only console.log (learn early)\n• Repo = project + git history\n• .gitignore = ignore build files, secrets, dependencies dumps\n• Interview: why version control? collaboration, history, bisect bugs, review\n• Follow-up: “What is GitHub vs Git?” → Git = tool; GitHub = hosting service for git repos'
        )
      },
      {
        mustKnow: true, module: '01', terms: 'Bug, Debugging, Reproduce, Stack trace, Regression',
        q: 'Computer “galat” kab hota hai? Debugging ka pehla sahi attitude kya hai?',
        a: answerBlock_(
          'Machine almost always di hui instructions follow karti hai. Galat output = usually unclear requirements, galt logic, galt input, galt environment, ya galt assumption — gusse ka nahi, detective ka kaam.',
          'Bug = unexpected behavior vs what we intended (ya vs what we promised users). Kabhi UI toot’ta, kabhi wrong calculation, kabhi sirf slow.\n\nWrong attitude: randomly change 10 things, hope, without understanding. Right attitude: scientific method.\n\nDebugging loop (yaad rakho aur bolo):\n1) Reproduce — kab fail hota hai? exact steps\n2) Isolate — chhota example / remove noise\n3) Observe — error message, logs, breakpoints, network tab\n4) Hypothesize — “mujhe lagta hai X galt hai”\n5) Change ONE thing\n6) Verify — fix + check nearby features (regression)\n7) Prevent — test / comment / clearer code\n\nRead errors fully — stack trace upar se niche: kaunsi file/line. “It worked yesterday” → kya badla: code, data, env, dependency, path, permissions, timezone, OS update.',
          '• Error classes: syntax, runtime, logic, Heisenbugs (timing), env-only\n• Rubber duck: problem bolke explain karo — gaps nikal aate hain\n• Binary search debug: disable half features to find culprit\n• Logging levels; avoid secret leaks in logs\n• Fix root cause > hide symptom\n• Regression = purana kaam tootna after change\n• Interview gold: calm structured debugging story from your experience\n• Follow-up: “What is a stack trace?” → call chain showing where crash happened'
        )
      },
      {
        mustKnow: true, module: '01', terms: 'Network, LAN, WAN, Internet, ISP, Bandwidth, Latency',
        q: 'Ek computer network aur Internet mein basic farq? Bandwidth vs latency?',
        a: answerBlock_(
          'Chhota colony walkie-talkie group = local network. Sara shehar + desh + duniya ke networks milke highways = Internet. Bandwidth = pipe kitni moti (kitna data ek saath). Latency = pehla drop pahunchne mein kitni der (delay).',
          'Network = 2+ devices connected jo data share kar sakein. Home Wi‑Fi + phones + laptop = LAN (Local Area Network). Office networks bhi LAN/WAN mix.\n\nInternet = network of networks — globally connected using standard protocols. ISP (Jio/Airtel etc.) tumhe internet access deta hai. Website open = tumhara device routers ke through destination server tak packets bhejta hai.\n\nBandwidth: Mbps/Gbps — capacity. Latency: ms — delay. Game/call pe latency hurt karti hai; movie download pe bandwidth zyada matter. Kabhi dono.\n\nIntranet = private org network. VPN = encrypted tunnel feel over public internet (idea level).\n\nModule 04 mein DNS/HTTP detail; yahan foundation: without network, no web apps as we know them.',
          '• Packet = chhota data piece; networks packets forward karte hain\n• IP address identifies hosts; DNS maps names → IP (detail later)\n• Offline-first apps exist but sync needs network\n• Firewall filters traffic\n• “Wi‑Fi slow” diagnose: ISP, router, interference, device, server\n• Interview: Internet ≠ Wi‑Fi; Wi‑Fi is one access technology\n• Follow-ups: What is ISP? What is packet loss? Why video call stutters (latency/jitter)?'
        )
      },
      {
        mustKnow: true, module: '01', terms: 'Motherboard, Bus, Power supply, Peripherals (lite)',
        q: 'Motherboard / peripherals lite mein kya hain? (Hardware big picture complete)',
        a: answerBlock_(
          'Motherboard = ghar ki main flooring + wiring jahan sab rooms connect hote hain. Peripherals = bahar ke tools (keyboard, mouse, printer) jo computer se judte hain.',
          'CPU/RAM/storage kaam tab karte hain jab interconnected hon. Motherboard unhe slots/wires (buses) se jodti hai. Power supply electricity stable form mein deta hai.\n\nPeripherals: input (keyboard, mic), output (monitor, speaker), both (touchscreen). Ports: USB, HDMI, etc.\n\nEngineer ko motherboard solder details ki zaroorat daily coding mein nahi — lekin big picture se “computer system” complete lagta hai jab koi puche “laptop ke andar kya-kya hota hai?”\n\nCloud server bhi same ideas: CPU, memory, disk, network cards — bas door baitha hai.',
          '• Form factors / laptops integrate many parts\n• Bus = communication pathway between components\n• Hot-pluggable USB vs internal parts\n• Failure modes: PSU, overheating, bad RAM (memtest)\n• Enough for SE interview hardware intro; deep EE not required\n• Follow-up bridge: virtual machines / containers abstract hardware later'
        )
      },
      {
        mustKnow: true, module: '01', terms: 'Revision checklist, Mental model',
        q: 'Module 01 clear hai — kisi ke poochne pe kya-kya bina chhootay explain karoge?',
        a: answerBlock_(
          'Viva mode: paper band, 2–3 minute mein poori story sunao — jaise map yaad ho.',
          'Agar neeche har point pe example + common mistake bol sakte ho, Module 01 strong hai. Kisi point pe atak’te ho toh usi sawaal pe wapas aao aur Glossary terms revise karo.\n\nBolke practice script:\n“Computer input-process-output machine hai. Hardware physical hai, software instructions. CPU kaam karta, RAM working table, disk permanent storage. OS beech ka manager hai; kernel uska core. Files folders mein path se milti hain — absolute vs relative. Terminal se typed commands. Data bits/bytes binary. Source code compile/interpret hoke runtime pe chalta. Localhost pe develop, server pe deploy, domain se user aate. Client request, server response. Bugs pe structured debugging.”',
          'Full checklist (nothing left out):\n1) Computer definition + why clarity matters\n2) Hardware vs software vs firmware vs apps\n3) CPU vs RAM vs storage (+ cache/virtual memory lite)\n4) Why OS exists + kernel/process/permissions/drivers\n5) Files, folders, extensions, file systems idea\n6) Absolute vs relative path + CWD bugs\n7) GUI vs CLI/shell + why engineers use terminal\n8) Bits/bytes/binary + encoding UTF-8 idea\n9) Source → compile/interpret/JIT → runtime errors\n10) Local vs localhost vs server vs domain vs deploy vs env\n11) Client-server + request/response + API/protocol lite\n12) Editor/IDE + Git as history idea\n13) Debugging loop + stack traces + regressions\n14) Network vs Internet + bandwidth vs latency\n15) Motherboard/peripherals big picture\n\nFollow-up drill: har point pe “example do” + “common mistake kya hai?”'
        )
      }
    ]
  }];
}

// ================================================================
// MODULE 02 — Programming Fundamentals (COMPLETE + IN-DEPTH)
// ================================================================
function getM02_() {
  return [{
    moduleId: '02',
    title: 'MODULE 02 — Programming Fundamentals',
    subtitle: 'Language-agnostic core: variables, types, control flow, functions, arrays, errors. JS/C++ examples where useful. Hard words pehle define.',
    qa: [
      {
        mustKnow: true, module: '02', terms: 'Statement, Expression, Identifier, Keyword',
        q: 'Programming fundamentals ka matlab kya hai? Statement vs expression?',
        a: answerBlock_(
          'Fundamentals = har language mein repeat hone wale building blocks. Syntax alag, soch same.',
          'Programming = problem ko precise instructions mein todna jo machine execute kare.\n\nStatement = ek complete instruction / command (kaam karo). Example: score = 10; ya if (...) { ... }\nExpression = woh cheez jo evaluate hoke value produce karti hai. Example: 2 + 3, score > 10, getName()\n\nIdentifier = tumhara diya hua naam (variable/function). Keyword = language-reserved word (if, return, class) — identifier ke tor pe mat use karo.\n\nSyntax = grammar rules of a language. Semantics = meaning / behavior.\n\nEngineer mindset: pehle algorithm (steps), phir syntax choose (JS/C++/Python). Language tool hai; logic primary skill hai.',
          '• Same concepts across languages: vars, types, branches, loops, functions, data structures\n• Syntax ≠ thinking; transfer learning is real\n• Read errors as grammar (syntax) vs meaning (runtime/logic)\n• Follow-up: “What is an AST?” → Abstract Syntax Tree; compiler/interpreter internal structure of code (advanced)'
        )
      },
      {
        mustKnow: true, module: '02', terms: 'Variable, Assignment, Declaration, Initialization, Mutable',
        q: 'Variable kya hota hai? Declaration, initialization, assignment farq?',
        a: answerBlock_(
          'Variable = named storage location — value ko naam se refer karna.',
          'Declaration = “yeh naam exist karega” (kabhi type ke saath: int x; / let x).\nInitialization = pehli baar value dena.\nAssignment = baad mein value set/update (= operator).\n\nMutable = badal sakte ho. Immutable binding (const in JS) = us naam ko reassign nahi kar sakte (object ke andar fields alag story).\n\nNaming: userCount clear; x1 vague. Convention: camelCase (JS), snake_case (Python), etc.\n\nMemory intuition: variable → address/slot jahan value (ya reference) rehti hai. Primitive vs reference baad mein clear karenge.\n\nJS: prefer const by default, let when reassignment needed, avoid var (function-scope + hoisting surprises).\nC++: type matter karta hai (static typing); auto possible with care.',
          '• Good names reduce bugs more than clever tricks\n• Uninitialized variables = undefined behavior (C++) / undefined (JS) — dangerous\n• Scope decides WHERE name is visible (next Q)\n• Follow-up: lvalue vs rvalue (C++) — advanced; basics pehle solid'
        )
      },
      {
        mustKnow: true, module: '02', terms: 'Data type, Primitive, Static typing, Dynamic typing, Type coercion',
        q: 'Data types kyun matter karte hain? Static vs dynamic typing? Coercion kya hai?',
        a: answerBlock_(
          'Type = value kis category ki hai + us pe kaunse operations valid hain.',
          'Common primitives (idea level): number/integer/float, string (text), boolean (true/false), null/undefined/nil (absence — language-specific), char (C++).\n\nStatic typing (C++, Java, TypeScript): types mostly compile-time check. Bahut bugs pehle pakadte hain.\nDynamic typing (JS, Python): types runtime pe. Fast likhna; type bugs late mil sakte.\n\nType coercion / implicit conversion = language automatically type badal deti hai (JS: \"5\" + 1 → \"51\"; \"5\" - 1 → 4). Yeh convenience + footgun dono hai.\n\nExplicit conversion better jab intent clear chahiye: Number(\"5\"), parseInt, static_cast (C++).\n\nStrong vs weak typing debates exist; practical rule: know your language’s coercion rules; prefer === in JS; validate inputs at boundaries (API/user).',
          '• Wrong type assumptions = production bugs\n• Boolean context: 0, \"\", null, undefined often falsy in JS\n• Integers vs floats: money pe float careful (precision)\n• Follow-up: What is NaN? → Not a Number; failed numeric ops in JS; NaN !== NaN'
        )
      },
      {
        mustKnow: true, module: '02', terms: 'Operator, Precedence, Associativity, Short-circuit',
        q: 'Operators ka overview? Precedence aur short-circuit evaluation?',
        a: answerBlock_(
          'Operator = values pe kaam karne ka symbol (+, -, &&, ===).',
          'Categories:\n• Arithmetic: + - * / % (modulo = remainder)\n• Comparison: < > <= >= == / === (JS: prefer === strict)\n• Logical: && (AND), || (OR), ! (NOT)\n• Assignment: = += -= ...\n• Unary: -x, !flag, ++/-- (side effects — careful)\n\nOperator precedence = kaun pehle evaluate (jaise * before +). Ambiguity ho toh parentheses use karo — readability > cleverness.\nAssociativity = same precedence pe left-to-right ya right-to-left.\n\nShort-circuit: && mein left false ho toh right evaluate nahi; || mein left true ho toh right skip. Useful: user && user.name; default: value || fallback (nullish ?? better in modern JS for 0/\"\").',
          '• Parentheses for clarity in interviews too\n• % used in cycling, even/odd, hashing buckets\n• Side-effect operators (++ in expressions) avoid in complex lines\n• Follow-up: bitwise operators (& | ^ <<) — flags/optimizations; know existence'
        )
      },
      {
        mustKnow: true, module: '02', terms: 'Control flow, Branching, Condition, Boolean expression',
        q: 'if / else / else-if se control flow kaise design karein? Nested if kab problem?',
        a: answerBlock_(
          'Control flow = program kaunsi line next execute karega — sequence, branch, loop.',
          'Conditional branching: condition (boolean expression) true/false pe alag path.\n\nif (cond) { A } else if (cond2) { B } else { C }\n\nGuard clauses / early return: pehle invalid cases handle karke return — nesting kam, readability zyada (professional style).\n\nNested if hell = deeply indented logic — hard to test. Refactor: combine conditions, switch/lookup table, polymorphism later, extract functions.\n\nSwitch/case: multi-way branch on discrete values (break yaad; fall-through intentional rare).\n\nTruthiness: language-specific. JS mein non-boolean values conditions mein coerce hote hain — explicit comparisons safer for clarity (if (count === 0)).',
          '• Every branch should be intentional — including else\n• Cover edge cases: empty, null, boundaries\n• Prefer readable conditions over clever boolean algebra\n• Follow-up: ternary ?: — short expressions OK; nested ternary avoid'
        )
      },
      {
        mustKnow: true, module: '02', terms: 'Loop, Iteration, Infinite loop, Off-by-one, Break, Continue',
        q: 'Loops kab use karein? for vs while? Off-by-one error kya hai?',
        a: answerBlock_(
          'Loop = same block ko condition tak repeat (iteration = ek round).',
          'for: jab count / index clear ho (0..n-1 arrays).\nwhile: jab end condition pehle se count se better express ho (read until EOF / user quits).\ndo-while: kam se kam ek baar chalna ho.\n\nfor-each / for..of: collection traverse without manual index (safer often).\n\nInfinite loop = condition kabhi false nahi → hang. Debug: ensure progress toward termination (i++, pointer move, queue shrink).\n\nOff-by-one (OBOE): boundary galt — loop < n vs <= n; arrays 0..n-1. Classic bug class.\nbreak = loop se bahar; continue = next iteration. Overuse = spaghetti; structured conditions better.\n\nComplexity preview: loop n times ≈ O(n); nested loops ≈ O(n²) — DSA bridge.',
          '• Prefer clear loop bounds; dry-run with n=0,1,2\n• Mutating collection while iterating = careful (JS/C++ both)\n• Recursion = alternate to loops (Module later / DSA)\n• Follow-up: what is a sentinel value? → special marker ending input loop'
        )
      },
      {
        mustKnow: true, module: '02', terms: 'Function, Parameter, Argument, Return value, Side effect, Pure function',
        q: 'Function kya hai? Parameter vs argument? Pure function / side effect?',
        a: answerBlock_(
          'Function = named reusable block: input lo → kaam → output (optional). Abstraction + DRY (Don’t Repeat Yourself).',
          'Parameter = definition mein placeholder (function add(a, b)).\nArgument = call pe actual value (add(2, 3)).\nReturn value = function ka output (return). Bina return (void/undefined) bhi valid — sirf side effects ke liye.\n\nSide effect = function ke bahar ki state badalna (global var, DOM, disk, network). Zaruri hote hain (I/O), lekin zyada hidden side effects = hard testing.\n\nPure function = same inputs → same output; no side effects. Easy to reason/test. Real apps mix pure core + impure edges.\n\nCall stack intuition: function call → naya frame; return pe peeche. Stack overflow = bahut deep recursion.\n\nSignature / interface = name + params + return contract. Document assumptions (null allowed?).',
          '• Small functions > 200-line monsters\n• One job per function when possible\n• Default params / overloading language-specific\n• Follow-up: pass-by-value vs pass-by-reference — JS objects by reference semantics; C++ references/pointers explicit'
        )
      },
      {
        mustKnow: true, module: '02', terms: 'Scope, Block scope, Global, Shadowing, Lifetime',
        q: 'Scope kya hota hai? Global vs local? Shadowing?',
        a: answerBlock_(
          'Scope = code ke kis hisse mein koi identifier visible/usable hai.',
          'Global scope = almost kahin se accessible — convenient + dangerous (conflicts, hidden coupling).\nFunction/local scope = sirf function ke andar.\nBlock scope = { } ke andar (let/const in JS; C++ blocks). var in JS is function-scoped — legacy footgun.\n\nShadowing = inner scope same naam se outer ko hide kar de. Legal, confusing — avoid casually.\nLifetime = variable kab tak “zinda”; scope se related (stack frames).\n\nEncapsulation foundation: limit visibility. Module systems / classes later isi idea ko scale karte hain.\n\nInterview: draw nested boxes for scopes; point where each name resolves (lexical scope = where written, not where called — JS closures pehle se seed).',
          '• Prefer narrowest scope that works\n• Avoid globals for app state (except rare config)\n• Temporal Dead Zone (JS let/const before init) — know the term\n• Follow-up: closure = function + remembered lexical scope (Module 08 deep)'
        )
      },
      {
        mustKnow: true, module: '02', terms: 'Array, Index, Length, Bounds, Contiguous memory (idea)',
        q: 'Array / list kya hai? Indexing, bounds, common operations?',
        a: answerBlock_(
          'Array = ordered collection of elements, index se access (usually 0-based).',
          'Index = position number. Length/size = kitne elements. Valid indices typically 0 .. length-1.\nOut of bounds = crash/undefined/exception — always validate mentally.\n\nContiguous memory idea (C++ vectors/arrays): elements consecutive → cache-friendly random access O(1).\nDynamic arrays (vector, JS Array): resize under the hood; amortized push.\n\nCommon ops: read/update by index, push/pop ends, iterate, search, insert/delete middle (costly if shifting).\n\nMultidimensional: array of arrays (matrix). Jagged vs rectangular.\n\nStrings related: sequence of characters; immutability language-dependent (JS strings immutable).',
          '• Empty array length 0 — loops must handle\n• Prefer for-of / iterators when index not needed\n• Complexity awareness: middle insert O(n)\n• Follow-up: linked list vs array tradeoffs — DSA Module'
        )
      },
      {
        mustKnow: true, module: '02', terms: 'Object, Record, Key-value, Reference, Null',
        q: 'Object / map-like structures beginner level pe kya hain? Null careful kyun?',
        a: answerBlock_(
          'Object/record = named fields ka group (user.name, user.age). Key → value association.',
          'JS object / Python dict / C++ struct/class instances — details alag, idea: related data ek unit.\nReference: variable object ko “point” karti hai; assign copy reference (shared mutation) vs deep copy.\n\nnull / nullptr / None = intentional absence. Null dereference = crash (NullPointerException / TypeError). Defensive: check before use; optional types / ?. later.\n\nWhen to use array vs object: ordered list vs labeled fields / dictionary lookup.\n\nJSON = textual data format inspired by JS object notation — APIs mein common (Module later).',
          '• Model real entities as structured data early\n• Avoid god-objects with 50 unrelated fields\n• Follow-up: hash map average O(1) lookup — hashing Module'
        )
      },
      {
        mustKnow: true, module: '02', terms: 'Syntax error, Runtime error, Logic error, Exception, Stack trace',
        q: 'Error ke teen major classes? Exception handling ka basic role?',
        a: answerBlock_(
          'Teen buckets: Syntax (grammar), Runtime (chalate waqt crash), Logic (chalta hai lekin galt result).',
          'Syntax error: missing ), typo keyword — often compile/parse fail; program start nahi.\nRuntime error: divide by zero, null access, file missing — during execution.\nLogic error: wrong formula, off-by-one — silent wrong answers; tests catch.\n\nException = control-flow mechanism for error conditions (throw/try/catch/finally). Use for exceptional paths, not normal branching.\n\nStack trace = call chain showing where failure happened — read top meaningful frame in YOUR code.\n\nHandling strategy: fail fast with clear message; don’t empty-catch; log context; user-friendly message vs internal detail separate.\n\nAssertions: develop-time checks for invariants (should never happen).',
          '• Reproduce → read message → minimal failing case\n• Distinguish validation errors (expected) vs bugs\n• Follow-up: checked vs unchecked exceptions (Java) — language-specific'
        )
      },
      {
        mustKnow: true, module: '02', terms: 'Algorithm, Pseudocode, Correctness, Edge case, Complexity (intro)',
        q: 'Algorithm aur pseudocode? Code se pehle kyun design karein?',
        a: answerBlock_(
          'Algorithm = finite, clear steps to solve a problem. Pseudocode = language-free draft of those steps.',
          'Benefits: focus on logic before syntax fights; communicate in interviews; compare approaches.\n\nProperties: input/output defined, terminates, handles edge cases (empty, one element, duplicates, negatives, overflow).\n\nDry-run: chhote example pe manually steps chalao.\n\nComplexity intro (Big-O preview): time/space growth with input size. Brute force vs better — DSA builds this muscle. Module 02 level: nested loops feel slower; avoid premature micro-optimization, but notice obvious O(n²) on huge n.\n\nCorrectness first, then clarity, then performance.',
          '• Write: Input → Steps → Output → Edge cases\n• Interview: talk through algorithm before coding\n• Follow-up: invariant — condition that stays true during algorithm'
        )
      },
      {
        mustKnow: true, module: '02', terms: 'Input/Output, stdin, stdout, Validation, Sanitization',
        q: 'Programs input/output kaise lete hain? Validation kyun zaroori?',
        a: answerBlock_(
          'I/O = bahar se data lena / dena — console, files, network, UI.',
          'stdin/stdout = standard input/output streams (CLI programs).\nFiles: read/write paths + encodings.\nUI/forms: user input always untrusted.\n\nValidation = check data rules pe fit (type, range, required fields) BEFORE processing.\nSanitization = dangerous content clean (esp. web XSS later) — related but not identical.\n\nNever trust client-only validation — server must validate too (security).\n\nError messages: actionable (“age must be 0–120”) not cryptic.',
          '• Boundary of system = validation checkpoint\n• Parse then validate; don’t mix\n• Follow-up: schema validation (Zod/Joi) — later backend'
        )
      },
      {
        mustKnow: true, module: '02', terms: 'DRY, KISS, Comments, Refactor, Technical debt',
        q: 'Readable code ke engineering principles (DRY/KISS)? Comments kab?',
        a: answerBlock_(
          'Code humans read more than write. Clarity = professional baseline.',
          'DRY = Don’t Repeat Yourself — duplicate logic extract function (but don’t abstract prematurely).\nKISS = Keep It Simple — complex cleverness cost maintenance.\nYAGNI = You Aren’t Gonna Need It — speculative features avoid.\n\nComments: WHY explain karo, not WHAT code already says. Outdated comments > no comments (lie).\nRefactor = behavior same, structure better — tests safety net.\nTechnical debt = shortcuts that slow future work — manage consciously.\n\nStyle guides + formatters (Prettier, clang-format) reduce bike-shedding.',
          '• Name well so comments less needed\n• Small PRs / small functions review easier\n• Follow-up: cyclomatic complexity — too many branches = hard to test'
        )
      },
      {
        mustKnow: true, module: '02', terms: 'Boolean algebra, Truth table, De Morgan (lite)',
        q: 'Conditions design karte waqt boolean logic basics?',
        a: answerBlock_(
          'Conditions = logic gates on true/false. Clear boolean thinking bugs kam karti hai.',
          'AND (&&) true jab dono true.\nOR (||) true jab kam se kam ek true.\nNOT (!) invert.\n\nTruth table = saari combinations likhke verify (esp. security/permission logic).\nDe Morgan lite: !(A && B) == !A || !B; !(A || B) == !A && !B — rewrite nested negations.\n\nPrefer positive conditions when readable; avoid double negatives (!!flag sometimes JS idiom for boolean cast).\n\nCompound conditions: extract named booleans: const isAdult = age >= 18; if (isAdult && hasId).',
          '• Named booleans document intent\n• Test boundary values around comparisons\n• Follow-up: bitwise flags packing multiple booleans — systems code'
        )
      },
      {
        mustKnow: true, module: '02', terms: 'Revision checklist Module 02',
        q: 'Module 02 clear hai — bina paper ke kya-kya explain karoge?',
        a: answerBlock_(
          'Viva script: fundamentals ko engineering vocabulary ke saath bolo, hard words define karke.',
          'Practice aloud:\n“Programming = precise instructions. Variables named storage; declaration/init/assignment alag. Types constrain operations; watch coercion. Operators + precedence; short-circuit. Control flow via if/else and loops; avoid off-by-one. Functions abstract behavior; know params vs args, side effects vs pure. Scope limits visibility. Arrays ordered indexed data; objects labeled fields. Errors: syntax/runtime/logic; read stack traces. Algorithms first in pseudocode; validate I/O; write readable DRY/KISS code.”',
          'Checklist:\n1) Statement vs expression\n2) Variable lifecycle + naming\n3) Types + static/dynamic + coercion\n4) Operators + precedence + short-circuit\n5) Branching + guard clauses\n6) Loops + infinite + OBOE\n7) Functions + pure/side effects + call stack idea\n8) Scope + shadowing + globals risk\n9) Arrays/indexing/bounds\n10) Objects/null safety lite\n11) Error classes + exceptions\n12) Algorithm/pseudocode/edge cases\n13) I/O validation\n14) DRY/KISS/comments/refactor\n15) Boolean condition design\n\nNext: Module 03 — Git & engineering habits.'
        )
      }
    ]
  }];
}

// ================================================================
// MODULE 03 — Git & Engineering Habits (COMPLETE + IN-DEPTH)
// ================================================================
function getM03_() {
  return [{
    moduleId: '03',
    title: 'MODULE 03 — Git & Engineering Habits',
    subtitle: 'Code ki history + safe team workflow. Format: Intuition → Engineering (hard words explained) → Must remember. Deep conflict/rebase interviews → Scenario tab.',
    qa: [
      {
        mustKnow: true, module: '03', terms: 'Version control, History, Collaboration, Backup',
        q: 'Version control kya hai? Bina Git ke professional team mein kya toot’ta hai?',
        a: answerBlock_(
          'Version control = time machine + shared notebook for code. Har important change ka checkpoint + kaunne kiya + kyun — sab track.',
          'Bina iske: “final_final_v3.zip”, overwrite, lost work, “mere laptop pe chal raha tha,” kaun kis line pe guilty — chaos.\n\nGit = sabse common version control tool (distributed): har clone ke paas mostly full history hoti hai.\n\nBenefits engineers care about:\n1) History — kab / kya / kyun change hua\n2) Parallel work — branches pe alag features\n3) Collaboration — review before merge\n4) Recovery — galt commit se peeche / bisect bugs\n5) Audit — release pe kya gaya\n\nInterview angle: version control process discipline hai, sirf “backup folder” nahi.',
          '• VCS = Version Control System\n• Checkpoint = commit (idea)\n• Why: history, branches, review, recovery, audit\n• Without it: zip hell + blame fog\n• Git dominant in industry; concepts transfer to other VCS\n• Follow-up: “Centralized vs distributed?” → Git = distributed (local full-ish history)'
        )
      },
      {
        mustKnow: true, module: '03', terms: 'Git, GitHub, GitLab, Bitbucket, Remote hosting',
        q: 'Git aur GitHub mein farq? Ek tool, ek service — clear examples.',
        a: answerBlock_(
          'Git = kitchen knife (tool, local). GitHub = restaurant + storage locker on internet (hosting + collaboration UI).',
          'Git chalta hai tumhare machine pe (CLI / VS Code). Commands: commit, branch, status…\n\nGitHub / GitLab / Bitbucket = remote hosting services:\n• Repo cloud pe rakhna\n• Push/pull\n• Pull Requests / Merge Requests\n• Issues, CI hooks, access control, code review UI\n\nTum Git bina GitHub ke use kar sakte ho (sirf local). GitHub bina Git concepts ke sense nahi banata — UI Git objects pe built hai.\n\nCommon myth: “Maine GitHub pe save kiya = Git seekh liya.” UI click ≠ mental model of commit/branch/remote.',
          '• Git = tool/protocol of history\n• GitHub = popular host + social/review layer\n• Alternatives: GitLab, Bitbucket, self-hosted\n• Local repo can exist with zero remotes\n• Interview: explain both in one breath\n• Follow-up: “What is a remote?” → named URL pointer (often origin)'
        )
      },
      {
        mustKnow: true, module: '03', terms: 'Repository, Working tree, Staging area, Commit, SHA',
        q: 'Repo, working tree, staging, commit — teen zones ka simple model?',
        a: answerBlock_(
          'Restaurant: kitchen counter (working files) → tray “ready to serve” (staging) → photo in album (commit = saved snapshot).',
          'Repository (repo) = project folder + `.git` history database.\n\nWorking tree = abhi disk pe jo files tum edit kar rahe ho.\n\nStaging area (index) = next commit mein kya jayega — intentionally choose files/hunks.\n\nCommit = immutable snapshot + metadata (author, message, parent). Identified by SHA (long hex id); short SHA daily talk mein.\n\nFlow: edit → git add (stage) → git commit.\nSkip mental model = “add kyun?” confusion. Stage = control + clean commits.\n\nUntracked = Git abhi track nahi kar raha. Modified = tracked but changed. Staged = commit ke liye selected.',
          '• Three areas: working → staging → commit history\n• Commit = snapshot + message + parent link(s)\n• SHA uniquely IDs commit\n• .git folder = local database — delete carefully\n• Small focused commits > giant mystery blobs\n• Follow-up: “What does HEAD mean?” → pointer to current commit/branch tip'
        )
      },
      {
        mustKnow: true, module: '03', terms: 'git status, git diff, git log, Mental model',
        q: 'Roz ka pehla habit: status, diff, log — har command kya dikhata hai?',
        a: answerBlock_(
          'Dashboard pehle, drive baad mein. status = kahan khade ho; diff = kya badla; log = history story.',
          'git status: branch kaunsi, clean/dirty, untracked/modified/staged — orientation.\n\ngit diff: working vs staging (unstaged changes). git diff --staged: staging vs last commit.\n\ngit log / git log --oneline: commit history skim. Good before push/PR.\n\nHabit loop before commit:\n1) status\n2) diff (review own change — typos/secrets)\n3) add intentionally\n4) commit with clear message\n5) status again (should be clean or expected leftovers)\n\nEngineers jo yeh skip karte hain aksar galat files / secrets / debug junk commit kar dete hain.',
          '• status = map\n• diff = content delta\n• log = timeline\n• Review staged diff before commit\n• --oneline for quick scan\n• Follow-up: git show <sha> = ek commit ka detail'
        )
      },
      {
        mustKnow: true, module: '03', terms: 'Branch, main/master, Feature branch, HEAD, Switch',
        q: 'Branch kya hai? main pe seedha kaam kyun risky hai?',
        a: answerBlock_(
          'Branch = parallel timeline / notebook page. main = team ki shared “official” line. Feature branch = tumhara experiment page.',
          'Git mein branch mostly ek movable pointer to a commit. Creating branch sasta hai.\n\nDefault branch often `main` (purana `master`). Protected on remotes — force-push blocked ideally.\n\nWhy not commit straight to main:\n• Break shared baseline\n• Hard review\n• Half-done work public\n• Hotfix / release confusion\n\nHappy path: main se naya feature branch → commits → PR → merge back.\n\nHEAD = “tum abhi kis commit/branch pe ho.” switch/checkout branch = HEAD move + working tree update (with care if dirty).',
          '• Branch = pointer to commit (lightweight)\n• One concern per feature branch when possible\n• Protect main\n• Name branches clearly: feature/login, fix/navbar\n• Don’t leave long-lived zombie branches without reason\n• Follow-up: “What is detached HEAD?” → HEAD points to commit not branch name (advanced)'
        )
      },
      {
        mustKnow: true, module: '03', terms: 'Remote, origin, clone, push, pull, fetch',
        q: 'Remote, clone, push, pull, fetch — collaboration ka skeleton?',
        a: answerBlock_(
          'Local diary vs cloud photocopy. clone = pehli copy lao; push = apni commits cloud pe bhejo; fetch = cloud news padho; pull = news lao + apni branch update (usually fetch+merge/rebase).',
          'Remote = named URL (aksar `origin`) jahan shared repo rehti hai.\n\nclone: empty machine pe pehli baar poora repo lao.\n\npush: local commits remote branch pe publish (permissions + protection rules).\n\npull: remote changes apni current branch mein lao (team sync). Exact strategy (merge vs rebase) team policy.\n\nfetch: remote refs update karo but working branch auto-merge mat karo — “dekh lo pehle.”\n\nMental model: local aur remote alag histories sync karti hain; push/pull bridges.\n\nAuth: HTTPS token / SSH keys — passwords era gone.',
          '• origin = default remote name convention\n• push publishes; pull syncs down\n• fetch = update knowledge without merging\n• Always pull/sync before big push on shared branches\n• Never force-push protected main\n• Follow-up: upstream tracking branch (branch.<name>.merge)'
        )
      },
      {
        mustKnow: true, module: '03', terms: '.gitignore, Secrets, node_modules, Env files',
        q: '.gitignore kya karta hai? Secrets commit hone se kaise bachte ho?',
        a: answerBlock_(
          'Ignore list = “yeh files history mein mat ginti.” Build junk, dependencies dump, secrets — bahar rakho.',
          '`.gitignore` patterns batata hai untracked files ko ignore karo. Already tracked file ignore se magic-hide nahi hoti — pehle untrack intentionally.\n\nTypical ignores: `node_modules/`, `dist/`, `.env`, IDE junk, OS junk (`.DS_Store`), logs, coverage.\n\nSecrets (API keys, passwords, private certs):\n• Kabhi commit mat karo\n• `.env` + secrets manager / CI secrets\n• Agar leak ho gaya: rotate keys immediately (assume compromised) — history rewrite alone enough nahi\n\nHabit: commit se pehle `git status` + staged diff scan for tokens.',
          '• Ignore early in project\n• Secrets = rotate if leaked\n• Don’t commit dependency folders\n• Templates: `.env.example` without real values\n• Pre-commit hooks / secret scanners help\n• Follow-up: git rm --cached to stop tracking without deleting file'
        )
      },
      {
        mustKnow: true, module: '03', terms: 'Commit message, Atomic commit, Why not what',
        q: 'Achhi commit message kaise likhte ho? “update” kyun weak hai?',
        a: answerBlock_(
          'Commit message = future tum + reviewer ke liye subject line. “update” = empty calorie.',
          'Good shape (common convention):\n• Short subject (~50 chars): imperative mood — “Add login validation” not “Added…”\n• Optional body: why, tradeoffs, links to issue\n\nAtomic-ish commits: ek logical change per commit jab practical ho — revert/review easy.\n\nWeak: “fix”, “wip”, “asdf”, “final”.\nStrong: “Fix off-by-one in pagination when pageSize=1”.\n\nTeam styles vary (Conventional Commits: feat/fix/chore) — consistency > perfection.\n\nRemember: message history documentation hai jo code comments replace nahi karti, lekin “kyun” capture karti hai.',
          '• Subject = what/why in one line\n• Imperative mood common\n• Avoid junk messages\n• Prefer coherent commits over 40 noise commits OR one mega-blob\n• Amend only unpushed / agreed rewrites\n• Follow-up: squash on merge policies'
        )
      },
      {
        mustKnow: true, module: '03', terms: 'Merge, Fast-forward, Merge commit, Conflict (idea)',
        q: 'Merge kya hota hai? Conflict ka matlab (idea level) — panic mat.',
        a: answerBlock_(
          'Merge = do histories ko ek line pe milana. Conflict = Git same jagah do alag edits dekh ke poochta hai “kaunsa rakhun?”',
          'Jab feature branch main mein milti hai, Git commits combine karta hai.\n\nFast-forward: main seedha aage badh sakti thi (no divergent commits) — pointer slide.\n\nMerge commit: divergent histories → explicit merge node.\n\nConflict: overlapping changes. Yeh failure nahi — decision checkpoint. Open file, markers resolve, test, continue.\n\nModule 03 level: samjho conflict normal hai; deep resolve / rebase wars → Scenario Q&A tab.\n\nHabit: chhote PRs → kam conflicts.',
          '• Merge integrates branches\n• Conflict = human choose correct code\n• Test after resolve\n• Abort exists if panic\n• Smaller branches = easier merges\n• Follow-up: merge vs rebase tradeoff (Scenario depth)'
        )
      },
      {
        mustKnow: true, module: '03', terms: 'Pull Request, Code review, Draft PR, Checks',
        q: 'Pull Request (PR) kya hai? Review habit kyun non-negotiable hai?',
        a: answerBlock_(
          'PR = “yeh changes main mein dalne se pehle dekho” ka formal request + discussion thread.',
          'GitHub pe PR = compare branch → base (usually main). Shows diff, commits, checks (CI), reviewers.\n\nWhy:\n• Catch bugs/secrets early\n• Share knowledge\n• Keep main healthy\n• Document decisions in comments\n\nGood PR: small, clear description (what/why/how test), screenshots if UI, link issues.\nDraft PR = early feedback before “ready”.\n\nReviewer etiquette: kind + specific. Author: respond, don’t take style notes personally.\n\nCI red = mat merge casually — build/test pehle green.',
          '• PR = review gate before merge\n• Description > empty title only\n• Prefer small PRs\n• Draft for early eyes\n• Respect branch protection + required reviews\n• Follow-up: CODEOWNERS / required checks'
        )
      },
      {
        mustKnow: true, module: '03', terms: 'Daily workflow, Feature branch, Sync, PR',
        q: 'Safe daily Git workflow kya hai (junior-friendly happy path)?',
        a: answerBlock_(
          'Recipe: sync → branch → edit/test → commit → push → PR → address review → merge → delete branch.',
          'Typical loop:\n1) checkout main; pull latest\n2) create feature branch\n3) code + run tests locally\n4) status/diff → stage → commit (clear message)\n5) push branch to origin\n6) open PR; wait CI + review\n7) fix review commits; push again\n8) merge via platform; pull main locally; delete old branch\n\nAvoid: huge uncommitted piles; committing to main; force-push shared history; secrets in commits.\n\nIf stuck: status pehle, phir poocho — Git messages aksar next step hint karti hain.',
          '• Always know current branch (status)\n• Pull before branching off stale main\n• Commit often enough to not fear loss\n• PR early if design risk\n• Keep main shippable\n• Follow-up: stash for quick context switch (Scenario also covers)'
        )
      },
      {
        mustKnow: true, module: '03', terms: 'git init, git clone, First-time setup',
        q: 'Naya project: git init vs existing remote se clone — kab kaunsa?',
        a: answerBlock_(
          'clone = kisi existing remote ki copy. init = is folder ko naya repo banao (phir remote add optional).',
          'Starting from GitHub “new repo” empty → often clone then add files, OR init local → add remote → push.\n\nFirst-time machine setup (once):\n• git config user.name / user.email (commits pe dikhe)\n• auth (SSH or credential manager)\n\nVerify: git status inside project; .git exists.\n\nDon’t init inside another git repo accidentally (nested repos pain).\nDon’t commit node_modules on first push.',
          '• clone for existing remotes\n• init for brand-new local history\n• Set identity config early\n• One repo root per project\n• First commit often README + .gitignore\n• Follow-up: bare repos / monorepos (later)'
        )
      },
      {
        mustKnow: true, module: '03', terms: 'Undo lite, restore, unstage, Safe habits',
        q: 'Common “oh no” fixes (safe level): unstage, discard untracked carefully — kya yaad rakho?',
        a: answerBlock_(
          'Git powerful undo tools deta hai — lekin kuch commands data uda sakti hain. Pehle status, phir soft recovery prefer karo.',
          'Safe-ish beginner moves:\n• Unstage: git restore --staged <file> (older: reset HEAD <file>)\n• Discard unstaged working changes to last commit: git restore <file> — DESTRUCTIVE to uncommitted edits\n• Never “clean -fd” casually — deletes untracked\n\nUnpushed commit message fix: amend only if alone on branch & not shared.\nPushed main mistakes: prefer revert (new undo commit) over history rewrite.\n\nRule: shared history rewrite = team communication + lease force only when needed (Scenario depth).',
          '• status before any undo\n• Uncommitted discard = permanent for those edits\n• Prefer revert on shared main\n• Amend/rebase shared branches carefully\n• Practice on a toy repo\n• Follow-up: reflog as seatbelt (advanced but know name)'
        )
      },
      {
        mustKnow: true, module: '03', terms: 'Engineering habits, README, Small PRs, Ask early',
        q: 'Git ke saath kaunsi engineering habits juniors ko roz use karni chahiye?',
        a: answerBlock_(
          'Tool secondary; habits primary: clarity, small steps, communicate, don’t hide risk.',
          'High-leverage habits:\n1) Clear branch + commit + PR descriptions\n2) Small PRs / vertical slices\n3) README / how to run locally updated\n4) Don’t commit secrets / junk\n5) Test before “ready for review”\n6) Ask early on design — Draft PR / spike\n7) Leave code better than found (light)\n8) Respect reviewers’ time — self-review diff pehle\n\nGit enables these habits; replaces soft skills nahi.',
          '• Self-review your PR diff\n• Keep main green mindset\n• Document non-obvious why\n• Communicate rewrites\n• Consistency with team conventions\n• Follow-up: Definition of Done includes tests + notes'
        )
      },
      {
        mustKnow: true, module: '03', terms: 'Revision checklist Module 03',
        q: 'Module 03 clear hai — bina paper ke kya-kya explain karoge?',
        a: answerBlock_(
          'Viva: Git ko tool+habits dono bolo; GitHub alag service; daily happy path crystal clear.',
          'Practice aloud:\n“Version control history + collaboration deta hai. Git local tool; GitHub hosting/review. Repo has working tree, staging, commits (SHA). status/diff/log orientation. Branches isolate work; protect main. Remotes sync via clone/push/pull/fetch. .gitignore + never commit secrets. Clear commit messages. Merge combines history; conflicts are decisions. PRs gate review. Daily: sync main → feature branch → commit → push → PR. Undo carefully; shared history respect.”',
          'Checklist:\n1) Why VCS\n2) Git vs GitHub\n3) Working / staging / commit\n4) status, diff, log\n5) Branches + protect main\n6) Remote/clone/push/pull/fetch\n7) .gitignore + secrets\n8) Commit message quality\n9) Merge + conflict idea\n10) PR + review habit\n11) Daily happy-path workflow\n12) init vs clone\n13) Safe undo lite\n14) Engineering habits around Git\n\nDeep conflict/rebase/force-push interviews → Scenario Q&A tab.'
        )
      }
    ]
  }];
}

// ================================================================
// GLOSSARY DATA — Modules 01–03
// ================================================================
function getGlossaryData_() {
  return getGlossaryM01_().concat(getGlossaryM02_()).concat(getGlossaryM03_());
}

function getGlossaryM01_() {
  return [
    { term: 'Computer', meaning: 'Programmable machine: input → process → output. Clear instructions follow karta hai; guess nahi karta.', topic: '01 Computer Basics' },
    { term: 'Program', meaning: 'Instructions + data jo computer execute karta hai. Algorithm = pehle ka step-by-step plan.', topic: '01 Computer Basics' },
    { term: 'Hardware', meaning: 'Physical parts — CPU, RAM, disk, screen, keyboard — jo chhoo sakte ho.', topic: '01 Computer Basics' },
    { term: 'Software', meaning: 'Instructions/programs — OS, apps, tumhara code — jo hardware ko batati hain kya karna hai.', topic: '01 Computer Basics' },
    { term: 'Firmware', meaning: 'Hardware ke bohot qareeb chhota software (BIOS/UEFI, router). Update carefully.', topic: '01 Computer Basics' },
    { term: 'CPU', meaning: 'Central Processing Unit — instructions execute karta hai (chef). Cores ≈ parallel helpers.', topic: '01 Computer Basics' },
    { term: 'RAM', meaning: 'Fast temporary working memory. Power off = clear (volatile). Full hone pe system slow.', topic: '01 Computer Basics' },
    { term: 'Storage (SSD/HDD)', meaning: 'Long-term files. SSD tez flash; HDD spinning disk aksar slower. Persistent.', topic: '01 Computer Basics' },
    { term: 'Cache', meaning: 'CPU ke bohot tez, chhote pockets — RAM se bhi faster, size chhota.', topic: '01 Computer Basics' },
    { term: 'Virtual memory', meaning: 'RAM kam padne pe disk ko temporary extension jaisa use — safety, lekin slow.', topic: '01 Computer Basics' },
    { term: 'Operating System (OS)', meaning: 'Beech ka manager — processes, memory, files, devices, security permissions.', topic: '01 Computer Basics' },
    { term: 'Kernel', meaning: 'OS ka privileged core jo hardware se nearest baat karta hai.', topic: '01 Computer Basics' },
    { term: 'Process', meaning: 'Program ka running instance memory mein. PID = uska id.', topic: '01 Computer Basics' },
    { term: 'Driver', meaning: 'Software jo OS ko specific hardware (GPU/printer) use karna sikhata hai.', topic: '01 Computer Basics' },
    { term: 'File', meaning: 'Disk pe stored data unit — code, image, config, etc.', topic: '01 Computer Basics' },
    { term: 'Folder / Directory', meaning: 'Files ko tree structure mein group karne ka container.', topic: '01 Computer Basics' },
    { term: 'File system', meaning: 'OS ka tarika disk pe files organize/store karne ka (NTFS, APFS, ext4…).', topic: '01 Computer Basics' },
    { term: 'Extension', meaning: 'Filename ke end ka hint (.js, .png). Rename ≠ real format convert.', topic: '01 Computer Basics' },
    { term: 'Path', meaning: 'File/folder ka address. Absolute = full; Relative = current folder se.', topic: '01 Computer Basics' },
    { term: 'CWD / Working directory', meaning: 'Terminal/process abhi kis folder mein khada hai — relative paths isi pe depend.', topic: '01 Computer Basics' },
    { term: 'Terminal / CLI', meaning: 'Text commands se computer control. Shell commands interpret karti hai.', topic: '01 Computer Basics' },
    { term: 'Shell', meaning: 'woh program (bash/PowerShell) jo typed commands samajh ke OS se kaam karwata hai.', topic: '01 Computer Basics' },
    { term: 'GUI', meaning: 'Graphical UI — windows, buttons, mouse/touch.', topic: '01 Computer Basics' },
    { term: 'Script', meaning: 'Commands ki saved list jo baar-baar automate chala sako.', topic: '01 Computer Basics' },
    { term: 'Bit', meaning: 'Sabse chhoti digital unit: 0 ya 1.', topic: '01 Computer Basics' },
    { term: 'Byte', meaning: '8 bits. File sizes KB/MB/GB isi family se measure.', topic: '01 Computer Basics' },
    { term: 'Binary', meaning: 'Base-2 (0/1). Computers reliable on/off states isi model pe.', topic: '01 Computer Basics' },
    { term: 'UTF-8 / Encoding', meaning: 'Characters ko numbers/bits mein map karne ka rule. UTF-8 web pe common.', topic: '01 Computer Basics' },
    { term: 'Source code', meaning: 'Human-readable code jo tum likhte ho (.js, .cpp, .py…).', topic: '01 Computer Basics' },
    { term: 'Compile', meaning: 'Source ko pehle se machine-friendly form (often binary) mein translate.', topic: '01 Computer Basics' },
    { term: 'Interpret', meaning: 'Runtime pe engine code padhke chalata hai (line-by-line / engine model).', topic: '01 Computer Basics' },
    { term: 'JIT', meaning: 'Just-In-Time — chalate hue translate/optimize (modern JS engines).', topic: '01 Computer Basics' },
    { term: 'Runtime', meaning: 'Jab program actually execute ho raha ho. Runtime errors tab aate hain.', topic: '01 Computer Basics' },
    { term: 'Localhost', meaning: 'Isi machine ka address — usually 127.0.0.1; local testing.', topic: '01 Computer Basics' },
    { term: 'Port', meaning: 'Ek machine pe kaunsa program sun raha hai — number jaise :3000.', topic: '01 Computer Basics' },
    { term: 'Server', meaning: 'Requests sun’ta hai aur responses bhejta hai (computer/service).', topic: '01 Computer Basics' },
    { term: 'Client', meaning: 'Request bhejne wala — browser/app aksar client.', topic: '01 Computer Basics' },
    { term: 'Request / Response', meaning: 'Client maangta hai (request); server jawab deta hai (response).', topic: '01 Computer Basics' },
    { term: 'API', meaning: 'Agreed contract — kaise systems baat karenge (URLs, data shape, rules).', topic: '01 Computer Basics' },
    { term: 'Protocol', meaning: 'Baatcheet ke rules (HTTP web pe common).', topic: '01 Computer Basics' },
    { term: 'Deployment / Hosting', meaning: 'Code ko public/remote server pe users ke liye available banana.', topic: '01 Computer Basics' },
    { term: 'Domain / DNS / IP', meaning: 'Domain = naam; IP = number address; DNS naam→IP map karta hai.', topic: '01 Computer Basics' },
    { term: 'Environment', meaning: 'dev / staging / prod — alag configs & risks; prod = real users.', topic: '01 Computer Basics' },
    { term: 'IDE / Editor', meaning: 'Code likhne ka tool. IDE = editor + build/debug tools tightly integrated.', topic: '01 Computer Basics' },
    { term: 'Git / Version control', meaning: 'Code history/checkpoints + collaboration. GitHub = hosting service for repos.', topic: '01 Computer Basics' },
    { term: 'Bug / Debugging', meaning: 'Unexpected behavior. Debug = reproduce → isolate → fix → verify → prevent.', topic: '01 Computer Basics' },
    { term: 'Stack trace', meaning: 'Error pe call chain — kaunsi file/line se crash aaya.', topic: '01 Computer Basics' },
    { term: 'Regression', meaning: 'Naya change ke baad purana kaam tootna.', topic: '01 Computer Basics' },
    { term: 'Network / LAN / Internet', meaning: 'Network = connected devices. LAN = local. Internet = networks ka global mesh.', topic: '01 Computer Basics' },
    { term: 'Bandwidth vs Latency', meaning: 'Bandwidth = kitna data capacity. Latency = delay (ms). Dono alag problems.', topic: '01 Computer Basics' },
    { term: 'Motherboard / Peripheral', meaning: 'Motherboard parts jodti hai. Peripherals = keyboard/monitor/printer etc.', topic: '01 Computer Basics' }
  ];
}

function getGlossaryM02_() {
  return [
    { term: 'Statement', meaning: 'Complete instruction/command jo execute hoti hai (e.g. assignment, if-block).', topic: '02 Programming' },
    { term: 'Expression', meaning: 'Code jo evaluate hoke value deta hai (2+3, score > 10).', topic: '02 Programming' },
    { term: 'Identifier / Keyword', meaning: 'Identifier = tumhara naam. Keyword = reserved (if, return) — reuse mat karo.', topic: '02 Programming' },
    { term: 'Variable', meaning: 'Named storage for a value. Declaration / initialization / assignment alag steps.', topic: '02 Programming' },
    { term: 'Mutable / Immutable binding', meaning: 'Mutable = badal sakte. const-like binding = reassign nahi (object fields alag).', topic: '02 Programming' },
    { term: 'Data type', meaning: 'Value ki category + valid operations (number, string, boolean…).', topic: '02 Programming' },
    { term: 'Static vs Dynamic typing', meaning: 'Static: compile-time checks (C++/TS). Dynamic: runtime types (JS/Python).', topic: '02 Programming' },
    { term: 'Type coercion', meaning: 'Language automatically type convert karti hai — JS mein footgun common.', topic: '02 Programming' },
    { term: 'Operator precedence', meaning: 'Kaunsa operator pehle evaluate. Ambiguity pe parentheses use karo.', topic: '02 Programming' },
    { term: 'Short-circuit', meaning: '&& / || left result se right skip kar sakte — performance + safe access patterns.', topic: '02 Programming' },
    { term: 'Control flow', meaning: 'Next kaunsi instruction chalegi — sequence, branch, loop.', topic: '02 Programming' },
    { term: 'Guard clause', meaning: 'Early return pe invalid cases handle — nesting kam, clarity zyada.', topic: '02 Programming' },
    { term: 'Iteration / Loop', meaning: 'Block repeat until condition ends. for/while/for-each.', topic: '02 Programming' },
    { term: 'Off-by-one (OBOE)', meaning: 'Boundary galt ( < n vs <= n ). Arrays 0..n-1 yaad rakho.', topic: '02 Programming' },
    { term: 'Infinite loop', meaning: 'Termination condition kabhi false nahi — hang. Ensure progress.', topic: '02 Programming' },
    { term: 'Function', meaning: 'Reusable named block. Params definition; arguments call-time values.', topic: '02 Programming' },
    { term: 'Return value', meaning: 'Function ka output. void/undefined = often side-effect focused.', topic: '02 Programming' },
    { term: 'Side effect', meaning: 'Function ke bahar state change (I/O, globals, DOM).', topic: '02 Programming' },
    { term: 'Pure function', meaning: 'Same input → same output; no side effects. Easy to test.', topic: '02 Programming' },
    { term: 'Call stack', meaning: 'Active function frames ki stack. Deep recursion → stack overflow.', topic: '02 Programming' },
    { term: 'Scope', meaning: 'Identifier kahan visible hai (global / function / block).', topic: '02 Programming' },
    { term: 'Shadowing', meaning: 'Inner same name outer ko hide kar de — confusing; avoid casually.', topic: '02 Programming' },
    { term: 'Array', meaning: 'Ordered collection, index access (usually 0-based), length/bounds matter.', topic: '02 Programming' },
    { term: 'Object / Record', meaning: 'Named fields / key-value structured data (user.name).', topic: '02 Programming' },
    { term: 'Reference', meaning: 'Variable object ko point karti hai; assignment share kar sakti hai.', topic: '02 Programming' },
    { term: 'Null / nullptr / None', meaning: 'Intentional absence. Dereference without check = crash.', topic: '02 Programming' },
    { term: 'Syntax / Runtime / Logic error', meaning: 'Grammar fail / execute crash / wrong result. Teen alag buckets.', topic: '02 Programming' },
    { term: 'Exception', meaning: 'Error control-flow (throw/try/catch). Exceptional paths ke liye.', topic: '02 Programming' },
    { term: 'Algorithm', meaning: 'Finite clear steps to solve a problem (language-independent).', topic: '02 Programming' },
    { term: 'Pseudocode', meaning: 'Algorithm ka informal language-free draft.', topic: '02 Programming' },
    { term: 'Edge case', meaning: 'Boundary/unusual inputs (empty, 0, null, max int) — must test.', topic: '02 Programming' },
    { term: 'Big-O (intro)', meaning: 'Input size badhne pe time/space kaise grow — DSA foundation.', topic: '02 Programming' },
    { term: 'Validation', meaning: 'Input rules check before processing. Trust boundaries pe zaroori.', topic: '02 Programming' },
    { term: 'DRY / KISS / YAGNI', meaning: 'Don’t Repeat / Keep Simple / don’t build unused features.', topic: '02 Programming' },
    { term: 'Refactor', meaning: 'Behavior same, structure better. Tests safety net.', topic: '02 Programming' },
    { term: 'Technical debt', meaning: 'Shortcuts jo future speed khati hain — conscious manage.', topic: '02 Programming' },
    { term: 'Boolean / Truth table', meaning: 'true/false logic. Truth table se compound conditions verify.', topic: '02 Programming' },
    { term: 'De Morgan (lite)', meaning: '!(A&&B)=!A||!B; !(A||B)=!A&&!B — negation rewrite.', topic: '02 Programming' }
  ];
}

function getGlossaryM03_() {
  return [
    { term: 'Version control (VCS)', meaning: 'Code ki history + collaboration system — checkpoints, branches, recovery, audit.', topic: '03 Git' },
    { term: 'Git', meaning: 'Distributed version control tool jo local machine pe history manage karta hai.', topic: '03 Git' },
    { term: 'GitHub / GitLab / Bitbucket', meaning: 'Git repos host + PR/review/CI UI wali remote services. Git tool hai; yeh hosting layers.', topic: '03 Git' },
    { term: 'Repository (repo)', meaning: 'Project files + `.git` history database. Local ya remote ho sakti hai.', topic: '03 Git' },
    { term: 'Working tree', meaning: 'Disk pe abhi jo files tum edit kar rahe ho — commit se pehle wala live workspace.', topic: '03 Git' },
    { term: 'Staging area (index)', meaning: 'Next commit ke liye selected changes. `git add` yahan lata hai.', topic: '03 Git' },
    { term: 'Commit', meaning: 'Immutable snapshot + message + parent link(s). History ka unit.', topic: '03 Git' },
    { term: 'SHA', meaning: 'Commit ka unique hex id. Short SHA daily baat mein use.', topic: '03 Git' },
    { term: 'HEAD', meaning: 'Pointer — tum abhi kis commit/branch tip pe khade ho.', topic: '03 Git' },
    { term: 'Branch', meaning: 'Movable pointer to a commit — parallel timeline for features/fixes.', topic: '03 Git' },
    { term: 'main / master', meaning: 'Default shared branch (aaj aksar main). Protect + review se pehle merge.', topic: '03 Git' },
    { term: 'Feature branch', meaning: 'Temporary branch for one change stream — PR ke baad merge/delete.', topic: '03 Git' },
    { term: 'Remote', meaning: 'Named URL/location of shared repo (often `origin`).', topic: '03 Git' },
    { term: 'origin', meaning: 'Default remote name convention jab tum clone/push karte ho.', topic: '03 Git' },
    { term: 'clone', meaning: 'Remote repo ki pehli local copy banana (history + files).', topic: '03 Git' },
    { term: 'push', meaning: 'Local commits ko remote branch pe publish karna.', topic: '03 Git' },
    { term: 'fetch', meaning: 'Remote refs update — knowledge lao, auto-merge mat karo.', topic: '03 Git' },
    { term: 'pull', meaning: 'Remote changes apni branch mein lao (typically fetch + merge/rebase).', topic: '03 Git' },
    { term: 'git status', meaning: 'Orientation dashboard — branch, dirty/clean, staged/untracked.', topic: '03 Git' },
    { term: 'git diff', meaning: 'Content delta dikhata hai (working vs staged vs commit).', topic: '03 Git' },
    { term: 'git log', meaning: 'Commit history timeline. `--oneline` quick skim.', topic: '03 Git' },
    { term: '.gitignore', meaning: 'Patterns of files Git untracked ignore kare — deps, build, secrets templates.', topic: '03 Git' },
    { term: 'Untracked / Modified / Staged', meaning: 'File states: Git nahi track / badli hui / commit ke liye selected.', topic: '03 Git' },
    { term: 'Merge', meaning: 'Do branch histories ko integrate karna (fast-forward ya merge commit).', topic: '03 Git' },
    { term: 'Merge conflict (idea)', meaning: 'Same lines pe competing edits — human decide karta hai sahi code.', topic: '03 Git' },
    { term: 'Fast-forward', meaning: 'Merge jahan base seedha aage badh sake — extra merge commit ki zarurat nahi.', topic: '03 Git' },
    { term: 'Pull Request (PR)', meaning: 'Branch ko base mein merge se pehle review/discussion/CI gate (GitHub term).', topic: '03 Git' },
    { term: 'Code review', meaning: 'Dusre engineer diff padhke bugs/design/clarity check — team quality habit.', topic: '03 Git' },
    { term: 'Draft PR', meaning: 'Early feedback ke liye “not ready to merge” PR.', topic: '03 Git' },
    { term: 'Commit message', meaning: 'Commit ka subject/body — future readers ke liye what/why; “update” weak.', topic: '03 Git' },
    { term: 'Atomic commit', meaning: 'Ek logical change per commit (practical limit mein) — review/revert easy.', topic: '03 Git' },
    { term: 'git init', meaning: 'Current folder ko naya Git repo banana (`.git` create).', topic: '03 Git' },
    { term: 'Restore / unstage (lite)', meaning: 'Staging hatao ya working changes discard — discard destructive ho sakta.', topic: '03 Git' },
    { term: 'Revert (idea)', meaning: 'Naya commit jo purane change ko undo kare — shared main pe safer undo style.', topic: '03 Git' },
    { term: 'Protected branch', meaning: 'Remote rules: force-push/direct commit block; reviews/checks required.', topic: '03 Git' },
    { term: 'Secret leak habit', meaning: 'Keys commit mat karo; leak = rotate immediately, assume compromised.', topic: '03 Git' }
  ];
}

// ================================================================
// SCENARIO DATA — Phase 1 (Basics + Frontend)
// ================================================================

// ================================================================
// SCENARIO DATA — Basics + Frontend (detailed simple Hinglish)
// ================================================================
function getScenarioBasics_() {
  return [{
    title: 'TOPIC 1 — Basic / Day-to-day Engineering (1–5 YOE)',
    subtitle: 'Git, code review, debugging, ownership, quality, teamwork, environments. Har answer detail mein — pehle kahani/example, phir step-by-step tarika, phir yaad rakhne wali baatein.',
    area: 'Basics',
    qa: [].concat(sbGit_(), sbReview_(), sbDebug_(), sbOwn_(), sbQuality_(), sbTeam_())
  }];
}

function getScenarioFrontend_() {
  return [{
    title: 'TOPIC 2 — Frontend Scenarios (1–5 YOE)',
    subtitle: 'React/JS, browser, forms, performance, auth, data/async, accessibility, build. Har answer detail mein — pehle asaan example, phir asli engineering tarika, phir yaad rakhne wali baatein.',
    area: 'Frontend',
    qa: [].concat(feReact_(), feBrowser_(), feForms_(), fePerf_(), feAuth_(), feData_(), feA11y_(), feBuild_())
  }];
}

// SCENARIO_BATCHES
