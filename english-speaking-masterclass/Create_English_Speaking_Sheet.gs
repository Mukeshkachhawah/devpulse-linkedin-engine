/**
 * English Speaking Masterclass - 90 Days
 *
 * SETUP:
 * 1. sheets.google.com pe naya spreadsheet banao
 * 2. Extensions -> Apps Script (standalone script.google.com project mat banao)
 * 3. Code.gs mein ye poora file paste -> Save
 * 4. Run: setup (permissions Allow)
 * 5. Sheet reload -> menu "English Practice"
 *
 * Naya word dikhe? Local file today-words.txt mein add karo, phir node _generate.js + setupTodayWords
 * Timeout? Run setupDailyPlan / setupBanks / setupDrills / setupTracker / setupWeeklyReview / setupTodayWords alone.
 * Config hidden "_Meta" sheet mein store hota hai (PropertiesService use nahi).
 *
 * Tabs: Daily Plan | Phrase Bank | Vocabulary | Pronunciation | Translation | Speaking Tasks | Progress | Weekly Review | Today Words
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

var SHEET_NAMES = {
  daily: 'Daily Plan',
  phrases: 'Phrase Bank',
  vocab: 'Vocabulary',
  pron: 'Pronunciation',
  trans: 'Translation Drills',
  tasks: 'Speaking Tasks',
  tracker: 'Progress Tracker',
  weekly: 'Weekly Review',
  today: 'Today Words',
  meta: '_Meta'
};

// ================================================================
// SETUP
// ================================================================
function setup() {
  var ss = getSpreadsheet_();
  try {
    ss.rename('English Speaking Masterclass - 90 Days');
  } catch (e) {}

  ensureMetaSheet_(ss);

  // Light tabs FIRST so timeout ke baad bhi banks dikhein
  createPhraseBank_(ss);
  createVocabulary_(ss);
  createTodayWords_(ss);
  createPronunciation_(ss);
  createTranslationDrills_(ss);
  createSpeakingTasks_(ss);
  createProgressTracker_(ss);
  createWeeklyReview_(ss);
  // Heaviest last
  createDailyPlan_(ss);
  removeUnusedSheets_(ss);

  if (!getMeta_(ss, 'EN_START_DATE')) {
    setMeta_(ss, 'EN_START_DATE', Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd'));
  }

  try {
    ss.setActiveSheet(ss.getSheetByName(SHEET_NAMES.daily));
  } catch (e) {}
  SpreadsheetApp.flush();

  var msg =
    'Ready!\n\n' +
    'Sheet URL:\n' + ss.getUrl() + '\n\n' +
    'Tabs: Daily Plan + Phrase Bank + Vocabulary + Today Words + Pronunciation + Translation + Speaking Tasks + Progress + Weekly Review\n' +
    '90 days pre-loaded (Level 1-3). Menu: English Practice\n\n' +
    'Agar sirf Daily Plan dikhe: Run setupOtherTabs()\n' +
    'Timeout? Run setupDailyPlan / setupBanks / setupDrills / setupTracker / setupWeeklyReview / setupTodayWords alone.';
  Logger.log(msg);
  safeAlert_(msg);
}

function setupDailyPlan() {
  var ss = getSpreadsheet_();
  ensureMetaSheet_(ss);
  createDailyPlan_(ss);
  removeUnusedSheets_(ss);
  try { ss.setActiveSheet(ss.getSheetByName(SHEET_NAMES.daily)); } catch (e) {}
  SpreadsheetApp.flush();
  safeAlert_('Daily Plan ready.\n' + ss.getUrl());
}

/** Baaki saari tabs (jab Daily Plan pehle ban chuka ho / timeout) */
function setupOtherTabs() {
  var ss = getSpreadsheet_();
  ensureMetaSheet_(ss);
  createPhraseBank_(ss);
  createVocabulary_(ss);
  createTodayWords_(ss);
  createPronunciation_(ss);
  createTranslationDrills_(ss);
  createSpeakingTasks_(ss);
  createProgressTracker_(ss);
  createWeeklyReview_(ss);
  removeUnusedSheets_(ss);
  try { ss.setActiveSheet(ss.getSheetByName(SHEET_NAMES.today)); } catch (e) {}
  SpreadsheetApp.flush();
  safeAlert_('Other tabs ready (incl. Today Words + Weekly Review).\n' + ss.getUrl());
}

function setupBanks() {
  var ss = getSpreadsheet_();
  createPhraseBank_(ss);
  createVocabulary_(ss);
  createTodayWords_(ss);
  removeUnusedSheets_(ss);
  try { ss.setActiveSheet(ss.getSheetByName(SHEET_NAMES.today)); } catch (e) {}
  SpreadsheetApp.flush();
  safeAlert_('Phrase Bank + Vocabulary + Today Words ready.\n' + ss.getUrl());
}

function setupDrills() {
  var ss = getSpreadsheet_();
  createPronunciation_(ss);
  createTranslationDrills_(ss);
  createSpeakingTasks_(ss);
  removeUnusedSheets_(ss);
  try { ss.setActiveSheet(ss.getSheetByName(SHEET_NAMES.trans)); } catch (e) {}
  SpreadsheetApp.flush();
  safeAlert_('Pronunciation + Translation + Speaking Tasks ready.\n' + ss.getUrl());
}

function setupTracker() {
  var ss = getSpreadsheet_();
  ensureMetaSheet_(ss);
  createProgressTracker_(ss);
  removeUnusedSheets_(ss);
  try { ss.setActiveSheet(ss.getSheetByName(SHEET_NAMES.tracker)); } catch (e) {}
  SpreadsheetApp.flush();
  safeAlert_('Progress Tracker ready.\n' + ss.getUrl());
}

function setupWeeklyReview() {
  var ss = getSpreadsheet_();
  ensureMetaSheet_(ss);
  createWeeklyReview_(ss);
  removeUnusedSheets_(ss);
  try { ss.setActiveSheet(ss.getSheetByName(SHEET_NAMES.weekly)); } catch (e) {}
  SpreadsheetApp.flush();
  safeAlert_('Weekly Review ready.\n' + ss.getUrl());
}

function setupTodayWords() {
  var ss = getSpreadsheet_();
  ensureMetaSheet_(ss);
  createTodayWords_(ss);
  removeUnusedSheets_(ss);
  try { ss.setActiveSheet(ss.getSheetByName(SHEET_NAMES.today)); } catch (e) {}
  SpreadsheetApp.flush();
  safeAlert_('Today Words ready. Naye words today-words.txt se aaye.\n' + ss.getUrl());
}

/** Custom menu */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('English Practice')
    .addItem('Go to Today', 'goToToday')
    .addItem('Mark Today Done', 'markTodayDone')
    .addItem('Set Start Date', 'setStartDate')
    .addSeparator()
    .addItem('Collapse Level 1', 'collapseLevel1')
    .addItem('Expand Level 1', 'expandLevel1')
    .addItem('Collapse Level 2', 'collapseLevel2')
    .addItem('Expand Level 2', 'expandLevel2')
    .addItem('Collapse Level 3', 'collapseLevel3')
    .addItem('Expand Level 3', 'expandLevel3')
    .addSeparator()
    .addSubMenu(
      SpreadsheetApp.getUi().createMenu('Rebuild')
        .addItem('Full setup', 'setup')
        .addItem('Other tabs (no Daily Plan)', 'setupOtherTabs')
        .addItem('Daily Plan only', 'setupDailyPlan')
        .addItem('Banks only', 'setupBanks')
        .addItem('Drills only', 'setupDrills')
        .addItem('Tracker only', 'setupTracker')
        .addItem('Weekly Review only', 'setupWeeklyReview')
        .addItem('Today Words only', 'setupTodayWords')
    )
    .addToUi();
}

// ================================================================
// HELPERS
// ================================================================
function getSpreadsheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  if (ss) return ss;
  ss = SpreadsheetApp.create('English Speaking Masterclass - 90 Days');
  Logger.log('No active spreadsheet - created: ' + ss.getUrl());
  return ss;
}

function safeAlert_(message) {
  try {
    SpreadsheetApp.getUi().alert(message);
  } catch (e) {
    Logger.log(message);
  }
}

/** Hidden key/value config sheet - works even when DocumentProperties is null */
function ensureMetaSheet_(ss) {
  var sheet = ss.getSheetByName(SHEET_NAMES.meta);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAMES.meta);
    sheet.hideSheet();
    sheet.getRange(1, 1, 1, 2).setValues([['key', 'value']]);
  }
  return sheet;
}

function setMeta_(ss, key, value) {
  var sheet = ensureMetaSheet_(ss);
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]) === key) {
      sheet.getRange(i + 1, 2).setValue(String(value));
      return;
    }
  }
  sheet.appendRow([key, String(value)]);
}

function getMeta_(ss, key) {
  var sheet = ss.getSheetByName(SHEET_NAMES.meta);
  if (!sheet) return null;
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]) === key) {
      var v = data[i][1];
      return v === '' || v === null || typeof v === 'undefined' ? null : String(v);
    }
  }
  return null;
}

function getOrRecreateSheet_(ss, name, index) {
  var existing = ss.getSheetByName(name);
  if (existing) ss.deleteSheet(existing);
  return ss.insertSheet(name, index);
}

function removeUnusedSheets_(ss) {
  var keep = {};
  keep[SHEET_NAMES.daily] = true;
  keep[SHEET_NAMES.phrases] = true;
  keep[SHEET_NAMES.vocab] = true;
  keep[SHEET_NAMES.pron] = true;
  keep[SHEET_NAMES.trans] = true;
  keep[SHEET_NAMES.tasks] = true;
  keep[SHEET_NAMES.tracker] = true;
  keep[SHEET_NAMES.weekly] = true;
  keep[SHEET_NAMES.today] = true;
  keep[SHEET_NAMES.meta] = true;
  var toDelete = ss.getSheets().filter(function (s) {
    return !keep[s.getName()];
  });
  toDelete.forEach(function (s) {
    if (ss.getSheets().length > 1) {
      try { ss.deleteSheet(s); } catch (e) {}
    }
  });
}

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

function applyTitleBlock_(sheet, cols, title, subtitle) {
  var lastCol = String.fromCharCode(64 + cols);
  sheet.getRange('A1:' + lastCol + '1').merge();
  sheet.getRange('A1')
    .setValue(title)
    .setFontFamily('Arial').setFontSize(16).setFontWeight('bold')
    .setFontColor(THEME.headerFg).setBackground(THEME.navy)
    .setVerticalAlignment('middle');
  sheet.setRowHeight(1, 42);

  sheet.getRange('A2:' + lastCol + '2').merge();
  sheet.getRange('A2')
    .setValue(subtitle)
    .setFontFamily('Arial').setFontSize(10).setFontColor('#334155')
    .setBackground(THEME.accentSoft).setVerticalAlignment('middle');
  sheet.setRowHeight(2, 28);
}

function styleHeaderRow_(sheet, row, headers) {
  sheet.getRange(row, 1, 1, headers.length)
    .setValues([headers])
    .setFontFamily('Arial').setFontSize(11).setFontWeight('bold')
    .setFontColor(THEME.headerFg).setBackground(THEME.slate)
    .setHorizontalAlignment('center').setVerticalAlignment('middle');
  sheet.setRowHeight(row, 28);
  sheet.setFrozenRows(row);
}

function styleStripedTable_(sheet, startRow, numRows, numCols, boldCol) {
  for (var i = 0; i < numRows; i++) {
    var r = startRow + i;
    sheet.getRange(r, 1, 1, numCols).setBackground(i % 2 === 0 ? '#FFFFFF' : THEME.rowOdd);
    if (boldCol) {
      sheet.getRange(r, boldCol).setFontWeight('bold').setFontColor(THEME.navy);
    }
  }
  sheet.getRange(startRow - 1, 1, numRows + 1, numCols)
    .setBorder(true, true, true, true, true, true, THEME.border, SpreadsheetApp.BorderStyle.SOLID);
}


