/**
 * AI History Revision Sheet - COMPLETE (Module 01 - sab files)
 * Paste into Code.gs -> Save -> Run: createAIHistoryRevisionSheet
 *
 * Tabs:
 *  1) Revision Q&A  - Topic -> Question -> Answer (Hinglish)
 *  2) Glossary      - Hard terms explained
 *
 * Sources:
 *  01_AI_Ka_Janam | 02_AI_Winter | 03_ML_Revolution
 *  04_Deep_Learning_Boom | 05_LLM_Era
 */

function createAIHistoryRevisionSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  ss.rename('AI History - Complete Revision (Hinglish)');

  buildRevisionSheet_(ss);
  buildGlossarySheet_(ss);

  SpreadsheetApp.flush();
  SpreadsheetApp.getUi().alert(
    'Done!\n\nDetailed simple Hinglish answers ready.\nTabs: Revision Q&A + Glossary\n\nTip: Agar kisi answer row mein text cut dikhe, us row ko taller resize kar lo.'
  );
}

/* ----- Sheet 1: Revision Q&A ----- */

function buildRevisionSheet_(ss) {
  const name = 'Revision Q&A';
  let sheet = ss.getSheetByName(name);
  if (sheet) ss.deleteSheet(sheet);
  sheet = ss.insertSheet(name, 0);

  const topics = getRevisionData_();

  sheet.getRange('A1:D1').merge();
  sheet.getRange('A1')
    .setValue('AI History - Complete Revision Q&A (Hinglish) | Module 01: History of AI')
    .setFontFamily('Arial').setFontSize(16).setFontWeight('bold')
    .setFontColor('#ffffff').setBackground('#1a365d')
    .setVerticalAlignment('middle');
  sheet.setRowHeight(1, 42);

  sheet.getRange('A2:D2').merge();
  sheet.getRange('A2')
    .setValue('Detailed Hinglish answers (10-year-old simple)  |  Topic -> Question -> Answer  |  Agar answer row chhoti lage: row pe double-click ya Format -> Resize row')
    .setFontFamily('Arial').setFontSize(10).setFontColor('#4a5568')
    .setBackground('#edf2f7').setVerticalAlignment('middle');
  sheet.setRowHeight(2, 26);

  sheet.getRange(3, 1, 1, 4)
    .setValues([['Type', 'Content', 'Key Terms', 'Source']])
    .setFontFamily('Arial').setFontSize(11).setFontWeight('bold')
    .setFontColor('#ffffff').setBackground('#2c5282')
    .setHorizontalAlignment('center').setVerticalAlignment('middle');
  sheet.setRowHeight(3, 28);

  const topicColors = ['#2b6cb0', '#2c7a7b', '#6b46c1', '#c05621', '#9b2c2c'];
  let row = 4;
  let qCounter = 0;

  topics.forEach(function (topic, topicIndex) {
    sheet.getRange(row, 1, 1, 4).merge();
    sheet.getRange(row, 1)
      .setValue(topic.title)
      .setFontFamily('Arial').setFontSize(13).setFontWeight('bold')
      .setFontColor('#ffffff')
      .setBackground(topicColors[topicIndex % topicColors.length])
      .setVerticalAlignment('middle');
    sheet.setRowHeight(row, 34);
    row++;

    if (topic.subtitle) {
      sheet.getRange(row, 1, 1, 4).merge();
      sheet.getRange(row, 1)
        .setValue(topic.subtitle)
        .setFontFamily('Arial').setFontSize(10).setFontStyle('italic')
        .setFontColor('#2d3748').setBackground('#ebf8ff')
        .setVerticalAlignment('middle');
      sheet.setRowHeight(row, 26);
      row++;
    }

    topic.qa.forEach(function (item) {
      qCounter++;
      const tag = item.mustKnow ? 'Must Know' : ('Q' + qCounter);

      // Question
      sheet.getRange(row, 1)
        .setValue(tag)
        .setFontFamily('Arial').setFontSize(10).setFontWeight('bold')
        .setFontColor('#ffffff')
        .setBackground(item.mustKnow ? '#553c9a' : '#c05621')
        .setHorizontalAlignment('center').setVerticalAlignment('middle');

      sheet.getRange(row, 2)
        .setValue(item.q)
        .setFontFamily('Arial').setFontSize(11).setFontWeight('bold')
        .setFontColor('#1a202c').setBackground('#fffaf0')
        .setWrap(true).setVerticalAlignment('middle');

      sheet.getRange(row, 3)
        .setValue(item.terms || '')
        .setFontFamily('Arial').setFontSize(9).setFontColor('#744210')
        .setBackground('#fffaf0').setWrap(true).setVerticalAlignment('middle');

      sheet.getRange(row, 4)
        .setValue(item.source || '')
        .setFontFamily('Arial').setFontSize(8).setFontColor('#4a5568')
        .setBackground('#fffaf0').setWrap(true).setVerticalAlignment('middle');

      sheet.setRowHeight(row, 46);
      row++;

      // Answer
      sheet.getRange(row, 1)
        .setValue('Answer')
        .setFontFamily('Arial').setFontSize(10).setFontWeight('bold')
        .setFontColor('#22543d').setBackground('#c6f6d5')
        .setHorizontalAlignment('center').setVerticalAlignment('top');

      sheet.getRange(row, 2, 1, 3).merge();
      sheet.getRange(row, 2)
        .setValue(item.a)
        .setFontFamily('Arial').setFontSize(10).setFontColor('#1a202c')
        .setBackground('#f0fff4').setWrap(true).setVerticalAlignment('top');

      // Long detailed answers need tall rows (Sheets max ~409)
      const lines = Math.max(8, Math.ceil(item.a.length / 85));
      sheet.setRowHeight(row, Math.min(40 + lines * 14, 400));
      row++;

      sheet.getRange(row, 1, 1, 4).setBackground('#ffffff');
      sheet.setRowHeight(row, 10);
      row++;
    });
  });

  sheet.getRange(row, 1, 1, 4).merge();
  sheet.getRange(row, 1)
    .setValue('Legend: Orange = Interview Q  |  Purple = Must Know  |  Total Qs: ' + qCounter + '  |  Answers = simple detailed Hinglish  |  Glossary tab = hard terms')
    .setFontFamily('Arial').setFontSize(9).setFontColor('#718096')
    .setBackground('#f7fafc').setVerticalAlignment('middle');

  sheet.setColumnWidth(1, 88);
  sheet.setColumnWidth(2, 720);
  sheet.setColumnWidth(3, 200);
  sheet.setColumnWidth(4, 130);
  sheet.setFrozenRows(3);
  sheet.getRange(3, 1, Math.max(1, row - 3), 4)
    .setBorder(true, true, true, true, true, true, '#e2e8f0', SpreadsheetApp.BorderStyle.SOLID);

  cleanupDefaultSheets_(ss);
}

/* ----- Sheet 2: Glossary ----- */

function buildGlossarySheet_(ss) {
  const name = 'Glossary';
  let sheet = ss.getSheetByName(name);
  if (sheet) ss.deleteSheet(sheet);
  sheet = ss.insertSheet(name, 1);

  sheet.getRange('A1:D1').merge();
  sheet.getRange('A1')
    .setValue('Glossary - Important Terms (Simple Hinglish) | Poora Module 01')
    .setFontFamily('Arial').setFontSize(16).setFontWeight('bold')
    .setFontColor('#ffffff').setBackground('#1a365d')
    .setVerticalAlignment('middle');
  sheet.setRowHeight(1, 38);

  sheet.getRange('A2:D2').merge();
  sheet.getRange('A2')
    .setValue('Question/answer mein naya word dikhe toh yahan meaning dekh lo.')
    .setFontFamily('Arial').setFontSize(10).setFontColor('#4a5568')
    .setBackground('#edf2f7').setVerticalAlignment('middle');
  sheet.setRowHeight(2, 24);

  sheet.getRange(3, 1, 1, 4)
    .setValues([['#', 'Term', 'Simple Meaning (Hinglish)', 'Related Topic']])
    .setFontFamily('Arial').setFontSize(11).setFontWeight('bold')
    .setFontColor('#ffffff').setBackground('#2c5282')
    .setHorizontalAlignment('center').setVerticalAlignment('middle');
  sheet.setRowHeight(3, 28);

  const terms = getGlossaryData_();
  const values = terms.map(function (t, i) {
    return [i + 1, t.term, t.meaning, t.topic];
  });

  const start = 4;
  sheet.getRange(start, 1, values.length, 4)
    .setValues(values)
    .setFontFamily('Arial').setFontSize(10)
    .setWrap(true).setVerticalAlignment('top');

  for (var i = 0; i < values.length; i++) {
    const r = start + i;
    sheet.getRange(r, 1, 1, 4).setBackground(i % 2 === 0 ? '#ffffff' : '#f7fafc');
    sheet.getRange(r, 1).setHorizontalAlignment('center').setFontWeight('bold').setFontColor('#2c5282');
    sheet.getRange(r, 2).setFontWeight('bold').setFontColor('#1a365d');
    sheet.getRange(r, 4).setFontColor('#2b6cb0');
    const gLines = Math.max(3, Math.ceil(String(values[i][2]).length / 90));
    sheet.setRowHeight(r, Math.min(36 + gLines * 14, 200));
  }

  sheet.setColumnWidth(1, 40);
  sheet.setColumnWidth(2, 230);
  sheet.setColumnWidth(3, 640);
  sheet.setColumnWidth(4, 150);
  sheet.setFrozenRows(3);
  sheet.getRange(3, 1, values.length + 1, 4)
    .setBorder(true, true, true, true, true, true, '#e2e8f0', SpreadsheetApp.BorderStyle.SOLID);
}

