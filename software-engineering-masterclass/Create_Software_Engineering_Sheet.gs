/**
 * Software Engineering Learning Sheet — Professional
 * Paste into Apps Script → Save → Run: setup
 * (Timeout? Run setupDsaSql / setupLldJs / setupStoryBank / setupDeepDive alone.)
 *
 * Tabs: Revision | Glossary | Scenario | DSA & SQL | LLD & JS/TS | Story Bank | Deep Dive
 * Content: MODULE 01–05 + Scenario (~120) + Phase 1 (~64) + Phase 2 (~42)
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
  createDsaSql_(ss);
  createLldJs_(ss);
  createStoryBank_(ss);
  createDeepDive_(ss);
  removeUnusedSheets_(ss);

  ss.setActiveSheet(ss.getSheetByName('Revision Q&A'));
  SpreadsheetApp.flush();
  SpreadsheetApp.getUi().alert(
    'Ready!\n\n' +
    'Tabs: Revision + Glossary + Scenario + DSA & SQL + LLD & JS/TS + Story Bank + Deep Dive\n' +
    'Loaded: Module 01–05 + Scenario (~120) + Phase 1 (~64) + Phase 2 (~42)\n' +
    'Hard words Q ke niche; Scenario-style Hinglish paragraphs\n' +
    'Collapse: checkbox / left ▶ / menu SE Learning\n\n' +
    'Timeout? Run setupDsaSql / setupLldJs / setupStoryBank / setupDeepDive alone.\n' +
    'Reload sheet once if menu SE Learning nahi dikhe.'
  );
}

/** Rebuild only DSA & SQL tab (use if full setup() times out) */
function setupDsaSql() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  createDsaSql_(ss);
  removeUnusedSheets_(ss);
  ss.setActiveSheet(ss.getSheetByName('DSA & SQL'));
  SpreadsheetApp.flush();
  SpreadsheetApp.getUi().alert('DSA & SQL tab ready. Reload once if menu missing.');
}

/** Rebuild only LLD & JS/TS tab (use if full setup() times out) */
function setupLldJs() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  createLldJs_(ss);
  removeUnusedSheets_(ss);
  ss.setActiveSheet(ss.getSheetByName('LLD & JS/TS'));
  SpreadsheetApp.flush();
  SpreadsheetApp.getUi().alert('LLD & JS/TS tab ready. Reload once if menu missing.');
}

/** Rebuild only Story Bank tab */
function setupStoryBank() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  createStoryBank_(ss);
  removeUnusedSheets_(ss);
  ss.setActiveSheet(ss.getSheetByName('Story Bank'));
  SpreadsheetApp.flush();
  SpreadsheetApp.getUi().alert('Story Bank tab ready. Reload once if menu missing.');
}

/** Rebuild only Deep Dive tab */
function setupDeepDive() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  createDeepDive_(ss);
  removeUnusedSheets_(ss);
  ss.setActiveSheet(ss.getSheetByName('Deep Dive'));
  SpreadsheetApp.flush();
  SpreadsheetApp.getUi().alert('Deep Dive tab ready. Reload once if menu missing.');
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
    .addSeparator()
    .addItem('Collapse Module 04', 'collapseModule04')
    .addItem('Expand Module 04', 'expandModule04')
    .addSeparator()
    .addItem('Collapse Module 05', 'collapseModule05')
    .addItem('Expand Module 05', 'expandModule05')
    .addSeparator()
    .addSubMenu(
      SpreadsheetApp.getUi().createMenu('Scenario Topics')
        .addItem('Collapse Basics', 'collapseScenarioT1')
        .addItem('Expand Basics', 'expandScenarioT1')
        .addItem('Collapse Frontend', 'collapseScenarioT2')
        .addItem('Expand Frontend', 'expandScenarioT2')
        .addItem('Collapse Backend', 'collapseScenarioT3')
        .addItem('Expand Backend', 'expandScenarioT3')
        .addItem('Collapse System Design', 'collapseScenarioT4')
        .addItem('Expand System Design', 'expandScenarioT4')
        .addItem('Collapse DevOps', 'collapseScenarioT5')
        .addItem('Expand DevOps', 'expandScenarioT5')
    )
    .addSeparator()
    .addSubMenu(
      SpreadsheetApp.getUi().createMenu('DSA & SQL')
        .addItem('Collapse DSA', 'collapseCodingC1')
        .addItem('Expand DSA', 'expandCodingC1')
        .addItem('Collapse SQL', 'collapseCodingC2')
        .addItem('Expand SQL', 'expandCodingC2')
    )
    .addSubMenu(
      SpreadsheetApp.getUi().createMenu('LLD & JS/TS')
        .addItem('Collapse LLD', 'collapseCodingC3')
        .addItem('Expand LLD', 'expandCodingC3')
        .addItem('Collapse JS/TS', 'collapseCodingC4')
        .addItem('Expand JS/TS', 'expandCodingC4')
    )
    .addSeparator()
    .addSubMenu(
      SpreadsheetApp.getUi().createMenu('Story Bank')
        .addItem('Collapse STAR', 'collapsePhaseP1')
        .addItem('Expand STAR', 'expandPhaseP1')
        .addItem('Collapse Project', 'collapsePhaseP2')
        .addItem('Expand Project', 'expandPhaseP2')
    )
    .addSubMenu(
      SpreadsheetApp.getUi().createMenu('Deep Dive')
        .addItem('Collapse SD Walkthroughs', 'collapsePhaseP3')
        .addItem('Expand SD Walkthroughs', 'expandPhaseP3')
        .addItem('Collapse FE Advanced', 'collapsePhaseP4')
        .addItem('Expand FE Advanced', 'expandPhaseP4')
        .addItem('Collapse Security', 'collapsePhaseP5')
        .addItem('Expand Security', 'expandPhaseP5')
    )
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
  var keep = {
    'Revision Q&A': true,
    'Glossary': true,
    'Scenario Q&A': true,
    'DSA & SQL': true,
    'LLD & JS/TS': true,
    'Story Bank': true,
    'Deep Dive': true
  };
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

/** Scenario-only answer: label on own line, then paragraph (modal gold-standard layout) */
function scenarioAnswerBlock_(intuition, engineering, mustRemember, why, connected, kid) {
  return (
    'Intuition:\n' + intuition + '\n\n' +
    'Engineering:\n' + engineering + '\n\n' +
    'Must remember:\n' + mustRemember + '\n\n' +
    'Kyun exist? (bina iske kya toot’ta):\n' + why + '\n\n' +
    'Doosre concepts se connection:\n' + connected + '\n\n' +
    '10-saal bacche ko:\n' + kid
  );
}

/** Bold section labels inside an answer cell */
function setLabeledAnswerCell_(range, text, labels) {
  var builder = SpreadsheetApp.newRichTextValue().setText(text);
  var bold = SpreadsheetApp.newTextStyle().setBold(true).build();
  for (var i = 0; i < labels.length; i++) {
    var label = labels[i];
    var start = text.indexOf(label);
    if (start >= 0) {
      builder.setTextStyle(start, start + label.length, bold);
    }
  }
  range
    .setRichTextValue(builder.build())
    .setFontFamily('Arial').setFontSize(10).setFontColor('#0F172A')
    .setBackground(THEME.aBg).setWrap(true).setVerticalAlignment('top');
}

/** Bold the 6 Scenario section labels inside an answer cell */
function setScenarioAnswerCell_(range, text) {
  setLabeledAnswerCell_(range, text, [
    'Intuition:',
    'Engineering:',
    'Must remember:',
    'Kyun exist? (bina iske kya toot’ta):',
    'Doosre concepts se connection:',
    '10-saal bacche ko:'
  ]);
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
    .setValue('Software Engineering — Revision Q&A  |  Modules 01–05')
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

/** Checkbox tick/untick → collapse/expand (Revision + Scenario + coding tabs) */
function onEdit(e) {
  if (!e || !e.range) return;
  var sheet = e.range.getSheet();
  var name = sheet.getName();
  if (e.range.getColumn() !== 5) return;

  var checked = e.range.getValue() === true;
  var editedRow = e.range.getRow();

  if (name === 'Revision Q&A') {
    var meta;
    try {
      meta = JSON.parse(PropertiesService.getDocumentProperties().getProperty('SE_MODULE_META') || '{}');
    } catch (err) {
      return;
    }
    var moduleId = null;
    Object.keys(meta).forEach(function (id) {
      if (meta[id].titleRow === editedRow) moduleId = id;
    });
    if (!moduleId) return;
    if (checked) collapseModuleById_(moduleId);
    else expandModuleById_(moduleId);
    return;
  }

  if (name === 'Scenario Q&A') {
    var sMeta;
    try {
      sMeta = JSON.parse(PropertiesService.getDocumentProperties().getProperty('SE_SCENARIO_META') || '{}');
    } catch (err2) {
      return;
    }
    var topicId = null;
    Object.keys(sMeta).forEach(function (id) {
      if (sMeta[id].titleRow === editedRow) topicId = id;
    });
    if (!topicId) return;
    if (checked) collapseScenarioTopicById_(topicId);
    else expandScenarioTopicById_(topicId);
    return;
  }

  if (name === 'DSA & SQL') {
    handleCodingCollapseEdit_('DSA & SQL', 'SE_DSA_SQL_META', editedRow, checked);
    return;
  }

  if (name === 'LLD & JS/TS') {
    handleCodingCollapseEdit_('LLD & JS/TS', 'SE_LLD_JS_META', editedRow, checked);
    return;
  }

  if (name === 'Story Bank') {
    handleCodingCollapseEdit_('Story Bank', 'SE_STORY_META', editedRow, checked);
    return;
  }

  if (name === 'Deep Dive') {
    handleCodingCollapseEdit_('Deep Dive', 'SE_DEEP_META', editedRow, checked);
  }
}

function handleCodingCollapseEdit_(sheetName, metaKey, editedRow, checked) {
  var meta;
  try {
    meta = JSON.parse(PropertiesService.getDocumentProperties().getProperty(metaKey) || '{}');
  } catch (err) {
    return;
  }
  var topicId = null;
  Object.keys(meta).forEach(function (id) {
    if (meta[id].titleRow === editedRow) topicId = id;
  });
  if (!topicId) return;
  if (checked) collapseCodingTopicById_(sheetName, metaKey, topicId);
  else expandCodingTopicById_(sheetName, metaKey, topicId);
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

function collapseModule04() {
  collapseModuleById_('04');
  syncCheckbox_('04', true);
}

function expandModule04() {
  expandModuleById_('04');
  syncCheckbox_('04', false);
}

function collapseModule05() {
  collapseModuleById_('05');
  syncCheckbox_('05', true);
}
  
function expandModule05() {
  expandModuleById_('05');
  syncCheckbox_('05', false);
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

function collapseScenarioT1() {
  collapseScenarioTopicById_('T1');
  syncScenarioCheckbox_('T1', true);
}

function expandScenarioT1() {
  expandScenarioTopicById_('T1');
  syncScenarioCheckbox_('T1', false);
}

function collapseScenarioT2() {
  collapseScenarioTopicById_('T2');
  syncScenarioCheckbox_('T2', true);
}

function expandScenarioT2() {
  expandScenarioTopicById_('T2');
  syncScenarioCheckbox_('T2', false);
}

function collapseScenarioT3() {
  collapseScenarioTopicById_('T3');
  syncScenarioCheckbox_('T3', true);
}

function expandScenarioT3() {
  expandScenarioTopicById_('T3');
  syncScenarioCheckbox_('T3', false);
}

function collapseScenarioT4() {
  collapseScenarioTopicById_('T4');
  syncScenarioCheckbox_('T4', true);
}

function expandScenarioT4() {
  expandScenarioTopicById_('T4');
  syncScenarioCheckbox_('T4', false);
}

function collapseScenarioT5() {
  collapseScenarioTopicById_('T5');
  syncScenarioCheckbox_('T5', true);
}

function expandScenarioT5() {
  expandScenarioTopicById_('T5');
  syncScenarioCheckbox_('T5', false);
}

function collapseScenarioTopicById_(topicId) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Scenario Q&A');
  var meta = getScenarioMeta_();
  var m = meta[topicId];
  if (!sheet || !m) {
    SpreadsheetApp.getUi().alert('Scenario topic ' + topicId + ' range not found. Run setup() again.');
    return;
  }
  sheet.hideRows(m.contentStart, m.contentEnd - m.contentStart + 1);
  try {
    var group = sheet.getRowGroup(m.contentStart, 1);
    if (group) group.collapse();
  } catch (err) {}
}

function expandScenarioTopicById_(topicId) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Scenario Q&A');
  var meta = getScenarioMeta_();
  var m = meta[topicId];
  if (!sheet || !m) {
    SpreadsheetApp.getUi().alert('Scenario topic ' + topicId + ' range not found. Run setup() again.');
    return;
  }
  sheet.showRows(m.contentStart, m.contentEnd - m.contentStart + 1);
  try {
    var group = sheet.getRowGroup(m.contentStart, 1);
    if (group) group.expand();
  } catch (err) {}
}

function syncScenarioCheckbox_(topicId, checked) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Scenario Q&A');
  var meta = getScenarioMeta_();
  var m = meta[topicId];
  if (!sheet || !m) return;
  sheet.getRange(m.titleRow, 5).setValue(!!checked);
}

function getScenarioMeta_() {
  try {
    return JSON.parse(PropertiesService.getDocumentProperties().getProperty('SE_SCENARIO_META') || '{}');
  } catch (e) {
    return {};
  }
}

function collapseCodingC1() {
  collapseCodingTopicById_('DSA & SQL', 'SE_DSA_SQL_META', 'C1');
  syncCodingCheckbox_('DSA & SQL', 'SE_DSA_SQL_META', 'C1', true);
}

function expandCodingC1() {
  expandCodingTopicById_('DSA & SQL', 'SE_DSA_SQL_META', 'C1');
  syncCodingCheckbox_('DSA & SQL', 'SE_DSA_SQL_META', 'C1', false);
}

function collapseCodingC2() {
  collapseCodingTopicById_('DSA & SQL', 'SE_DSA_SQL_META', 'C2');
  syncCodingCheckbox_('DSA & SQL', 'SE_DSA_SQL_META', 'C2', true);
}

function expandCodingC2() {
  expandCodingTopicById_('DSA & SQL', 'SE_DSA_SQL_META', 'C2');
  syncCodingCheckbox_('DSA & SQL', 'SE_DSA_SQL_META', 'C2', false);
}

function collapseCodingC3() {
  collapseCodingTopicById_('LLD & JS/TS', 'SE_LLD_JS_META', 'C3');
  syncCodingCheckbox_('LLD & JS/TS', 'SE_LLD_JS_META', 'C3', true);
}

function expandCodingC3() {
  expandCodingTopicById_('LLD & JS/TS', 'SE_LLD_JS_META', 'C3');
  syncCodingCheckbox_('LLD & JS/TS', 'SE_LLD_JS_META', 'C3', false);
}

function collapseCodingC4() {
  collapseCodingTopicById_('LLD & JS/TS', 'SE_LLD_JS_META', 'C4');
  syncCodingCheckbox_('LLD & JS/TS', 'SE_LLD_JS_META', 'C4', true);
}

function expandCodingC4() {
  expandCodingTopicById_('LLD & JS/TS', 'SE_LLD_JS_META', 'C4');
  syncCodingCheckbox_('LLD & JS/TS', 'SE_LLD_JS_META', 'C4', false);
}

function collapsePhaseP1() {
  collapseCodingTopicById_('Story Bank', 'SE_STORY_META', 'P1');
  syncCodingCheckbox_('Story Bank', 'SE_STORY_META', 'P1', true);
}

function expandPhaseP1() {
  expandCodingTopicById_('Story Bank', 'SE_STORY_META', 'P1');
  syncCodingCheckbox_('Story Bank', 'SE_STORY_META', 'P1', false);
}

function collapsePhaseP2() {
  collapseCodingTopicById_('Story Bank', 'SE_STORY_META', 'P2');
  syncCodingCheckbox_('Story Bank', 'SE_STORY_META', 'P2', true);
}

function expandPhaseP2() {
  expandCodingTopicById_('Story Bank', 'SE_STORY_META', 'P2');
  syncCodingCheckbox_('Story Bank', 'SE_STORY_META', 'P2', false);
}

function collapsePhaseP3() {
  collapseCodingTopicById_('Deep Dive', 'SE_DEEP_META', 'P3');
  syncCodingCheckbox_('Deep Dive', 'SE_DEEP_META', 'P3', true);
}

function expandPhaseP3() {
  expandCodingTopicById_('Deep Dive', 'SE_DEEP_META', 'P3');
  syncCodingCheckbox_('Deep Dive', 'SE_DEEP_META', 'P3', false);
}

function collapsePhaseP4() {
  collapseCodingTopicById_('Deep Dive', 'SE_DEEP_META', 'P4');
  syncCodingCheckbox_('Deep Dive', 'SE_DEEP_META', 'P4', true);
}

function expandPhaseP4() {
  expandCodingTopicById_('Deep Dive', 'SE_DEEP_META', 'P4');
  syncCodingCheckbox_('Deep Dive', 'SE_DEEP_META', 'P4', false);
}

function collapsePhaseP5() {
  collapseCodingTopicById_('Deep Dive', 'SE_DEEP_META', 'P5');
  syncCodingCheckbox_('Deep Dive', 'SE_DEEP_META', 'P5', true);
}

function expandPhaseP5() {
  expandCodingTopicById_('Deep Dive', 'SE_DEEP_META', 'P5');
  syncCodingCheckbox_('Deep Dive', 'SE_DEEP_META', 'P5', false);
}

function collapseCodingTopicById_(sheetName, metaKey, topicId) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  var meta = getCodingMeta_(metaKey);
  var m = meta[topicId];
  if (!sheet || !m) {
    SpreadsheetApp.getUi().alert(sheetName + ' topic ' + topicId + ' not found. Run setup / setupDsaSql / setupLldJs.');
    return;
  }
  sheet.hideRows(m.contentStart, m.contentEnd - m.contentStart + 1);
  try {
    var group = sheet.getRowGroup(m.contentStart, 1);
    if (group) group.collapse();
  } catch (err) {}
}

function expandCodingTopicById_(sheetName, metaKey, topicId) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  var meta = getCodingMeta_(metaKey);
  var m = meta[topicId];
  if (!sheet || !m) {
    SpreadsheetApp.getUi().alert(sheetName + ' topic ' + topicId + ' not found. Run setup / setupDsaSql / setupLldJs.');
    return;
  }
  sheet.showRows(m.contentStart, m.contentEnd - m.contentStart + 1);
  try {
    var group = sheet.getRowGroup(m.contentStart, 1);
    if (group) group.expand();
  } catch (err) {}
}

function syncCodingCheckbox_(sheetName, metaKey, topicId, checked) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  var meta = getCodingMeta_(metaKey);
  var m = meta[topicId];
  if (!sheet || !m) return;
  sheet.getRange(m.titleRow, 5).setValue(!!checked);
}

function getCodingMeta_(metaKey) {
  try {
    return JSON.parse(PropertiesService.getDocumentProperties().getProperty(metaKey) || '{}');
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
    .setValue('Glossary — Modules 01–05 terms (hard words explained)')
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
// SCENARIO Q&A — Basics + Frontend + Backend + System Design + DevOps/Cloud
// ================================================================
function createScenarioQA_(ss) {
  var sheet = getOrRecreateSheet_(ss, 'Scenario Q&A', 2);
  sheet.setTabColor('#B45309');

  // Col E = Minimize? (topic collapse) | Col F = Padh liya? (per question)
  sheet.setColumnWidth(1, 92);
  sheet.setColumnWidth(2, 680);
  sheet.setColumnWidth(3, 180);
  sheet.setColumnWidth(4, 120);
  sheet.setColumnWidth(5, 160);
  sheet.setColumnWidth(6, 110);

  sheet.getRange('A1:F1').merge();
  sheet.getRange('A1')
    .setValue('Scenario Q&A  |  ~120 clear interview scenarios  |  Basics + FE + BE + System Design + DevOps  |  Why / Connected / 10yo')
    .setFontFamily('Arial').setFontSize(16).setFontWeight('bold')
    .setFontColor(THEME.headerFg).setBackground(THEME.navy)
    .setVerticalAlignment('middle');
  sheet.setRowHeight(1, 42);

  sheet.getRange('A2:F2').merge();
  sheet.getRange('A2')
    .setValue('Answers: easy Hinglish paragraphs  |  Hard words Q ke niche  |  Collapse: left ▶/▼  OR  topic “Minimize?”  |  Har Q pe “Padh liya?” tick  |  menu SE Learning → Scenario Topics')
    .setFontFamily('Arial').setFontSize(10).setFontColor('#334155')
    .setBackground(THEME.accentSoft).setVerticalAlignment('middle');
  sheet.setRowHeight(2, 28);

  sheet.getRange(3, 1, 1, 6)
    .setValues([['Type', 'Content', 'Key Terms', 'Area', 'Minimize?', 'Padh liya?']])
    .setFontFamily('Arial').setFontSize(11).setFontWeight('bold')
    .setFontColor(THEME.headerFg).setBackground(THEME.slate)
    .setHorizontalAlignment('center').setVerticalAlignment('middle');
  sheet.setRowHeight(3, 28);
  sheet.setFrozenRows(3);

  var topics = getScenarioData_();
  var row = 4;
  var qCounter = 0;
  var scenarioMeta = {}; // T1..T5 -> { titleRow, contentStart, contentEnd }

  topics.forEach(function (topic, topicIndex) {
    var topicId = topic.topicId || ('T' + (topicIndex + 1));

    var titleRow = row;
    var topicBg = THEME.moduleColors[topicIndex % THEME.moduleColors.length];
    sheet.getRange(row, 1, 1, 4).merge();
    sheet.getRange(row, 1)
      .setValue(topic.title + '   ←  Minimize? (E) = collapse  |  Padh liya? (F) = har Q pe')
      .setFontFamily('Arial').setFontSize(12).setFontWeight('bold')
      .setFontColor('#FFFFFF')
      .setBackground(topicBg)
      .setVerticalAlignment('middle');

    var checkCell = sheet.getRange(row, 5);
    checkCell.insertCheckboxes();
    checkCell.setValue(false);
    checkCell.setBackground('#FEF3C7');
    checkCell.setHorizontalAlignment('center');
    checkCell.setVerticalAlignment('middle');
    checkCell.setNote('Minimize? Tick = topic collapse (hide Q&A). Untick = expand.');

    sheet.getRange(row, 6).setBackground(topicBg);

    sheet.setRowHeight(row, 36);
    row++;

    var contentStart = row;

    if (topic.subtitle) {
      sheet.getRange(row, 1, 1, 6).merge();
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

      sheet.getRange(row, 5).setBackground(THEME.qBg);

      var readCell = sheet.getRange(row, 6);
      readCell.insertCheckboxes();
      readCell.setValue(false);
      readCell.setBackground(THEME.qBg);
      readCell.setHorizontalAlignment('center');
      readCell.setVerticalAlignment('middle');
      readCell.setNote('Padh liya? Tick = yeh question padh liya.');

      sheet.setRowHeight(row, 44);
      row++;

      sheet.getRange(row, 1)
        .setValue('Answer')
        .setFontFamily('Arial').setFontSize(10).setFontWeight('bold')
        .setFontColor(THEME.aTagFg).setBackground(THEME.aTagBg)
        .setHorizontalAlignment('center').setVerticalAlignment('top');

      sheet.getRange(row, 2, 1, 3).merge();
      setScenarioAnswerCell_(sheet.getRange(row, 2), item.a);

      sheet.getRange(row, 5).setBackground(THEME.aBg);
      sheet.getRange(row, 6).setBackground(THEME.aBg);

      var lines = Math.max(10, Math.ceil(String(item.a).length / 85));
      sheet.setRowHeight(row, Math.min(48 + lines * 14, 409));
      row++;

      sheet.getRange(row, 1, 1, 6).setBackground('#FFFFFF');
      sheet.setRowHeight(row, 8);
      row++;
    });

    var contentEnd = row - 1;
    scenarioMeta[topicId] = {
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

  sheet.getRange(row, 1, 1, 6).merge();
  sheet.getRange(row, 1)
    .setValue('Legend: Orange = Interview scenario  |  Teal = Must Know  |  Total: ' + qCounter + '  |  Minimize? = topic collapse  |  Padh liya? = per question  |  left ▶ / menu SE Learning')
    .setFontFamily('Arial').setFontSize(9).setFontColor(THEME.muted)
    .setBackground(THEME.rowOdd).setVerticalAlignment('middle');

  sheet.getRange(3, 1, Math.max(1, row - 3), 6)
    .setBorder(true, true, true, true, true, true, THEME.border, SpreadsheetApp.BorderStyle.SOLID);

  PropertiesService.getDocumentProperties().setProperty(
    'SE_SCENARIO_META',
    JSON.stringify(scenarioMeta)
  );
}

function getScenarioData_() {
  return getScenarioBasics_()
    .concat(getScenarioFrontend_())
    .concat(getScenarioBackend_())
    .concat(getScenarioSystemDesign_())
    .concat(getScenarioDevOps_());
}

// ================================================================
// PHASE 1 — DSA & SQL + LLD & JS/TS (collapsible coding lab tabs)
// ================================================================
function createDsaSql_(ss) {
  createCollapsibleCodingSheet_(ss, {
    name: 'DSA & SQL',
    index: 3,
    tabColor: '#1D4ED8',
    title: 'DSA & SQL  |  Phase 1 coding lab  |  Why / Connected / 10yo',
    subtitle: 'Answers: easy Hinglish paragraphs (Scenario-style)  |  Hard words Q ke niche  |  Collapse: ▶ / Minimize? / menu SE Learning → DSA & SQL',
    legendPrefix: 'DSA + SQL  |  Scenario-style sections',
    metaKey: 'SE_DSA_SQL_META',
    topics: getDsaSqlData_(),
    setAnswer: setScenarioAnswerCell_
  });
}

function createLldJs_(ss) {
  createCollapsibleCodingSheet_(ss, {
    name: 'LLD & JS/TS',
    index: 4,
    tabColor: '#7C3AED',
    title: 'LLD & JS/TS  |  Phase 1 design + language depth  |  Why / Connected / 10yo',
    subtitle: 'Answers: easy Hinglish paragraphs (Scenario-style)  |  Hard words Q ke niche  |  Collapse: ▶ / Minimize? / menu SE Learning → LLD & JS/TS',
    legendPrefix: 'LLD + JS/TS  |  Scenario-style sections',
    metaKey: 'SE_LLD_JS_META',
    topics: getLldJsData_(),
    setAnswer: setScenarioAnswerCell_
  });
}

/** Shared chrome for Phase 1 coding tabs (Scenario layout clone) */
function createCollapsibleCodingSheet_(ss, opts) {
  var sheet = getOrRecreateSheet_(ss, opts.name, opts.index);
  sheet.setTabColor(opts.tabColor);

  sheet.setColumnWidth(1, 92);
  sheet.setColumnWidth(2, 680);
  sheet.setColumnWidth(3, 180);
  sheet.setColumnWidth(4, 120);
  sheet.setColumnWidth(5, 160);

  sheet.getRange('A1:E1').merge();
  sheet.getRange('A1')
    .setValue(opts.title)
    .setFontFamily('Arial').setFontSize(16).setFontWeight('bold')
    .setFontColor(THEME.headerFg).setBackground(THEME.navy)
    .setVerticalAlignment('middle');
  sheet.setRowHeight(1, 42);

  sheet.getRange('A2:E2').merge();
  sheet.getRange('A2')
    .setValue(opts.subtitle)
    .setFontFamily('Arial').setFontSize(10).setFontColor('#334155')
    .setBackground(THEME.accentSoft).setVerticalAlignment('middle');
  sheet.setRowHeight(2, 28);

  sheet.getRange(3, 1, 1, 5)
    .setValues([['Type', 'Content', 'Key Terms', 'Area', 'Minimize?']])
    .setFontFamily('Arial').setFontSize(11).setFontWeight('bold')
    .setFontColor(THEME.headerFg).setBackground(THEME.slate)
    .setHorizontalAlignment('center').setVerticalAlignment('middle');
  sheet.setRowHeight(3, 28);
  sheet.setFrozenRows(3);

  var topics = opts.topics || [];
  var row = 4;
  var qCounter = 0;
  var meta = {};

  topics.forEach(function (topic, topicIndex) {
    var topicId = topic.topicId || ('C' + (topicIndex + 1));
    var titleRow = row;

    sheet.getRange(row, 1, 1, 4).merge();
    sheet.getRange(row, 1)
      .setValue(topic.title + '   ←  checkbox right pe tick = minimize')
      .setFontFamily('Arial').setFontSize(12).setFontWeight('bold')
      .setFontColor('#FFFFFF')
      .setBackground(THEME.moduleColors[topicIndex % THEME.moduleColors.length])
      .setVerticalAlignment('middle');

    var checkCell = sheet.getRange(row, 5);
    checkCell.insertCheckboxes();
    checkCell.setValue(false);
    checkCell.setBackground('#FEF3C7');
    checkCell.setHorizontalAlignment('center');
    checkCell.setVerticalAlignment('middle');
    checkCell.setNote('Minimize? Tick = topic collapse. Untick = expand.');

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
        .setValue(item.area || topic.area || '')
        .setFontFamily('Arial').setFontSize(9).setFontColor('#334155')
        .setBackground(THEME.qBg).setWrap(true).setVerticalAlignment('middle');

      sheet.getRange(row, 5).setBackground(THEME.qBg);
      var qLines = Math.max(3, Math.ceil(String(item.q).length / 90));
      sheet.setRowHeight(row, Math.min(36 + qLines * 12, 160));
      row++;

      sheet.getRange(row, 1)
        .setValue('Answer')
        .setFontFamily('Arial').setFontSize(10).setFontWeight('bold')
        .setFontColor(THEME.aTagFg).setBackground(THEME.aTagBg)
        .setHorizontalAlignment('center').setVerticalAlignment('top');

      sheet.getRange(row, 2, 1, 3).merge();
      opts.setAnswer(sheet.getRange(row, 2), item.a);

      sheet.getRange(row, 5).setBackground(THEME.aBg);

      var lines = Math.max(10, Math.ceil(String(item.a).length / 85));
      sheet.setRowHeight(row, Math.min(48 + lines * 14, 409));
      row++;

      sheet.getRange(row, 1, 1, 5).setBackground('#FFFFFF');
      sheet.setRowHeight(row, 8);
      row++;
    });

    var contentEnd = row - 1;
    meta[topicId] = {
      titleRow: titleRow,
      contentStart: contentStart,
      contentEnd: contentEnd,
      checkA1: 'E' + titleRow
    };

    if (contentEnd >= contentStart) {
      try {
        sheet.getRange(contentStart, 1, contentEnd - contentStart + 1, 1).shiftRowGroupDepth(1);
      } catch (e) {}
    }
  });

  sheet.getRange(row, 1, 1, 5).merge();
  sheet.getRange(row, 1)
    .setValue('Legend: Orange = Interview Q  |  Teal = Must Know  |  Total: ' + qCounter + '  |  ' + opts.legendPrefix + '  |  Collapse = checkbox / ▶ / menu')
    .setFontFamily('Arial').setFontSize(9).setFontColor(THEME.muted)
    .setBackground(THEME.rowOdd).setVerticalAlignment('middle');

  sheet.getRange(3, 1, Math.max(1, row - 3), 5)
    .setBorder(true, true, true, true, true, true, THEME.border, SpreadsheetApp.BorderStyle.SOLID);

  PropertiesService.getDocumentProperties().setProperty(opts.metaKey, JSON.stringify(meta));
}

function getDsaSqlData_() {
  return getCodingDsa_().concat(getCodingSql_());
}

function getLldJsData_() {
  return getCodingLld_().concat(getCodingJsTs_());
}

// ================================================================
// PHASE 2 — Story Bank + Deep Dive
// ================================================================
function createStoryBank_(ss) {
  createCollapsibleCodingSheet_(ss, {
    name: 'Story Bank',
    index: 5,
    tabColor: '#BE123C',
    title: 'Story Bank  |  Phase 2  |  STAR + Project deep-dive  |  Why / Connected / 10yo',
    subtitle: 'Apni stories fill-in prompts se likho (___). Answers Scenario-style Hinglish. Collapse: ▶ / Minimize? / menu SE Learning → Story Bank',
    legendPrefix: 'STAR + Project  |  fill-in your metrics',
    metaKey: 'SE_STORY_META',
    topics: getStoryBankData_(),
    setAnswer: setScenarioAnswerCell_
  });
}

function createDeepDive_(ss) {
  createCollapsibleCodingSheet_(ss, {
    name: 'Deep Dive',
    index: 6,
    tabColor: '#15803D',
    title: 'Deep Dive  |  Phase 2  |  Full SD + FE advanced + Security  |  Why / Connected / 10yo',
    subtitle: 'Level rounds. Scenario-style paragraphs. Hard words Q ke niche. Collapse: ▶ / Minimize? / menu SE Learning → Deep Dive',
    legendPrefix: 'SD walkthroughs + FE advanced + Security',
    metaKey: 'SE_DEEP_META',
    topics: getDeepDiveData_(),
    setAnswer: setScenarioAnswerCell_
  });
}

function getStoryBankData_() {
  return getPhaseStar_().concat(getPhaseProject_());
}

function getDeepDiveData_() {
  return getPhaseSdWalkthroughs_().concat(getPhaseFeAdvanced_()).concat(getPhaseSecurity_());
}

function getRevisionData_() {
  return getM01_().concat(getM02_()).concat(getM03_()).concat(getM04_()).concat(getM05_());
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
          '• Empty array length 0 — loops must handle\n• Prefer for-of / iterators when index not needed\n• Complexity awareness: middle insert O(n)\n• Follow-up: linked list vs array tradeoffs — tab “DSA & SQL”'
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
          'Checklist:\n1) Why VCS\n2) Git vs GitHub\n3) Working / staging / commit\n4) status, diff, log\n5) Branches + protect main\n6) Remote/clone/push/pull/fetch\n7) .gitignore + secrets\n8) Commit message quality\n9) Merge + conflict idea\n10) PR + review habit\n11) Daily happy-path workflow\n12) init vs clone\n13) Safe undo lite\n14) Engineering habits around Git\n\nNext: Module 04 — Web, HTTP & DNS. Deep conflict/rebase/force-push interviews → Scenario Q&A tab.'
        )
      }
    ]
  }];
}

// ================================================================
// MODULE 04 — Web, HTTP & DNS (COMPLETE + IN-DEPTH)
// ================================================================
function getM04_() {
  return [{
    moduleId: '04',
    title: 'MODULE 04 — Web, HTTP & DNS',
    subtitle: 'Browser se server tak ka rasta. Format: Intuition → Engineering (hard words explained) → Must remember. Deep CORS/auth/perf → Scenario tab.',
    qa: [
      {
        mustKnow: true, module: '04', terms: 'Web, Browser, Server, Request, Response',
        q: 'Website open karte waqt end-to-end kya hota hai? (Browser → DNS → HTTP → page)',
        a: answerBlock_(
          'Address bar mein naam likho → phonebook se number milta hai → messenger message bhejta hai → dukaan jawab + saman bhejti hai → browser screen pe sajata hai.',
          'Rough flow:\n1) User URL type/click karta hai (https://example.com/path).\n2) DNS domain naam → IP address resolve karta hai.\n3) Browser server se TCP (+ TLS for HTTPS) connection banata hai.\n4) HTTP request bhejta hai: method + path + headers (+ body sometimes).\n5) Server process karta hai → HTTP response: status + headers + body (HTML/JSON/file).\n6) Browser HTML parse karta hai; CSS/JS/images ke liye aur requests fire hoti hain.\n7) Page paint; JS interactivity add karti hai.\n\nModule 01 pe client-server idea thi; yahan web pe concrete path: naam (DNS) + baatcheet rules (HTTP) + security layer (HTTPS).',
          '• End-to-end: URL → DNS → connect → HTTP request/response → render (+ more assets)\n• Browser = client; website host = server (often many servers behind one domain)\n• Failures alag jagah: DNS fail, TLS/cert fail, 4xx/5xx, slow network, broken JS\n• DevTools Network tab isi journey ko dikhata hai\n• Interview: draw boxes Client —DNS→ IP —HTTP→ Server\n• Follow-up: “Why so many requests for one page?” → HTML references CSS/JS/images/fonts'
        )
      },
      {
        mustKnow: true, module: '04', terms: 'URL, Scheme, Host, Path, Query, Fragment',
        q: 'URL ke pieces kya hain? https://example.com:443/path?q=1#top explain karo.',
        a: answerBlock_(
          'URL = complete address slip: kaunsa rasta (https), kaunsa ghar (host), kaunsa kamra (path), extra notes (query), page ke andar bookmark (fragment).',
          'Parts:\n• Scheme/protocol: https / http — kaise baat hogi\n• Host: example.com (domain) ya IP\n• Port: :443 default HTTPS; :80 default HTTP; :3000 local apps\n• Path: /users/42 — server pe kaunsa resource/route\n• Query string: ?sort=asc&page=2 — filters/options (key=value)\n• Fragment: #section — browser-side jump; usually server ko nahi jata\n\nAbsolute URL poora address. Relative /about — current origin pe depend.\n\nEncoding: spaces/special chars percent-encode (%20). Wrong encoding = broken APIs.',
          '• URL ≠ sirf “website name”; path + query matter for APIs\n• Origin ≈ scheme + host + port (CORS/security ke liye critical)\n• Default ports aksar hide hote hain in browser bar\n• Never put secrets in query (logs, Referer, history)\n• Interview: parse a URL on whiteboard into pieces\n• Follow-up: “What is a slug?” → readable path segment like /posts/my-title'
        )
      },
      {
        mustKnow: true, module: '04', terms: 'DNS, Domain, IP, Resolver, TTL',
        q: 'DNS kya karta hai? Domain se IP kaise milti hai?',
        a: answerBlock_(
          'DNS = Internet ka phonebook. Tum naam yaad rakhte ho (google.com); machines number (IP) se baat karti hain.',
          'Flow (idea):\n1) Browser/OS DNS resolver se poochta hai: example.com ka IP?\n2) Cache miss pe recursive resolver root/TLD/authoritative nameservers se jawab laata hai.\n3) A/AAAA record → IPv4/IPv6 address.\n4) TTL batata hai cache kitni der valid — change ke baad propagation delay isi wajah se.\n\nCNAME = alias (www → another name). MX = mail. Engineers aksar A/CNAME + TTL care karte hain.\n\nLocal /etc/hosts (or Windows hosts) temporary override — debugging trick.\n\nFailure modes: wrong DNS, expired TTL confusion, NXDOMAIN (name doesn’t exist), corporate DNS filter.',
          '• DNS maps human names → IPs (and other records)\n• Caching + TTL = speed + delayed updates after DNS change\n• Domain registrar ≠ always DNS host (can be separate)\n• Diagnose: dig/nslookup; “site down” sometimes DNS not app\n• Interview: DNS is not HTTP; it happens before/around connection\n• Follow-up: “What is DNS propagation?” → caches worldwide slowly refresh'
        )
      },
      {
        mustKnow: true, module: '04', terms: 'IP, Port, TCP, Packet, Connection',
        q: 'IP aur port ka farq? TCP connection ka simple role web pe?',
        a: answerBlock_(
          'IP = building address. Port = building mein kaunsa office/door. TCP = reliable courier jo packets order mein deliver karne ki koshish karta hai.',
          'IP address machine/host identify karta hai network pe. Ek machine pe kai programs sun sakte hain — port number choose karta hai kaunsa.\n\nCommon: 443 HTTPS, 80 HTTP, 22 SSH, 3000/5173 local dev.\n\nTCP (idea): connection-oriented — handshake, ordered delivery, retransmission on loss. Web browsing mostly TCP pe HTTP(S) chalata hai.\n\nUDP alag (fast, less guarantees) — games/video/DNS often; deep later.\n\nFirewall/security groups ports block kar sakte hain — “API unreachable” kabhi code bug nahi, network allowlist.',
          '• Host = IP (or name→IP); App = port on that host\n• localhost:3000 = same machine, port 3000\n• TCP gives reliable byte stream under HTTP (mental model)\n• Packet loss → retries/latency; not always “server slow”\n• Interview: draw IP + port as address + door\n• Follow-up: “What is a reverse proxy?” → front door that routes to many back ports/services'
        )
      },
      {
        mustKnow: true, module: '04', terms: 'HTTP, Method, Status, Header, Body, Stateless',
        q: 'HTTP kya hai? Request aur response mein kya-kya hota hai?',
        a: answerBlock_(
          'HTTP = web pe baatcheet ka standard format: “mujhe yeh chahiye” (request) aur “yeh lo / nahi / error” (response).',
          'Request typically:\n• Method: GET/POST/…\n• Path/URL\n• Headers: metadata (Host, Content-Type, Authorization, Cookie, User-Agent…)\n• Body: optional payload (form/JSON) — GET usually no body\n\nResponse:\n• Status code: 200, 404, 500…\n• Headers: Content-Type, Cache-Control, Set-Cookie…\n• Body: HTML, JSON, image bytes, empty\n\nStateless idea: har HTTP request mostly self-contained; server “pehli baat yaad” cookies/tokens/sessions se rebuild karta hai.\n\nHTTP/1.1 vs HTTP/2 multiplexing — performance detail later; semantics same family.',
          '• HTTP = application protocol on top of TCP (usually)\n• Headers = metadata; body = main content\n• Stateless ≠ no login; auth/session carried per request\n• Content-Type batata hai body ka format\n• Interview: read a raw request/response once in DevTools\n• Follow-up: “What is a proxy?” → middlebox that forwards HTTP'
        )
      },
      {
        mustKnow: true, module: '04', terms: 'GET, POST, PUT, PATCH, DELETE, Idempotent',
        q: 'HTTP methods GET, POST, PUT, PATCH, DELETE — kab kaunsa?',
        a: answerBlock_(
          'GET = dekhna/lana. POST = naya kaam/create submit. PUT/PATCH = update. DELETE = hatao. Verb = intent.',
          'Practical map:\n• GET — read/fetch; safe-ish (should not change server state); cacheable often\n• POST — create or “do action”; not idempotent by default (dobara = dubara effect)\n• PUT — replace resource (idempotent idea: same put dubara ≈ same end state)\n• PATCH — partial update\n• DELETE — remove (often idempotent-ish: already gone = still gone)\n\nBrowsers forms historically GET/POST. APIs REST style pe methods use karti hain — teams conventions follow.\n\nIdempotent = same request bar-bar → same effect (retries safer). GET/PUT/DELETE often designed idempotent; POST careful.\n\nWrong method misuse: GET se delete — caches/prefetch disaster.',
          '• Choose method by intent, not habit\n• GET should not mutate important state\n• POST retries can duplicate — need idempotency keys sometimes\n• REST uses nouns in paths + verbs in methods (/orders + POST)\n• Interview: explain idempotent with payment example\n• Follow-up: “What is HEAD/OPTIONS?” → HEAD=headers only; OPTIONS=allowed methods/CORS preflight'
        )
      },
      {
        mustKnow: true, module: '04', terms: 'Status code, 2xx, 3xx, 4xx, 5xx',
        q: 'HTTP status codes ke major groups? 200, 301, 400, 401, 403, 404, 500 kab?',
        a: answerBlock_(
          'Status = report card number. 2xx success, 3xx redirect, 4xx tumhari request problem, 5xx server side problem.',
          'Must-know codes:\n• 200 OK — success with body often\n• 201 Created — create success\n• 204 No Content — success, empty body\n• 301/302 — redirect elsewhere\n• 400 Bad Request — malformed/invalid input\n• 401 Unauthorized — not authenticated (who are you?)\n• 403 Forbidden — authenticated but not allowed\n• 404 Not Found — resource missing / hidden\n• 409 Conflict — state conflict (version/duplicate)\n• 429 Too Many Requests — rate limit\n• 500 Internal Server Error — server bug/crash\n• 502/503 — bad gateway / unavailable (infra)\n\nFrontend: status se UX branch. Backend: correct code = clients + monitoring sahi react.',
          '• 4xx = client-fixable usually; 5xx = server/ops\n• 401 vs 403 interview classic — authn vs authz\n• Don’t return 200 with error buried only in JSON if you can help it (team conventions vary)\n• Redirect chains hurt performance/SEO\n• Follow-up: “What is 304 Not Modified?” → cache revalidation success'
        )
      },
      {
        mustKnow: true, module: '04', terms: 'Header, Content-Type, Authorization, Cache-Control, User-Agent',
        q: 'HTTP headers kyun important hain? Content-Type aur Authorization examples?',
        a: answerBlock_(
          'Headers = envelope pe sticky notes: “andar JSON hai”, “main authenticated hoon”, “cache mat karo”, “main Chrome hoon”.',
          'Common request headers:\n• Host — kaunsa virtual host\n• Accept — client kya samajh sakta hai\n• Content-Type — body format (application/json, multipart/form-data)\n• Authorization — Bearer token / other schemes\n• Cookie — browser auto-sends for that site\n• User-Agent — client identity (rough)\n\nCommon response headers:\n• Content-Type — body type\n• Set-Cookie — store cookie\n• Cache-Control / ETag — caching\n• Location — redirect target\n• Access-Control-* — CORS\n\nMismatch Content-Type = parse errors. Missing Auth = 401. Wrong CORS headers = browser blocks.',
          '• Headers carry cross-cutting concerns (auth, cache, content negotiation)\n• Always set Content-Type correctly for APIs\n• Never log Authorization secrets\n• Cache headers change CDN/browser behavior dramatically\n• Interview: name 5 headers and why each exists\n• Follow-up: “What is Content-Encoding?” → gzip/br compression of body'
        )
      },
      {
        mustKnow: true, module: '04', terms: 'HTTPS, TLS, Certificate, Encryption, MITM',
        q: 'HTTPS HTTP se kaise alag hai? TLS/certificate ka simple role?',
        a: answerBlock_(
          'HTTPS = HTTP + lock. Raste pe koi beech mein padh/badal na sake easily; tum sahi website se baat kar rahe ho — certificate se trust.',
          'TLS (Transport Layer Security) connection encrypt karta hai + server identity verify (certificate chain, CA trust).\n\nWithout HTTPS: Wi‑Fi pe passwords/tokens sniffable (MITM risk). Mixed content: HTTPS page pe HTTP asset — browser warn/block.\n\nCert expiry / wrong domain = scary browser interstitial — users bounce; ops must renew.\n\nLocalhost http often OK for dev; production public sites → HTTPS expected. Let’s Encrypt etc. automate certs.\n\nHTTPS ≠ app security complete — still need authz, XSS/CSRF defenses, secret hygiene.',
          '• HTTPS = HTTP over TLS\n• Cert proves server identity for that domain (within CA trust model)\n• Encrypts data in transit — not data at rest on server\n• Padlock ≠ “website safe/ethical”; only transport trust signal\n• Interview: HTTP cleartext vs HTTPS encrypted channel\n• Follow-up: “What is HSTS?” → browser force-HTTPS policy header'
        )
      },
      {
        mustKnow: true, module: '04', terms: 'Cookie, Session, httpOnly, SameSite',
        q: 'Cookie aur session ka idea level farq? Login “yaad” kaise rehti hai?',
        a: answerBlock_(
          'HTTP stateless hai — har request nayi lagti hai. Cookie = chhota note jo browser site ke saath wapas bhejta hai taaki server tumhe pehchaan sake.',
          'Cookie: server Set-Cookie bhejta hai; browser store karta hai; matching requests pe Cookie header auto-add.\n\nSession idea: server (ya token) pe user state; cookie often holds session id OR client holds token (localStorage/cookie).\n\nSecurity flags (names yaad):\n• Secure — sirf HTTPS\n• HttpOnly — JS padh nahi sakta (XSS se theft harder)\n• SameSite — cross-site request pe cookie kab jaye (CSRF angle)\n\nlocalStorage tokens XSS pe JS-readable — trade-offs Scenario/FE depth.\n\nLogout = invalidate server session + clear cookie/token.',
          '• Cookies are small key-value browser storage sent automatically\n• Session = server-side (or token-based) continuity across requests\n• Prefer HttpOnly+Secure cookies for classic session cookies when possible\n• Don’t store long-lived secrets carelessly on client\n• Interview: why HTTP needs cookies/tokens for “logged in”\n• Follow-up: “What is CSRF?” → evil site triggers your browser to send your cookies'
        )
      },
      {
        mustKnow: true, module: '04', terms: 'REST, Resource, JSON, API endpoint',
        q: 'REST API simple mein kya hai? JSON body kyun common hai?',
        a: answerBlock_(
          'REST-style API = resources (nouns) pe HTTP methods se CRUD-ish operations. JSON = dono sides samajhne layak structured text data.',
          'Example:\n• GET /users/12 — read user\n• POST /users — create\n• PATCH /users/12 — update fields\n• DELETE /users/12 — delete\n\nEndpoint = URL path (+ method) jo ek capability expose karta hai.\n\nJSON (JavaScript Object Notation): {"id":12,"name":"Asha"} — language-agnostic, easy parse, APIs + configs pe dominant.\n\nNot only REST: GraphQL, RPC, WebSockets — alag contracts. Junior baseline: REST+JSON+status codes.\n\nVersioning / breaking changes: /v1/... or careful field evolution — Scenario depth.',
          '• Resource-oriented URLs + HTTP verbs\n• JSON = common request/response body format\n• Contract = shape + status + errors documented\n• Idempotency and validation still your job\n• Interview: design 4 endpoints for a todo app\n• Follow-up: “What is an OpenAPI/Swagger spec?” → machine-readable API contract'
        )
      },
      {
        mustKnow: true, module: '04', terms: 'CORS, Origin, Preflight, Access-Control',
        q: 'CORS kya hai? Postman pe chalega, browser pe block — kyun?',
        a: answerBlock_(
          'Browser security guard: website A se website B ke API ko casually call karna dangerous ho sakta hai. CORS = B explicitly allow kare A ko.',
          'Origin = scheme + host + port. Same-origin policy: by default page sirf apne origin se full freedom.\n\nCross-origin request pe browser CORS headers check karta hai (Access-Control-Allow-Origin, Methods, Headers, Credentials).\n\nPreflight: complex requests pe pehle OPTIONS poochta hai “allowed?”.\n\nPostman/curl browser nahi — same-origin policy apply nahi → “API works in Postman” ≠ browser OK.\n\nFix on server/gateway (allowlist origins). Chrome extension “disable CORS” is not a real fix.\n\nCredentials + wildcard * together usually invalid.',
          '• CORS is browser-enforced; servers opt-in via headers\n• Diagnose with DevTools: OPTIONS fail / missing ACAO\n• Don’t confuse CORS error with server 500 — read Network carefully\n• Dev proxy can help local DX but prod needs real CORS/config\n• Interview: why browsers care more than Postman\n• Follow-up: “What is same-site vs same-origin?” → related but not identical'
        )
      },
      {
        mustKnow: true, module: '04', terms: 'DevTools Network, Waterfall, Status, Timing, HAR',
        q: 'Chrome DevTools Network tab se web issues kaise debug karte ho?',
        a: answerBlock_(
          'Network tab = traffic camera: kaunsi request gayi, status kya, kitni der, response kya, fail kahan.',
          'Checklist:\n1) Reproduce with Network open; Disable cache when needed\n2) Find failing request — red status / CORS / (failed)\n3) Headers: request URL, method, auth, content-type\n4) Response body: error message / HTML unexpectedly\n5) Timing: DNS, connect, SSL, TTFB, download\n6) Waterfall: what blocks what; huge images; duplicate calls\n7) Initiator: kaunsa JS file call trigger kiya\n\nThrottle 3G for realism. Copy as cURL to share with backend.\n\nHAR export = shareable network log (strip secrets).',
          '• Status + response body beat guessing\n• Separate DNS/TLS/TTFB vs download time\n• Duplicate requests → React Strict Mode / missing deps / double submit\n• Interview story: used Network to prove CORS vs 401 vs timeout\n• Follow-up: “What is TTFB?” → time to first byte from server'
        )
      },
      {
        mustKnow: true, module: '04', terms: 'Cache, CDN, Browser cache, Cache-Control',
        q: 'Browser cache aur CDN ka basic idea? Kab stale content dikhta hai?',
        a: answerBlock_(
          'Cache = yaad rakhna taaki dubara door se na laana pade. CDN = duniya bhar ke edge stores jo static files user ke qareeb se dete hain.',
          'Browser cache: Cache-Control, ETag, Last-Modified se decide karta hai reuse vs revalidate.\n\nCDN: images/JS/CSS/html sometimes — lower latency globally; origin pe load kam.\n\nStale bugs: HTML cached pointing to old hashed assets; or aggressive cache after deploy. Fix: hashed filenames for assets, short TTL for HTML, purge CDN, version query.\n\n“Hard refresh” / disable cache while debugging — don’t confuse users’ real cache behavior.\n\nAuth APIs often Cache-Control: no-store.',
          '• Cache trades freshness for speed\n• Headers control browser/CDN behavior\n• Deploy + cache = classic “I fixed but users see old”\n• CDN great for static; dynamic still hits origin/API\n• Interview: why fingerprinting assets (app.abc123.js) helps\n• Follow-up: “What is a cache purge?” → force CDN to drop old object'
        )
      },
      {
        mustKnow: true, module: '04', terms: 'Revision checklist Module 04',
        q: 'Module 04 clear hai — bina paper ke kya-kya explain karoge?',
        a: answerBlock_(
          'Viva: URL pieces → DNS → TCP/TLS → HTTP request/response → status/headers → cookies/API/CORS → Network tab debug.',
          'Practice aloud:\n“User URL deta hai. DNS naam ko IP banata hai. Browser HTTPS pe TLS se secure channel banata hai. HTTP method+path+headers(+body) bhejta hai; server status+headers+body lautata hai. Methods intent batate hain; status groups success/redirect/client/server errors. Headers auth/cache/content type control karte hain. Cookies/tokens login continuity. REST+JSON common API style. CORS browser cross-origin allowlist. DevTools Network se diagnose. Cache/CDN speed vs freshness.”',
          'Checklist:\n1) End-to-end page load\n2) URL anatomy\n3) DNS + TTL idea\n4) IP vs port + TCP lite\n5) HTTP request/response shape\n6) Methods + idempotency lite\n7) Status code groups + 401/403/404/500\n8) Important headers\n9) HTTPS/TLS/cert lite\n10) Cookies/session idea\n11) REST + JSON\n12) CORS vs Postman\n13) DevTools Network workflow\n14) Cache/CDN freshness\n\nNext: Module 05 — Web Platform (HTML, CSS, DOM & Accessibility). Deep auth/CORS/perf incidents → Scenario Q&A / Frontend topics.'
        )
      }
    ]
  }];
}

// ================================================================
// MODULE 05 — Web Platform (HTML, CSS, DOM & Accessibility)
// ================================================================
function getM05_() {
  return [{
    moduleId: '05',
    title: 'MODULE 05 — Web Platform (HTML, CSS, DOM & Accessibility)',
    subtitle: 'Whole-team shared literacy: document → style → live tree → a11y/security. Format: Intuition → Engineering → Must remember. Framework deep-dives → Scenario / later modules.',
    qa: [
      {
        mustKnow: true, module: '05', terms: 'HTML, Document, Markup, Browser render',
        q: 'HTML kya hai? Team ke liye yeh “design tool” kyun nahi — document contract kyun hai?',
        a: answerBlock_(
          'HTML = page ka skeleton contract. Browser is markup ko padhke structure banata hai; paint/CSS/JS uske upar aate hain.',
          'HTTP (Module 04) response body aksar HTML hoti hai. Browser parse karta hai → DOM tree → layout/paint.\n\nHTML tags meaning convey karte hain: heading, paragraph, link, form — “div soup” se farq.\n\nTeam angle (FE + BE):\n• BE templates / SSR HTML ship karte ho → semantic + escape habits tumhari responsibility\n• FE components ultimately same document model pe map hote hain\n• Reviews mein structure pehle, decoration baad mein\n\nHTML ≠ Figma. Design tools visuals; HTML machine-readable structure + accessibility hooks.',
          '• HTML = markup language for document structure\n• Browser builds a tree; CSS/JS consume that tree\n• Prefer meaningful structure over only <div>/<span>\n• Interview: HTML is the contract between server/content and browser\n• Follow-up: “What is a doctype?” → tells browser standards mode parsing'
        )
      },
      {
        mustKnow: true, module: '05', terms: 'Semantic HTML, header, main, nav, footer, article',
        q: 'Semantic HTML kyun matter karta hai? Team review bar kya hona chahiye?',
        a: answerBlock_(
          'Sahi tag = meaning built-in. Screen readers, SEO, maintainers — sabko kam guesswork.',
          'Semantic examples: <header>, <nav>, <main>, <section>, <article>, <aside>, <footer>, <button>, <h1>–<h6>.\n\nBenefits:\n• Accessibility: assistive tech landmarks/roles better\n• SEO/crawlers structure samajhte hain\n• CSS/JS selectors meaning pe based ho sakte\n• Onboarding: naya engineer layout jaldi padh leta hai\n\nAnti-pattern: har cheez <div> + role invent; ya heading levels skip (h1 → h4).\n\nGoogle-style team bar: “Does this markup communicate intent without reading CSS?”',
          '• Use the right element for the job\n• One main landmark per page ideally\n• Heading hierarchy = outline of the page\n• <div> is fine as last resort layout wrapper — not default for everything\n• Interview: semantic HTML helps a11y + clarity\n• Follow-up: “When is a div OK?” → purely presentational grouping with no better element'
        )
      },
      {
        mustKnow: true, module: '05', terms: 'a, img, alt, button, list, link text',
        q: 'Links, images, lists, buttons — safe defaults kya hain jo har PR pe insist karo?',
        a: answerBlock_(
          'User-facing controls clear + accessible hone chahiye. “Click here” aur blank alt = team quality fail.',
          'Links (<a href>): destination clear; meaningful link text (not only “click here”). New tab: warn users; relnoopener on target=_blank.\n\nImages (<img>): alt text purpose describe kare (decorative → alt=\"\"). Width/height ya aspect-ratio → CLS kam.\n\nLists: related items pe <ul>/<ol>/<li> — screen readers count announce karte.\n\nButtons vs links: navigate = <a>; action on page = <button>. Fake button <div onclick> keyboard/a11y tod’ta hai.\n\nIcons-only controls: accessible name (aria-label / visually hidden text).',
          '• Meaningful link text; honest alt\n• Prefer native <button>/<a> over clickable divs\n• Lists for lists — not paragraphs of bullets only in CSS\n• target=_blank → rel=\"noopener noreferrer\" habit\n• Interview: button vs link intent\n• Follow-up: “What is CLS?” → layout shift when images load without reserved space'
        )
      },
      {
        mustKnow: true, module: '05', terms: 'Form, label, input, name, validation, server truth',
        q: 'Forms mein label/name/value kyun zaroori? Client vs server validation team habit?',
        a: answerBlock_(
          'Form = structured user input. Label click/tap se focus; name= fields server/API ko identify karti hain.',
          '<label for=\"email\"> + <input id=\"email\" name=\"email\"> — a11y + usability.\n\nname/value pairs submit / fetch body banate hain. Without name, field often not sent.\n\nClient validation = fast UX (required, type=email). Server validation = security truth — attacker Postman se bypass karega.\n\nTeam habit: never trust client-only checks for authz, money, PII. Show clear errors; preserve user input on fail.\n\nAutocomplete, inputmode, type — mobile keyboards + password managers help.',
          '• Every control needs a label (visible or accessible name)\n• name attributes are the wire contract for many submissions\n• Client = UX; server = authority\n• Interview: why client validation is not enough\n• Follow-up: “What is CSRF on forms?” → cross-site submit with user cookies (Module 04 cookie angle)'
        )
      },
      {
        mustKnow: true, module: '05', terms: 'id, class, attribute, data-*, selector hook',
        q: 'id, class, attributes — CSS/JS/tests ke hooks kaise design karein bina over-coupling ke?',
        a: answerBlock_(
          'Attributes = element pe metadata stickers. id = unique hook; class = reusable style/behavior group.',
          'id: page pe unique (fragment links, label for). Avoid styling only by id (specificity wars).\n\nclass: CSS styling + sometimes JS hooks. Prefer meaningful names (BEM-ish / design-system tokens) over .red-box.\n\ndata-* attributes: JS behavior hooks without overloading classes meant for visuals.\n\nTest selectors: fragile CSS class churn → prefer role/label (Testing Library) or stable data-testid policy agreed by team.\n\nOver-coupling: JS tightly bound to presentational class names → redesign breaks behavior.',
          '• id unique; classes reusable\n• Separate styling hooks from behavior/test hooks when needed\n• Team convention > personal taste\n• Interview: why data-testid / roles beat brittle CSS selectors\n• Follow-up: “What is progressive enhancement?” → HTML works first; JS improves'
        )
      },
      {
        mustKnow: true, module: '05', terms: 'CSS, presentation, cascade, stylesheet',
        q: 'CSS ka role kya hai? Structure se presentation alag kyun rakhte hain?',
        a: answerBlock_(
          'CSS = look & layout instructions. HTML meaning; CSS pehnava. Alag rakhne se theme/reuse/a11y easier.',
          'Stylesheets cascade: browser defaults → author CSS → inline (careful). Multiple rules fight → cascade + specificity decide winner.\n\nSeparation benefits: same HTML, different themes; design system tokens; content folks less break styles.\n\nInline styles + !important spam = maintenance debt. Prefer classes + components.\n\nTeam: CSS-in-JS / Tailwind / plain CSS — tool secondary; cascade mental model primary.',
          '• CSS styles the document; HTML structures it\n• Cascade = how competing rules resolve\n• Prefer maintainable systems over one-off inline hacks\n• Interview: why separation of concerns still matters\n• Follow-up: “What is a CSS reset/normalize?” → reduce browser default inconsistencies'
        )
      },
      {
        mustKnow: true, module: '05', terms: 'Box model, content, padding, border, margin',
        q: 'CSS box model kya hai? Layout bugs teams kaise hit karti hain?',
        a: answerBlock_(
          'Har element ek box: content + padding + border + margin. Galat box math = overflow, unexpected width.',
          'content = text/image area. padding = andar ki padding. border = edge. margin = bahar gap (collapse quirks possible).\n\nbox-sizing: content-box (default classic) vs border-box (width includes padding/border) — teams often set border-box globally.\n\nCommon bugs: width 100% + padding overflow; margin collapse between siblings/parent; unexpected scrollbars.\n\nDevTools box model diagram = fastest teacher.',
          '• Memorize content → padding → border → margin\n• Prefer border-box for predictable widths\n• Margin ≠ padding (outside vs inside)\n• Interview: draw the box model\n• Follow-up: “What is margin collapse?” → vertical margins can combine unexpectedly'
        )
      },
      {
        mustKnow: true, module: '05', terms: 'Layout, normal flow, flexbox, responsive, mobile-first',
        q: 'Layout lite: normal flow, flexbox idea, responsive/mobile-first habit?',
        a: answerBlock_(
          'Normal flow = blocks stack, text inline. Flexbox = ek dimension mein align/distribute. Responsive = screen size pe adapt.',
          'Normal flow pehle samjho — position absolute har jagah = chaos.\n\nFlexbox: row/column, gap, justify/align — nav bars, toolbars, card rows. Grid = two-dimensional (deeper later).\n\nResponsive: media queries, fluid widths, rem/clamp. Mobile-first = base styles small screens, min-width queries enhance.\n\nTeam habit: design for thumbs + narrow viewports; don’t ship desktop-only nav.\n\nPrefer CSS layout over JS measuring when possible (perf + simplicity).',
          '• Flow first, flex for 1D alignment, grid for 2D when needed\n• Mobile-first media queries\n• Avoid layout thrash from JS where CSS suffices\n• Interview: flex vs grid one-liner\n• Follow-up: “What is a breakpoint?” → viewport width where layout rules change'
        )
      },
      {
        mustKnow: true, module: '05', terms: 'Specificity, cascade, !important, stylesheet order',
        q: '“CSS apply nahi hua” — specificity/cascade se kaise debug karoge?',
        a: answerBlock_(
          'Browser pehle cascade order + specificity se jeetne wala rule choose karta hai. Tumhari rule haar sakti hai.',
          'Debug order:\n1) Elements panel → computed styles — rule struck through?\n2) Selector match? typo/class missing?\n3) Specificity: inline > id > class/attr > element (rough)\n4) Source order: equal specificity → later wins\n5) !important wars — last resort; design-system escape hatch only\n6) Shadow DOM / iframe — different trees\n\nTeam: reduce specificity arms race with consistent class strategy; avoid IDs for styling.',
          '• Read Computed + Styles pane before guessing\n• Lower specificity systems scale better\n• !important is a smell unless intentional override layer\n• Interview: explain why a class lost to an id\n• Follow-up: “What is inheritance in CSS?” → some properties flow to children (color), many don’t (margin)'
        )
      },
      {
        mustKnow: true, module: '05', terms: 'DOM, node, tree, parse, live document',
        q: 'DOM kya hai? HTML source se farq? FE aur BE dono ko kyun samajhna chahiye?',
        a: answerBlock_(
          'DOM = browser ki live object tree of the page. Source HTML ek text snapshot; DOM woh tree jo abhi memory mein hai.',
          'Parse HTML → nodes (elements, text). JS querySelector / frameworks isi tree ko read/update karte hain.\n\nSource vs live: JS se node add/remove → DOM badla; View Source purana text dikha sakta. Elements panel = live.\n\nBE angle: SSR HTML initial DOM seed hai; hydration assumes match. XSS = attacker DOM/script injection.\n\nFE angle: unnecessary DOM thrash = jank; virtual DOM libs minimize updates (idea).\n\nWhole team: bugs “HTML file theek, UI galt” → often JS mutated DOM or CSS.',
          '• DOM = live document tree API\n• Elements shows live; View Source shows original response text\n• FE mutates DOM; BE must emit safe initial HTML\n• Interview: DOM ≠ HTML file on disk\n• Follow-up: “What is hydration?” → client JS attaches to server-rendered DOM'
        )
      },
      {
        mustKnow: true, module: '05', terms: 'Event, listener, click, input, handler, bubbling',
        q: 'DOM events lite: user action se handler tak flow? Framework se pehle kya yaad rakho?',
        a: answerBlock_(
          'Event = “kuch hua” signal (click, input, submit). Listener/handler uspe react karta hai.',
          'addEventListener(\"click\", fn) — native model. Frameworks (React onClick) isi family ko wrap karti hain.\n\nBubbling idea: event child se parents tak bubble (delegation pattern). stopPropagation careful.\n\nForms: submit event; preventDefault jab SPA/fetch handle kare.\n\nMemory leaks: listeners remove on teardown (SPAs/components unmount).\n\nTeam: accessible controls fire keyboard events too — clickable div misses Enter/Space.',
          '• Events connect UI to logic\n• Prefer native interactive elements\n• Know bubble/delegate at idea level\n• Clean up listeners in long-lived apps\n• Interview: why button click ≠ only mouse\n• Follow-up: “What is event delegation?” → parent listens for many children'
        )
      },
      {
        mustKnow: true, module: '05', terms: 'Accessibility, a11y, keyboard, contrast, ARIA',
        q: 'Accessibility baseline team bar kya ho — keyboard, labels, contrast, ARIA kab?',
        a: answerBlock_(
          'a11y = product sab users ke liye usable — keyboard, screen reader, low vision. Quality + legal/ethics bar.',
          'Baseline checklist:\n1) Semantic HTML first\n2) Keyboard: Tab order sensible; focus visible\n3) Labels on inputs; name on icon buttons\n4) Color contrast readable; don’t convey meaning by color alone\n5) Images alt / decorative empty alt\n6) Don’t remove focus outlines without replacement\n\nARIA: native semantics missing ho tab enhance — role/aria-* . Bad ARIA > no ARIA sometimes. Prefer correct HTML element pehle.\n\nGoogle-style reviews: a11y regressions = real bugs, not “nice to have”.',
          '• Semantic HTML is the first a11y tool\n• Keyboard + focus + labels non-negotiable\n• ARIA supplements; doesn’t replace correct elements\n• Interview: name 5 baseline a11y checks\n• Follow-up: “What is a focus trap?” → modal keeps Tab inside (advanced UX)'
        )
      },
      {
        mustKnow: true, module: '05', terms: 'XSS, escape, sanitize, innerHTML, template',
        q: 'HTML se XSS surface kaise banti hai? Escape-by-default team rule?',
        a: answerBlock_(
          'XSS = attacker ka script tumhari page pe chal jaye — cookies/tokens/actions hijack. HTML sinks dangerous hain.',
          'Untrusted string ko raw HTML maan ke inject mat karo.\n\nSinks: innerHTML, document.write, unsafe template concat, React dangerouslySetInnerHTML, server templates without auto-escape.\n\nDefense:\n• Escape/encode output by default (frameworks often do for text nodes)\n• Sanitize HTML with vetted library if rich text required (allowlist)\n• CSP defense-in-depth (Module 04/security depth)\n• HttpOnly cookies reduce token theft impact (not full XSS cure)\n\nBE + FE shared ownership: “user content render” designs need threat review.',
          '• Treat user/UGC as untrusted\n• Prefer text content APIs over HTML sinks\n• Escape by default; sanitize if HTML required\n• Interview: stored vs reflected XSS idea\n• Follow-up: “Why is React text safe-ish by default?” → escapes text nodes; sinks still exist'
        )
      },
      {
        mustKnow: true, module: '05', terms: 'DevTools Elements, Computed, inspect, Styles',
        q: 'DevTools Elements tab se whole-team kaise debug kare — Network (M04) ke saath?',
        a: answerBlock_(
          'Elements = live DOM + CSS microscope. Network = wires. Dono saath = “data aayi ya UI tootii?” jaldi decide.',
          'Workflow:\n1) Inspect element — hover highlight box model\n2) Styles pane — which rules apply / struck through\n3) Computed — final values\n4) Edit HTML/CSS live to hypothesize (refresh loses)\n5) Accessibility pane — name/role/contrast hints\n6) If data wrong → Network (status/body); if structure/CSS wrong → Elements\n\nBE pairing: reproduce, screenshot Elements + failing request. FE pairing: share selector + computed mismatch.\n\nDon’t ship debug-only inline styles left in prod.',
          '• Elements = live tree + CSS; Network = HTTP\n• Computed settles cascade arguments\n• Reproduce before big refactors\n• Interview story: used Elements to prove specificity loss\n• Follow-up: “What is the Console?” → run JS against live page (careful on prod)'
        )
      },
      {
        mustKnow: true, module: '05', terms: 'Revision checklist Module 05',
        q: 'Module 05 clear hai — team ko bina paper ke kya-kya explain karoge?',
        a: answerBlock_(
          'Viva: HTML contract → semantics → forms/hooks → CSS/cascade/box/layout → DOM/events → a11y → XSS escape → Elements debug.',
          'Practice aloud:\n“HTML document structure hai jo browser DOM banata hai. Semantic tags a11y/clarity dete hain. Links/buttons/images ke safe defaults. Forms labels + server validation truth. id/class/data hooks carefully. CSS presentation + cascade/specificity. Box model + flex/responsive. DOM live tree; events user actions. a11y baseline keyboard/labels. Escape HTML sinks against XSS. Elements + Network se debug.”',
          'Checklist:\n1) HTML as document contract\n2) Semantic structure\n3) Links/media/buttons defaults\n4) Forms + client/server validation\n5) id/class/data attributes\n6) CSS role + cascade\n7) Box model\n8) Layout/flex/responsive\n9) Specificity debugging\n10) DOM vs source\n11) Events lite\n12) a11y baseline + ARIA caution\n13) XSS escape-by-default\n14) Elements (+ Network) workflow\n\nNext depth: JS in the browser / frameworks → Scenario Frontend; DB/SQL → DSA & SQL tab.'
        )
      }
    ]
  }];
}

// ================================================================
// GLOSSARY DATA — Modules 01–05
// ================================================================
function getGlossaryData_() {
  return getGlossaryM01_().concat(getGlossaryM02_()).concat(getGlossaryM03_()).concat(getGlossaryM04_()).concat(getGlossaryM05_());
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

function getGlossaryM04_() {
  return [
    { term: 'URL', meaning: 'Web address: scheme + host + path + optional query/fragment.', topic: '04 Web HTTP DNS' },
    { term: 'Scheme (http/https)', meaning: 'URL ka pehla hissa — protocol: http cleartext, https TLS pe encrypted.', topic: '04 Web HTTP DNS' },
    { term: 'Host / Domain', meaning: 'example.com jaisa naam — DNS isse IP se map karta hai.', topic: '04 Web HTTP DNS' },
    { term: 'Path', meaning: 'URL mein /users/12 — server pe resource/route.', topic: '04 Web HTTP DNS' },
    { term: 'Query string', meaning: '?key=value pairs — filters/options; secrets yahan mat rakho.', topic: '04 Web HTTP DNS' },
    { term: 'Fragment (#)', meaning: 'URL ka #section — mostly browser-side jump; server ko usually nahi jata.', topic: '04 Web HTTP DNS' },
    { term: 'Origin', meaning: 'scheme + host + port. Same-origin vs cross-origin security ke liye zaroori.', topic: '04 Web HTTP DNS' },
    { term: 'DNS', meaning: 'Domain naam → IP (aur records) map. Internet ka phonebook.', topic: '04 Web HTTP DNS' },
    { term: 'TTL (DNS)', meaning: 'DNS answer kitni der cache rahe — change ke baad delay isi se.', topic: '04 Web HTTP DNS' },
    { term: 'A / AAAA / CNAME', meaning: 'DNS records: IPv4, IPv6, alias to another name.', topic: '04 Web HTTP DNS' },
    { term: 'IP address', meaning: 'Network pe host ka number address. Machines IP se baat karti hain.', topic: '04 Web HTTP DNS' },
    { term: 'Port', meaning: 'Ek machine pe kaunsa program sun raha hai — e.g. :443, :3000.', topic: '04 Web HTTP DNS' },
    { term: 'TCP (lite)', meaning: 'Reliable connection-oriented transport — HTTP aksar isi pe chalta hai.', topic: '04 Web HTTP DNS' },
    { term: 'HTTP', meaning: 'Web application protocol: request/response with method, status, headers, body.', topic: '04 Web HTTP DNS' },
    { term: 'HTTP method', meaning: 'GET/POST/PUT/PATCH/DELETE — request ka intent/verb.', topic: '04 Web HTTP DNS' },
    { term: 'Idempotent', meaning: 'Same request bar-bar → same effect. Retries safer (GET/PUT often).', topic: '04 Web HTTP DNS' },
    { term: 'Status code', meaning: 'Response number: 2xx ok, 3xx redirect, 4xx client, 5xx server.', topic: '04 Web HTTP DNS' },
    { term: '401 vs 403', meaning: '401 = not authenticated. 403 = authenticated but not allowed.', topic: '04 Web HTTP DNS' },
    { term: 'Header', meaning: 'Request/response metadata — Content-Type, Authorization, Cache-Control…', topic: '04 Web HTTP DNS' },
    { term: 'Content-Type', meaning: 'Body ka format batata hai (application/json, text/html…).', topic: '04 Web HTTP DNS' },
    { term: 'Authorization header', meaning: 'Auth credentials (often Bearer token). Logs mein mat chhapo.', topic: '04 Web HTTP DNS' },
    { term: 'HTTPS / TLS', meaning: 'HTTP over encrypted channel + certificate se server identity trust.', topic: '04 Web HTTP DNS' },
    { term: 'Certificate (TLS)', meaning: 'Domain ke liye trust document (CA chain). Expiry = browser warning.', topic: '04 Web HTTP DNS' },
    { term: 'Cookie', meaning: 'Browser pe chhota stored note; matching requests pe auto Cookie header.', topic: '04 Web HTTP DNS' },
    { term: 'Session', meaning: 'Login continuity — server-side state ya tokens across requests.', topic: '04 Web HTTP DNS' },
    { term: 'HttpOnly / Secure / SameSite', meaning: 'Cookie flags: JS-block, HTTPS-only, cross-site send rules.', topic: '04 Web HTTP DNS' },
    { term: 'REST API', meaning: 'Resources pe HTTP methods se operations — common web API style.', topic: '04 Web HTTP DNS' },
    { term: 'JSON', meaning: 'Structured text data format — APIs mein request/response body common.', topic: '04 Web HTTP DNS' },
    { term: 'Endpoint', meaning: 'Method + URL path jo ek API capability expose karta hai.', topic: '04 Web HTTP DNS' },
    { term: 'CORS', meaning: 'Browser rule: cross-origin API allow sirf jab server headers se allow kare.', topic: '04 Web HTTP DNS' },
    { term: 'Preflight (OPTIONS)', meaning: 'CORS pe pehle OPTIONS se poochna — allowed methods/headers?', topic: '04 Web HTTP DNS' },
    { term: 'DevTools Network', meaning: 'Browser panel: requests, status, timing, headers, response bodies.', topic: '04 Web HTTP DNS' },
    { term: 'TTFB', meaning: 'Time to first byte — server pehle byte kitni der mein bhejta hai.', topic: '04 Web HTTP DNS' },
    { term: 'Browser cache', meaning: 'Client pe responses yaad — Cache-Control/ETag se freshness.', topic: '04 Web HTTP DNS' },
    { term: 'CDN', meaning: 'Edge servers jo static assets user ke qareeb se serve karte hain.', topic: '04 Web HTTP DNS' },
    { term: 'Cache-Control', meaning: 'Header jo browser/CDN ko batata hai kitna/kaise cache karna hai.', topic: '04 Web HTTP DNS' }
  ];
}

function getGlossaryM05_() {
  return [
    { term: 'HTML', meaning: 'Markup language — page ka document structure jo browser parse karta hai.', topic: '05 Web Platform' },
    { term: 'Markup', meaning: 'Tags se meaning/structure dena (HTML) — plain text se zyada.', topic: '05 Web Platform' },
    { term: 'Semantic HTML', meaning: 'Sahi meaning wale tags (header/nav/main/button) — div soup nahi.', topic: '05 Web Platform' },
    { term: 'DOCTYPE', meaning: 'Document type hint — browsers ko standards mode parsing ke liye.', topic: '05 Web Platform' },
    { term: 'Attribute', meaning: 'Element pe metadata (href, src, id, class, alt, name…).', topic: '05 Web Platform' },
    { term: 'id vs class', meaning: 'id = page pe unique hook. class = reusable group for style/behavior.', topic: '05 Web Platform' },
    { term: 'data-* attribute', meaning: 'Custom data hooks for JS/tests without overloading visual classes.', topic: '05 Web Platform' },
    { term: 'Anchor / link (<a>)', meaning: 'Navigate to URL. Meaningful link text; target=_blank pe noopener.', topic: '05 Web Platform' },
    { term: 'alt text', meaning: 'Image ka accessible description. Decorative images pe alt=\"\".', topic: '05 Web Platform' },
    { term: 'Button vs link', meaning: 'Action on page = button. Go elsewhere = link. Clickable div avoid.', topic: '05 Web Platform' },
    { term: 'Form control', meaning: 'input/select/textarea etc. Label + name zaroori for a11y/submit.', topic: '05 Web Platform' },
    { term: 'Label', meaning: 'Control ka accessible name — for/id se linked. Click se focus.', topic: '05 Web Platform' },
    { term: 'Client vs server validation', meaning: 'Client = UX speed. Server = security truth (always).', topic: '05 Web Platform' },
    { term: 'CSS', meaning: 'Presentation/layout rules — look alag from HTML structure.', topic: '05 Web Platform' },
    { term: 'Selector', meaning: 'CSS rule ka target — element, .class, #id, attribute…', topic: '05 Web Platform' },
    { term: 'Cascade', meaning: 'Competing CSS rules resolve — origin, importance, specificity, order.', topic: '05 Web Platform' },
    { term: 'Specificity', meaning: 'Selector weight — inline > id > class > element (rough).', topic: '05 Web Platform' },
    { term: 'Box model', meaning: 'content + padding + border + margin. border-box widths predictable.', topic: '05 Web Platform' },
    { term: 'Normal flow', meaning: 'Default layout — blocks stack, inlines flow in lines.', topic: '05 Web Platform' },
    { term: 'Flexbox', meaning: 'One-dimensional layout — align/distribute in row or column.', topic: '05 Web Platform' },
    { term: 'Responsive / mobile-first', meaning: 'Layouts adapt to viewport; base small screens, enhance up.', topic: '05 Web Platform' },
    { term: 'Media query', meaning: 'CSS condition (often min-width) jab layout rules change.', topic: '05 Web Platform' },
    { term: 'DOM', meaning: 'Browser ki live object tree of the page — JS isi pe kaam karta hai.', topic: '05 Web Platform' },
    { term: 'Node', meaning: 'DOM tree ka unit — element, text, etc.', topic: '05 Web Platform' },
    { term: 'Event / listener', meaning: 'User/browser signal (click/input) + handler function jo react kare.', topic: '05 Web Platform' },
    { term: 'Event bubbling', meaning: 'Event child se ancestors tak upar jata hai — delegation possible.', topic: '05 Web Platform' },
    { term: 'Accessibility (a11y)', meaning: 'Product usable for more people — keyboard, SR, contrast, semantics.', topic: '05 Web Platform' },
    { term: 'ARIA (lite)', meaning: 'Roles/properties jab native HTML semantics kam paden — pehle correct element.', topic: '05 Web Platform' },
    { term: 'Focus visible', meaning: 'Keyboard users ko dikhe kahan focus hai — outline mat udao blindly.', topic: '05 Web Platform' },
    { term: 'XSS (HTML sink)', meaning: 'Untrusted HTML/script inject. Escape by default; sanitize if must.', topic: '05 Web Platform' },
    { term: 'innerHTML risk', meaning: 'Raw HTML assign = XSS sink if string untrusted.', topic: '05 Web Platform' },
    { term: 'Progressive enhancement', meaning: 'HTML pehle kaam kare; JS/CSS improve — not only JS-dependent core.', topic: '05 Web Platform' },
    { term: 'DevTools Elements', meaning: 'Live DOM + Styles/Computed inspect — CSS/structure debug.', topic: '05 Web Platform' },
    { term: 'Computed styles', meaning: 'Final CSS values after cascade — “who won” dikhata hai.', topic: '05 Web Platform' },
    { term: 'CLS (idea)', meaning: 'Cumulative Layout Shift — content jump; reserve image space.', topic: '05 Web Platform' }
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
    topicId: 'T1',
    title: 'TOPIC 1 — Software Engineering / Engineering Fundamentals (~5 YOE)',
    subtitle: 'Git, PR/review, debugging, ownership, quality, team. Har answer paragraph Hinglish mein — hard words question ke niche explain.',
    area: 'Basics',
    qa: [].concat(sbGit_(), sbReview_(), sbDebug_(), sbOwn_(), sbQuality_(), sbTeam_())
  }];
}

function getScenarioFrontend_() {
  return [{
    topicId: 'T2',
    title: 'TOPIC 2 — Frontend (React + JS + Browser + production FE)',
    subtitle: 'Real interviewer scenarios. Har answer paragraph Hinglish mein — hard words question ke niche explain.',
    area: 'Frontend',
    qa: [].concat(feReact_(), feBrowser_(), feForms_(), fePerf_(), feAuth_(), feData_(), feA11y_(), feBuild_())
  }];
}

function getScenarioBackend_() {
  return [{
    topicId: 'T3',
    title: 'TOPIC 3 — Backend (API / Node / DB / Cache / Auth / Async / Scale / Reliability / Testing / Prod)',
    subtitle: '5 YOE backend judgement — production situations. Har answer paragraph Hinglish mein — hard words question ke niche explain.',
    area: 'Backend',
    qa: [].concat(
      beApi_(), beNode_(), beDb_(), beCache_(), beAuth_(),
      beAsync_(), beScale_(), beReliability_(), beTesting_(), beProd_()
    )
  }];
}

function getScenarioSystemDesign_() {
  return [{
    topicId: 'T4',
    title: 'TOPIC 4 — System Design (Architecture / Scale / Data / Reliability / Trade-offs)',
    subtitle: '5 YOE practical system-design thinking — requirements, bottlenecks, trade-offs. Har answer paragraph Hinglish — hard words question ke niche.',
    area: 'System Design',
    qa: [].concat(
      sdArchitecture_(), sdApi_(), sdDatabase_(), sdCache_(),
      sdAsync_(), sdScale_(), sdReliability_(), sdObservability_()
    )
  }];
}

function getScenarioDevOps_() {
  return [{
    topicId: 'T5',
    title: 'TOPIC 5 — DevOps / Cloud (Deploy / CI-CD / Docker / Infra / Monitoring / Security)',
    subtitle: 'Full Stack ke liye deploy, infra, CI/CD, monitoring — certification nahi, production judgement. Hard words question ke niche.',
    area: 'DevOps',
    qa: [].concat(
      dcDocker_(), dcCiCd_(), dcDeploy_(), dcCloud_(),
      dcNetwork_(), dcObservability_(), dcSecurity_(), dcIncident_()
    )
  }];
}

// SCENARIO_BATCHES

function sbGit_() {
  return [
  {
    mustKnow: true,
    area: 'Git',
    terms: 'stash, cherry-pick, dirty tree, WIP',
    q: 'Tumhari branch pe kaafi local changes + uncommitted WIP hai, aur urgent production fix dusri branch se cherry-pick karna hai. Tum safely kaise handle karoge?\n\nPehle words clear kar lo: dirty tree matlab abhi uncommitted changes padi hain. WIP matlab adhoora kaam. stash matlab us kaam ko temporary shelf pe rakhna aur baad mein wapas lana. cherry-pick matlab dusri branch ka sirf ek commit yahan copy karna.',
    a: scenarioAnswerBlock_(
      'Main ensure karunga ki urgent production fix mere adhoore feature ke saath mix na ho. Pehle WIP ko safe jagah park karunga, phir clean tree pe fix laaunga — dirty kitchen pe surgery nahi.',
      'Sabse pehle git status se dekhoonga working tree mein kya pada hai. Phir related WIP ko stash push se side pe rakh doonga, untracked files bhi saath, taaki clean slate mil jaye. Tree clean hone ke baad main production fix wala commit cherry-pick karunga — matlab dusri branch ka sirf woh ek change yahan copy. Phir test aur smoke check karke deploy path follow karunga, aur end mein stash wapas laake apna feature continue. Agar cherry-pick pe conflict aaye to intent samajh ke resolve karke continue, warna confuse ho to abort. Half-done feature ke beech force-push bilkul nahi karunga.',
      'Pehle WIP park, phir clean tree, phir cherry-pick, verify, phir WIP wapas. Cherry-pick history rewrite nahi karta jab tak tum rebase ya reset na chalao. Shared branch pe galti se mix mat karo.',
      'Bina is tareeke ke log urgent fix ko adhoore feature ke saath milate hain, galat files ship ho jaati hain, revert mushkil hota hai, aur WIP kho bhi sakta hai.',
      'Yeh stash aur working tree se juda hai, cherry-pick commit identity se, aur hotfix/PR process se. Reset aur revert alag tools hain — ek history badalta hai, doosra publish ke baad safe undo.',
      'Tum painting bana rahe ho. Fire alarm baj gaya. Brush table pe mat chhodo — pehle painting drawer mein rakh do, fire bujhao, phir painting wapas nikalo.'
    )
  },
  {
    area: 'Git',
    terms: 'merge conflict, markers, resolve',
    q: 'Merge conflict aa gaya aur dono sides important changes dikhati hain. Tum kaise resolve karoge — randomly ek side nahi?\n\nPehle words clear kar lo: merge conflict matlab do branches ne same lines alag-alag badli aur Git khud decide nahi kar sakta. markers woh <<<<<<< ======= >>>>>>> lines hain jo dono versions dikhati hain. resolve matlab tum sahi combined code chhodte ho.',
    a: scenarioAnswerBlock_(
      'Main conflict ko error nahi, decision point maanoonga. Git confuse hai — main dono authors ki soch samajh ke sahi milayi hui version banaunga, randomly ek side delete nahi.',
      'Sabse pehle status se dekhoonga kaunsi files conflicted hain. Phir file khol ke markers padhunga — ek side meri branch, doosri incoming. Product sochunga dono features rehni chahiye ya ek. Phir markers hataake sahi logic chhodunga, locally test karunga, aur merge commit ya rebase continue. Agar business logic clear nahi to author se chhoti baat — guess nahi. Binary ya lockfile pe aksar regenerate better. Panic ho to merge ya rebase abort se pehle wali state. Shared main pe force-push se conflict “saaf” nahi karunga.',
      'Conflict failure nahi, checkpoint hai. Dono sides padho, test karo, phir complete. Blind “theirs” button mat dabao. Chhote PRs se conflicts kam hote hain.',
      'Bina careful resolve ke aisa code ship ho sakta hai jo compile bhi ho lekin logic silently galt ho — users ko baad mein dukh.',
      'Yeh merge/rebase workflow, code review, feature flags, aur test suite se juda hai — tests safety net banate hain.',
      'Do dost ek notebook ke same page pe alag story likhte hain. Teacher dono lines milake ek sahi story banata hai — ek ko phenkta nahi.'
    )
  },
  {
    area: 'Git',
    terms: 'merge vs rebase, shared branch, history',
    q: 'Feature branch outdated hai. Lead poochta hai: merge main karo ya rebase? Tum kaunsa choose karoge aur kyun — trade-off kya hai?\n\nPehle words clear kar lo: merge matlab main ke changes milana aur aksar ek merge commit banana. rebase matlab tumhare commits ko nayi base pe dubara lagana, jisse commit ids badal sakti hain. shared branch matlab dusre log bhi use kar rahe hain.',
    a: scenarioAnswerBlock_(
      'Main private branch pe rebase soch sakta hoon taaki history saaf rahe, lekin shared/public pe rewrite risky hai. Trade-off clarity vs teammates ki safety.',
      'Agar branch sirf meri hai aur koi pull nahi kar raha, main rebase on main prefer karunga taaki history seedhi rahe. Agar pehle se push ho chuki hai aur teammates use kar rahe hain, main merge main safer maanoonga taaki unke clones na tootain. Long-lived shared branch pe regular merge se sync. Team policy follow karunga. Main/master pe kabhi rebase nahi. Shared pe rebase zaroori ho to coordination aur force-with-lease, blind force nahi.',
      'Rebase commits ke SHA badal sakta hai. Merge SHAs preserve karta hai. Pushed shared pe prefer merge, ya coordinated rebase.',
      'Galat choice pe teammates ke local work toot’te hain, duplicate commits aate hain, aur messy force-pushes shuru ho jaate hain.',
      'PR review, CI updated base pe, conflict frequency, bisect se debug, aur branch protection rules — sab is choice se jude hain.',
      'Copybook mein nayi lines add karni hain. Agar notebook sirf tumhari hai, pages rearrange kar sakte ho. Agar class share karti hai, naya page staples karo — purane pages mat faado.'
    )
  },
  {
    area: 'Git',
    terms: 'revert, reset, force-with-lease, pushed',
    q: 'Galat commit already origin/main pe push ho chuka hai. Reset se “fixao” ya revert? Tum kya karoge?\n\nPehle words clear kar lo: reset matlab history peeche le jaana. revert matlab naya commit jo purane change ko undo kare. force-with-lease matlab force-push ka safer version jo dusre ka naya push udaane se bachata hai.',
    a: scenarioAnswerBlock_(
      'Main shared history pe time-machine se mitaane ki jagah revert choose karunga — public undo zyada safe hai.',
      'Pehle impact dekhoonga — prod pe deploy hua kya, users affect hue kya. Shared main pe git revert se naya undo commit, PR, CI, phir deploy. Sirf meri private branch ho aur kisi ne pull na kiya ho to reset soft/mixed soch sakta hoon, phir force-with-lease. Agar secrets commit hue to sirf git undo kaafi nahi — keys turant rotate. Team ko clear message dunga kya revert hua aur follow-up kya.',
      'Shared pe push ho chuka to revert. Private only pe reset OK. force-with-lease better than blind force. Secrets pehle rotate.',
      'Shared reset teammates ke work ko rewrite karta hai. Revert history clear rakhta hai aur audit/rollback simple rehta hai.',
      'Incident rollback, CI/CD, branch protection, secret management, aur postmortem — sab yahan milte hain.',
      'Class notice board pe galat note chipka diya. Page faadna mat — upar “cancel, yeh sahi hai” wala naya note chipkao taaki sab dekh sakein.'
    )
  }
  ];
}

function sbReview_() {
  return [
  {
    mustKnow: true,
    area: 'PR Review',
    terms: 'PR size, risk, split, vertical slice',
    q: 'Tumhara PR 40 files / ~2000 lines hai. Reviewer kehta hai split karo, lekin deadline kal hai. Tum kaise approach karoge?\n\nPehle words clear kar lo: PR matlab Pull Request — review ke liye changes bhejna. split matlab chhote pieces mein todna. vertical slice matlab ek thin end-to-end piece jo kaam kare. feature flag matlab switch se feature on/off.',
    a: scenarioAnswerBlock_(
      'Main ensure karunga ki deadline ke baawajood reviewable aur safe path rahe. Bada PR slow review aur hidden bugs laata hai — split ya tight scope negotiate karunga.',
      'Main honestly bolunga ek shot merge ka blast radius bada hai. Agar possible ho to vertical slices alag PRs mein. Agar kal zaroor ship karna hai to critical path pehle, feature flag peeche, extra tests aur rollout plan, aur reviewer ke saath short walkthrough. Uncertainty ke saath silent approve nahi. Residual risk PR description mein likh dunga. Agli baar stacked chhote PRs early.',
      'Chhote PRs better. Deadline license nahi unreviewable diff ke liye. Flags aur staged rollout deadline ke saath safety dete hain.',
      'Bina split/risk control ke regressions production mein chhup jaate hain aur blame culture badhti hai.',
      'Code review quality, CI, feature flags, ownership, aur estimation honesty — sab connected.',
      'Ek hi notebook mein 40 pages ek saath check karwana mushkil. Teacher kehti hai 5-5 pages bundles bhejo — galti jaldi milti hai.'
    )
  },
  {
    area: 'PR Review',
    terms: 'breaking change, compatibility, migration',
    q: 'PR mein API response shape change ho rahi hai. Frontend clients toot sakte hain. Review pe tum kya insist karoge?\n\nPehle words clear kar lo: breaking change matlab purana client toot jaye. compatibility matlab purane clients chalte rahein. migration matlab dheere-dheere naye shape pe jaana.',
    a: scenarioAnswerBlock_(
      'Main insist karunga ki breaking change pe “bas merge” na ho — versioning, dual support, ya flag plan chahiye.',
      'Main poochunga consumers kaun hain — web, purane mobile builds. Prefer pehle naye fields add, purane deprecate, baad mein remove. Contract tests aur docs update. Rollout order: backend tolerant, phir frontend, phir cleanup. Hard break zaroori ho to versioned endpoint ya coordinated release.',
      'Additive better than sudden break. Deprecation window document karo. Compat plan ke bina approve risky.',
      'Bina plan ke silent production failures aate hain, especially cached mobile apps pe.',
      'API versioning, feature flags, monitoring, backward compatibility, aur FE deploy cadence.',
      'Dost ka phone number change ho gaya. Pehle dono numbers thodi der chalne chahiye — turant purana kaat doge to calls miss.'
    )
  },
  {
    area: 'PR Review',
    terms: 'missing tests, risk, coverage',
    q: 'Feature PR mein tests almost nahi hain, author kehta hai “manual check kar liya”. Tum approve karoge? Kaise pushback doge?\n\nPehle words clear kar lo: automated test matlab computer dubara check kare. manual check matlab insaan ne abhi try kiya. high-risk path matlab money, auth, data change.',
    a: scenarioAnswerBlock_(
      'Main manual check ko aaj ka proof maanoonga, lekin kal ke regression ke liye automated safety maangoonga — risk ke hisaab se.',
      'Pehle risk classify — paisa, login, data mutate. High risk pe tests must. Happy path plus ek-do edge maangoonga jaise empty, 401, timeout. Time short ho to critical tests abhi, baaki follow-up ticket with owner aur date. Cosmetic PR pe same strictness nahi. Junior ho to pehla test saath likhne ko ready.',
      'High-risk pe no tests to no approve, ya explicit risk plus dated follow-up. Manual QA CI ki jagah nahi le sakta.',
      'Bina tests ke agla “chhota refactor” silently money/login tod sakta hai.',
      'CI gates, ownership, tech debt, incident prevention.',
      'Cycle seekhte waqt training wheels. Ek baar chal liya ka matlab yeh nahi ki kal bhi safe — wheels tests jaisi cheez.'
    )
  },
  {
    area: 'PR Review',
    terms: 'disagreement, trade-off, unblock',
    q: 'Reviewer se design pe disagreement hai, deadline tight hai. Tum escalate/agree/unblock kaise karoge?\n\nPehle words clear kar lo: trade-off matlab dono options ke fayde-nuksaan. reversible matlab baad mein badal sakte ho. escalate matlab lead ko clear summary dena.',
    a: scenarioAnswerBlock_(
      'Main ego fight nahi karunga. Risk aur reversible decision pe focus — kab ship-now-revisit, kab must-fix-now.',
      'PR comment mein dono options aur trade-offs likh dunga. Poochunga reversible hai kya, data migration hard hai kya. Low risk ho to simpler ship aur ticket revisit. Security ya data integrity pe lead ko clear summary. Comment war ki jagah short sync. Decision ke baad commit — silent sabotage nahi.',
      'Trade-offs likho. Deadline pe reversible prefer. Escalate sirf irreversible ya safety pe.',
      'Unresolved disagreement se PR atak’ta hai ya galat design permanent ho jaata hai.',
      'Ownership, tech debt, lite ADRs, team trust.',
      'Do dost park ka rasta choose karte hain. Jo rasta wapas aa sakte ho usse pehle chalo; ek-way tunnel pe coach ko call karo.'
    )
  }
  ];
}

function sbDebug_() {
  return [
  {
    mustKnow: true,
    area: 'Debugging',
    terms: 'prod vs local, env, config, data',
    q: 'Production mein bug aa raha hai, local aur staging pe reproduce nahi ho raha. Tum investigation kaise start karoge?\n\nPehle words clear kar lo: production matlab real users wala env. staging matlab test jaisa env. reproduce matlab wahi bug dubara dikhana. config/env matlab settings jo har jagah alag ho sakti hain.',
    a: scenarioAnswerBlock_(
      'Main pehle environment diff dhoondhunga. Same code alag duniya mein chal raha hai — data, config, scale, timing.',
      'Pehle blast radius aur user impact dekhoonga; zarurat ho to flag off ya rollback se stabilize. Phir build SHA, config, feature flags, migrations compare. Prod logs metrics traces se failing request id pakdungga. Data shape dekhunga — prod pe aisi rows staging mein nahi. Traffic concurrency se race ho sakti hai. Prod-like anonymized data se reproduce try. Hypotheses list karke sasti pehle disprove. Random code guess-search nahi.',
      'Prod local se alag aksar config, data, timing, ya scale ki wajah se. Pehle stabilize, phir root cause. Request ids gold hain.',
      'Bina method ke random deploys aur works-on-my-machine loop hours khaate hain jab users dukhi hain.',
      'Observability, env parity, feature flags, incident ownership, caching.',
      'Ghar pe fan theek, school pe nahi. Pehle check switch plug electricity — machine same, surroundings alag.'
    )
  },
  {
    area: 'Debugging',
    terms: 'intermittent, race, flake, logs',
    q: 'Bug kabhi-kabhi aata hai — race jaisa feel. Logs thin hain. Tum kaise tackle karoge?\n\nPehle words clear kar lo: intermittent ya flake matlab kabhi aaye kabhi nahi. race matlab timing/order ki wajah se galat. logs matlab system ne kya kiya uski diary.',
    a: scenarioAnswerBlock_(
      'Main flake ignore nahi karunga. Pehle signal badhaunga, phir pattern pakdungga — aksar timing/order problem hoti hai.',
      'Suspected async boundaries pe structured logs aur correlation id add karunga. Conditions note — browser, user, time, load. Stress ya parallel tests try. Retries, double-click, multi-tab, multi-instance check. Fix design se — ordering, locks/transactions, idempotency, UI disable — sleep hack nahi. Fix ke baad noisy logs hataunga.',
      'Intermittent ignore mat. Observability pehle. Race ko sleep se mat dabao.',
      'Bina approach ke flake self-heal dikhta hai jab tak heavy traffic na aaye.',
      'Async fetching, DB transactions, retries, event loop, load testing.',
      'Kabhi-kabhi joota sirf daudte waqt toot’ta hai. Baith ke test se nahi pata — daud conditions aur camera logs chahiye.'
    )
  },
  {
    area: 'Debugging',
    terms: 'regression, bisect, deploy, rollback',
    q: '“Kal theek tha, aaj toot gaya.” Recent deploy ke baad. Tum pehle rollback karoge ya root cause — kaise decide?\n\nPehle words clear kar lo: regression matlab pehle theek cheez toot gayi. rollback matlab purana good version wapas. bisect matlab commits ke beech bug wala change dhundhna.',
    a: scenarioAnswerBlock_(
      'Main user pain high aur clear deploy correlation pe pehle mitigate karunga — rollback ya flag-off — phir calmly root cause.',
      'Last good deploy SHA confirm. Severity high ho to rollback ya flag disable. Release diff aur migrations check — kabhi rollback unsafe. Multiple commits ho to bisect ya PR list. Rollback block ho to careful fix-forward. Re-release se pehle regression test add. Pride se pehle users.',
      'Users hurt hon to pehle mitigate. Migrations rollback block kar sakti hain — pehle socho.',
      'Root-cause pride pehle = lambi outage. Blind rollback bina migration check = aur badi outage.',
      'CI/CD, feature flags, DB migrations, postmortem, ownership.',
      'Naya game update se score kharab. Pehle update undo agar safe, phir dekho kaunsa level bug laaya.'
    )
  },
  {
    area: 'Debugging',
    terms: 'root cause, symptom, methodology',
    q: 'Users kehte hain “app slow hai”. Tum symptom treat karoge ya root cause — pehle 30 minute kya karoge?\n\nPehle words clear kar lo: symptom matlab dikhne wala dukh jaise slow. root cause matlab asal wajah. SLI matlab measure karne layak number jaise p95 latency ya LCP.',
    a: scenarioAnswerBlock_(
      'Main “slow” ko vague nahi chhodunga. Pehle measure karunga — wait kahan hai network, DB, CPU, ya render.',
      'Define karunga kaunsa page aur kaunsa metric. Dashboards pe latency errors saturation. FE vs BE vs third-party split. Ek hypothesis at a time — shotgun optimize nahi. Evidence ke baad quick win jaise N+1 query ya huge bundle. Findings jaldi share. Memoize/CDN guess bina data ke nahi.',
      'Symptom root cause nahi. Measure, locate, fix. Blind optimization mat.',
      'Bina measurement ke galat jagah optimize = weeks waste, problem same.',
      'FE+BE performance, observability, capacity, caching, architecture bottlenecks.',
      'Pet dard pe sirf ice cream mat. Pehle thermometer doctor — asal wajah dhundo.'
    )
  }
  ];
}

function sbOwn_() {
  return [
  {
    mustKnow: true,
    area: 'Ownership',
    terms: 'rollback, hotfix, incident, communication',
    q: 'Tumhare change ne production bug introduce kiya. Rollback vs hotfix — pehle kya, aur stakeholders ko kaise update doge?\n\nPehle words clear kar lo: rollback matlab purana safe version. hotfix matlab jaldi chhota fix aage. incident matlab live problem. stakeholders matlab PM, support, users ke log.',
    a: scenarioAnswerBlock_(
      'Main pehle bleeding rokunga, ego baad mein. Clear status updates se trust banaunga.',
      'Severity dekhunga — payments down to turant mitigate rollback ya flag. Hotfix tab jab rollback blocked ho jaise migration, ya fix bahut chhota tested ho. Comms mein kya toota, impact, ab kya kar rahe, next update kab — even no news yet. Rabbit hole mein gayab nahi. Stable hone ke baad blameless postmortem aur preventative action — test, alert, flag.',
      'Stabilize, communicate, root fix, prevent repeat. Mistake own karo; process gaps pe focus, logon pe blame nahi.',
      'Bina ownership ke outage lambi, trust toot’ta, same bug dubara aata hai.',
      'Git revert, feature flags, on-call, postmortem, monitoring.',
      'Tumne doodh gira diya. Pehle pochho, mummy ko batao, phir seekho glass edge pe na rakhna.'
    )
  },
  {
    area: 'Ownership',
    terms: 'dependency, vendor, SLA, fallback',
    q: 'Third-party payment/email dependency fail ho rahi hai. Ownership unclear — tum kya karoge pehle 15 minute?\n\nPehle words clear kar lo: dependency matlab bahar ki service. vendor matlab unka provider. fallback matlab backup rasta. SLA matlab unka uptime promise.',
    a: scenarioAnswerBlock_(
      'Main pehle user journey bachaaunga. Degrade gracefully, status clear, andar owner assign.',
      'Blast radius aur vendor error codes confirm. Fallback ho to on — queue email ya alternate provider. Koi owner na ho to main declare karke war room lite. Vendor status aur hamare credentials quota check. Customer ko honest message, blame ping-pong nahi. Baad mein ownership matrix aur dependency monitors.',
      'Unclear ownership freeze nahi. Act then assign. Dependencies ko fallback aur monitor chahiye.',
      'Bina action ke teams “yeh unka hai” bolte rehte hain jab users wait karte hain.',
      'Timeouts retries, circuit breakers, status communication, SLAs, architecture.',
      'School bus late. Pehle kids ko shade water do, phir call karo kaun fix karega.'
    )
  },
  {
    area: 'Ownership',
    terms: 'postmortem, action items, prevention',
    q: 'Incident khatam. Manager postmortem maangta hai. Tum kaise likhoge taaki blame nahi, seekh ho?\n\nPehle words clear kar lo: postmortem matlab baad mein kya hua aur kyun. action items matlab concrete kaam owner aur date ke saath. blameless matlab logon ko sharminda nahi, system seekhe.',
    a: scenarioAnswerBlock_(
      'Main timeline, contributing factors, aur action items likhunga. People root cause nahi — systems hain.',
      'Detection time, mitigation, customer impact likhunga. Five whys bina sharam. Action items alert, test, runbook, flag — har ek owner due date. “Be more careful” nahi. Team ke saath seekh share.',
      'Blameless plus concrete actions. Bina action items ke postmortem natak hai.',
      'Bina postmortem ke same outage cycle dubara aata hai.',
      'Monitoring gaps, review culture, tech debt, on-call health.',
      'Match haarne ke baad “tu bekaar” mat. Video dekho kis pass miss hui, practice plan banao.'
    )
  },
  {
    area: 'Architecture',
    terms: 'bottleneck, DB, scale, prioritize',
    q: 'API pe sudden ~10k users; database CPU/latency spike. Tum bottleneck kaise identify karoge aur solutions kaise prioritize karoge?\n\nPehle words clear kar lo: bottleneck matlab jo jagah atak rahi hai. latency matlab response late. scale matlab load badhna. prioritize matlab pehle bleeding rokna phir deep fix.',
    a: scenarioAnswerBlock_(
      'Main guess cache nahi karunga. Pehle measure — slow queries, locks, missing index, N+1, connection pool.',
      'Dashboards pe DB CPU locks slow query log app pool wait errors. Top queries explain plans. Quick mitigate: rate limit, hot read cache, pathological query rokna, read-heavy pe replica. Deeper: indexes, batching, queue writes, pagination. Order: bleeding stop, cheap win, structural fix. Day-one pe poora architecture rewrite nahi.',
      'Observe, mitigate, query/index fix, phir redesign. Cache hamesha pehla jawab nahi — galat cache bug chhupaata hai.',
      'Bina identify kiye sirf servers add karna paisa jalaata hai aur bottleneck same rehta hai.',
      'Indexing, caching, queues, rate limiting, observability, capacity planning.',
      'Canteen mein ek counter pe 1000 kids. Pehle dekho line kahan atki — cashier ya plates — phir helpers.'
    )
  }
  ];
}

function sbQuality_() {
  return [
  {
    mustKnow: true,
    area: 'Quality',
    terms: 'tech debt, risk, refactor, ROI',
    q: 'Legacy module pe har feature 3x time leta hai. Refactor propose karna hai lekin product “features pehle” kehta hai. Tum kaise pitch/plan karoge?\n\nPehle words clear kar lo: tech debt matlab purana messy code jo baad mein slow karata hai. refactor matlab behavior same rakh ke andar saaf. strangler matlab naya rasta dheere-dheere purane ko replace.',
    a: scenarioAnswerBlock_(
      'Main debt ko darr se nahi — delivery speed aur risk se pitch karunga. Chhote safe slices.',
      'Data dikhaunga — bugs, cycle time, incidents us area mein. Strangler propose: naya path side mein, migrate gradually. Budget 20 percent capacity ya related feature ke saath cleanup. Tests pehle, big-bang rewrite nahi. Done measurable — build time, defect rate.',
      'Big-bang rewrite avoid. Debt business impact se becho. Tests safe refactor unlock karte hain.',
      'Bina investment ke velocity zero hoti hai; blind rewrite bhi sinkhole ban jaata hai.',
      'Testing, ownership, estimation, architecture, PR size.',
      'Cycle chain rusty. Har baar late. Thoda oil aur link replace regularly — pura cycle fenkne se pehle.'
    )
  },
  {
    area: 'Quality',
    terms: 'over-engineering, YAGNI, abstraction',
    q: 'Junior ne “future-proof” ke naam pe 6 layers abstraction add ki. Tum review mein kya trade-off discuss karoge?\n\nPehle words clear kar lo: abstraction matlab layers se complexity chhupana. YAGNI matlab You Aren’t Gonna Need It — aaj jo zaroori nahi woh mat banao. over-engineering matlab zarurat se zyada complex.',
    a: scenarioAnswerBlock_(
      'Main bolunga abstraction ka kharcha aaj; fayda tab jab genuinely reuse aaye. Simple aksar jeet’ta hai.',
      'Poochunga kitne real callers, abhi kitni variation. Simple module clear names prefer. Doosra teesra real use aaye tab extract. Extension points sirf known change boundaries pe. Intent praise, complexity redirect.',
      'Complexity liability hai. Evidence pe abstract. Readable clever se better.',
      'Over-engineering features slow karta hai, onboarding hard, bugs hide.',
      'SOLID lite, code review, maintainability, testing surface.',
      'Ek pencil stand ke liye rocket launcher mat banao. Jab 10 pencils hon tab better box.'
    )
  },
  {
    area: 'Quality',
    terms: 'backward compatibility, migration, clients',
    q: 'Shared library ka major cleanup chahiye jo callers tod sakta hai. Tum kaise safely ship karoge?\n\nPehle words clear kar lo: callers matlab jo is library ko use karte hain. backward compatibility matlab purana use chalta rahe. semver matlab version numbers se break signal.',
    a: scenarioAnswerBlock_(
      'Main compat window rakhunga: deprecate, dual support, phir remove. Communication pehle.',
      'Consumers inventory — grep monorepo dependents. Additive API aur deprecation warnings. Codemod docs version bump. CI major consumers pe. Remove tab jab adoption metric clear.',
      'Breaking changes ko version aur migration path chahiye. Silent break trust tod’ta hai.',
      'Bina strategy ke cleanup org-wide fire drill ban jaata hai.',
      'Semver, API design, monorepo CI, code owners.',
      'School uniform change. Pehle dono allow, notice pe date, phir purana band — ek din surprise mat.'
    )
  },
  {
    area: 'Architecture',
    terms: 'idempotency, retry, duplicates',
    q: 'Network flake pe client/server retry duplicate records bana raha hai (double charge / double row). Tum system ko kaise change karoge taaki retries safe hon?\n\nPehle words clear kar lo: retry matlab dubara try. idempotency matlab same request dobara bhejo to naya duplicate na bane, same result aaye. idempotency key matlab unique id har user action ki.',
    a: scenarioAnswerBlock_(
      'Main ensure karunga retries tab safe hon jab operation idempotent ho — same request ka matlab same result, naya row nahi.',
      'Client har action pe Idempotency-Key UUID bheje. Server key ko result se map karke rakhe; dubara aaye to same response. DB pe natural keys pe unique constraints. Upsert ya insert-if-not-exists. Queue consumers bhi idempotent. UI pe double-submit disable aur retry pe same key.',
      'Retry bina idempotency ke duplicates. Unique constraints aur keys seatbelt hain.',
      'Networks fail. Bina safe retries ke ya data corrupt ya retries band karke reliability khoti hai.',
      'HTTP retries, queues, transactions, FE double-submit, payments.',
      'Online order button do baar dab gaya. Shop wale ko pehchan chahiye same order — do pizza mat bhejo.'
    )
  }
  ];
}

function sbTeam_() {
  return [
  {
    mustKnow: true,
    area: 'Team',
    terms: 'requirements, ambiguity, clarify, scope',
    q: 'PM ne one-liner diya: “Make dashboard better.” 5 YOE pe tum pehle kya karoge?\n\nPehle words clear kar lo: ambiguity matlab clear nahi kya chahiye. acceptance criteria matlab kab done maane. spike matlab chhota timeboxed research.',
    a: scenarioAnswerBlock_(
      'Main ambiguous request ko measurable outcomes mein todunga — warna infinite polish.',
      'Success metrics poochunga — faster load, clearer funnel, kaunse users. Constraints deadline platforms. Do-teen options effort impact ke saath. Out-of-scope explicitly. Coding se pehle acceptance criteria. Unknown pe timeboxed spike.',
      'Clarify before code. Options better than silent assumptions. Acceptance criteria rework kam karte hain.',
      'Bina clarity ke galat better banaake deadline pe redo.',
      'Estimation, product thinking, UX, performance metrics, stakeholder comms.',
      'Room better banao — pehle poocho saaf lights toys? Warna galat cheez fix.'
    )
  },
  {
    area: 'Team',
    terms: 'disagreement, lead, influence',
    q: 'Senior/lead se technical disagreement hai. Tum blindly follow vs pushback — kaise balance?\n\nPehle words clear kar lo: disagree and commit matlab apni baat rakh ke decision ke baad team ke saath chalna. influence matlab data se samjhana.',
    a: scenarioAnswerBlock_(
      'Main data aur alternatives se challenge karunga. Owner decide kare to commit. Silent sabotage nahi.',
      'Unka approach pehle steelman. Risks evidence calmly. Reversible experiment offer. Phir bhi disagree ho to short dissent document aur execute. Safety ethics irreversible harm pe escalate.',
      'Disagree and commit. Escalate sirf safety/ethics/irreversible pe.',
      'Endless debate delivery rokta hai; silent disagreement bugs aur politics laata hai.',
      'Code review, ownership, architecture, psychological safety.',
      'Coach formation decide karta hai. Idea de sakte ho; match start ke baad team split mat.'
    )
  },
  {
    area: 'Team',
    terms: 'estimation, uncertainty, risk communication',
    q: 'Tumne 2 din estimate diya; day-2 pe dependency blocker mila. Stakeholders ko kaise update doge?\n\nPehle words clear kar lo: estimate matlab time ka andaza. blocker matlab rukawat. stakeholder update matlab early honest news.',
    a: scenarioAnswerBlock_(
      'Main early bad news plus naya plan dunga — late silence trust tod’ta hai.',
      'Jaate hi impact aur options — wait, mock, descope. Revised estimate confidence ke saath. Mujhe kya chahiye dusron se. Unblock tak daily checkpoint. Baad mein discovery improve — spike habit.',
      'Reality change pe update, due date pe surprise nahi. Uncertainty mein estimate range socho.',
      'Hidden blockers surprise slips aur rushed quality debt laate hain.',
      'Dependency management, spikes, scope negotiation, honest communication.',
      'Homework 2 page socha, notebook missing. Turant batao plan B — raat ko surprise mat.'
    )
  }
  ];
}

function feReact_() {
  return [
  {
    mustKnow: true,
    area: 'React',
    terms: 'useEffect, Strict Mode, double fetch, deps',
    q: 'Production/dev mein API request unexpectedly 2 baar fire ho rahi hai. Tum kaise investigate karoge aur possible causes kya honge?\n\nPehle words clear kar lo: useEffect matlab render ke baad side effect. deps matlab kab effect dubara chale. Strict Mode dev mein intentionally remount karke unsafe effects pakadta hai. abort matlab request cancel.',
    a: scenarioAnswerBlock_(
      'Main pehle samjhunga double call kahan se aa raha hai — effect deps, remount, Strict Mode, parent key, ya multiple mounts.',
      'Pehle env confirm — sirf dev hai to Strict Mode remount suspect. useEffect deps check — har render pe naya object/function to unstable. Parent key se child remount. Multiple components same fetch. Fix: sahi deps, AbortController, react-query jaisa dedupe, fetch lift. Strict Mode band karke problem chhupana nahi. Prod mein bhi double ho to real bug.',
      'Dev double-invoke hamesha prod bug nahi. Unstable deps prod refetch storm bana sakte hain. Unmount pe cleanup/abort.',
      'Strict Mode band karne se races hide; unstable deps cost aur billing badha sakte hain.',
      'Data fetching, abort, memoization, keys, concurrent React.',
      'Bell do baar — kabhi drill kabhi fire. Pehle samjho drill hai ya asli.'
    )
  },
  {
    area: 'React',
    terms: 'stale closure, state, refs',
    q: 'Event handler / interval purani state dikha raha hai (stale). Tum kaise debug aur fix karoge?\n\nPehle words clear kar lo: stale closure matlab function ne purani value pakad rakhi. functional setState matlab purani state se nayi nikalna. ref matlab mutable box jo render pe fresh rakh sakte ho.',
    a: scenarioAnswerBlock_(
      'Main stale closure suspect karunga — function ne purani photo pakad rakhi hai. Fresh state chahiye.',
      'Timeout ya subscription mein setState reproduce. Fix: setState function form, deps sahi, useRef latest value ke liye. Async ke liye proven data libs. Galat ref copy se aur confuse nahi.',
      'Stale closure classic hooks footgun. Aksar functional setState simplest fix.',
      'Users galat counts dekhte hain; racey bugs reproduce mushkil.',
      'useEffect deps, event loop, subscriptions, concurrent rendering.',
      'Purani photo se friend dhundho to naya haircut miss. Fresh photo chahiye.'
    )
  },
  {
    area: 'React',
    terms: 're-render, memo, useMemo, useCallback',
    q: 'List slow hai. Junior turant useMemo/useCallback laga raha hai. Tum pehle kya check/trade-off loge?\n\nPehle words clear kar lo: re-render matlab UI dubara ban’na. memo/useMemo/useCallback matlab yaad rakh ke kaam kam karna. virtualize matlab screen pe sirf dikhne wale items.',
    a: scenarioAnswerBlock_(
      'Main pehle measure karunga. Har jagah memo noise hai — pehle state location, heavy children, galat keys.',
      'Profiler se dekhunga kaun re-render kyun. State bahut upar to context split. Long list pe virtualize. Phir expensive pure children pe memo stable props ke saath. useCallback tab jab memoized child ya effect deps ko stability chahiye.',
      'Memo diagnosis ke baad scalpel. Galat keys/state location missing useMemo se badi problem.',
      'Blind memo complexity badhata hai bina FPS gain.',
      'Virtualization, Context, keys, performance metrics, JS cost.',
      'Traffic jam mein sirf horn mat. Pehle dekho accident kahan — us lane fix.'
    )
  },
  {
    area: 'React',
    terms: 'keys, reconciliation, list bugs',
    q: 'List mein edit/reorder pe galat item update / input focus jump. Tum kya suspect karoge?\n\nPehle words clear kar lo: key matlab React ko batana kaunsa item kaunsa component hai. reconciliation matlab React purane naye UI ko milata hai. index key matlab 0 1 2 — reorder pe dangerous.',
    a: scenarioAnswerBlock_(
      'Main almost always unstable ya galat keys suspect karunga — React galat component state reuse karta hai.',
      'Stable id keys use. Dynamic list pe index keys avoid. Har render pe random key remount storm. Controlled inputs sahi item id se bind. Confirm.',
      'Keys identity = component state identity. Dynamic lists pe index keys unsafe.',
      'Wrong keys se UI data haunted lagta hai — subtle corruption.',
      'Reconciliation, controlled forms, remount performance.',
      'Coat hooks pe naam labels. Number se hang karke order badlo to galat coat.'
    )
  },
  {
    area: 'React',
    terms: 'error boundary, crash, fallback',
    q: 'Ek widget throw karta hai aur pura page white screen. Tum architecture mein kya change suggest karoge?\n\nPehle words clear kar lo: error boundary matlab React ka guard jo render error pakad ke baaki app bachaye. fallback matlab error pe dikhne wala soft UI.',
    a: scenarioAnswerBlock_(
      'Main error boundaries se blast radius kam karunga — widget fail, shell alive.',
      'Risky subtrees wrap with fallback UI aur monitoring report. Boundaries render errors pakadti hain, har async nahi. Route-level boundaries bhi. Root bug fix bhi — boundary forever swallow nahi.',
      'Failures isolate karo. Log plus fallback. Bug phir bhi fix.',
      'Ek throw se poori SPA session nahi mar’ni chahiye.',
      'Monitoring, Suspense, resilient UX, release health.',
      'Ek diwali light fuse — pura ghar andhera na ho; section-wise fuse.'
    )
  }
  ];
}

function feBrowser_() {
  return [
  {
    mustKnow: true,
    area: 'Browser',
    terms: 'CORS, preflight, Origin, headers',
    q: 'API Postman mein success, browser se CORS error. Tum step-by-step kya check karoge?\n\nPehle words clear kar lo: CORS matlab browser rule jo alag origin se API call control karta hai. Origin matlab protocol+domain+port. preflight matlab pehle OPTIONS se poochna allowed hai kya.',
    a: scenarioAnswerBlock_(
      'Main samjhunga Postman pe Origin policy nahi hoti. Browser same-origin enforce karta hai — server ko tumhara web origin allow karna padta hai.',
      'Devtools Network pe dekhunga OPTIONS preflight fail to nahi. Access-Control-Allow-Origin exact origin match kare — credentials ke saath star nahi. Methods aur custom headers allow. Credentials ke saath Allow-Credentials sahi. Fix server/gateway pe — browser extension disable CORS fix nahi. Dev proxy temporary only.',
      'CORS browser security hai, server allowlist se fix. Postman success sirf API prove karta hai, browser permission nahi.',
      'Bina sahi CORS FE prod toot’ta hai; insecure star plus credentials attack surface.',
      'Cookies, auth, reverse proxy, HTTPS, CSP.',
      'School gate pe ID. Ghar se phone call chal jaye — gate pe guard alag rule.'
    )
  },
  {
    area: 'Browser',
    terms: 'cookies, localStorage, XSS, httpOnly',
    q: 'Auth token localStorage mein rakhna vs httpOnly cookie — 5 YOE pe tum kaunsa trade-off choose karoge?\n\nPehle words clear kar lo: localStorage matlab browser mein JS se padhne layak storage. httpOnly cookie matlab JS nahi padh sakta, sirf browser HTTP pe bhejta hai. XSS matlab attacker ka script tumhari site pe. CSRF matlab dusri site tumhare cookie se request.',
    a: scenarioAnswerBlock_(
      'Main trade-off clear karunga: localStorage XSS se churana easy; httpOnly cookie JS se nahi padhti — phir CSRF care chahiye.',
      'Backend control ho to session/refresh ke liye httpOnly Secure SameSite cookies prefer. Token JS memory ya localStorage mein ho to short expiry, strict CSP, sanitize. Long-lived refresh casually localStorage mein nahi. Team ke saath threat model clear.',
      'XSS se localStorage tokens chori. Cookies pe CSRF mitigate SameSite aur tokens se. Perfect nahi — jo threat handle kar sako woh choose.',
      'Wrong storage account takeover class bugs laata hai.',
      'XSS, CSRF, auth refresh, CSP, HTTPS.',
      'Diary mez pe vs locked drawer. Mez pe koi padh le; drawer ki key alag sambhalo.'
    )
  },
  {
    area: 'Browser',
    terms: 'event loop, task, microtask, freeze',
    q: 'UI click pe hang / jank — Network idle dikhta hai. Tum event loop angle se kaise debug karoge?\n\nPehle words clear kar lo: event loop matlab browser ka queue jo JS tasks chalata hai. main thread busy matlab UI paint nahi ho paati. long task matlab bahut lambi sync JS.',
    a: scenarioAnswerBlock_(
      'Main network innocent maaan sakta hoon. Main thread busy — heavy sync JS — yeh pehle check.',
      'Performance panel pe long tasks. Expensive loops todo chunking. Huge JSON parse workers pe socho. Endless microtasks rendering starve kar sakte hain. DOM virtualize. Measure pehle.',
      'Jank aksar main-thread JS, slow API nahi. Long tasks measure karo.',
      'Users app dead feel karte hain jab server theek ho.',
      'React renders, web workers, INP, bundle size, lists.',
      'Teacher ek sum 10 minute — class sawal nahi pooch sakti. Breaks chahiye.'
    )
  }
  ];
}

function feForms_() {
  return [
  {
    mustKnow: true,
    area: 'Forms',
    terms: 'double submit, idempotency, disable',
    q: 'Payment/submit button double-click se duplicate requests ja rahi hain. Tum FE (+ server) pe kya karoge?\n\nPehle words clear kar lo: double submit matlab button do baar. idempotency matlab server same action ko ek baar maane. disable loading matlab UI pe pending dikhao aur click band.',
    a: scenarioAnswerBlock_(
      'Main ensure karunga UI pe disable/loading aur server pe idempotency — dono layers.',
      'Submit pe button disable pending dikhaoonga. Settle tak ignore. Idempotency-Key header. Sirf debounce payments ke liye kaafi nahi. Error pe carefully re-enable; success pe ek baar confirm navigate. Server unique constraints. FE alone money pe trust nahi.',
      'FE guard plus BE idempotency. Money pe UI alone seatbelt nahi.',
      'Duplicates double charge double records support hell.',
      'Idempotency architecture, auth, optimistic UI, retries.',
      'Vending machine — pehle coin process phir unlock. Do baar dabane pe do coke nahi.'
    )
  },
  {
    area: 'Forms',
    terms: 'validation, client, server, UX',
    q: 'Sirf client validation hai; attacker API seedha hit kare. Tum validation strategy kaise set karoge?\n\nPehle words clear kar lo: client validation matlab browser pe check UX ke liye. server validation matlab asli security truth. authz matlab permission check.',
    a: scenarioAnswerBlock_(
      'Main clear rakhunga: client UX hai, server truth aur security. Dono chahiye.',
      'Critical rules server pe hamesha. Client pe instant feedback required format. Server errors fields pe map. Hidden fields pe authz nahi. Shared schema optional. Client-only = bypass.',
      'Server validation non-negotiable. Client courtesy aur speed.',
      'Client-only pe attacker corrupt malicious data bhej sakta hai.',
      'Security, API design, a11y error messages, XSS on reflected errors.',
      'Exam mein self-check plus teacher check. Sirf self-check pe cheat.'
    )
  }
  ];
}

function fePerf_() {
  return [
  {
    mustKnow: true,
    area: 'Performance',
    terms: 'LCP, measure, waterfall, RUM',
    q: 'Dashboard ka LCP suddenly ~5s ho gaya. Tum blindly optimize karoge ya pehle kya measure/check karoge?\n\nPehle words clear kar lo: LCP matlab Largest Contentful Paint — bada content kitni der mein dikha. waterfall matlab network requests ka timeline. RUM matlab real users ka measure.',
    a: scenarioAnswerBlock_(
      'Main pehle evidence loonga. Kaunsa element LCP hai, waterfall kya kehta, kaunsa deploy regression — blind optimize nahi.',
      'Field RUM aur lab Lighthouse — kaunsa URL device. LCP element image text late font. Waterfall mein late discover ya huge blocking JS. Recent release — hero image size, sync scripts, API pe render wait. Targeted fix — image optimize, preload, hero ko slow API se mat block, non-critical split. Phir re-measure.',
      'Measure, LCP element locate, cause fix. Guess optimize mat.',
      'Galat optimization sprint waste, asli culprit same.',
      'Bundle, caching, SSR/CSR, images, waterfalls, CLS.',
      'Race slow. Pehle stopwatch — joota khula ya bag bhaari? Random training mat.'
    )
  },
  {
    area: 'Performance',
    terms: 'bundle, code split, lazy',
    q: 'Initial JS bundle bahut bada; Time to Interactive kharab. Tum kaise prioritize karoge?\n\nPehle words clear kar lo: bundle matlab saara JS jo pehle download. code split / lazy matlab pehle kam JS, baaki jab zarurat. TTI matlab kab user interact kar sake.',
    a: scenarioAnswerBlock_(
      'Main pehle paint ke liye kam JS ship karunga — route split, deps trim, heavy widgets dynamic import.',
      'Analyzer se fat modules. Routes modals charts lazy. Whole-library import avoid. Third-party defer. Stack allow kare to SSR/streaming. CI mein budgets.',
      'Route se split. Bundle bytes CI pe measure. Third-party aksar villain.',
      'Huge JS slow phones bounce UX SEO hit.',
      'Build tooling, caching, LCP INP, feature flags heavy modules.',
      'School bag mein poori library mat. Aaj ke subjects; baaki locker.'
    )
  },
  {
    area: 'Performance',
    terms: 'CLS, images, fonts, layout',
    q: 'Page load pe content jump (CLS). Tum pehle kya fix check karoge?\n\nPehle words clear kar lo: CLS matlab Cumulative Layout Shift — cheezein jump. reserved space matlab pehle se jagah rokna images fonts banners ke liye.',
    a: scenarioAnswerBlock_(
      'Main pehle reserved space check karunga — images fonts ads late aake layout dhakelte hain.',
      'Images pe width height ya aspect-ratio. Fonts pe display strategy preload critical. Late banners upar mat ghusaao. Skeleton stable size. RUM pe CLS measure.',
      'Space reserve. Late layout moves UX aur Core Web Vitals tod’te hain.',
      'Users mis-click; ranking UX metrics girte hain.',
      'LCP images, responsive, ads, A/B banners.',
      'Notebook pe picture — pehle box draw, warna neeche likhai shift.'
    )
  }
  ];
}

function feAuth_() {
  return [
  {
    mustKnow: true,
    area: 'Auth',
    terms: 'refresh token, expiry, 401, race',
    q: 'Access token expire ho raha hai; multiple parallel API 401 de rahi hain. Tum refresh flow kaise design/fix karoge?\n\nPehle words clear kar lo: access token chhota jeene wala pass. refresh token se naya access milta hai. 401 matlab unauthorized. single-flight matlab ek hi refresh, baaki wait.',
    a: scenarioAnswerBlock_(
      'Main ensure karunga ek hi refresh chale, baaki queue — fail pe ek baar logout, stampede nahi.',
      'Interceptor 401 pe refresh try once. Mutex queue taaki 10 calls 10 refresh na bane. Refresh fail pe session clear login redirect, infinite loop nahi. Policy pe rotate refresh. Clock skew thoda tolerate. Refresh casually localStorage mein nahi.',
      'Refresh dedupe. Login redirect storms avoid. Short access plus longer refresh common.',
      'Naive refresh stampedes revoked sessions flaky UX.',
      'Cookies, CORS credentials, races, FE data layer.',
      'Library card renew. 5 friends ek saath mat — ek renew, baaki wait.'
    )
  },
  {
    area: 'Auth',
    terms: 'XSS, token, CSP, sanitize',
    q: 'User-generated HTML render karna hai. XSS se token/session bachane ke liye tum kya insist karoge?\n\nPehle words clear kar lo: UGC matlab user ka content. sanitize matlab dangerous HTML kaatna. CSP matlab browser ko batana kaunsa script chal sakta.',
    a: scenarioAnswerBlock_(
      'Main UGC ko hostile maanoonga. Escape sanitize CSP; httpOnly cookies help.',
      'React text nodes default escape prefer. HTML chahiye to strong sanitizer allowlist. CSP script-src tight. httpOnly session. raw UGC pe innerHTML eval nahi. Rich text pe security review.',
      'Escape by default. Sanitizer plus CSP defense in depth. XSS pe JS-visible tokens game over.',
      'Ek XSS account takeover laa sakta hai agar tokens JS mein hain.',
      'Token storage, CSP, PR review, CSRF alag path.',
      'Stranger ka letter mat nigalo. Pehle envelope check.'
    )
  },
  {
    area: 'Auth',
    terms: 'RBAC, UI hide, authorization',
    q: 'Admin button UI se hide kar diya. Kya yeh enough hai? Tum kya aur insist karoge?\n\nPehle words clear kar lo: RBAC matlab roles se permissions. authorization matlab server pe allow/deny. UI hide sirf dikhawa.',
    a: scenarioAnswerBlock_(
      'Main clear bolunga UI hide sirf UX hai. Asli authz server pe honi chahiye.',
      'Har privileged API role permission check kare. FE flags sirf UX. Client role claims bina server verify trust nahi. 401 403 paths test. Admin actions audit log.',
      'Hide secure nahi. Server authorization mandatory.',
      'Attacker API seedha hit karta hai; UI gate nahi.',
      'API design, IDOR, auth middleware, FE route guards.',
      'Staff room pe mat ghusna likha — lock bhi chahiye, sirf poster nahi.'
    )
  }
  ];
}

function feData_() {
  return [
  {
    mustKnow: true,
    area: 'Data',
    terms: 'race, stale response, abort, request id',
    q: 'User rapidly filters a table; purani API response latest result ko overwrite kar rahi hai. Tum kaise fix karoge?\n\nPehle words clear kar lo: race matlab requests ka order galat. stale response matlab purani jawab late aayi. AbortController matlab purani request cancel.',
    a: scenarioAnswerBlock_(
      'Main out-of-order responses handle karunga — purani ignore, abort previous, ya request sequence.',
      'RequestId badhaunga; apply sirf latest match pe. Naye filter pe AbortController abort. React Query jaisi libs query keys se bahut sambhalti hain. Loading dikhao; stale paint nahi. Network throttle se test.',
      'Last response tab jeete jab latest query ki ho. Abort ya sequence.',
      'Race se screen pe galat data — galat decisions support tickets.',
      'useEffect cleanup, HTTP cancel, caching, loading UX.',
      'Purani pizza late aaye to nayi order pe mat rakho — order number check.'
    )
  },
  {
    area: 'Data',
    terms: 'optimistic update, rollback, conflict',
    q: 'Optimistic UI se like count turant badhta hai, lekin server fail. Tum UX/state kaise handle karoge?\n\nPehle words clear kar lo: optimistic matlab pehle UI update, server baad mein confirm. rollback matlab fail pe purana UI wapas.',
    a: scenarioAnswerBlock_(
      'Main optimistic tab use karunga jab fail pe guaranteed rollback ho — warna UI jhoot bolega.',
      'UI/cache turant update, previous snapshot rakhunga. Error pe revert toast. Success pe server truth sync. Conflict pe policy — server prefer ya merge. Payments irreversible pe optimistic nahi.',
      'Optimistic ko rollback path chahiye. Money pe avoid.',
      'Bina rollback UI forever jhoot bol’ta hai after failure.',
      'React Query mutations, idempotency, error UX, mid-flight 401.',
      'Scoreboard pe pehle point; referee reject kare to mita do — jhoot score mat chhodo.'
    )
  },
  {
    area: 'Data',
    terms: 'cache invalidation, stale, refetch',
    q: 'User ne data edit kiya magar list page purana cache dikha rahi hai. Tum invalidation strategy kaise set karoge?\n\nPehle words clear kar lo: cache matlab yaad rakha data. invalidation matlab purana hataana ya refresh. query key matlab cache ka address.',
    a: scenarioAnswerBlock_(
      'Main mutation ke baad related keys invalidate ya surgically update karunga.',
      'Query keys resource se define. Success pe lists details invalidate ya setQueryData. Cache forever bina version ke avoid. Stale-while-revalidate UX. Over-invalidation refetch storm.',
      'Cache bina invalidation correct-looking jhoot. Key design matter.',
      'Stale cache product pe trust tod’ta hai.',
      'HTTP cache headers, CDN, React Query, optimistic updates.',
      'Timetable change notice board pe; bag mein purana print — board check invalidation.'
    )
  }
  ];
}

function feA11y_() {
  return [
  {
    mustKnow: true,
    area: 'A11y',
    terms: 'modal, focus trap, keyboard, aria',
    q: 'Modal open hai lekin keyboard user background pe tab kar pa raha hai / focus lost. Tum kya fix karoge?\n\nPehle words clear kar lo: a11y matlab accessibility. focus trap matlab Tab modal ke andar ghoome. aria matlab screen reader ke liye hints. inert matlab background inactive.',
    a: scenarioAnswerBlock_(
      'Main ensure karunga ki modal open hote hi focus modal ke andar chala jaye, Tab background mein na ja sake, aur modal close hone par focus usi element par wapas aaye jisne modal open kiya tha.',
      'Sabse pehle modal ko proper dialog semantics dunga, preferably native <dialog> ya trusted UI primitive use karunga. Open hote hi sensible element par focus set karunga. Tab / Shift+Tab ko modal ke andar hi cycle karunga, Escape se modal close hoga, aur close ke baad opener element par focus restore karunga. Background content ko inactive karne ke liye inert use kar sakta hoon. Dialog ko proper accessible name ke liye aria-labelledby ya appropriate labelling dunga. Saath mein keyboard-only aur screen-reader testing karunga.',
      'Modal sirf screen par dikhna enough nahi hai — focus bhi correctly manage hona chahiye. Background interactive nahi rehna chahiye.',
      'Keyboard user modal ke bahar chala jayega aur usse pata nahi chalega ki currently kis UI ke saath interact kar raha hai. Screen-reader users ke liye experience aur bhi confusing ho sakta hai.',
      'Ye semantic HTML, keyboard navigation, focus management, form accessibility, ARIA aur reusable component-library primitives se directly connected hai.',
      'Socho tum ek room mein kisi se baat kar rahe ho. Jab room ka door band hai, tumhara dhyaan usi person par rehna chahiye. Baat khatam hone par tum wapas us jagah chale jao jahan se aaye the.'
    )
  }
  ];
}

function feBuild_() {
  return [
  {
    mustKnow: true,
    area: 'Build',
    terms: 'env vars, build-time, runtime, drift',
    q: 'Feature staging pe chal rahi, production mein missing/wrong API URL. Tum pehle kya check karoge?\n\nPehle words clear kar lo: env vars matlab environment settings. build-time matlab build ke waqt andar bake. runtime matlab deploy pe read. drift matlab staging prod settings alag galat.',
    a: scenarioAnswerBlock_(
      'Main pehle env drift suspect karunga — bake vs runtime, galat secret store, purana cached bundle.',
      'Kaunsa commit artifact deploy hua confirm. Env kaise inject — VITE_ NEXT_PUBLIC build pe bake. Prod pipeline values vs staging. Hardcoded URLs. Zarurat ho to runtime config. Startup pe non-secret config log. Secrets commit nahi.',
      'Build-time vs runtime samjho. Same artifact plus runtime config drift kam. Secrets kabhi commit nahi.',
      'Env galti classic works-in-staging outage laati hai — 5 YOE interview trap.',
      'CI/CD, feature flags, 12-factor, source maps, rollback.',
      'Exam center galat address print. Ghar pe practice theek — print env check pehle.'
    )
  },
  {
    area: 'Build',
    terms: 'rollback, CI/CD, feature flag, source maps',
    q: 'Bad frontend deploy live ho gaya. Tum rollback vs flag-off — kaise decide, pehle 10 minute kya?\n\nPehle words clear kar lo: feature flag matlab remote switch. rollback matlab purana build. source maps matlab minified error ko asli line se jodna. CDN cache matlab edge pe purani files.',
    a: scenarioAnswerBlock_(
      'Main pehle dekhunga flag wraps feature to turant off; warna last good artifact rollback — errors aur sourcemaps ke saath.',
      'Severity aur percent users. Flag ho to off. Else last known good redeploy. CDN purge zarurat pe. Private source maps se stack padho. Baad mein smoke tests aur risky UI pe flag. Panic hotfix se pehle mitigate.',
      'Flags rollback se tez jab design mein hon. Previous artifact ready rakho. Source maps public sensitive expose mat.',
      'Bina rollback path broken UI baitha rehta hai jab tum panic hotfix karte ho.',
      'CI/CD, monitoring, ownership, perf budgets, auth cookie domains.',
      'Galat announcement speaker pe. Turant ignore previous bolo flag, ya purana tape rollback.'
    )
  }
  ];
}

// ================================================================
// BACKEND SCENARIO BATCHES
// ================================================================

function beApi_() {
  return [
  {
    mustKnow: true,
    area: 'API',
    terms: 'status codes, error contract, 400 vs 500, validation',
    q: 'Frontend ko API se invalid input par kabhi 400, kabhi 500 mil raha hai. Tum API error contract ko kaise fix karoge?\n\nPehle words clear kar lo: error contract matlab client ko predictable status aur body milna. 400 matlab client galt request. 500 matlab server ki galti.',
    a: scenarioAnswerBlock_(
      'Main ensure karunga invalid input pe consistent 4xx + clear error body aaye, accidental 500 na bane — warna FE guess karta rehta hai.',
      'Sabse pehle logs mein dekhunga 500 kab aa raha — uncaught validation throw ya framework default. Phir request validation ek jagah standardize karunga: schema fail pe 400/422 with field-level messages. Unexpected bugs pe 500, lekin message safe (no stack leak). Error shape document karunga — code, message, fields. FE aur BE same contract pe agree. Tests add karunga invalid cases ke liye.',
      'Client mistakes = 4xx. Server bugs = 5xx. Consistent JSON error shape interview mein strong signal hai.',
      'Bina clear contract ke FE random retries, poor UX, aur debugging chaos hota hai.',
      'Validation, observability, API versioning, client resilience, OpenAPI/docs.',
      'Teacher ko galat form do to “form theek karo” bole (400), school computer toot jaye to alag baat (500).'
    )
  },
  {
    area: 'API',
    terms: 'API versioning, backward compatibility, mobile clients',
    q: 'Existing API ko change karna hai but old mobile clients bhi use kar rahe hain. Breaking change avoid karne ke liye kya approach loge?\n\nPehle words clear kar lo: breaking change matlab purana client toot jaye. backward compatibility matlab purane clients chalte rahein. versioning matlab /v1 /v2 ya additive fields.',
    a: scenarioAnswerBlock_(
      'Main pehle additive change prefer karunga — purane fields mat todo, naya add karo, phir deprecate.',
      'Consumers inventory — kaunse app versions live hain. Prefer naye optional fields, dual-read/write jab shape badle. Hard break zaroori ho to /v2 ya version header + migration window. Deprecation notice, monitoring old path usage. Coordinated release jab possible. Contract tests purane clients ke against.',
      'Additive > sudden break. Old clients = compatibility plan, not hope.',
      'Bina plan ke mobile users toot jaate hain jo update nahi kar sake.',
      'Semver, feature flags, deprecation, FE deploy cadence, monitoring.',
      'Phone number change — pehle dono numbers chalne do, phir purana band.'
    )
  },
  {
    area: 'API',
    terms: 'pagination, offset vs cursor, large lists',
    q: 'Admin list API lakhs of rows return karne ki koshish kar rahi hai aur timeout / memory spike aa raha hai. Tum pagination kaise design/fix karoge?\n\nPehle words clear kar lo: pagination matlab data chunks mein dena. offset/limit page number style. cursor pagination stable next-page token.',
    a: scenarioAnswerBlock_(
      'Main unbounded list kabhi allow nahi karunga production pe — page size limit + stable pagination.',
      'Default page size chhota, max cap. Deep offset expensive ho to cursor/keyset prefer. Total count alag expensive endpoint ya estimate. Indexes on sort keys. FE infinite scroll ya pages. Load test large tables pe.',
      'Never return entire table. Cap page size. Cursor better for deep pages.',
      'Bina pagination ke API/DB/memory toot’te hain aur timeouts aate hain.',
      'Indexes, caching, FE lists, rate limits, DB load.',
      'Library ki saari kitaabein ek bag mein mat — page by page uthao.'
    )
  },
  {
    area: 'API',
    terms: 'idempotency, POST retries, duplicate create',
    q: 'Client same create/payment request network timeout ke baad retry karta hai aur duplicate record ban jata hai. Tum API ko kaise safe banaoge?\n\nPehle words clear kar lo: idempotency matlab same request dobara = same result, naya duplicate nahi. idempotency key matlab client ka unique action id.',
    a: scenarioAnswerBlock_(
      'Main retries ko safe banaunga — Idempotency-Key store karke same response wapas, unique constraints safety net.',
      'Client har user action pe unique key bheje. Server key → result map karke rakhe; replay pe same 200/201 body. DB unique on natural keys. POST create pe careful. Docs + FE retry same key reuse. At-least-once networks assume.',
      'Retry without idempotency = duplicates. Keys + unique constraints = seatbelts.',
      'Networks fail; bina safe retries double charge / double rows.',
      'Queues, payments, FE double-submit, transactions, HTTP semantics.',
      'Order button do baar — shop ko pehchan chahiye same order, do pizza mat.'
    )
  }
  ];
}

function beNode_() {
  return [
  {
    mustKnow: true,
    area: 'Node',
    terms: 'event loop, blocking, CPU-bound, worker',
    q: 'Ek endpoint mein accidentally CPU-heavy calculation aa gayi aur uske baad doosri requests bhi slow ho gayi. Tum kya change karoge?\n\nPehle words clear kar lo: event loop matlab Node ka single-threaded scheduler. CPU-heavy sync kaam loop block karta hai. worker thread/process alag CPU pe kaam bhejna.',
    a: scenarioAnswerBlock_(
      'Main samjhunga Node pe sync CPU kaam poori process ko block karta hai — isliye sab requests slow.',
      'Pehle confirm — CPU high, event loop lag metrics. Heavy work offload: worker threads, separate job queue, ya precompute. Endpoint ko async/non-blocking rakho. Timeouts aur circuit for slow paths. Load test se verify. Agar library sync crypto/hash badi — async/native alternatives.',
      'CPU-bound sync work Node pe global slowdown. Offload heavy compute.',
      'Bina iske ek bad endpoint poori API ko hang jaisa feel karata hai.',
      'Queues, horizontal scale, profiling, async I/O strengths of Node.',
      'Ek teacher saara class sum 10 minute solve kare — koi sawal nahi pooch sakta. Heavy sum alag room bhejo.'
    )
  },
  {
    area: 'Node',
    terms: 'memory leak, heap, retention, profiling',
    q: 'Node process memory dheere-dheere badh rahi hai aur kuch hours baad restart chahiye. Tum kaise investigate karoge?\n\nPehle words clear kar lo: memory leak matlab objects free nahi ho rahe. heap snapshot matlab memory photo. retention matlab kaun refer kar raha.',
    a: scenarioAnswerBlock_(
      'Main pehle trend confirm karunga — leak vs normal cache growth — phir heap snapshots compare.',
      'Metrics: RSS/heap over time, request rate. Suspect: global maps, unbounded caches, event listener leaks, unclosed streams. Heap dump before/after load. Fix: TTL caches, remove listeners, bound queues. Staging pe reproduce. Alert on memory growth.',
      'Unbounded in-memory structures = classic Node leak. Measure before rewrite.',
      'Leak se OOM kills, random restarts, flaky prod.',
      'Caching TTL, streams, process managers, horizontal scale masking leaks.',
      'Bag mein toys daalte raho, kabhi nikaalo nahi — bag phat jaayega.'
    )
  },
  {
    area: 'Node',
    terms: 'unhandledRejection, async errors, crash',
    q: 'Kabhi-kabhi process unexplained crash / restart ho jati hai. Logs mein unhandled promise rejection dikh sakta hai. Tum reliability kaise improve karoge?\n\nPehle words clear kar lo: unhandledRejection matlab Promise fail hui lekin catch nahi. async error handling matlab try/catch await, .catch, middleware.',
    a: scenarioAnswerBlock_(
      'Main ensure karunga har async path pe errors catch ho — unhandled rejections process ko maar sakti hain.',
      'Global handlers log + safe shutdown policy. Routes pe async wrappers. Await sab promises; floating promises avoid. Third-party callbacks wrap. Tests for rejection paths. APM error tracking.',
      'Never leave floating promises. Central async error middleware.',
      'Unhandled async errors = silent fails ya sudden process death.',
      'Observability, Express/Fastify patterns, retries, health checks.',
      'Homework galat ho aur teacher ko na batao — problem baad mein badi boom.'
    )
  },
  {
    area: 'Node',
    terms: 'I/O vs CPU, concurrency, throughput',
    q: 'Node.js API ka response suddenly slow ho gaya aur CPU 100% ke paas ja raha hai. Tum pehle kya investigate karoge?\n\nPehle words clear kar lo: I/O-bound matlab wait on network/DB. CPU-bound matlab calculation. throughput matlab kitni requests handle.',
    a: scenarioAnswerBlock_(
      'Main pehle decide karunga yeh I/O wait hai ya CPU burn — dono ke fixes alag hain.',
      'Dashboards: CPU, event loop delay, latency, DB time, GC. Flamegraph/profile hot functions. Check recent deploy — new sync loop, JSON parse huge, regex catastrophic. If DB wait high then not “Node slow”. Fix root: optimize query, offload CPU, increase instances only after bottleneck known.',
      'High CPU ≠ always need more servers. Profile first.',
      'Blind scale pe bottleneck same rehta hai aur cost badhta hai.',
      'DB indexes, caching, workers, load tests, deployments.',
      'Race slow — pehle dekho thakawat (CPU) ya joota bandhna (wait) — phir training.'
    )
  }
  ];
}

function beDb_() {
  return [
  {
    mustKnow: true,
    area: 'Database',
    terms: 'slow query, EXPLAIN, index, query plan',
    q: 'Production mein ek query 5 seconds le rahi hai aur table mein millions of rows hain. Tum blindly index add karoge ya pehle kya investigate karoge?\n\nPehle words clear kar lo: EXPLAIN/query plan matlab DB kaise data dhundhta hai. index matlab tezi se dhundhne ki kitab. sequential scan matlab poori table padhna.',
    a: scenarioAnswerBlock_(
      'Main blindly index nahi dalunga. Pehle measure — plan, filters, rows examined, missing index vs bad query shape.',
      'Slow query log + EXPLAIN ANALYZE. Check WHERE/JOIN/ORDER columns, selectivity, existing indexes. Dekho N+1 ya app loop. Index only jab plan prove kare; write cost aur unused indexes socho. Covering index / composite order matter. Pagination deep offset. After change measure again. Migration carefully online.',
      'Investigate plan first. Index is a tool, not a reflex. Measure before/after.',
      'Galat index writes slow karta hai aur problem solve nahi karta.',
      'Caching, pagination, connection pools, ORM pitfalls, monitoring.',
      'Dictionary mein word dhundho — index page se, har page mat padho. Pehle dekho problem kahan.'
    )
  },
  {
    area: 'Database',
    terms: 'N+1 queries, ORM, eager load',
    q: 'API 100 users ke data ke liye 101 database queries kar rahi hai. Tum issue identify aur fix kaise karoge?\n\nPehle words clear kar lo: N+1 matlab 1 list query + har item pe alag query. eager load/join/batch matlab related data ek saath.',
    a: scenarioAnswerBlock_(
      'Main N+1 pattern pakdungga — list ke baad loop mein per-row queries.',
      'APM/DB logs se query count per request. ORM relations pe preload/join/batch IN queries. GraphQL/DataLoader style batching jab needed. Fix verify — 101 se ~2–3 queries. Avoid over-fetch. Add regression test on query count where practical.',
      'N+1 silent killer under load. Count queries per request.',
      'Latency aur DB load explode hote hain jaise users badhte hain.',
      'ORMs, caching, pagination, indexes, API payload design.',
      'Market se 100 cheezein — 100 dafa mat jao; list banao ek trip.'
    )
  },
  {
    area: 'Database',
    terms: 'lost update, optimistic lock, version column, transactions',
    q: 'Do users same record ko almost same time update kar rahe hain aur kabhi-kabhi ek user ka update overwrite ho raha hai. Tum problem ko kaise solve karoge?\n\nPehle words clear kar lo: lost update matlab baad wali write pehli ko mita de. optimistic locking matlab version check. pessimistic lock matlab row lock.',
    a: scenarioAnswerBlock_(
      'Main concurrent overwrite ko race maanoonga — version/etag ya transactional compare-and-swap chahiye.',
      'Reproduce with parallel requests. Add version column; UPDATE … WHERE id AND version; mismatch pe 409 conflict. Ya SELECT FOR UPDATE jab short critical section. UI ko conflict dikhao. Idempotent patches where possible. Tests for concurrent updates.',
      'Read-modify-write without concurrency control = lost updates. Prefer version checks.',
      'Bina iske money/inventory/settings silently corrupt ho sakte hain.',
      'Transactions, isolation, HTTP 409, UX conflict resolution, queues.',
      'Do log same notebook line likhein — last wala pehla mita de. Page number check karo pehle.'
    )
  },
  {
    area: 'Database',
    terms: 'deadlock, lock order, transactions',
    q: 'Kabhi-kabhi requests fail ho rahi hain deadlock error ke saath. Tum kaise diagnose aur reduce karoge?\n\nPehle words clear kar lo: deadlock matlab do transactions ek doosre ka lock wait. lock order matlab hamesha same sequence mein rows lock.',
    a: scenarioAnswerBlock_(
      'Main deadlock ko random bug nahi, locking order problem maanoonga.',
      'DB logs deadlock graph. Transactions chhote rakho. Consistent lock ordering. Avoid long locks around external HTTP. Retry once on deadlock with backoff. Check indexes so locks fewer rows. Reduce serializable where not needed.',
      'Short transactions + consistent lock order + limited deadlock retries.',
      'Deadlocks user-facing random failures aur support noise.',
      'Isolation levels, connection pools, retries, app timeouts.',
      'Do dost ek doosre ki kitaab wait — dono chup. Ek order se kitaab lo.'
    )
  },
  {
    area: 'Database',
    terms: 'transactions, atomicity, partial write',
    q: 'Order create hota hai lekin payment row kabhi fail/partial reh jaati hai. Tum data consistency kaise guarantee karoge?\n\nPehle words clear kar lo: transaction matlab sab succeed ya sab rollback. atomicity matlab adhoora state nahi. saga matlab distributed steps with compensations.',
    a: scenarioAnswerBlock_(
      'Main related writes ko ek transaction mein bandhunga jab same DB ho — partial order state nahi chahiye.',
      'Same DB: BEGIN, insert order+items+payment intent, COMMIT; fail pe rollback. External payment gateway: outbox/saga — mark pending, confirm async, compensate. Constraints FK. Idempotent payment callbacks. Never “fire and forget” critical multi-write without plan.',
      'Multi-row consistency = transaction or explicit saga. No half orders.',
      'Partial writes reporting, refunds, aur trust tod’te hain.',
      'Idempotency, queues, constraints, reconciliation jobs.',
      'Pizza aur cold drink combo — ya dono mile ya order cancel; sirf pizza adhoora mat.'
    )
  }
  ];
}

function beCache_() {
  return [
  {
    mustKnow: true,
    area: 'Cache',
    terms: 'cache-aside, Redis, TTL, invalidation',
    q: 'Product API ka data DB se expensive aa raha hai aur same product thousands of times read ho raha hai. Tum caching kahan add karoge aur invalidation kaise handle karoge?\n\nPehle words clear kar lo: cache-aside matlab pehle cache dekho, miss pe DB, phir cache bharo. TTL matlab expiry time. invalidation matlab update pe purana hataana.',
    a: scenarioAnswerBlock_(
      'Main hot read path pe cache-aside rakhunga, lekin write pe invalidation/TTL clear soch ke.',
      'Key design product:id. Read: get cache → miss → DB → set with TTL. Update/delete pe delete key ya versioned keys. Stampede pe soft TTL / singleflight. Monitor hit rate aur stale incidents. Don’t cache user-private data casually.',
      'Cache without invalidation strategy = wrong prices. TTL + on-write invalidate.',
      'Expensive reads DB ko jalaate hain; stale cache business galt dikhata hai.',
      'CDN, DB load, consistency trade-offs, idempotent writes.',
      'Test answers cheat sheet — jab syllabus change ho sheet update/fenk do.'
    )
  },
  {
    area: 'Cache',
    terms: 'stale cache, consistency, write-through',
    q: 'Cache mein purana price serve ho raha hai after product update. Tum consistency kaise maintain karoge?\n\nPehle words clear kar lo: stale matlab purana cached value. write-through matlab write pe cache bhi update. eventual consistency matlab thodi der baad sahi.',
    a: scenarioAnswerBlock_(
      'Main update path pe cache ko bhoolna band karunga — invalidate ya update on write.',
      'Find writers that skip invalidation. On update: transaction then delete cache key (or set new value). Short TTL safety net. For money-critical fields consider bypass cache or strong refresh. Add test: update then read fresh. Metrics for stale complaints.',
      'Every write path must touch cache policy. TTL alone often not enough for prices.',
      'Wrong price = lost trust / legal / support hell.',
      'DB transactions, API GET/PUT, CDN purge, feature flags.',
      'Notice board pe purana fees — naya fees chipkao ya board saaf.'
    )
  },
  {
    area: 'Cache',
    terms: 'cache stampede, thundering herd, singleflight',
    q: 'Popular key expire hote hi thousands of requests saath mein DB pe toot padte hain. Tum stampede kaise kam karoge?\n\nPehle words clear kar lo: cache stampede/thundering herd matlab bahut requests ek saath miss pe DB hit. singleflight matlab ek hi refill, baaki wait.',
    a: scenarioAnswerBlock_(
      'Main ensure karunga expiry pe ek refill ho, storm na baney.',
      'Singleflight/lock around rebuild. Soft expiry serve stale briefly while refresh. Jittered TTLs. Probabilistic early refresh. Scale DB only after cache protection. Monitor miss spikes.',
      'Protect DB from simultaneous misses on hot keys.',
      'Stampede pe cache hone ke bawajood DB melt ho sakta hai.',
      'Redis, rate limits, horizontal pods, query optimization.',
      'Bell ke baad saari class ek saath paani — line/monitor se ek-ek.'
    )
  }
  ];
}

function beAuth_() {
  return [
  {
    mustKnow: true,
    area: 'Auth',
    terms: 'authorization, RBAC, UI hide vs server check',
    q: 'User UI mein admin button hide kar diya gaya hai, but API directly hit karne par normal user admin action perform kar pa raha hai. Tum kya fix karoge?\n\nPehle words clear kar lo: authentication matlab kaun ho tum. authorization matlab tumhe permission hai kya. RBAC matlab roles se permissions. UI hide sirf dikhawa.',
    a: scenarioAnswerBlock_(
      'Main clear bolunga — Frontend permission hiding authorization nahi hai. Har privileged API pe server check mandatory.',
      'Backend middleware pe role/permission verify. 403 on forbidden. Tests: normal user cannot hit admin routes. Audit logs admin actions. FE hide sirf UX. Never trust client role claims without server verify. IDOR checks on resource ownership.',
      'Hide ≠ secure. Server authorization non-negotiable.',
      'Attackers UI skip karke API seedha maarte hain.',
      'JWT claims, sessions, API gateways, audit, FE route guards.',
      'Staff room pe poster “mat ghusna” — lock bhi chahiye.'
    )
  },
  {
    area: 'Auth',
    terms: 'access token, refresh token, expiry, rotation',
    q: 'Access token expire ho gaya while user API call kar raha hai. Backend refresh flow ko safely kaise handle karoge?\n\nPehle words clear kar lo: access token short-lived. refresh token se naya access milta hai. rotation matlab refresh use hone pe naya refresh.',
    a: scenarioAnswerBlock_(
      'Main short access + refresh rotation design karunga, reuse detection ke saath jab possible.',
      'Access expire pe client refresh endpoint. Refresh httpOnly Secure cookie prefer. Rotate refresh; reuse of old refresh = revoke family (theft signal). Rate limit refresh. Clear audit. Don’t put long refresh in localStorage casually. Document clock skew.',
      'Short access tokens. Protect refresh. Rotation beats forever tokens.',
      'Stolen long-lived token = long account takeover window.',
      'Cookies, CSRF, FE interceptors, logout revoke, XSS.',
      'Day pass short; month pass locked drawer mein — daily new day pass.'
    )
  },
  {
    area: 'Auth',
    terms: 'logout, token revoke, session store',
    q: 'User logout karta hai magar purana access token expiry tak kaam karta rehta hai. Tum logout ko meaningfully kaise banaoge?\n\nPehle words clear kar lo: stateless JWT logout mushkil bina denylist/short expiry. session store matlab server-side session invalidate.',
    a: scenarioAnswerBlock_(
      'Main samjhunga pure stateless JWT ko turant “kill” karna hard hai — short TTL + revoke list/session store.',
      'Prefer server sessions or refresh revoke store. On logout: delete refresh, blacklist access jti until exp if needed. FE clear tokens. All devices logout = revoke all refresh. Document limitation of long JWT without store.',
      'Logout needs server-side revoke story for refresh at minimum.',
      'Stolen token logout ke baad bhi chalta rahe to logout jhoot hai.',
      'Redis session, JWT exp, security incidents, cookie clearing.',
      'Club se nikalne pe pass cancel — warna koi ghus jaye.'
    )
  },
  {
    area: 'Auth',
    terms: 'password hashing, bcrypt/argon2, secrets',
    q: 'Legacy system plain text / weak hashing se passwords store karta dikha. Tum migration safely kaise plan karoge?\n\nPehle words clear kar lo: hashing matlab password one-way. bcrypt/argon2 slow hashes. migration matlab login pe rehash.',
    a: scenarioAnswerBlock_(
      'Main plain text turant rokunga — modern hash + login-time rehash migration.',
      'New passwords argon2/bcrypt. On login if legacy detected: verify old, store new hash, delete old. Force reset for irreversible weak schemes if needed. Secrets out of git. Breach assumption if plain was stored — notify/reset. Add tests.',
      'Never store plain passwords. Migrate on login; assume breach if exposed.',
      'DB leak pe plain passwords = mass account takeover.',
      'Secrets management, HTTPS, MFA, audit, compliance.',
      'Diary mein password mat likho — lock code box jo wapas na khule asani se.'
    )
  }
  ];
}

function beAsync_() {
  return [
  {
    mustKnow: true,
    area: 'Async',
    terms: 'retries, idempotency, duplicate charge, jobs',
    q: 'Payment processing job retry hone par customer ko do baar charge kar diya ja raha hai. Tum system ko kaise safe banaoge?\n\nPehle words clear kar lo: job retry matlab fail pe dubara try. idempotent consumer matlab same message dobara process safe. dedupe key matlab unique payment attempt.',
    a: scenarioAnswerBlock_(
      'Main payment side effects ko idempotent banaunga — retries duplicate charge na karein.',
      'Idempotency key per payment attempt stored before charge. Provider idempotency keys too. Unique constraint on payment intent. At-least-once queue assume. Dead-letter after N fails with alert — not infinite retry charge. Reconciliation job. Tests simulating duplicate delivery.',
      'At-least-once + side effects = must be idempotent. Especially money.',
      'Duplicate charges trust aur legal nightmare.',
      'Queues, API idempotency, DB constraints, observability.',
      'Bus ticket machine do baar — same ticket number pe do charge mat.'
    )
  },
  {
    area: 'Async',
    terms: 'queue, background job, email, reliability',
    q: 'User signup ke baad welcome email bhejni hai but email provider slow/unavailable ho sakta hai. Request ko reliable kaise design karoge?\n\nPehle words clear kar lo: synchronous email matlab user wait. queue/outbox matlab DB mein event, worker bheje. eventual delivery.',
    a: scenarioAnswerBlock_(
      'Main signup response ko email provider pe block nahi karunga — enqueue + retry.',
      'Signup transaction commit then outbox/queue message. Worker sends email with retries/backoff. Provider down → retry, DLQ, alert. User still created. Idempotent “welcome already sent” flag. Don’t fail signup on email blip.',
      'User-facing request ≠ best-effort external I/O. Queue it.',
      'Sync email se signup timeouts aur lost users.',
      'Outbox pattern, retries, SLAs, FE success UX.',
      'School admission pe pehle seat confirm; welcome letter baad mein post.'
    )
  },
  {
    area: 'Async',
    terms: 'dead letter, poison message, failure handling',
    q: 'Ek background job baar-baar fail ho rahi hai aur queue mein stuck retries server load badha rahe hain. Tum kya karoge?\n\nPehle words clear kar lo: poison message matlab hamesha fail hone wala job. DLQ matlab dead-letter queue alag parking. backoff matlab wait badhana.',
    a: scenarioAnswerBlock_(
      'Main infinite retry storm rokunga — max attempts, backoff, DLQ + alert.',
      'Cap retries with exponential backoff + jitter. After N fails move DLQ. Alert onboarding. Fix root (bad payload/schema). Replay tool after fix. Separate consumer concurrency. Metrics on fail rate.',
      'Poison messages need DLQ, not endless retry.',
      'Retry storms amplify outages and hide real bugs.',
      'Circuit breakers, idempotency, ops runbooks, schema validation.',
      'Toota homework dubara-dubara mat — teacher desk pe rakho, baad mein theek.'
    )
  }
  ];
}

function beScale_() {
  return [
  {
    mustKnow: true,
    area: 'Scale',
    terms: 'bottleneck, metrics, horizontal scale, DB pool',
    q: 'API par traffic 10x ho gaya aur response time increase ho raha hai. Tum sabse pehle kya measure karoge aur bottleneck kaise locate karoge?\n\nPehle words clear kar lo: bottleneck matlab sabse slow constraint. horizontal scale matlab aur instances. connection pool matlab DB connections ki limit.',
    a: scenarioAnswerBlock_(
      'Main pehle measure karunga — CPU, DB, pool wait, external deps — blind pods add nahi.',
      'Dashboards: latency p95, error rate, CPU/mem, DB CPU, pool timeouts, queue lag. Split FE vs API vs DB vs third-party. If pool exhausted: queries/N+1/pool size/idle. If CPU: profile. If DB: slow queries. Scale the layer that hurts; cache/rate limit as needed. Load test after.',
      'Observe → locate bottleneck → fix/scale that layer. Don’t guess.',
      'Wrong layer scale = money waste, pain same.',
      'Caching, indexes, load balancers, rate limits, autoscale.',
      'Canteen line — pehle dekho counter slow ya plates khatam.'
    )
  },
  {
    area: 'Scale',
    terms: 'sticky sessions, stateless, session store',
    q: 'Multiple backend instances run kar rahe hain but login/session randomly fail ho raha hai. Tum kya investigate karoge?\n\nPehle words clear kar lo: sticky session matlab user hamesha same instance. stateless matlab session shared store mein. in-memory session multi-instance pe toot’ti hai.',
    a: scenarioAnswerBlock_(
      'Main suspect karunga in-memory sessions bina sticky/shared store ke.',
      'Confirm load balancer routing. If local memory sessions: move to Redis/DB or sticky (weaker). JWT/stateless access with shared revoke store. Test multi-instance locally. Document session strategy.',
      'Multi-instance needs shared session story or true stateless auth.',
      'Random logouts under scale = classic sticky/session bug.',
      'Redis, JWT, LB config, horizontal pods, cookies.',
      'Class change karo aur bag purani class mein — shared locker chahiye.'
    )
  },
  {
    area: 'Scale',
    terms: 'rate limiting, abuse, fair use',
    q: 'Ek client/API key se traffic spike karke doosre users slow kar raha hai. Tum rate limiting kaise approach karoge?\n\nPehle words clear kar lo: rate limit matlab requests per time window. token bucket/leaky bucket algorithms. 429 Too Many Requests.',
    a: scenarioAnswerBlock_(
      'Main noisy neighbor ko limit karunga — fair share without killing legit bursts totally.',
      'Limit by IP/user/API key at gateway. Return 429 with Retry-After. Different tiers. Burst allowance. Monitor who hits limits. Combine with auth and caching. Avoid only server-side late limits if edge can shed load.',
      'Rate limits protect shared resources. 429 is a feature.',
      'Bina limits ke ek abuser sabko le doobta hai.',
      'API keys, WAF, autoscale costs, caching, quotas.',
      'Water park slide — ek bachcha baar-baar line skip na kare; turn system.'
    )
  }
  ];
}

function beReliability_() {
  return [
  {
    mustKnow: true,
    area: 'Reliability',
    terms: 'timeouts, retries, backoff, third-party',
    q: 'Tumhari API ek third-party service ko call karti hai jo kabhi 10 seconds tak response nahi deti. Tum endpoint ko reliable kaise banaoge?\n\nPehle words clear kar lo: timeout matlab wait ki had. backoff matlab fail pe badhti wait. bulkhead matlab failure isolate.',
    a: scenarioAnswerBlock_(
      'Main unbounded wait nahi rakhunga — tight timeouts, bounded retries, degrade gracefully.',
      'Set connect/read timeouts. Few retries only on idempotent/safe calls with exponential backoff + jitter. Circuit breaker when dependency sick. Fallback cached/partial response. Don’t block user thread forever — async where possible. Metrics on dependency latency.',
      'Always timeout external calls. Retry carefully; circuits when hot.',
      'Hung dependency threads/workers khaa ke poori API slow.',
      'Queues, caches, SLOs, incident response, async design.',
      'Dost call pe 10 min hold mat — beep timeout, baad mein try.'
    )
  },
  {
    area: 'Reliability',
    terms: 'retry storm, exponential backoff, jitter',
    q: 'Dependency temporarily down hai. Har request immediately retry kar rahi hai aur server load aur badh raha hai. Tum kya change karoge?\n\nPehle words clear kar lo: retry storm matlab sab clients saath mein dobara try. jitter matlab random extra wait. circuit open matlab thodi der calls mat karo.',
    a: scenarioAnswerBlock_(
      'Main synchronized immediate retries rokunga — backoff, jitter, circuit.',
      'Cap retries. Exponential backoff + jitter. Circuit breaker. Shed load with 503. Queue work instead of sync hammer. Client-side same policy. Load test failure injection.',
      'Fail fast + backoff beats hammering a down dependency.',
      'Retry storms turn blips into meltdowns.',
      'Rate limits, autoscale, DLQ, status pages.',
      'Bus nahi aayi — saari class road pe chilaye nahi; thodi der baad check.'
    )
  },
  {
    area: 'Reliability',
    terms: 'graceful degradation, partial failure, fallback',
    q: 'Recommendations service down hai lekin core checkout chal sakta hai. Tum product ko kaise degrade gracefully design karoge?\n\nPehle words clear kar lo: graceful degradation matlab core feature bachao, secondary soft fail. fallback matlab default/empty/cache.',
    a: scenarioAnswerBlock_(
      'Main core purchase path ko non-critical deps se isolate karunga.',
      'Timeouts on recommendations. Fallback empty list/cached. Feature flag hide widget. Checkout independent deploy/health. Error budgets. Don’t fail whole page on widget error.',
      'Separate critical vs best-effort paths. Fail soft on best-effort.',
      'One optional service shouldn’t take down revenue path.',
      'Circuit breakers, FE error boundaries, SLOs, microservices boundaries.',
      'Canteen mein ice cream machine kharab — khana band mat karo.'
    )
  }
  ];
}

function beTesting_() {
  return [
  {
    mustKnow: true,
    area: 'Testing',
    terms: 'integration tests, mocks, DB, test pyramid',
    q: 'Ek important API ke tests mostly mocks par pass ho rahe hain but production mein DB integration repeatedly break ho raha hai. Tum testing strategy kaise improve karoge?\n\nPehle words clear kar lo: unit/mocks matlab fake dependencies. integration test matlab real DB/API boundaries. test pyramid matlab zyada unit, kuch integration.',
    a: scenarioAnswerBlock_(
      'Main critical paths pe real-ish integration tests add karunga — mocks alone false confidence dete hain.',
      'Keep fast unit tests for logic. Add integration tests with test DB/containers for queries/transactions/constraints. Contract tests for external APIs. CI pipeline gate. Don’t over-mock ORM. Seed data carefully. Flaky test hygiene.',
      'Mocks don’t prove SQL/constraints. Integration for boundaries that break prod.',
      'Green CI + red prod = trust death.',
      'Migrations, CI/CD, observability, staging, contract testing.',
      'Cycle training wheels pe theek — bina wheels road test bhi karo.'
    )
  },
  {
    area: 'Testing',
    terms: 'regression test, bug fix, characterization',
    q: 'Bug fix kar diya but same regression baar-baar aa rahi hai. Test suite mein kya add/change karoge?\n\nPehle words clear kar lo: regression test matlab bug dubara aaye to fail. characterization test matlab current behavior lock.',
    a: scenarioAnswerBlock_(
      'Main har prod bug ke saath failing test pehle, phir fix — taaki lock ho jaye.',
      'Reproduce with minimal test. Assert edge cases that broke. Add to CI. If UI/API, contract or e2e smoke selective. Review why missed — gap in integration coverage. Document.',
      'No bug fix without a regression test when feasible.',
      'Same bug thrice = process failure, not bad luck.',
      'Postmortems, CI gates, code review, feature flags.',
      'Galat spell — list mein likho taaki dubara na ho.'
    )
  }
  ];
}

function beProd_() {
  return [
  {
    mustKnow: true,
    area: 'Production',
    terms: 'rollback, error rate, deployment, mitigate',
    q: 'Deployment ke immediately baad API error rate 2% se 20% ho gaya. Tum rollback karoge ya pehle investigate? Decision kaise loge?\n\nPehle words clear kar lo: error rate matlab fail percent. rollback matlab purana version. mitigate pehle, root cause baad.',
    a: scenarioAnswerBlock_(
      'Main high severity + clear deploy correlation pe pehle mitigate — rollback/flag — phir deep debug.',
      'Confirm deploy timestamp vs error spike. User impact. If payments/auth broken → rollback or disable flag fast. Check migration compatibility before rollback. If unsure but bleeding → mitigate. Then logs/traces for root cause, fix forward, postmortem. Canary next time.',
      'Stop the bleeding first when impact high. Migrations can block rollback — plan ahead.',
      'Pride debugging during outage = longer pain.',
      'Feature flags, CI/CD, health checks, on-call, DB migrations.',
      'Naya game update score tod de — pehle update undo, phir bug dhundo.'
    )
  },
  {
    area: 'Production',
    terms: 'structured logging, correlation id, observability',
    q: 'Production issue aa raha hai but logs mein sirf “Internal Server Error” hai. Tum debugging aur observability ko kaise improve karoge?\n\nPehle words clear kar lo: structured logging matlab JSON fields. correlation/request id matlab ek request ka thread. stack + context.',
    a: scenarioAnswerBlock_(
      'Main ensure karunga errors mein context ho — request id, route, user/tenant safe fields, cause.',
      'Central error middleware log stack + code. Propagate correlation ids. Metrics by endpoint status. Traces for slow deps. Never log secrets. Sampling noisy logs. Alert on rate not only text. Staging parity.',
      '“Internal Server Error” alone is useless. Context + ids + metrics.',
      'Blind logs = long MTTR.',
      'APM, SLOs, privacy, incident response, FE error reporting.',
      'Teacher sirf “galat” bole bina bataye kahan — seekh nahi sakte.'
    )
  },
  {
    area: 'Production',
    terms: 'health checks, readiness, liveness, deploy',
    q: 'Load balancer kabhi-kabhi traffic bhej raha hai instance ko jo abhi boot/warmup mein hai aur errors aa rahe hain. Tum kya fix karoge?\n\nPehle words clear kar lo: liveness matlab process zinda. readiness matlab traffic lene layak. warmup matlab cache/DB connections ready.',
    a: scenarioAnswerBlock_(
      'Main readiness check alag rakhunga — ready hone se pehle LB traffic nahi.',
      'Readiness fails until DB pool connected and critical deps OK. Liveness for deadlock/hung. Graceful shutdown: stop ready, drain, then exit. K8s/LB timeouts tune. Warmup caches carefully. Test rolling deploys.',
      'Ready ≠ Alive. Don’t take traffic until ready.',
      'Premature traffic = deploy-induced error spikes.',
      'K8s probes, rolling deploys, connection pools, graceful shutdown.',
      'Shop shutter half open — customers mat bhejo; pehle lights on.'
    )
  }
  ];
}

// ================================================================
// TOPIC 4 — SYSTEM DESIGN + TOPIC 5 — DEVOPS CLOUD BATCHES
// ================================================================

function sdArchitecture_() {
  return [
  {
    mustKnow: true,
    area: 'Architecture',
    terms: 'functional vs NFR, sync vs async, service boundary',
    q: 'Tumhe ek order system design karna hai jahan users order create karenge, payment hoga aur email jayegi. Tum architecture ko kaise break karoge aur kya synchronous/asynchronous rakhoge?\n\nPehle words clear kar lo: functional requirements matlab kya features. NFR matlab scale, latency, reliability. sync matlab user wait. async matlab background queue/event.',
    a: scenarioAnswerBlock_(
      'Main pehle requirements aur NFR clear karunga — kitna traffic, payment SLA, email delay tolerable. Core order+payment path tight, email/analytics async.',
      'Main pehle functional vs non-functional poochunga: peak orders, payment must succeed before confirm, email delay OK. Data model: Order, PaymentIntent, Outbox. Request path: validate, create order pending, charge payment sync idempotent, commit. Email invoice analytics outbox queue pe async. Agar payment provider slow ho to timeout plus pending state, hang forever nahi. Boundaries: Order module owns order state; payment adapter isolated. Observability: order id correlation. Failures: compensate or mark failed plus notify.',
      'Critical money path sync plus idempotent. Best-effort side effects async. Clarify NFRs before drawing boxes.',
      'Bina break ke sab sync timeouts; sab async bina consistency duplicate ya lost orders.',
      'Queues, idempotency, DB transactions, reliability, API design.',
      'School fee counter pe pehle fee confirm, welcome letter baad mein post — line mat rokna letter ke liye.'
    )
  },
  {
    mustKnow: true,
    area: 'Architecture',
    terms: 'monolith, microservice, extract, coupling',
    q: 'Existing monolith ka ek module bahut scale ho raha hai. Tum immediately microservice banaoge ya pehle kya evaluate karoge?\n\nPehle words clear kar lo: monolith matlab ek deployable app. microservice matlab alag deployable service. coupling matlab kitna tightly linked. strangler matlab dheere extract.',
    a: scenarioAnswerBlock_(
      'Main turant microservice nahi kaatoonga. Pehle bottleneck, ownership boundary, data coupling, aur team cost evaluate karunga.',
      'Pehle measure: CPU DB load kis module pe. Kya scale-out monolith instances se kaafi. Domain boundary clear hai kya — shared tables. Extract pehle module interface plus separate DB schema path. Strangler: new service beside, traffic shift. Ops cost: deploy, observability, network failure. Agar team chhoti aur coupling high, modular monolith pehle.',
      'Scale pain automatic microservices nahi. Evaluate boundary, data, ops cost first.',
      'Premature split distributed complexity aur outages badha sakta hai.',
      'Horizontal scale, DB ownership, CI/CD, latency, team Conway.',
      'Ghar ka ek room crowded — pehle furniture rearrange; turant naya ghar mat kharido.'
    )
  },
  {
    area: 'Architecture',
    terms: 'bottleneck, capacity, requirements clarification',
    q: 'Interviewer kehta hai URL shortener design karo bina numbers diye. Tum pehle kya clarify karoge aur kyun?\n\nPehle words clear kar lo: QPS matlab requests per second. read/write ratio. SLA matlab latency availability target. clarifying questions matlab pehle assumptions lock.',
    a: scenarioAnswerBlock_(
      'Main pehle numbers aur constraints poochunga — warna architecture guesswork ho jaati hai.',
      'Poochunga: daily peak QPS, read vs write, URL length, custom aliases, expiry, analytics need, consistency, latency target, regions. Phir rough capacity: storage, hash id generation, cache for hot redirects. Choose simple path first: DB plus cache plus unique keys. Scale story: cache hit, DB indexes, shard later if needed.',
      'No numbers then ask. Capacity and read/write shape the design.',
      'Wrong assumptions pe over ya under-engineering.',
      'Caching, DB keys, CDN, rate limits, observability.',
      'Kitna bada party — 10 ya 1000. Usse cake size decide.'
    )
  },
  {
    area: 'Architecture',
    terms: 'API gateway, sync coupling, fan-out',
    q: 'Checkout flow teen internal services ko sync call karta hai aur ek slow service poori request hang kar deti hai. Tum design mein kya badloge?\n\nPehle words clear kar lo: fan-out matlab ek request se kai downstream calls. sync coupling matlab wait on each. timeout bulkhead matlab failure isolate.',
    a: scenarioAnswerBlock_(
      'Main unbounded sync fan-out rokunga — timeouts, parallel where safe, async for non-critical, degrade.',
      'Map critical vs optional deps. Tight timeouts plus circuit on slow service. Parallelize independent calls. Non-critical to queue. Cached fallbacks. Bulkhead pools. Measure p95 per dependency.',
      'One slow dependency should not freeze checkout. Timeout plus isolate.',
      'Sync chains turn blips into site-wide latency.',
      'Reliability patterns, async, observability, SLOs.',
      'Teen shops se saman — ek shop band to poori list cancel mat; zaroori pehle.'
    )
  }
  ];
}

function sdApi_() {
  return [
  {
    mustKnow: true,
    area: 'API Design',
    terms: 'idempotency, duplicate orders, retries',
    q: 'Ek mobile client poor network ki wajah se same order request multiple times bhej raha hai aur duplicate orders ban rahe hain. API ko kaise design karoge?\n\nPehle words clear kar lo: idempotency key matlab client ka unique attempt id. at-least-once matlab network retry. duplicate create risk on POST.',
    a: scenarioAnswerBlock_(
      'Main order create ko idempotent banaunga — same key pe same order, naya duplicate nahi.',
      'Client generates Idempotency-Key per user action. Server stores key to orderId. Replay returns same response. Unique constraints on business keys where possible. Document retry behavior. FE reuse key on retry, new key on new intent.',
      'Create and payment APIs need idempotency under mobile retries.',
      'Poor networks plus non-idempotent POST duplicate money orders.',
      'Queues, DB uniqueness, mobile offline, payments.',
      'Ticket machine do baar dabao — same ticket number, do alag tickets mat.'
    )
  },
  {
    area: 'API Design',
    terms: 'pagination, filtering, sorting, consistency',
    q: 'Admin search API pe filter sort huge dataset hai aur deep pages bahut slow hain. Tum API contract kaise improve karoge?\n\nPehle words clear kar lo: offset pagination deep pages pe costly. cursor keyset matlab last seen key se aage. stable sort key.',
    a: scenarioAnswerBlock_(
      'Main deep offset avoid karunga — cursor pagination plus capped page size plus indexed sort keys.',
      'Max page size. Require deterministic sort. Prefer cursor tokens. Document filter fields that are indexed. Avoid COUNT every time if expensive. Rate limit heavy exports to async jobs.',
      'Unbounded list APIs do not scale. Cursor plus caps.',
      'Deep pages melt DB and timeout clients.',
      'Indexes, async export, caching, FE tables.',
      'Dictionary page 500 seedha — bookmark se aage badho, shuru se mat gino.'
    )
  },
  {
    area: 'API Design',
    terms: 'versioning, backward compatibility, rate limiting',
    q: 'Public API pe breaking change chahiye aur partners purane clients use karte hain. Versioning aur rate limit policy kaise sochoge?\n\nPehle words clear kar lo: breaking change matlab old client toot. versioning v2 ya header. rate limit abuse control.',
    a: scenarioAnswerBlock_(
      'Main dual support window rakhunga — v1 deprecate, v2 ship, monitor old usage, rate limits protect platform.',
      'Additive changes first when possible. Else v2 with migration guide. Deprecation timeline plus metrics on v1 traffic. Rate limit by API key. Contract tests. Communicate breaking fields early.',
      'Public APIs need compatibility windows plus abuse limits.',
      'Sudden break burns partner trust; unlimited traffic burns you.',
      'Auth API keys, monitoring, SDKs, gateways.',
      'School uniform change — notice period, pehle dono allow.'
    )
  }
  ];
}

function sdDatabase_() {
  return [
  {
    mustKnow: true,
    area: 'Data',
    terms: 'read replica, read-heavy, replication lag',
    q: 'Tumhare system mein reads writes se 20x zyada hain aur database primary instance load le raha hai. Tum architecture mein kya changes consider karoge?\n\nPehle words clear kar lo: read replica matlab copy for reads. replication lag matlab replica thoda peeche. cache pehle cheap win ho sakta.',
    a: scenarioAnswerBlock_(
      'Main pehle query cost aur cache chances dekhunga, phir read replicas for read-heavy paths — lag-sensitive reads primary pe.',
      'Measure which queries dominate. Add indexes fix N plus 1. Cache hot keys. Route read-tolerant traffic to replicas. Keep strong-consistency reads payments on primary. Connection pools sized right. Monitor lag. Partition later if single node still hot.',
      'Read-heavy instant shard nahi. Optimize, cache, replicas, then partition.',
      'Primary overload kills both reads and writes.',
      'Caching, indexes, connection pools, consistency trade-offs.',
      'Library ek copy — pehle photocopies padhne ke liye, rare books counter pe.'
    )
  },
  {
    mustKnow: true,
    area: 'Data',
    terms: 'partitioning, sharding, hot partition, archival',
    q: 'Ek table hundreds of millions of rows tak pahunch gayi hai aur queries increasingly slow ho rahi hain. Tum scaling strategy kaise decide karoge?\n\nPehle words clear kar lo: partition shard matlab data todna. hot partition matlab ek slice pe zyada load. archival matlab purana data cold store.',
    a: scenarioAnswerBlock_(
      'Main pehle access pattern samjhunga — time-range, tenant, id — usse partition key choose, blind shard nahi.',
      'EXPLAIN slow queries. Archive cold storage old data if product allows. Indexes matching filters. If still huge: partition by time or tenant. Avoid hot keys single popular id shard. Cross-partition queries costly — design APIs accordingly. Migrate gradually.',
      'Partition key follows query pattern. Hot keys kill shards.',
      'Wrong shard key operational nightmare.',
      'Caching, CQRS lite, analytics warehouses, pagination.',
      'School records saal-wise almirah — ek almirah mein sab mat.'
    )
  },
  {
    area: 'Data',
    terms: 'SQL vs NoSQL, consistency, access pattern',
    q: 'Product catalog mostly key-value reads hai, lekin orders ko strong transactions chahiye. Tum ek DB type force karoge ya mix — kaise decide?\n\nPehle words clear kar lo: SQL transactional joins constraints. NoSQL flexible scale for simple access patterns. polyglot persistence matlab alag store alag need.',
    a: scenarioAnswerBlock_(
      'Main access pattern se choose karunga — orders relational transactions; catalog cache KV OK — ek religion nahi.',
      'Orders: ACID, FKs, payments consistency then SQL. Catalog: heavy read, simple docs then cache plus SQL or NoSQL. Avoid dual-write chaos without outbox. Start simple one SQL if team small; split when pain measured.',
      'Data model follows access plus consistency needs. Do not cargo-cult NoSQL.',
      'Wrong store either weak consistency or painful scale.',
      'Caching, transactions, outbox, team skills.',
      'Diary attendance ke liye, toy box toys ke liye — ek dabba sab kaam nahi.'
    )
  },
  {
    area: 'Data',
    terms: 'transactions, isolation, multi-row consistency',
    q: 'Inventory decrement aur order create alag queries hain aur race mein oversell ho sakta hai. Tum consistency kaise design karoge?\n\nPehle words clear kar lo: race matlab concurrent updates. transactional update matlab atomic check-and-decrement. reservation pattern.',
    a: scenarioAnswerBlock_(
      'Main inventory change ko atomic conditional update ya transaction mein bandhunga — check stock then decrement same step.',
      'UPDATE inventory SET qty equals qty minus 1 WHERE id AND qty greater equal 1; check rows affected. Or transaction with row lock. Reservation with TTL for checkout. Idempotent order keys. Test concurrency. Avoid read-modify-write without lock or version.',
      'Inventory needs atomic conditional updates. Lost updates cause oversell.',
      'Oversell ops nightmare and angry users.',
      'Idempotency, queues, optimistic locking, payments.',
      'Aakhri ticket — do log ek saath; counter pe ek atomic stamp.'
    )
  }
  ];
}

function sdCache_() {
  return [
  {
    mustKnow: true,
    area: 'Cache',
    terms: 'cache-aside, TTL, invalidation, stale',
    q: 'Product catalog ka same data millions of times read ho raha hai. Tum caching kahan add karoge aur stale data ka trade-off kaise handle karoge?\n\nPehle words clear kar lo: cache-aside pehle cache phir DB. stale matlab purana. invalidation write pe delete update.',
    a: scenarioAnswerBlock_(
      'Main hot catalog pe cache-aside plus TTL rakhunga, price-critical fields pe stricter invalidation.',
      'Cache keys by product id. On read miss fill from DB. On admin update invalidate or update key. TTL as safety net. Accept brief stale for descriptions; money fields may bypass or short TTL. Stampede protection on popular keys. Monitor hit rate vs complaints.',
      'Cache needs explicit stale policy. Not all fields equal.',
      'No cache DB melt; no invalidation wrong catalog.',
      'CDN, DB replicas, write paths, observability.',
      'Canteen menu board — change pe board update, warna galat price.'
    )
  },
  {
    area: 'Cache',
    terms: 'cache failure, fallback, stampede',
    q: 'Redis cache cluster temporarily down ho gaya. Tum application ko fail-open DB pe laoge ya errors return — trade-off?\n\nPehle words clear kar lo: fail-open matlab cache miss pe DB continue. fail-closed matlab error. thundering herd DB pe spike.',
    a: scenarioAnswerBlock_(
      'Main product criticality se decide karunga — usually degrade to DB with rate limits, not total outage, lekin protect DB.',
      'Detect cache errors vs miss. Fallback DB with circuit rate limit to avoid herd. Cached empty short-circuit carefully. Alert on cache down. Prefer multi-AZ cache. Document degraded mode SLO.',
      'Cache outage plan required. Protect DB from stampede.',
      'Blind fallback can outage the database next.',
      'Reliability, rate limits, replicas, incident response.',
      'Cheat sheet kho gaya — exam slow likho, lekin poori class ek saath teacher pe mat toto.'
    )
  }
  ];
}

function sdAsync_() {
  return [
  {
        area: 'Async',
    terms: 'queue, outbox, eventual consistency, side effects',
    q: 'Order create hone ke baad invoice, email aur analytics update karna hai. Sab kuch request ke andar karoge ya asynchronous flow use karoge? Trade-off explain karo.\n\nPehle words clear kar lo: request path sync. async queue outbox. eventual consistency matlab side effects thodi der baad.',
    a: scenarioAnswerBlock_(
      'Main order commit sync rakhunga; invoice email analytics async — user latency aur dependency failures se bachne ke liye.',
      'Transaction plus outbox row, worker processes events with retries idempotency. User gets order success fast. Trade-off: eventual email delay, need monitoring DLQ. Do not async the payment confirmation itself if product requires immediate result.',
      'Non-critical side effects async. Critical money confirmation sync.',
      'Sync fan-out slow checkout and fragile deps.',
      'Idempotency, DLQ, observability, API latency SLOs.',
      'Exam result pehle declare; certificate post baad mein.'
    )
  },
  {
    area: 'Async',
    terms: 'duplicate processing, idempotent consumer, DLQ',
    q: 'Queue kabhi message dobara deliver karti hai aur consumer duplicate side effect kar sakta hai. Tum consumer ko kaise safe design karoge?\n\nPehle words clear kar lo: at-least-once delivery. idempotent consumer. dedupe store. DLQ poison messages.',
    a: scenarioAnswerBlock_(
      'Main har consumer side effect ko idempotent maanoonga — processed-message keys ya natural unique constraints.',
      'Store eventId processed. Unique business constraints. Retries with backoff. DLQ after N fails. Exactly-once illusion mat becho — design for duplicates.',
      'Assume duplicates. Make handlers idempotent.',
      'Duplicate emails charges events without dedupe.',
      'Payments, email, analytics, outbox.',
      'Same homework two times submit — teacher mark once by id.'
    )
  }
  ];
}

function sdScale_() {
  return [
  {
        area: 'Scale',
    terms: 'bottleneck, latency, horizontal scale, measure first',
    q: 'Ek API 500 requests per sec par theek chalti hai but 5000 requests per sec par latency explode ho jaati hai. Tum scaling se pehle kya measure karoge?\n\nPehle words clear kar lo: bottleneck sabse slow resource. horizontal scale aur instances. p95 latency.',
    a: scenarioAnswerBlock_(
      'Main pehle locate karunga bottleneck — CPU, DB, locks, external API, pool — blind pods add nahi.',
      'Dashboards under load test: CPU, mem, DB time, pool waits, error rates, queue lag. Profile hot endpoints. Fix query N plus 1 cache before or with scale. Stateless app behind LB. Connection pools sized. Rate limit abusive clients. Re-test.',
      'Measure, find bottleneck, fix or scale that layer.',
      'Scaling the wrong tier wastes money and keeps pain.',
      'LB, caching, DB, rate limits, load tests.',
      'Traffic jam — pehle dekho accident kahan, random lanes mat kholo.'
    )
  },
  {
    area: 'Scale',
    terms: 'load balancer, stateless, CDN',
    q: 'Tumhari API ek server par chal rahi hai aur traffic suddenly 5x ho gaya. Tum system ko scale kaise karoge aur load distribution kaise handle karoge?\n\nPehle words clear kar lo: load balancer traffic baantta hai. stateless servers shared session nahi rakhte. CDN static assets edge pe.',
    a: scenarioAnswerBlock_(
      'Main app ko stateless karke LB pe multiple instances, static pe CDN, DB cache alag sochunga.',
      'Remove local session files. Add LB plus N app instances. CDN for images JS. Autoscale policy. Protect DB with cache replicas. Health checks on instances. Watch connection limits.',
      'Horizontal scale needs stateless app plus LB. Static not app servers.',
      'Single server single point of failure and capacity ceiling.',
      'Sessions Redis, object storage, health checks, cloud LB.',
      'Ek counter ki jagah kai counters plus line manager.'
    )
  },
  {
    area: 'Scale',
    terms: 'connection pool, rate limiting, write bottleneck',
    q: 'App instances badha diye magar DB connection pool exhaust ho raha hai aur writes queue nahi. Tum kya adjust karoge?\n\nPehle words clear kar lo: pool exhaustion matlab connections khatam. each instance times pool size. write queue optional buffer.',
    a: scenarioAnswerBlock_(
      'Main pool math theek karunga — instances times pool less equal DB max — aur unnecessary connections kam.',
      'Lower per-instance pool. Fix chatty queries. Connection pooler if needed. Cache reads. Consider queue for non-critical writes. Do not horizontally scale DB connections blindly.',
      'More app pods can DOS your database via pools.',
      'Scale-out without pool math causes cascading failures.',
      'DB max connections, caching, async writes, autoscaling.',
      'Kai taps ek tank se — tank khali; flow control.'
    )
  }
  ];
}

function sdReliability_() {
  return [
  {
        area: 'Reliability',
    terms: 'graceful degradation, payment down, consistency',
    q: 'Tumhari application payment provider par dependent hai aur provider 10 minutes ke liye down ho gaya. User experience aur data consistency ko kaise handle karoge?\n\nPehle words clear kar lo: provider outage. degrade gracefully. pending payment state. reconcile later.',
    a: scenarioAnswerBlock_(
      'Main checkout ko honest pending ya fail UX dunga — fake success nahi — aur orders inconsistent state mein nahi chhodunga.',
      'Timeouts circuits on provider. Create order payment as pending payment. Show clear payment unavailable retry. Idempotent retries when up. Reconciliation job. Optional queue for capture. Support playbook. Do not mark paid without provider confirm.',
      'Never lie paid without provider ack. Pending plus retry plus reconcile.',
      'False paid states finance chaos.',
      'Idempotency, queues, incident comms, webhooks.',
      'Canteen card machine down — paid mat bolo; slip pending, baad mein.'
    )
  },
  {
    area: 'Reliability',
    terms: 'SPOF, redundancy, health checks',
    q: 'Ek critical service ka single instance hai. Tum single point of failure kaise kam karoge bina over-engineering ke?\n\nPehle words clear kar lo: SPOF single point of failure. redundancy multi-instance. health check traffic tabhi jab healthy.',
    a: scenarioAnswerBlock_(
      'Main pehle multi-instance plus LB plus health checks for that critical tier — fancy mesh baad mein.',
      'Run at least 2 instances across zones if budget. LB health. Stateless. Shared store for state. Backups for data tier. Chaos lite: kill one instance in staging. Document runbook.',
      'Redundancy plus health checks beat one big server.',
      'One box down total outage.',
      'Deployments, cloud AZs, monitoring, RTO.',
      'Ek torch trip pe — spare battery.'
    )
  }
  ];
}

function sdObservability_() {
  return [
  {
        area: 'Observability',
    terms: 'tracing, metrics, correlation id, latency',
    q: 'Request frontend se backend tak ja rahi hai but response 4 seconds le raha hai. Multiple services involved hain. Tum bottleneck kaise locate karoge?\n\nPehle words clear kar lo: distributed tracing spans. correlation request id. metrics p95 per service. logs with context.',
    a: scenarioAnswerBlock_(
      'Main pehle request id ya trace se dekhunga kaunsa span time khaa raha hai — guess nahi.',
      'Ensure correlation id FE to BE to deps. Trace waterfall. Metrics: latency, DB time, external calls. Compare deploy markers. Fix the slow span; add timeouts. If no tracing, add timed logs per hop temporarily.',
      'Multi-service slowness needs traces or ids, not vibes.',
      'Without visibility, teams optimize the wrong service.',
      'APM, SLOs, logging, FE timing, DB explain.',
      'Relay race — stopwatch har runner pe, kaun slow pata chale.'
    )
  },
  {
    area: 'Observability',
    terms: 'alerting, error rate, dashboards',
    q: 'On-call ko har chhoti warning pe page aa raha hai aur real outages miss ho rahe hain. Alerting ko kaise improve karoge?\n\nPehle words clear kar lo: alert fatigue. SLO-based alerts. severity. actionable pages.',
    a: scenarioAnswerBlock_(
      'Main noise kam karunga — page only on user-impacting symptoms with runbooks.',
      'Alert on error rate latency SLO burn, not every CPU blip. Deduplicate. Severity plus owner. Dashboards for debug. Review weekly noisy alerts. Staging synthetic checks.',
      'Alerts must be actionable. Fatigue hides real fires.',
      'Crying wolf then ignored pages during outages.',
      'Incident response, SLOs, on-call health, metrics.',
      'False fire alarms — log asli smoke pe focus.'
    )
  }
  ];
}

function dcDocker_() {
  return [
  {
    mustKnow: true,
    area: 'Docker',
    terms: 'container exit, logs, CMD, health',
    q: 'Application locally Docker mein chal rahi hai but production container immediately exit ho raha hai. Tum kaise debug karoge?\n\nPehle words clear kar lo: container exit matlab process band. image vs container. CMD ENTRYPOINT start command. logs stdout.',
    a: scenarioAnswerBlock_(
      'Main pehle exit code aur logs dekhunga — crash on boot, wrong CMD, missing env, or health kill.',
      'Check orchestrator events and container logs. Exit code meaning. Compare env vars secrets. CMD vs local. File permissions. Port bind. Dependency not ready — need retry wait. Reproduce with same image tag. Fix forward; works on my machine ignore mat.',
      'Same image tag plus logs plus env diff. Exit not mystery.',
      'Blind redeploys without logs waste time.',
      'CI image tags, env config, health probes, secrets.',
      'Toy battery nikalte hi band — pehle dekho switch battery.'
    )
  },
  {
    area: 'Docker',
    terms: 'image size, multi-stage, layers',
    q: 'Node application ka Docker image 1.5GB ho gaya hai. Tum size reduce karne ke liye kya investigate karoge?\n\nPehle words clear kar lo: multi-stage build build tools final image se alag. alpine slim base. layer cache. node_modules bloat.',
    a: scenarioAnswerBlock_(
      'Main dekhunga base image, build tools leftover, unused files — multi-stage plus slim runtime.',
      'Inspect image history. Multi-stage: build stage then copy dist only. dockerignore. production npm omit dev. Slim base. Do not copy whole repo. CI cache layers. Measure pull time impact.',
      'Smaller images faster deploys and less attack surface.',
      'Huge images slow CI CD and cold starts.',
      'CI minutes, security scanning, registry costs.',
      'Trip bag — sirf zaroori kapde, poora ghar mat.'
    )
  },
  {
    area: 'Docker',
    terms: 'env vars, ports, volumes, lifecycle',
    q: 'Container mein app galat config se start ho rahi hai — local env file expect karti thi. Tum twelve-factor style kaise fix karoge?\n\nPehle words clear kar lo: twelve-factor config env se. secrets not in image. runtime inject.',
    a: scenarioAnswerBlock_(
      'Main config image ke andar bake nahi karunga — runtime env secrets inject.',
      'Remove committed env from image. Document required env. Inject via orchestrator secret manager. Fail fast if missing critical vars. Different staging prod values. Never bake prod secrets into layers.',
      'Config secrets at runtime. Images portable.',
      'Baked secrets leak; wrong env prod incidents.',
      'CI CD secrets, cloud IAM, deploy manifests.',
      'Exam center address bag pe print mat — admit card pe likho.'
    )
  }
  ];
}

function dcCiCd_() {
  return [
  {
    mustKnow: true,
    area: 'CI/CD',
    terms: 'pipeline stages, integration tests, deploy gates',
    q: 'CI pipeline mein tests pass ho rahe hain but production deployment ke baad application crash kar rahi hai. Pipeline mein kya missing ho sakta hai?\n\nPehle words clear kar lo: unit vs integration vs smoke. environment parity. deploy gate. migration step.',
    a: scenarioAnswerBlock_(
      'Main suspect karunga missing integration smoke against real-ish env, or config migration not in pipeline.',
      'Check: only mocked unit tests. No build of production Docker image. No staging deploy. Secrets config drift. DB migrate not run. Add: build image, integration tests, staging promote, smoke health check, rollback job. Parity of Node OS versions.',
      'Green unit tests not production ready. Need build integration smoke gates.',
      'False confidence ships broken artifacts.',
      'Docker, staging, migrations, observability.',
      'Homework copy pe ticks — oral test alag hota hai.'
    )
  },
  {
    area: 'CI/CD',
    terms: 'secrets in CI, artifacts, approvals',
    q: 'Pipeline logs mein kabhi-kabhi secrets print ho jaate hain. Tum CI security hygiene kaise improve karoge?\n\nPehle words clear kar lo: secret masking. least privilege tokens. artifact not log.',
    a: scenarioAnswerBlock_(
      'Main secrets mask inject via secret store, never echo, rotate if leaked.',
      'Use platform secret variables. Mask in logs. Do not print env. Short-lived tokens. Restrict who can approve prod deploy. Scan for secret patterns. Rotate on exposure.',
      'CI logs are semi-public. Treat secrets accordingly.',
      'Leaked CI secrets infra takeover.',
      'IAM, rotation, incident response, git history.',
      'Password blackboard pe mat likho.'
    )
  },
  {
    area: 'CI/CD',
    terms: 'failed pipeline, flaky tests, blocking',
    q: 'Flaky tests ki wajah se pipeline random fail hoti hai aur team checks skip karne lagti hai. Tum kya approach doge?\n\nPehle words clear kar lo: flaky non-deterministic test. quarantine. fix ownership.',
    a: scenarioAnswerBlock_(
      'Main flakes quarantine plus own fix — disabling all checks is worse debt.',
      'Identify top flaky. Quarantine with ticket SLA. Stabilize with retries only as bridge. Keep critical path green. Do not skip entire CI. Track flake rate metric.',
      'Fix flakes; do not normalize skipping CI.',
      'Ignored CI then real bugs slip.',
      'Test quality, culture, deploy confidence.',
      'Broken school bell — fix bell, attendance mat chhodo.'
    )
  }
  ];
}

function dcDeploy_() {
  return [
  {
    mustKnow: true,
    area: 'Deploy',
    terms: 'migration, backward compatible, rolling deploy',
    q: 'New backend release mein database schema change bhi hai. Tum deployment kaise karoge so old aur new application versions dono temporarily work kar saken?\n\nPehle words clear kar lo: rolling deploy mixed versions. expand-contract migration. backward compatible schema.',
    a: scenarioAnswerBlock_(
      'Main expand-contract follow karunga — pehle additive migration, phir code, phir cleanup — taaki mixed versions safe rahein.',
      'Step one migrate add columns tables nullable. Step two deploy code reading writing both. Step three backfill. Step four remove old columns later. Avoid destructive rename in one shot with rolling. Feature flags help. Test dual-version in staging.',
      'Schema changes must be dual-version safe during rollout.',
      'Incompatible migrate plus rollout partial fleet crash.',
      'CI CD, feature flags, rollbacks, zero-downtime.',
      'Classroom desk shift — pehle extra desks, phir move, phir purane hatao.'
    )
  },
  {
    area: 'Deploy',
    terms: 'canary, blue-green, rollback',
    q: 'Risky payment change ship karna hai. Tum directly 100 percent traffic doge ya canary blue-green — kaise decide?\n\nPehle words clear kar lo: canary chhota traffic percent. blue-green two environments switch. rollback fast revert.',
    a: scenarioAnswerBlock_(
      'Main risky path pe canary ya flag prefer karunga — blast radius chhota, metrics watch, phir promote.',
      'Canary small percent with error latency SLOs. Or flag off by default. Blue-green if need instant switch and infra allows. Rollback plan ready including migrate constraints. Own on-call during bake.',
      'Risk decides rollout strategy. Payments deserve canary or flags.',
      'Big-bang bad payment deploy revenue outage.',
      'Observability, feature flags, incident, migrations.',
      'Naya bridge — pehle kuch cycles, phir sab.'
    )
  },
  {
    area: 'Deploy',
    terms: 'zero downtime, health checks, drain',
    q: 'Deploy ke dauran kuch users 502 dekh rahe hain. Tum zero-downtime ke liye kya practices adopt karoge?\n\nPehle words clear kar lo: 502 bad gateway. connection drain. readiness vs liveness. rolling update.',
    a: scenarioAnswerBlock_(
      'Main readiness gates aur graceful shutdown drain use karunga taaki LB half-dead instances ko traffic na de.',
      'Readiness fails until warm. On terminate: stop ready, finish in-flight, then exit. LB deregister wait. Enough surge capacity. Health endpoints accurate. Test rolling in staging.',
      'Graceful drain plus readiness fewer deploy 502s.',
      'Hard-kill instances mid-request user errors every release.',
      'K8s probes, LB, Docker, SLOs.',
      'Shop band karte waqt pehle line rokho, andar customers finish.'
    )
  }
  ];
}

function dcCloud_() {
  return [
  {
    mustKnow: true,
    area: 'Cloud',
    terms: 'object storage, local disk, multi-instance',
    q: 'User-uploaded images ko application server ke local disk par store kiya ja raha hai. Multiple servers add karne ke baad problem aa rahi hai. Tum storage architecture kaise change karoge?\n\nPehle words clear kar lo: local disk instance-bound. object storage S3-like shared. CDN for read.',
    a: scenarioAnswerBlock_(
      'Main uploads ko shared object storage pe move karunga — local disk multi-instance pe toot’ta hai.',
      'App uploads to object store; DB saves URL. CDN in front for reads. Permissions least privilege. Migration of old files. Do not rely on sticky sessions for files. Backup lifecycle policies.',
      'Ephemeral app disks are not shared storage. Use object store.',
      'Scale-out loses files or needs sticky hacks.',
      'Stateless apps, CDN, IAM, cost.',
      'Photos sirf ek bag mein — locker shared use karo.'
    )
  },
  {
    area: 'Cloud',
    terms: 'managed DB, regions, AZ, cost',
    q: 'Team self-managed DB patching se pareshaan hai. Managed database consider karna hai — tum trade-offs kaise weigh karoge?\n\nPehle words clear kar lo: managed service vendor operates backups patching. cost vs ops time. lock-in lite.',
    a: scenarioAnswerBlock_(
      'Main ops burden vs cost control compare karunga — chhoti team pe managed aksar jeet’ta hai.',
      'Compare: backups, Multi-AZ, patching, support, price, extension limits, egress. Security IAM. Exit plan dumps. Not everything needs managed — start where toil highest.',
      'Buy undifferentiated heavy lifting when toil greater than cost.',
      'DIY DB without skills silent backup failures.',
      'Reliability, compliance, budgeting, on-call.',
      'School bus contract vs khud bus chalana — time money.'
    )
  },
  {
    area: 'Cloud',
    terms: 'CDN, origin, cache headers',
    q: 'Global users ko static assets slow mil rahe hain. Tum CDN kab introduce karoge aur kaunsi pitfalls avoid karoge?\n\nPehle words clear kar lo: CDN edge cache. origin app storage. cache-control headers. purge.',
    a: scenarioAnswerBlock_(
      'Main static media pe CDN rakhunga with correct cache headers aur purge on release.',
      'Put assets on object storage plus CDN. Version hashed filenames. Avoid caching HTML forever if it points old bundles. Purge strategy. HTTPS. Measure TTFB by region.',
      'CDN plus cache headers plus hashed assets. Do not accidentally cache private APIs.',
      'Wrong CDN caching serves stale or private data.',
      'Frontend perf, deploy, security, cost.',
      'Neighborhood photocopy of worksheet — closer, faster.'
    )
  }
  ];
}

function dcNetwork_() {
  return [
  {
        area: 'Network',
    terms: 'DNS, TLS, security group, reverse proxy',
    q: 'Frontend accessible hai but backend API suddenly unreachable hai after deployment. Tum application code se pehle infrastructure network mein kya check karoge?\n\nPehle words clear kar lo: DNS name to IP. TLS cert. security group firewall ports. reverse proxy LB routing.',
    a: scenarioAnswerBlock_(
      'Main pehle path check karunga — DNS, TLS, LB target health, SG ports, env base URL — code baad mein.',
      'From browser: DNS resolve, cert validity, CORS vs network fail. LB healthy targets. SG allow 443. Wrong path rewrite. Wrong API URL in FE build. Recent firewall change. Compare staging. Then app logs if network OK.',
      'Check DNS TLS LB SG before assuming app bug.',
      'Hours wasted debugging code when route blocked.',
      'Deploy, CI env, Docker ports, cloud networking.',
      'Friend ke ghar — pehle address gate, andar baat baad.'
    )
  },
  {
    area: 'Network',
    terms: 'private subnet, public access, service-to-service',
    q: 'Database accidentally public internet pe expose ho gayi configuration mein. Tum immediate response kya doge?\n\nPehle words clear kar lo: public bind risk. private network. rotate credentials.',
    a: scenarioAnswerBlock_(
      'Main turant public access band, credentials rotate, logs audit — pehle containment.',
      'Lock SG firewall to private. Rotate DB passwords keys. Check access logs for intrusion. Patch. Postmortem. Infra as code prevent drift. Prefer private subnets always.',
      'DB never public. Contain, rotate, audit.',
      'Exposed DB data breach class incident.',
      'IAM, secrets, compliance, incident.',
      'Ghar ka tijori sadak pe — turant andar lao, taala badlo.'
    )
  }
  ];
}

function dcObservability_() {
  return [
  {
        area: 'Observability',
    terms: 'latency, error rate, dependency, RUM',
    q: 'Production mein users bol rahe hain app slow hai but server CPU normal hai. Tum kaunse signals check karoge?\n\nPehle words clear kar lo: CPU normal healthy UX nahi. check DB wait, network, FE LCP, dependency latency, error retries.',
    a: scenarioAnswerBlock_(
      'Main CPU ke bahar dekhunga — DB, external APIs, FE metrics, error-driven retries.',
      'p95 latency by endpoint. DB time vs app time. Queue lag. Client RUM LCP. Error spikes causing retries. Region issues. Recent deploys. Traces for slow spans.',
      'User slow needs multi-signal view. CPU is one gauge.',
      'Fixing CPU when waiting on DB wastes sprints.',
      'APM, FE perf, DB, CDN, incidents.',
      'Race slow but breathing fine — maybe shoes untied dependency.'
    )
  },
  {
    area: 'Observability',
    terms: 'structured logs, correlation id, dashboards',
    q: 'Har service alag format mein log print karti hai aur ek request trace karna mushkil hai. Tum logging standard kaise set karoge?\n\nPehle words clear kar lo: structured JSON logs. correlation request id. consistent fields.',
    a: scenarioAnswerBlock_(
      'Main org-wide structured logs plus request id propagation enforce karunga.',
      'JSON fields: ts, level, service, requestId, user tenant safe. Middleware inject id. Central log store. Dashboards. PII redaction. Sampling noisy debug.',
      'Without shared ids, distributed debug is archaeology.',
      'Inconsistent logs long MTTR.',
      'Tracing, privacy, on-call, FE headers.',
      'Parcel tracking number — har hub pe same id.'
    )
  }
  ];
}

function dcSecurity_() {
  return [
  {
    mustKnow: true,
    area: 'Security',
    terms: 'secret leak, rotate, git history',
    q: 'Accidentally production API key Git repository mein commit ho gayi. Tum immediate aur follow-up actions kya loge?\n\nPehle words clear kar lo: assume compromised. rotate revoke. purge history carefully. secret scanning.',
    a: scenarioAnswerBlock_(
      'Main key ko compromised maanoonga — turant revoke rotate, phir git cleanup aur process fix.',
      'Revoke rotate in provider immediately. Redeploy with new secret. Audit usage logs. Remove from repo; history rewrite only with team coordination or accept rotate-as-enough. Pre-commit secret scan. Vault CI secrets. Educate. Incident note.',
      'Leak then rotate first. Deleting commit alone is not enough.',
      'Attackers clone fast; old key stays valid until revoked.',
      'CI secrets, IAM, postmortem, access logs.',
      'Ghar ki chaabi photo share — pehle lock change.'
    )
  },
  {
    area: 'Security',
    terms: 'least privilege, IAM, dependency CVE',
    q: 'Prod deploy role ke paas unnecessarily broad cloud permissions hain. Tum least privilege kaise approach karoge bina release tode?\n\nPehle words clear kar lo: least privilege minimum rights. IAM roles. break-glass. dependency vulnerabilities separate track.',
    a: scenarioAnswerBlock_(
      'Main permissions inventory karke gradually tighten with staging proof — big-bang strip avoid.',
      'List what deploy actually needs. New restricted role in staging. Canary prod. Break-glass admin separate. Review quarterly. Also scan deps CVEs in CI as related hygiene.',
      'Shrink blast radius gradually with testing. Separate break-glass.',
      'Over-permissioned CI one leak owns cloud.',
      'CI CD, secrets, compliance, incident.',
      'Guest keys — sirf guest room, poora ghar nahi.'
    )
  }
  ];
}

function dcIncident_() {
  return [
  {
        area: 'Incident',
    terms: 'rollback, communication, error rate',
    q: 'Deployment ke 5 minutes baad 30 percent requests fail hone lagti hain. Tum rollback, debugging aur communication ko kaise handle karoge?\n\nPehle words clear kar lo: mitigate first. rollback flag. stakeholder updates. then root cause.',
    a: scenarioAnswerBlock_(
      'Main pehle bleeding rokunga — rollback ya flag — saath short status updates, deep debug baad mein.',
      'Confirm deploy correlation. Impact severity. Rollback disable if safe with migrations. Announce: what, impact, action, next update time. Preserve logs traces. After stable: RCA plus tests plus canary next. Do not disappear into rabbit hole silently.',
      'Mitigate, communicate, root cause, prevent. Pride debugging last.',
      'Delayed mitigate plus silence destroys trust.',
      'CI CD, feature flags, postmortem, on-call.',
      'Fire drill — pehle bahar nikaalo, photo baad.'
    )
  },
  {
    area: 'Incident',
    terms: 'postmortem, action items, monitoring gap',
    q: 'Outage khatam. Same class ka issue doosri baar aa sakta hai kyunki alert nahi tha. Tum postmortem mein kya concrete changes doge?\n\nPehle words clear kar lo: blameless postmortem. action items with owners. monitoring gap.',
    a: scenarioAnswerBlock_(
      'Main alert SLO plus test plus runbook action items likhunga — be careful nahi.',
      'Timeline, detection gap, user impact. Add metric alert that would have caught it. Regression test if applicable. Owner plus date. Review in week. Share learnings.',
      'No alert test runbook action equals theater postmortem.',
      'Repeat outages without learning.',
      'Observability, CI, culture, reliability.',
      'Trip ke baad checklist — same galti dubara na.'
    )
  }
  ];
}



// ================================================================
// PHASE 1 DATA — DSA & SQL (Scenario-style paragraphs)
// ================================================================
function getCodingDsa_() {
  return [{
    topicId: 'C1',
    title: 'TOPIC C1 — DSA / Coding round (~25 patterns)',
    subtitle: 'Har answer paragraph Hinglish mein (Scenario-style) — hard words question ke niche explain. Sketch Engineering ke andar.',
    area: 'DSA',
    qa: [].concat(
      dsaHash_(), dsaWindow_(), dsaBinary_(), dsaRecursion_(),
      dsaTrees_(), dsaGraphs_(), dsaHeapDp_()
    )
  }];
}

function getCodingSql_() {
  return [{
    topicId: 'C2',
    title: 'TOPIC C2 — SQL hands-on (~12)',
    subtitle: 'Query likhna + EXPLAIN sochna. Har answer paragraph Hinglish — hard words question ke niche. SQL sketch Engineering mein.',
    area: 'SQL',
    qa: sqlHandsOn_()
  }];
}

function dsaHash_() {
  return [
    {
      mustKnow: true, area: 'Hash', terms: 'hash map, complement, O(1) average',
      q: 'Two Sum: nums array + target. Return indices of two numbers jo sum = target. Assume exactly one answer.\n\nPehle words clear kar lo: hash map = key→value fast lookup. complement = target - nums[i].',
      a: scenarioAnswerBlock_(
        'Main ensure karunga ki main har number pe sirf ek baar dekhu aur “jo abhi chahiye” woh pehle se yaad rakhun — dobara poori list scan karke time waste nahi. Jaise shopping list pe pehle se note: “agar yeh item mil jaye to pehle wala index yahan hai.”',
        'Sabse pehle ek empty Map banaunga value → index. Har index i pe need = target - nums[i] nikalunga. Agar Map mein need pehle se hai, to turant [map.get(need), i] return — yeh dono milake target banate hain. Warna nums[i] ko Map mein store karunga taaki aage koi iska complement dhoondhe. Map pehle check, phir store — warna same element do baar use ho sakta hai. Time O(n), space O(n). Sorting + two pointers bhi possible lekin indices track mushkil. Edges: negatives OK, duplicates OK jab tak indices alag, constraints usually ek hi answer.\n\nfunction twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const need = target - nums[i];\n    if (map.has(need)) return [map.get(need), i];\n    map.set(nums[i], i);\n  }\n}',
        'One-pass hash: pehle complement dhoondo, phir current store. O(n) time, O(n) space. Same index do baar mat use.',
        'Bina map ke nested loop O(n²) interview mein slow lagta hai aur large n pe timeout. Galat order (pehle store) se self-pair bug aata hai.',
        'Hash map lookups, two pointers on sorted arrays, “complement” thinking — yeh pattern Group Anagrams / Subarray sum pe bhi judta hai.',
        'Tumhe do gift card chahiye jinka sum exact 100. Har card pehte hi notebook mein likho “agar 100-minus-yeh pehle mil chuka to mil gaya.” Poori dukaan do baar mat ghumo.'
      )
    },
    {
      area: 'Hash', terms: 'Set, duplicate, early exit',
      q: 'Contains Duplicate: array mein koi value ≥2 baar aayi to true, warna false.\n\nPehle words clear kar lo: Set = unique values collection. early exit = pehle milte hi return.',
      a: scenarioAnswerBlock_(
        'Main ensure karunga ki pehli duplicate milte hi ruk jaun — poori list end tak ghumana zaroori nahi. Jaise guest list pe naam do baar dikhe to turant “duplicate” bol do.',
        'Ek empty Set rakhunga. Har number pe: agar Set mein pehle se hai to true return. Warna add. End tak koi duplicate nahi to false. Time O(n), space O(n). Sort karke adjacent compare bhi O(n log n) space O(1) ho sakta hai — interview mein Set usually clear. Empty / single element → false.\n\nfunction containsDuplicate(nums) {\n  const seen = new Set();\n  for (const x of nums) {\n    if (seen.has(x)) return true;\n    seen.add(x);\n  }\n  return false;\n}',
        'Seen Set + early exit. Pehli collision pe true. Empty = false.',
        'Bina early exit ke extra kaam. Sirf sort bhool ke O(n²) compare bhi galat signal.',
        'Set vs Map, interview “unique elements”, anagram frequency maps — related family.',
        'Classroom mein attendance sheet — naam do baar tick ho to teacher turant pakad le, last bench tak wait nahi.'
      )
    },
    {
      area: 'Hash', terms: 'anagram, frequency map, sorted key',
      q: 'Group Anagrams: strings array do. Anagrams ko groups mein return karo.\n\nPehle words clear kar lo: anagram = same letters alag order. frequency map = char counts.',
      a: scenarioAnswerBlock_(
        'Main ensure karunga ki same letters wale words ek “family key” share karein — order alag ho to bhi same bucket. Jaise letters rearrange karke ek hi naamplate.',
        'Har string ka canonical key banaunga — aksar characters sort karke join, ya 26-count signature. Map key → list of strings. Har string us key ke group mein push. End pe saari lists return. Sort-key O(n * k log k); count-key O(n*k). Empty strings, lowercase assume common. Unicode pe clarify.\n\nfunction groupAnagrams(strs) {\n  const map = new Map();\n  for (const s of strs) {\n    const key = [...s].sort().join(\"\");\n    if (!map.has(key)) map.set(key, []);\n    map.get(key).push(s);\n  }\n  return [...map.values()];\n}',
        'Canonical key (sorted / count) → group. Same key = anagram family.',
        'Bina key ke nested compare slow. Key mein original string rakhoge to groups toot jayenge.',
        'Hash grouping, Top K frequent, string puzzles — sab “signature banao” pe judte hain.',
        'Fridge magnets se “listen” aur “silent” same letters — ek dabbe mein rakh do.'
      )
    },
    {
      mustKnow: true, area: 'Hash', terms: 'Top K, frequency, heap vs bucket',
      q: 'Top K Frequent Elements: nums mein top k most frequent values return karo.\n\nPehle words clear kar lo: frequency map = value→count. bucket sort by count. heap = priority queue.',
      a: scenarioAnswerBlock_(
        'Main pehle count karunga kaun kitni baar aaya, phir “sabse zyada count” wale k nikaalunga — random guess nahi. Jaise class topper list: pehle marks, phir top k.',
        'Pehle Map se frequency. Phir do raste: min-heap size k, ya buckets[freq] = values (n+1 buckets) — high freq se neeche collect until k. Bucket O(n); heap O(n log k). Ties pe order usually free. k=n → saare unique.\n\nfunction topKFrequent(nums, k) {\n  const freq = new Map();\n  for (const x of nums) freq.set(x, (freq.get(x)||0)+1);\n  const buckets = Array.from({length: nums.length+1}, () => []);\n  for (const [val, c] of freq) buckets[c].push(val);\n  const out = [];\n  for (let i = buckets.length-1; i >= 0 && out.length < k; i--) {\n    for (const v of buckets[i]) { out.push(v); if (out.length === k) return out; }\n  }\n  return out;\n}',
        'Count pehle. Phir bucket ya heap se top k. Blind full sort often overkill but OK if clarify.',
        'Bina frequency ke “unique pehle k” galat. Heap size bhoolna = wrong k.',
        'Heap, bucket sort idea, streaming top-k, cache eviction popularity — connected.',
        'Kitne log ice-cream flavour mangte hain count karo, phir top 3 flavour board pe likho.'
      )
    },
    {
      area: 'Array', terms: 'prefix product, suffix, no division',
      q: 'Product of Array Except Self: output[i] = product of all except nums[i]. Division allowed nahi. O(n) time.\n\nPehle words clear kar lo: prefix product = left of i. suffix = right of i.',
      a: scenarioAnswerBlock_(
        'Main ensure karunga ki har position pe left ka product × right ka product aaye — division cheat nahi, kyunki zero pe toot jaata. Jaise sandwich: left bread aur right bread alag se, beech wala hata ke.',
        'Pehle left-to-right pass: out[i] = nums[0]…nums[i-1] ka product (out[0]=1). Phir right variable se right-to-left multiply. Extra array optional — O(1) extra space (output count nahi). Zeros: ek zero → ek slot non-zero product; do zeros → almost sab zero. Time O(n).\n\nfunction productExceptSelf(nums) {\n  const n = nums.length, out = Array(n).fill(1);\n  for (let i = 1; i < n; i++) out[i] = out[i-1] * nums[i-1];\n  let right = 1;\n  for (let i = n-1; i >= 0; i--) { out[i] *= right; right *= nums[i]; }\n  return out;\n}',
        'Left prefix × right suffix. No division. Careful with zeros.',
        'Division approach zero pe crash. Two full arrays bhool ke O(n²) multiply.',
        'Prefix sums/products, range queries, interview “no division” constraints.',
        'Har bacche ko bolo: tumhare ilawa sabke chocolate count ka product — pehle left side count, phir right side.'
      )
    }
  ];
}

function dsaWindow_() {
  return [
    {
      area: 'Two pointers', terms: 'sorted array, left right, shrink',
      q: 'Sorted array pe Two Sum (pair indices/values jo target banaye). Extra O(n) map avoid kar sakte ho?\n\nPehle words clear kar lo: two pointers = left start, right end. sorted pe sum se move.',
      a: scenarioAnswerBlock_(
        'Main ensure karunga ki sorted hone ka fayda loon — map ki zarurat nahi. Sum chhota ho to left aage, bada ho to right peeche. Jaise do ends se ruler milana.',
        'l=0, r=n-1. Jab tak l<r: s=a[l]+a[r]. Equal → found. s<target → l++. s>target → r--. Sorted pe O(n) after sort. Unsorted pe pehle sort O(n log n) lekin indices chahiye to original index preserve karna. Duplicates / no pair handle.\n\nfunction twoSumSorted(a, target) {\n  let l = 0, r = a.length - 1;\n  while (l < r) {\n    const s = a[l] + a[r];\n    if (s === target) return [l, r];\n    if (s < target) l++; else r--;\n  }\n  return null;\n}',
        'Sorted → two pointers. Sum se decide kaunsa pointer move. Map optional.',
        'Unsorted pe blindly two pointers galat. Pointers cross hone pe rukna bhoolna.',
        '3Sum, container water, many “sorted + ends” problems — same muscle.',
        'Do dost line ke do ends pe khade — milke height target; chhote ko andar lao ya bade ko.'
      )
    },
    {
      area: 'Two pointers', terms: '3Sum, sort, skip duplicates',
      q: '3Sum: unique triplets jo sum 0. Approach outline karo (full code optional).\n\nPehle words clear kar lo: fix one index, remaining two-sum on sorted. skip duplicates.',
      a: scenarioAnswerBlock_(
        'Main ensure karunga ki pehle sort karun, ek number fix karun, baaki two-sum se 0 complete karun — aur duplicate triplets skip. Jaise team of three jahan same team dobara na aaye.',
        'Sort. Har i pe (skip if same as i-1): l=i+1, r=n-1, target=-nums[i]. Sum 0 pe triplet collect, dono sides se dups skip. Sum <0 l++, else r--. Time O(n²). n<3 → empty. Saare zeros carefully skip dups warna TLE/dup answers.\n\n// sort; for i { skip dup; l=i+1,r=n-1;\n// while l<r { s=nums[i]+nums[l]+nums[r];\n//   if s===0 collect + skip dups; else s<0?l++:r--; } }',
        'Sort + fix i + two pointers. Skip duplicates. O(n²).',
        'Dup skip bhoolna = wrong output ya TLE. Nested three loops O(n³) reject.',
        'Two Sum family, k-sum generalizations, sorting as preprocess.',
        'Teen numbers milake zero — pehle cards sort, ek pakdo, doosre do ends se match.'
      )
    },
    {
      mustKnow: true, area: 'Sliding window', terms: 'window, Set/Map, longest substring',
      q: 'Longest Substring Without Repeating Characters: string s, longest window length jisme koi char repeat na ho.\n\nPehle words clear kar lo: sliding window = left..right range. lastSeen map = char → last index.',
      a: scenarioAnswerBlock_(
        'Main ensure karunga ki window hamesha unique chars rakhe — repeat aate hi left aage jump. Jaise conveyor pe unique toys; duplicate aaye to pehle wale tak clear.',
        'lastSeen Map. Right expand. Agar char pehle se window mein (last index ≥ left) to left = last+1. Update lastSeen, best = max length. Time O(n), space alphabet. Empty → 0; all same → 1.\n\nfunction lengthOfLongestSubstring(s) {\n  const last = new Map();\n  let left = 0, best = 0;\n  for (let r = 0; r < s.length; r++) {\n    if (last.has(s[r]) && last.get(s[r]) >= left) left = last.get(s[r]) + 1;\n    last.set(s[r], r);\n    best = Math.max(best, r - left + 1);\n  }\n  return best;\n}',
        'Expand right, shrink/jump left on repeat. Track best length. O(n).',
        'Left sirf +1 karte rehna kabhi slow; wrong lastSeen window bahar ka index treat karna.',
        'Sliding window templates, at-most-K distinct, max ones with flips — same family.',
        'Necklace pe beads — same colour dubara aaye to pehle wale colour ke peeche se naya start.'
      )
    },
    {
      area: 'Sliding window', terms: 'at most K flips, ones, window validity',
      q: 'Max Consecutive Ones III: binary array, at most K zeros flip karke longest 1s window.\n\nPehle words clear kar lo: window valid = zerosCount ≤ K. shrink left jab invalid.',
      a: scenarioAnswerBlock_(
        'Main ensure karunga ki window mein zeros kabhi K se zyada na hon — extra zero aaye to left se kaato. Jaise K free “eraser” zeros ke liye.',
        'zeros counter. Right pe 0 aaye to zeros++. Jab zeros > K, left aage jab tak valid. Har step best length update. Time O(n). K=0 → longest pure ones. K ≥ total zeros → whole array.\n\nfunction longestOnes(nums, k) {\n  let left = 0, zeros = 0, best = 0;\n  for (let r = 0; r < nums.length; r++) {\n    if (nums[r] === 0) zeros++;\n    while (zeros > k) { if (nums[left] === 0) zeros--; left++; }\n    best = Math.max(best, r - left + 1);\n  }\n  return best;\n}',
        'Window valid jab zeros ≤ K. Invalid → shrink left. O(n).',
        'Zeros count update bhoolna. K ko “exact K” samajhna (usually at most).',
        'Other “at most K replacements” windows, two pointers validity.',
        'Blackboard pe K mistakes maaf — zyada mistake ho to peeche se window chhoti karo.'
      )
    },
    {
      area: 'Two pointers', terms: 'container with most water, area, greedy pointers',
      q: 'Container With Most Water: height[i] bars. Do lines choose karke max water (area = width * min height).\n\nPehle words clear kar lo: width = j-i. area = min(h[i],h[j]) * width. move shorter pointer.',
      a: scenarioAnswerBlock_(
        'Main ensure karunga ki ends se start karun aur hamesha chhoti wall andar move karun — width kam hogi to height badhani padegi. Jaise do walls se paani; chhoti wall hi limit.',
        'l=0,r=n-1. Area = min(h[l],h[r])*(r-l), best update. Agar h[l]<h[r] to l++ else r--. Brute O(n²) avoid. O(n) time. n=2 min case; flat heights.\n\nfunction maxArea(h) {\n  let l = 0, r = h.length - 1, best = 0;\n  while (l < r) {\n    best = Math.max(best, Math.min(h[l], h[r]) * (r - l));\n    if (h[l] < h[r]) l++; else r--;\n  }\n  return best;\n}',
        'Two ends. Area. Move shorter pointer. O(n).',
        'Taller move karna usually suboptimal. Width formula galat (off-by-one).',
        'Trapping rain water alag problem — confuse mat karo; yahan two lines choose.',
        'Do kitaabi stands ke beech paani — chhoti kitaab ki height limit; us stand ko shift karke try.'
      )
    }
  ];
}

function dsaBinary_() {
  return [
    {
      mustKnow: true, area: 'Binary search', terms: 'first last position, lower bound',
      q: 'Sorted array (duplicates allowed): target ka first aur last index. Nahi mila to [-1,-1].\n\nPehle words clear kar lo: lower bound = pehli position ≥ target. upper bound = pehli > target.',
      a: scenarioAnswerBlock_(
        'Main ensure karunga ki do alag binary searches chalaun — pehli occurrence aur last — ek mid pe ruk ke guess nahi. Jaise dictionary mein word ki pehli aur aakhri entry.',
        'Leftmost: classic BS; jab equal mile ans=m aur hi=m-1 (aur left). Rightmost: ans=m, lo=m+1. Nahi mila → [-1,-1]. O(log n). Empty / not found / all equal target.\n\nfunction searchRange(nums, target) {\n  const left = bound(nums, target, true);\n  if (left === -1) return [-1, -1];\n  return [left, bound(nums, target, false)];\n}\nfunction bound(a, t, findLeft) {\n  let lo=0, hi=a.length-1, ans=-1;\n  while (lo<=hi) {\n    const m=(lo+hi)>>1;\n    if (a[m]===t) { ans=m; if (findLeft) hi=m-1; else lo=m+1; }\n    else if (a[m]<t) lo=m+1; else hi=m-1;\n  }\n  return ans;\n}',
        'Do binary searches: leftmost + rightmost. O(log n). Missing → [-1,-1].',
        'Ek hi search se range galat. Infinite loop mid update galat.',
        'Lower/upper bound, insert position, count of target = last-first+1.',
        'Library shelf sorted — pehli “Harry” book aur last “Harry” book alag dhoondo.'
      )
    },
    {
      area: 'Binary search', terms: 'insert position, lower bound',
      q: 'Search Insert Position: sorted distinct nums. Target index ya insert index return (lower bound).\n\nPehle words clear kar lo: insert position = pehli index jahan nums[i] ≥ target.',
      a: scenarioAnswerBlock_(
        'Main ensure karunga ki “pehli jagah jahan value ≥ target” dhoondhun — mile to wahi index, nahi to insert slot. Jaise queue mein sahi seat.',
        'lo=0, hi=n. jab lo<hi: mid; agar nums[m]<target lo=m+1 else hi=m. return lo. O(log n). Target sabse chhota → 0; sabse bada → n.\n\nfunction searchInsert(nums, target) {\n  let lo = 0, hi = nums.length;\n  while (lo < hi) {\n    const m = (lo + hi) >> 1;\n    if (nums[m] < target) lo = m + 1; else hi = m;\n  }\n  return lo;\n}',
        'Lower bound binary search. Return lo. O(log n).',
        'hi=n-1 rakh ke n miss. Equality pe galat side move.',
        'Same template first occurrence / insertion in sorted structures.',
        'Roll number list mein naya student — pehli seat jahan number usse chhota na ho.'
      )
    },
    {
      area: 'Binary search', terms: 'rotated sorted, pivot, mid compare',
      q: 'Search in Rotated Sorted Array (distinct): O(log n) mein target index.\n\nPehle words clear kar lo: rotated = [4,5,6,7,0,1,2]. ek half still sorted.',
      a: scenarioAnswerBlock_(
        'Main ensure karunga ki har step pe dekhu kaunsa half sorted hai, aur target us sorted half mein hai ya nahi — warna dusri taraf. Jaise todhi hui sorted line, ek tukda ab bhi seedha.',
        'lo,hi,mid. Equal → return. Agar left half sorted: target us range mein to hi=m-1 else lo=m+1. Else right half sorted — similar. O(log n). No rotation / missing / n=1 handle.\n\nfunction search(a, t) {\n  let lo=0, hi=a.length-1;\n  while (lo<=hi) {\n    const m=(lo+hi)>>1;\n    if (a[m]===t) return m;\n    if (a[lo]<=a[m]) {\n      if (a[lo]<=t && t<a[m]) hi=m-1; else lo=m+1;\n    } else {\n      if (a[m]<t && t<=a[hi]) lo=m+1; else hi=m-1;\n    }\n  }\n  return -1;\n}',
        'Identify sorted half. Target inside? Shrink that side. O(log n).',
        'Duplicates wala variant alag (harder). Blind mid compare without half check.',
        'Find pivot / min in rotated, then BS — alternative story.',
        'Circular train seats thodi shift — pehle dekho kaunsa half ab bhi order mein.'
      )
    }
  ];
}

function dsaRecursion_() {
  return [
    {
      area: 'Recursion', terms: 'backtracking, subsets, include exclude',
      q: 'Subsets: nums (unique) ke saare subsets return karo (power set).\n\nPehle words clear kar lo: backtracking = choose → explore → unchoose. include/exclude har element.',
      a: scenarioAnswerBlock_(
        'Main ensure karunga ki har element pe do raaste try karun — lo ya mat lo — aur leaf pe path copy. Jaise bag mein item daalo ya chhodo, saari combinations.',
        'dfs(i, path): i==n pe out.push(copy). Else include nums[i] + dfs, pop, phir exclude dfs. Time O(n*2^n) copies. Empty → [[]].\n\nfunction subsets(nums) {\n  const out = [];\n  function dfs(i, path) {\n    if (i === nums.length) { out.push([...path]); return; }\n    path.push(nums[i]); dfs(i+1, path); path.pop();\n    dfs(i+1, path);\n  }\n  dfs(0, []);\n  return out;\n}',
        'Include/exclude backtracking. Copy at leaf. 2^n subsets.',
        'Reference push bina copy → saari lists mutate. Index bounds galat.',
        'Permutations, combination sum — same choose/unchoose muscle.',
        'Lunchbox mein sandwich/fruit yes-no — har combo alag photo.'
      )
    },
    {
      area: 'Recursion', terms: 'permutations, swap backtrack',
      q: 'Permutations: distinct nums ki saari permutations.\n\nPehle words clear kar lo: permutation = sab orderings. used[] ya swap-in-place backtrack.',
      a: scenarioAnswerBlock_(
        'Main ensure karunga ki har position pe unused number try karun, mark/unmark se explore. Jaise line mein bacchon ko rearrange — har order ek baar.',
        'dfs(path): length==n pe push copy. Loop i unused: mark, push, dfs, pop, unmark. Time O(n*n!). Duplicates nums pe alag skip logic. n=0/1 base.\n\nfunction permute(nums) {\n  const out = [], used = Array(nums.length).fill(false);\n  function dfs(path) {\n    if (path.length === nums.length) { out.push([...path]); return; }\n    for (let i = 0; i < nums.length; i++) {\n      if (used[i]) continue;\n      used[i] = true; path.push(nums[i]);\n      dfs(path);\n      path.pop(); used[i] = false;\n    }\n  }\n  dfs([]);\n  return out;\n}',
        'Backtrack with used[]. All orderings. O(n*n!).',
        'used reset bhoolna. Swap method mein index confuse.',
        'Subsets vs permutations — combination vs arrangement.',
        'Teen alag colour crayons se saari drawing orders try.'
      )
    }
  ];
}

function dsaTrees_() {
  return [
    {
      mustKnow: true, area: 'Trees', terms: 'binary tree, invert, recursion',
      q: 'Invert Binary Tree: left/right recursively swap.\n\nPehle words clear kar lo: invert = mirror. recursion = subtree pe same kaam.',
      a: scenarioAnswerBlock_(
        'Main ensure karunga ki har node pe left-right swap ho aur dono subtrees pe same kaam — mirror poora tree. Jaise photo flip.',
        'Null → null. Temp se swap children, phir invert dono sides. Time O(n), space O(h). Single node / skewed OK.\n\nfunction invertTree(root) {\n  if (!root) return null;\n  const tmp = root.left; root.left = root.right; root.right = tmp;\n  invertTree(root.left); invertTree(root.right);\n  return root;\n}',
        'Swap children + recurse. Null base. O(n).',
        'Sirf root swap, children recurse nahi. Stack overflow skewed pe (iterative option).',
        'Tree DFS, mirror checks, serialization — related.',
        'Family tree drawing ulta — bhai-behen sides badlo har generation pe.'
      )
    },
    {
      area: 'Trees', terms: 'max depth, DFS height',
      q: 'Maximum Depth of Binary Tree: root se leaf tak longest path nodes count.\n\nPehle words clear kar lo: depth/height. DFS = 1 + max(left,right).',
      a: scenarioAnswerBlock_(
        'Main ensure karunga ki deepest leaf tak nodes ginun — left aur right ka max + 1. Jaise imaarati floors deepest shaft.',
        'Null → 0. Else 1+max(left,right). BFS levels bhi. O(n)/O(h). Empty 0, root only 1.\n\nfunction maxDepth(root) {\n  if (!root) return 0;\n  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));\n}',
        'DFS height. Null=0. 1+max(sides).',
        'Edges count vs nodes count confuse. Null child pe 1 galat.',
        'Balanced check, diameter — depth ideas reuse.',
        'Ped ki sabse lambi jadh-se-patti chain gin lo.'
      )
    },
    {
      area: 'Trees', terms: 'BFS, level order, queue',
      q: 'Binary Tree Level Order Traversal: har level ki values arrays of arrays.\n\nPehle words clear kar lo: BFS = queue se level-by-level. level size = queue.length snapshot.',
      a: scenarioAnswerBlock_(
        'Main ensure karunga ki queue se level-by-level chalun — har level pe pehle size freeze. Jaise school floor by floor visit.',
        'Queue root. While: size=q.length, us size ke nodes process, children enqueue, level array push. Null root → []. O(n).\n\nfunction levelOrder(root) {\n  if (!root) return [];\n  const out = [], q = [root];\n  while (q.length) {\n    const level = [], size = q.length;\n    for (let i = 0; i < size; i++) {\n      const n = q.shift();\n      level.push(n.val);\n      if (n.left) q.push(n.left);\n      if (n.right) q.push(n.right);\n    }\n    out.push(level);\n  }\n  return out;\n}',
        'BFS + size snapshot per level. O(n).',
        'Size freeze bhoolna = levels mil jayein. shift O(n) JS pe — interview OK, real mein index queue.',
        'Zigzag, right side view — BFS variants.',
        'Building ke har floor pe saare rooms list — pehle floor 1, phir 2.'
      )
    },
    {
      area: 'Trees', terms: 'LCA, BST vs binary tree, recurse',
      q: 'Lowest Common Ancestor of Binary Tree (NOT BST): p aur q nodes diye, LCA return.\n\nPehle words clear kar lo: LCA = deepest node jo dono ka ancestor. subtree mein dono milna.',
      a: scenarioAnswerBlock_(
        'Main ensure karunga ki recurse se left/right mein p/q dhoondhun — dono sides mile to yeh node LCA. Jaise family mein sabse neeche shared dadaji.',
        'Null/p/q pe return node. L=LCA(left), R=LCA(right). L&&R → root. Else L||R. Assume p,q exist. BST variant value compare se alag. O(n).\n\nfunction lowestCommonAncestor(root, p, q) {\n  if (!root || root === p || root === q) return root;\n  const L = lowestCommonAncestor(root.left, p, q);\n  const R = lowestCommonAncestor(root.right, p, q);\n  if (L && R) return root;\n  return L || R;\n}',
        'Recurse both sides. Both non-null → root is LCA. Not BST tricks.',
        'BST logic yahan apply karna. Parent pointers assume bina bataye.',
        'BST LCA, path-to-root intersect — alternative approaches.',
        'Do cousins ka sabse kareeb shared grandpa — tree upar jaake milao.'
      )
    }
  ];
}

function dsaGraphs_() {
  return [
    {
      mustKnow: true, area: 'Graphs', terms: 'DFS flood fill, island, grid',
      q: 'Number of Islands: grid 1=land 0=water. Connected 4-dir land = island. Count islands.\n\nPehle words clear kar lo: DFS/BFS flood fill — visit connected land mark visited.',
      a: scenarioAnswerBlock_(
        'Main ensure karunga ki har nayi unvisited land pe island++ karun aur usse judi saari land mark kar doon — double count nahi. Jaise map pe alag islands paint.',
        'Har cell “1”: count++, DFS/BFS se 4-dir flood “0”/visited. Bounds + water return. Time O(m*n). Diagonal usually not connected — confirm. Deep recursion pe iterative stack safer.\n\nfunction numIslands(grid) {\n  let count = 0;\n  const dfs = (r,c) => {\n    if (r<0||c<0||r>=grid.length||c>=grid[0].length||grid[r][c]===\"0\") return;\n    grid[r][c] = \"0\";\n    dfs(r+1,c); dfs(r-1,c); dfs(r,c+1); dfs(r,c-1);\n  };\n  for (let r=0;r<grid.length;r++) for (let c=0;c<grid[0].length;c++)\n    if (grid[r][c]===\"1\") { count++; dfs(r,c); }\n  return count;\n}',
        'Flood fill each unvisited land. Count starts. O(m*n).',
        'Visited mark bhoolna infinite / recount. 8-dir galat assume.',
        'Flood fill image, connected components, union-find alternative.',
        'Puddles in mud — ek puddle touch karke poora paint, next alag puddle count.'
      )
    },
    {
      area: 'Graphs', terms: 'cycle detection, Kahn, DFS colors',
      q: 'Course Schedule: numCourses, prerequisites [a,b] = b pehle phir a. Possible to finish?\n\nPehle words clear kar lo: cycle in directed graph = impossible. topological sort / DFS colors.',
      a: scenarioAnswerBlock_(
        'Main ensure karunga ki directed cycle to nahi — cycle ho to courses finish impossible. Jaise homework A needs B, B needs A — atak gaye.',
        'Adj list banao. DFS colors (0/1/2) se back-edge = cycle, ya Kahn indegree queue: zeros process, count==n. Time O(V+E). Self-loop / disconnected OK.\n\n// Kahn: indegree[], adj; queue zeros; while q { pop; count++; reduce neighbors }\n// return count === numCourses;',
        'Cycle ⇒ false. Topo / Kahn / DFS colors. O(V+E).',
        'Undirected cycle logic yahan. Missing edges direction.',
        'Build order, task scheduling, deadlock graphs — same idea.',
        'Subjects ki dependency — agar circular “pehle yeh” to year khatam nahi.'
      )
    },
    {
      area: 'Graphs', terms: 'BFS shortest path, grid, queue',
      q: 'Shortest Path in Binary Matrix / grid: 0 walkable, find shortest path length top-left → bottom-right (8 or 4 dir per problem).\n\nPehle words clear kar lo: unweighted → BFS distance. visited mark.',
      a: scenarioAnswerBlock_(
        'Main ensure karunga ki unweighted grid pe BFS se pehli baar end touch = shortest. DFS depth unreliable. Jaise maze mein layer by layer.',
        'Start blocked → -1. Queue [r,c,dist], visit. Neighbors bounds+open+!visited. First end hit return dist. O(m*n). 4 vs 8 dir problem pe depend.\n\n// queue.push([0,0,1]); visit; while(q){ [r,c,d]=shift;\n// if end return d; for each nbr enqueue d+1 }',
        'BFS for shortest unweighted. Visit once. No path → -1.',
        'DFS “shortest” claim. Revisit without care. Dir count galat.',
        'Dijkstra weighted; 0-1 BFS variants — later.',
        'School corridors — pehle nearest rooms, phir agla circle, exit pehle milna.'
      )
    }
  ];
}

function dsaHeapDp_() {
  return [
    {
      area: 'Heap', terms: 'Kth largest, quickselect, min-heap',
      q: 'Kth Largest Element in Array (unsorted). Return kth largest value.\n\nPehle words clear kar lo: min-heap size k. quickselect average O(n).',
      a: scenarioAnswerBlock_(
        'Main ensure karunga ki poori sort tabhi karun jab interviewer OK bole — warna heap size k ya quickselect. Jaise top k scores board pe.',
        'Min-heap size k: push, size>k pop; peek = kth largest. Or sort desc [k-1] with clarify. Quickselect avg O(n). Duplicates / k=1 / k=n.\n\nfunction findKthLargest(nums, k) {\n  return nums.slice().sort((a,b) => b - a)[k - 1];\n}\n// Prefer heap/quickselect when interviewer wants better than n log n.',
        'Heap size k or quickselect or sort+index. State complexity choice.',
        'kth smallest confuse. Max-heap galat size logic.',
        'Top K frequent, streaming medians — heap family.',
        'Race mein kth runner — leaderboard pe k tak rakh, baaki hata.'
      )
    },
    {
      mustKnow: true, area: 'DP', terms: 'climbing stairs, Fibonacci DP',
      q: 'Climbing Stairs: n steps, 1 or 2 at a time. Ways to reach top?\n\nPehle words clear kar lo: DP = overlapping subproblems. ways(n)=ways(n-1)+ways(n-2).',
      a: scenarioAnswerBlock_(
        'Main ensure karunga ki Fibonacci sochun — last step 1 ya 2 — overlapping subproblems memo/iterative. Jaise seedhi ke last ek/do kadam.',
        'ways(n)=ways(n-1)+ways(n-2). Bottom-up two vars O(n)/O(1). Pure recursion exponential — avoid. n=1→1, n=2→2.\n\nfunction climbStairs(n) {\n  if (n <= 2) return n;\n  let a = 1, b = 2;\n  for (let i = 3; i <= n; i++) { const c = a + b; a = b; b = c; }\n  return b;\n}',
        'Fib DP. Bottom-up two vars. Don’t naive recurse.',
        'Off-by-one base cases. Overflow large n (mention BigInt if asked).',
        'House robber, other linear DP — same “prev states”.',
        'Seedhi: aakhri kadam 1 ya 2 — peeche ke tareeke jodo.'
      )
    },
    {
      area: 'DP', terms: 'house robber, choose skip',
      q: 'House Robber: nums[i]=money. Adjacent houses rob nahi. Max money?\n\nPehle words clear kar lo: state = max ending at i. rob i → skip i-1.',
      a: scenarioAnswerBlock_(
        'Main ensure karunga ki har ghar pe choose karun: loot + skip previous, ya skip current — max. Adjacent nahi. Jaise alternate houses.',
        'dp[i]=max(dp[i-1], dp[i-2]+nums[i]). Rolling prev1/prev2. O(n)/O(1). Empty 0.\n\nfunction rob(nums) {\n  let prev2 = 0, prev1 = 0;\n  for (const x of nums) {\n    const cur = Math.max(prev1, prev2 + x);\n    prev2 = prev1; prev1 = cur;\n  }\n  return prev1;\n}',
        'max(skip, take+skipPrev). Linear DP. O(n).',
        'Adjacent allow kar dena. Circle houses variant alag (House Robber II).',
        'Climbing stairs state style, knapsack lite.',
        'Street pe ghar loot — next-door mat chhua, max coins.'
      )
    }
  ];
}

function sqlHandsOn_() {
  return [
    {
      mustKnow: true, area: 'JOIN', terms: 'INNER JOIN, LEFT JOIN, unmatched',
      q: 'users(id,name) aur orders(id,user_id,amount). Kaunse users ke ZERO orders hain? INNER vs LEFT kab?\n\nPehle words clear kar lo: INNER = sirf match. LEFT = left rows + null right jab match nahi.',
      a: scenarioAnswerBlock_(
        'Main ensure karunga ki zero-order users ke liye LEFT JOIN + WHERE order IS NULL use karun — INNER unhe hata dega. Jaise attendance: jo aaye vs jo list pe hain lekin aaye nahi.',
        'INNER JOIN sirf matching pairs — “jinke orders hain”. Zero orders: users LEFT JOIN orders ON user_id, phir WHERE orders.id IS NULL (anti-join). Multiple orders se pehle rows inflate — GROUP pehle socho. Index user_id helpful.\n\nSELECT u.* FROM users u\nLEFT JOIN orders o ON o.user_id = u.id\nWHERE o.id IS NULL;',
        'INNER = matches only. Zero orders = LEFT + IS NULL. Don’t INNER for missing.',
        'WHERE o.user_id IS NULL vs o.id — NULL keys careful. INNER se “no orders” impossible.',
        'NOT EXISTS alternative, reporting orphans, FK integrity checks.',
        'Class list LEFT join homework — jinki row null, unhone submit nahi kiya.'
      )
    },
    {
      area: 'Aggregate', terms: 'GROUP BY, HAVING, WHERE',
      q: 'Har user ki total spend, lekin sirf un users ko jinki total spend > 1000.\n\nPehle words clear kar lo: WHERE = row filter pehle. HAVING = aggregate ke baad filter.',
      a: scenarioAnswerBlock_(
        'Main ensure karunga ki pehle rows filter (WHERE), phir GROUP SUM, phir HAVING se total > 1000 — HAVING ko WHERE mat banao. Jaise pehle valid bills, phir total, phir rich customers.',
        'SELECT user_id, SUM(amount) … GROUP BY user_id HAVING SUM(amount)>1000. WHERE status=paid pehle. Users bina orders INNER se gayab; zeros chahiye to LEFT+COALESCE.\n\nSELECT user_id, SUM(amount) AS total\nFROM orders\nWHERE status = \"paid\"\nGROUP BY user_id\nHAVING SUM(amount) > 1000;',
        'WHERE then GROUP then HAVING. Aggregate filter = HAVING.',
        'HAVING mein raw row columns bina aggregate confuse. WHERE SUM galat.',
        'Window functions sometimes replace group+join patterns.',
        'Har dost ka snack bill jodo — jinka total 100 se zyada unki list.'
      )
    },
    {
      mustKnow: true, area: 'Window', terms: 'ROW_NUMBER, latest per user, PARTITION',
      q: 'Har user ki latest order (by created_at). ROW_NUMBER vs correlated subquery?\n\nPehle words clear kar lo: PARTITION BY user. ROW_NUMBER = unique rank in partition. rn=1 → latest.',
      a: scenarioAnswerBlock_(
        'Main ensure karunga ki har user partition mein latest pe rn=1 rakhu — ties pe ROW_NUMBER ek choose kare. Jaise har student ki latest exam copy.',
        'ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at DESC) rn, filter rn=1. MAX(created_at) join back ties pe multiple. DISTINCT ON Postgres alternative. Window often cleaner one pass.\n\nSELECT * FROM (\n  SELECT o.*, ROW_NUMBER() OVER (\n    PARTITION BY user_id ORDER BY created_at DESC\n  ) AS rn\n  FROM orders o\n) t WHERE rn = 1;',
        'Partition + ORDER DESC + rn=1. Prefer window for latest-per-group.',
        'RANK se multiple “latest” ties. Correlated subquery N+1 smell.',
        'RANK/DENSE_RANK, running totals — window family.',
        'Har classmate ki sabse nayi notebook — date se pehli pick.'
      )
    },
    {
      area: 'Window', terms: 'running total, SUM OVER, ORDER BY',
      q: 'Daily sales pe running total (cumulative sum by date).\n\nPehle words clear kar lo: window frame default with ORDER BY = cumulative.',
      a: scenarioAnswerBlock_(
        'Main ensure karunga ki SUM OVER (ORDER BY day) se cumulative banau — bina ORDER BY ke har row pe grand total aa jaata. Jaise piggy bank roz jodna.',
        'SELECT day, amount, SUM(amount) OVER (ORDER BY day) AS running_total. Optional PARTITION BY region. Duplicate days pe pehle aggregate. Index day helps sort.\n\nSELECT day, amount,\n  SUM(amount) OVER (ORDER BY day) AS running_total\nFROM daily_sales;',
        'SUM OVER ORDER BY = running. Without ORDER BY = total every row.',
        'Frame clauses confuse (ROWS vs RANGE) — start simple.',
        'Moving averages, YoY windows — same toolkit.',
        'Roz pocket money likho aur aaj tak ka jama total.'
      )
    },
    {
      area: 'Window', terms: 'ROW_NUMBER, RANK, DENSE_RANK',
      q: 'Scores: 100,100,90. ROW_NUMBER vs RANK vs DENSE_RANK kya denge?\n\nPehle words clear kar lo: ties. RANK skips next. DENSE_RANK no skip. ROW_NUMBER unique.',
      a: scenarioAnswerBlock_(
        'Main ensure karunga ki ties ka rule clear bolun — ROW_NUMBER unique 1,2,3; RANK 1,1,3; DENSE_RANK 1,1,2. Jaise race medals vs serial tokens.',
        'Same ORDER BY score DESC mental model. Top-N exact one row → ROW_NUMBER. Olympics gaps → RANK. Dense leaderboard → DENSE_RANK. Filter rank<=3 ties careful.\n\n-- score 100,100,90\n-- ROW_NUMBER: 1,2,3 | RANK: 1,1,3 | DENSE_RANK: 1,1,2',
        'ROW_NUMBER unique. RANK skips. DENSE_RANK no skip.',
        'Top 3 with RANK can return >3 rows on ties — product decide.',
        'Latest-per-group uses ROW_NUMBER often, not RANK.',
        'Do first place — next ko 3rd bolo (RANK) ya 2nd (DENSE) ya alag token (ROW_NUMBER).'
      )
    },
    {
      area: 'EXPLAIN', terms: 'seq scan, index scan, planner',
      q: 'EXPLAIN pe Seq Scan dikha vs Index Scan. Kab kaun sa expect, slow query pe kya check?\n\nPehle words clear kar lo: seq scan = poori table. index scan = index se rows. selective filter → index helpful.',
      a: scenarioAnswerBlock_(
        'Main ensure karunga ki pehle selectivity sochun — thode rows filter pe index expect, almost poori table pe seq scan sasta ho sakta. Jaise dictionary vs book page-by-page.',
        'EXPLAIN ANALYZE: filter kitna selective, index leftmost match, stats stale (ANALYZE), function on column index kill. Small tables seq OK. Composite order matters.\n\nEXPLAIN ANALYZE SELECT * FROM orders WHERE user_id = 42;\n-- Want Index Scan if selective.',
        'Selective → index. Most rows → seq OK. Check EXPLAIN not vibes.',
        'Blind index add without query pattern. YEAR(col) wrap kills index.',
        'Covering indexes, planner stats, slow query playbooks.',
        'Library: ek book code se nikaalo (index) vs har shelf ghumo (seq).'
      )
    },
    {
      mustKnow: true, area: 'Index', terms: 'composite index, left-prefix',
      q: 'Index (a,b,c). Kaunsi WHERE clauses index use kar sakti hain?\n\nPehle words clear kar lo: left-prefix rule = a, ab, abc. sirf b ya c aksar nahi.',
      a: scenarioAnswerBlock_(
        'Main ensure karunga ki left-prefix yaad rakhu — a, a+b, a+b+c use; sirf b/c usually nahi. Jaise phonebook pehle surname.',
        'Equality leading cols + range next often OK. ORDER BY a,b index order match. Extra indexes write cost. WHERE b=1 AND c=2 needs different index.\n\n-- Index (user_id, created_at)\n-- Good: WHERE user_id=?\n-- Good: WHERE user_id=? AND created_at > ?\n-- Bad: WHERE created_at > ? alone',
        'Left-prefix. Leading column missing → weak/no use.',
        'Random column order hope. Too many overlapping indexes.',
        'Covering INCLUDE, EXPLAIN verification.',
        'Dictionary pehle letter A, phir B — beech se Z se start mat.'
      )
    },
    {
      area: 'Index', terms: 'covering index, index-only scan',
      q: 'Covering index kya hai? SELECT id, email WHERE status=? pe kaise help?\n\nPehle words clear kar lo: covering = index mein saari needed columns; heap/table visit avoid.',
      a: scenarioAnswerBlock_(
        'Main ensure karunga ki hot read pe index ke andar hi saari columns hon — table trip kam. Jaise sticky note pe poora answer, book kholne ki zarurat nahi.',
        'CREATE INDEX … (status) INCLUDE (id, email) or (status,id,email). EXPLAIN index-only possible. SELECT * rarely covered. Wider index = write cost.\n\nCREATE INDEX ON users (status) INCLUDE (id, email);\nSELECT id, email FROM users WHERE status = \"active\";',
        'Covering = query satisfied from index. INCLUDE for extras.',
        'Cover everything blindly — write/storage blow up.',
        'Index-only scans, ORM select * anti-pattern.',
        'Exam cheat sheet pe sirf zaroori lines — poori kitaab mat.'
      )
    },
    {
      area: 'Isolation', terms: 'READ COMMITTED, REPEATABLE READ, SERIALIZABLE',
      q: 'READ COMMITTED vs REPEATABLE READ vs SERIALIZABLE — phantom/non-repeatable read simple?\n\nPehle words clear kar lo: dirty read. non-repeatable = same row changes. phantom = new rows appear.',
      a: scenarioAnswerBlock_(
        'Main ensure karunga ki default aksar RC hai — statement ke beech row badal sakti; RR snapshot; Serializable sabse strict with aborts. Jaise exam copying rules kitni hard.',
        'RC: non-repeatable possible. RR: row snapshot; phantoms DB-dependent. Serializable: as if one-by-one, retries on conflict. Banking stricter + short txns. Long serializable = failures.\n\n-- RC: two SELECTs same row alag values possible\n-- Serializable: safest, may abort txn',
        'Higher isolation = more safety + more locks/retries. Pick per need.',
        'Always Serializable everywhere — latency/aborts. Ignoring retry logic.',
        'Transactions, deadlocks, money transfers — related.',
        'Do log same notebook padhein — beech mein page change (RC) vs photocopy freeze (RR).'
      )
    },
    {
      area: 'Rewrite', terms: 'N+1, JOIN, IN subquery',
      q: 'App har user ke liye alag SELECT orders WHERE user_id=?. SQL mein ek query kaise?\n\nPehle words clear kar lo: N+1 = 1 list + N detail queries. batch JOIN or WHERE user_id IN (...).',
      a: scenarioAnswerBlock_(
        'Main ensure karunga ki N round-trips ko ek JOIN/IN batch mein badlun — DB happy, network kam. Jaise ek tray mein saari plates.',
        'WHERE user_id IN (...ids) ya JOIN users↔orders. ORM eager load / DataLoader. Huge IN → temp/join values. Empty list guard.\n\nSELECT o.* FROM orders o\nWHERE o.user_id IN (1,2,3,4);',
        'Batch with IN/JOIN. Kill N+1. Index user_id.',
        'Loop queries in app “temporary”. Empty IN () SQL error.',
        'GraphQL DataLoader, pagination of parent ids.',
        'Teacher har bacche se alag pooche vs ek list pe saari notebooks collect.'
      )
    },
    {
      area: 'Pagination', terms: 'OFFSET, keyset, seek',
      q: 'Page 5000 pe OFFSET 50000 slow. Keyset/seek pagination query kaise?\n\nPehle words clear kar lo: OFFSET skip cost. keyset = WHERE (created_at,id) < last_seen ORDER BY ... LIMIT.',
      a: scenarioAnswerBlock_(
        'Main ensure karunga ki deep pages pe OFFSET skip na karun — last seen tuple se aage seek. Jaise bookmark se padhna, 5000 pages flip nahi.',
        'ORDER BY created_at DESC, id DESC LIMIT 20. Next: WHERE (created_at,id) < (last…) same order. Index (created_at,id). Updates mid-scroll skip/dup possible — document.\n\nSELECT * FROM posts\nWHERE (created_at, id) < ($last_created, $last_id)\nORDER BY created_at DESC, id DESC\nLIMIT 20;',
        'Keyset > deep OFFSET. Stable sort + composite compare.',
        'OFFSET forever. Unstable sort (no id tie-break).',
        'Cursor APIs, infinite scroll FE, covering indexes.',
        'Comic book bookmark — page 1 se 5000 count mat, bookmark ke baad continue.'
      )
    },
    {
      area: 'NULL', terms: 'NOT IN, three-valued logic, IS NULL',
      q: 'WHERE id NOT IN (SELECT nullable_col ...) unexpected empty result kyun?\n\nPehle words clear kar lo: SQL three-valued logic. NOT IN + NULL → unknown → row filtered out.',
      a: scenarioAnswerBlock_(
        'Main ensure karunga ki NOT IN + NULL trap samjhun — ek NULL poora NOT IN UNKNOWN bana deta. Prefer NOT EXISTS / anti-join. Jaise “list mein nahi” lekin list mein blank sticker.',
        'Agar subquery mein NULL, NOT IN sab rows filter. NOT EXISTS (SELECT 1 … WHERE o.user_id=u.id) safe. Or filter nulls out of subquery.\n\nSELECT u.* FROM users u\nWHERE NOT EXISTS (\n  SELECT 1 FROM orders o WHERE o.user_id = u.id\n);',
        'NOT IN + NULL = footgun. Use NOT EXISTS / LEFT anti-join.',
        'Assuming SQL boolean only true/false. Ignoring NULL in IN lists.',
        'Three-valued logic, outer joins, COALESCE.',
        '“Jo list mein nahi” — list mein ek blank paper ho to teacher confuse, kisi ko pass na kare.'
      )
    }
  ];
}


// ================================================================
// PHASE 1 DATA — LLD & JS/TS (Scenario-style paragraphs)
// ================================================================
function getCodingLld_() {
  return [{
    topicId: 'C3',
    title: 'TOPIC C3 — LLD / Machine coding (~12)',
    subtitle: 'Classes, SOLID, patterns. Har answer paragraph Hinglish (Scenario-style) — hard words Q ke niche. Design Engineering mein.',
    area: 'LLD',
    qa: [].concat(lldSolid_(), lldPatterns_(), lldSystems_())
  }];
}

function getCodingJsTs_() {
  return [{
    topicId: 'C4',
    title: 'TOPIC C4 — JavaScript core + TypeScript (~15)',
    subtitle: 'Event loop, Promises, this, TS. Har answer paragraph Hinglish — hard words Q ke niche. Trace Engineering mein.',
    area: 'JS/TS',
    qa: [].concat(jsCore_(), tsDepth_())
  }];
}

function lldSolid_() {
  return [
    {
      mustKnow: true, area: 'SOLID', terms: 'SRP OCP LSP ISP DIP',
      q: 'SOLID ke 5 letters — har ek pe 1-line example + machine coding mein kab yaad aaye.\n\nPehle words clear kar lo: SRP single responsibility. OCP open/closed. LSP Liskov. ISP interface segregation. DIP dependency inversion.',
      a: scenarioAnswerBlock_(
        'Main ensure karunga ki SOLID ko ratta nahi, design compass banaun — jab class messy ho tab letter se diagnose. Jaise toolkit: har tool ek kaam.',
        'S: OrderService order own kare, EmailSender alag. O: naya payment = naya class, giant if nahi. L: Square extends Rectangle agar setW/setH break kare to galat inheritance. I: Penguin ko Bird.fly force mat. D: Checkout PaymentGateway interface pe depend kare, Stripe concrete pe nahi. Machine coding mein pehle entities/APIs clear, phir SOLID jab branching/duplication dikhe — pehle din 6 layers YAGNI ke khilaaf.',
        'SOLID = maintainability compass. Example + trade-off bolo, slogan nahi. YAGNI saath rakho.',
        'Bina example ke SOLID bolna hollow. Over-apply karke unreadable design.',
        'Strategy/Factory/Observer often OCP+DIP serve karte. Code review YAGNI tension.',
        'School bag ke 5 rules: ek dabba ek cheez, naya subject naya dabba, penguin se udna mat poocho.'
      )
    },
    {
      area: 'SOLID', terms: 'YAGNI, premature abstraction',
      q: 'Junior pehle din 6 interfaces + AbstractFactory add karta hai “future-proof”. Tum LLD review mein kya pushback doge?\n\nPehle words clear kar lo: YAGNI = You Aren’t Gonna Need It. premature abstraction = zarurat se pehle layers.',
      a: scenarioAnswerBlock_(
        'Main ensure karunga ki aaj ki complexity pehle na bhugtun jab sirf ek concrete path hai — future speculative. Jaise 10 gate wedding ke liye jab guests 5.',
        'Review pe poochunga: aaj kitne real variants hain? Agar ek implementation hai to clear functions/classes kaafi. Jab doosra/teesra variant aaye tab Strategy/Factory extract. Tests aur names pehle; framework baad. Duplication dikhe tab abstract — pehle nahi.',
        'Start simple; extract on real pain. Ask “kitne variants aaj?”',
        'Abstraction refuse karke spaghetti if/else bhi galat — balance.',
        'SOLID OCP later; strangler/refactor stories; PR size.',
        'Lego tower pehle seedhi banao — pehle din space station kit mat kholo.'
      )
    }
  ];
}

function lldPatterns_() {
  return [
    {
      area: 'Pattern', terms: 'Strategy, polymorphism, if/else',
      q: 'Pricing: regular / festive / employee discount — if/else badhta ja raha. Strategy kaise?\n\nPehle words clear kar lo: Strategy = interchangeable algorithm behind interface.',
      a: scenarioAnswerBlock_(
        'Main ensure karunga ki pricing rule ko swappable algorithm banaun — checkout if/else se aazaad. Jaise different calculators plug-in.',
        'PriceStrategy interface with calculate(cart). RegularStrategy, FestiveStrategy, EmployeeStrategy. Checkout holds strategy (ctor/setter/map). Naya rule = naya class, checkout untouched (OCP). Config type→strategy OK. One-line strategies pehle din overkill — jab branching grow kare tab extract.',
        'Strategy when type-based if/else grows. Interface + swap.',
        'God Strategy with 20 methods (ISP fail). Premature for one branch.',
        'Factory creates strategies; DIP checkout→interface.',
        'Exam marking scheme badlo — same answer sheet, alag marking card.'
      )
    },
    {
      area: 'Pattern', terms: 'Factory, construction logic',
      q: 'NotificationChannel email/sms/push — callers pe switch(type) new ... Factory kab?\n\nPehle words clear kar lo: Factory = object create karne ka single place.',
      a: scenarioAnswerBlock_(
        'Main ensure karunga ki creation logic ek jagah ho — callers sirf Channel pe baat karein. Jaise reception se sahi counter ticket.',
        'NotificationFactory.create(type) switch/map se Email/Sms/Push as Channel return. Callers send(msg) only. Construction rules/config yahin. Simple new Foo() pe Factory force mat. AbstractFactory jungle for 2 types avoid. Baad mein DI container same idea.',
        'Factory when construction branches. Callers depend on interface.',
        'new scattered everywhere. AbstractFactory for tiny cases.',
        'Strategy objects often born from Factory; OCP on new channels.',
        'Canteen counter: “email/sms” bolo, plate ready — kitchen details mat jaano.'
      )
    },
    {
      area: 'Pattern', terms: 'Observer, pub-sub, notify',
      q: 'Order placed pe email, analytics, inventory update. Observer/pub-sub sketch?\n\nPehle words clear kar lo: Observer = subject notify subscribers. Coupling kam.',
      a: scenarioAnswerBlock_(
        'Main ensure karunga ki order core flow side-effects se loosely couple ho — email slow ho to checkout na atke. Jaise school bell pe alag-alag reactions.',
        'Subject subscribe/unsubscribe/notify ya event bus publish(\"order.placed\"). Listeners: Email, Analytics, Inventory. Sync vs async queue later. Idempotent listeners retries ke liye. Ek listener fail → isolate vs fail-all policy decide.',
        'Decouple side effects. Prefer async for non-critical. Idempotent handlers.',
        'Sync email in request thread. Silent listener exceptions.',
        'Outbox pattern, queues, notification service LLD — same story.',
        'Birthday party announce — dost cake, photo, gifts alag kaam, host core party.'
      )
    },
    {
      area: 'OOP', terms: 'interface vs inheritance, composition',
      q: 'Naya payment gateway add. Inheritance hierarchy vs interface + composition — 5 YOE choice?\n\nPehle words clear kar lo: inheritance = is-a. interface = can-do. composition = has-a.',
      a: scenarioAnswerBlock_(
        'Main ensure karunga ki Checkout gateway interface compose kare — deep BasePayment tree nahi. Jaise plug socket standard, brand alag.',
        'PaymentGateway { charge(amount, idemKey) }. StripeGateway, RazorpayGateway. Checkout(gateway). Shared retry/logging decorator/wrapper se composition. True is-a shared behavior pe hi inheritance. Tests mein mock interface easy. Naya gateway = naya class, checkout same.',
        'Prefer interface + composition. Inheritance for real is-a only.',
        'Fragile base class. “extends” for slight variants.',
        'DIP, Strategy, adapter to third-party SDKs.',
        'Phone charger port same — Samsung/Apple cable alag plug, phone logic same.'
      )
    }
  ];
}

function lldSystems_() {
  return [
    {
      mustKnow: true, area: 'Rate limiter', terms: 'token bucket, Redis, fixed window',
      q: 'API pe per-user rate limit (e.g. 100 req/min). Token bucket design + in-memory vs Redis.\n\nPehle words clear kar lo: token bucket = tokens refill over time; request consumes token. multi-instance → shared store.',
      a: scenarioAnswerBlock_(
        'Main ensure karunga ki limit multi-instance pe bhi sahi ho — sirf local Map LB ke peeche 3x limit de dega. Jaise shared ticket roll, har counter alag nahi.',
        'RateLimiter.allow(key). TokenBucket: capacity, refill rate, tokens, lastRefill. allow consume else 429 + Retry-After. Single node: Map. Multiple nodes: Redis (INCR/LUA / token fields). Clarify user vs IP vs API key, burst vs steady. Fixed window simple lekin edge bursty; token/sliding smoother. Load test verify.',
        'Shared store behind LB. Token bucket + 429. Clarify key + burst.',
        'In-memory only with many pods. Ignoring clock/refill bugs.',
        'API gateway, idempotency, abuse prevention, Redis.',
        'Cinema tickets machine — tokens dheere bharte, khali pe “baad mein aao”.'
      )
    },
    {
      mustKnow: true, area: 'LRU', terms: 'HashMap, doubly linked list, O(1)',
      q: 'LRU Cache: get/put O(1), capacity pe least recently used evict.\n\nPehle words clear kar lo: LRU = least recently used. DLL + HashMap classic.',
      a: scenarioAnswerBlock_(
        'Main ensure karunga ki get/put O(1) ho — Map se node, DLL se recent order. Jaise desk pe recent copy upar, purani neeche fenk.',
        'Node {key,val,prev,next}. Map key→node. Head = most recent, tail = least. get hit: moveToHead. put: update/add head; size>cap removeTail + map delete. Interview mein O(1) explicitly bolo. Thread-safety alag (lock). capacity 0/1 edges.\n\n// get: map lookup + moveToHead\n// put: upsert head; if over capacity unlink tail',
        'HashMap + DLL. Move on access. Evict tail. O(1) get/put.',
        'Only Map+timestamps O(n) scan. Pointer unlink bugs. Forgetting map delete on evict.',
        'Redis LRU, cache eviction policies, concurrency.',
        'Study table — nayi kitaab upar; jagah kam to sabse neeche wali hatao.'
      )
    },
    {
      area: 'Parking lot', terms: 'spots, vehicle types, ticket',
      q: 'Parking Lot LLD: car/bike/truck, floors, park/leave, ticket. Entities + APIs outline.\n\nPehle words clear kar lo: spot allocation strategy. ticket = proof of parking.',
      a: scenarioAnswerBlock_(
        'Main ensure karunga ki pehle entities clear karun — Floor, Spot, Vehicle, Ticket — phir park/leave APIs. Jaise mall parking board + slip.',
        'Enums VehicleType/SpotSize. Spot {floor,id,size,occupied}. AllocationStrategy.findSpot(vehicle). park: find, mark, Ticket(entry). leave: fee via PricingStrategy, free spot. Display board free counts optional. Clarify multi-floor, truck needs large, concurrency. Strategy se nearest vs any-spot badal sakte.',
        'Entities first. Strategy for allocation/pricing. Ticket lifecycle.',
        'God ParkingLot class. No size rules. Ignoring concurrency.',
        'Factory for vehicles, Observer for display board updates.',
        'School cycle stand — size fit, slip do, wapas pe fee/free slot.'
      )
    },
    {
      area: 'Notification', terms: 'channel interface, retry, idempotency',
      q: 'Notification service: email/SMS/push, retry, avoid duplicate send on retry.\n\nPehle words clear kar lo: channel interface. idempotency key. retry with backoff.',
      a: scenarioAnswerBlock_(
        'Main ensure karunga ki at-least-once queue pe bhi duplicate SMS na jaye — idempotency key + sent store. Jaise homework submit id ek baar count.',
        'Channel interface send(msg). Email/Sms/Push impl. Service.enqueue({id,user,template,channels}). Worker load, send, mark success; fail → backoff retry; already sent skip. Dead letter after N. Sync send in API thread avoid. Template vs raw body alag.',
        'Interface + queue worker. Idempotency on notification id. Isolate channels.',
        'Retries without idempotency = spam. Sync email in request.',
        'Outbox, Observer, rate limits on SMS provider.',
        'School notice reprint — same notice number pe dobara print mat.'
      )
    },
    {
      area: 'Splitwise', terms: 'balances, simplify debt, transactions',
      q: 'Splitwise lite: users, expense equal/unequal split, show balances, simplify debts idea.\n\nPehle words clear kar lo: balance[user] net. simplify = min transactions to settle.',
      a: scenarioAnswerBlock_(
        'Main ensure karunga ki har expense se net balances update ho, settle pe min transfers suggest. Float paise avoid — integer cents. Jaise trip kharcha copy.',
        'User, Group, Expense {payer, splits[]}. addExpense → balance deltas. getBalances. simplify: greedy max creditor vs max debtor (bol dena globally optimal nahi). Immutable expense log + derived balances. Clarify currency/groups/rounding.',
        'Balances from expenses. Simplify = netting story. Use cents.',
        'Only pairwise IOUs without net. Float money bugs.',
        'Ledger pattern, idempotent expense ids, group permissions.',
        'Picnic bill — net kaun kitna deta/leta, phir kam se kam UPI.'
      )
    },
    {
      area: 'Concurrency', terms: 'shared cache, race, lock',
      q: 'In-memory LRU multiple threads se get/put. Race kya, kaise safe?\n\nPehle words clear kar lo: race = interleaved updates corrupt structure. mutex/lock. concurrent map.',
      a: scenarioAnswerBlock_(
        'Main ensure karunga ki DLL pointers + map updates atomic hon — bina lock do puts links tod sakte. Jaise do log ek diary pe ek saath likhein.',
        'Race: interleaved unlink/link corrupt list ya map size mismatch. Fix: mutex around get+put; striped locks; ConcurrentHashMap alone DLL nahi bachata; shard per thread; ya Redis. ReadWriteLock if reads dominate (still careful). Invariant: map size == DLL nodes. Stress test.',
        'Shared mutable cache needs lock or external store. Map alone ≠ safe LRU.',
        '“ConcurrentHashMap enough” myth for DLL. No stress test.',
        'Rate limiter multi-node, Redis, actor model.',
        'Do friends ek notebook — turn lo ya alag copies, warna lines mix.'
      )
    }
  ];
}

function jsCore_() {
  return [
    {
      mustKnow: true, area: 'Event loop', terms: 'macrotask, microtask, setTimeout, Promise',
      q: 'Output order batao:\nconsole.log(1);\nsetTimeout(() => console.log(2), 0);\nPromise.resolve().then(() => console.log(3));\nconsole.log(4);\n\nPehle words clear kar lo: sync pehle. microtask (Promise then) pehle macrotask (setTimeout) se.',
      a: scenarioAnswerBlock_(
        'Main ensure karunga ki sync pehle, phir microtasks, phir timers — setTimeout(0) “turant” nahi. Jaise counter pehle line ke customers, phir VIP queue, phir walk-ins.',
        '1 aur 4 sync stack pe. Promise.then microtask queue. setTimeout macrotask. Stack clear ke baad microtasks (3), phir timer (2). Output: 1 4 3 2. Nested then bhi timeout se pehle. async/await after await bhi microtask continuation.',
        'Order: sync → microtasks → macrotasks. 1 4 3 2.',
        'Assuming timeout before Promise. Ignoring nested microtasks.',
        'UI jank long tasks, Node event loop, Promise scheduling.',
        'Homework pehle likho (sync), sticky notes (micro), alarm bell baad (timeout).'
      )
    },
    {
      area: 'Promise', terms: 'all, allSettled, race, fail-fast',
      q: 'Promise.all vs allSettled vs race — kab kaun, ek reject pe kya?\n\nPehle words clear kar lo: fail-fast = all reject on first reject. allSettled = wait all. race = first settle.',
      a: scenarioAnswerBlock_(
        'Main ensure karunga ki need clear karun — sab success, sabka report, ya pehli finish. Galat helper se silent fail. Jaise group project rules.',
        'all: ek reject → overall reject (fail-fast), baaki chal sakte. allSettled: har ek status/value|reason. race: pehli settle (fulfill ya reject). Timeout: race(fetch, sleepReject). Parallel widgets with partial fail → allSettled.',
        'all = all must win. allSettled = report card. race = first done.',
        'Using race for “wait all”. Swallowing all rejections.',
        'Promise.any, AbortController, FE parallel fetches.',
        'Teen dost race — all finish wait, ya pehla, ya har ek ka result copy.'
      )
    },
    {
      area: 'this', terms: 'method, arrow, bind, call',
      q: 'const obj = { n: 1, f(){ return this.n; }, a: () => this.n }; obj.f() vs obj.a() vs const g=obj.f; g()?\n\nPehle words clear kar lo: method this = receiver. arrow this = lexical. detached = undefined/strict.',
      a: scenarioAnswerBlock_(
        'Main ensure karunga ki method vs arrow vs detached alag rules — object literal arrow obj bind nahi karta. Jaise naamplate galat desk pe.',
        'obj.f() → 1 (receiver obj). obj.a() → lexical outer this, usually undefined/window, not 1. const g=obj.f; g() → this lost (strict undefined). Fix: bind, wrap, or call as method. Class field arrows auto-bind pattern alag story.',
        'Method this = caller object. Arrow = lexical. Extract loses this.',
        'Assuming object literal arrow uses obj. Forgetting bind on callbacks.',
        'call/apply/bind, React class handlers history.',
        'Teacher “tum” bole class mein vs corridor mein — context badle to meaning.'
      )
    },
    {
      area: 'Prototype', terms: 'prototype chain, __proto__, Object.create',
      q: 'obj.hasOwnProperty vs chain pe method. Prototype chain simple draw.\n\nPehle words clear kar lo: own property vs inherited. [[Prototype]] link.',
      a: scenarioAnswerBlock_(
        'Main ensure karunga ki lookup pehle own, phir parent prototype… null tak. Jaise family inheritance of recipes.',
        'Object.create(parent) child link. Own keys pehle. hasOwnProperty Object.prototype se. class = prototype sugar. Object.prototype mutate mat. Prefer Object.hasOwn. for..in inherited enumerable noise.',
        'Own then chain. Don’t mutate Object.prototype. hasOwn for safety.',
        'for..in assuming only own. Shadowing surprises.',
        'Classes, inheritance vs composition, polyfills.',
        'Notebook pe apna sticker; nahi mila to bade bhai ki copy pe dekho.'
      )
    },
    {
      area: 'Closure', terms: 'var vs let, loop closure',
      q: 'for (var i=0;i<3;i++) setTimeout(()=>console.log(i),0) vs let i — output?\n\nPehle words clear kar lo: var function-scoped one binding. let per-iteration binding.',
      a: scenarioAnswerBlock_(
        'Main ensure karunga ki var ek shared i capture karta — timeouts baad mein 3 3 3. let har iteration alag binding — 0 1 2. Jaise ek shared chalkboard vs har student ki slate.',
        'var function scope: loop end i=3, teeno closures wahi. let per-iteration. Fix var with IIFE (i)=> or bind. Closure captures binding, not freeze of primitive unless separate binding.',
        'var → 3 3 3. let → 0 1 2. Per-iteration binding matters.',
        'Blaming only setTimeout. Ignoring var scope.',
        'Closures in React hooks, stale closures Scenario FE.',
        'Teen sticky notes — ek shared number badlo vs teen alag numbers.'
      )
    },
    {
      area: 'Coercion', terms: '==, ===, truthy',
      q: '[] == false, \"\" == false, null == undefined, null === undefined — results + rule?\n\nPehle words clear kar lo: == coerces. === no coerce. Prefer ===.',
      a: scenarioAnswerBlock_(
        'Main ensure karunga ki production mein === / explicit checks — == footguns yaad rakhne se better avoid. Jaise strict gate pass.',
        '[]==false → true (weird). \"\"==false → true. null==undefined → true. null===undefined → false. App code: ===. Counts pe || mat, ?? use. Intentional nullish: == null checks both.',
        'Prefer ===. Know a few == traps; don’t rely on them.',
        'Memorizing whole abstract equality table as strategy.',
        'eslint eqeqeq, nullish coalescing, boolean coercion.',
        'Teacher strict matching — “almost same” answers count nahi (===).'
      )
    },
    {
      area: 'Copy', terms: 'shallow, deep, structuredClone',
      q: 'const b={...a} vs structuredClone(a) vs JSON.parse(JSON.stringify(a)) — nested mutate?\n\nPehle words clear kar lo: shallow = top level copy, nested refs shared. deep = recursive copy.',
      a: scenarioAnswerBlock_(
        'Main ensure karunga ki spread shallow hai — nested object share. Deep chahiye to structuredClone / careful lib. Jaise xerox cover page, andar same notebook.',
        'a={n:{x:1}}; b={...a}; b.n.x=2 → a bhi badla. structuredClone deep (modern). JSON drops functions/undefined/Date quirks. Redux often new refs shallow enough. Immer pattern.',
        'Spread = shallow. Nested mutate both. structuredClone for deep.',
        'Assuming {...} is deep copy — classic bug.',
        'Immutability, React state updates, immer.',
        'Folder copy — upar naya cover, andar same worksheet share.'
      )
    },
    {
      area: 'Syntax', terms: 'optional chaining, nullish coalescing',
      q: 'user?.address?.city ?? \"N/A\" — ?. vs ?? vs || farq?\n\nPehle words clear kar lo: ?. short-circuit undefined/null. ?? only null/undefined default. || also 0 \"\" false.',
      a: scenarioAnswerBlock_(
        'Main ensure karunga ki defaults counts pe || se na tootain — 0 valid ho to ??. ?. sirf nullish path safe. Jaise blank form vs zero marks.',
        'user?.name null user pe undefined throw nahi. ?? default only null/undefined. 0||5→5 galat for counts; 0??5→0. Optional call user?.() careful.',
        '?. safe path. ?? nullish default. Don’t use || for numbers casually.',
        'user?.length mistakes. || swallowing 0/\"\".',
        'TS optional props, API partial JSON.',
        'Form: empty name → N/A; marks 0 → 0 hi dikhao, default mat.'
      )
    },
    {
      area: 'Async', terms: 'try/catch, unhandled rejection',
      q: 'async function mein await fail. try/catch vs .catch. Unhandled rejection kya?\n\nPehle words clear kar lo: await throws into try. floating promise without catch = unhandled rejection.',
      a: scenarioAnswerBlock_(
        'Main ensure karunga ki har promise path handle ho — floating await/.then bina catch process warning/crash. Jaise letter bina stamp.',
        'try { await p } catch (e) {…} ya p.catch. Fire-and-forget: void p.catch(log). Express async → next(err) wrapper. Promise.all reject path. Empty catch swallow avoid.',
        'Await errors need try/catch or .catch. No floating promises.',
        'Empty catch. Assuming await works in non-async.',
        'UnhandledRejection hooks, FE error boundaries alag layer.',
        'Homework submit fail — teacher ko batao, chhupake bag mein mat.'
      )
    }
  ];
}

function tsDepth_() {
  return [
    {
      mustKnow: true, area: 'TypeScript', terms: 'unknown, any, type safety',
      q: 'unknown vs any — API JSON parse ke baad kaun sa, kyun?\n\nPehle words clear kar lo: any opts out of checks. unknown must narrow before use.',
      a: scenarioAnswerBlock_(
        'Main ensure karunga ki untrusted JSON pe unknown rakhu aur narrow/validate karun — any safety band kar deta. Jaise parcel pehle khol ke check.',
        'const data: unknown = JSON.parse(text); type guard / zod / typeof se User banao. any assign anywhere — bugs slip. eslint no-explicit-any. as User bina check = lie to compiler.',
        'Prefer unknown at boundaries. Narrow before use. Avoid any.',
        'Casting as User without runtime check. any “just for now” forever.',
        'Zod/io-ts, API DTOs, domain types.',
        'Stranger ka dabba — pehle dekho kya hai (unknown), blind use mat (any).'
      )
    },
    {
      area: 'TypeScript', terms: 'generics, identity, reuse',
      q: 'Generic identity / wrapper: function wrap<T>(x: T): {value:T}. Kyun generics?\n\nPehle words clear kar lo: generic = type parameter. preserve input type to output.',
      a: scenarioAnswerBlock_(
        'Main ensure karunga ki logic reuse karun bina type mitaaye — any se information kho jaati. Jaise labeled boxes same shape.',
        'first<T>(arr: T[]): T|undefined preserves string[]→string. Constraints T extends {id:string}. Don’t generic everything. Default <T=any> sneak avoid.',
        'Generics keep type info across args/return. Constrain when needed.',
        'Over-generic unreadable APIs. Hidden any defaults.',
        'Partial/Pick utilities, React useState inference.',
        'Pencil box template — jo pencil daalo wahi type label rahe.'
      )
    },
    {
      area: 'TypeScript', terms: 'Partial, Pick, Omit, Record',
      q: 'Partial / Pick / Omit / Record — PATCH API body aur map types pe kab?\n\nPehle words clear kar lo: Partial all optional. Pick subset. Omit exclude. Record keys→type.',
      a: scenarioAnswerBlock_(
        'Main ensure karunga ki DTO utilities se banaun — rewrite interfaces kam. Jaise form ke selected fields.',
        'PATCH: Partial<User> ya Partial<Pick<User,\"name\"|\"email\">>. List: Pick id/name. Hide hash: Omit password. Dict: Record<string, number>. Runtime validate still needed.',
        'Compose utility types for API shapes. Still validate at runtime.',
        'Partial everything then forget required fields live.',
        'Readonly/Required, mapped types.',
        'Profile edit — sirf name/email fields optional form.'
      )
    },
    {
      area: 'TypeScript', terms: 'narrowing, type guard, typeof',
      q: 'function print(x: string | number) — kaise narrow karke string methods safe?\n\nPehle words clear kar lo: narrowing = control flow se union tight. type guard predicate.',
      a: scenarioAnswerBlock_(
        'Main ensure karunga ki typeof / type guard se branch karun — as cast last resort. Jaise box khol ke type pehle.',
        'if (typeof x === \"string\") x.toUpperCase(); else x.toFixed(2). Custom: function isCat(a: Animal): a is Cat. Array.isArray, in, discriminated unions preferred over casts.',
        'Narrow with typeof/guards. Prefer over as.',
        'Truthy checks for objects insufficient. Blind casts.',
        'Discriminated unions, unknown narrowing.',
        'Gift box — pehle dekho toy ya book, phir use.'
      )
    },
    {
      area: 'TypeScript', terms: 'discriminated union, exhaustiveness',
      q: 'type Shape = {kind:\"circle\", r:number} | {kind:\"square\", s:number}. area(shape) exhaustive?\n\nPehle words clear kar lo: discriminant = kind field. switch kind. never check exhaustiveness.',
      a: scenarioAnswerBlock_(
        'Main ensure karunga ki switch kind pe never default rakhu — naya variant add pe compile error. Jaise checklist incomplete highlight.',
        'switch (s.kind) { case \"circle\": …; case \"square\": …; default: const _: never = s; }. Add triangle → must handle. Great for state machines / actions.',
        'Discriminant + never = exhaustive. Safe when variants grow.',
        'Optional kind overlapping fields. Missing default never.',
        'Redux-like actions, result Ok/Err unions.',
        'Shape stickers circle/square — naya triangle aaye to marking scheme update force.'
      )
    },
    {
      area: 'TypeScript', terms: 'satisfies, const assertion',
      q: 'as const vs satisfies — config object pe kab kaun?\n\nPehle words clear kar lo: as const = deepest readonly literal types. satisfies = check assignable keep literals.',
      a: scenarioAnswerBlock_(
        'Main ensure karunga ki literals lock karne ho to as const, shape check + infer ke liye satisfies. Jaise stamp + checklist dono.',
        'as const → \"prod\" literal not string. satisfies Config → assignable check without widening away. as Config alone can widen / miss intent. TS 4.9+ satisfies.',
        'as const freezes literals. satisfies checks shape + keeps inference.',
        'Only as Config and losing literal unions.',
        'Route maps, theme tokens, config objects.',
        'Label pe exact flavour name freeze (as const) + box rules check (satisfies).'
      )
    }
  ];
}


// ================================================================
// PHASE 2 DATA - Story Bank (STAR + Project)
// ================================================================
function getPhaseStar_() {
  return [{
    topicId: 'P1',
    title: 'TOPIC P1 - STAR behavioral (~8)',
    subtitle: 'Manager / HR rounds. Har answer Scenario-style. Engineering mein apni blanks (___ ) bharo - fake company mat invent blindly.',
    area: 'STAR',
    qa: starBehavioral_()
  }];
}

function getPhaseProject_() {
  return [{
    topicId: 'P2',
    title: 'TOPIC P2 - Project deep-dive (~4)',
    subtitle: '"Apna last project batao" round. Template + blanks. Bolke practice karo, sirf padhna kaafi nahi.',
    area: 'Project',
    qa: projectDeepDive_()
  }];
}

function starBehavioral_() {
  return [
    {
      mustKnow: true, area: 'STAR', terms: 'STAR, disagree and commit, influence',
      q: 'Lead / senior se technical disagreement tha. Tum blindly follow vs pushback - ek STAR story outline karo.\n\nPehle words clear kar lo: STAR = Situation Task Action Result. disagree and commit = baat rakh ke decision ke baad team ke saath chalna.',
      a: scenarioAnswerBlock_(
        'Main ensure karunga ki story blame nahi, data + trade-off + commit dikhaye - ego fight nahi. Jaise debate ke baad match ke rules follow.',
        'Situation: ___ project pe design choice (example: sync vs queue / library X vs Y). Task: sahi long-term path + deadline. Action: main options likha, pros/cons, risk, reversible?, chhota spike/POC (__ hours). Lead se sync; agar decision unka raha to commit + document dissent briefly. Result: ___ metric (rework kam / incident nahi / ship on time). Blanks bharo: company, system, numbers.',
        'Data pehle, ego baad. Disagree and commit. Result with number.',
        'Bina structure ke "maine kaha unhone kaha" junior lagta. Result missing = weak.',
        'PR review conflict, escalation, estimation disagreements - same muscle.',
        'Do dost ice-cream choose - reasons bolo, phir jo decide ho uspe khush raho.'
      )
    },
    {
      area: 'STAR', terms: 'deadline, stakeholder update, blocker',
      q: 'Estimate miss / missed deadline. STAR mein kaise bataoge bina excuse bank bane?\n\nPehle words clear kar lo: early update. blocker. revised plan. ownership.',
      a: scenarioAnswerBlock_(
        'Main ensure karunga ki pehle ownership + early signal dikhun - last day surprise nahi. Jaise late train pe pehle message.',
        'Situation: ___ feature, estimate ___ days. Task: deliver without silent slip. Action: day-___ pe blocker mila (dependency / scope / bug); same din stakeholder update: impact, options (cut scope / parallel help / date+__), daily checkpoint. Result: shipped ___ with ___ scope OR date move with trust intact. Fill: real blocker, date, outcome.',
        'Early honest update > heroic silence. Own the miss + plan.',
        'Blame-only story. No revised plan. Fake "I worked 20 hours".',
        'Risk register, buffer in estimates, stakeholder comms.',
        'Homework late - pehle teacher ko batao reason + naya time, chhupo mat.'
      )
    },
    {
      area: 'STAR', terms: 'incident, rollback, blameless',
      q: 'Failed release / production incident jisme tum involved the. STAR + seekh?\n\nPehle words clear kar lo: mitigate first. rollback. postmortem action items.',
      a: scenarioAnswerBlock_(
        'Main ensure karunga ki pehle bleeding rokna, phir root cause, phir prevention - hero debug pride last. Jaise fire pehle bujhao.',
        'Situation: deploy ___ ke baad ___ symptom (error rate / latency). Task: restore users + learn. Action: confirm deploy correlation; rollback/flag; status updates; preserve logs; RCA; tests/alerts added (___). Result: MTTR ___, repeat prevent via ___. Fill blanks honestly.',
        'Mitigate -> communicate -> RCA -> prevent. Blameless + owned actions.',
        'Only "fixed bug" without prevention. Blame teammate.',
        'On-call, feature flags, canary, postmortem culture.',
        'Science project fail - pehle mess clean, phir notebook mein seekh likho.'
      )
    },
    {
      area: 'STAR', terms: 'mentoring, feedback, growth',
      q: 'Junior mentorship - concrete STAR (code review / pairing / ownership).\n\nPehle words clear kar lo: feedback specific. scaffolding. measure growth.',
      a: scenarioAnswerBlock_(
        'Main ensure karunga ki "maine help kiya" vague na ho - pehle level, phir action, phir unka outcome. Jaise coach drills + match result.',
        'Situation: junior ___ struggle (tests / PR size / debugging). Task: unhe independent banana. Action: pairing sessions ___, checklist, smaller PRs, review comments teaching not nitpick. Result: unka PR cycle time ___ -> ___ / fewer reverts. Fill names lightly, metrics better.',
        'Specific feedback + scaffolding + measurable growth.',
        '"I am nice mentor" without example. Doing their work forever.',
        'Code review culture, onboarding docs, psychological safety.',
        'Chhote bhai ko cycle sikhana - pehle hold, phir chhodna, phir alone ride.'
      )
    },
    {
      area: 'STAR', terms: 'ambiguity, clarify, acceptance criteria',
      q: 'PM one-liner: "Make it better." Tumne kaise clarify kiya - STAR.\n\nPehle words clear kar lo: acceptance criteria. options. out of scope.',
      a: scenarioAnswerBlock_(
        'Main ensure karunga ki coding se pehle measurable outcome lock ho - infinite polish trap se bacho. Jaise "room better" pehle poocho lights ya toys.',
        'Situation: vague ask on ___. Task: ship valuable change on time. Action: questions (users, metric, deadline), 2-3 options effort/impact, write acceptance criteria, out-of-scope explicit, spike if needed (___ hours). Result: delivered ___ that moved metric ___ / avoided redo.',
        'Clarify -> options -> AC -> build. Silent assumption = redo.',
        'Built "beautiful UI" nobody asked. No metric.',
        'Product thinking, estimation, UX research lite.',
        'Birthday gift "something nice" - pehle poocho hobby, phir kharido.'
      )
    },
    {
      mustKnow: true, area: 'STAR', terms: 'ownership, incident, stakeholders',
      q: 'Tumhare change ne bug introduce kiya. Ownership STAR - rollback vs hotfix kaise decide?\n\nPehle words clear kar lo: ownership. mitigate. stakeholder update.',
      a: scenarioAnswerBlock_(
        'Main ensure karunga ki pehle main own karun - "maybe env" hide nahi. Users pehle, ego baad. Jaise todha khilona admit karke fix.',
        'Situation: mera PR/deploy ___ symptom. Task: stop pain fast. Action: impact severity; rollback if safe else targeted hotfix; announce what/impact/next update; leave breadcrumb for RCA; follow-up test. Result: recovery in ___, trust via transparency. Fill real incident.',
        'Own it. Mitigate first. Transparent updates. Then prevent.',
        'Defensiveness. Disappearing into rabbit hole silently.',
        'Feature flags, canary, blameless postmortem.',
        'Ball se sheesha toota - pehle bol do, jhaadu, phir rule seekho.'
      )
    },
    {
      area: 'STAR', terms: 'career switch, motivation, pull not push',
      q: 'Why are you looking / why switch? STAR-ish structure without badmouthing.\n\nPehle words clear kar lo: pull factors. growth. scope. respect current employer.',
      a: scenarioAnswerBlock_(
        'Main ensure karunga ki story pull pe ho (scope/growth/problem space) - current company roast nahi. Jaise naya school better lab ke liye.',
        'Situation: current role ___ years, strengths ___. Task: next step aligned with ___. Action: what I built (impact ___), what I want next (scale / ownership / domain ___), why this company fits (product/tech ___). Result: clear mutual fit ask. Fill honestly; avoid salary-only opener (salary later ok).',
        'Pull > push. Respect + concrete growth ask. Company research.',
        'Boss toxicity rant. "Any job fine". Fake passion.',
        'Negotiation later; culture questions; notice period honesty.',
        'Team change - better coach/practice ground, purane coach ko gaali nahi.'
      )
    },
    {
      area: 'STAR', terms: 'notice, salary, negotiation',
      q: 'Notice period / salary expectation kaise frame karoge - professional, non-awkward?\n\nPehle words clear kar lo: range. constraints. flexibility. honesty.',
      a: scenarioAnswerBlock_(
        'Main ensure karunga ki pehle constraints clear, phir range based on market + value - ultimatum drama nahi. Jaise ticket price + budget talk.',
        'Situation: offer / HR screen. Task: align expectations early. Action: notice = ___ weeks (honest; buyout?); salary = range ___-___ based on ___ (location, level, competing); total comp (bonus/ESOP) clarify; flexibility where real. Result: no late surprise. Fill your numbers privately before interview.',
        'Honest notice. Range not single demand. Total comp view.',
        'Lying about notice. Anchoring absurd without research.',
        'Competing offers ethics, joining date, level mapping.',
        'Tuition fees baat - pehle kitne months course, phir fee range.'
      )
    }
  ];
}

function projectDeepDive_() {
  return [
    {
      mustKnow: true, area: 'Project', terms: 'architecture, whiteboard, ownership',
      q: 'Apna last / strongest project whiteboard pe batao - 5-7 minute structure.\n\nPehle words clear kar lo: context. boxes. data flow. your slice. scale numbers.',
      a: scenarioAnswerBlock_(
        'Main ensure karunga ki pehle context + users, phir boxes, phir mera hissa + numbers - feature dump nahi. Jaise map pe pehle city, phir ghar.',
        'Template bolke: (1) Problem + users + success metric ___. (2) High-level: client -> API -> services -> DB/cache/queue. (3) Critical path request walkthrough. (4) Mera ownership: modules ___ . (5) Scale: QPS/DAU/latency ___ . (6) Failure mode we hit + fix. (7) Trade-off we chose. Fill every blank with YOUR project. Draw while talking.',
        'Context -> architecture -> your slice -> numbers -> failure -> trade-off.',
        'Only tech name-drop. No numbers. Claiming whole system alone.',
        'System design round, resume bullets, behavioral ownership.',
        'School science model - pehle kya problem, phir parts, phir tumne kya chipkaaya.'
      )
    },
    {
      area: 'Project', terms: 'impact, metrics, ownership',
      q: '"Tumhara exact contribution kya tha?" - impact + numbers kaise bolo.\n\nPehle words clear kar lo: before/after. ownership boundary. collaboration.',
      a: scenarioAnswerBlock_(
        'Main ensure karunga ki "we" vs "I" clear ho - team credit + personal scope. Jaise cricket: team win + tumhare runs.',
        'Script: Before: metric ___ (p95 ___ / error ___ / time-to-ship ___). I owned ___. Changes: ___. After: metric ___. Collaborated with ___ for ___. What I did NOT own: ___. Fill real numbers even if approximate - say "approx".',
        'I/we clear. Before->after metric. Honest boundary.',
        'Inflating ownership. No measurable outcome.',
        'Performance reviews, promotion packets, STAR results.',
        'Group project - teacher pooche "tumne kya likha" - apna paragraph dikhao.'
      )
    },
    {
      area: 'Project', terms: 'debugging, root cause, severity',
      q: 'Project ki hardest bug - kaise debug ki, kya seekha?\n\nPehle words clear kar lo: reproduce. hypothesis. bisect. fix+guard.',
      a: scenarioAnswerBlock_(
        'Main ensure karunga ki story systematic debugging dikhaye - lucky fix nahi. Jaise detective clues.',
        'Situation: symptom ___ (prod-only?). Hypotheses: ___. Reproduce path / logs / metric. Narrow: bisect deploy, feature flag, data shape. Root cause: ___. Fix + test + alert so next time catch. Time-to-detect/fix if known. Fill your bug.',
        'Hypotheses -> evidence -> root cause -> prevent. Not random prints forever.',
        'Vague "it was race". No prevention. Blame tool only.',
        'Observability, flaky tests, incident RCA.',
        'Lost toy - pehle last place yaad, rooms check, rule banao dobara na kho.'
      )
    },
    {
      area: 'Project', terms: 'hindsight, trade-offs, learning',
      q: 'Aaj us project pe kya differently karte - mature answer?\n\nPehle words clear kar lo: hindsight. trade-off then vs now. learning without regret theater.',
      a: scenarioAnswerBlock_(
        'Main ensure karunga ki "sab galt tha" drama nahi - tab constraints maan ke better next step. Jaise pehle wali painting pe naya layer.',
        'Then constraints: time/team/knowledge ___. What worked: ___. What I change now: (tests earlier / better contracts / smaller PRs / observability first / simpler design) ___. Why then it made sense. Fill 2 concrete changes max - depth > laundry list.',
        'Respect past constraints. 1-2 concrete upgrades. No self-roast marathon.',
        '"I would use Kubernetes+Kafka+AI" buzzword regret. Claiming perfection.',
        'Tech debt pitches, architecture evolution, mentoring juniors.',
        'Old homework - ab neater steps likhte, pehle time kam tha admit.'
      )
    }
  ];
}



// ================================================================
// PHASE 2 DATA - Deep Dive (SD + FE + Security)
// ================================================================
function getPhaseSdWalkthroughs_() {
  return [{
    topicId: 'P3',
    title: 'TOPIC P3 - Full-length system design walkthroughs (~8)',
    subtitle: '45-min style. Engineering spine: requirements -> estimation -> API -> data -> components -> bottleneck -> trade-offs -> failures. Spoken paragraphs.',
    area: 'SD Walkthrough',
    qa: sdWalkthroughs_()
  }];
}

function getPhaseFeAdvanced_() {
  return [{
    topicId: 'P4',
    title: 'TOPIC P4 - Frontend advanced (~12)',
    subtitle: 'State, SSR, testing, CSS, leaks, optimistic UI. Scenario-style Hinglish - hard words Q ke niche.',
    area: 'FE Advanced',
    qa: feAdvanced_()
  }];
}

function getPhaseSecurity_() {
  return [{
    topicId: 'P5',
    title: 'TOPIC P5 - Security / OWASP (~10)',
    subtitle: '5 YOE security judgement. Scenario-style. Hard words Q ke niche.',
    area: 'Security',
    qa: securityOwasp_()
  }];
}

function sdWalkthroughs_() {
  return [
    {
      mustKnow: true, area: 'Chat', terms: 'websocket, fan-out, presence, ordering',
      q: 'Design a chat system (1:1 + group lite) - 45-min walkthrough outline.\n\nPehle words clear kar lo: websocket realtime. fan-out message delivery. presence online. ordering per conversation.',
      a: scenarioAnswerBlock_(
        'Main ensure karunga ki pehle requirements lock karun - 1:1 vs group, media, offline, delivery receipts - warna boxes guesswork. Jaise party size pehle pucho.',
        'Requirements: 1:1 + groups?, history, receipts, typing?, media, scale (DAU/QPS ___). Estimation: msgs/sec, storage/day. API: REST history + WS/SSE realtime; sendMessage, ack. Data: Conversation, Member, Message(id, conv, sender, body, created_at) indexed (conv, created_at). Components: gateway WS, chat service, store (Cassandra/PG), fan-out online via pubsub, offline push. Bottleneck: hot group fan-out - fan-out on write vs read. Trade-offs: exactly-once hard -> at-least-once + idempotent client ids. Failures: WS drop reconnect + gap fill; duplicate suppress.',
        'Clarify NFRs. WS + durable history. Ordering per conv. Idempotent send.',
        'Drawing Kafka without message model. Ignoring offline. Claiming exactly-once casually.',
        'Notifications, presence service, CDN for media, Scenario SD async.',
        'Class group chat - live talk + diary history + jo offline tha use baad mein dikhao.'
      )
    },
    {
      area: 'Feed', terms: 'fan-out, ranking, timeline, cache',
      q: 'Design a news feed (follow graph + posts) - walkthrough.\n\nPehle words clear kar lo: fan-out on write vs read. timeline cache. ranking.',
      a: scenarioAnswerBlock_(
        'Main ensure karunga ki follow graph + fan-out strategy pehle decide - celebrity problem alag. Jaise newspaper home delivery vs library pull.',
        'Requirements: follow, post, feed freshness, media, likes?. Estimation: posts/sec, fan-out fan-in. API: createPost, getFeed(cursor). Data: User, Follow, Post; feed cache list per user optional. Components: post service, graph, feed worker, Redis timelines, CDN. Bottleneck: celebrities - hybrid fan-out (write for normal, read for celebs). Ranking: time vs score; start chronological. Failures: delayed fan-out, cache rebuild, pagination cursors stable.',
        'Hybrid fan-out for celebs. Cursor pagination. Cache timelines carefully.',
        'Push to all followers always. OFFSET deep pages. Ignoring media CDN.',
        'Chat fan-out, notification digests, ranking ML later.',
        'School notice - popular teacher alag, normal notices bag mein daal do.'
      )
    },
    {
      area: 'Notifications', terms: 'channels, digests, preference, queue',
      q: 'Design notification system (in-app + email/push) - walkthrough.\n\nPehle words clear kar lo: channel adapters. preference center. digest. idempotency.',
      a: scenarioAnswerBlock_(
        'Main ensure karunga ki event -> preference -> channel pipeline ho, sync email request pe nahi. Jaise school bell vs letter home.',
        'Requirements: events, channels, quiet hours, digests, priority. Estimation: events/sec. API: registerDevice, updatePrefs, listInApp. Data: Notification, Preference, DeviceToken, DeliveryLog idempotent key. Components: event bus, notifier workers, providers (FCM/SES), in-app store. Bottleneck: provider rate limits - queue + backoff. Trade-offs: at-least-once + dedupe. Failures: partial channel fail, poison messages DLQ, template bugs.',
        'Async pipeline. Prefs before send. Idempotent delivery keys.',
        'Sync send in API. No prefs. Duplicate storms on retry.',
        'Observer/outbox, rate limits, LLD notification service.',
        'Parents ko message - app ping + email; same notice do baar mat.'
      )
    },
    {
      area: 'Upload', terms: 'presigned URL, direct upload, virus scan',
      q: 'Design file upload (images/docs) with CDN - walkthrough.\n\nPehle words clear kar lo: presigned URL. direct-to-storage. async processing.',
      a: scenarioAnswerBlock_(
        'Main ensure karunga ki large files app server se na guzrein - presigned direct upload. Jaise parcel seedha warehouse.',
        'Requirements: size/type limits, private/public, virus scan?, thumbnails. Flow: client requests upload intent -> API authz + presign S3 -> client PUT -> webhook/complete -> async scan/transcode -> CDN URL. Data: FileMeta(status). Bottleneck: bandwidth; multipart large files. Failures: abandoned uploads GC, malware quarantine, expired URL. Trade-off: server proxy simpler but not scalable.',
        'Presign + direct upload. Meta state machine. Async process.',
        'Base64 through API forever. No authz on object keys. Public buckets accident.',
        'Object storage, IAM, CDN signed URLs, security SSRF on callbacks.',
        'School project video - form pe link, file seedha drive, teacher baad mein check.'
      )
    },
    {
      area: 'Typeahead', terms: 'prefix search, trie, autocomplete, cache',
      q: 'Design typeahead / autocomplete search - walkthrough.\n\nPehle words clear kar lo: prefix match. debounce. ranking. cache hot prefixes.',
      a: scenarioAnswerBlock_(
        'Main ensure karunga ki latency pehle - debounce FE, tight backend budget, prefix index. Jaise dictionary tab pehle letters.',
        'Requirements: suggest within ~50-100ms, personalization?, typos?. API: GET /suggest?q=&limit=. Data: prefix index (ES edge ngram / Redis sorted sets / trie service). Cache hot queries. Ranking: popularity + prefix. Bottleneck: wildcards; limit fan-out. Failures: stale suggestions after updates - async reindex. FE: debounce + cancel in-flight.',
        'Prefix index + cache. FE debounce/cancel. Rank simply first.',
        'SQL LIKE %q% on huge table. No limit. Ignoring cancel.',
        'Search systems, Redis ZSET tricks, CDN edge caching.',
        'Dictionary - pehle "app" type, matching words list, popular pehle.'
      )
    },
    {
      mustKnow: true, area: 'Rate limit service', terms: 'token bucket, Redis, gateway',
      q: 'Design rate limiter as a shared service (multi-API) - walkthrough.\n\nPehle words clear kar lo: central limits. Redis. dimensions (user/IP/route).',
      a: scenarioAnswerBlock_(
        'Main ensure karunga ki limits shared store pe hon - har instance local counter unreliable. Jaise shared ticket roll.',
        'Requirements: keys (user, IP, route), algorithms (token/sliding), 429 + headers. API: check(key, cost) -> allow/deny. Redis Lua atomic. Gateway or sidecar. Estimation: QPS to limiter itself. Bottleneck: Redis hot keys - shard by key. Failures: Redis down fail-open vs fail-closed policy. Trade-offs: accuracy vs latency.',
        'Central Redis. Atomic check. Explicit fail mode. 429 contract.',
        'Per-pod memory only. Silent drop without headers. No dimensions.',
        'API gateway, abuse, LLD token bucket, multi-tenant SaaS.',
        'Fair ticket counter for all rides - ek machine pe count, alag stalls nahi.'
      )
    },
    {
      area: 'URL shortener', terms: 'hash, redirect, cache, analytics',
      q: 'URL shortener full walkthrough (not just clarify questions).\n\nPehle words clear kar lo: encode id. 301/302. hot key cache. custom aliases.',
      a: scenarioAnswerBlock_(
        'Main ensure karunga ki read-heavy redirect path ultra simple + cached ho - write path alag. Jaise nickname -> full address book.',
        'Requirements: create, redirect, custom alias?, expiry, analytics. Estimation: read/write ratio high reads. API: POST /shorten, GET /:code. Data: code PK, long URL, owner, expires. ID gen: counter+base62 or hash+collision retry. Cache Redis for hot codes. Redirect 302 vs 301 SEO trade-off. Analytics async queue. Bottleneck: hot codes; DB unique. Failures: collision, cache stampede, phishing abuse (auth + rate limit).',
        'Simple redirect path. Cache hot. Unique codes. Async analytics.',
        'Sync analytics on redirect. No abuse controls. Over-sharding day one.',
        'Caching, CDNs, Scenario URL shortener clarify Q.',
        'Class nickname list - short name se full name, popular names cache.'
      )
    },
    {
      area: 'Booking', terms: 'inventory, idempotency, oversell, seats',
      q: 'Design ticket / seat booking lite (concert/movie) - walkthrough.\n\nPehle words clear kar lo: hold vs confirm. inventory. oversell. payment idempotency.',
      a: scenarioAnswerBlock_(
        'Main ensure karunga ki seat inventory race-safe ho - hold TTL + confirm atomic. Jaise cinema seat lock 10 min.',
        'Requirements: browse, hold seat, pay, confirm; prevent double book. API: hold, confirm, cancel. Data: Event, Seat, Hold(expires), Booking. Flow: hold rows with TTL; payment idempotent; confirm seat sold. Bottleneck: hot events - shard by event, row locks careful. Failures: payment success booking fail -> reconcile job; expired hold release. Trade-offs: overbooking policy airline-style rare.',
        'Hold TTL + confirm. Idempotent payment. Reconcile jobs.',
        'Check-then-act without lock. Long transactions across payment.',
        'Idempotency keys, sagas, inventory systems.',
        'Cinema app - seat 10 min lock, pay, ticket; time out to free.'
      )
    }
  ];
}

function feAdvanced_() {
  return [
    {
      mustKnow: true, area: 'State', terms: 'Redux Toolkit, Zustand, server state',
      q: 'Client state vs server state - Redux Toolkit / Zustand / React Query kab?\n\nPehle words clear kar lo: client state UI. server state remote cache. invalidation.',
      a: scenarioAnswerBlock_(
        'Main ensure karunga ki server data ko pehle React Query/SWR jaisa treat karun - Redux mein API soup avoid. Jaise fridge vs online order tracking.',
        'Server state: fetch/cache/stale/invalidate -> React Query. Local UI: modal open, wizard step -> useState/Zustand. Cross-cutting complex client domain -> Redux Toolkit slices. Do not put every GET in Redux. Normalize only when needed. Fill your app example ___.',
        'Server cache library != Redux default. Local UI keep local.',
        'All API in Redux. Prop drilling fear -> global everything.',
        'Invalidation, optimistic updates, Scenario FE data fetching.',
        'Homework list school server pe; tumhara "page open" local.'
      )
    },
    {
      area: 'React Query', terms: 'staleTime, cacheTime, invalidate',
      q: 'React Query: staleTime vs cacheTime(gcTime), mutation ke baad list kaise update?\n\nPehle words clear kar lo: stale = refetch eligible. gcTime = unused cache keep. invalidate.',
      a: scenarioAnswerBlock_(
        'Main ensure karunga ki staleTime se spam refetch rokun, mutation pe invalidate/optimistic se list sync. Jaise milk expiry vs fridge cleanup.',
        'staleTime: data kitni der fresh maano. gcTime: inactive query memory. Mutation success: invalidateQueries([\"todos\"]) ya setQueryData. Optimistic: onMutate snapshot, onError rollback. Deduping in-flight. Do not zero staleTime everywhere.',
        'Tune staleTime. Invalidate or setQueryData after writes. Optimistic carefully.',
        'Confusing stale with gc. Never invalidating -> ghost UI.',
        'Zustand local, REST idempotency, FE double submit.',
        'Tiffin fresh 2h (staleTime); box fridge mein 2 din (gc) phir phenk.'
      )
    },
    {
      area: 'Routing', terms: 'protected routes, auth gate, redirects',
      q: 'Protected routes + auth redirect pattern (React Router / Next).\n\nPehle words clear kar lo: auth gate. redirect returnTo. role checks.',
      a: scenarioAnswerBlock_(
        'Main ensure karunga ki unauthenticated user private page pe na atke - login + returnTo. Role checks server pe bhi. Jaise club gate + pass.',
        'Client: loader/guard checks session; redirect /login?next=. Avoid flash: wait session resolve. Server/Next middleware for real protection. RBAC: UI hide != security. 401 interceptor refresh/logout. Fill stack ___.',
        'Client UX gate + server truth. returnTo. Roles on server.',
        'Only client if (user) hide admin. Tokens in open routes.',
        'Auth cookies, CSRF, Scenario FE auth.',
        'Exam hall - pehle admit card, phir seat; fake sticker kaafi nahi.'
      )
    },
    {
      mustKnow: true, area: 'SSR', terms: 'hydration, RSC, caching, Next.js',
      q: 'SSR / Next.js: hydration mismatch aur caching kab dukh dete hain?\n\nPehle words clear kar lo: SSR HTML pehle. hydration JS attach. mismatch server!=client HTML.',
      a: scenarioAnswerBlock_(
        'Main ensure karunga ki server HTML aur pehli client render same hon - random/Date/localStorage pe mismatch. Jaise twin photos match.',
        'Mismatch sources: Date.now(), random ids, window in render, locale. Fix: useEffect client-only, suppress carefully, deterministic render. Caching: page/data cache stale -> soft nav weird; know revalidate tags. Auth personalized pages cache carefully (private).',
        'Deterministic SSR HTML. Client-only for browser APIs. Cache vs personalize.',
        'Ignore hydration warnings. Cache authenticated HTML publicly.',
        'CSR vs SSR vs RSC trade-offs, CDN cache.',
        'Printed worksheet + digital same numbers - warna students confuse.'
      )
    },
    {
      area: 'Testing', terms: 'Jest, RTL, Playwright, pyramid',
      q: 'FE testing strategy: Jest/RTL vs Playwright - kya unit, kya e2e?\n\nPehle words clear kar lo: RTL user-centric. e2e critical paths. flaky.',
      a: scenarioAnswerBlock_(
        'Main ensure karunga ki pyramid follow - zyada unit/RTL, kam e2e critical journeys. Jaise drills vs full match.',
        'RTL: components by role/text, user events. Jest: pure utils. Playwright/Cypress: login->checkout happy path + 1-2 edges. Avoid e2e for every CSS. Mock network at boundary. Fix flaky with waits on assertions not sleep. Fill CI time budget ___.',
        'RTL for UI behavior. E2E few critical. Fight flakiness.',
        'Only snapshots. 200 e2e red CI. Testing implementation details.',
        'MSW, contract tests, visual regression optional.',
        'Spellings class test (unit) vs full annual exam (e2e).'
      )
    },
    {
      area: 'CSS', terms: 'flex, grid, responsive, CLS',
      q: 'Responsive layout + CLS: flex/grid kab, image space reserve?\n\nPehle words clear kar lo: CLS layout shift. intrinsic size. mobile-first.',
      a: scenarioAnswerBlock_(
        'Main ensure karunga ki layout shift na aaye - images/fonts space, stable skeletons. Jaise photo frame pehle, picture baad.',
        'Mobile-first breakpoints. Flex one-dimension; grid two-dim. Images width/height or aspect-ratio. Fonts swap strategy. Prefer CSS over JS measure. Avoid inserting banners above content late without reserve.',
        'Reserve space. Flex vs grid by dimension. Mobile-first.',
        'Late ads pushing content. Fixed px only desktop.',
        'Core Web Vitals, design systems, a11y zoom.',
        'Scrapbook - pehle box draw, phir sticker; page jump nahi.'
      )
    },
    {
      area: 'Leaks', terms: 'memory leak, listeners, subscriptions',
      q: 'SPA memory leaks - listeners/subscriptions kaise pakdo aur fix?\n\nPehle words clear kar lo: cleanup. retain cycle. detached DOM.',
      a: scenarioAnswerBlock_(
        'Main ensure karunga ki mount pe add, unmount pe remove - timers/WS/listeners. Jaise light off jab room chhodo.',
        'Symptoms: heap grows navigate. Tools: Performance memory, React Profiler. Fixes: useEffect cleanup, abort fetch, WS close, removeEventListener same ref. Global stores dropping references. Detached DOM via uncleared closures.',
        'Every subscribe needs unsubscribe. Abort async. Measure heap.',
        'Inline listener refs mismatch remove. Ignoring WS.',
        'Scenario stale closure, event loop jank.',
        'Club membership - leave pe card cancel, fees mat chalte raho.'
      )
    },
    {
      area: 'Error boundary', terms: 'error boundary, fallback, isolation',
      q: 'Error boundaries deep: kya catch hota / nahi, kahan place?\n\nPehle words clear kar lo: render errors. event handlers not caught. isolation.',
      a: scenarioAnswerBlock_(
        'Main ensure karunga ki widget fail se poora app white na ho - boundaries isolate. Jaise fuse per room.',
        'Catch: render/lifecycle. Not: event handlers, async (need own try), SSR quirks. Place around panels (chart, widget), not only root. Fallback UI + report. Reset keys remount. Pair with route-level boundaries.',
        'Isolate widgets. Know what boundaries miss. Fallback + log.',
        'Only root boundary. Assuming async errors caught.',
        'Suspense, monitoring, Scenario FE error boundary Q.',
        'One bulb fuse - poora ghar dark nahi, us room ka fuse.'
      )
    },
    {
      area: 'Code split', terms: 'lazy, Suspense, route split',
      q: 'Route-based code splitting - kab, waterfall kaise avoid?\n\nPehle words clear kar lo: lazy import. Suspense. preload.',
      a: scenarioAnswerBlock_(
        'Main ensure karunga ki heavy routes lazy hon lekin critical path waterfall na bane. Jaise bag mein sirf aaj ke books.',
        'React.lazy + Suspense per route. Avoid tiny splits overhead. Preload on hover/intent. Do not lazy the landing critical CSS/JS blindly. Measure with bundle analyzer. SSR/Next dynamic import careful.',
        'Split big routes. Preload intent. Measure bundles.',
        'Lazy everything including above-fold. No loading UI.',
        'Webpack/Vite chunks, HTTP/2, Scenario FE build.',
        'Trip bag - pehle din ke kapde accessible, baaki zip.'
      )
    },
    {
      area: 'Optimistic', terms: 'optimistic UI, rollback, conflict',
      q: 'Optimistic UI like/unlike - rollback aur conflict kaise?\n\nPehle words clear kar lo: optimistic update. rollback. server truth.',
      a: scenarioAnswerBlock_(
        'Main ensure karunga ki UI turant move kare lekin server fail pe rollback + truth sync. Jaise tick pehle, stamp baad.',
        'onMutate: cancel queries, snapshot, set liked. onError: restore snapshot + toast. onSettled: invalidate. Idempotent toggle APIs. Conflict: last-write or version field. Avoid optimistic on payments.',
        'Snapshot -> optimistic -> rollback on fail -> invalidate. Not for money.',
        'No rollback. Double toggle races. Optimistic checkout pay.',
        'React Query mutations, CRDT advanced later.',
        'Like button turant red - server na bole to wapas grey.'
      )
    },
    {
      area: 'Forms', terms: 'controlled, RHF, validation',
      q: 'Big forms: controlled mega state vs React Hook Form - trade-off?\n\nPehle words clear kar lo: controlled re-render. uncontrolled register. schema validation.',
      a: scenarioAnswerBlock_(
        'Main ensure karunga ki 50-field form pe har keystroke poora tree na render kare - RHF/uncontrolled or isolated state. Jaise alag answer sheets.',
        'Tiny forms: controlled fine. Large: RHF/Formik + zod/yup. Validate UX client + truth server. Disable double submit. Accessibility labels/errors. File inputs special.',
        'Large forms -> RHF/schema. Always server validate. A11y errors.',
        'One giant controlled state object. Client-only validation trust.',
        'Scenario forms double-submit, a11y.',
        'Long exam - har question alag; ek page pe sab rewrite mat.'
      )
    },
    {
      area: 'RUM', terms: 'Core Web Vitals, RUM, performance budget',
      q: 'FE observability: RUM + Core Web Vitals - kya track, kaise act?\n\nPehle words clear kar lo: RUM real user metrics. LCP INP CLS. budgets.',
      a: scenarioAnswerBlock_(
        'Main ensure karunga ki lab Lighthouse ke saath real users dekhu - p75/p95. Jaise class test + real match.',
        'Track LCP/INP/CLS, JS errors, API latency from client. Segment device/geo. Budgets in CI. Act: images, main-thread long tasks, layout shifts. Sampling privacy. Correlate with release version.',
        'RUM + vitals + release tags. Budgets. Fix top regressions.',
        'Only localhost Lighthouse flex. Ignoring mobile segment.',
        'Scenario LCP/CLS, SRE SLOs, feature flags.',
        'Sports watch - practice stopwatch + real race times dono.'
      )
    }
  ];
}

function securityOwasp_() {
  return [
    {
      mustKnow: true, area: 'Authz', terms: 'IDOR, broken access control, authz',
      q: 'IDOR / broken access control: /orders/123 guess - kaise pakdo aur fix?\n\nPehle words clear kar lo: IDOR = insecure direct object reference. authz = permission check.',
      a: scenarioAnswerBlock_(
        'Main ensure karunga ki har object access pe ownership/role check ho - id jaanna kaafi nahi. Jaise locker number jaanna != key.',
        'Bug: API trusts orderId without user match. Fix: server authz (order.user_id === session.user), tests for horizontal privilege, opaque ids optional not sufficient alone. Logs of 403. Admin paths separate. Review: every GET/PATCH by id.',
        'Authz every object. Tests for IDOR. Opaque ids != security alone.',
        'Only hide buttons. Sequential ids "fine". Client-side role checks.',
        'OWASP A01, multi-tenant, Scenario authz validation.',
        'Friend ka homework number jaana - teacher tabhi de jab naam match.'
      )
    },
    {
      area: 'Injection', terms: 'SQL injection, ORM, parameterization',
      q: 'SQL/command injection - modern app mein practical defense?\n\nPehle words clear kar lo: parameterization. ORM. string concat ban.',
      a: scenarioAnswerBlock_(
        'Main ensure karunga ki user input query string mein concat na ho - bound parameters. Jaise form slots fixed.',
        'Use parameterized queries / ORM binders. Never string-build SQL with input. Least DB privilege. WAF extra not primary. Code review grep raw query. Command inject: avoid shell; if must, strict args arrays.',
        'Parameters always. No shell with user strings. Least privilege.',
        '"ORM means immune" with raw(). Manual escape DIY.',
        'XSS different class, SSRF, secure SDLC.',
        'MadLibs - blanks fill, story template change nahi kar sakte.'
      )
    },
    {
      mustKnow: true, area: 'XSS', terms: 'XSS, CSP, sanitize, React escape',
      q: 'XSS deep: stored/reflected, React pe false safety, CSP role?\n\nPehle words clear kar lo: XSS script inject. CSP Content-Security-Policy. dangerouslySetInnerHTML.',
      a: scenarioAnswerBlock_(
        'Main ensure karunga ki output encode default, HTML sinks review, CSP defense-in-depth. Jaise stranger ke letter ko bag mein mat chalana.',
        'React escapes text; risky: dangerouslySetInnerHTML, href=javascript:, template libs. Sanitize HTML with vetted lib if must. CSP script-src reduce blast. HttpOnly cookies help token theft but not page deface. Test with payloads in fields.',
        'Escape by default. Audit HTML sinks. CSP layered. Do not invent sanitizer.',
        'Assuming React = no XSS. Disabling CSP for analytics casually.',
        'CSRF distinct, cookie flags, Scenario token storage.',
        'School notice board - unknown script sticker mat chipkao; teacher filter.'
      )
    },
    {
      area: 'CSRF', terms: 'CSRF, SameSite, synchronizer token',
      q: 'CSRF deep: cookie session pe kab, SameSite vs CSRF token?\n\nPehle words clear kar lo: CSRF cross-site request. SameSite cookie. synchronizer token.',
      a: scenarioAnswerBlock_(
        'Main ensure karunga ki cookie-auth state-changing requests pe CSRF defense ho. Jaise stranger form se tumhari signature.',
        'Attack: victim logged-in, evil site triggers POST. Defenses: SameSite=Lax/Strict, CSRF token header, double-submit patterns. JSON+custom header helps but not alone. Safe methods GET no mutate. SPA bearer header less CSRF (XSS then risk).',
        'Cookie sessions need CSRF strategy. SameSite + tokens. GET safe.',
        'Only secret cookie. Mutating GET. Ignoring subdomain issues.',
        'XSS vs CSRF, CORS, Scenario cookie vs localStorage.',
        'Sibling uses your stamped permission slip on another shop.'
      )
    },
    {
      area: 'SSRF', terms: 'SSRF, metadata, allowlist',
      q: 'SSRF: server fetches URL from user - risk aur fix?\n\nPehle words clear kar lo: SSRF server-side request forgery. cloud metadata.',
      a: scenarioAnswerBlock_(
        'Main ensure karunga ki user-controlled URL se internal network/metadata na khulain. Jaise stranger address pe courier mat bhejo andar.',
        'Risk: http://169.254.169.254/, localhost admin. Fix: allowlist schemes/hosts, block private IP ranges, no redirects follow blindly, network egress controls, parse URL carefully (DNS rebinding). Prefer not fetching arbitrary URLs.',
        'Allowlist. Block link-local/private. Careful redirects. Prefer no open fetch.',
        'Blacklist only. Following redirects to internal. Trust URL parsers naively.',
        'Cloud IMDS, webhook security, reverse proxy.',
        'Friend bolte "is address pe gift bhej" - pehle check andar office to nahi.'
      )
    },
    {
      area: 'Secrets', terms: 'secrets, .env, rotation, vault',
      q: 'Secrets in repo / logs - kaise prevent aur leak response?\n\nPehle words clear kar lo: secret scanning. rotation. vault.',
      a: scenarioAnswerBlock_(
        'Main ensure karunga ki secrets env/vault se aayein, git history se rotate on leak. Jaise chabi git pe nahi.',
        'Prevention: .gitignore, pre-commit scanners, CI secret detect, no secrets in images, redact logs. Leak: rotate immediately, revoke tokens, audit access, purge history if needed. Short-lived credentials preferred.',
        'Never commit secrets. Rotate on leak. Scan CI. Redact logs.',
        '"Private repo safe". Rewriting history without rotate.',
        'Twelve-factor config, IAM roles, DevOps Docker secrets Q.',
        'House key photo WhatsApp pe mat - mile to lock badlo.'
      )
    },
    {
      area: 'Dependencies', terms: 'CVE, SCA, lockfile, supply chain',
      q: 'Dependency CVE / supply chain - 5 YOE process?\n\nPehle words clear kar lo: SCA software composition analysis. lockfile. patch.',
      a: scenarioAnswerBlock_(
        'Main ensure karunga ki lockfile + automated SCA + triage SLA ho - panic upgrade sabka nahi. Jaise medicine recall process.',
        'npm/yarn lock committed. Dependabot/Snyk/GitHub advisory. Triage critical internet-facing first. Pin versions. Review new deps. Avoid install scripts shady. Reproduce CVE relevance (reachable?).',
        'Lockfile + SCA + triage by severity/reachability. Do not blind major bump.',
        'Ignoring transitive. --force forever. No owner for upgrades.',
        'SBOM, container scanning, least deps philosophy.',
        'Shared sports kit recall - pehle check tumhare bag mein hai kya.'
      )
    },
    {
      area: 'JWT', terms: 'JWT, alg, expiry, refresh, storage',
      q: 'JWT pitfalls: alg none, long expiry, storage - practical guidance?\n\nPehle words clear kar lo: JWT claims. verify signature. refresh rotation.',
      a: scenarioAnswerBlock_(
        'Main ensure karunga ki library verify strict ho, expiry short, storage threat model clear. Jaise temporary gate pass.',
        'Verify signature + iss/aud. Reject alg=none / weird alg switch. Access short-lived; refresh rotate + revoke list. Storage: prefer httpOnly cookie carefully (CSRF) vs memory; localStorage XSS risk. Do not put secrets in JWT payload (readable).',
        'Strict verify. Short access TTL. Refresh rotation. Storage = threat trade-off.',
        'Forever JWT. Manual parse without verify. Sensitive PII in payload.',
        'Session vs JWT, Scenario cookie storage, OAuth.',
        'Fair pass 1 hour - stamp check, fake "alg none" pass reject.'
      )
    },
    {
      area: 'CSP', terms: 'CSP, XSS mitigation, nonces',
      q: 'CSP ka practical role XSS ke against? Break mat karo casually.\n\nPehle words clear kar lo: CSP whitelist script sources. nonce/hash. report-only.',
      a: scenarioAnswerBlock_(
        'Main ensure karunga ki CSP defense-in-depth ho - pehle report-only, phir enforce. Jaise guest list party.',
        'script-src with nonces/hashes beat wild unsafe-inline. Start Content-Security-Policy-Report-Only. Tighten iteratively. Third-party scripts cost. CSP not substitute for encoding. frame-ancestors clickjacking help.',
        'Report-only -> enforce. Prefer nonces over unsafe-inline. Still encode.',
        'unsafe-inline everywhere "for analytics". No report monitoring.',
        'XSS, clickjacking, supply chain scripts.',
        'Only listed DJs play music - random USB stick nahi.'
      )
    },
    {
      mustKnow: true, area: 'Authz checklist', terms: 'least privilege, deny by default, audit',
      q: 'Least privilege / authz checklist - naya endpoint ship se pehle kya?\n\nPehle words clear kar lo: deny by default. least privilege. audit trail.',
      a: scenarioAnswerBlock_(
        'Main ensure karunga ki naya endpoint pe default deny + explicit allow + tests. Jaise door locked until badge.',
        'Checklist: authn required?, authz who?, tenant isolation?, IDOR tests, rate limit, input validate, sensitive fields omit, logs without secrets, admin separate. Deny by default roles. Review PR security notes. Fill your team checklist ___.',
        'Deny default. Explicit authz. IDOR tests. No secrets in logs.',
        'Ship then "add auth later". UI-only permission.',
        'OWASP Top 10 set, secure SDLC, code review culture.',
        'Lab cupboard - locked, list pe naam, teacher log kaun khola.'
      )
    }
  ];
}