// ================================================================
// DATA
// ================================================================
function getDailyData_() {
  return [
  { day: 1, level: 1, phrase: 'I am going to work.', context: 'Roz subah bolo jab office ke liye niklo.', hindi: 'Main kaam pe ja raha/rahi hoon.', word1: 'Articulate', meaning1: 'Clearly aur precisely bolna/likhna', example1: 'I need to articulate my approach better.', word2: 'Hesitate', meaning2: 'Rukna / der karna (doubt se)', example2: 'Do not hesitate to ask clarifying questions.', transHindi: 'Main kaam pe ja raha hoon. | Ye aasan hai.', transEnglish: 'I am going to work. | This is easy.', pronFocus: 'v vs w — Lips round for W, teeth+lip for V.', task: 'Aaj ka phrase mirror ke saamne 5 baar bolo, expression dekho.', mono: 'Apna subah ka routine 60 second mein batao.', listen: 'Shadow 2-3 min: v vs w words. https://www.youtube.com/results?search_query=v%20vs%20w%20pronunciation%20English%20practice%202%20minutes', grammar: 'a/an: consonant sound pe a, vowel sound pe an', grammarEx: 'a user / an update | a meeting / an hour', mistakeWrong: 'I am having a doubt.', mistakeRight: 'I have a doubt. / I have a question.', mistakeWhy: 'have + doubt/question (state), continuous mat use karo.', realUse: 'Slack pe aaj ka phrase use karke 1 short message likho/bolo: "I am going to work."' },
  { day: 2, level: 1, phrase: 'This is easy.', context: 'Jab koi simple kaam kar rahe ho.', hindi: 'Ye aasan hai.', word1: 'Assume', meaning1: 'Bina proof ke maan lena', example1: 'Let us not assume the API is idempotent.', word2: 'Clarify', meaning2: 'Saaf / clear karna', example2: 'Can you clarify the acceptance criteria?', transHindi: 'Mujhe ye pasand hai. | Kya aap meri madad kar sakte ho?', transEnglish: 'I like this. | Can you help me?', pronFocus: 'th (θ soft) — Tongue between teeth, soft air.', task: 'Aaj ke dono words use karke 3 sentences bolo.', mono: 'Kal ka sabse interesting kaam explain karo.', listen: 'Shadow 2-3 min: soft/voiced th. https://www.youtube.com/results?search_query=th%20sound%20pronunciation%20think%20thank%20this%20that', grammar: 'Simple present = habit/facts', grammarEx: 'I work from home on Fridays. | She reviews PRs daily.', mistakeWrong: 'I will do the needful.', mistakeRight: 'I will take care of it. / I will do what is needed.', mistakeWhy: 'do the needful Indian office phrase hai; natural English alag.', realUse: 'Standup mein aaj ka phrase zaroor daalo: "This is easy."' },
  { day: 3, level: 1, phrase: 'I like this.', context: 'Kisi cheez ko pasand karte waqt.', hindi: 'Mujhe ye pasand hai.', word1: 'Outline', meaning1: 'Sankshipt structure batana', example1: 'Let me outline the migration steps.', word2: 'Elaborate', meaning2: 'Zyada detail mein explain karna', example2: 'Could you elaborate on the edge cases?', transHindi: 'Mujhe ye nahi pata. | Ye mere liye mushkil hai.', transEnglish: 'I do not know this. | This is hard for me.', pronFocus: 'th (ð voiced) — Same tongue position, add voice.', task: 'Phone record: 30 second mein aaj ka topic explain karo.', mono: 'Favourite tool aur kyun — 60 second.', listen: 'Shadow 2-3 min: -ed endings. https://www.youtube.com/results?search_query=ed%20ending%20pronunciation%20worked%20played%20needed', grammar: 'Present continuous = abhi ho raha', grammarEx: 'I am debugging now. | We are shipping today.', mistakeWrong: 'Please revert on this.', mistakeRight: 'Please reply / get back to me.', mistakeWhy: 'revert = undo change; reply ke liye revert mat bolo.', realUse: 'Kisi colleague se help maangte waqt aaj ka phrase use karo: "I like this."' },
  { day: 4, level: 1, phrase: 'Can you help me?', context: 'Kisi se madad maangte waqt.', hindi: 'Kya aap meri madad kar sakte ho?', word1: 'Summarize', meaning1: 'Short mein jist nikalna', example1: 'Summarize the incident in two minutes.', word2: 'Emphasize', meaning2: 'Zor dena / highlight karna', example2: 'I want to emphasize the latency risk.', transHindi: 'Main phir se koshish karunga. | Ye kya hai?', transEnglish: 'I will try again. | What is this?', pronFocus: '-ed /t/ — After unvoiced sound → /t/.', task: 'Colleague/friend se aaj ka phrase real conversation mein use karo.', mono: 'Ek galti se kya seekha — short story.', listen: 'Shadow 2-3 min: soft R. https://www.youtube.com/results?search_query=American%20English%20R%20pronunciation%20practice', grammar: 'Past simple = finished time', grammarEx: 'I finished the task yesterday. | We deployed last week.', mistakeWrong: 'Prepone the meeting.', mistakeRight: 'Move the meeting earlier. / Reschedule to an earlier time.', mistakeWhy: 'prepone dictionary mein rare; earlier use karo.', realUse: 'Meeting mein ek baar aaj ka phrase naturally bolo: "Can you help me?"' },
  { day: 5, level: 1, phrase: 'I do not know this.', context: 'Jab kuch samajh na aaye.', hindi: 'Mujhe ye nahi pata.', word1: 'Acknowledge', meaning1: 'Maanna / accept karna', example1: 'I acknowledge the delay on my side.', word2: 'Rephrase', meaning2: 'Doosre words mein kehna', example2: 'Let me rephrase that more simply.', transHindi: 'Aaj main khush hoon. | Mujhe thoda aur time chahiye.', transEnglish: 'I am happy today. | I need more time.', pronFocus: '-ed /d/ — After voiced sound → /d/.', task: 'Word + phrase jodkar bina likhe chhota paragraph bolo.', mono: 'Agar aaj free ho to kya seekhoge?', listen: 'Shadow 2-3 min: short i vs ee. https://www.youtube.com/results?search_query=ship%20sheep%20bit%20beat%20pronunciation%20minimal%20pairs', grammar: 'Present perfect = past → now connection', grammarEx: 'I have fixed the bug. | Have you seen the doc?', mistakeWrong: 'I am agree.', mistakeRight: 'I agree.', mistakeWhy: 'agree verb hai — am agree nahi.', realUse: 'PR comment / review reply mein aaj ka idea English mein likho (phrase related).' },
  { day: 6, level: 1, phrase: 'This is hard for me.', context: 'Mushkil kaam ke baare mein.', hindi: 'Ye mere liye mushkil hai.', word1: 'Infer', meaning1: 'Hints se nateeja nikalna', example1: 'From the logs, I infer a race condition.', word2: 'Imply', meaning2: 'Seedha na kehke suggest karna', example2: 'The metrics imply a cache miss problem.', transHindi: 'Chalo ab shuru karte hain. | Maine ek galti ki.', transEnglish: 'Let us start now. | I made a mistake.', pronFocus: '-ed /ɪd/ — After t/d → extra syllable /ɪd/.', task: 'Kaam ka chhota update aaj ke phrase/word se bolo.', mono: 'Team mein help maangne ka tarika describe karo.', listen: 'Shadow 2-3 min: e vs a. https://www.youtube.com/results?search_query=pen%20pan%20men%20man%20pronunciation%20practice', grammar: 'will = future decision/promise', grammarEx: 'I will send the summary. | We will check tomorrow.', mistakeWrong: 'Myself Rohan.', mistakeRight: 'I am Rohan. / This is Rohan.', mistakeWhy: 'myself sirf emphasize/reflexive ke liye.', realUse: 'End-of-day update voice note: aaj ka phrase include karo — "This is hard for me."' },
  { day: 7, level: 1, phrase: 'I will try again.', context: 'Failure ke baad motivate karne ke liye.', hindi: 'Main phir se koshish karunga/karungi.', word1: 'Justify', meaning1: 'Reason dekar defend karna', example1: 'How would you justify this design choice?', word2: 'Evaluate', meaning2: 'Jaanch kar ke behtari decide karna', example2: 'We evaluated three caching options.', transHindi: 'Ye theek lagta hai. | Mujhe sure nahi hai.', transEnglish: 'That sounds good. | I am not sure.', pronFocus: 'r (American soft) — Light touch, do not roll heavily.', task: 'Intro do aur aaj ka phrase zaroor daalo.', mono: 'Ek meeting jo waste lagi — kyun, aur better kaise?', listen: 'Shadow 2-3 min: word stress. https://www.youtube.com/results?search_query=English%20word%20stress%20practice%20computer%20important', grammar: 'going to = planned future', grammarEx: 'I am going to refactor this. | We are going to sync at 3.', mistakeWrong: 'What is your good name?', mistakeRight: 'What is your name?', mistakeWhy: 'good name unnatural lagta hai.', realUse: 'Calendar invite note / agenda line mein aaj ka word/phrase touch karo.' },
  { day: 8, level: 1, phrase: 'What is this?', context: 'Naye object/concept ke baare mein poochte waqt.', hindi: 'Ye kya hai?', word1: 'Assess', meaning1: 'Andaza / assessment lena', example1: 'Assess the blast radius before rolling out.', word2: 'Anticipate', meaning2: 'Pehle se expect karna', example2: 'I anticipate higher load during the sale.', transHindi: 'Main check karta hoon. | Please ek minute rukna.', transEnglish: 'Let me check. | Please wait a minute.', pronFocus: 'short i vs ee — i = short, ee = long smile.', task: 'Aaj ka phrase mirror ke saamne 5 baar bolo, expression dekho.', mono: 'Apna strongest skill + ek example.', listen: 'Shadow 2-3 min: linking. https://www.youtube.com/results?search_query=English%20linking%20sounds%20connected%20speech%20practice', grammar: 'can = ability/permission', grammarEx: 'I can help after lunch. | Can you clarify the scope?', mistakeWrong: 'Kindly do the needful ASAP.', mistakeRight: 'Please take care of this as soon as you can.', mistakeWhy: 'kindly + needful + ASAP overload; simple bolo.', realUse: 'Slack pe aaj ka phrase use karke 1 short message likho/bolo: "What is this?"' },
  { day: 9, level: 1, phrase: 'I am happy today.', context: 'Din ke start mein mood bolo.', hindi: 'Aaj main khush hoon.', word1: 'Overlook', meaning1: 'Chhod dena / miss karna', example1: 'We overlooked a null-check in validation.', word2: 'Underestimate', meaning2: 'Kam aakna', example2: 'Do not underestimate migration complexity.', transHindi: 'Maine apna kaam khatam kar liya. | Aap kaise ho?', transEnglish: 'I finished my work. | How are you?', pronFocus: 'short e vs a — Open mouth more for /æ/.', task: 'Aaj ke dono words use karke 3 sentences bolo.', mono: 'Weak area aur improve plan.', listen: 'Shadow 2-3 min: schwa /ə/. https://www.youtube.com/results?search_query=schwa%20sound%20English%20pronunciation%20about%20support', grammar: 'could = polite request', grammarEx: 'Could you review this PR? | Could we park this?', mistakeWrong: 'I have a confusion.', mistakeRight: 'I am confused. / I am unclear about this.', mistakeWhy: 'confusion noun theek, lekin I am confused natural.', realUse: 'Standup mein aaj ka phrase zaroor daalo: "I am happy today."' },
  { day: 10, level: 1, phrase: 'I need more time.', context: 'Deadline mangte waqt.', hindi: 'Mujhe thoda aur time chahiye.', word1: 'Overestimate', meaning1: 'Zyada aakna', example1: 'We overestimated how fast we could ship.', word2: 'Compromise', meaning2: 'Compromise / beech ka raasta', example2: 'We had to compromise on some polish.', transHindi: 'Aapse milkar khushi hui. | Main English seekh raha hoon.', transEnglish: 'Nice to meet you. | I am learning English.', pronFocus: 'p/b/t/d endings — Finish the last consonant clearly.', task: 'Phone record: 30 second mein aaj ka topic explain karo.', mono: 'Dream project kya hota agar full freedom milti.', listen: 'Shadow 2-3 min: rise/fall. https://www.youtube.com/results?search_query=English%20intonation%20questions%20vs%20statements', grammar: 'should = advice', grammarEx: 'You should add tests. | We should clarify requirements.', mistakeWrong: 'Out of station.', mistakeRight: 'Out of town. / Traveling.', mistakeWhy: 'station travel ke liye out of town better.', realUse: 'Kisi colleague se help maangte waqt aaj ka phrase use karo: "I need more time."' },
  { day: 11, level: 1, phrase: 'Let us start now.', context: 'Kaam shuru karte waqt.', hindi: 'Chalo ab shuru karte hain.', word1: 'Negotiate', meaning1: 'Baatcheet se terms fix karna', example1: 'I negotiated a smaller scope for v1.', word2: 'Persuade', meaning2: 'Manana', example2: 'I persuaded the team to add monitoring first.', transHindi: 'Kya aap phir se bol sakte ho? | Ab mujhe samajh aa gaya.', transEnglish: 'Can you say that again? | I understand now.', pronFocus: 'silent letters — Do not pronounce silent letters.', task: 'Colleague/friend se aaj ka phrase real conversation mein use karo.', mono: 'Code review mein kya dekhte ho?', listen: 'Listen 2-3 min: pick any short episode, shadow 1 line. https://www.youtube.com/results?search_query=BBC%20Learning%20English%206%20Minute%20English', grammar: 'must / have to = necessity', grammarEx: 'I have to leave at 6. | We must fix the outage.', mistakeWrong: 'Passed out from college.', mistakeRight: 'Graduated from college.', mistakeWhy: 'passed out = faint; graduate use karo.', realUse: 'Meeting mein ek baar aaj ka phrase naturally bolo: "Let us start now."' },
  { day: 12, level: 1, phrase: 'I made a mistake.', context: 'Galti maanne ke liye.', hindi: 'Maine ek galti ki.', word1: 'Discourage', meaning1: 'Himmat todna / rokna', example1: 'Lack of tests discourages refactors.', word2: 'Encourage', meaning2: 'Protshahan dena', example2: 'Code reviews encourage better design.', transHindi: 'Bahut shukriya. | Deri ke liye maafi.', transEnglish: 'Thank you so much. | Sorry for the delay.', pronFocus: 'word stress — Stress the correct syllable.', task: 'Word + phrase jodkar bina likhe chhota paragraph bolo.', mono: 'Production bug aaye to pehle 3 steps kya?', listen: 'Shadow 2-3 min: clarity over speed. https://www.youtube.com/results?search_query=English%20speaking%20slow%20and%20clear%20practice', grammar: 'don\'t have to ≠ must not', grammarEx: 'You don\'t have to join. | You must not share secrets.', mistakeWrong: 'I will intimate you.', mistakeRight: 'I will inform you. / I will let you know.', mistakeWhy: 'intimate different meaning; inform better.', realUse: 'PR comment / review reply mein aaj ka idea English mein likho (phrase related).' },
  { day: 13, level: 1, phrase: 'That sounds good.', context: 'Idea approve karte waqt.', hindi: 'Ye theek lagta hai.', word1: 'Contribute', meaning1: 'Yogdaan dena', example1: 'I contributed to the design doc.', word2: 'Coordinate', meaning2: 'Milakar timing/work set karna', example2: 'I coordinated with QA on the release.', transHindi: 'Main baad mein call karta hoon. | Main kahan baithoon?', transEnglish: 'I will call you later. | Where should I sit?', pronFocus: 'sentence stress — Stress content words, soften small words.', task: 'Kaam ka chhota update aaj ke phrase/word se bolo.', mono: 'Naya teammate onboard kaise karoge?', listen: 'Listen 2-3 min: pause instead of um. https://www.youtube.com/results?search_query=filler%20words%20um%20uh%20how%20to%20pause%20English%20speaking', grammar: 'there is / there are', grammarEx: 'There is a bug in login. | There are two options.', mistakeWrong: 'Today morning.', mistakeRight: 'This morning.', mistakeWhy: 'this morning / tonight — today morning avoid.', realUse: 'End-of-day update voice note: aaj ka phrase include karo — "That sounds good."' },
  { day: 14, level: 1, phrase: 'I am not sure.', context: 'Doubt hone par honestly.', hindi: 'Mujhe sure nahi hai.', word1: 'Facilitate', meaning1: 'Aasaan banana / help karna', example1: 'I facilitated the grooming session.', word2: 'Initiate', meaning2: 'Shuru karna (formal)', example2: 'I initiated the postmortem discussion.', transHindi: 'Kya ye sahi hai? | Main taiyaar hoon.', transEnglish: 'Is this correct? | I am ready.', pronFocus: 'linking sounds — Link final consonant to next vowel.', task: 'Intro do aur aaj ka phrase zaroor daalo.', mono: 'Focus kaise protect karte ho deep work ke liye?', listen: 'Shadow 2-3 min: standup phrases. https://www.youtube.com/results?search_query=standup%20meeting%20English%20phrases%20practice', grammar: 'much / many', grammarEx: 'How much time do we need? | How many tickets are open?', mistakeWrong: 'Discuss about the plan.', mistakeRight: 'Discuss the plan.', mistakeWhy: 'discuss ke baad about nahi.', realUse: 'Calendar invite note / agenda line mein aaj ka word/phrase touch karo.' },
  { day: 15, level: 1, phrase: 'Let me check.', context: 'Verify karne se pehle.', hindi: 'Main check karta/karti hoon.', word1: 'Resume', meaning1: 'Phir se shuru karna', example1: 'We can resume the rollout after the fix.', word2: 'Postpone', meaning2: 'Baad mein shift karna', example2: 'Let us postpone the release by a day.', transHindi: 'Please dheere bolo. | Aapka din accha rahe.', transEnglish: 'Please speak slowly. | Have a good day.', pronFocus: 'schwa /ə/ — Unstressed vowels become soft uh.', task: 'Aaj ka phrase mirror ke saamne 5 baar bolo, expression dekho.', mono: 'Documentation kyun important hai — example ke saath.', listen: 'Shadow 2-3 min: meeting English. https://www.youtube.com/results?search_query=English%20for%20work%20meetings%20polite%20phrases', grammar: 'some / any', grammarEx: 'I need some context. | Do you have any blockers?', mistakeWrong: 'I am not getting you.', mistakeRight: 'I don\'t understand you. / Could you repeat?', mistakeWhy: 'getting you informal/unclear.', realUse: 'Slack pe aaj ka phrase use karke 1 short message likho/bolo: "Let me check."' },
  { day: 16, level: 1, phrase: 'Please wait a minute.', context: 'Thoda time maangte waqt.', hindi: 'Please ek minute rukna.', word1: 'Prioritize', meaning1: 'Pehle kya — order dena', example1: 'I prioritized customer-facing bugs.', word2: 'Delegate', meaning2: 'Kaam kisi aur ko dena', example2: 'I delegated the UI polish to a teammate.', transHindi: 'Mujhe pani chahiye. | Ye mera desk hai.', transEnglish: 'I need water. | This is my desk.', pronFocus: 'l vs r — Tongue tip up for L, curl for R.', task: 'Aaj ke dono words use karke 3 sentences bolo.', mono: 'Remote collaboration tip jo aap use karte ho.', listen: 'Shadow 2-3 min: interview answer. https://www.youtube.com/results?search_query=job%20interview%20English%20answers%20STAR%20method%20short', grammar: 'in / on / at (time)', grammarEx: 'on Monday / at 3 PM / in June | I will call at noon.', mistakeWrong: 'Do one thing.', mistakeRight: 'Here is an idea. / Can we try this?', mistakeWhy: 'do one thing filler hai; direct bolo.', realUse: 'Standup mein aaj ka phrase zaroor daalo: "Please wait a minute."' },
  { day: 17, level: 1, phrase: 'I finished my work.', context: 'Kaam khatam hone par.', hindi: 'Maine apna kaam khatam kar liya.', word1: 'Supervise', meaning1: 'Dekh-bhaal karna', example1: 'I supervised the junior on the first PR.', word2: 'Validate', meaning2: 'Sahi hai ya nahi check karna', example2: 'Validate the assumption with a prototype.', transHindi: 'Meeting kab hai? | Main thoda late hoon.', transEnglish: 'When is the meeting? | I am a little late.', pronFocus: 'f vs p — F = teeth on lip, P = lips together.', task: 'Phone record: 30 second mein aaj ka topic explain karo.', mono: 'Interview mein nervousness kaise handle karte ho?', listen: 'Shadow 2-3 min: technical explain. https://www.youtube.com/results?search_query=explain%20a%20bug%20English%20speaking%20practice', grammar: 'in / on / at (place)', grammarEx: 'in the office / on the call / at my desk | Meet me at the lobby.', mistakeWrong: 'Only I am saying...', mistakeRight: 'I am just saying... / What I mean is...', mistakeWhy: 'only placement awkward ho sakta.', realUse: 'Kisi colleague se help maangte waqt aaj ka phrase use karo: "I finished my work."' },
  { day: 18, level: 1, phrase: 'How are you?', context: 'Greeting mein.', hindi: 'Aap kaise ho?', word1: 'Verify', meaning1: 'Confirm / double-check karna', example1: 'Verify the fix on staging first.', word2: 'Inspect', meaning2: 'Bariq se dekhna', example2: 'Inspect the slow query plan carefully.', transHindi: 'Door band kar do. | Laptop charge karna hai.', transEnglish: 'Please close the door. | I need to charge my laptop.', pronFocus: 's vs sh — sh = lips forward, softer.', task: 'Colleague/friend se aaj ka phrase real conversation mein use karo.', mono: 'Ek decision jisme trade-off tha — batao.', listen: 'Shadow 2-3 min: easy conversation. https://www.youtube.com/results?search_query=daily%20English%20conversation%20practice%20for%20beginners', grammar: 'for / since', grammarEx: 'for 2 hours / since morning | I have been stuck since 10.', mistakeWrong: 'It is very much important.', mistakeRight: 'It is very important.', mistakeWhy: 'very much yahan mat lagao.', realUse: 'Meeting mein ek baar aaj ka phrase naturally bolo: "How are you?"' },
  { day: 19, level: 1, phrase: 'Nice to meet you.', context: 'Pehli mulakat mein.', hindi: 'Aapse milkar khushi hui.', word1: 'Diagnose', meaning1: 'Problem ki wajah dhundhna', example1: 'I diagnosed a memory leak in the worker.', word2: 'Resolve', meaning2: 'Hal nikalna', example2: 'We resolved the merge conflicts today.', transHindi: 'Wifi slow hai. | Message mil gaya.', transEnglish: 'The wifi is slow. | I got the message.', pronFocus: 'z sound — Buzz the z, do not make it s.', task: 'Word + phrase jodkar bina likhe chhota paragraph bolo.', mono: 'Customer complaint aaye to soft skills kaise use?', listen: 'Shadow 2-3 min: follow-up phrases. https://www.youtube.com/results?search_query=office%20English%20phrases%20I%20will%20follow%20up', grammar: 'because / so', grammarEx: 'It failed because of timeout. | It was late, so we rolled back.', mistakeWrong: 'I request you to please...', mistakeRight: 'Could you please...?', mistakeWhy: 'request you to please double polite unnatural.', realUse: 'PR comment / review reply mein aaj ka idea English mein likho (phrase related).' },
  { day: 20, level: 1, phrase: 'I am learning English.', context: 'Apna goal batate waqt.', hindi: 'Main English seekh raha/rahi hoon.', word1: 'Address', meaning1: 'Issue pe kaam / jawab dena', example1: 'How did you address the scalability concern?', word2: 'Tackle', meaning2: 'Nibhana / face karna', example2: 'I tackled the flaky tests first.', transHindi: 'Kal milte hain. | Main ghar ja raha hoon.', transEnglish: 'See you tomorrow. | I am going home.', pronFocus: 'ng ending — Keep the soft ng at the end.', task: 'Kaam ka chhota update aaj ke phrase/word se bolo.', mono: 'English practice ka aaj ka goal kya hai?', listen: 'Shadow 2-3 min: silent letters. https://www.youtube.com/results?search_query=English%20pronunciation%20silent%20letters%20honest%20hour', grammar: 'although / however', grammarEx: 'Although it is hard, I will try. | It works; however, it is slow.', mistakeWrong: 'Update me the status.', mistakeRight: 'Update me on the status. / Send me a status update.', mistakeWhy: 'update me on X.', realUse: 'End-of-day update voice note: aaj ka phrase include karo — "I am learning English."' },
  { day: 21, level: 1, phrase: 'Can you say that again?', context: 'Jab clearly na suna ho.', hindi: 'Kya aap phir se bol sakte ho?', word1: 'Navigate', meaning1: 'Mushkil situation sambhalna', example1: 'I navigated conflicting stakeholder needs.', word2: 'Adapt', meaning2: 'Badalte hisaab se dhalna', example2: 'I adapt quickly to new codebases.', transHindi: 'Lunch break kab hai? | Mujhe coffee chahiye.', transEnglish: 'When is the lunch break? | I need coffee.', pronFocus: 'minimal: beach/bitch — Smile longer for ee.', task: 'Intro do aur aaj ka phrase zaroor daalo.', mono: 'Books vs videos — aap kaise seekhte ho?', listen: 'Shadow 2-3 min: L vs R. https://www.youtube.com/results?search_query=L%20vs%20R%20pronunciation%20practice%20light%20right', grammar: 'if + present, will...', grammarEx: 'If it fails, I will retry. | If you are free, we can sync.', mistakeWrong: 'I am having 5 years experience.', mistakeRight: 'I have 5 years of experience.', mistakeWhy: 'have experience — continuous nahi.', realUse: 'Calendar invite note / agenda line mein aaj ka word/phrase touch karo.' },
  { day: 22, level: 1, phrase: 'I understand now.', context: 'Samajh aa jane par.', hindi: 'Ab mujhe samajh aa gaya.', word1: 'Iterate', meaning1: 'Baar-baar improve karna', example1: 'We iterated on the UX based on feedback.', word2: 'Refine', meaning2: 'Aur behtar banana', example2: 'Refine the error messages for users.', transHindi: 'Ye file open nahi ho rahi. | Password galat hai.', transEnglish: 'This file is not opening. | The password is wrong.', pronFocus: 'minimal: walk/work — work = er sound, walk = aw.', task: 'Aaj ka phrase mirror ke saamne 5 baar bolo, expression dekho.', mono: 'Health + work balance short take.', listen: 'Shadow 2-3 min: F vs P. https://www.youtube.com/results?search_query=F%20vs%20P%20pronunciation%20coffee%20copy', grammar: 'countable vs uncountable', grammarEx: 'two tasks / some information | advice (not advices)', mistakeWrong: 'He told that he is free.', mistakeRight: 'He said that he is free. / He told me that...', mistakeWhy: 'tell needs object (told me).', realUse: 'Slack pe aaj ka phrase use karke 1 short message likho/bolo: "I understand now."' },
  { day: 23, level: 1, phrase: 'Thank you so much.', context: 'Shukriya karte waqt.', hindi: 'Bahut shukriya.', word1: 'Simplify', meaning1: 'Simple banana', example1: 'Simplify the API surface for clients.', word2: 'Streamline', meaning2: 'Process ko seedha/efficient banana', example2: 'We streamlined the onboarding checklist.', transHindi: 'Main busy hoon. | Thoda wait karo.', transEnglish: 'I am busy. | Please wait a bit.', pronFocus: 'ask /ɑːsk/ vs /æsk/ — Pick one accent and stay consistent.', task: 'Aaj ke dono words use karke 3 sentences bolo.', mono: 'Favourite programming concept simple words mein.', listen: 'Shadow 2-3 min: s vs sh. https://www.youtube.com/results?search_query=S%20vs%20SH%20pronunciation%20see%20she', grammar: 'this / that / these / those', grammarEx: 'This bug is new. | Those logs look old.', mistakeWrong: 'Close the call.', mistakeRight: 'End the call. / Hang up.', mistakeWhy: 'end the call more natural.', realUse: 'Standup mein aaj ka phrase zaroor daalo: "Thank you so much."' },
  { day: 24, level: 1, phrase: 'Sorry for the delay.', context: 'Late hone par.', hindi: 'Deri ke liye maafi.', word1: 'Consolidate', meaning1: 'Ek jagah jodna', example1: 'Consolidate duplicate config files.', word2: 'Distinguish', meaning2: 'Faraq samajhna', example2: 'Distinguish symptoms from root cause.', transHindi: 'Samajh nahi aaya. | Phir se try karo.', transEnglish: 'I did not understand. | Try again.', pronFocus: 'schedule — US: SKED-jool is common in tech.', task: 'Phone record: 30 second mein aaj ka topic explain karo.', mono: 'Agar mentor banoge to pehli advice kya?', listen: 'Shadow 2-3 min: pause at commas. https://www.youtube.com/results?search_query=English%20chunking%20pauses%20speak%20clearly', grammar: 'Comparatives', grammarEx: 'faster than / more scalable than | This is clearer than before.', mistakeWrong: 'Share your screen share.', mistakeRight: 'Please share your screen.', mistakeWhy: 'screen share dobara mat bolo.', realUse: 'Kisi colleague se help maangte waqt aaj ka phrase use karo: "Sorry for the delay."' },
  { day: 25, level: 1, phrase: 'I will call you later.', context: 'Baad mein baat karne ke liye.', hindi: 'Main baad mein call karta/karti hoon.', word1: 'Demonstrate', meaning1: 'Dikha ke prove karna', example1: 'Demonstrate the bug with a repro script.', word2: 'Illustrate', meaning2: 'Example se samjhana', example2: 'Illustrate the flow with a sequence diagram.', transHindi: 'Ye important hai. | Main free hoon.', transEnglish: 'This is important. | I am free.', pronFocus: 'data — Both OK — stay consistent in one talk.', task: 'Colleague/friend se aaj ka phrase real conversation mein use karo.', mono: 'System slow ho to kaise debug start?', listen: 'Listen 2-3 min: tense contrast (optional). https://www.youtube.com/results?search_query=present%20perfect%20vs%20past%20simple%20English%20explanation%20short', grammar: 'Superlatives', grammarEx: 'the fastest / the most important | This is the main risk.', mistakeWrong: 'I am on leave from tomorrow.', mistakeRight: 'I am on leave starting tomorrow. / I will be on leave from tomorrow.', mistakeWhy: 'starting tomorrow clear.', realUse: 'Meeting mein ek baar aaj ka phrase naturally bolo: "I will call you later."' },
  { day: 26, level: 1, phrase: 'Where should I sit?', context: 'Meeting room mein.', hindi: 'Main kahan baithoon?', word1: 'Convey', meaning1: 'Baat pahunchana', example1: 'I conveyed the risk to product clearly.', word2: 'Express', meaning2: 'Apni baat kehna', example2: 'Express disagreement politely in the review.', transHindi: 'Call cut ho gaya. | Screen share karo.', transEnglish: 'The call got disconnected. | Please share your screen.', pronFocus: 'route — In networking, root is common.', task: 'Word + phrase jodkar bina likhe chhota paragraph bolo.', mono: 'Feature ship karne se pehle checklist bolo.', listen: 'Listen 2-3 min: articles. https://www.youtube.com/results?search_query=articles%20a%20an%20the%20English%20short%20lesson', grammar: 'Passive (simple)', grammarEx: 'The bug was fixed. | The PR was approved.', mistakeWrong: 'Doubt clearance session.', mistakeRight: 'Q&A session. / Clarification session.', mistakeWhy: 'doubt clearance Indian-campus tone.', realUse: 'PR comment / review reply mein aaj ka idea English mein likho (phrase related).' },
  { day: 27, level: 1, phrase: 'Is this correct?', context: 'Confirm karte waqt.', hindi: 'Kya ye sahi hai?', word1: 'Interpret', meaning1: 'Matlab nikalna', example1: 'How do you interpret these latency spikes?', word2: 'Perceive', meaning2: 'Mahsoos / dekhna', example2: 'Users perceive the app as slow.', transHindi: 'Mute pe ho tum? | Camera on karo.', transEnglish: 'Are you on mute? | Please turn on the camera.', pronFocus: 'intonation up/down — Questions often rise; statements fall.', task: 'Kaam ka chhota update aaj ke phrase/word se bolo.', mono: 'Conflict teammate se — professionally resolve kaise?', listen: 'Listen 2-3 min: in/on/at. https://www.youtube.com/results?search_query=prepositions%20in%20on%20at%20English%20short', grammar: 'Reported speech (basic)', grammarEx: 'He said he was blocked. | She asked if I was free.', mistakeWrong: 'Please find the attached.', mistakeRight: 'Please find the attachment. / Attached is the file.', mistakeWhy: 'find attached / attachment.', realUse: 'End-of-day update voice note: aaj ka phrase include karo — "Is this correct?"' },
  { day: 28, level: 1, phrase: 'I am ready.', context: 'Shuru hone ke liye.', hindi: 'Main taiyaar hoon.', word1: 'Recognize', meaning1: 'Pehchanna / maanna', example1: 'I recognize this was a process failure.', word2: 'Recall', meaning2: 'Yaad karna', example2: 'I recall we hit this bug last quarter.', transHindi: 'Link bhej do. | Notes le lo.', transEnglish: 'Please send the link. | Please take notes.', pronFocus: 'chunking pauses — Pause at commas and idea breaks.', task: 'Intro do aur aaj ka phrase zaroor daalo.', mono: 'Success metric for today\'s practice.', listen: 'Shadow 2-3 min: polite requests. https://www.youtube.com/results?search_query=English%20email%20phrases%20could%20you%20please', grammar: 'Question forms', grammarEx: 'What is the impact? | Where should I start?', mistakeWrong: 'I will check and revert.', mistakeRight: 'I will check and get back to you.', mistakeWhy: 'get back to you natural.', realUse: 'Calendar invite note / agenda line mein aaj ka word/phrase touch karo.' },
  { day: 29, level: 1, phrase: 'Please speak slowly.', context: 'Samajhne ke liye request.', hindi: 'Please dheere bolo.', word1: 'Retain', meaning1: 'Yaad / rakh ke rakhna', example1: 'Retain the feature flag for two weeks.', word2: 'Omit', meaning2: 'Chhod dena (jaan-bujh ke)', example2: 'Omit optional fields from the payload.', transHindi: 'Main agree karta hoon. | Main disagree karta hoon.', transEnglish: 'I agree. | I disagree.', pronFocus: 'filler control — Replace um with a short pause.', task: 'Aaj ka phrase mirror ke saamne 5 baar bolo, expression dekho.', mono: 'Ek open-source tool jo pasand hai — kyun?', listen: 'Shadow 2-3 min: call English. https://www.youtube.com/results?search_query=English%20phone%20call%20phrases%20can%20you%20hear%20me', grammar: 'Tag questions (light)', grammarEx: 'It is ready, right? | You can join, can\'t you?', mistakeWrong: 'Lakh of users.', mistakeRight: 'Hundreds of thousands of users. / About 100,000 users.', mistakeWhy: 'international audience ke liye numbers clear.', realUse: 'Slack pe aaj ka phrase use karke 1 short message likho/bolo: "Please speak slowly."' },
  { day: 30, level: 1, phrase: 'Have a good day.', context: 'Din ke end mein.', hindi: 'Aapka din accha rahe.', word1: 'Exclude', meaning1: 'Bahar rakhna', example1: 'Exclude staging traffic from the alert.', word2: 'Include', meaning2: 'Shamil karna', example2: 'Include rollback steps in the runbook.', transHindi: 'Ye idea accha hai. | Aaj kaam zyada hai.', transEnglish: 'This idea is good. | I have a lot of work today.', pronFocus: 'clarity over speed — Clarity pehle, speed baad mein.', task: 'Aaj ke dono words use karke 3 sentences bolo.', mono: '30 din baad English mein kya better hona chahiye?', listen: 'Shadow 2-3 min: tech vocab. https://www.youtube.com/results?search_query=tech%20English%20vocabulary%20scalable%20optimize%20short', grammar: 'Articles with roles', grammarEx: 'I am a developer. | She is the owner of this module.', mistakeWrong: 'Pin code.', mistakeRight: 'ZIP code (US) / postal code', mistakeWhy: 'audience ke hisaab se postal/ZIP.', realUse: 'Standup mein aaj ka phrase zaroor daalo: "Have a good day."' },
  { day: 31, level: 2, phrase: 'I think this will work.', context: 'Opinion dete waqt confidently.', hindi: 'Mujhe lagta hai ye kaam karega.', word1: 'Escalate', meaning1: 'Upar / serious channel pe le jana', example1: 'Escalate if the outage crosses 15 minutes.', word2: 'Bandwidth', meaning2: 'Time/capacity jo available ho', example2: 'I do not have bandwidth for a new project.', transHindi: 'Mujhe lagta hai ye kaam karega. | Main jaldi se explain karta hoon.', transEnglish: 'I think this will work. | Let me explain this quickly.', pronFocus: 'v vs w — Lips round for W, teeth+lip for V.', task: 'Phone record: 30 second mein aaj ka topic explain karo.', mono: 'Apna subah ka routine 60 second mein batao.', listen: 'Shadow 2-3 min: v vs w words. https://www.youtube.com/results?search_query=v%20vs%20w%20pronunciation%20English%20practice%202%20minutes', grammar: 'a/an: consonant sound pe a, vowel sound pe an', grammarEx: 'a user / an update | a meeting / an hour', mistakeWrong: 'I am having a doubt.', mistakeRight: 'I have a doubt. / I have a question.', mistakeWhy: 'have + doubt/question (state), continuous mat use karo.', realUse: 'Kisi colleague se help maangte waqt aaj ka phrase use karo: "I think this will work."' },
  { day: 32, level: 2, phrase: 'Let me explain this quickly.', context: 'Samjhane se pehle.', hindi: 'Main jaldi se explain karta/karti hoon.', word1: 'Stakeholder', meaning1: 'Jiska interest/asar ho', example1: 'Align stakeholders before changing scope.', word2: 'Nuance', meaning2: 'Fine difference / bariq baat', example2: 'There is a nuance between latency and lag.', transHindi: 'Sure nahi, check karke batata hoon. | Ye baat samajh aa gayi.', transEnglish: 'I am not sure, let me check and get back to you. | That makes sense.', pronFocus: 'th (θ soft) — Tongue between teeth, soft air.', task: 'Colleague/friend se aaj ka phrase real conversation mein use karo.', mono: 'Kal ka sabse interesting kaam explain karo.', listen: 'Shadow 2-3 min: soft/voiced th. https://www.youtube.com/results?search_query=th%20sound%20pronunciation%20think%20thank%20this%20that', grammar: 'Simple present = habit/facts', grammarEx: 'I work from home on Fridays. | She reviews PRs daily.', mistakeWrong: 'I will do the needful.', mistakeRight: 'I will take care of it. / I will do what is needed.', mistakeWhy: 'do the needful Indian office phrase hai; natural English alag.', realUse: 'Meeting mein ek baar aaj ka phrase naturally bolo: "Let me explain this quickly."' },
  { day: 33, level: 2, phrase: 'I am not sure, let me check and get back to you.', context: 'Jab turant answer na ho.', hindi: 'Sure nahi, check karke aapko batata/batati hoon.', word1: 'Proactive', meaning1: 'Problem aane se pehle action', example1: 'Be proactive about flagging risks early.', word2: 'Reactive', meaning2: 'Problem ke baad react karna', example2: 'We were too reactive during the incident.', transHindi: 'Please phir se bolna. | Iske baare mein ek sawaal hai.', transEnglish: 'Can you repeat that, please? | I have a question about this.', pronFocus: 'th (ð voiced) — Same tongue position, add voice.', task: 'Word + phrase jodkar bina likhe chhota paragraph bolo.', mono: 'Favourite tool aur kyun — 60 second.', listen: 'Shadow 2-3 min: -ed endings. https://www.youtube.com/results?search_query=ed%20ending%20pronunciation%20worked%20played%20needed', grammar: 'Present continuous = abhi ho raha', grammarEx: 'I am debugging now. | We are shipping today.', mistakeWrong: 'Please revert on this.', mistakeRight: 'Please reply / get back to me.', mistakeWhy: 'revert = undo change; reply ke liye revert mat bolo.', realUse: 'PR comment / review reply mein aaj ka idea English mein likho (phrase related).' },
  { day: 34, level: 2, phrase: 'That makes sense.', context: 'Jab baat samajh aa jaye.', hindi: 'Ye baat samajh aa gayi.', word1: 'Actionable', meaning1: 'Jispe seedha kaam ho sake', example1: 'Give actionable feedback in the review.', word2: 'Blocker', meaning2: 'Jo aage badhne se roke', example2: 'My only blocker is the missing API key.', transHindi: 'Isi approach pe chalte hain. | Main iska dhyan rakhunga.', transEnglish: 'Let us go with this approach. | I will take care of it.', pronFocus: '-ed /t/ — After unvoiced sound → /t/.', task: 'Kaam ka chhota update aaj ke phrase/word se bolo.', mono: 'Ek galti se kya seekha — short story.', listen: 'Shadow 2-3 min: soft R. https://www.youtube.com/results?search_query=American%20English%20R%20pronunciation%20practice', grammar: 'Past simple = finished time', grammarEx: 'I finished the task yesterday. | We deployed last week.', mistakeWrong: 'Prepone the meeting.', mistakeRight: 'Move the meeting earlier. / Reschedule to an earlier time.', mistakeWhy: 'prepone dictionary mein rare; earlier use karo.', realUse: 'End-of-day update voice note: aaj ka phrase include karo — "That makes sense."' },
  { day: 35, level: 2, phrase: 'Can you repeat that, please?', context: 'Clearly sunai na de.', hindi: 'Please phir se bolna.', word1: 'Dependency', meaning1: 'Dusri cheez pe nirbhar', example1: 'We have a dependency on the auth team.', word2: 'Deliverable', meaning2: 'Jo deliver karna hai', example2: 'The deliverable is a design doc by Friday.', transHindi: 'Ye thoda alag hai jo socha tha. | Kya ek example de sakte ho?', transEnglish: 'This is a bit different from what I expected. | Could you give me an example?', pronFocus: '-ed /d/ — After voiced sound → /d/.', task: 'Intro do aur aaj ka phrase zaroor daalo.', mono: 'Agar aaj free ho to kya seekhoge?', listen: 'Shadow 2-3 min: short i vs ee. https://www.youtube.com/results?search_query=ship%20sheep%20bit%20beat%20pronunciation%20minimal%20pairs', grammar: 'Present perfect = past → now connection', grammarEx: 'I have fixed the bug. | Have you seen the doc?', mistakeWrong: 'I am agree.', mistakeRight: 'I agree.', mistakeWhy: 'agree verb hai — am agree nahi.', realUse: 'Calendar invite note / agenda line mein aaj ka word/phrase touch karo.' },
  { day: 36, level: 2, phrase: 'I have a question about this.', context: 'Meeting mein doubt clear karte waqt.', hindi: 'Iske baare mein ek sawaal hai.', word1: 'Milestone', meaning1: 'Bada checkpoint', example1: 'We hit the beta milestone this week.', word2: 'Timeline', meaning2: 'Kab-tak ka plan', example2: 'Share a realistic timeline for the rewrite.', transHindi: 'Zyadatar agree, lekin ek concern hai. | Agle point pe chalte hain.', transEnglish: 'I agree with most of this, but I have one concern. | Let us move on to the next point.', pronFocus: '-ed /ɪd/ — After t/d → extra syllable /ɪd/.', task: 'Aaj ka phrase mirror ke saamne 5 baar bolo, expression dekho.', mono: 'Team mein help maangne ka tarika describe karo.', listen: 'Shadow 2-3 min: e vs a. https://www.youtube.com/results?search_query=pen%20pan%20men%20man%20pronunciation%20practice', grammar: 'will = future decision/promise', grammarEx: 'I will send the summary. | We will check tomorrow.', mistakeWrong: 'Myself Rohan.', mistakeRight: 'I am Rohan. / This is Rohan.', mistakeWhy: 'myself sirf emphasize/reflexive ke liye.', realUse: 'Slack pe aaj ka phrase use karke 1 short message likho/bolo: "I have a question about this."' },
  { day: 37, level: 2, phrase: 'Let us go with this approach.', context: 'Decision finalize karte waqt.', hindi: 'Chalo isi approach pe chalte hain.', word1: 'Bandwidth-constrained', meaning1: 'Time/people kam hone ki wajah se limited', example1: 'We are bandwidth-constrained this sprint.', word2: 'Tradeoff', meaning2: 'Ek fayda vs doosra nuksaan', example2: 'Explain the tradeoff of caching aggressively.', transHindi: 'Is madad ke liye shukriya. | Kal tak follow-up karta hoon.', transEnglish: 'I appreciate your help with this. | I will follow up on this by tomorrow.', pronFocus: 'r (American soft) — Light touch, do not roll heavily.', task: 'Aaj ke dono words use karke 3 sentences bolo.', mono: 'Ek meeting jo waste lagi — kyun, aur better kaise?', listen: 'Shadow 2-3 min: word stress. https://www.youtube.com/results?search_query=English%20word%20stress%20practice%20computer%20important', grammar: 'going to = planned future', grammarEx: 'I am going to refactor this. | We are going to sync at 3.', mistakeWrong: 'What is your good name?', mistakeRight: 'What is your name?', mistakeWhy: 'good name unnatural lagta hai.', realUse: 'Standup mein aaj ka phrase zaroor daalo: "Let us go with this approach."' },
  { day: 38, level: 2, phrase: 'I will take care of it.', context: 'Responsibility lete waqt.', hindi: 'Main iska dhyan rakhunga/rakhungi.', word1: 'Constraint', meaning1: 'Seema / had', example1: 'Memory is the main constraint on mobile.', word2: 'Scope creep', meaning2: 'Scope dheere-dheere badhna', example2: 'Avoid scope creep in the MVP.', transHindi: 'Ye accha point hai. | Paanch minute sync kar sakte hain?', transEnglish: 'That is a good point. | Can we sync for five minutes?', pronFocus: 'short i vs ee — i = short, ee = long smile.', task: 'Phone record: 30 second mein aaj ka topic explain karo.', mono: 'Apna strongest skill + ek example.', listen: 'Shadow 2-3 min: linking. https://www.youtube.com/results?search_query=English%20linking%20sounds%20connected%20speech%20practice', grammar: 'can = ability/permission', grammarEx: 'I can help after lunch. | Can you clarify the scope?', mistakeWrong: 'Kindly do the needful ASAP.', mistakeRight: 'Please take care of this as soon as you can.', mistakeWhy: 'kindly + needful + ASAP overload; simple bolo.', realUse: 'Kisi colleague se help maangte waqt aaj ka phrase use karo: "I will take care of it."' },
  { day: 39, level: 2, phrase: 'This is a bit different from what I expected.', context: 'Mismatch politely note karte waqt.', hindi: 'Ye thoda alag hai jo maine socha tha.', word1: 'Alignment', meaning1: 'Sab ek page pe hona', example1: 'We need alignment on the success metrics.', word2: 'Buy-in', meaning2: 'Support / agreement milna', example2: 'Get buy-in from eng managers first.', transHindi: 'Abhi main ispe blocked hoon. | Main screen share karta hoon.', transEnglish: 'I am blocked on this right now. | Let me share my screen.', pronFocus: 'short e vs a — Open mouth more for /æ/.', task: 'Colleague/friend se aaj ka phrase real conversation mein use karo.', mono: 'Weak area aur improve plan.', listen: 'Shadow 2-3 min: schwa /ə/. https://www.youtube.com/results?search_query=schwa%20sound%20English%20pronunciation%20about%20support', grammar: 'could = polite request', grammarEx: 'Could you review this PR? | Could we park this?', mistakeWrong: 'I have a confusion.', mistakeRight: 'I am confused. / I am unclear about this.', mistakeWhy: 'confusion noun theek, lekin I am confused natural.', realUse: 'Meeting mein ek baar aaj ka phrase naturally bolo: "This is a bit different from what I expected."' },
  { day: 40, level: 2, phrase: 'Could you give me an example?', context: 'Concept clear karne ke liye.', hindi: 'Kya ek example de sakte ho?', word1: 'Hand-off', meaning1: 'Kaam transfer karna', example1: 'Document the hand-off for on-call.', word2: 'Sync-up', meaning2: 'Short alignment meeting', example2: 'Can we do a quick sync-up after standup?', transHindi: 'Requirement thodi clear kar doge? | Call ke baad document update karunga.', transEnglish: 'Could you clarify the requirement? | I will update the document after the call.', pronFocus: 'p/b/t/d endings — Finish the last consonant clearly.', task: 'Word + phrase jodkar bina likhe chhota paragraph bolo.', mono: 'Dream project kya hota agar full freedom milti.', listen: 'Shadow 2-3 min: rise/fall. https://www.youtube.com/results?search_query=English%20intonation%20questions%20vs%20statements', grammar: 'should = advice', grammarEx: 'You should add tests. | We should clarify requirements.', mistakeWrong: 'Out of station.', mistakeRight: 'Out of town. / Traveling.', mistakeWhy: 'station travel ke liye out of town better.', realUse: 'PR comment / review reply mein aaj ka idea English mein likho (phrase related).' },
  { day: 41, level: 2, phrase: 'I agree with most of this, but I have one concern.', context: 'Partial agreement.', hindi: 'Zyadatar agree, lekin ek concern hai.', word1: 'Follow-through', meaning1: 'Promise ke baad complete karna', example1: 'Strong follow-through builds trust.', word2: 'Accountable', meaning2: 'Zimmedar (result ke liye)', example2: 'I am accountable for the release quality.', transHindi: 'Miss ho gaya, phir se bolna please. | Lunch ke baad free hoon.', transEnglish: 'Sorry, I missed that. Could you say it again? | I am available after lunch.', pronFocus: 'silent letters — Do not pronounce silent letters.', task: 'Kaam ka chhota update aaj ke phrase/word se bolo.', mono: 'Code review mein kya dekhte ho?', listen: 'Listen 2-3 min: pick any short episode, shadow 1 line. https://www.youtube.com/results?search_query=BBC%20Learning%20English%206%20Minute%20English', grammar: 'must / have to = necessity', grammarEx: 'I have to leave at 6. | We must fix the outage.', mistakeWrong: 'Passed out from college.', mistakeRight: 'Graduated from college.', mistakeWhy: 'passed out = faint; graduate use karo.', realUse: 'End-of-day update voice note: aaj ka phrase include karo — "I agree with most of this, but I have one concern."' },
  { day: 42, level: 2, phrase: 'Let us move on to the next point.', context: 'Discussion aage badhate waqt.', hindi: 'Agle point pe chalte hain.', word1: 'Ownership', meaning1: 'Poori zimmedari lena', example1: 'I took ownership of the payment module.', word2: 'Visibility', meaning2: 'Dikhai / transparency', example2: 'Add logging for better visibility.', transHindi: 'Abhi isko baad ke liye rakhte hain. | Is decision pe aapki input chahiye.', transEnglish: 'Let us park this for now. | I need your input on this decision.', pronFocus: 'word stress — Stress the correct syllable.', task: 'Intro do aur aaj ka phrase zaroor daalo.', mono: 'Production bug aaye to pehle 3 steps kya?', listen: 'Shadow 2-3 min: clarity over speed. https://www.youtube.com/results?search_query=English%20speaking%20slow%20and%20clear%20practice', grammar: 'don\'t have to ≠ must not', grammarEx: 'You don\'t have to join. | You must not share secrets.', mistakeWrong: 'I will intimate you.', mistakeRight: 'I will inform you. / I will let you know.', mistakeWhy: 'intimate different meaning; inform better.', realUse: 'Calendar invite note / agenda line mein aaj ka word/phrase touch karo.' },
  { day: 43, level: 2, phrase: 'I appreciate your help with this.', context: 'Professionally thank karte waqt.', hindi: 'Is madad ke liye shukriya.', word1: 'Transparency', meaning1: 'Khula / clear communication', example1: 'Transparency during outages reduces panic.', word2: 'Friction', meaning2: 'Rukaawat / inconvenience', example2: 'Too many approvals create friction.', transHindi: 'Mujhe ye theek hai. | Iske baad summary bhejta hoon.', transEnglish: 'That works for me. | I will send a summary after this.', pronFocus: 'sentence stress — Stress content words, soften small words.', task: 'Aaj ka phrase mirror ke saamne 5 baar bolo, expression dekho.', mono: 'Naya teammate onboard kaise karoge?', listen: 'Listen 2-3 min: pause instead of um. https://www.youtube.com/results?search_query=filler%20words%20um%20uh%20how%20to%20pause%20English%20speaking', grammar: 'there is / there are', grammarEx: 'There is a bug in login. | There are two options.', mistakeWrong: 'Today morning.', mistakeRight: 'This morning.', mistakeWhy: 'this morning / tonight — today morning avoid.', realUse: 'Slack pe aaj ka phrase use karke 1 short message likho/bolo: "I appreciate your help with this."' },
  { day: 44, level: 2, phrase: 'I will follow up on this by tomorrow.', context: 'Commitment dete waqt.', hindi: 'Kal tak ispe follow-up karta/karti hoon.', word1: 'Bottleneck', meaning1: 'Sabse slow / blocking part', example1: 'Code review was the bottleneck.', word2: 'Workload', meaning2: 'Kaam ka load', example2: 'Balance the workload across the team.', transHindi: 'Isko short rakh sakte hain? | Main context catch-up kar raha hoon.', transEnglish: 'Can we keep this short? | I am catching up on the context.', pronFocus: 'linking sounds — Link final consonant to next vowel.', task: 'Aaj ke dono words use karke 3 sentences bolo.', mono: 'Focus kaise protect karte ho deep work ke liye?', listen: 'Shadow 2-3 min: standup phrases. https://www.youtube.com/results?search_query=standup%20meeting%20English%20phrases%20practice', grammar: 'much / many', grammarEx: 'How much time do we need? | How many tickets are open?', mistakeWrong: 'Discuss about the plan.', mistakeRight: 'Discuss the plan.', mistakeWhy: 'discuss ke baad about nahi.', realUse: 'Standup mein aaj ka phrase zaroor daalo: "I will follow up on this by tomorrow."' },
  { day: 45, level: 2, phrase: 'That is a good point.', context: 'Acknowledge karte waqt.', hindi: 'Ye accha point hai.', word1: 'Capacity', meaning1: 'Kitna sambhal sakte ho', example1: 'Do we have capacity for this feature?', word2: 'Headcount', meaning2: 'Team size (logon ki ginti)', example2: 'We need more headcount for platform work.', transHindi: 'Agar galat hoon to correct kar dena. | Aapke saath kaam ka wait hai.', transEnglish: 'Please correct me if I am wrong. | Looking forward to working with you.', pronFocus: 'schwa /ə/ — Unstressed vowels become soft uh.', task: 'Phone record: 30 second mein aaj ka topic explain karo.', mono: 'Documentation kyun important hai — example ke saath.', listen: 'Shadow 2-3 min: meeting English. https://www.youtube.com/results?search_query=English%20for%20work%20meetings%20polite%20phrases', grammar: 'some / any', grammarEx: 'I need some context. | Do you have any blockers?', mistakeWrong: 'I am not getting you.', mistakeRight: 'I don\'t understand you. / Could you repeat?', mistakeWhy: 'getting you informal/unclear.', realUse: 'Kisi colleague se help maangte waqt aaj ka phrase use karo: "That is a good point."' },
  { day: 46, level: 2, phrase: 'Can we sync for five minutes?', context: 'Short discussion maangte waqt.', hindi: 'Kya paanch minute sync kar sakte hain?', word1: 'Ramp-up', meaning1: 'Naye kaam pe speed pakadna', example1: 'I can ramp up on Kotlin in two weeks.', word2: 'Onboard', meaning2: 'Naye person ko set karna', example2: 'I onboarded two interns last month.', transHindi: 'Deadline tight hai. | Mujhe review chahiye.', transEnglish: 'The deadline is tight. | I need a review.', pronFocus: 'l vs r — Tongue tip up for L, curl for R.', task: 'Colleague/friend se aaj ka phrase real conversation mein use karo.', mono: 'Remote collaboration tip jo aap use karte ho.', listen: 'Shadow 2-3 min: interview answer. https://www.youtube.com/results?search_query=job%20interview%20English%20answers%20STAR%20method%20short', grammar: 'in / on / at (time)', grammarEx: 'on Monday / at 3 PM / in June | I will call at noon.', mistakeWrong: 'Do one thing.', mistakeRight: 'Here is an idea. / Can we try this?', mistakeWhy: 'do one thing filler hai; direct bolo.', realUse: 'Meeting mein ek baar aaj ka phrase naturally bolo: "Can we sync for five minutes?"' },
  { day: 47, level: 2, phrase: 'I am blocked on this right now.', context: 'Blocker batate waqt.', hindi: 'Abhi main ispe blocked hoon.', word1: 'Offboard', meaning1: 'Exit process / access hataana', example1: 'Offboard access on the last working day.', word2: 'Runbook', meaning2: 'Step-by-step ops guide', example2: 'Update the runbook after every incident.', transHindi: 'PR ready hai. | Bug reproduce ho gaya.', transEnglish: 'The pull request is ready. | I was able to reproduce the bug.', pronFocus: 'f vs p — F = teeth on lip, P = lips together.', task: 'Word + phrase jodkar bina likhe chhota paragraph bolo.', mono: 'Interview mein nervousness kaise handle karte ho?', listen: 'Shadow 2-3 min: technical explain. https://www.youtube.com/results?search_query=explain%20a%20bug%20English%20speaking%20practice', grammar: 'in / on / at (place)', grammarEx: 'in the office / on the call / at my desk | Meet me at the lobby.', mistakeWrong: 'Only I am saying...', mistakeRight: 'I am just saying... / What I mean is...', mistakeWhy: 'only placement awkward ho sakta.', realUse: 'PR comment / review reply mein aaj ka idea English mein likho (phrase related).' },
  { day: 48, level: 2, phrase: 'Let me share my screen.', context: 'Demo/walkthrough se pehle.', hindi: 'Main screen share karta/karti hoon.', word1: 'Playbook', meaning1: 'Standard response plan', example1: 'Our incident playbook covers paging rules.', word2: 'Cadence', meaning2: 'Regular rhythm / schedule', example2: 'We run retros on a biweekly cadence.', transHindi: 'Staging pe test karo. | Production impact kam hai.', transEnglish: 'Please test it on staging. | The production impact is low.', pronFocus: 's vs sh — sh = lips forward, softer.', task: 'Kaam ka chhota update aaj ke phrase/word se bolo.', mono: 'Ek decision jisme trade-off tha — batao.', listen: 'Shadow 2-3 min: easy conversation. https://www.youtube.com/results?search_query=daily%20English%20conversation%20practice%20for%20beginners', grammar: 'for / since', grammarEx: 'for 2 hours / since morning | I have been stuck since 10.', mistakeWrong: 'It is very much important.', mistakeRight: 'It is very important.', mistakeWhy: 'very much yahan mat lagao.', realUse: 'End-of-day update voice note: aaj ka phrase include karo — "Let me share my screen."' },
  { day: 49, level: 2, phrase: 'Could you clarify the requirement?', context: 'Clearity maangte waqt.', hindi: 'Requirement thodi clear kar doge?', word1: 'Cycle time', meaning1: 'Idea se ship tak ka time', example1: 'We reduced cycle time with smaller PRs.', word2: 'Loop in', meaning2: 'Baatcheet mein shamil karna', example2: 'Loop in security before we ship auth changes.', transHindi: 'Rollback plan ready hai. | Customer complaint aayi hai.', transEnglish: 'The rollback plan is ready. | We received a customer complaint.', pronFocus: 'z sound — Buzz the z, do not make it s.', task: 'Intro do aur aaj ka phrase zaroor daalo.', mono: 'Customer complaint aaye to soft skills kaise use?', listen: 'Shadow 2-3 min: follow-up phrases. https://www.youtube.com/results?search_query=office%20English%20phrases%20I%20will%20follow%20up', grammar: 'because / so', grammarEx: 'It failed because of timeout. | It was late, so we rolled back.', mistakeWrong: 'I request you to please...', mistakeRight: 'Could you please...?', mistakeWhy: 'request you to please double polite unnatural.', realUse: 'Calendar invite note / agenda line mein aaj ka word/phrase touch karo.' },
  { day: 50, level: 2, phrase: 'I will update the document after the call.', context: 'Post-meeting commitment.', hindi: 'Call ke baad document update karunga/karungi.', word1: 'Call out', meaning1: 'Clearly highlight karna', example1: 'I want to call out a risk in the design.', word2: 'Push back', meaning2: 'Politely disagree / resist', example2: 'I pushed back on an unrealistic deadline.', transHindi: 'Priority badha do. | Scope clear nahi hai.', transEnglish: 'Please increase the priority. | The scope is not clear.', pronFocus: 'ng ending — Keep the soft ng at the end.', task: 'Aaj ka phrase mirror ke saamne 5 baar bolo, expression dekho.', mono: 'English practice ka aaj ka goal kya hai?', listen: 'Shadow 2-3 min: silent letters. https://www.youtube.com/results?search_query=English%20pronunciation%20silent%20letters%20honest%20hour', grammar: 'although / however', grammarEx: 'Although it is hard, I will try. | It works; however, it is slow.', mistakeWrong: 'Update me the status.', mistakeRight: 'Update me on the status. / Send me a status update.', mistakeWhy: 'update me on X.', realUse: 'Slack pe aaj ka phrase use karke 1 short message likho/bolo: "I will update the document after the call."' },
  { day: 51, level: 2, phrase: 'Sorry, I missed that. Could you say it again?', context: 'Meeting mein miss hone par.', hindi: 'Miss ho gaya, phir se bolna please.', word1: 'Double down', meaning1: 'Aur zyada focus/invest karna', example1: 'We doubled down on automated tests.', word2: 'Dial back', meaning2: 'Kam karna / slow down', example2: 'Dial back the feature scope for launch.', transHindi: 'Estimate do din ka hai. | Dependency kisi aur team pe hai.', transEnglish: 'The estimate is two days. | There is a dependency on another team.', pronFocus: 'minimal: beach/bitch — Smile longer for ee.', task: 'Aaj ke dono words use karke 3 sentences bolo.', mono: 'Books vs videos — aap kaise seekhte ho?', listen: 'Shadow 2-3 min: L vs R. https://www.youtube.com/results?search_query=L%20vs%20R%20pronunciation%20practice%20light%20right', grammar: 'if + present, will...', grammarEx: 'If it fails, I will retry. | If you are free, we can sync.', mistakeWrong: 'I am having 5 years experience.', mistakeRight: 'I have 5 years of experience.', mistakeWhy: 'have experience — continuous nahi.', realUse: 'Standup mein aaj ka phrase zaroor daalo: "Sorry, I missed that. Could you say it again?"' },
  { day: 52, level: 2, phrase: 'I am available after lunch.', context: 'Availability batate waqt.', hindi: 'Lunch ke baad free hoon.', word1: 'Takeaway', meaning1: 'Key learning / conclusion', example1: 'My takeaway is to add canaries earlier.', word2: 'Net-new', meaning2: 'Bilkul naya', example2: 'This is net-new work, not a bugfix.', transHindi: 'Design review kal hai. | Docs update karne hain.', transEnglish: 'The design review is tomorrow. | We need to update the docs.', pronFocus: 'minimal: walk/work — work = er sound, walk = aw.', task: 'Phone record: 30 second mein aaj ka topic explain karo.', mono: 'Health + work balance short take.', listen: 'Shadow 2-3 min: F vs P. https://www.youtube.com/results?search_query=F%20vs%20P%20pronunciation%20coffee%20copy', grammar: 'countable vs uncountable', grammarEx: 'two tasks / some information | advice (not advices)', mistakeWrong: 'He told that he is free.', mistakeRight: 'He said that he is free. / He told me that...', mistakeWhy: 'tell needs object (told me).', realUse: 'Kisi colleague se help maangte waqt aaj ka phrase use karo: "I am available after lunch."' },
  { day: 53, level: 2, phrase: 'Let us park this for now.', context: 'Topic baad ke liye rakhte waqt.', hindi: 'Abhi isko baad ke liye rakhte hain.', word1: 'Low-hanging fruit', meaning1: 'Aasan quick wins', example1: 'Fixing typos is low-hanging fruit.', word2: 'North star', meaning2: 'Main long-term goal', example2: 'Latency under 100ms is our north star.', transHindi: 'Monitoring alert aa raha hai. | Latency badh gayi hai.', transEnglish: 'A monitoring alert is firing. | Latency has increased.', pronFocus: 'ask /ɑːsk/ vs /æsk/ — Pick one accent and stay consistent.', task: 'Colleague/friend se aaj ka phrase real conversation mein use karo.', mono: 'Favourite programming concept simple words mein.', listen: 'Shadow 2-3 min: s vs sh. https://www.youtube.com/results?search_query=S%20vs%20SH%20pronunciation%20see%20she', grammar: 'this / that / these / those', grammarEx: 'This bug is new. | Those logs look old.', mistakeWrong: 'Close the call.', mistakeRight: 'End the call. / Hang up.', mistakeWhy: 'end the call more natural.', realUse: 'Meeting mein ek baar aaj ka phrase naturally bolo: "Let us park this for now."' },
  { day: 54, level: 2, phrase: 'I need your input on this decision.', context: 'Opinion maangte waqt.', hindi: 'Is decision pe aapki input chahiye.', word1: 'Parking lot', meaning1: 'Baad ke topics ki list', example1: 'Put that idea in the parking lot for now.', word2: 'Action item', meaning2: 'Concrete next task', example2: 'Capture action items before we leave.', transHindi: 'Cache clear karna padega. | Feature flag on kar do.', transEnglish: 'We will need to clear the cache. | Please turn on the feature flag.', pronFocus: 'schedule — US: SKED-jool is common in tech.', task: 'Word + phrase jodkar bina likhe chhota paragraph bolo.', mono: 'Agar mentor banoge to pehli advice kya?', listen: 'Shadow 2-3 min: pause at commas. https://www.youtube.com/results?search_query=English%20chunking%20pauses%20speak%20clearly', grammar: 'Comparatives', grammarEx: 'faster than / more scalable than | This is clearer than before.', mistakeWrong: 'Share your screen share.', mistakeRight: 'Please share your screen.', mistakeWhy: 'screen share dobara mat bolo.', realUse: 'PR comment / review reply mein aaj ka idea English mein likho (phrase related).' },
  { day: 55, level: 2, phrase: 'That works for me.', context: 'Agreement express karte waqt.', hindi: 'Mujhe ye theek hai.', word1: 'Recap', meaning1: 'Short summary dobara', example1: 'Here is a quick recap of decisions.', word2: 'Async', meaning2: 'Bina live meeting ke', example2: 'Prefer async updates over long meetings.', transHindi: 'Release notes bhej do. | Standup skip karna hai?', transEnglish: 'Please send the release notes. | Do we need to skip standup?', pronFocus: 'data — Both OK — stay consistent in one talk.', task: 'Kaam ka chhota update aaj ke phrase/word se bolo.', mono: 'System slow ho to kaise debug start?', listen: 'Listen 2-3 min: tense contrast (optional). https://www.youtube.com/results?search_query=present%20perfect%20vs%20past%20simple%20English%20explanation%20short', grammar: 'Superlatives', grammarEx: 'the fastest / the most important | This is the main risk.', mistakeWrong: 'I am on leave from tomorrow.', mistakeRight: 'I am on leave starting tomorrow. / I will be on leave from tomorrow.', mistakeWhy: 'starting tomorrow clear.', realUse: 'End-of-day update voice note: aaj ka phrase include karo — "That works for me."' },
  { day: 56, level: 2, phrase: 'I will send a summary after this.', context: 'Meeting wrap-up.', hindi: 'Iske baad summary bhejta/bhejti hoon.', word1: 'Sync', meaning1: 'Live saath mein', example1: 'Let us sync live on the architecture.', word2: 'Context-switch', meaning2: 'Kaam badalte focus tootna', example2: 'Too many meetings cause context-switching.', transHindi: 'Main WFH hoon aaj. | Office aaunga kal.', transEnglish: 'I am working from home today. | I will come to the office tomorrow.', pronFocus: 'route — In networking, root is common.', task: 'Intro do aur aaj ka phrase zaroor daalo.', mono: 'Feature ship karne se pehle checklist bolo.', listen: 'Listen 2-3 min: articles. https://www.youtube.com/results?search_query=articles%20a%20an%20the%20English%20short%20lesson', grammar: 'Passive (simple)', grammarEx: 'The bug was fixed. | The PR was approved.', mistakeWrong: 'Doubt clearance session.', mistakeRight: 'Q&A session. / Clarification session.', mistakeWhy: 'doubt clearance Indian-campus tone.', realUse: 'Calendar invite note / agenda line mein aaj ka word/phrase touch karo.' },
  { day: 57, level: 2, phrase: 'Can we keep this short?', context: 'Time manage karte waqt.', hindi: 'Kya isko short rakh sakte hain?', word1: 'Unblock', meaning1: 'Rukaawat hatana', example1: 'What do you need to unblock the PR?', word2: 'Ship', meaning2: 'Release / live karna', example2: 'We shipped the beta to 5% of users.', transHindi: 'Leave lena hai Monday ko. | Calendar invite bhej do.', transEnglish: 'I need to take leave on Monday. | Please send a calendar invite.', pronFocus: 'intonation up/down — Questions often rise; statements fall.', task: 'Aaj ka phrase mirror ke saamne 5 baar bolo, expression dekho.', mono: 'Conflict teammate se — professionally resolve kaise?', listen: 'Listen 2-3 min: in/on/at. https://www.youtube.com/results?search_query=prepositions%20in%20on%20at%20English%20short', grammar: 'Reported speech (basic)', grammarEx: 'He said he was blocked. | She asked if I was free.', mistakeWrong: 'Please find the attached.', mistakeRight: 'Please find the attachment. / Attached is the file.', mistakeWhy: 'find attached / attachment.', realUse: 'Slack pe aaj ka phrase use karke 1 short message likho/bolo: "Can we keep this short?"' },
  { day: 58, level: 2, phrase: 'I am catching up on the context.', context: 'Late join hone par.', hindi: 'Main context catch-up kar raha/rahi hoon.', word1: 'Polish', meaning1: 'Final refinement', example1: 'The feature works; it needs polish.', word2: 'Caveat', meaning2: 'Shart / warning', example2: 'One caveat: this only works with Redis.', transHindi: 'Timezone confirm kar lo. | Recording share kar dena.', transEnglish: 'Please confirm the timezone. | Please share the recording.', pronFocus: 'chunking pauses — Pause at commas and idea breaks.', task: 'Aaj ke dono words use karke 3 sentences bolo.', mono: 'Success metric for today\'s practice.', listen: 'Shadow 2-3 min: polite requests. https://www.youtube.com/results?search_query=English%20email%20phrases%20could%20you%20please', grammar: 'Question forms', grammarEx: 'What is the impact? | Where should I start?', mistakeWrong: 'I will check and revert.', mistakeRight: 'I will check and get back to you.', mistakeWhy: 'get back to you natural.', realUse: 'Standup mein aaj ka phrase zaroor daalo: "I am catching up on the context."' },
  { day: 59, level: 2, phrase: 'Please correct me if I am wrong.', context: 'Humble clarification.', hindi: 'Agar galat hoon to correct kar dena.', word1: 'Disclaimer', meaning1: 'Pehle se warning/note', example1: 'Disclaimer: numbers are approximate.', word2: 'Heuristic', meaning2: 'Practical thumb rule', example2: 'Use a heuristic before over-optimizing.', transHindi: 'Action items list karo. | Owner assign kar do.', transEnglish: 'Please list the action items. | Please assign an owner.', pronFocus: 'filler control — Replace um with a short pause.', task: 'Phone record: 30 second mein aaj ka topic explain karo.', mono: 'Ek open-source tool jo pasand hai — kyun?', listen: 'Shadow 2-3 min: call English. https://www.youtube.com/results?search_query=English%20phone%20call%20phrases%20can%20you%20hear%20me', grammar: 'Tag questions (light)', grammarEx: 'It is ready, right? | You can join, can\'t you?', mistakeWrong: 'Lakh of users.', mistakeRight: 'Hundreds of thousands of users. / About 100,000 users.', mistakeWhy: 'international audience ke liye numbers clear.', realUse: 'Kisi colleague se help maangte waqt aaj ka phrase use karo: "Please correct me if I am wrong."' },
  { day: 60, level: 2, phrase: 'Looking forward to working with you.', context: 'Nayi collaboration shuru karte waqt.', hindi: 'Aapke saath kaam ka wait hai.', word1: 'Prerequisite', meaning1: 'Pehle zaroori cheez', example1: 'Tests are a prerequisite for merge.', word2: 'Non-negotiable', meaning2: 'Jispe compromise nahi', example2: 'Security review is non-negotiable.', transHindi: 'Status green hai. | Risk highlight karna hai.', transEnglish: 'The status is green. | We need to highlight the risk.', pronFocus: 'clarity over speed — Clarity pehle, speed baad mein.', task: 'Colleague/friend se aaj ka phrase real conversation mein use karo.', mono: '30 din baad English mein kya better hona chahiye?', listen: 'Shadow 2-3 min: tech vocab. https://www.youtube.com/results?search_query=tech%20English%20vocabulary%20scalable%20optimize%20short', grammar: 'Articles with roles', grammarEx: 'I am a developer. | She is the owner of this module.', mistakeWrong: 'Pin code.', mistakeRight: 'ZIP code (US) / postal code', mistakeWhy: 'audience ke hisaab se postal/ZIP.', realUse: 'Meeting mein ek baar aaj ka phrase naturally bolo: "Looking forward to working with you."' },
  { day: 61, level: 3, phrase: 'Let me walk you through my approach.', context: 'Interview mein solution explain karne se pehle.', hindi: 'Main apna approach step-by-step batata/batati hoon.', word1: 'Mitigate', meaning1: 'Risk/asar kam karna', example1: 'We mitigated downtime with a canary.', word2: 'Contention', meaning2: 'Competition for shared resource', example2: 'Lock contention slowed the writes.', transHindi: 'Main apna approach step-by-step batata hoon. | Yahan sabse badi challenge scalability thi.', transEnglish: 'Let me walk you through my approach. | The main challenge here was scalability.', pronFocus: 'v vs w — Lips round for W, teeth+lip for V.', task: 'Word + phrase jodkar bina likhe chhota paragraph bolo.', mono: 'Apna subah ka routine 60 second mein batao.', listen: 'Shadow 2-3 min: v vs w words. https://www.youtube.com/results?search_query=v%20vs%20w%20pronunciation%20English%20practice%202%20minutes', grammar: 'a/an: consonant sound pe a, vowel sound pe an', grammarEx: 'a user / an update | a meeting / an hour', mistakeWrong: 'I am having a doubt.', mistakeRight: 'I have a doubt. / I have a question.', mistakeWhy: 'have + doubt/question (state), continuous mat use karo.', realUse: 'PR comment / review reply mein aaj ka idea English mein likho (phrase related).' },
  { day: 62, level: 3, phrase: 'The main challenge here was scalability.', context: 'Project problem describe karte waqt.', hindi: 'Yahan sabse badi challenge scalability thi.', word1: 'Idempotent', meaning1: 'Repeat request = same result', example1: 'Make the payment webhook idempotent.', word2: 'Leverage', meaning2: 'Fayda uthana / use karna', example2: 'Leverage existing metrics before adding more.', transHindi: 'Optimize karne ke liye maine logic refactor kiya. | Yahan speed aur accuracy ke beech trade-off hai.', transEnglish: 'To optimize this, I refactored the logic. | There is a trade-off between speed and accuracy here.', pronFocus: 'th (θ soft) — Tongue between teeth, soft air.', task: 'Kaam ka chhota update aaj ke phrase/word se bolo.', mono: 'Kal ka sabse interesting kaam explain karo.', listen: 'Shadow 2-3 min: soft/voiced th. https://www.youtube.com/results?search_query=th%20sound%20pronunciation%20think%20thank%20this%20that', grammar: 'Simple present = habit/facts', grammarEx: 'I work from home on Fridays. | She reviews PRs daily.', mistakeWrong: 'I will do the needful.', mistakeRight: 'I will take care of it. / I will do what is needed.', mistakeWhy: 'do the needful Indian office phrase hai; natural English alag.', realUse: 'End-of-day update voice note: aaj ka phrase include karo — "The main challenge here was scalability."' },
  { day: 63, level: 3, phrase: 'To optimize this, I refactored the logic.', context: 'Technical improvement explain karte waqt.', hindi: 'Optimize karne ke liye maine logic refactor kiya.', word1: 'Trade-off', meaning1: 'Ek cheez vs doosri', example1: 'There is a trade-off between consistency and availability.', word2: 'Orchestration', meaning2: 'Kai steps/services coordinate karna', example2: 'Use orchestration for the multi-step workflow.', transHindi: 'Main business impact ke hisaab se prioritize karunga. | Main isko step-by-step todta hoon.', transEnglish: 'I would prioritize this based on business impact. | Let me break this down step by step.', pronFocus: 'th (ð voiced) — Same tongue position, add voice.', task: 'Intro do aur aaj ka phrase zaroor daalo.', mono: 'Favourite tool aur kyun — 60 second.', listen: 'Shadow 2-3 min: -ed endings. https://www.youtube.com/results?search_query=ed%20ending%20pronunciation%20worked%20played%20needed', grammar: 'Present continuous = abhi ho raha', grammarEx: 'I am debugging now. | We are shipping today.', mistakeWrong: 'Please revert on this.', mistakeRight: 'Please reply / get back to me.', mistakeWhy: 'revert = undo change; reply ke liye revert mat bolo.', realUse: 'Calendar invite note / agenda line mein aaj ka word/phrase touch karo.' },
  { day: 64, level: 3, phrase: 'There is a trade-off between speed and accuracy here.', context: 'Design decision justify karte waqt.', hindi: 'Yahan speed aur accuracy ke beech trade-off hai.', word1: 'Observability', meaning1: 'System andar se dikhna', example1: 'Improve observability before the next release.', word2: 'Instrumentation', meaning2: 'Metrics/logs/traces add karna', example2: 'Add instrumentation around the checkout path.', transHindi: 'Aaj sochun to alag approach leta. | Ye design scalable aur maintainable hai.', transEnglish: 'In hindsight, I would have approached it differently. | This design is scalable and easy to maintain.', pronFocus: '-ed /t/ — After unvoiced sound → /t/.', task: 'Aaj ka phrase mirror ke saamne 5 baar bolo, expression dekho.', mono: 'Ek galti se kya seekha — short story.', listen: 'Shadow 2-3 min: soft R. https://www.youtube.com/results?search_query=American%20English%20R%20pronunciation%20practice', grammar: 'Past simple = finished time', grammarEx: 'I finished the task yesterday. | We deployed last week.', mistakeWrong: 'Prepone the meeting.', mistakeRight: 'Move the meeting earlier. / Reschedule to an earlier time.', mistakeWhy: 'prepone dictionary mein rare; earlier use karo.', realUse: 'Slack pe aaj ka phrase use karke 1 short message likho/bolo: "There is a trade-off between speed and accuracy here."' },
  { day: 65, level: 3, phrase: 'I would prioritize this based on business impact.', context: 'Prioritization jawab.', hindi: 'Main business impact ke hisaab se prioritize karunga/karungi.', word1: 'Resilience', meaning1: 'Failure ke baad recover hona', example1: 'Retries and timeouts improve resilience.', word2: 'Reliability', meaning2: 'Bharosemand service', example2: 'Reliability matters more than raw speed here.', transHindi: 'Maine backend team ke saath milkar kaam kiya. | Accha sawaal hai, ek second sochne do.', transEnglish: 'I collaborated closely with the backend team on this. | That is a great question, let me think about it for a second.', pronFocus: '-ed /d/ — After voiced sound → /d/.', task: 'Aaj ke dono words use karke 3 sentences bolo.', mono: 'Agar aaj free ho to kya seekhoge?', listen: 'Shadow 2-3 min: short i vs ee. https://www.youtube.com/results?search_query=ship%20sheep%20bit%20beat%20pronunciation%20minimal%20pairs', grammar: 'Present perfect = past → now connection', grammarEx: 'I have fixed the bug. | Have you seen the doc?', mistakeWrong: 'I am agree.', mistakeRight: 'I agree.', mistakeWhy: 'agree verb hai — am agree nahi.', realUse: 'Standup mein aaj ka phrase zaroor daalo: "I would prioritize this based on business impact."' },
  { day: 66, level: 3, phrase: 'Let me break this down step by step.', context: 'Complex answer structure.', hindi: 'Main isko step-by-step todta/todti hoon.', word1: 'Throughput', meaning1: 'Kitna kaam per unit time', example1: 'Throughput dropped during the GC pause.', word2: 'Latency', meaning2: 'Response delay', example2: 'P99 latency spiked after the deploy.', transHindi: 'Ussi project se testing ki importance seekhi. | Team ke tech stack ke baare mein aur jaanna chahunga.', transEnglish: 'My key takeaway from that project was the importance of testing. | I would love to learn more about the team\'s tech stack.', pronFocus: '-ed /ɪd/ — After t/d → extra syllable /ɪd/.', task: 'Phone record: 30 second mein aaj ka topic explain karo.', mono: 'Team mein help maangne ka tarika describe karo.', listen: 'Shadow 2-3 min: e vs a. https://www.youtube.com/results?search_query=pen%20pan%20men%20man%20pronunciation%20practice', grammar: 'will = future decision/promise', grammarEx: 'I will send the summary. | We will check tomorrow.', mistakeWrong: 'Myself Rohan.', mistakeRight: 'I am Rohan. / This is Rohan.', mistakeWhy: 'myself sirf emphasize/reflexive ke liye.', realUse: 'Kisi colleague se help maangte waqt aaj ka phrase use karo: "Let me break this down step by step."' },
  { day: 67, level: 3, phrase: 'In hindsight, I would have approached it differently.', context: 'Reflection question.', hindi: 'Aaj sochun to alag approach leta/leti.', word1: 'Bottleneck', meaning1: 'Performance ki kami wali jagah', example1: 'The DB CPU was the bottleneck.', word2: 'Saturation', meaning2: 'Resource almost full', example2: 'Disk saturation triggered the alerts.', transHindi: 'Maine poora module end-to-end sambhala. | Code se pehle requirements align kar lete hain.', transEnglish: 'I took ownership of the entire module end to end. | Let us align on the requirements before diving into code.', pronFocus: 'r (American soft) — Light touch, do not roll heavily.', task: 'Colleague/friend se aaj ka phrase real conversation mein use karo.', mono: 'Ek meeting jo waste lagi — kyun, aur better kaise?', listen: 'Shadow 2-3 min: word stress. https://www.youtube.com/results?search_query=English%20word%20stress%20practice%20computer%20important', grammar: 'going to = planned future', grammarEx: 'I am going to refactor this. | We are going to sync at 3.', mistakeWrong: 'What is your good name?', mistakeRight: 'What is your name?', mistakeWhy: 'good name unnatural lagta hai.', realUse: 'Meeting mein ek baar aaj ka phrase naturally bolo: "In hindsight, I would have approached it differently."' },
  { day: 68, level: 3, phrase: 'This design is scalable and easy to maintain.', context: 'System design discuss.', hindi: 'Ye design scalable aur maintainable hai.', word1: 'Backpressure', meaning1: 'Upstream ko slow karne ka signal', example1: 'The queue applies backpressure under load.', word2: 'Circuit breaker', meaning2: 'Failing dependency se bachne ka pattern', example2: 'Trip the circuit breaker when errors spike.', transHindi: 'Nayi tech pe jaldi ramp-up kar sakta hoon. | Success ko latency aur error rate se measure kiya.', transEnglish: 'I am confident I can ramp up quickly on new technologies. | I measured success using latency and error rate.', pronFocus: 'short i vs ee — i = short, ee = long smile.', task: 'Word + phrase jodkar bina likhe chhota paragraph bolo.', mono: 'Apna strongest skill + ek example.', listen: 'Shadow 2-3 min: linking. https://www.youtube.com/results?search_query=English%20linking%20sounds%20connected%20speech%20practice', grammar: 'can = ability/permission', grammarEx: 'I can help after lunch. | Can you clarify the scope?', mistakeWrong: 'Kindly do the needful ASAP.', mistakeRight: 'Please take care of this as soon as you can.', mistakeWhy: 'kindly + needful + ASAP overload; simple bolo.', realUse: 'PR comment / review reply mein aaj ka idea English mein likho (phrase related).' },
  { day: 69, level: 3, phrase: 'I collaborated closely with the backend team on this.', context: 'Teamwork example.', hindi: 'Maine backend team ke saath milkar kaam kiya.', word1: 'Rate limiting', meaning1: 'Request rate control', example1: 'Rate limiting protected us from abuse.', word2: 'Thundering herd', meaning2: 'Sab ek saath rush karna', example2: 'Jitter helps avoid a thundering herd.', transHindi: 'Feature flag ke peeche rollout karke risk kam kiya. | Decision document kiya taaki baad mein revisit ho sake.', transEnglish: 'We mitigated risk by rolling out behind a feature flag. | I documented the decision so the team could revisit it later.', pronFocus: 'short e vs a — Open mouth more for /æ/.', task: 'Kaam ka chhota update aaj ke phrase/word se bolo.', mono: 'Weak area aur improve plan.', listen: 'Shadow 2-3 min: schwa /ə/. https://www.youtube.com/results?search_query=schwa%20sound%20English%20pronunciation%20about%20support', grammar: 'could = polite request', grammarEx: 'Could you review this PR? | Could we park this?', mistakeWrong: 'I have a confusion.', mistakeRight: 'I am confused. / I am unclear about this.', mistakeWhy: 'confusion noun theek, lekin I am confused natural.', realUse: 'End-of-day update voice note: aaj ka phrase include karo — "I collaborated closely with the backend team on this."' },
  { day: 70, level: 3, phrase: 'That is a great question, let me think about it for a second.', context: 'Time lene ke liye gracefully.', hindi: 'Accha sawaal hai, ek second sochne do.', word1: 'Hot partition', meaning1: 'Ek shard pe zyada load', example1: 'UserId hashing caused a hot partition.', word2: 'Fan-out', meaning2: 'Ek event se kai consumers', example2: 'Notification fan-out stressed the workers.', transHindi: 'Bottleneck DB query mein thi, API layer mein nahi. | Operational complexity kam karne ke liye simple design propose kiya.', transEnglish: 'The bottleneck was in the database query, not the API layer. | I proposed a simpler design to reduce operational complexity.', pronFocus: 'p/b/t/d endings — Finish the last consonant clearly.', task: 'Intro do aur aaj ka phrase zaroor daalo.', mono: 'Dream project kya hota agar full freedom milti.', listen: 'Shadow 2-3 min: rise/fall. https://www.youtube.com/results?search_query=English%20intonation%20questions%20vs%20statements', grammar: 'should = advice', grammarEx: 'You should add tests. | We should clarify requirements.', mistakeWrong: 'Out of station.', mistakeRight: 'Out of town. / Traveling.', mistakeWhy: 'station travel ke liye out of town better.', realUse: 'Calendar invite note / agenda line mein aaj ka word/phrase touch karo.' },
  { day: 71, level: 3, phrase: 'My key takeaway from that project was the importance of testing.', context: 'Learning question.', hindi: 'Usssi project se testing ki importance seekhi.', word1: 'Fan-in', meaning1: 'Kai sources ek jagah', example1: 'Metrics fan-in to a central store.', word2: 'Eventual consistency', meaning2: 'Baad mein consistent hona', example2: 'The feed uses eventual consistency.', transHindi: 'Time pe ship karne ke liye cross-functional alignment zaroori tha. | Pehle chhote prototype se assumption validate ki.', transEnglish: 'Cross-functional alignment was critical for shipping on time. | I validated the assumption with a small prototype first.', pronFocus: 'silent letters — Do not pronounce silent letters.', task: 'Aaj ka phrase mirror ke saamne 5 baar bolo, expression dekho.', mono: 'Code review mein kya dekhte ho?', listen: 'Listen 2-3 min: pick any short episode, shadow 1 line. https://www.youtube.com/results?search_query=BBC%20Learning%20English%206%20Minute%20English', grammar: 'must / have to = necessity', grammarEx: 'I have to leave at 6. | We must fix the outage.', mistakeWrong: 'Passed out from college.', mistakeRight: 'Graduated from college.', mistakeWhy: 'passed out = faint; graduate use karo.', realUse: 'Slack pe aaj ka phrase use karke 1 short message likho/bolo: "My key takeaway from that project was the importance of testing."' },
  { day: 72, level: 3, phrase: 'I would love to learn more about the team\'s tech stack.', context: 'Reverse question.', hindi: 'Team ke tech stack ke baare mein aur jaanna chahunga/chahungi.', word1: 'Strong consistency', meaning1: 'Turant same data', example1: 'Payments need strong consistency.', word2: 'Stale read', meaning2: 'Purana data padhna', example2: 'Caching caused a stale read of balances.', transHindi: 'Premature optimization se pehle consistency choose ki. | Postmortem own kiya aur follow-ups drive kiye.', transEnglish: 'We chose consistency over premature optimization. | I owned the postmortem and drove the follow-up actions.', pronFocus: 'word stress — Stress the correct syllable.', task: 'Aaj ke dono words use karke 3 sentences bolo.', mono: 'Production bug aaye to pehle 3 steps kya?', listen: 'Shadow 2-3 min: clarity over speed. https://www.youtube.com/results?search_query=English%20speaking%20slow%20and%20clear%20practice', grammar: 'don\'t have to ≠ must not', grammarEx: 'You don\'t have to join. | You must not share secrets.', mistakeWrong: 'I will intimate you.', mistakeRight: 'I will inform you. / I will let you know.', mistakeWhy: 'intimate different meaning; inform better.', realUse: 'Standup mein aaj ka phrase zaroor daalo: "I would love to learn more about the team\'s tech stack."' },
  { day: 73, level: 3, phrase: 'I took ownership of the entire module end to end.', context: 'Ownership highlight.', hindi: 'Maine poora module end-to-end sambhala.', word1: 'Race condition', meaning1: 'Timing pe depend bug', example1: 'A race condition corrupted the counter.', word2: 'Deadlock', meaning2: 'Circular wait lock', example2: 'Two transactions hit a deadlock.', transHindi: 'Product goals ko technical milestones mein translate kiya. | Solution se pehle clarifying questions poochunga.', transEnglish: 'My role was to translate product goals into technical milestones. | I would ask clarifying questions before proposing a solution.', pronFocus: 'sentence stress — Stress content words, soften small words.', task: 'Phone record: 30 second mein aaj ka topic explain karo.', mono: 'Naya teammate onboard kaise karoge?', listen: 'Listen 2-3 min: pause instead of um. https://www.youtube.com/results?search_query=filler%20words%20um%20uh%20how%20to%20pause%20English%20speaking', grammar: 'there is / there are', grammarEx: 'There is a bug in login. | There are two options.', mistakeWrong: 'Today morning.', mistakeRight: 'This morning.', mistakeWhy: 'this morning / tonight — today morning avoid.', realUse: 'Kisi colleague se help maangte waqt aaj ka phrase use karo: "I took ownership of the entire module end to end."' },
  { day: 74, level: 3, phrase: 'Let us align on the requirements before diving into code.', context: 'Clarification.', hindi: 'Code se pehle requirements align kar lete hain.', word1: 'Starvation', meaning1: 'Resource kabhi na milna', example1: 'Low-priority jobs faced starvation.', word2: 'Quorum', meaning2: 'Majority agreement', example2: 'Writes need a quorum of replicas.', transHindi: 'Retries aur timeouts se system failure gracefully handle karta hai. | Code review aur pairing se junior ko mentor kiya.', transEnglish: 'The system handles failure gracefully with retries and timeouts. | I mentored a junior engineer through code reviews and pairing.', pronFocus: 'linking sounds — Link final consonant to next vowel.', task: 'Colleague/friend se aaj ka phrase real conversation mein use karo.', mono: 'Focus kaise protect karte ho deep work ke liye?', listen: 'Shadow 2-3 min: standup phrases. https://www.youtube.com/results?search_query=standup%20meeting%20English%20phrases%20practice', grammar: 'much / many', grammarEx: 'How much time do we need? | How many tickets are open?', mistakeWrong: 'Discuss about the plan.', mistakeRight: 'Discuss the plan.', mistakeWhy: 'discuss ke baad about nahi.', realUse: 'Meeting mein ek baar aaj ka phrase naturally bolo: "Let us align on the requirements before diving into code."' },
  { day: 75, level: 3, phrase: 'I am confident I can ramp up quickly on new technologies.', context: 'Adaptability.', hindi: 'Nayi tech pe jaldi ramp-up kar sakta/sakti hoon.', word1: 'Replication lag', meaning1: 'Replica pe deri', example1: 'Reporting queries suffered replication lag.', word2: 'Failover', meaning2: 'Healthy node pe shift', example2: 'Automatic failover restored the service.', transHindi: 'Build time kam karke developer experience better kiya. | Aapki team speed aur quality ka balance kaise karti hai?', transEnglish: 'We improved developer experience by reducing build times. | I am curious how your team balances speed and quality.', pronFocus: 'schwa /ə/ — Unstressed vowels become soft uh.', task: 'Word + phrase jodkar bina likhe chhota paragraph bolo.', mono: 'Documentation kyun important hai — example ke saath.', listen: 'Shadow 2-3 min: meeting English. https://www.youtube.com/results?search_query=English%20for%20work%20meetings%20polite%20phrases', grammar: 'some / any', grammarEx: 'I need some context. | Do you have any blockers?', mistakeWrong: 'I am not getting you.', mistakeRight: 'I don\'t understand you. / Could you repeat?', mistakeWhy: 'getting you informal/unclear.', realUse: 'PR comment / review reply mein aaj ka idea English mein likho (phrase related).' },
  { day: 76, level: 3, phrase: 'I measured success using latency and error rate.', context: 'Metrics batate waqt.', hindi: 'Success ko latency aur error rate se measure kiya.', word1: 'Rollback', meaning1: 'Purane version pe lautna', example1: 'We rolled back within three minutes.', word2: 'Rollout', meaning2: 'Dheere-dheere release', example2: 'Do a percentage rollout behind a flag.', transHindi: 'Maine root cause analysis kiya. | Humne SLA miss nahi kiya.', transEnglish: 'I performed a root cause analysis. | We did not miss the SLA.', pronFocus: 'l vs r — Tongue tip up for L, curl for R.', task: 'Kaam ka chhota update aaj ke phrase/word se bolo.', mono: 'Remote collaboration tip jo aap use karte ho.', listen: 'Shadow 2-3 min: interview answer. https://www.youtube.com/results?search_query=job%20interview%20English%20answers%20STAR%20method%20short', grammar: 'in / on / at (time)', grammarEx: 'on Monday / at 3 PM / in June | I will call at noon.', mistakeWrong: 'Do one thing.', mistakeRight: 'Here is an idea. / Can we try this?', mistakeWhy: 'do one thing filler hai; direct bolo.', realUse: 'End-of-day update voice note: aaj ka phrase include karo — "I measured success using latency and error rate."' },
  { day: 77, level: 3, phrase: 'We mitigated risk by rolling out behind a feature flag.', context: 'Risk management.', hindi: 'Feature flag ke peeche rollout karke risk kam kiya.', word1: 'Canary', meaning1: 'Thode users pe pehle test', example1: 'Canary caught the memory leak.', word2: 'Blue-green', meaning2: 'Do identical envs se switch', example2: 'Blue-green deploy cut downtime.', transHindi: 'Observability improve karni thi. | Cache invalidation tricky thi.', transEnglish: 'We needed to improve observability. | Cache invalidation was tricky.', pronFocus: 'f vs p — F = teeth on lip, P = lips together.', task: 'Intro do aur aaj ka phrase zaroor daalo.', mono: 'Interview mein nervousness kaise handle karte ho?', listen: 'Shadow 2-3 min: technical explain. https://www.youtube.com/results?search_query=explain%20a%20bug%20English%20speaking%20practice', grammar: 'in / on / at (place)', grammarEx: 'in the office / on the call / at my desk | Meet me at the lobby.', mistakeWrong: 'Only I am saying...', mistakeRight: 'I am just saying... / What I mean is...', mistakeWhy: 'only placement awkward ho sakta.', realUse: 'Calendar invite note / agenda line mein aaj ka word/phrase touch karo.' },
  { day: 78, level: 3, phrase: 'I documented the decision so the team could revisit it later.', context: 'Documentation habit.', hindi: 'Decision document kiya taaki baad mein revisit ho sake.', word1: 'Feature flag', meaning1: 'Runtime on/off switch', example1: 'Ship dark with a feature flag.', word2: 'Dark launch', meaning2: 'Users ko dikhaye bina live', example2: 'We dark-launched the recommendation API.', transHindi: 'Idempotent API design kiya. | Canary release se risk kam hua.', transEnglish: 'I designed the API to be idempotent. | The canary release reduced risk.', pronFocus: 's vs sh — sh = lips forward, softer.', task: 'Aaj ka phrase mirror ke saamne 5 baar bolo, expression dekho.', mono: 'Ek decision jisme trade-off tha — batao.', listen: 'Shadow 2-3 min: easy conversation. https://www.youtube.com/results?search_query=daily%20English%20conversation%20practice%20for%20beginners', grammar: 'for / since', grammarEx: 'for 2 hours / since morning | I have been stuck since 10.', mistakeWrong: 'It is very much important.', mistakeRight: 'It is very important.', mistakeWhy: 'very much yahan mat lagao.', realUse: 'Slack pe aaj ka phrase use karke 1 short message likho/bolo: "I documented the decision so the team could revisit it later."' },
  { day: 79, level: 3, phrase: 'The bottleneck was in the database query, not the API layer.', context: 'Root cause.', hindi: 'Bottleneck DB query mein thi, API layer mein nahi.', word1: 'Blast radius', meaning1: 'Failure ka failaav', example1: 'Limit blast radius with cell-based design.', word2: 'Degradation', meaning2: 'Quality/speed girna', example2: 'Graceful degradation kept checkout alive.', transHindi: 'Technical debt reduce kiya. | Stakeholders ko update diya.', transEnglish: 'We reduced technical debt. | I updated the stakeholders.', pronFocus: 'z sound — Buzz the z, do not make it s.', task: 'Aaj ke dono words use karke 3 sentences bolo.', mono: 'Customer complaint aaye to soft skills kaise use?', listen: 'Shadow 2-3 min: follow-up phrases. https://www.youtube.com/results?search_query=office%20English%20phrases%20I%20will%20follow%20up', grammar: 'because / so', grammarEx: 'It failed because of timeout. | It was late, so we rolled back.', mistakeWrong: 'I request you to please...', mistakeRight: 'Could you please...?', mistakeWhy: 'request you to please double polite unnatural.', realUse: 'Standup mein aaj ka phrase zaroor daalo: "The bottleneck was in the database query, not the API layer."' },
  { day: 80, level: 3, phrase: 'I proposed a simpler design to reduce operational complexity.', context: 'Simplicity argue.', hindi: 'Operational complexity kam karne ke liye simple design propose kiya.', word1: 'SLO', meaning1: 'Internal reliability target', example1: 'Our SLO is 99.9% monthly availability.', word2: 'SLA', meaning2: 'Customer-facing reliability promise', example2: 'Breaching the SLA triggers credits.', transHindi: 'Scope creep rokna zaroori tha. | Ambiguity clear kar li.', transEnglish: 'It was important to prevent scope creep. | I cleared the ambiguity.', pronFocus: 'ng ending — Keep the soft ng at the end.', task: 'Phone record: 30 second mein aaj ka topic explain karo.', mono: 'English practice ka aaj ka goal kya hai?', listen: 'Shadow 2-3 min: silent letters. https://www.youtube.com/results?search_query=English%20pronunciation%20silent%20letters%20honest%20hour', grammar: 'although / however', grammarEx: 'Although it is hard, I will try. | It works; however, it is slow.', mistakeWrong: 'Update me the status.', mistakeRight: 'Update me on the status. / Send me a status update.', mistakeWhy: 'update me on X.', realUse: 'Kisi colleague se help maangte waqt aaj ka phrase use karo: "I proposed a simpler design to reduce operational complexity."' },
  { day: 81, level: 3, phrase: 'Cross-functional alignment was critical for shipping on time.', context: 'Cross-team work.', hindi: 'Time pe ship karne ke liye cross-functional alignment zaroori tha.', word1: 'Error budget', meaning1: 'Allowed failure room', example1: 'We paused features to protect the error budget.', word2: 'Postmortem', meaning2: 'Incident ke baad analysis', example2: 'Write a blameless postmortem within 48 hours.', transHindi: 'Benchmark results share kiye. | Concurrency bug fix kiya.', transEnglish: 'I shared the benchmark results. | I fixed a concurrency bug.', pronFocus: 'minimal: beach/bitch — Smile longer for ee.', task: 'Colleague/friend se aaj ka phrase real conversation mein use karo.', mono: 'Books vs videos — aap kaise seekhte ho?', listen: 'Shadow 2-3 min: L vs R. https://www.youtube.com/results?search_query=L%20vs%20R%20pronunciation%20practice%20light%20right', grammar: 'if + present, will...', grammarEx: 'If it fails, I will retry. | If you are free, we can sync.', mistakeWrong: 'I am having 5 years experience.', mistakeRight: 'I have 5 years of experience.', mistakeWhy: 'have experience — continuous nahi.', realUse: 'Meeting mein ek baar aaj ka phrase naturally bolo: "Cross-functional alignment was critical for shipping on time."' },
  { day: 82, level: 3, phrase: 'I validated the assumption with a small prototype first.', context: 'Validation habit.', hindi: 'Pehle chhote prototype se assumption validate ki.', word1: 'Root cause', meaning1: 'Asli wajah', example1: 'The root cause was a bad config push.', word2: 'Technical debt', meaning2: 'Jaldbazi ka future cost', example2: 'We scheduled a week to pay technical debt.', transHindi: 'Schema migration carefully ki. | Telemetry se issue mila.', transEnglish: 'I carefully handled the schema migration. | Telemetry helped us find the issue.', pronFocus: 'minimal: walk/work — work = er sound, walk = aw.', task: 'Word + phrase jodkar bina likhe chhota paragraph bolo.', mono: 'Health + work balance short take.', listen: 'Shadow 2-3 min: F vs P. https://www.youtube.com/results?search_query=F%20vs%20P%20pronunciation%20coffee%20copy', grammar: 'countable vs uncountable', grammarEx: 'two tasks / some information | advice (not advices)', mistakeWrong: 'He told that he is free.', mistakeRight: 'He said that he is free. / He told me that...', mistakeWhy: 'tell needs object (told me).', realUse: 'PR comment / review reply mein aaj ka idea English mein likho (phrase related).' },
  { day: 83, level: 3, phrase: 'We chose consistency over premature optimization.', context: 'Engineering judgment.', hindi: 'Premature optimization se pehle consistency choose ki.', word1: 'Abstraction', meaning1: 'Details hide karke simple interface', example1: 'Pick the right abstraction for storage.', word2: 'Encapsulation', meaning2: 'Data+logic band karna', example2: 'Encapsulation keeps invariants safe.', transHindi: 'Incident response lead kiya. | Rollback within minutes hua.', transEnglish: 'I led the incident response. | We rolled back within minutes.', pronFocus: 'ask /ɑːsk/ vs /æsk/ — Pick one accent and stay consistent.', task: 'Kaam ka chhota update aaj ke phrase/word se bolo.', mono: 'Favourite programming concept simple words mein.', listen: 'Shadow 2-3 min: s vs sh. https://www.youtube.com/results?search_query=S%20vs%20SH%20pronunciation%20see%20she', grammar: 'this / that / these / those', grammarEx: 'This bug is new. | Those logs look old.', mistakeWrong: 'Close the call.', mistakeRight: 'End the call. / Hang up.', mistakeWhy: 'end the call more natural.', realUse: 'End-of-day update voice note: aaj ka phrase include karo — "We chose consistency over premature optimization."' },
  { day: 84, level: 3, phrase: 'I owned the postmortem and drove the follow-up actions.', context: 'Incident ownership.', hindi: 'Postmortem own kiya aur follow-ups drive kiye.', word1: 'Cohesion', meaning1: 'Related cheezein saath', example1: 'High cohesion makes modules easier to change.', word2: 'Coupling', meaning2: 'Modules ka interdependence', example2: 'Loose coupling lets teams move independently.', transHindi: 'Contract tests add kiye. | Partition strategy revisit ki.', transEnglish: 'I added contract tests. | We revisited the partition strategy.', pronFocus: 'schedule — US: SKED-jool is common in tech.', task: 'Intro do aur aaj ka phrase zaroor daalo.', mono: 'Agar mentor banoge to pehli advice kya?', listen: 'Shadow 2-3 min: pause at commas. https://www.youtube.com/results?search_query=English%20chunking%20pauses%20speak%20clearly', grammar: 'Comparatives', grammarEx: 'faster than / more scalable than | This is clearer than before.', mistakeWrong: 'Share your screen share.', mistakeRight: 'Please share your screen.', mistakeWhy: 'screen share dobara mat bolo.', realUse: 'Calendar invite note / agenda line mein aaj ka word/phrase touch karo.' },
  { day: 85, level: 3, phrase: 'My role was to translate product goals into technical milestones.', context: 'Role clarify.', hindi: 'Product goals ko technical milestones mein translate kiya.', word1: 'Idempotency key', meaning1: 'Duplicate request rokne ka key', example1: 'Clients send an idempotency key with charges.', word2: 'Schema migration', meaning2: 'DB structure change carefully', example2: 'Plan a backward-compatible schema migration.', transHindi: 'Availability target 99.9% tha. | Consistency model explain kiya.', transEnglish: 'The availability target was 99.9%. | I explained the consistency model.', pronFocus: 'data — Both OK — stay consistent in one talk.', task: 'Aaj ka phrase mirror ke saamne 5 baar bolo, expression dekho.', mono: 'System slow ho to kaise debug start?', listen: 'Listen 2-3 min: tense contrast (optional). https://www.youtube.com/results?search_query=present%20perfect%20vs%20past%20simple%20English%20explanation%20short', grammar: 'Superlatives', grammarEx: 'the fastest / the most important | This is the main risk.', mistakeWrong: 'I am on leave from tomorrow.', mistakeRight: 'I am on leave starting tomorrow. / I will be on leave from tomorrow.', mistakeWhy: 'starting tomorrow clear.', realUse: 'Slack pe aaj ka phrase use karke 1 short message likho/bolo: "My role was to translate product goals into technical milestones."' },
  { day: 86, level: 3, phrase: 'I would ask clarifying questions before proposing a solution.', context: 'Interview mindset.', hindi: 'Solution se pehle clarifying questions poochunga/poochungi.', word1: 'Contract test', meaning1: 'API agreement verify', example1: 'Contract tests caught a breaking change.', word2: 'Chaos engineering', meaning2: 'Failure inject karke seekhna', example2: 'Chaos experiments improved our runbooks.', transHindi: 'Queue backlog clear kiya. | Circuit breaker add kiya.', transEnglish: 'We cleared the queue backlog. | I added a circuit breaker.', pronFocus: 'route — In networking, root is common.', task: 'Aaj ke dono words use karke 3 sentences bolo.', mono: 'Feature ship karne se pehle checklist bolo.', listen: 'Listen 2-3 min: articles. https://www.youtube.com/results?search_query=articles%20a%20an%20the%20English%20short%20lesson', grammar: 'Passive (simple)', grammarEx: 'The bug was fixed. | The PR was approved.', mistakeWrong: 'Doubt clearance session.', mistakeRight: 'Q&A session. / Clarification session.', mistakeWhy: 'doubt clearance Indian-campus tone.', realUse: 'Standup mein aaj ka phrase zaroor daalo: "I would ask clarifying questions before proposing a solution."' },
  { day: 87, level: 3, phrase: 'The system handles failure gracefully with retries and timeouts.', context: 'Reliability.', hindi: 'Retries aur timeouts se system failure gracefully handle karta hai.', word1: 'Horizontal scaling', meaning1: 'Machines badha ke scale', example1: 'Horizontal scaling handled the traffic spike.', word2: 'Vertical scaling', meaning2: 'Badi machine se scale', example2: 'Vertical scaling hit a cost ceiling.', transHindi: 'Rate limiting enable ki. | Authz checks tighten kiye.', transEnglish: 'We enabled rate limiting. | We tightened the authorization checks.', pronFocus: 'intonation up/down — Questions often rise; statements fall.', task: 'Phone record: 30 second mein aaj ka topic explain karo.', mono: 'Conflict teammate se — professionally resolve kaise?', listen: 'Listen 2-3 min: in/on/at. https://www.youtube.com/results?search_query=prepositions%20in%20on%20at%20English%20short', grammar: 'Reported speech (basic)', grammarEx: 'He said he was blocked. | She asked if I was free.', mistakeWrong: 'Please find the attached.', mistakeRight: 'Please find the attachment. / Attached is the file.', mistakeWhy: 'find attached / attachment.', realUse: 'Kisi colleague se help maangte waqt aaj ka phrase use karo: "The system handles failure gracefully with retries and timeouts."' },
  { day: 88, level: 3, phrase: 'I mentored a junior engineer through code reviews and pairing.', context: 'Mentorship.', hindi: 'Code review aur pairing se junior ko mentor kiya.', word1: 'Sharding', meaning1: 'Data tukdon mein baantna', example1: 'We shard by tenant id.', word2: 'Caching strategy', meaning2: 'Kya/kab cache karna', example2: 'Explain your caching strategy and TTLs.', transHindi: 'PII masking ensure ki. | Capacity planning ki.', transEnglish: 'We ensured PII masking. | I did the capacity planning.', pronFocus: 'chunking pauses — Pause at commas and idea breaks.', task: 'Colleague/friend se aaj ka phrase real conversation mein use karo.', mono: 'Success metric for today\'s practice.', listen: 'Shadow 2-3 min: polite requests. https://www.youtube.com/results?search_query=English%20email%20phrases%20could%20you%20please', grammar: 'Question forms', grammarEx: 'What is the impact? | Where should I start?', mistakeWrong: 'I will check and revert.', mistakeRight: 'I will check and get back to you.', mistakeWhy: 'get back to you natural.', realUse: 'Meeting mein ek baar aaj ka phrase naturally bolo: "I mentored a junior engineer through code reviews and pairing."' },
  { day: 89, level: 3, phrase: 'We improved developer experience by reducing build times.', context: 'DX improvement.', hindi: 'Build time kam karke developer experience better kiya.', word1: 'Invalidation', meaning1: 'Purana cache hataana', example1: 'Cache invalidation caused a brief thundering herd.', word2: 'Optimistic locking', meaning2: 'Version check se conflict handle', example2: 'Use optimistic locking for concurrent edits.', transHindi: 'Cost optimization drive kiya. | On-call runbook update kiya.', transEnglish: 'I drove cost optimization. | I updated the on-call runbook.', pronFocus: 'filler control — Replace um with a short pause.', task: 'Word + phrase jodkar bina likhe chhota paragraph bolo.', mono: 'Ek open-source tool jo pasand hai — kyun?', listen: 'Shadow 2-3 min: call English. https://www.youtube.com/results?search_query=English%20phone%20call%20phrases%20can%20you%20hear%20me', grammar: 'Tag questions (light)', grammarEx: 'It is ready, right? | You can join, can\'t you?', mistakeWrong: 'Lakh of users.', mistakeRight: 'Hundreds of thousands of users. / About 100,000 users.', mistakeWhy: 'international audience ke liye numbers clear.', realUse: 'PR comment / review reply mein aaj ka idea English mein likho (phrase related).' },
  { day: 90, level: 3, phrase: 'I am curious how your team balances speed and quality.', context: 'Smart reverse Q.', hindi: 'Aapki team speed aur quality ka balance kaise karti hai?', word1: 'Pessimistic locking', meaning1: 'Pehle lock leke edit', example1: 'Pessimistic locking serialized inventory updates.', word2: 'Backfill', meaning2: 'Purana data baad mein bharna', example2: 'Run a backfill after adding the new column.', transHindi: 'Architecture decision record likha. | Interview mein STAR format use kiya.', transEnglish: 'I wrote an architecture decision record. | I used the STAR format in the interview.', pronFocus: 'clarity over speed — Clarity pehle, speed baad mein.', task: 'Kaam ka chhota update aaj ke phrase/word se bolo.', mono: '30 din baad English mein kya better hona chahiye?', listen: 'Shadow 2-3 min: tech vocab. https://www.youtube.com/results?search_query=tech%20English%20vocabulary%20scalable%20optimize%20short', grammar: 'Articles with roles', grammarEx: 'I am a developer. | She is the owner of this module.', mistakeWrong: 'Pin code.', mistakeRight: 'ZIP code (US) / postal code', mistakeWhy: 'audience ke hisaab se postal/ZIP.', realUse: 'End-of-day update voice note: aaj ka phrase include karo — "I am curious how your team balances speed and quality."' }
];
}