function cleanupDefaultSheets_(ss) {
  ss.getSheets().forEach(function (s) {
    const n = s.getName();
    if ((n === 'Sheet1' || n === 'Sheet2') && s.getLastRow() === 0 && ss.getSheets().length > 2) {
      try { ss.deleteSheet(s); } catch (e) {}
    }
  });
}

/* ===== DATA (Detailed simple Hinglish) ===== */

function getRevisionData_() {
  return [
    {
      title: 'TOPIC 1 - AI Ka Janam (1940s-1960s)',
      subtitle: 'File: 01_AI_Ka_Janam.md  |  Turing, Dartmouth, Perceptron, ELIZA, Expert Systems  |  Answers = simple + detailed',
      qa: [
        {
          q: 'Alan Turing ka AI mein specific contribution kya tha?',
          a: 'Alan Turing ko aaj log "computer science ke father" bhi kehte hain. Unka AI contribution mainly do badi cheezein hain - dono ko simple socho.\n\n1) Turing Test (1950):\nSocho jaise ek game. Ek side pe tum baithte ho chat karne. Doosri side pe ya toh insan hai ya machine. Agar tum decide nahi kar paate ki machine se baat ho rahi hai ya insan se - toh Turing kehta hai: us machine ko "intelligent" maano. Yeh philosophical debate nahi - practical test hai. Jaise school mein exam se check karte ho padha hai ya nahi.\n\n2) Turing Machine (theory):\nYeh real machine nahi, sochne ka model hai. Idea yeh: agar rules clear hain, toh koi bhi calculation step-by-step machine kar sakti hai. Matlab: agar "sochna / problem solve" bhi rules + steps mein tod sakte ho, toh theoretically machine try kar sakti hai.\n\nImportant clarification: Turing ne "AI" naam invent nahi kiya, aur field bhi unhone akele nahi banayi. Unhone strong foundation di - sawaal + test + theory. Baad mein 1956 mein field officially bani.\n\nPersonal note (revision ke liye): UK government ne unhe homosexuality ke liye punish kiya; woh sirf 41 pe guzar gaye. History padhte waqt yeh bhi yaad rakhna chahiye.',
          terms: 'Turing Test, Turing Machine',
          source: '01_AI_Ka_Janam'
        },
        {
          q: 'Dartmouth Conference 1956 ka significance kya tha?',
          a: 'Isko AI ka "official birthday party" samajh lo.\n\n1956 summer mein USA ke Dartmouth College pe scientists mile - John McCarthy, Marvin Minsky, Claude Shannon, aur aur log. Unhone formally decide kiya: is nayi research field ka naam "Artificial Intelligence" hoga.\n\nUnka dream bahut bada tha. Unhone literally socha ki intelligence ke har hisse ko (seekhna, sochna, language...) itna clearly likha ja sakta hai ki machine copy kar le. Kuch log even soch rahe the ki 2 months ki study se bade problems solve ho jayenge. Aaj yeh naive lagta hai - jaise koi bole "2 months mein poori medicine seekh loonga."\n\nPhir bhi significance huge hai:\n- Pehli baar AI ek organized field bani\n- Log ek community ban gaye\n- Goals, language, aur research direction mil gayi\n\nRevision line: Dartmouth = AI ka naam + community + official start.',
          terms: 'Dartmouth, John McCarthy',
          source: '01_AI_Ka_Janam'
        },
        {
          q: 'McCulloch-Pitts neuron kya tha aur kyun important hai?',
          a: '1943 mein ek scientist (McCulloch) aur ek mathematician (Pitts) ne socha: dimaag ke cells (neurons) ko maths se samjha ja sakta hai.\n\nSimple analogy: dimaag ka neuron jaise ek chhote switch ki tarah. Inputs aate hain (signals). Agar total signal ek limit (threshold) se zyada ho, switch ON (fire). Warna OFF.\n\nIsi idea ko artificial neuron kehte hain:\n- Inputs lo\n- Unhe weight do (kitna important)\n- Sum nikalo\n- Threshold check karo\n- Output: fire / not fire\n\nKyun important?\nKyunki yeh pehli strong bridge thi biology aur machines ke beech. Aaj ChatGPT / neural networks bahut complex hain, lekin unki "root idea" yahi hai: chhote units milke smart behavior bana sakte hain.\n\nRevision line: 1943 neuron math = aaj ke AI ka pehla seed.',
          terms: 'Artificial Neuron, Threshold',
          source: '01_AI_Ka_Janam'
        },
        {
          q: 'ELIZA Effect kya hai aur AI ethics mein kyun relevant hai?',
          a: 'ELIZA 1966 ka chatbot tha. Yeh "samajhta" nahi tha. Yeh mostly pattern matching karta tha - jaise agar tum "I feel sad" bolo, woh reply de: "Why do you feel sad?" Doctor/therapist jaisa lagta tha.\n\nShocking baat: log jaante the yeh program hai, phir bhi emotionally attach ho gaye. Kuch log privately baat karna chahte the. Is tendency ko ELIZA Effect kehte hain - AI ko insan jaisa treat karna.\n\n10-year-old example: agar ek teddy bear bolne lage, baccha usse dost maan leta hai. AI bhi similarly "dost" feel ho sakta hai.\n\nEthics mein kyun important?\n1) Manipulation risk - koi AI se logon ko fool kar sakta hai\n2) Galat expectations - log sochenge AI sab jaanta / feel karta hai\n3) Dependency - emotional support sirf AI pe rakhna unhealthy ho sakta hai\n\nIsliye modern AI products ko clearly batana chahiye: "Main AI hoon." Yeh nice-to-have nahi, safety ke liye zaroori hai.',
          terms: 'ELIZA, ELIZA Effect, Pattern Matching',
          source: '01_AI_Ka_Janam'
        },
        {
          q: 'Symbolic AI vs Connectionist AI mein kya farak hai?',
          a: 'Do alag tarike hain machine ko "smart" banane ke.\n\n1) Symbolic AI (rules wali AI):\nJaise recipe book. Clear rules likho:\n"IF bukhaar hai AND khansi hai THEN flu socho."\nFayda: samajh aata hai, explain kar sakte ho.\nNuksaan: real life messy hai. Thoda naya case aaya jo rules mein nahi - system confuse / fail. Isko brittle kehte hain (tootne wala).\n\n2) Connectionist AI (neural networks):\nJaise dimaag ke connections. Bahut examples dikhao, machine khud pattern seekh le. Explicit recipe kam, experience zyada.\nFayda: photos, speech, language jaisi messy cheezon pe better.\nNuksaan: andar kya ho raha hai explain karna mushkil (black box feel).\n\nAaj mostly connectionist dominate karta hai (ChatGPT etc.), lekin symbolic completely dead nahi. Research mein dono milake (neuro-symbolic) bhi explore ho raha hai.\n\nRevision: Symbolic = rules. Connectionist = learning from data.',
          terms: 'Symbolic AI, Connectionist AI, Neuro-symbolic',
          source: '01_AI_Ka_Janam'
        },
        {
          q: 'Arthur Samuel ka Checkers program historically important kyun hai?',
          a: '1952 mein Arthur Samuel ne checkers (draughts) khelne wala program banaya jo sirf fixed rules follow nahi karta tha - woh khelte-khelte improve hota tha.\n\nSimple idea: jaise tum game khelte ho aur galti se seekhte ho. Program bhi track karta tha kaunse moves jeet ki taraf le jaate hain, kaunse haar ki taraf. Time ke saath better moves prefer karne laga.\n\nYeh historically huge hai kyunki:\n- Yeh pehle famous examples mein se ek tha jahan machine "experience se seekhi"\n- Samuel ne hi "Machine Learning" term popular/coin ki\n- Yeh Dartmouth (1956) se pehle ka proof hai ki learning approach possible hai\n\nAaj ka reinforcement learning (AlphaGo, ChatGPT ka RLHF) conceptually isi family se related hai: try -> feedback -> improve.\n\nRevision line: Samuel Checkers = Machine Learning ka early hero.',
          terms: 'Machine Learning, Reinforcement Learning',
          source: '01_AI_Ka_Janam'
        },
        {
          q: 'Early AI researchers itne over-optimistic kyun the?',
          a: 'Kyunki pehle success dekh ke unhone socha: "Agar yeh ho gaya, toh sab jaldi ho jayega."\n\nReasons simple language mein:\n1) Narrow success: theorem prove, checkers jeet - yeh specific games/problems the. General human intelligence bahut badi cheez hai. Jaise: agar tum Monopoly jeet gaye, iska matlab nahi ki tum cricket bhi world-class ho.\n2) No map: pehle kisi ko pata nahi tha intelligence kitni hard hai.\n3) Funding pressure: government/military impressive promises sunna chahti thi.\n4) Media hype: headlines badha dete hain.\n\nAaj bhi same trap hai. LLMs amazing hain, lekin har claim "AGI next year" automatically true nahi. History sikhati hai: excitement theek, overconfidence dangerous.\n\nRevision: early optimism = small win ko big win maan lena.',
          terms: 'Hype Cycle, AGI, Over-optimism',
          source: '01_AI_Ka_Janam'
        },
        {
          q: 'MYCIN expert system hospitals mein deploy kyun fail hua?',
          a: 'MYCIN blood infection diagnose karne wala expert system tha (rules of doctors encode karke). Kuch tests mein yeh doctors se better bhi perform karta tha. Phir bhi hospitals mein widely deploy nahi hua.\n\nKyun? Tech accuracy hi kaafi nahi hoti.\n\n1) Integration: hospital already billing, records, workflows use karte hain. Nayi system fit karna hard.\n2) Liability: agar AI galat bole aur patient ko nuksaan ho - zimmedari kiski? Doctor? Hospital? Software?\n3) Human factors: kuch doctors resist - "computer mujhe sikhayega?"\n4) Maintenance: medicine har saal badalti hai. Rules manually update karna nightmare.\n\nLesson aaj ke AI products ke liye bhi same: demo success != real-world success. Integration, trust, law, aur updates matter karte hain.',
          terms: 'Expert System, Liability, Maintenance',
          source: '01_AI_Ka_Janam'
        },
        {
          q: 'Turing Test ki limitations kya hain?',
          a: 'Turing Test useful hai, lekin perfect proof of "true thinking" nahi.\n\nLimitations:\n1) Chinese Room idea: socho tumhe Chinese nahi aati, lekin ek book hai jo batati hai kaunsa symbol dekh ke kya reply likhna hai. Bahar wale ko lagega tum Chinese jaante ho - andar tum samajhte nahi. Machine bhi smart "dikhti" hai bina truly understanding ke.\n2) Gaming: system specially test pass karne ke liye train ho sakti hai.\n3) Sirf behavior: yeh check karta hai human-like reply, consciousness nahi.\n4) Culture/language bias: "intelligent reply" alag cultures mein alag lag sakta hai.\n\nIsliye GPT convincingly chat kar sakta hai, lekin "kya yeh consciously soch raha hai?" alag sawaal hai - abhi open debate.',
          terms: 'Chinese Room, Consciousness, Behavior vs Mind',
          source: '01_AI_Ka_Janam'
        },
        {
          q: 'Perceptron ki limitations kya thi aur aaj kyun important hain?',
          a: 'Perceptron (1958) pehla popular learning neural network tha. Yeh examples dekh ke seekhta tha - bahut exciting tha.\n\nLekin ek badi limit thi: yeh sirf un problems ko solve karta tha jo "seedhi line" se alag ho saken (linearly separable).\n\nXOR example (simple puzzle):\nInputs: (0,0)->0, (0,1)->1, (1,0)->1, (1,1)->0.\nYeh pattern ek seedhi line se separate nahi hota. Minsky & Papert (1969) ne mathematically dikhaya: single-layer Perceptron XOR nahi kar sakta. Yeh bada setback tha - pehle AI Winter ki foundation.\n\nAaj kyun important?\nKyunki multi-layer networks + non-linear activations (jaise ReLU) exactly yahi limit todte hain. Deep learning isliye jeetta hai kyunki woh non-linear, complex patterns seekh sakta hai.\n\nRevision: Perceptron fail = deep learning need ka proof.',
          terms: 'Perceptron, XOR, Linearly Separable, Deep Learning',
          source: '01_AI_Ka_Janam'
        },
        {
          mustKnow: true,
          q: 'MUST KNOW: AI 2010s mein deep learning se start nahi hua - sahi timeline kya hai?',
          a: 'Bahut log sochte hain AI ChatGPT / deep learning se shuru hua. Galat.\n\nSimple timeline:\n- 1943: artificial neuron math\n- 1950: Turing Test\n- 1956: Dartmouth - AI field official\n- 1960s-70s: early programs + pehla winter\n- 1980s: expert systems boom + doosra winter\n- 1980s-2000s: statistical Machine Learning\n- 2012: deep learning boom (AlexNet)\n- 2017+: Transformers / LLM era\n\nDeep learning ek powerful chapter hai, pehla page nahi.\n\nRevision sentence: AI purana subject hai; ChatGPT uski latest chapter hai.',
          terms: 'Timeline, Misconception',
          source: '01 Key Takeaways'
        },
        {
          mustKnow: true,
          q: 'MUST KNOW: Pehle important programs kaunse the (Logic Theorist, GPS, LISP, DENDRAL, ELIZA)?',
          a: 'Early AI sirf theory nahi thi - real programs bhi bane:\n\n- Logic Theorist (1956): maths theorems prove karta tha. Kabhi book se shorter proof bhi nikaalta.\n- GPS (General Problem Solver): idea tha kisi bhi problem ko goals/sub-goals mein todna. Theory mein strong, real world mein limited. Important idea: problem-solving = search.\n- LISP (1958): McCarthy ki language, AI research ke liye decades tak dominant.\n- Samuel Checkers: pehla famous learning program.\n- ELIZA (1966): pehla famous chatbot.\n- DENDRAL: chemistry expert system - pehle practical expert systems mein.\n- MYCIN: medical diagnosis rules system.\n\nInse seekho: aaj ke ideas (search, learning, chatbots, expert knowledge) ke seeds bahut pehle lage the.',
          terms: 'Logic Theorist, GPS, LISP, DENDRAL, ELIZA',
          source: '01 Core Concepts'
        }
      ]
    },

    {
      title: 'TOPIC 2 - AI Winter Kya Tha (1970s-1990s)',
      subtitle: 'File: 02_AI_Winter_Kya_Tha.md  |  Hype crash, funding freeze, expert systems collapse',
      qa: [
        {
          q: 'AI Winter kya hota hai? Kitne major winters hue?',
          a: 'AI Winter ka matlab mausam ki thand nahi. Yeh metaphor hai.\n\nSimple picture:\n1) Pehle bahut hype - "machines jaldi human jaisi ho jayengi!"\n2) Reality mein promise poora nahi hota\n3) Government/companies paise band kar deti hain\n4) Researchers doosri fields mein chale jaate hain\n5) Progress slow ho jaati hai\n\nJaise winter mein trees grow kam karte hain - field freeze feel hoti hai.\n\nDo major winters:\n- First: ~1974-1980 (UK Lighthill Report + US DARPA cuts)\n- Second: ~1987-1993 (Expert systems fail + specialized Lisp computers crash)\n\nWinter forever nahi rehta. Naye ideas aate hain (backprop recovery, statistical ML) aur spring wapas aati hai.\n\nRevision: Winter = overhype -> disappointment -> funding freeze.',
          terms: 'AI Winter, DARPA, Lighthill Report',
          source: '02_AI_Winter'
        },
        {
          q: 'Expert Systems kyun fail hue?',
          a: 'Expert system = program jisme doctor/engineer ki knowledge rules ke form mein likh di jati hai.\n\nKabhi-kabhi narrow jagah pe amazing (jaise XCON ne DEC computers configure karke bohot paise bachaye). Broad world mein fail.\n\n4 simple reasons:\n1) Knowledge nikalna hard: expert ke dimaag se rules likhna slow, mehnga, incomplete. Expert khud har intuition explain nahi kar sakta.\n2) Brittle: thoda naya situation aaya jo rules mein nahi - system toot gaya.\n3) Generalize nahi: blood infection wala system X-ray nahi padh sakta. Har domain ke liye naya system.\n4) Update nightmare: world badalta rehta hai (nayi medicines etc.), rules haath se update mushkil.\n\nIsliye baad mein approach badla: manually rules kam, data se seekhna zyada.',
          terms: 'Expert System, Knowledge Bottleneck, Brittleness',
          source: '02_AI_Winter'
        },
        {
          q: 'Lighthill Report ki main criticism kya thi?',
          a: '1973 mein UK government ne James Lighthill se AI research review karwaya.\n\nUnka mood basically: "Tumne bahut bade promises kiye, results chhote hain."\n\nCriticism roughly:\n- Robots: real duniya mein nahi, controlled toy environments mein\n- Language understanding: limited domains se aage nahi\n- General intelligence: clear progress proof weak\n- Combinatorial explosion: real problems compute se bahut badi\n\nRecommendation: broad "magic AI" funding kaato, specific useful areas pe focus.\n\nResult: UK AI labs badly hit. Yeh First AI Winter ka bada trigger bana.\n\nRevision: Lighthill = official "promises vs reality" report card jo fail tha.',
          terms: 'Lighthill Report, Overpromise',
          source: '02_AI_Winter'
        },
        {
          q: 'Combinatorial explosion kya hai aur early AI ko kaise affect kiya?',
          a: 'Simple matlab: options itne badh jaate hain ki count karna practically impossible.\n\nChess example:\nHar position pe ~30 moves. Game ~40 moves. Combinations roughly 30x30x30... 40 baar. Number itna bada ki universe ke atoms se compare hota hai. Computer har possibility check nahi kar sakta.\n\nEarly AI programs chhote "toy" worlds mein chal rahe the (limited rules). Jab real world try kiya - memory/time khatam.\n\nYeh pehle winters ka technical villain tha. Baad mein solutions: smart shortcuts (heuristics), pruning, statistical methods - har door knock karna band.\n\nRevision: combinatorial explosion = "too many doors to check."',
          terms: 'Combinatorial Explosion, Brute force, Heuristics',
          source: '02_AI_Winter'
        },
        {
          q: 'Kya aaj bhi AI Winter possible hai?',
          a: 'Short answer: poori field freeze kam likely; kisi-kisi area mein local winter possible.\n\nKyun field-wide winter ab mushkil?\n- Real utility: ChatGPT/Copilot millions use karte hain (sirf demo nahi)\n- Paise bhi ban rahe hain (products/revenue)\n- Infrastructure deep hai (cloud, GPUs, data)\n- Countries competition - funding suddenly zero unlikely\n\nPhir bhi:\nAgar kisi domain mein (jaise fully driverless cars) promise reality se bohot aage rahe, wahan hype gir sakti hai - mini winter.\n\nRevision attitude: excitement rakho, lekin har headline pe 100% mat maan lo.',
          terms: 'Domain-specific Winter, Utility, Bubble',
          source: '02_AI_Winter'
        },
        {
          q: 'AI Winters ne field ko positively kaise affect kiya?',
          a: 'Winters sirf dukh nahi the - unhone field ko mature bhi kiya.\n\nPositive effects:\n1) Galat approaches saaf hue (sirf brittle rules pe depend)\n2) Claims zyada careful/honest hue\n3) Jo log hype chhod ke fundamentals pe lage (Hinton, LeCun...), unka deep work baad mein jeeta\n4) Theory better hui (stats, optimization)\n5) Industry ne poocha: "real fayda kahan hai?"\n\nAnalogy: exam fail ke baad better study method banana. Painful, lekin growth.\n\nRevision: winters = hard teacher.',
          terms: 'Winter Survivors, Fundamentals, ROI',
          source: '02_AI_Winter'
        },
        {
          q: 'Japan ka Fifth Generation Project kya tha aur kyun fail hua?',
          a: '1980s mein Japan ne bohot bada, mehnga, 10-year project announce kiya: "intelligent computers" banana, mainly logic programming (Prolog) pe.\n\nDream: expert systems ko bahut tez parallel machines pe chalana, US ko challenge.\n\nFail kyun?\n- Galat bet: logic/rules pe zor, jab statistical learning better prove ho raha tha\n- Custom hardware jaldi outdated\n- Goals unclear / move hote rahe\n- Parallel hardware aur software match nahi kiye\n\nResearch waste nahi hua, lekin "duniya badalne wala" promise miss. US ne darr ke kuch funding badhayi - panic bhi hype ka part tha.\n\nRevision: bada budget + galat paradigm = fail possible.',
          terms: 'Fifth Generation Project, Prolog, Logic Programming',
          source: '02_AI_Winter'
        },
        {
          q: 'Hinton, LeCun, Bengio - "Winter Survivors" kyun special hain?',
          a: 'Jab neural networks "unfashionable / dead" maane jaate the, tab bhi yeh teen log basics pe kaam karte rahe.\n\n- Hinton: backpropagation / deep learning ideas push\n- LeCun: CNNs (images ke liye nets) - handwriting etc.\n- Bengio: language modeling direction\n\n2012 AlexNet moment aaya toh unka patient work suddenly center mein aa gaya. 2018 mein inhe ACM Turing Award mila (computing ka Nobel jaisa).\n\nLife lesson for revision: hype pe career mat banao; fundamentals pe lage raho. Fashion change hota hai, strong basics jeette hain.',
          terms: 'Deep Learning Trinity, CNN, Backpropagation, AlexNet',
          source: '02_AI_Winter'
        },
        {
          mustKnow: true,
          q: 'MUST KNOW: Do winters ke beech Expert Systems Spring (1980-87) kya tha?',
          a: 'Pehle winter ke baad thodi spring aayi.\n\nXCON (DEC) ne computers configure karke crores save kiye -> companies excited. Har jagah AI department, Lisp Machines (special expensive computers), Japan Fifth Gen hype.\n\nYeh boom short tha. Jab expert systems broad fail hue aur specialized hardware crash hua (PCs saste/powerful), Second Winter aa gaya.\n\nRevision: boom -> brittle tech -> crash = classic winter pattern.',
          terms: 'XCON, Lisp Machines, Boom-Bust',
          source: '02 Interlude'
        },
        {
          mustKnow: true,
          q: 'MUST KNOW: AI Winter = research completely stop? (Misconception)',
          a: 'Nahi. Winter mein research "band" nahi hoti - funding aur popularity girti hai, pace slow hoti hai.\n\nImportant ideas winters ke dauran / around bhi aayi (jaise backprop recovery). Kuch researchers (Hinton/LeCun) quietly continue kiye.\n\nIsliye winter = pause/slowdown, delete button nahi.\n\nRevision: winter slows the field; it does not erase it.',
          terms: 'Misconception, Continuity',
          source: '02 Misconceptions'
        }
      ]
    },

    {
      title: 'TOPIC 3 - ML Revolution / Statistical ML (1980s-2000s)',
      subtitle: 'File: 03_ML_Revolution.md  |  SVM, RF, Boosting, HMM, Feature Engineering, No Free Lunch',
      qa: [
        {
          q: 'Statistical ML era mein kaunse major algorithms dominate karte the?',
          a: 'Second winter ke baad AI ne practical turn liya: "data se patterns nikaalo." Is era ke stars:\n\n- Logistic Regression: haan/na type decisions (approve loan?)\n- Naive Bayes: spam vs not spam - simple + fast\n- SVM: smart boundary se classes alag (kernel trick se complex shapes)\n- Decision Trees / Random Forests: questions pooch ke decide (jaise 20 questions game), forests = many trees vote\n- Gradient Boosting (baad mein XGBoost/LightGBM): trees ek ke baad ek galtiyan theek\n- HMM: sequences (speech)\n- K-means: groups banana (unsupervised)\n- PCA: data simplify / dimensions kam\n\nDeep learning ne inhe useless nahi banaya. Images/text pe DL strong; tables/spreadsheet data pe classical ML aaj bhi bohot use hota hai.\n\nRevision: classical ML = practical workhorse era.',
          terms: 'SVM, Random Forest, XGBoost, HMM, Naive Bayes',
          source: '03_ML_Revolution'
        },
        {
          q: 'No Free Lunch Theorem kya hai aur practical implication?',
          a: 'Simple translation: "Free mein lunch nahi" - koi ek algorithm har problem pe best nahi.\n\nMath idea (Wolpert): agar tum imaginarily har possible problem ka average lo, algorithms ki expected performance equal. Matlab universal champion nahi.\n\nPractice mein kya matlab?\n- Context dekho: images ke liye CNN, tabular ke liye XGBoost, chhote high-dim data pe SVM...\n- Domain knowledge matter karti hai\n- Multiple models try karna smart hai\n- "Yeh algorithm hamesha jeettega" wali claim pe doubt karo\n\n10-year-old analogy: cricket bat se tennis mat khelo. Tool problem ke hisaab se choose karo.',
          terms: 'No Free Lunch Theorem, Model Selection',
          source: '03_ML_Revolution'
        },
        {
          q: 'Feature Engineering kya hai aur traditional ML mein kyun critical tha?',
          a: 'Feature engineering = raw data ko aise useful signals mein badalna jo algorithm easily samajh sake.\n\nExample: customer leave karega ya nahi?\nRaw: login timestamps.\nEngineered features:\n- Last login ke kitne din hue\n- Last 30 days mein kitni baar aaya\n- Average session time\n\nTraditional ML algorithms limited complexity handle karte the, isliye manually smart features banana bohot important skill thi.\n\nDeep learning images/text mein features khud seekh leta hai (partial automation). Phir bhi real projects mein cleaning, domain features, preprocessing ab bhi matter karti hai.\n\nRevision: feature engineering = data ko "exam-ready notes" banana.',
          terms: 'Feature Engineering, Representation',
          source: '03_ML_Revolution'
        },
        {
          q: 'Random Forests kaise kaam karte hain aur ensemble kyun powerful?',
          a: 'Ek decision tree = sawaalon ki chain ("age > 30? income high?").\nProblem: ek tree easily overfit - training yaad kar leta hai, naya data pe weak.\n\nRandom Forest = jungle of trees.\nHar tree:\n- Data ka random sample (bagging)\n- Split pe random features\nPhir sab vote (classification) ya average (regression).\n\nKyun strong?\nAlag trees alag galtiyan karte hain. Average se noise cancel - "wisdom of crowds."\n\nBonus: generally robust, feature importance bhi milti hai.\n\nRevision: forest = many weak/ok trees -> strong team.',
          terms: 'Bagging, Ensemble, Overfitting',
          source: '03_ML_Revolution'
        },
        {
          q: 'SVM mein kernel trick intuitively kya hai?',
          a: 'Socho do colors ke dots paper pe aise mile-jule hain ki seedhi line se alag nahi ho sakte.\n\nTrick: paper ko fold / 3D lift karo - ab alag karna easy. SVM kernel trick similar idea use karta hai: data ko higher dimension mein socho jahan linear separation possible.\n\nMagic part: woh bhari projection explicitly compute kiye bina, sirf similarity (kernel) calculate karke kaam chalata hai. Isliye practical.\n\nCommon kernels: RBF, polynomial.\n\nAnalogy: kabhi seedha nahi, soch badlo - problem easy.',
          terms: 'Kernel Trick, RBF, SVM',
          source: '03_ML_Revolution'
        },
        {
          q: 'HMM ne speech recognition mein kyun kaam kiya?',
          a: 'Speech ek sequence hai: sounds ek ke baad ek aate hain.\n\nHMM (Hidden Markov Model) simple story:\n- Hidden part: asal phoneme / sound unit jo tum bolna chahte ho (andar ki state)\n- Observed part: microphone ko jo signal mila (bahar ka data)\n- Transition: kis sound ke baad kaunsa sound likely\n- Emission: woh sound acoustic signal mein kaisa dikhta hai\n\nViterbi algorithm most likely sound sequence nikalta hai.\n\nYeh language "samajhne" jaisa deep nahi - statistical pattern capture hai. Phir bhi commercially speech systems chalaye.\n\nLimit: Markov assumption (mostly recent state pe depend). Deep learning baad mein richer context capture karta hai.',
          terms: 'HMM, Phoneme, Viterbi, Sequence',
          source: '03_ML_Revolution'
        },
        {
          q: 'Kaggle ne ML industry ko kaise shape kiya?',
          a: 'Kaggle competitions ne ML ko "sport" jaisa bana diya: dataset do, best score jeeto.\n\nPositive:\n- Anyone compete kar sakta (democratize)\n- XGBoost/ensembles tabular pe dominate prove\n- Feature tricks share hue\n- Common benchmarks\n- Companies talent hire karti hain leaderboard se\n\nCaution (negative):\nCompetition metric jeetna != production AI.\nReal products mein latency, reliability, fairness, monitoring, maintenance bhi chahiye - Kaggle yeh fully test nahi karta.\n\nRevision: Kaggle great classroom/gym; factory floor alag hai.',
          terms: 'Kaggle, Ensembling, Production ML',
          source: '03_ML_Revolution'
        },
        {
          q: 'Deep learning se pehle NLP kaise kaam karta tha?',
          a: 'Pehle language systems mostly counting + statistics pe the, deep understanding pe nahi.\n\nTools:\n- Bag of Words: document = word counts (order ignore)\n- TF-IDF: rare important words ko zyada weight\n- N-grams: previous N words dekh ke next predict\n- LSA: topics dhundhne ke liye matrix math\n- CRF: sequence labels (names, places tag karna)\n\nYeh specific tasks pe chaley (spam, simple classify). Weakness: long meaning, deep semantics, long-range relations.\n\nPhir Word2Vec (2013) aur Transformers ne game badal di.\n\nRevision: old NLP = clever counting; modern NLP = learned representations + attention.',
          terms: 'Bag of Words, TF-IDF, N-gram, CRF',
          source: '03_ML_Revolution'
        },
        {
          mustKnow: true,
          q: 'MUST KNOW: Statistical ML ne AI ko second winter se kaise rescue kiya?',
          a: 'Expert systems ke promises tootne ke baad field ko "real kaam" chahiye tha.\n\nStatistical ML ne diya:\n- Spam filters\n- Recommendations\n- Speech systems\n- Credit scoring\n- Search ranking signals\n\nYeh hype speeches se zyada, measurable utility thi. Companies ROI dekh sakti thin.\n\nIsliye statistical ML = winter ke baad practical spring.\n\nAaj bhi: classical ML + deep learning partners hain, enemies nahi.',
          terms: 'Statistical ML, ROI, Practical AI',
          source: '03 Key Takeaways'
        },
        {
          mustKnow: true,
          q: 'MUST KNOW: 2000s data explosion ne deep learning ke liye conditions kaise banayi?',
          a: '2000s mein data suddenly bohot badha: genomes, Facebook, Netflix ratings, smartphones, ImageNet images, Twitter text.\n\nProblem: classical methods (jaise SVM) millions/billions examples pe struggle.\n\nNeural nets gradient descent se better scale feel karte the - especially jab GPUs + smart tricks aaye.\n\nMatlab 2012 miracle "akela magic" nahi tha. Pehle data ocean ready hua, phir deep learning boat tezi se chali.\n\nRevision: big data prepared the stage for deep learning.',
          terms: 'ImageNet, Scale, Data Explosion',
          source: '03 Numbers Game'
        }
      ]
    },

    {
      title: 'TOPIC 4 - Deep Learning Boom (2012-2016+)',
      subtitle: 'File: 04_Deep_Learning_Boom.md  |  AlexNet, ReLU, ResNet, Word2Vec, Transfer Learning, GANs, AlphaFold',
      qa: [
        {
          q: '2012 ImageNet moment kya tha aur kyun significant?',
          a: 'ImageNet ek bada photo contest/dataset tha: machine ko objects recognize karne hain.\n\nSept 2012: AlexNet (Krizhevsky, Sutskever, Hinton) ne error rate ~15.3% kiya; second place ~26.2%. Gap huge - roughly 40% better.\n\nSecret sauce mix:\n- Deep CNN architecture\n- GPUs pe training\n- Big labeled data\n- Tricks jaise ReLU/dropout\n\nKyun history badli?\n- GPU era start (NVIDIA rise)\n- Transfer learning culture\n- VC/companies serious\n- Hiring wars\n- Almost har big tech ne DL accelerate ki\n\nRevision: 2012 = modern AI ka public "big bang" moment.',
          terms: 'AlexNet, ImageNet, GPU, CNN',
          source: '04_Deep_Learning'
        },
        {
          q: 'ReLU activation sigmoid se better kyun?',
          a: 'Activation = neuron ke andar chhota math gate jo signal ko non-linear banata hai.\n\nSigmoid: smooth S curve, output 0-1. Problem: derivative hamesha 1 se chhoti. Deep network mein gradients multiply hote hain - bohot layers baad signal almost 0 (vanishing gradient). Early layers seekh nahi paate.\n\nReLU: max(0, x). Positive pe derivative = 1. Gradient shrink nahi hota (active neurons pe). Plus compute cheap (exp nahi).\n\nIsliye deep nets practically train ho paye.\n\nNote: binary probability output pe sigmoid ab bhi use. Transformers mein GELU etc. variants.\n\nAnalogy: sigmoid = dim bulb signal door tak pahunchte-pahunchte almost dark; ReLU = brighter hallway for gradients.',
          terms: 'ReLU, Sigmoid, Vanishing Gradient',
          source: '04_Deep_Learning'
        },
        {
          q: 'Residual connections (ResNet) ka intuition kya hai?',
          a: 'Pehle log sochte the: zyada layers = hamesha better. Reality: naive bahut deep net kabhi shallower se worse.\n\nResNet idea (2015): har block poora naya mapping na seekhe. Seekho change F(x). Output = x + F(x).\n\nAgar kuch change nahi chahiye, F~=0 rakhna easy - identity path open hai. Skip connection gradient ko seedha peeche bhejti hai.\n\nResult: 100+ layer nets train. Transformers bhi residuals pe heavily depend.\n\nAnalogy: elevator ke saath stairs bhi rakho - signal / gradient stuck nahi hota.',
          terms: 'ResNet, Skip Connection, Identity Mapping',
          source: '04_Deep_Learning'
        },
        {
          q: 'Word2Vec ka key insight kya tha?',
          a: 'Insight: "Word ka meaning uske neighbors se pata chalta hai."\n\nBank ke paas agar money/loan/deposit words aate hain, toh bank finance sense mein.\n\nWord2Vec chhota neural net train karta hai surrounding words predict karne (skip-gram/CBOW). Hidden weights ban jaate hain word embeddings - numbers ki list jo meaning capture karti hai.\n\nFamous magic:\nking - man + woman ~= queen\nParis - France + Germany ~= Berlin\n\nMatlab relationships geometry mein store.\n\nIsne NLP ko rocket diya: translation, sentiment, NER better. Aaj ke BERT/GPT embeddings isi tradition ke advanced form hain.',
          terms: 'Word2Vec, Embedding, Distributional Hypothesis',
          source: '04_Deep_Learning'
        },
        {
          q: 'Transfer Learning kya hai aur practical AI ko kyun democratize kiya?',
          a: 'Pehle har nayi problem pe zero se train - bohot data + compute chahiye.\n\nTransfer learning:\n1) Bade dataset (ImageNet) pe model general features seekhe (edges, textures...)\n2) Apne chhote task pe last layers fine-tune\n\nJaise school mein pehle general maths seekho, phir specific exam practice.\n\nImpact: startup ke paas 1000 labels hon toh bhi strong system possible. AI sirf Google giants ki nahi rahi.\n\nLLM world mein same template: internet pe pretrain -> apne task pe adapt.',
          terms: 'Transfer Learning, Pretrain, Fine-tune',
          source: '04_Deep_Learning'
        },
        {
          q: 'GANs ka core idea aur applications?',
          a: 'GAN = do networks ka competition game.\n\n- Generator: fake sample banata (image etc.)\n- Discriminator: real vs fake detect\n\nDono improve karte hain. End goal: fakes itne real ki discriminator confuse.\n\nApplications: realistic faces (StyleGAN), horse->zebra style transfer, super-resolution, deepfakes, molecule ideas, rare data augmentation.\n\nProblems: training unstable, mode collapse (sirf thodi variety).\n\nAaj image quality mein diffusion models zyada famous, lekin GAN idea historically generative AI ka bada door kholne wala tha.',
          terms: 'GAN, Generator, Discriminator, Mode Collapse',
          source: '04_Deep_Learning'
        },
        {
          q: '"Compute is now a competitive advantage" explain karo.',
          a: '2012 ke baad pattern clear hua: generally zyada compute + data + bada model -> better results.\n\nTraining frontier models bohot mehnga (reports mein GPT-4 class runs tens/hundreds of millions$). GPUs mehenge. Isliye sirf kuch companies afford karti hain.\n\nYeh "compute moat" banata hai - paisa/hardware wali labs aage.\n\nCounter forces bhi hain: efficient architectures, quantization, distillation, smaller specialized models - taaki chhote teams bhi compete kar saken.\n\nRevision: algorithms matter, lekin ab hardware budget bhi strategy hai.',
          terms: 'Compute Moat, GPU, Efficient ML',
          source: '04_Deep_Learning'
        },
        {
          q: 'AlphaFold ka AI significance biology ke bahar kya hai?',
          a: 'Proteins ke amino acid sequence se 3D shape predict karna decades purani hard problem thi. AlphaFold (DeepMind) ne near-atomic accuracy hours mein di.\n\nBiology ke bahar lesson:\n1) AI sirf chat/photos nahi - science discovery tool\n2) Physical world patterns data se seekhe ja sakte hain\n3) Long-range relations matter (protein mein door amino acids interact - text long context jaisa)\n4) Massive pretrain science domains mein bhi kaam karta\n\n2024 Nobel Chemistry recognition ne iski seriousness dikhai. Drug discovery direction change.\n\nRevision: AlphaFold = "AI as scientist" ka poster example.',
          terms: 'AlphaFold, Scientific AI, Protein Folding',
          source: '04_Deep_Learning'
        },
        {
          mustKnow: true,
          q: 'MUST KNOW: Deep learning = sirf "bahut layers"? (Misconception)',
          a: 'Nahi. Sirf layers badha dena kaafi nahi.\n\nArchitecture quality matter karti hai: residual connections, normalization, attention, good activations. ResNet-50 carefully designed naive 100-layer se better ho sakti hai.\n\nCargo-cult mat karo ("sab pe CNN laga do"). Samjho kyun kaam karta hai - tabhi innovate kar paoge.\n\nRevision: depth helpful, design smarter.',
          terms: 'Architecture > Depth',
          source: '04 Misconceptions'
        },
        {
          mustKnow: true,
          q: 'MUST KNOW: Deep learning hamesha jeetta hai? GPUs AI ke liye design the?',
          a: 'Do alag misconceptions:\n\n1) DL always wins? Nahi.\n- Spreadsheet/tabular: XGBoost often strong\n- Bohot chhota data: classical simpler better\n- Regulated domains: interpretable models prefer\nDL especially unstructured pe (image/audio/text) shine karta hai.\n\n2) GPUs AI ke liye bane the? Originally nahi - gaming/graphics ke liye. Researchers ne AI training ke liye reuse kiya. Baad mein NVIDIA ne AI-specific chips (A100/H100) banaye.\n\nRevision: right tool + right hardware history matter karti hai.',
          terms: 'XGBoost vs DL, NVIDIA, GPU History',
          source: '04 Misconceptions'
        },
        {
          mustKnow: true,
          q: 'MUST KNOW: Dropout kya hai aur kyun important tha?',
          a: 'Dropout training trick: randomly kuch neurons temporarily band.\n\nKyun? Taaki network ek-do neurons pe over-depend na kare (co-adaptation kam). Overfitting kam, generalization better.\n\nAlexNet era mein yeh simple idea bohot helpful rahi - deep nets ko real world pe better banaya.\n\nAnalogy: team project mein har baar alag members practice karein, taaki poori team strong ho, sirf ek star pe depend na ho.',
          terms: 'Dropout, Regularization, Overfitting',
          source: '04 Key Takeaways'
        }
      ]
    },

    {
      title: 'TOPIC 5 - LLM Era (2017-Present)',
      subtitle: 'File: 05_LLM_Era.md  |  Transformer, GPT, BERT, RLHF, Scaling Laws, ChatGPT, Constitutional AI',
      qa: [
        {
          q: 'Transformer architecture RNNs se kyun revolutionary tha?',
          a: 'Purane RNN language ko ek-ek karke left-to-right process karte the. Jaise line mein khade log - har step pehle pe depend.\n\nProblems:\n- Parallel nahi (slow training)\n- Lambi sentence mein purani info fade\n- Vanishing gradients\n\nTransformer (2017, Attention paper): self-attention.\nHar word kisi bhi doosre word ko directly dekh sakta hai - distance matter nahi. Poori sequence ek saath process - GPU khush.\n\nResult: faster scale, better long-range understanding, GPT/BERT possible.\n\nAnalogy: class mein sirf neighbor se baat nahi - kisi bhi student ko directly question pooch sakte ho.',
          terms: 'Transformer, Self-Attention, RNN, Parallelism',
          source: '05_LLM_Era'
        },
        {
          q: 'RLHF kya hai aur kyun important?',
          a: 'Raw LLM internet jaisa text predict karta hai - helpful bhi, toxic/nonsense bhi.\n\nRLHF = human feedback se "achhe jawab" ki taraf push.\n\n3 steps simply:\n1) SFT: high-quality examples pe supervised fine-tune\n2) Reward model: humans do answers compare karte hain; model seekhe kaunsa preferred\n3) RL (aksar PPO): LLM ko reward maximize karne ko train\n\nKyun important?\nIsliye ChatGPT/Claude "product" ban sake, sirf autocomplete nahi. InstructGPT ne dikhaya: RLHF version log raw GPT-3 se zyada prefer karte the.\n\nRevision: RLHF = manners + helpfulness training for LLMs.',
          terms: 'RLHF, SFT, Reward Model, PPO',
          source: '05_LLM_Era'
        },
        {
          q: 'Scaling Laws kya hain aur AI development ko kaise shape kiya?',
          a: 'Researchers ne dekha: model size, data size, compute badhao toh loss predictably girta hai (power-law / almost straight on log-log).\n\nMatlab AI thoda zyada "engineering" ban gaya:\n- Estimate: itna paisa/compute -> roughly itna improve\n- Model aur data dono saath scale karo (Chinchilla lesson: sirf bada model, kam data = waste)\n- Big training runs plan with more confidence\n\nPehle vibe: try and pray. Ab: measure and scale (still surprises hote hain, lekin map better hai).',
          terms: 'Scaling Laws, Compute, Chinchilla',
          source: '05_LLM_Era'
        },
        {
          q: 'Emergent capabilities kya hain? Examples do.',
          a: 'Kuch abilities chhote models mein almost zero, scale badhte hi suddenly dikhti hain - continuously thodi-thodi nahi.\n\nExamples:\n- Multi-digit arithmetic\n- Chain-of-thought ("step by step socho") se reasoning jump\n- Better sense of uncertainty\n- Complex analogies\n\nDebate: kya yeh genuine magic jump hai, ya measurement style (pass/fail) ki wajah se sudden dikhta hai?\n\nPractical reality: scale ke saath qualitatively naya behavior feel hota hai - isliye bade models special treat kiye jaate hain.',
          terms: 'Emergence, Chain-of-Thought',
          source: '05_LLM_Era'
        },
        {
          q: 'Open source vs closed source LLMs ka debate kya hai?',
          a: 'Closed (OpenAI/Anthropic/Google style):\n- Powerful model risks control (misuse, weapons info etc.)\n- API pe monitoring/filters\n- Safety research ke liye business support\n\nOpen (Meta LLaMA, Mistral, HF community):\n- Zyada log safety research / audit kar saken\n- Power sirf thodi companies mein concentrate na ho\n- Local/private run, customize, sasta experiment\n\nReality: open models kai tasks pe closed ke close aa chuke. Tradeoff clear: closed zyada controlled; open zyada free + user responsibility.\n\nRevision: yeh technical + society dono ka debate hai.',
          terms: 'Open vs Closed, LLaMA, Safety',
          source: '05_LLM_Era'
        },
        {
          q: 'Constitutional AI kya hai aur Anthropic ise RLHF se better kyun maanta?',
          a: 'RLHF strong hai lekin humans se har baar preference collect karna mehnga, slow, kabhi inconsistent.\n\nConstitutional AI (Anthropic):\n- Pehle principles likho (constitution): helpful, honest, avoid harm...\n- Model apne answer ko in principles se check kare\n- Galat/weak answer rewrite kare\n- Us self-feedback pe improve\n\nFayde: scale easier, principles transparent, consistency better. Humans constitution banate hain, lekin har sample pe kam annotators.\n\nClaude training philosophy isi se connected: safety aur quality saath.\n\nRevision: CAI = rulebook + self-critique se alignment.',
          terms: 'Constitutional AI, Alignment, Self-critique',
          source: '05_LLM_Era'
        },
        {
          q: 'GPT-3 ke few-shot learning ka significance kya tha?',
          a: 'GPT-3 se pehle: naya task = labeled data collect + fine-tune. Time/paisa.\n\nFew-shot: prompt mein 3-10 examples do. Model samajh jaye task kya hai, bina weights update kiye.\n\nYeh qualitative jump tha - "task inference" ability.\n\nImpact:\n- Prototype minutes mein\n- API products boom\n- Prompt engineering skill bani\n- Har chhoti company ko apna huge train karna zaroori nahi\n\nRevision: few-shot = examples in prompt, not full retraining.',
          terms: 'Few-shot, In-context Learning, Prompt Engineering',
          source: '05_LLM_Era'
        },
        {
          mustKnow: true,
          q: 'MUST KNOW: BERT vs GPT - fundamental farak?',
          a: 'Dono Transformer family, alag jobs.\n\nGPT style:\n- Usually left-to-right next word predict (autoregressive)\n- Generation / chat / writing strong\n\nBERT style (Google 2018):\n- Bidirectional - left aur right dono context\n- Masked words fill - understanding / NLU tasks (classify, QA extract) mein historically bohot strong\n\nSimple: GPT = writer/speaker energy; BERT = reader/comprehension energy.\nAaj chat products mostly GPT-like generators + alignment.',
          terms: 'BERT, GPT, Bidirectional, Autoregressive',
          source: '05 Core'
        },
        {
          mustKnow: true,
          q: 'MUST KNOW: Transformers OpenAI ne invent kiye? ChatGPT pehla chatbot?',
          a: 'Dono myths galat.\n\n1) Transformer invent: Google Brain paper "Attention Is All You Need" (2017). OpenAI ne GPT series scale + productize kiya; RLHF/ChatGPT unka bada contribution.\n\n2) Pehla chatbot: nahi. ELIZA (1966), Siri, Alexa pehle se. ChatGPT alag capability quality ki wajah se viral hua - 100M users type speed.\n\nRevision: credit correctly - Google architecture, OpenAI scaling/product, history older chatbots.',
          terms: 'Attention Paper, ChatGPT History',
          source: '05 Misconceptions'
        },
        {
          mustKnow: true,
          q: 'MUST KNOW: Bigger always better? (Chinchilla lesson)',
          a: 'Nahi. Chinchilla (DeepMind, 2022) ne dikhaya: given compute budget pe optimal aksar "thoda chhota model + zyada tokens/data" hota hai.\n\nGPT-3 is law ke hisaab se undertrained tha (size bada, data relative kam).\nMistral 7B jaise smaller models kabhi much larger older models ko beat karte hain.\n\nLesson: quality of data + training recipe > sirf parameter flex.\n\nRevision: smart training beats blind size worship.',
          terms: 'Chinchilla, Compute-optimal, Data Quality',
          source: '05 Misconceptions'
        },
        {
          mustKnow: true,
          q: 'MUST KNOW: LLM era timeline - yaad rakhne wali line',
          a: 'Ek line mein poori kahani:\n2017 Transformer (Google) -> GPT/BERT -> Scaling laws -> GPT-3 few-shot -> RLHF/InstructGPT -> ChatGPT public explosion -> Claude/Constitutional AI -> open LLaMA wave.\n\nHum end pe nahi, middle mein hain. Isliye fundamentals + history dono revision mein rakho - hype cycles dobara aate hain.',
          terms: 'LLM Timeline',
          source: '05 Key Takeaways'
        }
      ]
    }
  ];
}

function getGlossaryData_() {
  return [
    { term: 'Turing Test', meaning: 'Ek game jaisa test: agar tum decide nahi kar pao ki chat machine se hai ya insan se, toh machine ko intelligent maana jaye. Yeh behavior check hai, dimaag ke andar consciousness prove nahi karta.', topic: 'AI Ka Janam' },
    { term: 'Turing Machine', meaning: 'Real laptop nahi - sochne ka theoretical model. Idea: clear rules + steps se koi bhi calculation systematically ho sakti hai. Computer science ki foundation.', topic: 'AI Ka Janam' },
    { term: 'Dartmouth Conference', meaning: '1956 ki meeting jahan AI field officially start hui aur naam "Artificial Intelligence" choose hua. AI ka birthday party samajh lo.', topic: 'AI Ka Janam' },
    { term: 'Artificial Neuron', meaning: 'Dimaag ke cell ka simple math version: inputs aao, weight do, sum karo, threshold se upar ho toh ON/fire. Neural networks ki pehli building block.', topic: 'AI Ka Janam' },
    { term: 'Perceptron', meaning: '1958 ka early learning network. Examples se seekhta tha, lekin sirf un problems pe jo seedhi line se alag ho saken. XOR pe fail -> winter trigger story.', topic: 'AI Ka Janam' },
    { term: 'Linearly Separable', meaning: 'Do groups ko ek seedhi line/plane se alag kar sakna. Agar dots aise mile-jule hain ki line kaam na kare, toh problem non-linearly separable.', topic: 'AI Ka Janam' },
    { term: 'XOR Problem', meaning: 'Simple logic puzzle jahan output tab 1 jab exactly ek input 1 ho. Single-layer Perceptron isko solve nahi kar sakta - deep nets ki need dikhai.', topic: 'AI Ka Janam' },
    { term: 'Symbolic AI', meaning: 'Rules aur logic se AI: "IF yeh toh woh." Clear aur explainable, lekin naya case aaye toh easily toot (brittle).', topic: 'AI Ka Janam' },
    { term: 'Connectionist AI', meaning: 'Neural network style AI: bahut connections/parameters, data se pattern seekhna. Messy real world pe strong, explain karna harder.', topic: 'AI Ka Janam' },
    { term: 'ELIZA Effect', meaning: 'Humans ki aadat: AI ko dost/insan jaisa treat karna aur emotionally attach hona, chahe pata ho yeh program hai. Ethics warning.', topic: 'AI Ka Janam' },
    { term: 'Expert System', meaning: 'Program jisme doctor/engineer ki knowledge rules mein likhi ho. Narrow domain pe useful, broad world pe maintain/generalize mushkil.', topic: 'AI Winter' },
    { term: 'Knowledge Acquisition Bottleneck', meaning: 'Expert ke dimaag se rules nikalna slow, mehnga, incomplete hona. Expert systems ka bada pain point.', topic: 'AI Winter' },
    { term: 'Brittleness', meaning: 'System ka soft na hona - thoda unexpected input aaya aur poora fail. Rules-only AI ki common weakness.', topic: 'AI Winter' },
    { term: 'Combinatorial Explosion', meaning: 'Options itne fast badhna ki har possibility check karna practically impossible (jaise chess ke paths).', topic: 'AI Winter' },
    { term: 'Heuristics', meaning: 'Smart shortcuts / rules of thumb jo search kam karte hain. Perfect guarantee nahi, lekin practical.', topic: 'AI Winter' },
    { term: 'AI Winter', meaning: 'Hype girne ke baad funding aur interest freeze wali period. Research totally delete nahi hoti, pace slow hoti hai.', topic: 'AI Winter' },
    { term: 'Lighthill Report', meaning: '1973 UK official review jisme kaha gaya AI ne bade promises deliver nahi kiye - first winter ka bada trigger.', topic: 'AI Winter' },
    { term: 'DARPA', meaning: 'US defense research agency jo AI projects fund karti thi. Jab cuts aaye, US research bhi winters mein hit hua.', topic: 'AI Winter' },
    { term: 'No Free Lunch Theorem', meaning: 'Koi ek ML algorithm har problem pe best nahi. Tool problem ke hisaab se choose karo.', topic: 'ML Revolution' },
    { term: 'Feature Engineering', meaning: 'Raw data ko useful signals mein badalna (jaise "last login kitne din pehle"). Classical ML ki superpower skill.', topic: 'ML Revolution' },
    { term: 'Kernel Trick (SVM)', meaning: 'Data ko higher dimension mein sochkar alag karna, bina heavy projection explicitly banaye - similarity function se kaam.', topic: 'ML Revolution' },
    { term: 'Random Forest / Bagging', meaning: 'Bahut decision trees alag-alag data samples pe, phir vote/average. Team wisdom se overfitting kam.', topic: 'ML Revolution' },
    { term: 'Gradient Boosting / XGBoost', meaning: 'Trees ek ke baad ek, pehli ki galtiyan theek karti hui. Spreadsheet/tabular data pe bohot strong.', topic: 'ML Revolution' },
    { term: 'HMM', meaning: 'Hidden Markov Model: andar hidden states, bahar observations. Speech jaise sequences ke liye classic tool.', topic: 'ML Revolution' },
    { term: 'TF-IDF / Bag of Words', meaning: 'Text ko word counts/weights se number vector banana. Order ignore; purane NLP ka base.', topic: 'ML Revolution' },
    { term: 'AlexNet / ImageNet 2012', meaning: 'GPU pe trained deep CNN ne image contest dominate kiya - modern deep learning boom ka public start.', topic: 'Deep Learning' },
    { term: 'ReLU', meaning: 'Activation: max(0,x). Positive pe gradient 1 rehta - deep nets mein vanishing gradient problem kam.', topic: 'Deep Learning' },
    { term: 'Vanishing Gradient', meaning: 'Bahut layers mein learning signal almost 0 ho jana, isliye early layers seekh nahi paate.', topic: 'Deep Learning' },
    { term: 'ResNet / Skip Connection', meaning: 'Output = input + change. Seedha path rakho taaki bohot deep network train ho sake.', topic: 'Deep Learning' },
    { term: 'Dropout', meaning: 'Training mein randomly neurons band - taaki model ek jagah over-depend na kare, overfitting kam ho.', topic: 'Deep Learning' },
    { term: 'Word2Vec / Embedding', meaning: 'Words ko number-vectors mein map karna jahan similar meaning geometrically paas ho (king-man+woman~=queen).', topic: 'Deep Learning' },
    { term: 'Transfer Learning', meaning: 'Bade data pe pehle seekho, phir chhote task pe adjust. Small teams ke liye AI practical banayi.', topic: 'Deep Learning' },
    { term: 'GAN', meaning: 'Generator fake banaye, Discriminator pakde - competition se realistic samples. Generative AI ka important ancestor.', topic: 'Deep Learning' },
    { term: 'AlphaFold', meaning: 'Amino acid sequence se protein 3D shape predict. AI ko scientist-tool banane ka iconic example.', topic: 'Deep Learning' },
    { term: 'Transformer / Self-Attention', meaning: 'Har word kisi bhi word ko directly dekh sakta hai. Parallel training + long-range understanding. Modern LLM foundation.', topic: 'LLM Era' },
    { term: 'BERT', meaning: 'Bidirectional Transformer encoder. Left+right context - reading/understanding tasks mein historically strong.', topic: 'LLM Era' },
    { term: 'GPT', meaning: 'Usually next-token generator (left-to-right). Writing/chat/generation mein strong.', topic: 'LLM Era' },
    { term: 'RLHF', meaning: 'Human preferences se model ko helpful/harmless/honest taraf train karna. Chatbots ko usable product banata hai.', topic: 'LLM Era' },
    { term: 'Scaling Laws', meaning: 'Model/data/compute badhao toh performance predictably improve - AI ko zyada engineering discipline banaya.', topic: 'LLM Era' },
    { term: 'Chinchilla', meaning: 'Lesson: given compute pe optimal aksar zyada data + sahi size. Sirf bada model hamesha best nahi.', topic: 'LLM Era' },
    { term: 'Few-shot Learning', meaning: 'Prompt mein thode examples dekar task karwana, bina full fine-tune. Prompt engineering ki foundation.', topic: 'LLM Era' },
    { term: 'Emergent Capabilities', meaning: 'Scale pe suddenly dikhne wali nayi abilities (jaise better multi-step reasoning), chhote models mein nahi.', topic: 'LLM Era' },
    { term: 'Constitutional AI', meaning: 'Principles (constitution) se model khud answers check/rewrite kare. Anthropic style alignment approach.', topic: 'LLM Era' },
    { term: 'Prompt Engineering', meaning: 'Sawaal/instructions smart tarike se likhna taaki model se better output mile.', topic: 'LLM Era' },
    { term: 'AGI', meaning: 'Artificial General Intelligence - har tarah ke kaam pe human-level general smartness. Abhi unresolved goal/hype target.', topic: 'General' },
    { term: 'Chinese Room', meaning: 'Searle ka thought experiment: rules se symbols chalana != truly language samajhna. Turing Test pass != real understanding.', topic: 'AI Ka Janam' }
  ];
}