function getPhraseData_() {
  return [
  { level: 1, day: 1, phrase: 'I am going to work.', context: 'Roz subah bolo jab office ke liye niklo.', hindi: 'Main kaam pe ja raha/rahi hoon.' },
  { level: 1, day: 2, phrase: 'This is easy.', context: 'Jab koi simple kaam kar rahe ho.', hindi: 'Ye aasan hai.' },
  { level: 1, day: 3, phrase: 'I like this.', context: 'Kisi cheez ko pasand karte waqt.', hindi: 'Mujhe ye pasand hai.' },
  { level: 1, day: 4, phrase: 'Can you help me?', context: 'Kisi se madad maangte waqt.', hindi: 'Kya aap meri madad kar sakte ho?' },
  { level: 1, day: 5, phrase: 'I do not know this.', context: 'Jab kuch samajh na aaye.', hindi: 'Mujhe ye nahi pata.' },
  { level: 1, day: 6, phrase: 'This is hard for me.', context: 'Mushkil kaam ke baare mein.', hindi: 'Ye mere liye mushkil hai.' },
  { level: 1, day: 7, phrase: 'I will try again.', context: 'Failure ke baad motivate karne ke liye.', hindi: 'Main phir se koshish karunga/karungi.' },
  { level: 1, day: 8, phrase: 'What is this?', context: 'Naye object/concept ke baare mein poochte waqt.', hindi: 'Ye kya hai?' },
  { level: 1, day: 9, phrase: 'I am happy today.', context: 'Din ke start mein mood bolo.', hindi: 'Aaj main khush hoon.' },
  { level: 1, day: 10, phrase: 'I need more time.', context: 'Deadline mangte waqt.', hindi: 'Mujhe thoda aur time chahiye.' },
  { level: 1, day: 11, phrase: 'Let us start now.', context: 'Kaam shuru karte waqt.', hindi: 'Chalo ab shuru karte hain.' },
  { level: 1, day: 12, phrase: 'I made a mistake.', context: 'Galti maanne ke liye.', hindi: 'Maine ek galti ki.' },
  { level: 1, day: 13, phrase: 'That sounds good.', context: 'Idea approve karte waqt.', hindi: 'Ye theek lagta hai.' },
  { level: 1, day: 14, phrase: 'I am not sure.', context: 'Doubt hone par honestly.', hindi: 'Mujhe sure nahi hai.' },
  { level: 1, day: 15, phrase: 'Let me check.', context: 'Verify karne se pehle.', hindi: 'Main check karta/karti hoon.' },
  { level: 1, day: 16, phrase: 'Please wait a minute.', context: 'Thoda time maangte waqt.', hindi: 'Please ek minute rukna.' },
  { level: 1, day: 17, phrase: 'I finished my work.', context: 'Kaam khatam hone par.', hindi: 'Maine apna kaam khatam kar liya.' },
  { level: 1, day: 18, phrase: 'How are you?', context: 'Greeting mein.', hindi: 'Aap kaise ho?' },
  { level: 1, day: 19, phrase: 'Nice to meet you.', context: 'Pehli mulakat mein.', hindi: 'Aapse milkar khushi hui.' },
  { level: 1, day: 20, phrase: 'I am learning English.', context: 'Apna goal batate waqt.', hindi: 'Main English seekh raha/rahi hoon.' },
  { level: 1, day: 21, phrase: 'Can you say that again?', context: 'Jab clearly na suna ho.', hindi: 'Kya aap phir se bol sakte ho?' },
  { level: 1, day: 22, phrase: 'I understand now.', context: 'Samajh aa jane par.', hindi: 'Ab mujhe samajh aa gaya.' },
  { level: 1, day: 23, phrase: 'Thank you so much.', context: 'Shukriya karte waqt.', hindi: 'Bahut shukriya.' },
  { level: 1, day: 24, phrase: 'Sorry for the delay.', context: 'Late hone par.', hindi: 'Deri ke liye maafi.' },
  { level: 1, day: 25, phrase: 'I will call you later.', context: 'Baad mein baat karne ke liye.', hindi: 'Main baad mein call karta/karti hoon.' },
  { level: 1, day: 26, phrase: 'Where should I sit?', context: 'Meeting room mein.', hindi: 'Main kahan baithoon?' },
  { level: 1, day: 27, phrase: 'Is this correct?', context: 'Confirm karte waqt.', hindi: 'Kya ye sahi hai?' },
  { level: 1, day: 28, phrase: 'I am ready.', context: 'Shuru hone ke liye.', hindi: 'Main taiyaar hoon.' },
  { level: 1, day: 29, phrase: 'Please speak slowly.', context: 'Samajhne ke liye request.', hindi: 'Please dheere bolo.' },
  { level: 1, day: 30, phrase: 'Have a good day.', context: 'Din ke end mein.', hindi: 'Aapka din accha rahe.' },
  { level: 2, day: 31, phrase: 'I think this will work.', context: 'Opinion dete waqt confidently.', hindi: 'Mujhe lagta hai ye kaam karega.' },
  { level: 2, day: 32, phrase: 'Let me explain this quickly.', context: 'Samjhane se pehle.', hindi: 'Main jaldi se explain karta/karti hoon.' },
  { level: 2, day: 33, phrase: 'I am not sure, let me check and get back to you.', context: 'Jab turant answer na ho.', hindi: 'Sure nahi, check karke aapko batata/batati hoon.' },
  { level: 2, day: 34, phrase: 'That makes sense.', context: 'Jab baat samajh aa jaye.', hindi: 'Ye baat samajh aa gayi.' },
  { level: 2, day: 35, phrase: 'Can you repeat that, please?', context: 'Clearly sunai na de.', hindi: 'Please phir se bolna.' },
  { level: 2, day: 36, phrase: 'I have a question about this.', context: 'Meeting mein doubt clear karte waqt.', hindi: 'Iske baare mein ek sawaal hai.' },
  { level: 2, day: 37, phrase: 'Let us go with this approach.', context: 'Decision finalize karte waqt.', hindi: 'Chalo isi approach pe chalte hain.' },
  { level: 2, day: 38, phrase: 'I will take care of it.', context: 'Responsibility lete waqt.', hindi: 'Main iska dhyan rakhunga/rakhungi.' },
  { level: 2, day: 39, phrase: 'This is a bit different from what I expected.', context: 'Mismatch politely note karte waqt.', hindi: 'Ye thoda alag hai jo maine socha tha.' },
  { level: 2, day: 40, phrase: 'Could you give me an example?', context: 'Concept clear karne ke liye.', hindi: 'Kya ek example de sakte ho?' },
  { level: 2, day: 41, phrase: 'I agree with most of this, but I have one concern.', context: 'Partial agreement.', hindi: 'Zyadatar agree, lekin ek concern hai.' },
  { level: 2, day: 42, phrase: 'Let us move on to the next point.', context: 'Discussion aage badhate waqt.', hindi: 'Agle point pe chalte hain.' },
  { level: 2, day: 43, phrase: 'I appreciate your help with this.', context: 'Professionally thank karte waqt.', hindi: 'Is madad ke liye shukriya.' },
  { level: 2, day: 44, phrase: 'I will follow up on this by tomorrow.', context: 'Commitment dete waqt.', hindi: 'Kal tak ispe follow-up karta/karti hoon.' },
  { level: 2, day: 45, phrase: 'That is a good point.', context: 'Acknowledge karte waqt.', hindi: 'Ye accha point hai.' },
  { level: 2, day: 46, phrase: 'Can we sync for five minutes?', context: 'Short discussion maangte waqt.', hindi: 'Kya paanch minute sync kar sakte hain?' },
  { level: 2, day: 47, phrase: 'I am blocked on this right now.', context: 'Blocker batate waqt.', hindi: 'Abhi main ispe blocked hoon.' },
  { level: 2, day: 48, phrase: 'Let me share my screen.', context: 'Demo/walkthrough se pehle.', hindi: 'Main screen share karta/karti hoon.' },
  { level: 2, day: 49, phrase: 'Could you clarify the requirement?', context: 'Clearity maangte waqt.', hindi: 'Requirement thodi clear kar doge?' },
  { level: 2, day: 50, phrase: 'I will update the document after the call.', context: 'Post-meeting commitment.', hindi: 'Call ke baad document update karunga/karungi.' },
  { level: 2, day: 51, phrase: 'Sorry, I missed that. Could you say it again?', context: 'Meeting mein miss hone par.', hindi: 'Miss ho gaya, phir se bolna please.' },
  { level: 2, day: 52, phrase: 'I am available after lunch.', context: 'Availability batate waqt.', hindi: 'Lunch ke baad free hoon.' },
  { level: 2, day: 53, phrase: 'Let us park this for now.', context: 'Topic baad ke liye rakhte waqt.', hindi: 'Abhi isko baad ke liye rakhte hain.' },
  { level: 2, day: 54, phrase: 'I need your input on this decision.', context: 'Opinion maangte waqt.', hindi: 'Is decision pe aapki input chahiye.' },
  { level: 2, day: 55, phrase: 'That works for me.', context: 'Agreement express karte waqt.', hindi: 'Mujhe ye theek hai.' },
  { level: 2, day: 56, phrase: 'I will send a summary after this.', context: 'Meeting wrap-up.', hindi: 'Iske baad summary bhejta/bhejti hoon.' },
  { level: 2, day: 57, phrase: 'Can we keep this short?', context: 'Time manage karte waqt.', hindi: 'Kya isko short rakh sakte hain?' },
  { level: 2, day: 58, phrase: 'I am catching up on the context.', context: 'Late join hone par.', hindi: 'Main context catch-up kar raha/rahi hoon.' },
  { level: 2, day: 59, phrase: 'Please correct me if I am wrong.', context: 'Humble clarification.', hindi: 'Agar galat hoon to correct kar dena.' },
  { level: 2, day: 60, phrase: 'Looking forward to working with you.', context: 'Nayi collaboration shuru karte waqt.', hindi: 'Aapke saath kaam ka wait hai.' },
  { level: 3, day: 61, phrase: 'Let me walk you through my approach.', context: 'Interview mein solution explain karne se pehle.', hindi: 'Main apna approach step-by-step batata/batati hoon.' },
  { level: 3, day: 62, phrase: 'The main challenge here was scalability.', context: 'Project problem describe karte waqt.', hindi: 'Yahan sabse badi challenge scalability thi.' },
  { level: 3, day: 63, phrase: 'To optimize this, I refactored the logic.', context: 'Technical improvement explain karte waqt.', hindi: 'Optimize karne ke liye maine logic refactor kiya.' },
  { level: 3, day: 64, phrase: 'There is a trade-off between speed and accuracy here.', context: 'Design decision justify karte waqt.', hindi: 'Yahan speed aur accuracy ke beech trade-off hai.' },
  { level: 3, day: 65, phrase: 'I would prioritize this based on business impact.', context: 'Prioritization jawab.', hindi: 'Main business impact ke hisaab se prioritize karunga/karungi.' },
  { level: 3, day: 66, phrase: 'Let me break this down step by step.', context: 'Complex answer structure.', hindi: 'Main isko step-by-step todta/todti hoon.' },
  { level: 3, day: 67, phrase: 'In hindsight, I would have approached it differently.', context: 'Reflection question.', hindi: 'Aaj sochun to alag approach leta/leti.' },
  { level: 3, day: 68, phrase: 'This design is scalable and easy to maintain.', context: 'System design discuss.', hindi: 'Ye design scalable aur maintainable hai.' },
  { level: 3, day: 69, phrase: 'I collaborated closely with the backend team on this.', context: 'Teamwork example.', hindi: 'Maine backend team ke saath milkar kaam kiya.' },
  { level: 3, day: 70, phrase: 'That is a great question, let me think about it for a second.', context: 'Time lene ke liye gracefully.', hindi: 'Accha sawaal hai, ek second sochne do.' },
  { level: 3, day: 71, phrase: 'My key takeaway from that project was the importance of testing.', context: 'Learning question.', hindi: 'Usssi project se testing ki importance seekhi.' },
  { level: 3, day: 72, phrase: 'I would love to learn more about the team\'s tech stack.', context: 'Reverse question.', hindi: 'Team ke tech stack ke baare mein aur jaanna chahunga/chahungi.' },
  { level: 3, day: 73, phrase: 'I took ownership of the entire module end to end.', context: 'Ownership highlight.', hindi: 'Maine poora module end-to-end sambhala.' },
  { level: 3, day: 74, phrase: 'Let us align on the requirements before diving into code.', context: 'Clarification.', hindi: 'Code se pehle requirements align kar lete hain.' },
  { level: 3, day: 75, phrase: 'I am confident I can ramp up quickly on new technologies.', context: 'Adaptability.', hindi: 'Nayi tech pe jaldi ramp-up kar sakta/sakti hoon.' },
  { level: 3, day: 76, phrase: 'I measured success using latency and error rate.', context: 'Metrics batate waqt.', hindi: 'Success ko latency aur error rate se measure kiya.' },
  { level: 3, day: 77, phrase: 'We mitigated risk by rolling out behind a feature flag.', context: 'Risk management.', hindi: 'Feature flag ke peeche rollout karke risk kam kiya.' },
  { level: 3, day: 78, phrase: 'I documented the decision so the team could revisit it later.', context: 'Documentation habit.', hindi: 'Decision document kiya taaki baad mein revisit ho sake.' },
  { level: 3, day: 79, phrase: 'The bottleneck was in the database query, not the API layer.', context: 'Root cause.', hindi: 'Bottleneck DB query mein thi, API layer mein nahi.' },
  { level: 3, day: 80, phrase: 'I proposed a simpler design to reduce operational complexity.', context: 'Simplicity argue.', hindi: 'Operational complexity kam karne ke liye simple design propose kiya.' },
  { level: 3, day: 81, phrase: 'Cross-functional alignment was critical for shipping on time.', context: 'Cross-team work.', hindi: 'Time pe ship karne ke liye cross-functional alignment zaroori tha.' },
  { level: 3, day: 82, phrase: 'I validated the assumption with a small prototype first.', context: 'Validation habit.', hindi: 'Pehle chhote prototype se assumption validate ki.' },
  { level: 3, day: 83, phrase: 'We chose consistency over premature optimization.', context: 'Engineering judgment.', hindi: 'Premature optimization se pehle consistency choose ki.' },
  { level: 3, day: 84, phrase: 'I owned the postmortem and drove the follow-up actions.', context: 'Incident ownership.', hindi: 'Postmortem own kiya aur follow-ups drive kiye.' },
  { level: 3, day: 85, phrase: 'My role was to translate product goals into technical milestones.', context: 'Role clarify.', hindi: 'Product goals ko technical milestones mein translate kiya.' },
  { level: 3, day: 86, phrase: 'I would ask clarifying questions before proposing a solution.', context: 'Interview mindset.', hindi: 'Solution se pehle clarifying questions poochunga/poochungi.' },
  { level: 3, day: 87, phrase: 'The system handles failure gracefully with retries and timeouts.', context: 'Reliability.', hindi: 'Retries aur timeouts se system failure gracefully handle karta hai.' },
  { level: 3, day: 88, phrase: 'I mentored a junior engineer through code reviews and pairing.', context: 'Mentorship.', hindi: 'Code review aur pairing se junior ko mentor kiya.' },
  { level: 3, day: 89, phrase: 'We improved developer experience by reducing build times.', context: 'DX improvement.', hindi: 'Build time kam karke developer experience better kiya.' },
  { level: 3, day: 90, phrase: 'I am curious how your team balances speed and quality.', context: 'Smart reverse Q.', hindi: 'Aapki team speed aur quality ka balance kaise karti hai?' }
];
}

function getVocabData_() {
  return [
  { word: 'Articulate', meaning: 'Clearly aur precisely bolna/likhna', example: 'I need to articulate my approach better.', level: 1 },
  { word: 'Hesitate', meaning: 'Rukna / der karna (doubt se)', example: 'Do not hesitate to ask clarifying questions.', level: 1 },
  { word: 'Assume', meaning: 'Bina proof ke maan lena', example: 'Let us not assume the API is idempotent.', level: 1 },
  { word: 'Clarify', meaning: 'Saaf / clear karna', example: 'Can you clarify the acceptance criteria?', level: 1 },
  { word: 'Outline', meaning: 'Sankshipt structure batana', example: 'Let me outline the migration steps.', level: 1 },
  { word: 'Elaborate', meaning: 'Zyada detail mein explain karna', example: 'Could you elaborate on the edge cases?', level: 1 },
  { word: 'Summarize', meaning: 'Short mein jist nikalna', example: 'Summarize the incident in two minutes.', level: 1 },
  { word: 'Emphasize', meaning: 'Zor dena / highlight karna', example: 'I want to emphasize the latency risk.', level: 1 },
  { word: 'Acknowledge', meaning: 'Maanna / accept karna', example: 'I acknowledge the delay on my side.', level: 1 },
  { word: 'Rephrase', meaning: 'Doosre words mein kehna', example: 'Let me rephrase that more simply.', level: 1 },
  { word: 'Infer', meaning: 'Hints se nateeja nikalna', example: 'From the logs, I infer a race condition.', level: 1 },
  { word: 'Imply', meaning: 'Seedha na kehke suggest karna', example: 'The metrics imply a cache miss problem.', level: 1 },
  { word: 'Justify', meaning: 'Reason dekar defend karna', example: 'How would you justify this design choice?', level: 1 },
  { word: 'Evaluate', meaning: 'Jaanch kar ke behtari decide karna', example: 'We evaluated three caching options.', level: 1 },
  { word: 'Assess', meaning: 'Andaza / assessment lena', example: 'Assess the blast radius before rolling out.', level: 1 },
  { word: 'Anticipate', meaning: 'Pehle se expect karna', example: 'I anticipate higher load during the sale.', level: 1 },
  { word: 'Overlook', meaning: 'Chhod dena / miss karna', example: 'We overlooked a null-check in validation.', level: 1 },
  { word: 'Underestimate', meaning: 'Kam aakna', example: 'Do not underestimate migration complexity.', level: 1 },
  { word: 'Overestimate', meaning: 'Zyada aakna', example: 'We overestimated how fast we could ship.', level: 1 },
  { word: 'Compromise', meaning: 'Compromise / beech ka raasta', example: 'We had to compromise on some polish.', level: 1 },
  { word: 'Negotiate', meaning: 'Baatcheet se terms fix karna', example: 'I negotiated a smaller scope for v1.', level: 1 },
  { word: 'Persuade', meaning: 'Manana', example: 'I persuaded the team to add monitoring first.', level: 1 },
  { word: 'Discourage', meaning: 'Himmat todna / rokna', example: 'Lack of tests discourages refactors.', level: 1 },
  { word: 'Encourage', meaning: 'Protshahan dena', example: 'Code reviews encourage better design.', level: 1 },
  { word: 'Contribute', meaning: 'Yogdaan dena', example: 'I contributed to the design doc.', level: 1 },
  { word: 'Coordinate', meaning: 'Milakar timing/work set karna', example: 'I coordinated with QA on the release.', level: 1 },
  { word: 'Facilitate', meaning: 'Aasaan banana / help karna', example: 'I facilitated the grooming session.', level: 1 },
  { word: 'Initiate', meaning: 'Shuru karna (formal)', example: 'I initiated the postmortem discussion.', level: 1 },
  { word: 'Resume', meaning: 'Phir se shuru karna', example: 'We can resume the rollout after the fix.', level: 1 },
  { word: 'Postpone', meaning: 'Baad mein shift karna', example: 'Let us postpone the release by a day.', level: 1 },
  { word: 'Prioritize', meaning: 'Pehle kya — order dena', example: 'I prioritized customer-facing bugs.', level: 1 },
  { word: 'Delegate', meaning: 'Kaam kisi aur ko dena', example: 'I delegated the UI polish to a teammate.', level: 1 },
  { word: 'Supervise', meaning: 'Dekh-bhaal karna', example: 'I supervised the junior on the first PR.', level: 1 },
  { word: 'Validate', meaning: 'Sahi hai ya nahi check karna', example: 'Validate the assumption with a prototype.', level: 1 },
  { word: 'Verify', meaning: 'Confirm / double-check karna', example: 'Verify the fix on staging first.', level: 1 },
  { word: 'Inspect', meaning: 'Bariq se dekhna', example: 'Inspect the slow query plan carefully.', level: 1 },
  { word: 'Diagnose', meaning: 'Problem ki wajah dhundhna', example: 'I diagnosed a memory leak in the worker.', level: 1 },
  { word: 'Resolve', meaning: 'Hal nikalna', example: 'We resolved the merge conflicts today.', level: 1 },
  { word: 'Address', meaning: 'Issue pe kaam / jawab dena', example: 'How did you address the scalability concern?', level: 1 },
  { word: 'Tackle', meaning: 'Nibhana / face karna', example: 'I tackled the flaky tests first.', level: 1 },
  { word: 'Navigate', meaning: 'Mushkil situation sambhalna', example: 'I navigated conflicting stakeholder needs.', level: 1 },
  { word: 'Adapt', meaning: 'Badalte hisaab se dhalna', example: 'I adapt quickly to new codebases.', level: 1 },
  { word: 'Iterate', meaning: 'Baar-baar improve karna', example: 'We iterated on the UX based on feedback.', level: 1 },
  { word: 'Refine', meaning: 'Aur behtar banana', example: 'Refine the error messages for users.', level: 1 },
  { word: 'Simplify', meaning: 'Simple banana', example: 'Simplify the API surface for clients.', level: 1 },
  { word: 'Streamline', meaning: 'Process ko seedha/efficient banana', example: 'We streamlined the onboarding checklist.', level: 1 },
  { word: 'Consolidate', meaning: 'Ek jagah jodna', example: 'Consolidate duplicate config files.', level: 1 },
  { word: 'Distinguish', meaning: 'Faraq samajhna', example: 'Distinguish symptoms from root cause.', level: 1 },
  { word: 'Demonstrate', meaning: 'Dikha ke prove karna', example: 'Demonstrate the bug with a repro script.', level: 1 },
  { word: 'Illustrate', meaning: 'Example se samjhana', example: 'Illustrate the flow with a sequence diagram.', level: 1 },
  { word: 'Convey', meaning: 'Baat pahunchana', example: 'I conveyed the risk to product clearly.', level: 1 },
  { word: 'Express', meaning: 'Apni baat kehna', example: 'Express disagreement politely in the review.', level: 1 },
  { word: 'Interpret', meaning: 'Matlab nikalna', example: 'How do you interpret these latency spikes?', level: 1 },
  { word: 'Perceive', meaning: 'Mahsoos / dekhna', example: 'Users perceive the app as slow.', level: 1 },
  { word: 'Recognize', meaning: 'Pehchanna / maanna', example: 'I recognize this was a process failure.', level: 1 },
  { word: 'Recall', meaning: 'Yaad karna', example: 'I recall we hit this bug last quarter.', level: 1 },
  { word: 'Retain', meaning: 'Yaad / rakh ke rakhna', example: 'Retain the feature flag for two weeks.', level: 1 },
  { word: 'Omit', meaning: 'Chhod dena (jaan-bujh ke)', example: 'Omit optional fields from the payload.', level: 1 },
  { word: 'Exclude', meaning: 'Bahar rakhna', example: 'Exclude staging traffic from the alert.', level: 1 },
  { word: 'Include', meaning: 'Shamil karna', example: 'Include rollback steps in the runbook.', level: 1 },
  { word: 'Escalate', meaning: 'Upar / serious channel pe le jana', example: 'Escalate if the outage crosses 15 minutes.', level: 2 },
  { word: 'Bandwidth', meaning: 'Time/capacity jo available ho', example: 'I do not have bandwidth for a new project.', level: 2 },
  { word: 'Stakeholder', meaning: 'Jiska interest/asar ho', example: 'Align stakeholders before changing scope.', level: 2 },
  { word: 'Nuance', meaning: 'Fine difference / bariq baat', example: 'There is a nuance between latency and lag.', level: 2 },
  { word: 'Proactive', meaning: 'Problem aane se pehle action', example: 'Be proactive about flagging risks early.', level: 2 },
  { word: 'Reactive', meaning: 'Problem ke baad react karna', example: 'We were too reactive during the incident.', level: 2 },
  { word: 'Actionable', meaning: 'Jispe seedha kaam ho sake', example: 'Give actionable feedback in the review.', level: 2 },
  { word: 'Blocker', meaning: 'Jo aage badhne se roke', example: 'My only blocker is the missing API key.', level: 2 },
  { word: 'Dependency', meaning: 'Dusri cheez pe nirbhar', example: 'We have a dependency on the auth team.', level: 2 },
  { word: 'Deliverable', meaning: 'Jo deliver karna hai', example: 'The deliverable is a design doc by Friday.', level: 2 },
  { word: 'Milestone', meaning: 'Bada checkpoint', example: 'We hit the beta milestone this week.', level: 2 },
  { word: 'Timeline', meaning: 'Kab-tak ka plan', example: 'Share a realistic timeline for the rewrite.', level: 2 },
  { word: 'Bandwidth-constrained', meaning: 'Time/people kam hone ki wajah se limited', example: 'We are bandwidth-constrained this sprint.', level: 2 },
  { word: 'Tradeoff', meaning: 'Ek fayda vs doosra nuksaan', example: 'Explain the tradeoff of caching aggressively.', level: 2 },
  { word: 'Constraint', meaning: 'Seema / had', example: 'Memory is the main constraint on mobile.', level: 2 },
  { word: 'Scope creep', meaning: 'Scope dheere-dheere badhna', example: 'Avoid scope creep in the MVP.', level: 2 },
  { word: 'Alignment', meaning: 'Sab ek page pe hona', example: 'We need alignment on the success metrics.', level: 2 },
  { word: 'Buy-in', meaning: 'Support / agreement milna', example: 'Get buy-in from eng managers first.', level: 2 },
  { word: 'Hand-off', meaning: 'Kaam transfer karna', example: 'Document the hand-off for on-call.', level: 2 },
  { word: 'Sync-up', meaning: 'Short alignment meeting', example: 'Can we do a quick sync-up after standup?', level: 2 },
  { word: 'Follow-through', meaning: 'Promise ke baad complete karna', example: 'Strong follow-through builds trust.', level: 2 },
  { word: 'Accountable', meaning: 'Zimmedar (result ke liye)', example: 'I am accountable for the release quality.', level: 2 },
  { word: 'Ownership', meaning: 'Poori zimmedari lena', example: 'I took ownership of the payment module.', level: 2 },
  { word: 'Visibility', meaning: 'Dikhai / transparency', example: 'Add logging for better visibility.', level: 2 },
  { word: 'Transparency', meaning: 'Khula / clear communication', example: 'Transparency during outages reduces panic.', level: 2 },
  { word: 'Friction', meaning: 'Rukaawat / inconvenience', example: 'Too many approvals create friction.', level: 2 },
  { word: 'Bottleneck', meaning: 'Sabse slow / blocking part', example: 'Code review was the bottleneck.', level: 2 },
  { word: 'Workload', meaning: 'Kaam ka load', example: 'Balance the workload across the team.', level: 2 },
  { word: 'Capacity', meaning: 'Kitna sambhal sakte ho', example: 'Do we have capacity for this feature?', level: 2 },
  { word: 'Headcount', meaning: 'Team size (logon ki ginti)', example: 'We need more headcount for platform work.', level: 2 },
  { word: 'Ramp-up', meaning: 'Naye kaam pe speed pakadna', example: 'I can ramp up on Kotlin in two weeks.', level: 2 },
  { word: 'Onboard', meaning: 'Naye person ko set karna', example: 'I onboarded two interns last month.', level: 2 },
  { word: 'Offboard', meaning: 'Exit process / access hataana', example: 'Offboard access on the last working day.', level: 2 },
  { word: 'Runbook', meaning: 'Step-by-step ops guide', example: 'Update the runbook after every incident.', level: 2 },
  { word: 'Playbook', meaning: 'Standard response plan', example: 'Our incident playbook covers paging rules.', level: 2 },
  { word: 'Cadence', meaning: 'Regular rhythm / schedule', example: 'We run retros on a biweekly cadence.', level: 2 },
  { word: 'Cycle time', meaning: 'Idea se ship tak ka time', example: 'We reduced cycle time with smaller PRs.', level: 2 },
  { word: 'Loop in', meaning: 'Baatcheet mein shamil karna', example: 'Loop in security before we ship auth changes.', level: 2 },
  { word: 'Call out', meaning: 'Clearly highlight karna', example: 'I want to call out a risk in the design.', level: 2 },
  { word: 'Push back', meaning: 'Politely disagree / resist', example: 'I pushed back on an unrealistic deadline.', level: 2 },
  { word: 'Double down', meaning: 'Aur zyada focus/invest karna', example: 'We doubled down on automated tests.', level: 2 },
  { word: 'Dial back', meaning: 'Kam karna / slow down', example: 'Dial back the feature scope for launch.', level: 2 },
  { word: 'Takeaway', meaning: 'Key learning / conclusion', example: 'My takeaway is to add canaries earlier.', level: 2 },
  { word: 'Net-new', meaning: 'Bilkul naya', example: 'This is net-new work, not a bugfix.', level: 2 },
  { word: 'Low-hanging fruit', meaning: 'Aasan quick wins', example: 'Fixing typos is low-hanging fruit.', level: 2 },
  { word: 'North star', meaning: 'Main long-term goal', example: 'Latency under 100ms is our north star.', level: 2 },
  { word: 'Parking lot', meaning: 'Baad ke topics ki list', example: 'Put that idea in the parking lot for now.', level: 2 },
  { word: 'Action item', meaning: 'Concrete next task', example: 'Capture action items before we leave.', level: 2 },
  { word: 'Recap', meaning: 'Short summary dobara', example: 'Here is a quick recap of decisions.', level: 2 },
  { word: 'Async', meaning: 'Bina live meeting ke', example: 'Prefer async updates over long meetings.', level: 2 },
  { word: 'Sync', meaning: 'Live saath mein', example: 'Let us sync live on the architecture.', level: 2 },
  { word: 'Context-switch', meaning: 'Kaam badalte focus tootna', example: 'Too many meetings cause context-switching.', level: 2 },
  { word: 'Unblock', meaning: 'Rukaawat hatana', example: 'What do you need to unblock the PR?', level: 2 },
  { word: 'Ship', meaning: 'Release / live karna', example: 'We shipped the beta to 5% of users.', level: 2 },
  { word: 'Polish', meaning: 'Final refinement', example: 'The feature works; it needs polish.', level: 2 },
  { word: 'Caveat', meaning: 'Shart / warning', example: 'One caveat: this only works with Redis.', level: 2 },
  { word: 'Disclaimer', meaning: 'Pehle se warning/note', example: 'Disclaimer: numbers are approximate.', level: 2 },
  { word: 'Heuristic', meaning: 'Practical thumb rule', example: 'Use a heuristic before over-optimizing.', level: 2 },
  { word: 'Prerequisite', meaning: 'Pehle zaroori cheez', example: 'Tests are a prerequisite for merge.', level: 2 },
  { word: 'Non-negotiable', meaning: 'Jispe compromise nahi', example: 'Security review is non-negotiable.', level: 2 },
  { word: 'Mitigate', meaning: 'Risk/asar kam karna', example: 'We mitigated downtime with a canary.', level: 3 },
  { word: 'Contention', meaning: 'Competition for shared resource', example: 'Lock contention slowed the writes.', level: 3 },
  { word: 'Idempotent', meaning: 'Repeat request = same result', example: 'Make the payment webhook idempotent.', level: 3 },
  { word: 'Leverage', meaning: 'Fayda uthana / use karna', example: 'Leverage existing metrics before adding more.', level: 3 },
  { word: 'Trade-off', meaning: 'Ek cheez vs doosri', example: 'There is a trade-off between consistency and availability.', level: 3 },
  { word: 'Orchestration', meaning: 'Kai steps/services coordinate karna', example: 'Use orchestration for the multi-step workflow.', level: 3 },
  { word: 'Observability', meaning: 'System andar se dikhna', example: 'Improve observability before the next release.', level: 3 },
  { word: 'Instrumentation', meaning: 'Metrics/logs/traces add karna', example: 'Add instrumentation around the checkout path.', level: 3 },
  { word: 'Resilience', meaning: 'Failure ke baad recover hona', example: 'Retries and timeouts improve resilience.', level: 3 },
  { word: 'Reliability', meaning: 'Bharosemand service', example: 'Reliability matters more than raw speed here.', level: 3 },
  { word: 'Throughput', meaning: 'Kitna kaam per unit time', example: 'Throughput dropped during the GC pause.', level: 3 },
  { word: 'Latency', meaning: 'Response delay', example: 'P99 latency spiked after the deploy.', level: 3 },
  { word: 'Bottleneck', meaning: 'Performance ki kami wali jagah', example: 'The DB CPU was the bottleneck.', level: 3 },
  { word: 'Saturation', meaning: 'Resource almost full', example: 'Disk saturation triggered the alerts.', level: 3 },
  { word: 'Backpressure', meaning: 'Upstream ko slow karne ka signal', example: 'The queue applies backpressure under load.', level: 3 },
  { word: 'Circuit breaker', meaning: 'Failing dependency se bachne ka pattern', example: 'Trip the circuit breaker when errors spike.', level: 3 },
  { word: 'Rate limiting', meaning: 'Request rate control', example: 'Rate limiting protected us from abuse.', level: 3 },
  { word: 'Thundering herd', meaning: 'Sab ek saath rush karna', example: 'Jitter helps avoid a thundering herd.', level: 3 },
  { word: 'Hot partition', meaning: 'Ek shard pe zyada load', example: 'UserId hashing caused a hot partition.', level: 3 },
  { word: 'Fan-out', meaning: 'Ek event se kai consumers', example: 'Notification fan-out stressed the workers.', level: 3 },
  { word: 'Fan-in', meaning: 'Kai sources ek jagah', example: 'Metrics fan-in to a central store.', level: 3 },
  { word: 'Eventual consistency', meaning: 'Baad mein consistent hona', example: 'The feed uses eventual consistency.', level: 3 },
  { word: 'Strong consistency', meaning: 'Turant same data', example: 'Payments need strong consistency.', level: 3 },
  { word: 'Stale read', meaning: 'Purana data padhna', example: 'Caching caused a stale read of balances.', level: 3 },
  { word: 'Race condition', meaning: 'Timing pe depend bug', example: 'A race condition corrupted the counter.', level: 3 },
  { word: 'Deadlock', meaning: 'Circular wait lock', example: 'Two transactions hit a deadlock.', level: 3 },
  { word: 'Starvation', meaning: 'Resource kabhi na milna', example: 'Low-priority jobs faced starvation.', level: 3 },
  { word: 'Quorum', meaning: 'Majority agreement', example: 'Writes need a quorum of replicas.', level: 3 },
  { word: 'Replication lag', meaning: 'Replica pe deri', example: 'Reporting queries suffered replication lag.', level: 3 },
  { word: 'Failover', meaning: 'Healthy node pe shift', example: 'Automatic failover restored the service.', level: 3 },
  { word: 'Rollback', meaning: 'Purane version pe lautna', example: 'We rolled back within three minutes.', level: 3 },
  { word: 'Rollout', meaning: 'Dheere-dheere release', example: 'Do a percentage rollout behind a flag.', level: 3 },
  { word: 'Canary', meaning: 'Thode users pe pehle test', example: 'Canary caught the memory leak.', level: 3 },
  { word: 'Blue-green', meaning: 'Do identical envs se switch', example: 'Blue-green deploy cut downtime.', level: 3 },
  { word: 'Feature flag', meaning: 'Runtime on/off switch', example: 'Ship dark with a feature flag.', level: 3 },
  { word: 'Dark launch', meaning: 'Users ko dikhaye bina live', example: 'We dark-launched the recommendation API.', level: 3 },
  { word: 'Blast radius', meaning: 'Failure ka failaav', example: 'Limit blast radius with cell-based design.', level: 3 },
  { word: 'Degradation', meaning: 'Quality/speed girna', example: 'Graceful degradation kept checkout alive.', level: 3 },
  { word: 'SLO', meaning: 'Internal reliability target', example: 'Our SLO is 99.9% monthly availability.', level: 3 },
  { word: 'SLA', meaning: 'Customer-facing reliability promise', example: 'Breaching the SLA triggers credits.', level: 3 },
  { word: 'Error budget', meaning: 'Allowed failure room', example: 'We paused features to protect the error budget.', level: 3 },
  { word: 'Postmortem', meaning: 'Incident ke baad analysis', example: 'Write a blameless postmortem within 48 hours.', level: 3 },
  { word: 'Root cause', meaning: 'Asli wajah', example: 'The root cause was a bad config push.', level: 3 },
  { word: 'Technical debt', meaning: 'Jaldbazi ka future cost', example: 'We scheduled a week to pay technical debt.', level: 3 },
  { word: 'Abstraction', meaning: 'Details hide karke simple interface', example: 'Pick the right abstraction for storage.', level: 3 },
  { word: 'Encapsulation', meaning: 'Data+logic band karna', example: 'Encapsulation keeps invariants safe.', level: 3 },
  { word: 'Cohesion', meaning: 'Related cheezein saath', example: 'High cohesion makes modules easier to change.', level: 3 },
  { word: 'Coupling', meaning: 'Modules ka interdependence', example: 'Loose coupling lets teams move independently.', level: 3 },
  { word: 'Idempotency key', meaning: 'Duplicate request rokne ka key', example: 'Clients send an idempotency key with charges.', level: 3 },
  { word: 'Schema migration', meaning: 'DB structure change carefully', example: 'Plan a backward-compatible schema migration.', level: 3 },
  { word: 'Contract test', meaning: 'API agreement verify', example: 'Contract tests caught a breaking change.', level: 3 },
  { word: 'Chaos engineering', meaning: 'Failure inject karke seekhna', example: 'Chaos experiments improved our runbooks.', level: 3 },
  { word: 'Horizontal scaling', meaning: 'Machines badha ke scale', example: 'Horizontal scaling handled the traffic spike.', level: 3 },
  { word: 'Vertical scaling', meaning: 'Badi machine se scale', example: 'Vertical scaling hit a cost ceiling.', level: 3 },
  { word: 'Sharding', meaning: 'Data tukdon mein baantna', example: 'We shard by tenant id.', level: 3 },
  { word: 'Caching strategy', meaning: 'Kya/kab cache karna', example: 'Explain your caching strategy and TTLs.', level: 3 },
  { word: 'Invalidation', meaning: 'Purana cache hataana', example: 'Cache invalidation caused a brief thundering herd.', level: 3 },
  { word: 'Optimistic locking', meaning: 'Version check se conflict handle', example: 'Use optimistic locking for concurrent edits.', level: 3 },
  { word: 'Pessimistic locking', meaning: 'Pehle lock leke edit', example: 'Pessimistic locking serialized inventory updates.', level: 3 },
  { word: 'Backfill', meaning: 'Purana data baad mein bharna', example: 'Run a backfill after adding the new column.', level: 3 }
];
}

function getPronunciationData_() {
  return [
  ['v vs w', 'vine/wine, very/wery milana', 'very, wine, available, review, whenever', 'I reviewed the very first version.', 'Lips round for W, teeth+lip for V.'],
  ['th (θ soft)', 'think ko tink bolna', 'think, thank, three, both, path', 'I think both paths are fine.', 'Tongue between teeth, soft air.'],
  ['th (ð voiced)', 'this/that ko dis/dat', 'this, that, these, those, the', 'This is the thing that matters.', 'Same tongue position, add voice.'],
  ['-ed /t/', 'worked ko work-ed alag syllables', 'worked, talked, finished, asked', 'I finished and asked for review.', 'After unvoiced sound → /t/.'],
  ['-ed /d/', 'played ko play-ed alag', 'played, called, logged, reviewed', 'I called and reviewed the logs.', 'After voiced sound → /d/.'],
  ['-ed /ɪd/', 'needed/wanted ko needd', 'needed, wanted, decided, started', 'I needed time and started early.', 'After t/d → extra syllable /ɪd/.'],
  ['r (American soft)', 'r ko heavy roll karna', 'error, mirror, better, server', 'The server returned a better error.', 'Light touch, do not roll heavily.'],
  ['short i vs ee', 'ship/sheep milana', 'ship, sheep, bit, beat, live, leave', 'Please leave the live server alone.', 'i = short, ee = long smile.'],
  ['short e vs a', 'pen/pan, men/man', 'pen, pan, men, man, said, sad', 'The men said it was sad.', 'Open mouth more for /æ/.'],
  ['p/b/t/d endings', 'end consonants drop karna', 'stop, job, test, code, build', 'Stop the build and test the code.', 'Finish the last consonant clearly.'],
  ['silent letters', 'honest/hour mein h bolna', 'honest, hour, knowledge, write, debt', 'Be honest about the write path.', 'Do not pronounce silent letters.'],
  ['word stress', 'COMputer vs comPUter galat', 'computer, developer, important, available', 'Availability is important for users.', 'Stress the correct syllable.'],
  ['sentence stress', 'har word equal force', 'I NEED this TODAY', 'I need this today, not tomorrow.', 'Stress content words, soften small words.'],
  ['linking sounds', 'har word alag alag katna', 'an apple → anapple, pick it up', 'Can you pick it up for me?', 'Link final consonant to next vowel.'],
  ['schwa /ə/', 'har vowel full force', 'about, support, problem, banana', 'About the support problem…', 'Unstressed vowels become soft uh.'],
  ['l vs r', 'light/right, play/pray', 'light, right, play, pray, collect', 'Please collect the right logs.', 'Tongue tip up for L, curl for R.'],
  ['f vs p', 'coffee/copy, full/pull', 'coffee, copy, full, pull, file', 'Pull the full file copy.', 'F = teeth on lip, P = lips together.'],
  ['s vs sh', 'see/she, sip/ship', 'see, she, sip, ship, issue', 'She can see the issue.', 'sh = lips forward, softer.'],
  ['z sound', 'is/has ko iss/hass', 'is, has, was, please, because', 'Please check because it was failing.', 'Buzz the z, do not make it s.'],
  ['ng ending', 'going ko goin', 'going, running, testing, shipping', 'I am going to keep testing.', 'Keep the soft ng at the end.'],
  ['minimal: beach/bitch', 'ee vs i confusion', 'beach, bitch, sheet, shit', 'Avoid mixing beach and sheet.', 'Smile longer for ee.'],
  ['minimal: walk/work', 'o vs er confusion', 'walk, work, talk, turkey', 'I walk to work and talk.', 'work = er sound, walk = aw.'],
  ['ask /ɑːsk/ vs /æsk/', 'Indian ask vs US/UK variants', 'ask, answer, after, example', 'Can I ask a quick question?', 'Pick one accent and stay consistent.'],
  ['schedule', 'shed-yool vs sked-yool', 'schedule, school, scheme', 'What is on the schedule today?', 'US: SKED-jool is common in tech.'],
  ['data', 'day-ta vs dah-ta', 'data, database, status', 'Check the database status.', 'Both OK — stay consistent in one talk.'],
  ['route', 'root vs rowt', 'route, router, routine', 'Check the API route.', 'In networking, root is common.'],
  ['intonation up/down', 'har sentence flat tone', 'Yes? / Yes.  Really? / Really.', 'Are you free? Yes, I am free.', 'Questions often rise; statements fall.'],
  ['chunking pauses', 'bina saans ke lambi line', 'I finished the task / and pushed the PR.', 'I finished the task, and then I pushed the PR.', 'Pause at commas and idea breaks.'],
  ['filler control', 'um/uh zyada', 'Actually… / So… / Let me think…', 'Let me think for a second.', 'Replace um with a short pause.'],
  ['clarity over speed', 'tez bolna = unclear', 'slow → clear → then faster', 'I will speak slowly and clearly.', 'Clarity pehle, speed baad mein.']
];
}

function getTranslationData_() {
  return [
  ['Main kaam pe ja raha hoon.', 'I am going to work.'],
  ['Ye aasan hai.', 'This is easy.'],
  ['Mujhe ye pasand hai.', 'I like this.'],
  ['Kya aap meri madad kar sakte ho?', 'Can you help me?'],
  ['Mujhe ye nahi pata.', 'I do not know this.'],
  ['Ye mere liye mushkil hai.', 'This is hard for me.'],
  ['Main phir se koshish karunga.', 'I will try again.'],
  ['Ye kya hai?', 'What is this?'],
  ['Aaj main khush hoon.', 'I am happy today.'],
  ['Mujhe thoda aur time chahiye.', 'I need more time.'],
  ['Chalo ab shuru karte hain.', 'Let us start now.'],
  ['Maine ek galti ki.', 'I made a mistake.'],
  ['Ye theek lagta hai.', 'That sounds good.'],
  ['Mujhe sure nahi hai.', 'I am not sure.'],
  ['Main check karta hoon.', 'Let me check.'],
  ['Please ek minute rukna.', 'Please wait a minute.'],
  ['Maine apna kaam khatam kar liya.', 'I finished my work.'],
  ['Aap kaise ho?', 'How are you?'],
  ['Aapse milkar khushi hui.', 'Nice to meet you.'],
  ['Main English seekh raha hoon.', 'I am learning English.'],
  ['Kya aap phir se bol sakte ho?', 'Can you say that again?'],
  ['Ab mujhe samajh aa gaya.', 'I understand now.'],
  ['Bahut shukriya.', 'Thank you so much.'],
  ['Deri ke liye maafi.', 'Sorry for the delay.'],
  ['Main baad mein call karta hoon.', 'I will call you later.'],
  ['Main kahan baithoon?', 'Where should I sit?'],
  ['Kya ye sahi hai?', 'Is this correct?'],
  ['Main taiyaar hoon.', 'I am ready.'],
  ['Please dheere bolo.', 'Please speak slowly.'],
  ['Aapka din accha rahe.', 'Have a good day.'],
  ['Mujhe pani chahiye.', 'I need water.'],
  ['Ye mera desk hai.', 'This is my desk.'],
  ['Meeting kab hai?', 'When is the meeting?'],
  ['Main thoda late hoon.', 'I am a little late.'],
  ['Door band kar do.', 'Please close the door.'],
  ['Laptop charge karna hai.', 'I need to charge my laptop.'],
  ['Wifi slow hai.', 'The wifi is slow.'],
  ['Message mil gaya.', 'I got the message.'],
  ['Kal milte hain.', 'See you tomorrow.'],
  ['Main ghar ja raha hoon.', 'I am going home.'],
  ['Lunch break kab hai?', 'When is the lunch break?'],
  ['Mujhe coffee chahiye.', 'I need coffee.'],
  ['Ye file open nahi ho rahi.', 'This file is not opening.'],
  ['Password galat hai.', 'The password is wrong.'],
  ['Main busy hoon.', 'I am busy.'],
  ['Thoda wait karo.', 'Please wait a bit.'],
  ['Samajh nahi aaya.', 'I did not understand.'],
  ['Phir se try karo.', 'Try again.'],
  ['Ye important hai.', 'This is important.'],
  ['Main free hoon.', 'I am free.'],
  ['Call cut ho gaya.', 'The call got disconnected.'],
  ['Screen share karo.', 'Please share your screen.'],
  ['Mute pe ho tum?', 'Are you on mute?'],
  ['Camera on karo.', 'Please turn on the camera.'],
  ['Link bhej do.', 'Please send the link.'],
  ['Notes le lo.', 'Please take notes.'],
  ['Main agree karta hoon.', 'I agree.'],
  ['Main disagree karta hoon.', 'I disagree.'],
  ['Ye idea accha hai.', 'This idea is good.'],
  ['Aaj kaam zyada hai.', 'I have a lot of work today.'],
  ['Mujhe lagta hai ye kaam karega.', 'I think this will work.'],
  ['Main jaldi se explain karta hoon.', 'Let me explain this quickly.'],
  ['Sure nahi, check karke batata hoon.', 'I am not sure, let me check and get back to you.'],
  ['Ye baat samajh aa gayi.', 'That makes sense.'],
  ['Please phir se bolna.', 'Can you repeat that, please?'],
  ['Iske baare mein ek sawaal hai.', 'I have a question about this.'],
  ['Isi approach pe chalte hain.', 'Let us go with this approach.'],
  ['Main iska dhyan rakhunga.', 'I will take care of it.'],
  ['Ye thoda alag hai jo socha tha.', 'This is a bit different from what I expected.'],
  ['Kya ek example de sakte ho?', 'Could you give me an example?'],
  ['Zyadatar agree, lekin ek concern hai.', 'I agree with most of this, but I have one concern.'],
  ['Agle point pe chalte hain.', 'Let us move on to the next point.'],
  ['Is madad ke liye shukriya.', 'I appreciate your help with this.'],
  ['Kal tak follow-up karta hoon.', 'I will follow up on this by tomorrow.'],
  ['Ye accha point hai.', 'That is a good point.'],
  ['Paanch minute sync kar sakte hain?', 'Can we sync for five minutes?'],
  ['Abhi main ispe blocked hoon.', 'I am blocked on this right now.'],
  ['Main screen share karta hoon.', 'Let me share my screen.'],
  ['Requirement thodi clear kar doge?', 'Could you clarify the requirement?'],
  ['Call ke baad document update karunga.', 'I will update the document after the call.'],
  ['Miss ho gaya, phir se bolna please.', 'Sorry, I missed that. Could you say it again?'],
  ['Lunch ke baad free hoon.', 'I am available after lunch.'],
  ['Abhi isko baad ke liye rakhte hain.', 'Let us park this for now.'],
  ['Is decision pe aapki input chahiye.', 'I need your input on this decision.'],
  ['Mujhe ye theek hai.', 'That works for me.'],
  ['Iske baad summary bhejta hoon.', 'I will send a summary after this.'],
  ['Isko short rakh sakte hain?', 'Can we keep this short?'],
  ['Main context catch-up kar raha hoon.', 'I am catching up on the context.'],
  ['Agar galat hoon to correct kar dena.', 'Please correct me if I am wrong.'],
  ['Aapke saath kaam ka wait hai.', 'Looking forward to working with you.'],
  ['Deadline tight hai.', 'The deadline is tight.'],
  ['Mujhe review chahiye.', 'I need a review.'],
  ['PR ready hai.', 'The pull request is ready.'],
  ['Bug reproduce ho gaya.', 'I was able to reproduce the bug.'],
  ['Staging pe test karo.', 'Please test it on staging.'],
  ['Production impact kam hai.', 'The production impact is low.'],
  ['Rollback plan ready hai.', 'The rollback plan is ready.'],
  ['Customer complaint aayi hai.', 'We received a customer complaint.'],
  ['Priority badha do.', 'Please increase the priority.'],
  ['Scope clear nahi hai.', 'The scope is not clear.'],
  ['Estimate do din ka hai.', 'The estimate is two days.'],
  ['Dependency kisi aur team pe hai.', 'There is a dependency on another team.'],
  ['Design review kal hai.', 'The design review is tomorrow.'],
  ['Docs update karne hain.', 'We need to update the docs.'],
  ['Monitoring alert aa raha hai.', 'A monitoring alert is firing.'],
  ['Latency badh gayi hai.', 'Latency has increased.'],
  ['Cache clear karna padega.', 'We will need to clear the cache.'],
  ['Feature flag on kar do.', 'Please turn on the feature flag.'],
  ['Release notes bhej do.', 'Please send the release notes.'],
  ['Standup skip karna hai?', 'Do we need to skip standup?'],
  ['Main WFH hoon aaj.', 'I am working from home today.'],
  ['Office aaunga kal.', 'I will come to the office tomorrow.'],
  ['Leave lena hai Monday ko.', 'I need to take leave on Monday.'],
  ['Calendar invite bhej do.', 'Please send a calendar invite.'],
  ['Timezone confirm kar lo.', 'Please confirm the timezone.'],
  ['Recording share kar dena.', 'Please share the recording.'],
  ['Action items list karo.', 'Please list the action items.'],
  ['Owner assign kar do.', 'Please assign an owner.'],
  ['Status green hai.', 'The status is green.'],
  ['Risk highlight karna hai.', 'We need to highlight the risk.'],
  ['Main apna approach step-by-step batata hoon.', 'Let me walk you through my approach.'],
  ['Yahan sabse badi challenge scalability thi.', 'The main challenge here was scalability.'],
  ['Optimize karne ke liye maine logic refactor kiya.', 'To optimize this, I refactored the logic.'],
  ['Yahan speed aur accuracy ke beech trade-off hai.', 'There is a trade-off between speed and accuracy here.'],
  ['Main business impact ke hisaab se prioritize karunga.', 'I would prioritize this based on business impact.'],
  ['Main isko step-by-step todta hoon.', 'Let me break this down step by step.'],
  ['Aaj sochun to alag approach leta.', 'In hindsight, I would have approached it differently.'],
  ['Ye design scalable aur maintainable hai.', 'This design is scalable and easy to maintain.'],
  ['Maine backend team ke saath milkar kaam kiya.', 'I collaborated closely with the backend team on this.'],
  ['Accha sawaal hai, ek second sochne do.', 'That is a great question, let me think about it for a second.'],
  ['Ussi project se testing ki importance seekhi.', 'My key takeaway from that project was the importance of testing.'],
  ['Team ke tech stack ke baare mein aur jaanna chahunga.', 'I would love to learn more about the team\'s tech stack.'],
  ['Maine poora module end-to-end sambhala.', 'I took ownership of the entire module end to end.'],
  ['Code se pehle requirements align kar lete hain.', 'Let us align on the requirements before diving into code.'],
  ['Nayi tech pe jaldi ramp-up kar sakta hoon.', 'I am confident I can ramp up quickly on new technologies.'],
  ['Success ko latency aur error rate se measure kiya.', 'I measured success using latency and error rate.'],
  ['Feature flag ke peeche rollout karke risk kam kiya.', 'We mitigated risk by rolling out behind a feature flag.'],
  ['Decision document kiya taaki baad mein revisit ho sake.', 'I documented the decision so the team could revisit it later.'],
  ['Bottleneck DB query mein thi, API layer mein nahi.', 'The bottleneck was in the database query, not the API layer.'],
  ['Operational complexity kam karne ke liye simple design propose kiya.', 'I proposed a simpler design to reduce operational complexity.'],
  ['Time pe ship karne ke liye cross-functional alignment zaroori tha.', 'Cross-functional alignment was critical for shipping on time.'],
  ['Pehle chhote prototype se assumption validate ki.', 'I validated the assumption with a small prototype first.'],
  ['Premature optimization se pehle consistency choose ki.', 'We chose consistency over premature optimization.'],
  ['Postmortem own kiya aur follow-ups drive kiye.', 'I owned the postmortem and drove the follow-up actions.'],
  ['Product goals ko technical milestones mein translate kiya.', 'My role was to translate product goals into technical milestones.'],
  ['Solution se pehle clarifying questions poochunga.', 'I would ask clarifying questions before proposing a solution.'],
  ['Retries aur timeouts se system failure gracefully handle karta hai.', 'The system handles failure gracefully with retries and timeouts.'],
  ['Code review aur pairing se junior ko mentor kiya.', 'I mentored a junior engineer through code reviews and pairing.'],
  ['Build time kam karke developer experience better kiya.', 'We improved developer experience by reducing build times.'],
  ['Aapki team speed aur quality ka balance kaise karti hai?', 'I am curious how your team balances speed and quality.'],
  ['Maine root cause analysis kiya.', 'I performed a root cause analysis.'],
  ['Humne SLA miss nahi kiya.', 'We did not miss the SLA.'],
  ['Observability improve karni thi.', 'We needed to improve observability.'],
  ['Cache invalidation tricky thi.', 'Cache invalidation was tricky.'],
  ['Idempotent API design kiya.', 'I designed the API to be idempotent.'],
  ['Canary release se risk kam hua.', 'The canary release reduced risk.'],
  ['Technical debt reduce kiya.', 'We reduced technical debt.'],
  ['Stakeholders ko update diya.', 'I updated the stakeholders.'],
  ['Scope creep rokna zaroori tha.', 'It was important to prevent scope creep.'],
  ['Ambiguity clear kar li.', 'I cleared the ambiguity.'],
  ['Benchmark results share kiye.', 'I shared the benchmark results.'],
  ['Concurrency bug fix kiya.', 'I fixed a concurrency bug.'],
  ['Schema migration carefully ki.', 'I carefully handled the schema migration.'],
  ['Telemetry se issue mila.', 'Telemetry helped us find the issue.'],
  ['Incident response lead kiya.', 'I led the incident response.'],
  ['Rollback within minutes hua.', 'We rolled back within minutes.'],
  ['Contract tests add kiye.', 'I added contract tests.'],
  ['Partition strategy revisit ki.', 'We revisited the partition strategy.'],
  ['Availability target 99.9% tha.', 'The availability target was 99.9%.'],
  ['Consistency model explain kiya.', 'I explained the consistency model.'],
  ['Queue backlog clear kiya.', 'We cleared the queue backlog.'],
  ['Circuit breaker add kiya.', 'I added a circuit breaker.'],
  ['Rate limiting enable ki.', 'We enabled rate limiting.'],
  ['Authz checks tighten kiye.', 'We tightened the authorization checks.'],
  ['PII masking ensure ki.', 'We ensured PII masking.'],
  ['Capacity planning ki.', 'I did the capacity planning.'],
  ['Cost optimization drive kiya.', 'I drove cost optimization.'],
  ['On-call runbook update kiya.', 'I updated the on-call runbook.'],
  ['Architecture decision record likha.', 'I wrote an architecture decision record.'],
  ['Interview mein STAR format use kiya.', 'I used the STAR format in the interview.']
];
}

function getSpeakingTaskData_() {
  return [
  ['Mirror drill', 'Aaj ka phrase mirror ke saamne 5 baar bolo, expression dekho.', '3 min', 1, 'Fluency'],
  ['Own sentences', 'Aaj ka word use karke 3 apne sentences banao aur bolo.', '5 min', 1, 'Vocab'],
  ['30-sec explain', 'Phone pe record karo — 30 second mein aaj ka topic explain karo.', '2 min', 1, 'Monologue'],
  ['Real use', 'Colleague/friend se aaj ka phrase real conversation mein use karo.', '5 min', 2, 'Conversation'],
  ['Phrase+word para', 'Word + phrase jodkar ek chhota paragraph bolo (bina likhe).', '4 min', 2, 'Fluency'],
  ['Work update', 'Apne kaam ka chhota update aaj ke word/phrase se bolo.', '3 min', 2, 'Workplace'],
  ['Intro with phrase', 'Aaine ke saamne intro do, aaj ka phrase zaroor daalo.', '3 min', 1, 'Interview'],
  ['Shadowing', 'Kisi short English video ko pause-copy karke shadow karo (1 min).', '5 min', 2, 'Pronunciation'],
  ['Roleplay: standup', 'Imagine standup — yesterday/today/blockers 45 second mein bolo.', '3 min', 2, 'Roleplay'],
  ['Roleplay: help', 'Colleague se help maangne ka 40-second roleplay karo.', '3 min', 1, 'Roleplay'],
  ['Hindi→English aloud', 'Translation drill ko pehle Hindi padho, phir English zor se bolo.', '5 min', 1, 'Translation'],
  ['60-sec story', 'Kal kya kiya — 60 second story bolo, present/past mix.', '4 min', 2, 'Monologue'],
  ['Disagree politely', 'Ek idea se disagree karo, lekin polite raho (40 sec).', '3 min', 2, 'Conversation'],
  ['Teach a word', 'Aaj ka word kisi ko English mein samjhao jaise teacher.', '3 min', 2, 'Vocab'],
  ['Meeting wrap', 'Meeting summary 4 bullets mein bol ke record karo.', '4 min', 3, 'Workplace'],
  ['Interview: project', 'Ek project STAR mein 90 second mein bolo.', '5 min', 3, 'Interview'],
  ['Interview: trade-off', 'Koi design trade-off 60 second mein explain karo.', '4 min', 3, 'Interview'],
  ['Bug walkthrough', 'Ek bug kaise dhunda aur fix kiya — walkthrough bolo.', '5 min', 3, 'Technical'],
  ['Ask clarifying Qs', 'Ek vague requirement pe 3 clarifying questions bolo.', '3 min', 3, 'Interview'],
  ['Praise + concern', 'Pehle agree, phir ek concern — 40 second.', '3 min', 2, 'Conversation'],
  ['Phone voice note', 'Friend ko English voice note bhejo (topic: aaj ka din).', '3 min', 1, 'Conversation'],
  ['Describe your desk', 'Apna desk/setup 45 second mein describe karo.', '3 min', 1, 'Monologue'],
  ['Explain a tool', 'Git/Jira/Slack mein se ek tool 60 sec explain karo.', '4 min', 2, 'Technical'],
  ['Future plan', 'Is hafte ka plan English mein bolo.', '3 min', 1, 'Monologue'],
  ['Apology + fix', 'Late hone ka apology + next step bolo.', '2 min', 2, 'Workplace'],
  ['Request firmly', 'Politely lekin clearly deadline extend maango.', '3 min', 2, 'Workplace'],
  ['Teach ELI10', 'Koi technical concept 10-saal bacche ko samjhao (60 sec).', '4 min', 3, 'Technical'],
  ['Debate light', 'Remote vs office — 2 points for, 1 against bolo.', '4 min', 3, 'Fluency'],
  ['Retell news', 'Koi short tech news English mein retell karo.', '4 min', 3, 'Monologue'],
  ['Closing drill', 'Call end phrases practice: thanks, next steps, bye.', '2 min', 1, 'Workplace']
];
}

function getTodayWordsData_() {
  return [
  { word: 'nuance', meaning: 'bariq fark / subtle difference', example: 'There is a nuance between latency and lag.' },
  { word: 'caveat', meaning: 'shart / warning note', example: 'One caveat: this only works with Redis.' }
];
}


// ================================================================
// DAILY PLAN
// ================================================================
function createDailyPlan_(ss) {
  var sheet = getOrRecreateSheet_(ss, SHEET_NAMES.daily, 0);
  sheet.setTabColor(THEME.accent);

  // Col A = Padh liya? (HAR question) | Col F = Minimize? (sirf level title)
  sheet.setColumnWidth(1, 90);
  sheet.setColumnWidth(2, 90);
  sheet.setColumnWidth(3, 300);
  sheet.setColumnWidth(4, 240);
  sheet.setColumnWidth(5, 260);
  sheet.setColumnWidth(6, 100);

  applyTitleBlock_(sheet, 6,
    'English Speaking — Daily Plan (90 Days)',
    'Padh liya? (A) har Day pe  |  Practice: Listening + Grammar + Mistake + Real-use + drills  |  Minimize? (F) = Level collapse'
  );
  styleHeaderRow_(sheet, 3, ['Padh liya?', 'Type', 'Content', 'Context / Meaning', 'Vocab / Drill', 'Minimize?']);

  var days = getDailyData_();
  var levels = [
    { id: 'L1', title: 'Level 1 — Kid Style (ELI10)  ·  Days 1–30', start: 1, end: 30, colorIdx: 0 },
    { id: 'L2', title: 'Level 2 — Everyday Conversation  ·  Days 31–60', start: 31, end: 60, colorIdx: 1 },
    { id: 'L3', title: 'Level 3 — Professional / Interview  ·  Days 61–90', start: 61, end: 90, colorIdx: 2 }
  ];

  var row = 4;
  var levelMeta = {};
  var dayRowMap = {};

  levels.forEach(function (lvl) {
    var titleRow = row;
    var topicBg = THEME.moduleColors[lvl.colorIdx];

    sheet.getRange(row, 1).setBackground(topicBg);
    sheet.getRange(row, 2, 1, 4).merge();
    sheet.getRange(row, 2)
      .setValue(lvl.title + '   ←  Minimize? right pe = collapse')
      .setFontFamily('Arial').setFontSize(12).setFontWeight('bold')
      .setFontColor('#FFFFFF')
      .setBackground(topicBg)
      .setVerticalAlignment('middle');

    var checkCell = sheet.getRange(row, 6);
    checkCell.insertCheckboxes();
    checkCell.setValue(false);
    checkCell.setBackground('#FEF3C7');
    checkCell.setHorizontalAlignment('center');
    checkCell.setVerticalAlignment('middle');
    checkCell.setNote('Minimize? Tick = poora Level hide. Untick = expand.');
    sheet.setRowHeight(row, 36);
    row++;

    var contentStart = row;
    var levelDays = days.filter(function (d) { return d.day >= lvl.start && d.day <= lvl.end; });

    levelDays.forEach(function (d) {
      dayRowMap[d.day] = row;

      var readCell = sheet.getRange(row, 1);
      readCell.insertCheckboxes();
      readCell.setValue(false);
      readCell.setBackground('#FEF3C7');
      readCell.setHorizontalAlignment('center');
      readCell.setVerticalAlignment('middle');
      readCell.setNote('Padh liya? Tick = yeh question/day practice ho gaya.');

      sheet.getRange(row, 2)
        .setValue('Day ' + d.day)
        .setFontFamily('Arial').setFontSize(10).setFontWeight('bold')
        .setFontColor('#FFFFFF')
        .setBackground(d.level === 3 ? THEME.interview : THEME.mustKnow)
        .setHorizontalAlignment('center').setVerticalAlignment('middle');

      sheet.getRange(row, 3)
        .setValue(d.phrase)
        .setFontFamily('Arial').setFontSize(11).setFontWeight('bold')
        .setFontColor(THEME.qFg).setBackground(THEME.qBg)
        .setWrap(true).setVerticalAlignment('middle');

      sheet.getRange(row, 4)
        .setValue(d.context + '\n(Hindi: ' + d.hindi + ')')
        .setFontFamily('Arial').setFontSize(9).setFontColor('#854D0E')
        .setBackground(THEME.qBg).setWrap(true).setVerticalAlignment('middle');

      sheet.getRange(row, 5)
        .setValue(d.word1 + ' — ' + d.meaning1 + '\n' + d.word2 + ' — ' + d.meaning2)
        .setFontFamily('Arial').setFontSize(9).setFontColor('#334155')
        .setBackground(THEME.qBg).setWrap(true).setVerticalAlignment('middle');

      sheet.getRange(row, 6)
        .setValue('L' + d.level)
        .setFontFamily('Arial').setFontSize(9).setFontColor('#334155')
        .setBackground(THEME.qBg)
        .setHorizontalAlignment('center').setVerticalAlignment('middle');

      sheet.setRowHeight(row, 52);
      row++;

      var drill =
        'Speaking Task:\n' + d.task + '\n\n' +
        'Listening (2-3 min):\n' + d.listen + '\n\n' +
        'Grammar bite:\n' + d.grammar + '\nExamples: ' + d.grammarEx + '\n\n' +
        'Mistake of the day:\nWrong: ' + d.mistakeWrong + '\n→ Right: ' + d.mistakeRight + '\nKyun: ' + d.mistakeWhy + '\n\n' +
        'Real-use today:\n' + d.realUse + '\n\n' +
        'Translate karo (Hindi to English):\n' + d.transHindi + '\n→ ' + d.transEnglish + '\n\n' +
        'Pronunciation focus:\n' + d.pronFocus + '\n\n' +
        '60-second topic:\n' + d.mono + '\n\n' +
        'Examples: ' + d.example1 + ' / ' + d.example2;

      sheet.getRange(row, 1).setBackground(THEME.aBg);

      sheet.getRange(row, 2)
        .setValue('Practice')
        .setFontFamily('Arial').setFontSize(10).setFontWeight('bold')
        .setFontColor(THEME.aTagFg).setBackground(THEME.aTagBg)
        .setHorizontalAlignment('center').setVerticalAlignment('top');

      sheet.getRange(row, 3, 1, 3).merge();
      setLabeledAnswerCell_(sheet.getRange(row, 3), drill, [
        'Speaking Task:',
        'Listening (2-3 min):',
        'Grammar bite:',
        'Mistake of the day:',
        'Real-use today:',
        'Translate karo (Hindi to English):',
        'Pronunciation focus:',
        '60-second topic:'
      ]);

      sheet.getRange(row, 6).setBackground(THEME.aBg);
      sheet.setRowHeight(row, 200);
      row++;

      sheet.getRange(row, 1, 1, 6).setBackground('#FFFFFF');
      sheet.setRowHeight(row, 6);
      row++;
    });

    var contentEnd = row - 1;
    levelMeta[lvl.id] = {
      titleRow: titleRow,
      contentStart: contentStart,
      contentEnd: contentEnd,
      checkA1: 'F' + titleRow
    };

    if (contentEnd >= contentStart) {
      try {
        sheet.getRange(contentStart, 1, contentEnd - contentStart + 1, 1).shiftRowGroupDepth(1);
      } catch (e) {}
    }
  });

  sheet.getRange(row, 1, 1, 6).merge();
  sheet.getRange(row, 1)
    .setValue('Legend: Col A Padh liya? = har question  |  Col F Minimize? = Level collapse  |  Practice = Listening+Grammar+Mistake+Real-use+drills')
    .setFontFamily('Arial').setFontSize(9).setFontColor(THEME.muted)
    .setBackground(THEME.rowOdd).setVerticalAlignment('middle');

  sheet.getRange(3, 1, Math.max(1, row - 3), 6)
    .setBorder(true, true, true, true, true, true, THEME.border, SpreadsheetApp.BorderStyle.SOLID);

  setMeta_(ss, 'EN_LEVEL_META', JSON.stringify(levelMeta));
  setMeta_(ss, 'EN_DAY_ROWS', JSON.stringify(dayRowMap));
}

// ================================================================
// PHRASE BANK
// ================================================================
function createPhraseBank_(ss) {
  var sheet = getOrRecreateSheet_(ss, SHEET_NAMES.phrases, 1);
  sheet.setTabColor('#7C3AED');

  applyTitleBlock_(sheet, 5,
    'Phrase Bank — 90 starter phrases',
    'Level ke hisaab se phrases. Daily Plan se linked. Kab bolo + Hindi matlab.'
  );
  styleHeaderRow_(sheet, 3, ['Day', 'Level', 'Phrase', 'Kab bolo', 'Hindi matlab']);

  var data = getPhraseData_();
  var values = data.map(function (p) {
    return [p.day, 'L' + p.level, p.phrase, p.context, p.hindi];
  });
  var start = 4;
  sheet.getRange(start, 1, values.length, 5)
    .setValues(values)
    .setFontFamily('Arial').setFontSize(10)
    .setWrap(true).setVerticalAlignment('top');

  for (var i = 0; i < values.length; i++) {
    var r = start + i;
    sheet.getRange(r, 1, 1, 5).setBackground(i % 2 === 0 ? '#FFFFFF' : THEME.rowOdd);
    sheet.getRange(r, 1).setHorizontalAlignment('center').setFontWeight('bold').setFontColor(THEME.accentText);
    sheet.getRange(r, 3).setFontWeight('bold').setFontColor(THEME.navy);
    sheet.setRowHeight(r, 36);
  }

  sheet.setColumnWidth(1, 50);
  sheet.setColumnWidth(2, 50);
  sheet.setColumnWidth(3, 420);
  sheet.setColumnWidth(4, 280);
  sheet.setColumnWidth(5, 280);
  sheet.getRange(3, 1, values.length + 1, 5)
    .setBorder(true, true, true, true, true, true, THEME.border, SpreadsheetApp.BorderStyle.SOLID);
}

// ================================================================
// VOCABULARY
// ================================================================
function createVocabulary_(ss) {
  var sheet = getOrRecreateSheet_(ss, SHEET_NAMES.vocab, 2);
  sheet.setTabColor('#0369A1');

  applyTitleBlock_(sheet, 5,
    'Vocabulary — 180 words (2 per day)',
    'Naya word dikhe toh yahan meaning + example. Phir Daily Plan mein wapas jao aur bolo.'
  );
  styleHeaderRow_(sheet, 3, ['#', 'Word', 'Simple Meaning (Hinglish)', 'Example', 'Level']);

  var data = getVocabData_();
  var values = data.map(function (v, i) {
    return [i + 1, v.word, v.meaning, v.example, 'L' + v.level];
  });
  var start = 4;
  sheet.getRange(start, 1, values.length, 5)
    .setValues(values)
    .setFontFamily('Arial').setFontSize(10)
    .setWrap(true).setVerticalAlignment('top');

  for (var i = 0; i < values.length; i++) {
    var r = start + i;
    sheet.getRange(r, 1, 1, 5).setBackground(i % 2 === 0 ? '#FFFFFF' : THEME.rowOdd);
    sheet.getRange(r, 1).setHorizontalAlignment('center').setFontWeight('bold').setFontColor(THEME.accentText);
    sheet.getRange(r, 2).setFontWeight('bold').setFontColor(THEME.navy);
    sheet.getRange(r, 4).setFontColor('#0369A1');
    sheet.setRowHeight(r, 32);
  }

  sheet.setColumnWidth(1, 40);
  sheet.setColumnWidth(2, 140);
  sheet.setColumnWidth(3, 320);
  sheet.setColumnWidth(4, 360);
  sheet.setColumnWidth(5, 60);
  sheet.getRange(3, 1, values.length + 1, 5)
    .setBorder(true, true, true, true, true, true, THEME.border, SpreadsheetApp.BorderStyle.SOLID);
}

// ================================================================
// PRONUNCIATION
// ================================================================
function createPronunciation_(ss) {
  var sheet = getOrRecreateSheet_(ss, SHEET_NAMES.pron, 3);
  sheet.setTabColor('#B45309');

  applyTitleBlock_(sheet, 5,
    'Pronunciation — Indian-English focus drills',
    'Roz Daily Plan se linked focus practice karo. Clarity pehle, speed baad mein.'
  );
  styleHeaderRow_(sheet, 3, ['Sound', 'Kya galti hoti hai', 'Practice words', 'Practice sentence', 'Tip']);

  var data = getPronunciationData_();
  var start = 4;
  sheet.getRange(start, 1, data.length, 5)
    .setValues(data)
    .setFontFamily('Arial').setFontSize(10)
    .setWrap(true).setVerticalAlignment('top');

  for (var i = 0; i < data.length; i++) {
    var r = start + i;
    sheet.getRange(r, 1, 1, 5).setBackground(i % 2 === 0 ? '#FFFFFF' : THEME.rowOdd);
    sheet.getRange(r, 1).setFontWeight('bold').setFontColor(THEME.navy);
    sheet.setRowHeight(r, 48);
  }

  sheet.setColumnWidth(1, 140);
  sheet.setColumnWidth(2, 220);
  sheet.setColumnWidth(3, 260);
  sheet.setColumnWidth(4, 300);
  sheet.setColumnWidth(5, 240);
  sheet.getRange(3, 1, data.length + 1, 5)
    .setBorder(true, true, true, true, true, true, THEME.border, SpreadsheetApp.BorderStyle.SOLID);
}

// ================================================================
// TRANSLATION DRILLS
// ================================================================
function createTranslationDrills_(ss) {
  var sheet = getOrRecreateSheet_(ss, SHEET_NAMES.trans, 4);
  sheet.setTabColor('#BE123C');

  sheet.setColumnWidth(1, 70);
  sheet.setColumnWidth(2, 520);
  sheet.setColumnWidth(3, 120);
  sheet.setColumnWidth(4, 100);

  applyTitleBlock_(sheet, 4,
    'Translation Drills — Hindi → English (180)',
    'Amber = Hindi (pehle khud bolo). Mint = English answer. Speaking ke liye sabse high-ROI drill.'
  );
  styleHeaderRow_(sheet, 3, ['#', 'Sentence', 'Level', 'Type']);

  var data = getTranslationData_();
  var row = 4;
  for (var i = 0; i < data.length; i++) {
    var level = i < 60 ? 1 : i < 120 ? 2 : 3;

    sheet.getRange(row, 1)
      .setValue(i + 1)
      .setFontFamily('Arial').setFontSize(10).setFontWeight('bold')
      .setFontColor('#FFFFFF')
      .setBackground(THEME.interview)
      .setHorizontalAlignment('center');
    sheet.getRange(row, 2)
      .setValue(data[i][0])
      .setFontFamily('Arial').setFontSize(11).setFontWeight('bold')
      .setFontColor(THEME.qFg).setBackground(THEME.qBg)
      .setWrap(true);
    sheet.getRange(row, 3)
      .setValue('L' + level)
      .setBackground(THEME.qBg).setHorizontalAlignment('center');
    sheet.getRange(row, 4)
      .setValue('Hindi')
      .setBackground(THEME.qBg).setHorizontalAlignment('center');
    sheet.setRowHeight(row, 28);
    row++;

    sheet.getRange(row, 1)
      .setValue('EN')
      .setFontFamily('Arial').setFontSize(10).setFontWeight('bold')
      .setFontColor(THEME.aTagFg).setBackground(THEME.aTagBg)
      .setHorizontalAlignment('center');
    sheet.getRange(row, 2)
      .setValue(data[i][1])
      .setFontFamily('Arial').setFontSize(10)
      .setFontColor('#0F172A').setBackground(THEME.aBg)
      .setWrap(true);
    sheet.getRange(row, 3).setBackground(THEME.aBg);
    sheet.getRange(row, 4)
      .setValue('English')
      .setBackground(THEME.aBg).setHorizontalAlignment('center');
    sheet.setRowHeight(row, 28);
    row++;
  }

  sheet.getRange(3, 1, Math.max(1, row - 3), 4)
    .setBorder(true, true, true, true, true, true, THEME.border, SpreadsheetApp.BorderStyle.SOLID);
}

// ================================================================
// SPEAKING TASKS
// ================================================================
function createSpeakingTasks_(ss) {
  var sheet = getOrRecreateSheet_(ss, SHEET_NAMES.tasks, 5);
  sheet.setTabColor('#15803D');

  applyTitleBlock_(sheet, 5,
    'Speaking Tasks — drill library',
    'Monologue, roleplay, shadowing, interview. Duration + difficulty ke saath rotate karke use karo.'
  );
  styleHeaderRow_(sheet, 3, ['Name', 'Task', 'Duration', 'Difficulty', 'Category']);

  var data = getSpeakingTaskData_();
  var start = 4;
  sheet.getRange(start, 1, data.length, 5)
    .setValues(data)
    .setFontFamily('Arial').setFontSize(10)
    .setWrap(true).setVerticalAlignment('top');

  for (var i = 0; i < data.length; i++) {
    var r = start + i;
    sheet.getRange(r, 1, 1, 5).setBackground(i % 2 === 0 ? '#FFFFFF' : THEME.rowOdd);
    sheet.getRange(r, 1).setFontWeight('bold').setFontColor(THEME.navy);
    var diff = data[i][3];
    sheet.getRange(r, 4)
      .setBackground(diff === 1 ? THEME.accentSoft : diff === 2 ? '#FEF3C7' : '#FFEDD5')
      .setHorizontalAlignment('center');
    sheet.setRowHeight(r, 44);
  }

  sheet.setColumnWidth(1, 150);
  sheet.setColumnWidth(2, 480);
  sheet.setColumnWidth(3, 80);
  sheet.setColumnWidth(4, 90);
  sheet.setColumnWidth(5, 120);
  sheet.getRange(3, 1, data.length + 1, 5)
    .setBorder(true, true, true, true, true, true, THEME.border, SpreadsheetApp.BorderStyle.SOLID);
}

// ================================================================
// PROGRESS TRACKER
// ================================================================
function createProgressTracker_(ss) {
  var sheet = getOrRecreateSheet_(ss, SHEET_NAMES.tracker, 6);
  sheet.setTabColor('#0E7490');

  sheet.setColumnWidth(1, 60);
  sheet.setColumnWidth(2, 110);
  sheet.setColumnWidth(3, 70);
  sheet.setColumnWidth(4, 100);
  sheet.setColumnWidth(5, 100);
  sheet.setColumnWidth(6, 220);
  sheet.setColumnWidth(7, 260);
  sheet.setColumnWidth(8, 160);

  applyTitleBlock_(sheet, 8,
    'Progress Tracker — 90 days',
    'Roz Mark Today Done (menu) ya checkbox tick. Summary formulas upar. Start date: English Practice → Set Start Date.'
  );

  // Summary row (row 3) then headers on row 4 — freeze 4
  sheet.getRange('A3').setValue('SUMMARY');
  sheet.getRange('B3').setValue('Days done →');
  sheet.getRange('C3').setFormula('=COUNTIF(C5:C94,TRUE)');
  sheet.getRange('D3').setValue('Avg rating →');
  sheet.getRange('E3').setFormula('=IFERROR(ROUND(AVERAGE(E5:E94),1),"—")');
  sheet.getRange('F3').setValue('Streak (unbroken from Day 1) →');
  sheet.getRange('G3').setFormula(
    '=IFERROR(MATCH(FALSE,C5:C94,0)-1,IF(COUNTIF(C5:C94,TRUE)=90,90,0))'
  );
  sheet.getRange('H3').setValue('');
  sheet.getRange('A3:H3')
    .setFontFamily('Arial').setFontSize(10).setFontWeight('bold')
    .setBackground(THEME.accentSoft).setVerticalAlignment('middle');
  sheet.setRowHeight(3, 28);

  styleHeaderRow_(sheet, 4, ['Day', 'Date', 'Done?', 'Minutes', 'Rating 1-5', 'Recording link', 'Notes', 'Level']);

  var startDateStr = getMeta_(ss, 'EN_START_DATE');
  var startDate = startDateStr ? new Date(startDateStr + 'T00:00:00') : new Date();

  var values = [];
  for (var d = 1; d <= 90; d++) {
    var dt = new Date(startDate.getTime());
    dt.setDate(dt.getDate() + (d - 1));
    var dateLabel = Utilities.formatDate(dt, Session.getScriptTimeZone(), 'dd-MMM-yyyy');
    var level = d <= 30 ? 'L1' : d <= 60 ? 'L2' : 'L3';
    values.push([d, dateLabel, false, '', '', '', '', level]);
  }

  var start = 5;
  sheet.getRange(start, 1, 90, 8).setValues(values)
    .setFontFamily('Arial').setFontSize(10)
    .setVerticalAlignment('middle');

  sheet.getRange(start, 3, 90, 1).insertCheckboxes();
  sheet.getRange(start, 5, 90, 1).setDataValidation(
    SpreadsheetApp.newDataValidation().requireValueInList(['1', '2', '3', '4', '5'], true).build()
  );

  for (var i = 0; i < 90; i++) {
    var r = start + i;
    sheet.getRange(r, 1, 1, 8).setBackground(i % 2 === 0 ? '#FFFFFF' : THEME.rowOdd);
    sheet.getRange(r, 1).setHorizontalAlignment('center').setFontWeight('bold').setFontColor(THEME.accentText);
    sheet.getRange(r, 3).setHorizontalAlignment('center');
    sheet.getRange(r, 5).setHorizontalAlignment('center');
  }

  // Conditional formatting: Done=true → mint row
  var doneRule = SpreadsheetApp.newConditionalFormatRule()
    .whenFormulaSatisfied('=$C5=TRUE')
    .setBackground(THEME.aBg)
    .setRanges([sheet.getRange(start, 1, 90, 8)])
    .build();
  // High rating highlight
  var ratingRule = SpreadsheetApp.newConditionalFormatRule()
    .whenNumberGreaterThanOrEqualTo(4)
    .setBackground(THEME.accentSoft)
    .setRanges([sheet.getRange(start, 5, 90, 1)])
    .build();
  sheet.setConditionalFormatRules([doneRule, ratingRule]);

  sheet.getRange(4, 1, 91, 8)
    .setBorder(true, true, true, true, true, true, THEME.border, SpreadsheetApp.BorderStyle.SOLID);

  setMeta_(ss, 'EN_TRACKER_START_ROW', String(start));
}

// ================================================================
// WEEKLY REVIEW (13 weeks)
// ================================================================
function createWeeklyReview_(ss) {
  var sheet = getOrRecreateSheet_(ss, SHEET_NAMES.weekly, 7);
  sheet.setTabColor('#7C3AED');

  sheet.setColumnWidth(1, 70);
  sheet.setColumnWidth(2, 60);
  sheet.setColumnWidth(3, 100);
  sheet.setColumnWidth(4, 420);
  sheet.setColumnWidth(5, 320);
  sheet.setColumnWidth(6, 200);
  sheet.setColumnWidth(7, 200);

  applyTitleBlock_(sheet, 7,
    'Weekly Review — 13 weeks (Days 1–90)',
    'Har week end: 7 phrases zor se revise + 2-min recording + 1 weak sound note. Done? pe tick.'
  );
  styleHeaderRow_(sheet, 3, ['Done?', 'Week', 'Days', 'Revise these phrases', 'Checklist', 'Recording link', 'Notes']);

  var days = getDailyData_();
  var values = [];
  for (var w = 0; w < 13; w++) {
    var startDay = w * 7 + 1;
    var endDay = Math.min(startDay + 6, 90);
    var phrases = [];
    for (var d = startDay; d <= endDay; d++) {
      phrases.push('D' + d + ': ' + days[d - 1].phrase);
    }
    values.push([
      false,
      'W' + (w + 1),
      startDay + '–' + endDay,
      phrases.join(' | '),
      '1) 7 phrases aloud revise  2) 2-min recording (week summary)  3) Note 1 weak sound',
      '',
      ''
    ]);
  }

  var start = 4;
  sheet.getRange(start, 1, values.length, 7)
    .setValues(values)
    .setFontFamily('Arial').setFontSize(10)
    .setWrap(true).setVerticalAlignment('top');
  sheet.getRange(start, 1, values.length, 1).insertCheckboxes();

  for (var i = 0; i < values.length; i++) {
    var r = start + i;
    sheet.getRange(r, 1, 1, 7).setBackground(i % 2 === 0 ? '#FFFFFF' : THEME.rowOdd);
    sheet.getRange(r, 1).setBackground('#FEF3C7').setHorizontalAlignment('center');
    sheet.getRange(r, 2).setFontWeight('bold').setFontColor(THEME.navy).setHorizontalAlignment('center');
    sheet.setRowHeight(r, 72);
  }

  sheet.getRange(3, 1, values.length + 1, 7)
    .setBorder(true, true, true, true, true, true, THEME.border, SpreadsheetApp.BorderStyle.SOLID);
}

// ================================================================
// TODAY WORDS (inbox — today-words.txt se + sheet pe empty rows)
// ================================================================
function createTodayWords_(ss) {
  var sheet = getOrRecreateSheet_(ss, SHEET_NAMES.today, 8);
  sheet.setTabColor('#BE123C');

  sheet.setColumnWidth(1, 70);
  sheet.setColumnWidth(2, 180);
  sheet.setColumnWidth(3, 320);
  sheet.setColumnWidth(4, 360);
  sheet.setColumnWidth(5, 160);

  applyTitleBlock_(sheet, 5,
    'Today Words — personal inbox',
    'Naya word dikhe → today-words.txt mein add karo OR yahan khali row mein type karo. Done? = seekh liya.'
  );
  styleHeaderRow_(sheet, 3, ['Done?', 'Word', 'Meaning (Hinglish)', 'Example', 'Added']);

  var data = getTodayWordsData_();
  var todayLabel = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'dd-MMM-yyyy');
  var values = data.map(function (w) {
    return [false, w.word, w.meaning, w.example, todayLabel];
  });

  // Extra blank rows so you can type new words directly in the sheet
  for (var b = 0; b < 25; b++) {
    values.push([false, '', '', '', '']);
  }

  var start = 4;
  if (values.length > 0) {
    sheet.getRange(start, 1, values.length, 5)
      .setValues(values)
      .setFontFamily('Arial').setFontSize(10)
      .setWrap(true).setVerticalAlignment('middle');
    sheet.getRange(start, 1, values.length, 1).insertCheckboxes();

    for (var i = 0; i < values.length; i++) {
      var r = start + i;
      sheet.getRange(r, 1, 1, 5).setBackground(i % 2 === 0 ? '#FFFFFF' : THEME.rowOdd);
      sheet.getRange(r, 1).setBackground('#FEF3C7').setHorizontalAlignment('center');
      if (values[i][1]) {
        sheet.getRange(r, 2).setFontWeight('bold').setFontColor(THEME.navy);
      }
      sheet.setRowHeight(r, 28);
    }

    sheet.getRange(3, 1, values.length + 1, 5)
      .setBorder(true, true, true, true, true, true, THEME.border, SpreadsheetApp.BorderStyle.SOLID);
  }
}

// ================================================================
// INTERACTIONS - collapse / today / start date
// ================================================================
function onEdit(e) {
  if (!e || !e.range) return;
  var sheet = e.range.getSheet();
  if (sheet.getName() !== SHEET_NAMES.daily) return;
  // Col F (6) = Minimize? level collapse only; Col A = Padh liya? per question
  if (e.range.getColumn() !== 6) return;

  var checked = e.range.getValue() === true;
  var editedRow = e.range.getRow();
  var meta = getLevelMeta_();

  var levelId = null;
  Object.keys(meta).forEach(function (id) {
    if (meta[id].titleRow === editedRow) levelId = id;
  });
  if (!levelId) return;

  if (checked) collapseLevelById_(levelId);
  else expandLevelById_(levelId);
}

function getLevelMeta_() {
  try {
    var ss = getSpreadsheet_();
    return JSON.parse(getMeta_(ss, 'EN_LEVEL_META') || '{}');
  } catch (e) {
    return {};
  }
}

function collapseLevelById_(levelId) {
  var ss = getSpreadsheet_();
  var sheet = ss.getSheetByName(SHEET_NAMES.daily);
  var meta = getLevelMeta_();
  var m = meta[levelId];
  if (!sheet || !m) {
    safeAlert_('Level ' + levelId + ' range not found. Run setup() again.');
    return;
  }
  sheet.hideRows(m.contentStart, m.contentEnd - m.contentStart + 1);
  try {
    var group = sheet.getRowGroup(m.contentStart, 1);
    if (group) group.collapse();
  } catch (err) {}
}

function expandLevelById_(levelId) {
  var ss = getSpreadsheet_();
  var sheet = ss.getSheetByName(SHEET_NAMES.daily);
  var meta = getLevelMeta_();
  var m = meta[levelId];
  if (!sheet || !m) {
    safeAlert_('Level ' + levelId + ' range not found. Run setup() again.');
    return;
  }
  sheet.showRows(m.contentStart, m.contentEnd - m.contentStart + 1);
  try {
    var group = sheet.getRowGroup(m.contentStart, 1);
    if (group) group.expand();
  } catch (err) {}
}

function syncLevelCheckbox_(levelId, checked) {
  var ss = getSpreadsheet_();
  var sheet = ss.getSheetByName(SHEET_NAMES.daily);
  var meta = getLevelMeta_();
  var m = meta[levelId];
  if (!sheet || !m) return;
  sheet.getRange(m.titleRow, 6).setValue(!!checked);
}

function collapseLevel1() { collapseLevelById_('L1'); syncLevelCheckbox_('L1', true); }
function expandLevel1() { expandLevelById_('L1'); syncLevelCheckbox_('L1', false); }
function collapseLevel2() { collapseLevelById_('L2'); syncLevelCheckbox_('L2', true); }
function expandLevel2() { expandLevelById_('L2'); syncLevelCheckbox_('L2', false); }
function collapseLevel3() { collapseLevelById_('L3'); syncLevelCheckbox_('L3', true); }
function expandLevel3() { expandLevelById_('L3'); syncLevelCheckbox_('L3', false); }

function getStartDate_() {
  var ss = getSpreadsheet_();
  var s = getMeta_(ss, 'EN_START_DATE');
  if (!s) {
    s = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd');
    setMeta_(ss, 'EN_START_DATE', s);
  }
  return new Date(s + 'T00:00:00');
}

function getTodayDayNumber_() {
  var start = getStartDate_();
  var now = new Date();
  var startDay = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  var diff = Math.floor((today - startDay) / (24 * 60 * 60 * 1000)) + 1;
  if (diff < 1) return 1;
  if (diff > 90) return 90;
  return diff;
}

function goToToday() {
  var day = getTodayDayNumber_();
  var ss = getSpreadsheet_();
  var sheet = ss.getSheetByName(SHEET_NAMES.daily);
  if (!sheet) {
    safeAlert_('Daily Plan tab missing. Run setup().');
    return;
  }

  var dayRows;
  try {
    dayRows = JSON.parse(getMeta_(ss, 'EN_DAY_ROWS') || '{}');
  } catch (e) {
    dayRows = {};
  }
  var targetRow = dayRows[String(day)] || dayRows[day];
  if (!targetRow) {
    safeAlert_('Day ' + day + ' row not found. Run setupDailyPlan().');
    return;
  }

  sheet.getRange(targetRow, 1, 2, 6).setBorder(
    true, true, true, true, true, true, THEME.accent, SpreadsheetApp.BorderStyle.SOLID_THICK
  );
  sheet.setActiveRange(sheet.getRange(targetRow, 1));
  try { ss.toast('Aaj Day ' + day + ' - practice yahan se!', 'English Practice'); } catch (e) {}
}

function markTodayDone() {
  var day = getTodayDayNumber_();
  var ss = getSpreadsheet_();
  var sheet = ss.getSheetByName(SHEET_NAMES.tracker);
  if (!sheet) {
    safeAlert_('Progress Tracker missing. Run setupTracker().');
    return;
  }
  var startRow = parseInt(getMeta_(ss, 'EN_TRACKER_START_ROW') || '5', 10);
  var row = startRow + day - 1;
  sheet.getRange(row, 3).setValue(true);
  if (!sheet.getRange(row, 4).getValue()) {
    sheet.getRange(row, 4).setValue(10);
  }
  try {
    ss.setActiveSheet(sheet);
    sheet.setActiveRange(sheet.getRange(row, 1));
    ss.toast('Day ' + day + ' marked done!', 'Progress');
  } catch (e) {}
}

function setStartDate() {
  var ss = getSpreadsheet_();
  var ui;
  try { ui = SpreadsheetApp.getUi(); } catch (e) {
    safeAlert_('UI not available. Set EN_START_DATE in _Meta sheet manually (yyyy-MM-dd).');
    return;
  }
  var current = getMeta_(ss, 'EN_START_DATE') || '';
  var response = ui.prompt(
    'Set Start Date',
    'yyyy-MM-dd format (current: ' + current + '). Tracker dates regenerate.',
    ui.ButtonSet.OK_CANCEL
  );
  if (response.getSelectedButton() !== ui.Button.OK) return;
  var text = (response.getResponseText() || '').trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) {
    ui.alert('Sahi format: yyyy-MM-dd (e.g. 2026-09-14)');
    return;
  }
  var parsed = new Date(text + 'T00:00:00');
  if (isNaN(parsed.getTime())) {
    ui.alert('Invalid date.');
    return;
  }
  setMeta_(ss, 'EN_START_DATE', text);
  createProgressTracker_(ss);
  ui.alert('Start date set to ' + text + '. Progress Tracker dates updated.');
}

/** Optional time-driven trigger target - only highlights today, does NOT append rows */
function highlightTodayRow() {
  goToToday();
}
