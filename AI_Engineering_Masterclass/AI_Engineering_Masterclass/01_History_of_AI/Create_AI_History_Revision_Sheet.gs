/**
 * AI Masterclass Revision Sheet
 * Paste into Apps Script Code.gs -> Save -> Run: createAIHistoryRevisionSheet
 *
 * Tab order:
 *  1) Start Here
 *  2) History of AI
 *  3) Mathematics for AI
 *  4) AI Engineer Interview Questions
 *  5) Glossary
 *
 * Style: detailed Hinglish paragraphs + "Mushkil words" under each answer.
 * Sources: 00_START_HERE | 01_History_of_AI | 02_Mathematics_For_AI | interview framing
 */

function createAIHistoryRevisionSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  ss.rename('AI Masterclass Revision - Start Here | History | Math | Interview');

  // Remove old single-tab name if present
  const old = ss.getSheetByName('Revision Q&A');
  if (old) ss.deleteSheet(old);

  buildQASheet_(ss, {
    name: 'Start Here',
    index: 0,
    title: 'Start Here - Course Mindset Revision (Hinglish) | Module 00',
    subtitle: 'README + Learning Path  |  Detailed paragraphs  |  Har answer ke neeche Mushkil words',
    topics: getStartHereRevisionData_()
  });

  buildQASheet_(ss, {
    name: 'History of AI',
    index: 1,
    title: 'History of AI - Complete Revision Q&A (Hinglish) | Module 01',
    subtitle: 'Janam -> Winter -> ML Revolution -> Deep Learning -> LLM Era  |  Paragraphs + Mushkil words',
    topics: getHistoryRevisionData_()
  });

  buildQASheet_(ss, {
    name: 'Mathematics for AI',
    index: 2,
    title: 'Mathematics for AI - Super Simple Revision (Hinglish) | Module 02',
    subtitle: '10-year-old friendly  |  Linear Algebra, Calculus, Probability, Information, Optimization',
    topics: getMathRevisionData_()
  });

  buildQASheet_(ss, {
    name: 'AI Engineer Interview Questions',
    index: 3,
    title: 'AI Engineer Interview Questions (Hinglish) | Covers Start Here + History + Math',
    subtitle: 'Hiring-style answers  |  Depth over buzzwords  |  Mushkil words under every answer',
    topics: getInterviewRevisionData_()
  });

  buildGlossarySheet_(ss, 4);

  SpreadsheetApp.flush();
  SpreadsheetApp.getUi().alert(
    'Done!\n\nTabs (in order):\n1) Start Here\n2) History of AI\n3) Mathematics for AI\n4) AI Engineer Interview Questions\n5) Glossary\n\nTip: Agar answer cut dikhe, us row ko taller resize kar lo.'
  );
}

function buildQASheet_(ss, cfg) {
  let sheet = ss.getSheetByName(cfg.name);
  if (sheet) ss.deleteSheet(sheet);
  sheet = ss.insertSheet(cfg.name, cfg.index);

  const topics = cfg.topics;

  sheet.getRange('A1:D1').merge();
  sheet.getRange('A1')
    .setValue(cfg.title)
    .setFontFamily('Arial').setFontSize(16).setFontWeight('bold')
    .setFontColor('#ffffff').setBackground('#1a365d')
    .setVerticalAlignment('middle');
  sheet.setRowHeight(1, 42);

  sheet.getRange('A2:D2').merge();
  sheet.getRange('A2')
    .setValue(cfg.subtitle)
    .setFontFamily('Arial').setFontSize(10).setFontColor('#4a5568')
    .setBackground('#edf2f7').setVerticalAlignment('middle');
  sheet.setRowHeight(2, 26);

  sheet.getRange(3, 1, 1, 4)
    .setValues([['Type', 'Content', 'Key Terms', 'Source']])
    .setFontFamily('Arial').setFontSize(11).setFontWeight('bold')
    .setFontColor('#ffffff').setBackground('#2c5282')
    .setHorizontalAlignment('center').setVerticalAlignment('middle');
  sheet.setRowHeight(3, 28);

  const topicColors = ['#2b6cb0', '#2c7a7b', '#6b46c1', '#c05621', '#9b2c2c', '#276749', '#805ad5'];
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
    .setValue('Legend: Orange = Q  |  Purple = Must Know  |  Total Qs: ' + qCounter + '  |  Har answer ke neeche Mushkil words  |  Glossary tab = extra dictionary')
    .setFontFamily('Arial').setFontSize(9).setFontColor('#718096')
    .setBackground('#f7fafc').setVerticalAlignment('middle');

  sheet.setColumnWidth(1, 88);
  sheet.setColumnWidth(2, 720);
  sheet.setColumnWidth(3, 200);
  sheet.setColumnWidth(4, 150);
  sheet.setFrozenRows(3);
  sheet.getRange(3, 1, Math.max(1, row - 3), 4)
    .setBorder(true, true, true, true, true, true, '#e2e8f0', SpreadsheetApp.BorderStyle.SOLID);

  cleanupDefaultSheets_(ss);
}

function buildGlossarySheet_(ss, index) {
  const name = 'Glossary';
  let sheet = ss.getSheetByName(name);
  if (sheet) ss.deleteSheet(sheet);
  sheet = ss.insertSheet(name, index);

  sheet.getRange('A1:D1').merge();
  sheet.getRange('A1')
    .setValue('Glossary - Important Terms (Simple Hinglish) | Start Here + History + Math + Interview')
    .setFontFamily('Arial').setFontSize(16).setFontWeight('bold')
    .setFontColor('#ffffff').setBackground('#1a365d')
    .setVerticalAlignment('middle');
  sheet.setRowHeight(1, 38);

  sheet.getRange('A2:D2').merge();
  sheet.getRange('A2')
    .setValue('Pehle answer ke neeche Mushkil words padho. Extra dictionary ke liye yeh tab use karo.')
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


/* ===== DATA ===== */

function getStartHereRevisionData_() {
  return [
    {
      title: 'TOPIC 0 - Start Here (Course Mindset)',
      subtitle: 'Files: README.md + Learning_Path.md | Kaise padhna hai, timeline, fundamentals',
      qa: [
        {
          mustKnow: true,
          q: 'Yeh AI Engineering Masterclass kiske liye hai, aur prerequisites kya hain?',
          a: 'Yeh course un logon ke liye banaya gaya hai jo pehle se coding jaante hain (jaise full-stack developer) aur AI mein enter karna chahte hain, lekin confuse hain ki kahan se shuru karein. Yeh koi 5-ghante ka YouTube playlist nahi hai. Yeh ek structured journey hai jo average developer se world-class AI engineer banane ka target rakhti hai.\n\nJo cheezein pehle se helpful hain woh programming basics, thodi si statistics jaise mean aur variance, aur sabse zaroori cheez: curiosity. Jo cheezein pehle se zaroori nahi: advanced mathematics, pehle se ML job experience, ya Python ka expert hona. Yeh pehle theory ko deeply samajhne ka course hai.\n\nIsliye agar tum sochte ho "main pehle advanced math complete karun phir AI," toh ruk jao. Course khud math ko AI ke context mein sikhata hai.\n\nMushkil words:\n- Prerequisite: Woh cheez jo course shuru karne se pehle helpful ya zaroori hoti hai.\n- Full-stack developer: Woh engineer jo website ke front (UI) aur back (server/database) dono sides pe kaam kar sakta hai.\n- Curiosity: Seekhne ki bhookh — sawaal poochna aur concepts deeply samajhna chahna.',
          terms: 'Prerequisite, Theory course, Curiosity',
          source: '00_README'
        },
        {
          mustKnow: true,
          q: 'Kyun “fundamentals first, tools second”? Sirf LangChain/PyTorch jaanne wale interviews mein kyun weak padte hain?',
          a: 'Anthropic-style hiring story yeh batati hai: jo log sirf tools ke naam bolte hain — "main LangChain use karta hoon" — aksar deep sawaal pe stuck ho jaate hain. Jo log fundamentals jaante hain — math, architecture, principles — woh tools badalne pe bhi strong rehte hain.\n\nKyunki AI field har saal badal sakti hai. Jo library aaj famous hai, do saal baad naya naam ho sakta hai. Lekin vector, gradient, attention, loss — yeh ideas slow change hote hain. Isliye course pehle neenv banata hai, tools baad mein.\n\nInterview mein interviewer chahata hai ki tum samjho kyun attention kaam karta hai, sirf yeh nahi ki "yeh state of the art hai."\n\nMushkil words:\n- Fundamentals: Base ideas jinke upar poora subject khada hota hai — jaise math, architecture, principles.\n- Tool: Ready-made library ya software jisse kaam tez hota hai, jaise LangChain ya PyTorch.\n- Architecture: System ka design — parts kaise jude hain aur data kaise flow karta hai.',
          terms: 'Fundamentals, Tools, Interview bar',
          source: '00_README'
        },
        {
          mustKnow: true,
          q: 'Sequence skip karke seedha Transformers ya Agents pe jump karna kyun galat hai?',
          a: 'Har module pichle module ke upar build hota hai. Agar tum history aur math skip karke seedha Transformers padhoge, toh tum words yaad kar loge lekin asli intuition nahi. Course isko "parrot kar sakta hai but samajh nahi sakta" kehta hai.\n\nInterviews mein yahi fail mode common hai: surface analogy milti hai, deeper "kyun" pe silence. Isliye rule simple hai: pehle module complete karo, uske interview questions khud jawab do, agar nahi aaye toh dobara padho, phir agla module.\n\nEager hona natural hai. Lekin building ke pehle floor ke bina penthouse nahi banta.\n\nMushkil words:\n- Sequence: Sahi order — pehle foundation, phir advanced topics.\n- Parrot: Bina samjhe words dohrana, jaise toota bolta hai.\n- Intuition: Andar se feel hona ki concept kyun sahi hai, sirf formula yaad nahi.',
          terms: 'Sequence, Parrot vs understand',
          source: '00_README'
        },
        {
          q: 'Active reading kya hai, aur Feynman Technique kaise use karein?',
          a: 'Passive reading matlab aankhein chalti rahein, dimaag soye. Active reading mein tum khud sawaal poochte ho: yeh concept kyun exist karta hai? Doosre concepts se kaise juda hai? Agar 10 saal ke bacche ko samjhaun toh kya kahun?\n\nFeynman Technique isse connected hai. Richard Feynman ka idea: agar tum simple words mein explain nahi kar sakte, toh tum abhi poora nahi jaante. Har topic ke baad blank page pe apne words likho. Jahan ruk jao, wahan gap hai — wahan dobara padho.\n\nYeh slow lagta hai, lekin yeh wahi skill hai jo interviews mein depth dikhati hai.\n\nMushkil words:\n- Active reading: Padhte waqt sochna, sawaal poochna, connections banana — sirf highlight nahi.\n- Feynman Technique: Simple language mein explain karke apni understanding check karne ka method.\n- Gap: Woh jagah jahan tumhara explanation toot jata hai — matlab learning hole.',
          terms: 'Active reading, Feynman Technique',
          source: '00_README'
        },
        {
          q: 'Course ke modules ka map simple language mein kaise yaad rahe?',
          a: 'Course ab 15 modules ka hai. Pehle foundation: History, Mathematics, Machine Learning, Deep Learning. Phir modern core: Transformers/LLMs, Generative AI, Prompt Engineering, RAG/Vectors, Agents. Phir production aur responsibility: MLOps (with observability/evals), Ethics/Safety, Industry, Interview Prep. End mein do practical modern tracks: Context Engineering aur MCP.\n\nMap yaad rakhne ka tarika groups mein socho: pehle neenv, phir modern AI building blocks, phir real-world deploy aur safety, phir context/tools protocols. Har group ke bina agla group adhoora feel hota hai.\n\nStart Here khud content nahi sikhata jaise history dates; yeh batata hai journey kaise chalegi.\n\nMushkil words:\n- Module: Course ka ek bada chapter-folder jisme related lessons hote hain.\n- RAG: Retrieval-Augmented Generation — pehle documents dhoondho, phir unse jawab banao.\n- MCP: Model Context Protocol — AI apps ko tools/data se jodne ka shared standard.',
          terms: '15 modules, Learning map',
          source: '00_README'
        },
        {
          mustKnow: true,
          q: 'Realistic timeline aur weekly hours kya hain?',
          a: 'Job aur life ke saath roughly 12 months assume kiya gaya hai. Intensive mode mein 4-6 months possible hai agar zyada time do. Har week roughly 10-12 hours: weekdays 1-1.5 hours, weekend 3-4 hours milake.\n\nQuality over speed. Agar math week mein slow feel ho, toh yeh normal hai. Learning path map hai, GPS nahi — life interrupt karegi, lekin 70-80 percent consistency bhi bahut door le jaati hai.\n\n"Main behind hoon" wali feeling ko course explicitly reject karta hai: yeh tumhari journey hai, kisi aur ki race nahi.\n\nMushkil words:\n- Intensive mode: Zyada hours dekar course jaldi complete karne ka mode.\n- Consistency: Har din/week thoda-thoda regular effort, sirf occasional burst nahi.\n- Learning path: Week-by-week plan jo batata hai kya padhna hai aur kab.',
          terms: '12 months, 10-12 hrs/week',
          source: '00_README + Learning_Path'
        },
        {
          q: 'Learning path ke 4 phases aur month milestones kya sikhate hain?',
          a: 'Phase 1 Foundations (months 1-3): history, math, ML, deep learning neenv. Phase 2 Modern AI (roughly months 4-7): transformers, genAI, prompts, RAG, agents, context, MCP, MLOps. Phase 3 Mastery: ethics/safety, industry, specialization. Phase 4 Job ready: interview prep aur real applications.\n\nMilestones checklists hain. Month 1 end: history + math importance non-technical friend ko explain. Month 4: transformer/attention explain. Month 7: agents + context layer + MCP + observability explain. Yeh milestones tumhe batate hain ki "padh liya" aur "samajh gaya" mein farq hai.\n\nAgar milestone miss ho, guilt ki jagah us module pe wapas jao.\n\nMushkil words:\n- Phase: Journey ka bada stage — foundation, modern AI, mastery, job ready.\n- Milestone: Checkpoint jahan tum check karte ho ki target skill aa gayi ya nahi.\n- Observability: Production mein traces, cost, latency, quality dekhne ka system.',
          terms: 'Four phases, Milestones',
          source: '00_Learning_Path'
        },
        {
          q: 'Stuck hone pe kya karna hai? Memory tips kya hain?',
          a: 'Agar mathematics confuse kare: 3Blue1Brown jaise visual videos dekho aur theory file dobara padho. Agar ek concept baar-baar atke: Feynman blank page. Agar demotivated: history winters yaad karo — field ne decade-level setbacks face kiye. Agar sab overlap lage: mind map banao.\n\nMemory tips: spaced repetition (purane concepts revisit), mind maps, kisi ko sikhana, agar possible ho toh discussion group. Teach someone best test hai — jab tum explain karte ho, gaps dikhte hain.\n\nYeh soft tips nahi, engineering learning hygiene hain.\n\nMushkil words:\n- Spaced repetition: Thode thode gaps chhod kar same cheez dobara revise karna taaki yaad tikey.\n- Mind map: Concepts ko bubbles aur lines se jodkar drawing banana.\n- Demotivated: Mann utra hua feel — progress slow lagna.',
          terms: 'Stuck playbook, Spaced repetition',
          source: '00_README + Learning_Path'
        },
        {
          mustKnow: true,
          q: 'Interview depth story ka lesson kya hai (analogy vs mathematical understanding)?',
          a: 'Story mein ek bright developer React/Node jaanta hai lekin attention pe sirf "dictionary lookup" jaisi surface analogy deta hai. Jab interviewer poochta hai softmax over queries and keys mathematically kya karta hai, woh stuck ho jata hai. Doosra candidate kam experience ke baad bhi soft distribution, multi-head specialization, aur RNN se parallelization farq explain karta hai — woh hire hota hai.\n\nLesson: companies depth kharidti hain, buzzwords nahi. Course ka goal wahi depth banana hai. Analogies shuru karne ke liye theek hain, lekin final answer mein mechanism aur tradeoffs chahiye.\n\nIsliye Start Here se hi mindset set karo: samajhna > naam yaad rakhna.\n\nMushkil words:\n- Analogy: Ek simple comparison jisse idea samajhne mein madad mile, jaise "attention = spotlight".\n- Softmax: Numbers ko probabilities mein badalne ka math step jinka sum 1 hota hai.\n- Tradeoff: Har choice ka fayda aur nuksaan — zyada accuracy lekin zyada cost, wagaira.',
          terms: 'Interview depth, Attention',
          source: '00_README'
        }
      ]
    }
  ];
}

function getHistoryRevisionData_() {
  return [
    {
      title: 'TOPIC H 1 - AI Ka Janam (1940s-1960s)',
      subtitle: 'File: 01_AI_Ka_Janam.md  |  Turing, Dartmouth, Perceptron, ELIZA, Expert Systems  |  Answers = simple + detailed | Answers rewritten style: paragraphs + Mushkil words',
      qa: [
        {
          q: 'Alan Turing ka AI mein specific contribution kya tha?',
          a: 'Alan Turing ko aaj log "computer science ke father" bhi kehte hain. Unka AI contribution mainly do badi cheezein hain - dono ko simple socho.\n\n1) Turing Test (1950):\nSocho jaise ek game. Ek side pe tum baithte ho chat karne. Doosri side pe ya toh insan hai ya machine. Agar tum decide nahi kar paate ki machine se baat ho rahi hai ya insan se - toh Turing kehta hai: us machine ko "intelligent" maano. Yeh philosophical debate nahi - practical test hai. Jaise school mein exam se check karte ho padha hai ya nahi.\n\n2) Turing Machine (theory):\nYeh real machine nahi, sochne ka model hai. Idea yeh: agar rules clear hain, toh koi bhi calculation step-by-step machine kar sakti hai. Matlab: agar "sochna / problem solve" bhi rules + steps mein tod sakte ho, toh theoretically machine try kar sakti hai.\n\nImportant clarification: Turing ne "AI" naam invent nahi kiya, aur field bhi unhone akele nahi banayi. Unhone strong foundation di - sawaal + test + theory. Baad mein 1956 mein field officially bani.\n\nPersonal note (revision ke liye): UK government ne unhe homosexuality ke liye punish kiya; woh sirf 41 pe guzar gaye. History padhte waqt yeh bhi yaad rakhna chahiye.\n\nMushkil words:\n- Turing Test: Chat dekh ke decide karna ki opposite side insan hai ya machine — behavior test.\n- Turing Machine: Calculation ka theoretical model: clear rules + steps.',
          terms: 'Turing Test, Turing Machine',
          source: '01_AI_Ka_Janam'
        },
        {
          q: 'Dartmouth Conference 1956 ka significance kya tha?',
          a: 'Pehle poori picture paragraphs mein samjho, phir details.\n\nIsko AI ka "official birthday party" samajh lo.\n\n1956 summer mein USA ke Dartmouth College pe scientists mile - John McCarthy, Marvin Minsky, Claude Shannon, aur aur log. Unhone formally decide kiya: is nayi research field ka naam "Artificial Intelligence" hoga.\n\nUnka dream bahut bada tha. Unhone literally socha ki intelligence ke har hisse ko (seekhna, sochna, language...) itna clearly likha ja sakta hai ki machine copy kar le. Kuch log even soch rahe the ki 2 months ki study se bade problems solve ho jayenge. Aaj yeh naive lagta hai - jaise koi bole "2 months mein poori medicine seekh loonga."\n\nPhir bhi significance huge hai:\n- Pehli baar AI ek organized field bani\n- Log ek community ban gaye\n- Goals, language, aur research direction mil gayi\n\nRevision line: Dartmouth = AI ka naam + community + official start.\n\nAb socho: agar tum kisi dost ko batao, toh pehle story bolo, baad mein list. Interviews mein bhi yahi order strong lagta hai.\n\nMushkil words:\n- Dartmouth: 1956 meeting jahan AI field official naam/community mili.\n- John McCarthy: Yeh is sawaal ka important technical idea hai. Upar ke paragraphs mein story pehle padho; Glossary tab mein related term bhi dekh sakte ho.',
          terms: 'Dartmouth, John McCarthy',
          source: '01_AI_Ka_Janam'
        },
        {
          q: 'McCulloch-Pitts neuron kya tha aur kyun important hai?',
          a: 'Pehle poori picture paragraphs mein samjho, phir details.\n\n1943 mein ek scientist (McCulloch) aur ek mathematician (Pitts) ne socha: dimaag ke cells (neurons) ko maths se samjha ja sakta hai.\n\nSimple analogy: dimaag ka neuron jaise ek chhote switch ki tarah. Inputs aate hain (signals). Agar total signal ek limit (threshold) se zyada ho, switch ON (fire). Warna OFF.\n\nIsi idea ko artificial neuron kehte hain:\n- Inputs lo\n- Unhe weight do (kitna important)\n- Sum nikalo\n- Threshold check karo\n- Output: fire / not fire\n\nKyun important?\nKyunki yeh pehli strong bridge thi biology aur machines ke beech. Aaj ChatGPT / neural networks bahut complex hain, lekin unki "root idea" yahi hai: chhote units milke smart behavior bana sakte hain.\n\nRevision line: 1943 neuron math = aaj ke AI ka pehla seed.\n\nAb socho: agar tum kisi dost ko batao, toh pehle story bolo, baad mein list. Interviews mein bhi yahi order strong lagta hai.\n\nMushkil words:\n- Artificial Neuron: Brain cell ka simple math switch: weighted sum + threshold.\n- Threshold: Limit — isse upar signal ON, warna OFF.',
          terms: 'Artificial Neuron, Threshold',
          source: '01_AI_Ka_Janam'
        },
        {
          q: 'ELIZA Effect kya hai aur AI ethics mein kyun relevant hai?',
          a: 'ELIZA 1966 ka chatbot tha. Yeh "samajhta" nahi tha. Yeh mostly pattern matching karta tha - jaise agar tum "I feel sad" bolo, woh reply de: "Why do you feel sad?" Doctor/therapist jaisa lagta tha.\n\nShocking baat: log jaante the yeh program hai, phir bhi emotionally attach ho gaye. Kuch log privately baat karna chahte the. Is tendency ko ELIZA Effect kehte hain - AI ko insan jaisa treat karna.\n\n10-year-old example: agar ek teddy bear bolne lage, baccha usse dost maan leta hai. AI bhi similarly "dost" feel ho sakta hai.\n\nEthics mein kyun important?\n1) Manipulation risk - koi AI se logon ko fool kar sakta hai\n2) Galat expectations - log sochenge AI sab jaanta / feel karta hai\n3) Dependency - emotional support sirf AI pe rakhna unhealthy ho sakta hai\n\nIsliye modern AI products ko clearly batana chahiye: "Main AI hoon." Yeh nice-to-have nahi, safety ke liye zaroori hai.\n\nMushkil words:\n- ELIZA: 1966 chatbot jo patterns se therapist-like replies deta tha.\n- ELIZA Effect: AI ko insan/dost maan lene ki human tendency.\n- Pattern Matching: Fixed templates se reply banana, deep understanding nahi.',
          terms: 'ELIZA, ELIZA Effect, Pattern Matching',
          source: '01_AI_Ka_Janam'
        },
        {
          q: 'Symbolic AI vs Connectionist AI mein kya farak hai?',
          a: 'Do alag tarike hain machine ko "smart" banane ke.\n\n1) Symbolic AI (rules wali AI):\nJaise recipe book. Clear rules likho:\n"IF bukhaar hai AND khansi hai THEN flu socho."\nFayda: samajh aata hai, explain kar sakte ho.\nNuksaan: real life messy hai. Thoda naya case aaya jo rules mein nahi - system confuse / fail. Isko brittle kehte hain (tootne wala).\n\n2) Connectionist AI (neural networks):\nJaise dimaag ke connections. Bahut examples dikhao, machine khud pattern seekh le. Explicit recipe kam, experience zyada.\nFayda: photos, speech, language jaisi messy cheezon pe better.\nNuksaan: andar kya ho raha hai explain karna mushkil (black box feel).\n\nAaj mostly connectionist dominate karta hai (ChatGPT etc.), lekin symbolic completely dead nahi. Research mein dono milake (neuro-symbolic) bhi explore ho raha hai.\n\nRevision: Symbolic = rules. Connectionist = learning from data.\n\nMushkil words:\n- Symbolic AI: Rules/logic wali AI.\n- Connectionist AI: Neural nets / learned connections wali AI.\n- Neuro-symbolic: Rules + neural learning milane ki research direction.',
          terms: 'Symbolic AI, Connectionist AI, Neuro-symbolic',
          source: '01_AI_Ka_Janam'
        },
        {
          q: 'Arthur Samuel ka Checkers program historically important kyun hai?',
          a: 'Pehle poori picture paragraphs mein samjho, phir details.\n\n1952 mein Arthur Samuel ne checkers (draughts) khelne wala program banaya jo sirf fixed rules follow nahi karta tha - woh khelte-khelte improve hota tha.\n\nSimple idea: jaise tum game khelte ho aur galti se seekhte ho. Program bhi track karta tha kaunse moves jeet ki taraf le jaate hain, kaunse haar ki taraf. Time ke saath better moves prefer karne laga.\n\nYeh historically huge hai kyunki:\n- Yeh pehle famous examples mein se ek tha jahan machine "experience se seekhi"\n- Samuel ne hi "Machine Learning" term popular/coin ki\n- Yeh Dartmouth (1956) se pehle ka proof hai ki learning approach possible hai\n\nAaj ka reinforcement learning (AlphaGo, ChatGPT ka RLHF) conceptually isi family se related hai: try -> feedback -> improve.\n\nRevision line: Samuel Checkers = Machine Learning ka early hero.\n\nAb socho: agar tum kisi dost ko batao, toh pehle story bolo, baad mein list. Interviews mein bhi yahi order strong lagta hai.\n\nMushkil words:\n- Machine Learning: Data/experience se improve hone wale algorithms.\n- Reinforcement Learning: Try-feedback-improve style learning (rewards).',
          terms: 'Machine Learning, Reinforcement Learning',
          source: '01_AI_Ka_Janam'
        },
        {
          q: 'Early AI researchers itne over-optimistic kyun the?',
          a: 'Kyunki pehle success dekh ke unhone socha: "Agar yeh ho gaya, toh sab jaldi ho jayega."\n\nReasons simple language mein:\n1) Narrow success: theorem prove, checkers jeet - yeh specific games/problems the. General human intelligence bahut badi cheez hai. Jaise: agar tum Monopoly jeet gaye, iska matlab nahi ki tum cricket bhi world-class ho.\n2) No map: pehle kisi ko pata nahi tha intelligence kitni hard hai.\n3) Funding pressure: government/military impressive promises sunna chahti thi.\n4) Media hype: headlines badha dete hain.\n\nAaj bhi same trap hai. LLMs amazing hain, lekin har claim "AGI next year" automatically true nahi. History sikhati hai: excitement theek, overconfidence dangerous.\n\nRevision: early optimism = small win ko big win maan lena.\n\nMushkil words:\n- Hype Cycle: Excitement uthna phir disappointment aana.\n- AGI: Har domain mein human-level general intelligence ka goal.\n- Over-optimism: Chhoti jeet ko poori problem solved maan lena.',
          terms: 'Hype Cycle, AGI, Over-optimism',
          source: '01_AI_Ka_Janam'
        },
        {
          q: 'MYCIN expert system hospitals mein deploy kyun fail hua?',
          a: 'MYCIN blood infection diagnose karne wala expert system tha (rules of doctors encode karke). Kuch tests mein yeh doctors se better bhi perform karta tha. Phir bhi hospitals mein widely deploy nahi hua.\n\nKyun? Tech accuracy hi kaafi nahi hoti.\n\n1) Integration: hospital already billing, records, workflows use karte hain. Nayi system fit karna hard.\n2) Liability: agar AI galat bole aur patient ko nuksaan ho - zimmedari kiski? Doctor? Hospital? Software?\n3) Human factors: kuch doctors resist - "computer mujhe sikhayega?"\n4) Maintenance: medicine har saal badalti hai. Rules manually update karna nightmare.\n\nLesson aaj ke AI products ke liye bhi same: demo success != real-world success. Integration, trust, law, aur updates matter karte hain.\n\nMushkil words:\n- Expert System: Rules mein expert knowledge encode karne wala program.\n- Liability: Nuksaan ki legal/professional zimmedari.\n- Maintenance: System ko time ke saath update/repair karte rehna.',
          terms: 'Expert System, Liability, Maintenance',
          source: '01_AI_Ka_Janam'
        },
        {
          q: 'Turing Test ki limitations kya hain?',
          a: 'Turing Test useful hai, lekin perfect proof of "true thinking" nahi.\n\nLimitations:\n1) Chinese Room idea: socho tumhe Chinese nahi aati, lekin ek book hai jo batati hai kaunsa symbol dekh ke kya reply likhna hai. Bahar wale ko lagega tum Chinese jaante ho - andar tum samajhte nahi. Machine bhi smart "dikhti" hai bina truly understanding ke.\n2) Gaming: system specially test pass karne ke liye train ho sakti hai.\n3) Sirf behavior: yeh check karta hai human-like reply, consciousness nahi.\n4) Culture/language bias: "intelligent reply" alag cultures mein alag lag sakta hai.\n\nIsliye GPT convincingly chat kar sakta hai, lekin "kya yeh consciously soch raha hai?" alag sawaal hai - abhi open debate.\n\nMushkil words:\n- Chinese Room: Symbols rules se chalana != truly language samajhna.\n- Consciousness: Self-aware experience — machines pe open debate.\n- Behavior vs Mind: Yeh is sawaal ka important technical idea hai. Upar ke paragraphs mein story pehle padho; Glossary tab mein related term bhi dekh sakte ho.',
          terms: 'Chinese Room, Consciousness, Behavior vs Mind',
          source: '01_AI_Ka_Janam'
        },
        {
          q: 'Perceptron ki limitations kya thi aur aaj kyun important hain?',
          a: 'Perceptron (1958) pehla popular learning neural network tha. Yeh examples dekh ke seekhta tha - bahut exciting tha.\n\nLekin ek badi limit thi: yeh sirf un problems ko solve karta tha jo "seedhi line" se alag ho saken (linearly separable).\n\nXOR example (simple puzzle):\nInputs: (0,0)->0, (0,1)->1, (1,0)->1, (1,1)->0.\nYeh pattern ek seedhi line se separate nahi hota. Minsky & Papert (1969) ne mathematically dikhaya: single-layer Perceptron XOR nahi kar sakta. Yeh bada setback tha - pehle AI Winter ki foundation.\n\nAaj kyun important?\nKyunki multi-layer networks + non-linear activations (jaise ReLU) exactly yahi limit todte hain. Deep learning isliye jeetta hai kyunki woh non-linear, complex patterns seekh sakta hai.\n\nRevision: Perceptron fail = deep learning need ka proof.\n\nMushkil words:\n- Perceptron: Early single-layer learning network.\n- XOR: Logic jahan output 1 tab jab exactly ek input 1.\n- Linearly Separable: Seedhi line/plane se classes alag kar sakna.\n- Deep Learning: Multi-layer neural nets se representation learning.',
          terms: 'Perceptron, XOR, Linearly Separable, Deep Learning',
          source: '01_AI_Ka_Janam'
        },
        {
          mustKnow: true,
          q: 'MUST KNOW: AI 2010s mein deep learning se start nahi hua - sahi timeline kya hai?',
          a: 'Pehle poori picture paragraphs mein samjho, phir details.\n\nBahut log sochte hain AI ChatGPT / deep learning se shuru hua. Galat.\n\nSimple timeline:\n- 1943: artificial neuron math\n- 1950: Turing Test\n- 1956: Dartmouth - AI field official\n- 1960s-70s: early programs + pehla winter\n- 1980s: expert systems boom + doosra winter\n- 1980s-2000s: statistical Machine Learning\n- 2012: deep learning boom (AlexNet)\n- 2017+: Transformers / LLM era\n\nDeep learning ek powerful chapter hai, pehla page nahi.\n\nRevision sentence: AI purana subject hai; ChatGPT uski latest chapter hai.\n\nAb socho: agar tum kisi dost ko batao, toh pehle story bolo, baad mein list. Interviews mein bhi yahi order strong lagta hai.\n\nMushkil words:\n- Timeline: Events ka time order.\n- Misconception: Galat common belief.',
          terms: 'Timeline, Misconception',
          source: '01 Key Takeaways'
        },
        {
          mustKnow: true,
          q: 'MUST KNOW: Pehle important programs kaunse the (Logic Theorist, GPS, LISP, DENDRAL, ELIZA)?',
          a: 'Pehle poori picture paragraphs mein samjho, phir details.\n\nEarly AI sirf theory nahi thi - real programs bhi bane:\n\n- Logic Theorist (1956): maths theorems prove karta tha. Kabhi book se shorter proof bhi nikaalta.\n- GPS (General Problem Solver): idea tha kisi bhi problem ko goals/sub-goals mein todna. Theory mein strong, real world mein limited. Important idea: problem-solving = search.\n- LISP (1958): McCarthy ki language, AI research ke liye decades tak dominant.\n- Samuel Checkers: pehla famous learning program.\n- ELIZA (1966): pehla famous chatbot.\n- DENDRAL: chemistry expert system - pehle practical expert systems mein.\n- MYCIN: medical diagnosis rules system.\n\nInse seekho: aaj ke ideas (search, learning, chatbots, expert knowledge) ke seeds bahut pehle lage the.\n\nAb socho: agar tum kisi dost ko batao, toh pehle story bolo, baad mein list. Interviews mein bhi yahi order strong lagta hai.\n\nMushkil words:\n- Logic Theorist: Early theorem-proving program.\n- GPS: General Problem Solver — search/goals idea.\n- LISP: Classic AI programming language.\n- DENDRAL: Early chemistry expert system.\n- ELIZA: 1966 chatbot jo patterns se therapist-like replies deta tha.',
          terms: 'Logic Theorist, GPS, LISP, DENDRAL, ELIZA',
          source: '01 Core Concepts'
        }
      ]
    },

    {
      title: 'TOPIC H 2 - AI Winter Kya Tha (1970s-1990s)',
      subtitle: 'File: 02_AI_Winter_Kya_Tha.md  |  Hype crash, funding freeze, expert systems collapse | Answers rewritten style: paragraphs + Mushkil words',
      qa: [
        {
          q: 'AI Winter kya hota hai? Kitne major winters hue?',
          a: 'AI Winter ka matlab mausam ki thand nahi. Yeh metaphor hai.\n\nSimple picture:\n1) Pehle bahut hype - "machines jaldi human jaisi ho jayengi!"\n2) Reality mein promise poora nahi hota\n3) Government/companies paise band kar deti hain\n4) Researchers doosri fields mein chale jaate hain\n5) Progress slow ho jaati hai\n\nJaise winter mein trees grow kam karte hain - field freeze feel hoti hai.\n\nDo major winters:\n- First: ~1974-1980 (UK Lighthill Report + US DARPA cuts)\n- Second: ~1987-1993 (Expert systems fail + specialized Lisp computers crash)\n\nWinter forever nahi rehta. Naye ideas aate hain (backprop recovery, statistical ML) aur spring wapas aati hai.\n\nRevision: Winter = overhype -> disappointment -> funding freeze.\n\nMushkil words:\n- AI Winter: Hype girne ke baad funding/interest freeze period.\n- DARPA: US defense research funding agency.\n- Lighthill Report: 1973 UK report: AI promises vs weak results.',
          terms: 'AI Winter, DARPA, Lighthill Report',
          source: '02_AI_Winter'
        },
        {
          q: 'Expert Systems kyun fail hue?',
          a: 'Expert system = program jisme doctor/engineer ki knowledge rules ke form mein likh di jati hai.\n\nKabhi-kabhi narrow jagah pe amazing (jaise XCON ne DEC computers configure karke bohot paise bachaye). Broad world mein fail.\n\n4 simple reasons:\n1) Knowledge nikalna hard: expert ke dimaag se rules likhna slow, mehnga, incomplete. Expert khud har intuition explain nahi kar sakta.\n2) Brittle: thoda naya situation aaya jo rules mein nahi - system toot gaya.\n3) Generalize nahi: blood infection wala system X-ray nahi padh sakta. Har domain ke liye naya system.\n4) Update nightmare: world badalta rehta hai (nayi medicines etc.), rules haath se update mushkil.\n\nIsliye baad mein approach badla: manually rules kam, data se seekhna zyada.\n\nMushkil words:\n- Expert System: Rules mein expert knowledge encode karne wala program.\n- Knowledge Bottleneck: Experts se rules nikalna slow/mehnga/incomplete.\n- Brittleness: Unexpected case pe toot jaana.',
          terms: 'Expert System, Knowledge Bottleneck, Brittleness',
          source: '02_AI_Winter'
        },
        {
          q: 'Lighthill Report ki main criticism kya thi?',
          a: 'Pehle poori picture paragraphs mein samjho, phir details.\n\n1973 mein UK government ne James Lighthill se AI research review karwaya.\n\nUnka mood basically: "Tumne bahut bade promises kiye, results chhote hain."\n\nCriticism roughly:\n- Robots: real duniya mein nahi, controlled toy environments mein\n- Language understanding: limited domains se aage nahi\n- General intelligence: clear progress proof weak\n- Combinatorial explosion: real problems compute se bahut badi\n\nRecommendation: broad "magic AI" funding kaato, specific useful areas pe focus.\n\nResult: UK AI labs badly hit. Yeh First AI Winter ka bada trigger bana.\n\nRevision: Lighthill = official "promises vs reality" report card jo fail tha.\n\nAb socho: agar tum kisi dost ko batao, toh pehle story bolo, baad mein list. Interviews mein bhi yahi order strong lagta hai.\n\nMushkil words:\n- Lighthill Report: 1973 UK report: AI promises vs weak results.\n- Overpromise: Yeh is sawaal ka important technical idea hai. Upar ke paragraphs mein story pehle padho; Glossary tab mein related term bhi dekh sakte ho.',
          terms: 'Lighthill Report, Overpromise',
          source: '02_AI_Winter'
        },
        {
          q: 'Combinatorial explosion kya hai aur early AI ko kaise affect kiya?',
          a: 'Simple matlab: options itne badh jaate hain ki count karna practically impossible.\n\nChess example:\nHar position pe ~30 moves. Game ~40 moves. Combinations roughly 30x30x30... 40 baar. Number itna bada ki universe ke atoms se compare hota hai. Computer har possibility check nahi kar sakta.\n\nEarly AI programs chhote "toy" worlds mein chal rahe the (limited rules). Jab real world try kiya - memory/time khatam.\n\nYeh pehle winters ka technical villain tha. Baad mein solutions: smart shortcuts (heuristics), pruning, statistical methods - har door knock karna band.\n\nRevision: combinatorial explosion = "too many doors to check."\n\nMushkil words:\n- Combinatorial Explosion: Options itne badh jaayein ki check impossible.\n- Brute force: Yeh is sawaal ka important technical idea hai. Upar ke paragraphs mein story pehle padho; Glossary tab mein related term bhi dekh sakte ho.\n- Heuristics: Smart shortcuts jo search kam karte hain.',
          terms: 'Combinatorial Explosion, Brute force, Heuristics',
          source: '02_AI_Winter'
        },
        {
          q: 'Kya aaj bhi AI Winter possible hai?',
          a: 'Pehle poori picture paragraphs mein samjho, phir details.\n\nShort answer: poori field freeze kam likely; kisi-kisi area mein local winter possible.\n\nKyun field-wide winter ab mushkil?\n- Real utility: ChatGPT/Copilot millions use karte hain (sirf demo nahi)\n- Paise bhi ban rahe hain (products/revenue)\n- Infrastructure deep hai (cloud, GPUs, data)\n- Countries competition - funding suddenly zero unlikely\n\nPhir bhi:\nAgar kisi domain mein (jaise fully driverless cars) promise reality se bohot aage rahe, wahan hype gir sakti hai - mini winter.\n\nRevision attitude: excitement rakho, lekin har headline pe 100% mat maan lo.\n\nAb socho: agar tum kisi dost ko batao, toh pehle story bolo, baad mein list. Interviews mein bhi yahi order strong lagta hai.\n\nMushkil words:\n- Domain-specific Winter: Poori field nahi, ek area mein hype crash.\n- Utility: Asli useful kaam / value.\n- Bubble: Prices/expectations reality se bohot aage.',
          terms: 'Domain-specific Winter, Utility, Bubble',
          source: '02_AI_Winter'
        },
        {
          q: 'AI Winters ne field ko positively kaise affect kiya?',
          a: 'Winters sirf dukh nahi the - unhone field ko mature bhi kiya.\n\nPositive effects:\n1) Galat approaches saaf hue (sirf brittle rules pe depend)\n2) Claims zyada careful/honest hue\n3) Jo log hype chhod ke fundamentals pe lage (Hinton, LeCun...), unka deep work baad mein jeeta\n4) Theory better hui (stats, optimization)\n5) Industry ne poocha: "real fayda kahan hai?"\n\nAnalogy: exam fail ke baad better study method banana. Painful, lekin growth.\n\nRevision: winters = hard teacher.\n\nMushkil words:\n- Winter Survivors: Hinton/LeCun/Bengio etc. jo unfashionable nets pe lage rahe.\n- Fundamentals: Base principles jo long-term matter karte hain.\n- ROI: Return on Investment — paisa/fayda vs cost.',
          terms: 'Winter Survivors, Fundamentals, ROI',
          source: '02_AI_Winter'
        },
        {
          q: 'Japan ka Fifth Generation Project kya tha aur kyun fail hua?',
          a: 'Pehle poori picture paragraphs mein samjho, phir details.\n\n1980s mein Japan ne bohot bada, mehnga, 10-year project announce kiya: "intelligent computers" banana, mainly logic programming (Prolog) pe.\n\nDream: expert systems ko bahut tez parallel machines pe chalana, US ko challenge.\n\nFail kyun?\n- Galat bet: logic/rules pe zor, jab statistical learning better prove ho raha tha\n- Custom hardware jaldi outdated\n- Goals unclear / move hote rahe\n- Parallel hardware aur software match nahi kiye\n\nResearch waste nahi hua, lekin "duniya badalne wala" promise miss. US ne darr ke kuch funding badhayi - panic bhi hype ka part tha.\n\nRevision: bada budget + galat paradigm = fail possible.\n\nAb socho: agar tum kisi dost ko batao, toh pehle story bolo, baad mein list. Interviews mein bhi yahi order strong lagta hai.\n\nMushkil words:\n- Fifth Generation Project: 1980s Japan ka bada logic-computer dream project.\n- Prolog: Logic programming language.\n- Logic Programming: Rules/logic se compute karne ka paradigm.',
          terms: 'Fifth Generation Project, Prolog, Logic Programming',
          source: '02_AI_Winter'
        },
        {
          q: 'Hinton, LeCun, Bengio - "Winter Survivors" kyun special hain?',
          a: 'Pehle poori picture paragraphs mein samjho, phir details.\n\nJab neural networks "unfashionable / dead" maane jaate the, tab bhi yeh teen log basics pe kaam karte rahe.\n\n- Hinton: backpropagation / deep learning ideas push\n- LeCun: CNNs (images ke liye nets) - handwriting etc.\n- Bengio: language modeling direction\n\n2012 AlexNet moment aaya toh unka patient work suddenly center mein aa gaya. 2018 mein inhe ACM Turing Award mila (computing ka Nobel jaisa).\n\nLife lesson for revision: hype pe career mat banao; fundamentals pe lage raho. Fashion change hota hai, strong basics jeette hain.\n\nAb socho: agar tum kisi dost ko batao, toh pehle story bolo, baad mein list. Interviews mein bhi yahi order strong lagta hai.\n\nMushkil words:\n- Deep Learning Trinity: Hinton, LeCun, Bengio.\n- CNN: Images ke liye convolutional neural net.\n- Backpropagation: Loss se peeche gradients bhejne ka algo.\n- AlexNet: 2012 ImageNet jeetne wala famous deep CNN.',
          terms: 'Deep Learning Trinity, CNN, Backpropagation, AlexNet',
          source: '02_AI_Winter'
        },
        {
          mustKnow: true,
          q: 'MUST KNOW: Do winters ke beech Expert Systems Spring (1980-87) kya tha?',
          a: 'Pehle winter ke baad thodi spring aayi.\n\nXCON (DEC) ne computers configure karke crores save kiye -> companies excited. Har jagah AI department, Lisp Machines (special expensive computers), Japan Fifth Gen hype.\n\nYeh boom short tha. Jab expert systems broad fail hue aur specialized hardware crash hua (PCs saste/powerful), Second Winter aa gaya.\n\nRevision: boom -> brittle tech -> crash = classic winter pattern.\n\nMushkil words:\n- XCON: DEC ka successful computer-config expert system.\n- Lisp Machines: AI ke liye specialized expensive computers.\n- Boom-Bust: Tez uthan phir crash.',
          terms: 'XCON, Lisp Machines, Boom-Bust',
          source: '02 Interlude'
        },
        {
          mustKnow: true,
          q: 'MUST KNOW: AI Winter = research completely stop? (Misconception)',
          a: 'Nahi. Winter mein research "band" nahi hoti - funding aur popularity girti hai, pace slow hoti hai.\n\nImportant ideas winters ke dauran / around bhi aayi (jaise backprop recovery). Kuch researchers (Hinton/LeCun) quietly continue kiye.\n\nIsliye winter = pause/slowdown, delete button nahi.\n\nRevision: winter slows the field; it does not erase it.\n\nMushkil words:\n- Misconception: Galat common belief.\n- Continuity: Winter mein bhi research bilkul delete nahi hoti.',
          terms: 'Misconception, Continuity',
          source: '02 Misconceptions'
        }
      ]
    },

    {
      title: 'TOPIC H 3 - ML Revolution / Statistical ML (1980s-2000s)',
      subtitle: 'File: 03_ML_Revolution.md  |  SVM, RF, Boosting, HMM, Feature Engineering, No Free Lunch | Answers rewritten style: paragraphs + Mushkil words',
      qa: [
        {
          q: 'Statistical ML era mein kaunse major algorithms dominate karte the?',
          a: 'Pehle poori picture paragraphs mein samjho, phir details.\n\nSecond winter ke baad AI ne practical turn liya: "data se patterns nikaalo." Is era ke stars:\n\n- Logistic Regression: haan/na type decisions (approve loan?)\n- Naive Bayes: spam vs not spam - simple + fast\n- SVM: smart boundary se classes alag (kernel trick se complex shapes)\n- Decision Trees / Random Forests: questions pooch ke decide (jaise 20 questions game), forests = many trees vote\n- Gradient Boosting (baad mein XGBoost/LightGBM): trees ek ke baad ek galtiyan theek\n- HMM: sequences (speech)\n- K-means: groups banana (unsupervised)\n- PCA: data simplify / dimensions kam\n\nDeep learning ne inhe useless nahi banaya. Images/text pe DL strong; tables/spreadsheet data pe classical ML aaj bhi bohot use hota hai.\n\nRevision: classical ML = practical workhorse era.\n\nAb socho: agar tum kisi dost ko batao, toh pehle story bolo, baad mein list. Interviews mein bhi yahi order strong lagta hai.\n\nMushkil words:\n- SVM: Support Vector Machine — boundary based classifier.\n- Random Forest: Bahut decision trees ka vote/average ensemble.\n- XGBoost: Strong gradient-boosted trees library.\n- HMM: Hidden Markov Model for sequences.\n- Naive Bayes: Simple probabilistic classifier (e.g., spam).',
          terms: 'SVM, Random Forest, XGBoost, HMM, Naive Bayes',
          source: '03_ML_Revolution'
        },
        {
          q: 'No Free Lunch Theorem kya hai aur practical implication?',
          a: 'Pehle poori picture paragraphs mein samjho, phir details.\n\nSimple translation: "Free mein lunch nahi" - koi ek algorithm har problem pe best nahi.\n\nMath idea (Wolpert): agar tum imaginarily har possible problem ka average lo, algorithms ki expected performance equal. Matlab universal champion nahi.\n\nPractice mein kya matlab?\n- Context dekho: images ke liye CNN, tabular ke liye XGBoost, chhote high-dim data pe SVM...\n- Domain knowledge matter karti hai\n- Multiple models try karna smart hai\n- "Yeh algorithm hamesha jeettega" wali claim pe doubt karo\n\n10-year-old analogy: cricket bat se tennis mat khelo. Tool problem ke hisaab se choose karo.\n\nAb socho: agar tum kisi dost ko batao, toh pehle story bolo, baad mein list. Interviews mein bhi yahi order strong lagta hai.\n\nMushkil words:\n- No Free Lunch Theorem: Koi algo har problem pe best nahi.\n- Model Selection: Problem ke hisaab se model choose karna.',
          terms: 'No Free Lunch Theorem, Model Selection',
          source: '03_ML_Revolution'
        },
        {
          q: 'Feature Engineering kya hai aur traditional ML mein kyun critical tha?',
          a: 'Pehle poori picture paragraphs mein samjho, phir details.\n\nFeature engineering = raw data ko aise useful signals mein badalna jo algorithm easily samajh sake.\n\nExample: customer leave karega ya nahi?\nRaw: login timestamps.\nEngineered features:\n- Last login ke kitne din hue\n- Last 30 days mein kitni baar aaya\n- Average session time\n\nTraditional ML algorithms limited complexity handle karte the, isliye manually smart features banana bohot important skill thi.\n\nDeep learning images/text mein features khud seekh leta hai (partial automation). Phir bhi real projects mein cleaning, domain features, preprocessing ab bhi matter karti hai.\n\nRevision: feature engineering = data ko "exam-ready notes" banana.\n\nAb socho: agar tum kisi dost ko batao, toh pehle story bolo, baad mein list. Interviews mein bhi yahi order strong lagta hai.\n\nMushkil words:\n- Feature Engineering: Raw data se useful signals banana.\n- Representation: Data ko kaise numbers/features mein likho.',
          terms: 'Feature Engineering, Representation',
          source: '03_ML_Revolution'
        },
        {
          q: 'Random Forests kaise kaam karte hain aur ensemble kyun powerful?',
          a: 'Ek decision tree = sawaalon ki chain ("age > 30? income high?").\nProblem: ek tree easily overfit - training yaad kar leta hai, naya data pe weak.\n\nRandom Forest = jungle of trees.\nHar tree:\n- Data ka random sample (bagging)\n- Split pe random features\nPhir sab vote (classification) ya average (regression).\n\nKyun strong?\nAlag trees alag galtiyan karte hain. Average se noise cancel - "wisdom of crowds."\n\nBonus: generally robust, feature importance bhi milti hai.\n\nRevision: forest = many weak/ok trees -> strong team.\n\nMushkil words:\n- Bagging: Data samples pe alag models train karke combine.\n- Ensemble: Kai models milake stronger prediction.\n- Overfitting: Train yaad, naya data pe weak.',
          terms: 'Bagging, Ensemble, Overfitting',
          source: '03_ML_Revolution'
        },
        {
          q: 'SVM mein kernel trick intuitively kya hai?',
          a: 'Socho do colors ke dots paper pe aise mile-jule hain ki seedhi line se alag nahi ho sakte.\n\nTrick: paper ko fold / 3D lift karo - ab alag karna easy. SVM kernel trick similar idea use karta hai: data ko higher dimension mein socho jahan linear separation possible.\n\nMagic part: woh bhari projection explicitly compute kiye bina, sirf similarity (kernel) calculate karke kaam chalata hai. Isliye practical.\n\nCommon kernels: RBF, polynomial.\n\nAnalogy: kabhi seedha nahi, soch badlo - problem easy.\n\nMushkil words:\n- Kernel Trick: Higher-dimension separation without heavy explicit map.\n- RBF: Radial Basis Function kernel — common SVM kernel.\n- SVM: Support Vector Machine — boundary based classifier.',
          terms: 'Kernel Trick, RBF, SVM',
          source: '03_ML_Revolution'
        },
        {
          q: 'HMM ne speech recognition mein kyun kaam kiya?',
          a: 'Pehle poori picture paragraphs mein samjho, phir details.\n\nSpeech ek sequence hai: sounds ek ke baad ek aate hain.\n\nHMM (Hidden Markov Model) simple story:\n- Hidden part: asal phoneme / sound unit jo tum bolna chahte ho (andar ki state)\n- Observed part: microphone ko jo signal mila (bahar ka data)\n- Transition: kis sound ke baad kaunsa sound likely\n- Emission: woh sound acoustic signal mein kaisa dikhta hai\n\nViterbi algorithm most likely sound sequence nikalta hai.\n\nYeh language "samajhne" jaisa deep nahi - statistical pattern capture hai. Phir bhi commercially speech systems chalaye.\n\nLimit: Markov assumption (mostly recent state pe depend). Deep learning baad mein richer context capture karta hai.\n\nAb socho: agar tum kisi dost ko batao, toh pehle story bolo, baad mein list. Interviews mein bhi yahi order strong lagta hai.\n\nMushkil words:\n- HMM: Hidden Markov Model for sequences.\n- Phoneme: Speech sound unit.\n- Viterbi: HMM mein best state sequence nikalne ka algo.\n- Sequence: Ordered series — speech, text, time.',
          terms: 'HMM, Phoneme, Viterbi, Sequence',
          source: '03_ML_Revolution'
        },
        {
          q: 'Kaggle ne ML industry ko kaise shape kiya?',
          a: 'Pehle poori picture paragraphs mein samjho, phir details.\n\nKaggle competitions ne ML ko "sport" jaisa bana diya: dataset do, best score jeeto.\n\nPositive:\n- Anyone compete kar sakta (democratize)\n- XGBoost/ensembles tabular pe dominate prove\n- Feature tricks share hue\n- Common benchmarks\n- Companies talent hire karti hain leaderboard se\n\nCaution (negative):\nCompetition metric jeetna != production AI.\nReal products mein latency, reliability, fairness, monitoring, maintenance bhi chahiye - Kaggle yeh fully test nahi karta.\n\nRevision: Kaggle great classroom/gym; factory floor alag hai.\n\nAb socho: agar tum kisi dost ko batao, toh pehle story bolo, baad mein list. Interviews mein bhi yahi order strong lagta hai.\n\nMushkil words:\n- Kaggle: ML competition platform.\n- Ensembling: Multiple models combine karna.\n- Production ML: Real users/systems mein chalne wala ML.',
          terms: 'Kaggle, Ensembling, Production ML',
          source: '03_ML_Revolution'
        },
        {
          q: 'Deep learning se pehle NLP kaise kaam karta tha?',
          a: 'Pehle poori picture paragraphs mein samjho, phir details.\n\nPehle language systems mostly counting + statistics pe the, deep understanding pe nahi.\n\nTools:\n- Bag of Words: document = word counts (order ignore)\n- TF-IDF: rare important words ko zyada weight\n- N-grams: previous N words dekh ke next predict\n- LSA: topics dhundhne ke liye matrix math\n- CRF: sequence labels (names, places tag karna)\n\nYeh specific tasks pe chaley (spam, simple classify). Weakness: long meaning, deep semantics, long-range relations.\n\nPhir Word2Vec (2013) aur Transformers ne game badal di.\n\nRevision: old NLP = clever counting; modern NLP = learned representations + attention.\n\nAb socho: agar tum kisi dost ko batao, toh pehle story bolo, baad mein list. Interviews mein bhi yahi order strong lagta hai.\n\nMushkil words:\n- Bag of Words: Text = word counts (order ignore).\n- TF-IDF: Rare important words ko zyada weight.\n- N-gram: Previous N tokens se next predict / features.\n- CRF: Conditional Random Field — sequence labeling model.',
          terms: 'Bag of Words, TF-IDF, N-gram, CRF',
          source: '03_ML_Revolution'
        },
        {
          mustKnow: true,
          q: 'MUST KNOW: Statistical ML ne AI ko second winter se kaise rescue kiya?',
          a: 'Pehle poori picture paragraphs mein samjho, phir details.\n\nExpert systems ke promises tootne ke baad field ko "real kaam" chahiye tha.\n\nStatistical ML ne diya:\n- Spam filters\n- Recommendations\n- Speech systems\n- Credit scoring\n- Search ranking signals\n\nYeh hype speeches se zyada, measurable utility thi. Companies ROI dekh sakti thin.\n\nIsliye statistical ML = winter ke baad practical spring.\n\nAaj bhi: classical ML + deep learning partners hain, enemies nahi.\n\nAb socho: agar tum kisi dost ko batao, toh pehle story bolo, baad mein list. Interviews mein bhi yahi order strong lagta hai.\n\nMushkil words:\n- Statistical ML: Data/statistics se pattern learning era.\n- ROI: Return on Investment — paisa/fayda vs cost.\n- Practical AI: Real measurable utility wala AI.',
          terms: 'Statistical ML, ROI, Practical AI',
          source: '03 Key Takeaways'
        },
        {
          mustKnow: true,
          q: 'MUST KNOW: 2000s data explosion ne deep learning ke liye conditions kaise banayi?',
          a: '2000s mein data suddenly bohot badha: genomes, Facebook, Netflix ratings, smartphones, ImageNet images, Twitter text.\n\nProblem: classical methods (jaise SVM) millions/billions examples pe struggle.\n\nNeural nets gradient descent se better scale feel karte the - especially jab GPUs + smart tricks aaye.\n\nMatlab 2012 miracle "akela magic" nahi tha. Pehle data ocean ready hua, phir deep learning boat tezi se chali.\n\nRevision: big data prepared the stage for deep learning.\n\nMushkil words:\n- ImageNet: Large labeled image dataset/competition.\n- Scale: Data/compute/model size badhana.\n- Data Explosion: 2000s mein digital data ka sudden flood.',
          terms: 'ImageNet, Scale, Data Explosion',
          source: '03 Numbers Game'
        }
      ]
    },

    {
      title: 'TOPIC H 4 - Deep Learning Boom (2012-2016+)',
      subtitle: 'File: 04_Deep_Learning_Boom.md  |  AlexNet, ReLU, ResNet, Word2Vec, Transfer Learning, GANs, AlphaFold | Answers rewritten style: paragraphs + Mushkil words',
      qa: [
        {
          q: '2012 ImageNet moment kya tha aur kyun significant?',
          a: 'Pehle poori picture paragraphs mein samjho, phir details.\n\nImageNet ek bada photo contest/dataset tha: machine ko objects recognize karne hain.\n\nSept 2012: AlexNet (Krizhevsky, Sutskever, Hinton) ne error rate ~15.3% kiya; second place ~26.2%. Gap huge - roughly 40% better.\n\nSecret sauce mix:\n- Deep CNN architecture\n- GPUs pe training\n- Big labeled data\n- Tricks jaise ReLU/dropout\n\nKyun history badli?\n- GPU era start (NVIDIA rise)\n- Transfer learning culture\n- VC/companies serious\n- Hiring wars\n- Almost har big tech ne DL accelerate ki\n\nRevision: 2012 = modern AI ka public "big bang" moment.\n\nAb socho: agar tum kisi dost ko batao, toh pehle story bolo, baad mein list. Interviews mein bhi yahi order strong lagta hai.\n\nMushkil words:\n- AlexNet: 2012 ImageNet jeetne wala famous deep CNN.\n- ImageNet: Large labeled image dataset/competition.\n- GPU: Graphics chip jo parallel math tez karta hai — AI training pe reuse.\n- CNN: Images ke liye convolutional neural net.',
          terms: 'AlexNet, ImageNet, GPU, CNN',
          source: '04_Deep_Learning'
        },
        {
          q: 'ReLU activation sigmoid se better kyun?',
          a: 'Activation = neuron ke andar chhota math gate jo signal ko non-linear banata hai.\n\nSigmoid: smooth S curve, output 0-1. Problem: derivative hamesha 1 se chhoti. Deep network mein gradients multiply hote hain - bohot layers baad signal almost 0 (vanishing gradient). Early layers seekh nahi paate.\n\nReLU: max(0, x). Positive pe derivative = 1. Gradient shrink nahi hota (active neurons pe). Plus compute cheap (exp nahi).\n\nIsliye deep nets practically train ho paye.\n\nNote: binary probability output pe sigmoid ab bhi use. Transformers mein GELU etc. variants.\n\nAnalogy: sigmoid = dim bulb signal door tak pahunchte-pahunchte almost dark; ReLU = brighter hallway for gradients.\n\nMushkil words:\n- ReLU: Activation max(0,x) — deep nets train karne mein helpful.\n- Sigmoid: S-curve 0-1 activation; deep nets mein vanishing risk.\n- Vanishing Gradient: Deep layers mein learning signal almost 0.',
          terms: 'ReLU, Sigmoid, Vanishing Gradient',
          source: '04_Deep_Learning'
        },
        {
          q: 'Residual connections (ResNet) ka intuition kya hai?',
          a: 'Pehle log sochte the: zyada layers = hamesha better. Reality: naive bahut deep net kabhi shallower se worse.\n\nResNet idea (2015): har block poora naya mapping na seekhe. Seekho change F(x). Output = x + F(x).\n\nAgar kuch change nahi chahiye, F~=0 rakhna easy - identity path open hai. Skip connection gradient ko seedha peeche bhejti hai.\n\nResult: 100+ layer nets train. Transformers bhi residuals pe heavily depend.\n\nAnalogy: elevator ke saath stairs bhi rakho - signal / gradient stuck nahi hota.\n\nMushkil words:\n- ResNet: Skip connections wali deep network family.\n- Skip Connection: Input ko seedha aage add karna — gradient path open.\n- Identity Mapping: Kuch change na karna — output ~= input.',
          terms: 'ResNet, Skip Connection, Identity Mapping',
          source: '04_Deep_Learning'
        },
        {
          q: 'Word2Vec ka key insight kya tha?',
          a: 'Insight: "Word ka meaning uske neighbors se pata chalta hai."\n\nBank ke paas agar money/loan/deposit words aate hain, toh bank finance sense mein.\n\nWord2Vec chhota neural net train karta hai surrounding words predict karne (skip-gram/CBOW). Hidden weights ban jaate hain word embeddings - numbers ki list jo meaning capture karti hai.\n\nFamous magic:\nking - man + woman ~= queen\nParis - France + Germany ~= Berlin\n\nMatlab relationships geometry mein store.\n\nIsne NLP ko rocket diya: translation, sentiment, NER better. Aaj ke BERT/GPT embeddings isi tradition ke advanced form hain.\n\nMushkil words:\n- Word2Vec: Word embeddings seekhne ka classic method.\n- Embedding: Meaning-preserving vector map.\n- Distributional Hypothesis: Word meaning uske neighbors se.',
          terms: 'Word2Vec, Embedding, Distributional Hypothesis',
          source: '04_Deep_Learning'
        },
        {
          q: 'Transfer Learning kya hai aur practical AI ko kyun democratize kiya?',
          a: 'Pehle har nayi problem pe zero se train - bohot data + compute chahiye.\n\nTransfer learning:\n1) Bade dataset (ImageNet) pe model general features seekhe (edges, textures...)\n2) Apne chhote task pe last layers fine-tune\n\nJaise school mein pehle general maths seekho, phir specific exam practice.\n\nImpact: startup ke paas 1000 labels hon toh bhi strong system possible. AI sirf Google giants ki nahi rahi.\n\nLLM world mein same template: internet pe pretrain -> apne task pe adapt.\n\nMushkil words:\n- Transfer Learning: Pretrain phir fine-tune.\n- Pretrain: Bade general data pe pehle seekhna.\n- Fine-tune: Specific task pe thoda aur train.',
          terms: 'Transfer Learning, Pretrain, Fine-tune',
          source: '04_Deep_Learning'
        },
        {
          q: 'GANs ka core idea aur applications?',
          a: 'GAN = do networks ka competition game.\n\n- Generator: fake sample banata (image etc.)\n- Discriminator: real vs fake detect\n\nDono improve karte hain. End goal: fakes itne real ki discriminator confuse.\n\nApplications: realistic faces (StyleGAN), horse->zebra style transfer, super-resolution, deepfakes, molecule ideas, rare data augmentation.\n\nProblems: training unstable, mode collapse (sirf thodi variety).\n\nAaj image quality mein diffusion models zyada famous, lekin GAN idea historically generative AI ka bada door kholne wala tha.\n\nMushkil words:\n- GAN: Generator vs Discriminator competition.\n- Generator: Fake samples banane wala network.\n- Discriminator: Real vs fake detect karne wala network.\n- Mode Collapse: GAN thodi variety hi generate kare.',
          terms: 'GAN, Generator, Discriminator, Mode Collapse',
          source: '04_Deep_Learning'
        },
        {
          q: '"Compute is now a competitive advantage" explain karo.',
          a: '2012 ke baad pattern clear hua: generally zyada compute + data + bada model -> better results.\n\nTraining frontier models bohot mehnga (reports mein GPT-4 class runs tens/hundreds of millions$). GPUs mehenge. Isliye sirf kuch companies afford karti hain.\n\nYeh "compute moat" banata hai - paisa/hardware wali labs aage.\n\nCounter forces bhi hain: efficient architectures, quantization, distillation, smaller specialized models - taaki chhote teams bhi compete kar saken.\n\nRevision: algorithms matter, lekin ab hardware budget bhi strategy hai.\n\nMushkil words:\n- Compute Moat: Zyada compute wale players ka advantage.\n- GPU: Graphics chip jo parallel math tez karta hai — AI training pe reuse.\n- Efficient ML: Kam compute mein acchi performance.',
          terms: 'Compute Moat, GPU, Efficient ML',
          source: '04_Deep_Learning'
        },
        {
          q: 'AlphaFold ka AI significance biology ke bahar kya hai?',
          a: 'Proteins ke amino acid sequence se 3D shape predict karna decades purani hard problem thi. AlphaFold (DeepMind) ne near-atomic accuracy hours mein di.\n\nBiology ke bahar lesson:\n1) AI sirf chat/photos nahi - science discovery tool\n2) Physical world patterns data se seekhe ja sakte hain\n3) Long-range relations matter (protein mein door amino acids interact - text long context jaisa)\n4) Massive pretrain science domains mein bhi kaam karta\n\n2024 Nobel Chemistry recognition ne iski seriousness dikhai. Drug discovery direction change.\n\nRevision: AlphaFold = "AI as scientist" ka poster example.\n\nMushkil words:\n- AlphaFold: Protein structure prediction breakthrough.\n- Scientific AI: Science discovery ke liye AI.\n- Protein Folding: Amino acids se 3D protein shape.',
          terms: 'AlphaFold, Scientific AI, Protein Folding',
          source: '04_Deep_Learning'
        },
        {
          mustKnow: true,
          q: 'MUST KNOW: Deep learning = sirf "bahut layers"? (Misconception)',
          a: 'Nahi. Sirf layers badha dena kaafi nahi.\n\nArchitecture quality matter karti hai: residual connections, normalization, attention, good activations. ResNet-50 carefully designed naive 100-layer se better ho sakti hai.\n\nCargo-cult mat karo ("sab pe CNN laga do"). Samjho kyun kaam karta hai - tabhi innovate kar paoge.\n\nRevision: depth helpful, design smarter.\n\nMushkil words:\n- Architecture > Depth: Smart design > sirf layers badhana.',
          terms: 'Architecture > Depth',
          source: '04 Misconceptions'
        },
        {
          mustKnow: true,
          q: 'MUST KNOW: Deep learning hamesha jeetta hai? GPUs AI ke liye design the?',
          a: 'Pehle poori picture paragraphs mein samjho, phir details.\n\nDo alag misconceptions:\n\n1) DL always wins? Nahi.\n- Spreadsheet/tabular: XGBoost often strong\n- Bohot chhota data: classical simpler better\n- Regulated domains: interpretable models prefer\nDL especially unstructured pe (image/audio/text) shine karta hai.\n\n2) GPUs AI ke liye bane the? Originally nahi - gaming/graphics ke liye. Researchers ne AI training ke liye reuse kiya. Baad mein NVIDIA ne AI-specific chips (A100/H100) banaye.\n\nRevision: right tool + right hardware history matter karti hai.\n\nAb socho: agar tum kisi dost ko batao, toh pehle story bolo, baad mein list. Interviews mein bhi yahi order strong lagta hai.\n\nMushkil words:\n- XGBoost vs DL: Tabular pe classical boosters often strong.\n- NVIDIA: GPU company — AI compute leader.\n- GPU History: GPUs pehle gaming, baad AI.',
          terms: 'XGBoost vs DL, NVIDIA, GPU History',
          source: '04 Misconceptions'
        },
        {
          mustKnow: true,
          q: 'MUST KNOW: Dropout kya hai aur kyun important tha?',
          a: 'Dropout training trick: randomly kuch neurons temporarily band.\n\nKyun? Taaki network ek-do neurons pe over-depend na kare (co-adaptation kam). Overfitting kam, generalization better.\n\nAlexNet era mein yeh simple idea bohot helpful rahi - deep nets ko real world pe better banaya.\n\nAnalogy: team project mein har baar alag members practice karein, taaki poori team strong ho, sirf ek star pe depend na ho.\n\nMushkil words:\n- Dropout: Randomly neurons off — overfitting kam.\n- Regularization: Overfit rokne ke techniques.\n- Overfitting: Train yaad, naya data pe weak.',
          terms: 'Dropout, Regularization, Overfitting',
          source: '04 Key Takeaways'
        }
      ]
    },

    {
      title: 'TOPIC H 5 - LLM Era (2017-Present)',
      subtitle: 'File: 05_LLM_Era.md  |  Transformer, GPT, BERT, RLHF, Scaling Laws, ChatGPT, Constitutional AI | Answers rewritten style: paragraphs + Mushkil words',
      qa: [
        {
          q: 'Transformer architecture RNNs se kyun revolutionary tha?',
          a: 'Pehle poori picture paragraphs mein samjho, phir details.\n\nPurane RNN language ko ek-ek karke left-to-right process karte the. Jaise line mein khade log - har step pehle pe depend.\n\nProblems:\n- Parallel nahi (slow training)\n- Lambi sentence mein purani info fade\n- Vanishing gradients\n\nTransformer (2017, Attention paper): self-attention.\nHar word kisi bhi doosre word ko directly dekh sakta hai - distance matter nahi. Poori sequence ek saath process - GPU khush.\n\nResult: faster scale, better long-range understanding, GPT/BERT possible.\n\nAnalogy: class mein sirf neighbor se baat nahi - kisi bhi student ko directly question pooch sakte ho.\n\nAb socho: agar tum kisi dost ko batao, toh pehle story bolo, baad mein list. Interviews mein bhi yahi order strong lagta hai.\n\nMushkil words:\n- Transformer: Attention-based architecture without recurrence need.\n- Self-Attention: Har token kisi bhi token ko directly weigh kare.\n- RNN: Recurrent net — step-by-step sequence model.\n- Parallelism: Kai calculations ek saath.',
          terms: 'Transformer, Self-Attention, RNN, Parallelism',
          source: '05_LLM_Era'
        },
        {
          q: 'RLHF kya hai aur kyun important?',
          a: 'Raw LLM internet jaisa text predict karta hai - helpful bhi, toxic/nonsense bhi.\n\nRLHF = human feedback se "achhe jawab" ki taraf push.\n\n3 steps simply:\n1) SFT: high-quality examples pe supervised fine-tune\n2) Reward model: humans do answers compare karte hain; model seekhe kaunsa preferred\n3) RL (aksar PPO): LLM ko reward maximize karne ko train\n\nKyun important?\nIsliye ChatGPT/Claude "product" ban sake, sirf autocomplete nahi. InstructGPT ne dikhaya: RLHF version log raw GPT-3 se zyada prefer karte the.\n\nRevision: RLHF = manners + helpfulness training for LLMs.\n\nMushkil words:\n- RLHF: Human feedback se LLM behavior align karna.\n- SFT: Supervised Fine-Tuning on high-quality examples.\n- Reward Model: Preferred answers score karne wala model.\n- PPO: Popular RL algorithm used in RLHF stacks.',
          terms: 'RLHF, SFT, Reward Model, PPO',
          source: '05_LLM_Era'
        },
        {
          q: 'Scaling Laws kya hain aur AI development ko kaise shape kiya?',
          a: 'Pehle poori picture paragraphs mein samjho, phir details.\n\nResearchers ne dekha: model size, data size, compute badhao toh loss predictably girta hai (power-law / almost straight on log-log).\n\nMatlab AI thoda zyada "engineering" ban gaya:\n- Estimate: itna paisa/compute -> roughly itna improve\n- Model aur data dono saath scale karo (Chinchilla lesson: sirf bada model, kam data = waste)\n- Big training runs plan with more confidence\n\nPehle vibe: try and pray. Ab: measure and scale (still surprises hote hain, lekin map better hai).\n\nAb socho: agar tum kisi dost ko batao, toh pehle story bolo, baad mein list. Interviews mein bhi yahi order strong lagta hai.\n\nMushkil words:\n- Scaling Laws: Resources vs performance ke predictable trends.\n- Compute: Training/inference ka computational work.\n- Chinchilla: Compute-optimal training allocation lesson.',
          terms: 'Scaling Laws, Compute, Chinchilla',
          source: '05_LLM_Era'
        },
        {
          q: 'Emergent capabilities kya hain? Examples do.',
          a: 'Pehle poori picture paragraphs mein samjho, phir details.\n\nKuch abilities chhote models mein almost zero, scale badhte hi suddenly dikhti hain - continuously thodi-thodi nahi.\n\nExamples:\n- Multi-digit arithmetic\n- Chain-of-thought ("step by step socho") se reasoning jump\n- Better sense of uncertainty\n- Complex analogies\n\nDebate: kya yeh genuine magic jump hai, ya measurement style (pass/fail) ki wajah se sudden dikhta hai?\n\nPractical reality: scale ke saath qualitatively naya behavior feel hota hai - isliye bade models special treat kiye jaate hain.\n\nAb socho: agar tum kisi dost ko batao, toh pehle story bolo, baad mein list. Interviews mein bhi yahi order strong lagta hai.\n\nMushkil words:\n- Emergence: Scale pe suddenly dikhne wali capabilities.\n- Chain-of-Thought: Step-by-step reasoning prompting/behavior.',
          terms: 'Emergence, Chain-of-Thought',
          source: '05_LLM_Era'
        },
        {
          q: 'Open source vs closed source LLMs ka debate kya hai?',
          a: 'Pehle poori picture paragraphs mein samjho, phir details.\n\nClosed (OpenAI/Anthropic/Google style):\n- Powerful model risks control (misuse, weapons info etc.)\n- API pe monitoring/filters\n- Safety research ke liye business support\n\nOpen (Meta LLaMA, Mistral, HF community):\n- Zyada log safety research / audit kar saken\n- Power sirf thodi companies mein concentrate na ho\n- Local/private run, customize, sasta experiment\n\nReality: open models kai tasks pe closed ke close aa chuke. Tradeoff clear: closed zyada controlled; open zyada free + user responsibility.\n\nRevision: yeh technical + society dono ka debate hai.\n\nAb socho: agar tum kisi dost ko batao, toh pehle story bolo, baad mein list. Interviews mein bhi yahi order strong lagta hai.\n\nMushkil words:\n- Open vs Closed: Weights/API openness ka debate.\n- LLaMA: Meta family open(ish) LLMs.\n- Safety: Misuse/harm reduce karne ke practices.',
          terms: 'Open vs Closed, LLaMA, Safety',
          source: '05_LLM_Era'
        },
        {
          q: 'Constitutional AI kya hai aur Anthropic ise RLHF se better kyun maanta?',
          a: 'Pehle poori picture paragraphs mein samjho, phir details.\n\nRLHF strong hai lekin humans se har baar preference collect karna mehnga, slow, kabhi inconsistent.\n\nConstitutional AI (Anthropic):\n- Pehle principles likho (constitution): helpful, honest, avoid harm...\n- Model apne answer ko in principles se check kare\n- Galat/weak answer rewrite kare\n- Us self-feedback pe improve\n\nFayde: scale easier, principles transparent, consistency better. Humans constitution banate hain, lekin har sample pe kam annotators.\n\nClaude training philosophy isi se connected: safety aur quality saath.\n\nRevision: CAI = rulebook + self-critique se alignment.\n\nAb socho: agar tum kisi dost ko batao, toh pehle story bolo, baad mein list. Interviews mein bhi yahi order strong lagta hai.\n\nMushkil words:\n- Constitutional AI: Principles se self-critique alignment.\n- Alignment: Model ko intended values/behavior ke paas lana.\n- Self-critique: Model khud answer check/rewrite kare.',
          terms: 'Constitutional AI, Alignment, Self-critique',
          source: '05_LLM_Era'
        },
        {
          q: 'GPT-3 ke few-shot learning ka significance kya tha?',
          a: 'Pehle poori picture paragraphs mein samjho, phir details.\n\nGPT-3 se pehle: naya task = labeled data collect + fine-tune. Time/paisa.\n\nFew-shot: prompt mein 3-10 examples do. Model samajh jaye task kya hai, bina weights update kiye.\n\nYeh qualitative jump tha - "task inference" ability.\n\nImpact:\n- Prototype minutes mein\n- API products boom\n- Prompt engineering skill bani\n- Har chhoti company ko apna huge train karna zaroori nahi\n\nRevision: few-shot = examples in prompt, not full retraining.\n\nAb socho: agar tum kisi dost ko batao, toh pehle story bolo, baad mein list. Interviews mein bhi yahi order strong lagta hai.\n\nMushkil words:\n- Few-shot: Prompt mein thode examples se task karna.\n- In-context Learning: Weights update ke bina prompt examples se adapt.\n- Prompt Engineering: Instructions/examples carefully design karna.',
          terms: 'Few-shot, In-context Learning, Prompt Engineering',
          source: '05_LLM_Era'
        },
        {
          mustKnow: true,
          q: 'MUST KNOW: BERT vs GPT - fundamental farak?',
          a: 'Pehle poori picture paragraphs mein samjho, phir details.\n\nDono Transformer family, alag jobs.\n\nGPT style:\n- Usually left-to-right next word predict (autoregressive)\n- Generation / chat / writing strong\n\nBERT style (Google 2018):\n- Bidirectional - left aur right dono context\n- Masked words fill - understanding / NLU tasks (classify, QA extract) mein historically bohot strong\n\nSimple: GPT = writer/speaker energy; BERT = reader/comprehension energy.\nAaj chat products mostly GPT-like generators + alignment.\n\nAb socho: agar tum kisi dost ko batao, toh pehle story bolo, baad mein list. Interviews mein bhi yahi order strong lagta hai.\n\nMushkil words:\n- BERT: Bidirectional encoder Transformer family.\n- GPT: Usually left-to-right generative Transformer family.\n- Bidirectional: Left+right context.\n- Autoregressive: Next token sequentially generate.',
          terms: 'BERT, GPT, Bidirectional, Autoregressive',
          source: '05 Core'
        },
        {
          mustKnow: true,
          q: 'MUST KNOW: Transformers OpenAI ne invent kiye? ChatGPT pehla chatbot?',
          a: 'Dono myths galat.\n\n1) Transformer invent: Google Brain paper "Attention Is All You Need" (2017). OpenAI ne GPT series scale + productize kiya; RLHF/ChatGPT unka bada contribution.\n\n2) Pehla chatbot: nahi. ELIZA (1966), Siri, Alexa pehle se. ChatGPT alag capability quality ki wajah se viral hua - 100M users type speed.\n\nRevision: credit correctly - Google architecture, OpenAI scaling/product, history older chatbots.\n\nMushkil words:\n- Attention Paper: 2017 "Attention Is All You Need".\n- ChatGPT History: Viral assistant; pehla chatbot nahi.',
          terms: 'Attention Paper, ChatGPT History',
          source: '05 Misconceptions'
        },
        {
          mustKnow: true,
          q: 'MUST KNOW: Bigger always better? (Chinchilla lesson)',
          a: 'Nahi. Chinchilla (DeepMind, 2022) ne dikhaya: given compute budget pe optimal aksar "thoda chhota model + zyada tokens/data" hota hai.\n\nGPT-3 is law ke hisaab se undertrained tha (size bada, data relative kam).\nMistral 7B jaise smaller models kabhi much larger older models ko beat karte hain.\n\nLesson: quality of data + training recipe > sirf parameter flex.\n\nRevision: smart training beats blind size worship.\n\nMushkil words:\n- Chinchilla: Compute-optimal training allocation lesson.\n- Compute-optimal: Budget ke hisaab se best size/data mix.\n- Data Quality: Clean, diverse, enough tokens matter.',
          terms: 'Chinchilla, Compute-optimal, Data Quality',
          source: '05 Misconceptions'
        },
        {
          mustKnow: true,
          q: 'MUST KNOW: LLM era timeline - yaad rakhne wali line',
          a: 'Ek line mein poori kahani:\n2017 Transformer (Google) -> GPT/BERT -> Scaling laws -> GPT-3 few-shot -> RLHF/InstructGPT -> ChatGPT public explosion -> Claude/Constitutional AI -> open LLaMA wave.\n\nHum end pe nahi, middle mein hain. Isliye fundamentals + history dono revision mein rakho - hype cycles dobara aate hain.\n\nMushkil words:\n- LLM Timeline: 2017→scaling→RLHF→ChatGPT→open wave.',
          terms: 'LLM Timeline',
          source: '05 Key Takeaways'
        }
      ]
    }
  ];
}

function getMathRevisionData_() {
  return [
    {
      title: 'TOPIC M1 - Linear Algebra (Vectors & Matrices)',
      subtitle: 'File: 01_Linear_Algebra_Theory.md | Vectors, matrices, dot product, eigenvalues — AI ki bhasha',
      qa: [
        {
          mustKnow: true,
          q: 'Vector kya hai? AI mein words/images ko vector kyun banate hain?',
          a: 'Vector ko pehle arrow samjho: uski direction hoti hai aur uski lambai (magnitude) hoti hai. Maths mein vector aksar numbers ki list hota hai, jaise [0.7, -0.3, 0.8]. AI mein ek word ya ek image patch ko bhi aisi list se represent karte hain taaki computer uspe add, subtract, aur compare kar sake.\n\nKyun zaroori? Kyunki computers ko "king" aur "queen" jaise feelings nahi aati. Unhe numbers chahiye. Agar similar meaning ke words ke vectors paas-paas hon, toh similarity measure karna easy ho jata hai. Yahi embeddings aur attention ki foundation hai.\n\n10-saal-old picture: har cheez ko ek secret code of numbers do, phir un codes ko math se compare karo.\n\nMushkil words:\n- Vector: Numbers ki ordered list, ya direction+length wala arrow-like object.\n- Magnitude: Vector ki lambai — kitna strong hai.\n- Embedding: Words/images ko meaningful number-vectors mein map karna.',
          terms: 'Vector, Embedding',
          source: '02_Linear_Algebra'
        },
        {
          mustKnow: true,
          q: 'Dot product intuitively kya hai, aur attention/similarity se kaise juda hai?',
          a: 'Do vectors ka dot product batata hai woh kitna same direction mein point kar rahe hain. Agar dono almost same taraf point karein, result bada positive. Agar bilkul perpendicular (90 degree), result zero. Agar opposite, negative.\n\nAI mein iska matlab: "king" aur "queen" ke vectors ka dot product aksar high hota hai kyunki concepts related hain. "king" aur "broccoli" ka low. Attention mechanism bhi related idea use karta hai: query aur key vectors compare karke decide hota hai kaunsa context zyada relevant hai.\n\nIsliye linear algebra "sirf school math" nahi — yeh modern AI ka comparison language hai.\n\nMushkil words:\n- Dot product: Do vectors ki similarity/alignment ka number.\n- Perpendicular: 90 degree angle — ek doosre se bilkul "sideways", dot product zero.\n- Attention: Model ka tarika jisse woh decide kare kaunsa context ab important hai.',
          terms: 'Dot product, Similarity, Attention',
          source: '02_Linear_Algebra'
        },
        {
          mustKnow: true,
          q: 'Matrix kya hai, aur neural network layer ko matrix transformation kyun kehte hain?',
          a: 'Matrix numbers ka grid hota hai — rows aur columns. Sabse powerful intuition: matrix ek machine jaisa hai jo vectors ko naye vectors mein transform karti hai. Rotation, stretching, shear — sab matrices se represent ho sakte hain.\n\nNeural network ki har linear layer basically input vector ko weight matrix se multiply karti hai (plus bias). Deep learning ko isliye "sequence of matrix transformations" bhi kaha jata hai: har layer data ko naye space mein project karti hai jahan alag classes alag regions mein aa sakein.\n\nPhoto example: image pixels bhi matrix/grid hain. Network baar-baar transform karke meaningful features nikalta hai.\n\nMushkil words:\n- Matrix: Numbers ka 2D grid (rows x columns).\n- Transformation: Input ko rules se badal kar naya output banana.\n- Weight matrix: Learned numbers ka grid jo model training ke dauran adjust hota hai.',
          terms: 'Matrix, Transformation, Neural layer',
          source: '02_Linear_Algebra'
        },
        {
          q: 'Eigenvector / eigenvalue ko 10-saal-old story mein samjhao.',
          a: 'Socho tumhari transformation machine (matrix) space ko stretch karti hai. Aksar arrows badal direction kar dete hain. Lekin kuch special arrows aise hote hain jo sirf lambe ya chhote ho jaate hain, direction nahi badalte. Un special arrows ko eigenvectors kehte hain. Kitna stretch hua, woh number eigenvalue hai.\n\nAI/data mein yeh useful hai kyunki kabhi-kabhi data ke "main directions of variation" nikalne hote hain (jaise PCA intuitions). Tum complicated grid ko uske important stretch-directions se samajhte ho.\n\nPoora eigenvalue course yahan nahi; intuition yeh hai: matrix ke andar special stable directions hote hain.\n\nMushkil words:\n- Eigenvector: Special direction jo transform ke baad bhi same line pe rehta hai.\n- Eigenvalue: Woh stretch factor jo us special direction pe lagta hai.\n- PCA: Data ke important directions nikalne ka technique (principal components).',
          terms: 'Eigenvector, Eigenvalue',
          source: '02_Linear_Algebra'
        }
      ]
    },

    {
      title: 'TOPIC M2 - Calculus and Gradients',
      subtitle: 'File: 02_Calculus_and_Gradients.md | Slope, gradient, chain rule, learning direction',
      qa: [
        {
          mustKnow: true,
          q: 'Derivative / slope kya hai, aur AI loss se kaise related hai?',
          a: 'Slope batata hai kisi hill pe khade ho toh zameen kitni tez upar/neeche ja rahi hai. Maths mein derivative wahi idea deta hai: input thoda badlo toh output kitna badalta hai.\n\nAI training mein hum ek loss number banate hain — "model kitna galat hai." Agar loss ko hillside samjho, toh humein downhill chalna hai taaki galtiyan kam hon. Derivative/gradient batata hai kaunsi direction mein loss badal raha hai.\n\nBina is compass ke model andhera mein random buttons dabata rahega.\n\nMushkil words:\n- Derivative: Change ka measure: x thoda badle toh y kitna badle.\n- Slope: Kitni steepness hai — tez uphill/downhill.\n- Loss: Mistake score — bada loss matlab model zyada galat.',
          terms: 'Derivative, Slope, Loss',
          source: '02_Calculus'
        },
        {
          mustKnow: true,
          q: 'Gradient kya hai? “Walk downhill” analogy explain karo.',
          a: 'Jab kai knobs (parameters) ek saath hon, toh sirf ek slope nahi — har knob ke liye alag slope. In slopes ko milake ek arrow banate hain jise gradient kehte hain. Gradient bataata hai loss sabse tez kis taraf badhta hai. Isliye training aksar opposite direction mein step leti hai — downhill.\n\nFoggy mountain pe khade ho: pairon se feel karo kaunsi taraf zameen gir rahi hai, chhota step us taraf lo, dobara feel karo. Yahi iterative gradient descent hai.\n\nStep size bohot bada ho toh overshoot; bohot chhota toh slow. Yeh learning rate se control hota hai.\n\nMushkil words:\n- Gradient: Multi-variable slope arrow jo batata hai function kis direction mein sabse tez badalta hai.\n- Parameter: Model ke andar woh numbers jo training adjust karti hai.\n- Learning rate: Har update pe kitna bada step lena hai.',
          terms: 'Gradient, Gradient descent, Learning rate',
          source: '02_Calculus'
        },
        {
          mustKnow: true,
          q: 'Chain rule kyun backpropagation ka engine hai?',
          a: 'Neural net layers ki chain hoti hai: pehli layer ka output doosri ka input. Final loss end pe measure hota hai. Humein pata chalna chahiye pehli layers ke weights ko kaise badlein.\n\nChain rule kehta hai: connected effects multiply hote hain. Dominoes ki tarah — last domino gira, uska effect pichli dominos tak trace karo. Backpropagation isi rule se gradients ko end se start tak bhejti hai.\n\nIsliye calculus AI ka optional poetry nahi — training ka wiring diagram hai.\n\nMushkil words:\n- Chain rule: Composite functions ka derivative rule — linked changes multiply.\n- Backpropagation: Loss se peeche jaakar har weight ka gradient nikalne ka algorithm.\n- Composite: Functions ke andar functions — f(g(x)) jaisa.',
          terms: 'Chain rule, Backpropagation',
          source: '02_Calculus'
        }
      ]
    },

    {
      title: 'TOPIC M3 - Probability and Statistics',
      subtitle: 'File: 03_Probability_and_Stats.md | Chance, Bayes, uncertainty',
      qa: [
        {
          mustKnow: true,
          q: 'Probability simple language mein kya hai, aur AI ko uncertainty kyun model karni chahiye?',
          a: 'Probability batati hai kisi event ke hone ka chance, 0 se 1 ke beech. 0 matlab almost never, 1 matlab almost sure. Duniya perfect surety se nahi chalti — medical test, weather, next word prediction, sab mein uncertainty hai.\n\nAI models aksar probabilities output karte hain (agl token ke chances). Lekin "confident sounding text" hamesha calibrated probability nahi hoti. Isliye samajhna zaroori hai ki model guess distribute kaise karta hai, aur kab uncertain hona chahiye.\n\n10-saal-old: dice roll — har face ka chance sochna probability hai.\n\nMushkil words:\n- Probability: Chance ka number 0 aur 1 ke beech.\n- Uncertainty: Poori surety na hona — kai possible outcomes.\n- Calibration: Jab model 70% bole toh roughly 70% baar sahi ho — confidence match reality.',
          terms: 'Probability, Uncertainty, Calibration',
          source: '02_Probability'
        },
        {
          mustKnow: true,
          q: 'Bayes theorem ko “nayi clue se belief update” ki story banao.',
          a: 'Bayes ka idea: tumhare paas pehle se ek belief hoti hai (prior). Phir naya evidence aata hai. Tum belief update karke posterior banate ho. Example: kisi ko bukhaar hai — flu ka chance? Phir COVID test positive aaya — belief badalni chahiye.\n\nAI/ML mein yeh thinking har jagah hai: pehle assumptions, phir data, phir updated model beliefs. Spam filters se lekar modern probabilistic reasoning tak, "update with evidence" central hai.\n\nCommon trap: sirf naya evidence dekhna aur base rate (kitna common tha) bhoolna.\n\nMushkil words:\n- Prior: Naye data se pehle wali belief.\n- Posterior: Evidence ke baad updated belief.\n- Evidence: Naya clue / data jo belief badal sakta hai.\n- Base rate: Cheez kitni common/rare hai population mein.',
          terms: 'Bayes, Prior, Posterior',
          source: '02_Probability'
        },
        {
          q: 'Overfitting ko probability/statistics intuition se kaise samjhein?',
          a: 'Overfitting jab model training examples itne zyada yaad kar le ki naye examples pe weak ho jaye. Jaise exam ke exactly same questions ratne wala student — thoda sawaal badla toh fail.\n\nStat view: model noise ko bhi "signal" maan leta hai. Isliye hum train/validation split, regularization, aur simpler models sochte hain. Goal true pattern seekhna hai, memorization nahi.\n\nYeh math topic isliye interview-critical hai kyunki practically har ML failure mode yahan se juda hai.\n\nMushkil words:\n- Overfitting: Train pe bohot accha, naye data pe kharab — yaad kar lena, generalize na karna.\n- Generalization: Naye, unseen examples pe bhi sahi kaam karna.\n- Regularization: Techniques jo model ko over-complex/memorize hone se rokte hain.',
          terms: 'Overfitting, Generalization',
          source: '02_Probability'
        }
      ]
    },

    {
      title: 'TOPIC M4 - Information Theory',
      subtitle: 'File: 04_Information_Theory.md | Entropy, cross-entropy, KL — surprise math',
      qa: [
        {
          mustKnow: true,
          q: 'Entropy ko “surprise” se samjhao.',
          a: 'Entropy batati hai kitni unpredictability / average surprise hai. Agar coin fair hai, outcome zyada uncertain — entropy high. Agar coin almost hamesha heads, surprise kam — entropy low.\n\nAI mein language models next token predict karte hain. Cross-entropy loss related idea use karti hai: model ki predicted probabilities true tokens se kitni match karti hain. Better model = less surprise on real data (generally).\n\nIsliye information theory "abstract theory" nahi; training losses ki language hai.\n\nMushkil words:\n- Entropy: Uncertainty / average surprise ka measure.\n- Cross-entropy: Common training loss jo true labels aur predicted probabilities compare karti hai.\n- Token: Text ka chhota piece (word/subword) jo model process karta hai.',
          terms: 'Entropy, Cross-entropy',
          source: '02_Information_Theory'
        },
        {
          mustKnow: true,
          q: 'KL divergence ko do guess-books ki story se explain karo.',
          a: 'Socho do alag notebooks hain jo batati hain events ke chances. KL divergence roughly measure karta hai ek notebook ko doosri notebook se replace karne pe kitna extra surprise / inefficiency aati hai. Yeh symmetric distance nahi (A vs B alag ho sakta hai B vs A se).\n\nAI alignment/training discussions mein KL aksar dikhta hai: naya policy/model purane se kitna door ghum gaya. RLHF style updates mein bhi related constraints aate hain taaki model bilkul wild na ho jaye.\n\nKid picture: agar tumhari map galat hai, reality ghoomte waqt extra confuse feel hota hai — KL us confusion ka math cousin hai.\n\nMushkil words:\n- KL divergence: Do probability distributions ke beech difference/extra surprise ka measure.\n- Distribution: Har possible outcome ke chances ka full map.\n- Symmetric: Agar A→B aur B→A same measure dein. KL generally symmetric nahi.',
          terms: 'KL divergence, Distributions',
          source: '02_Information_Theory'
        }
      ]
    },

    {
      title: 'TOPIC M5 - Optimization Theory',
      subtitle: 'File: 05_Optimization_Theory.md | Loss minimize, gradient descent, step size',
      qa: [
        {
          mustKnow: true,
          q: 'Optimization AI training mein kya problem solve karti hai?',
          a: 'Training ka goal: model ke parameters aise choose karo ki loss chhota ho. Yeh optimization problem hai — "best settings dhoondho." GPT-scale training mehnga isliye hai kyunki yeh search bohot badi space mein, bohot data pe, bohot steps tak chalti hai.\n\nConvex problems mein valley ek clear hoti hai. Neural nets usually non-convex hain — kai hills/valleys. Phir bhi practical gradient methods surprisingly well kaam karti hain.\n\nInterview tip: optimization = learning ka engine room.\n\nMushkil words:\n- Optimization: Best settings dhoondhne ka process (yahan: low loss).\n- Convex: Bowl-shaped problem jahan local best often global best.\n- Non-convex: Kai hills/valleys wali complicated landscape.',
          terms: 'Optimization, Loss landscape',
          source: '02_Optimization'
        },
        {
          mustKnow: true,
          q: 'Gradient descent + learning rate tradeoffs explain karo.',
          a: 'Gradient descent: gradient ki opposite direction mein chhote steps. Variants mini-batch SGD, momentum, Adam jaise adaptive methods practical speed/stability ke liye use hote hain.\n\nLearning rate bohot badi: steps jump karke diverge / unstable. Bohot chhoti: training snail. Isliye schedules bhi use hote hain — pehle thoda explore, baad mein fine steps.\n\nRegularization optimization ko constrain karti hai taaki sirf train loss na gire, balki generalize bhi ho. Yeh theory aur engineering ka milansa hai.\n\nMushkil words:\n- SGD: Stochastic Gradient Descent — data ke small batches se updates.\n- Momentum: Pichle steps ka force shamil karke valleys cross karne mein madad.\n- Adam: Popular adaptive optimizer jo per-parameter learning rates adjust karta hai.\n- Diverge: Training tootna — loss explode / NaNs, seekhna band.',
          terms: 'Gradient descent, Learning rate, Adam',
          source: '02_Optimization'
        }
      ]
    }
  ];
}

function getInterviewRevisionData_() {
  return [
    {
      title: 'TOPIC I1 - Mindset & Learning Interviews (Start Here)',
      subtitle: 'Hiring conversations: fundamentals, study habits, depth over buzzwords',
      qa: [
        {
          mustKnow: true,
          q: 'Interview: “Aap AI kaise seekh rahe ho?” — strong answer kya dikhe?',
          a: 'Strong answer tools ki shopping list nahi hoti. Strong answer batati hai sequence: foundations (history/math/ML/DL), phir transformers/RAG/agents, phir production/safety. Tum Feynman-style self-check, spaced revision, aur interview questions se apni gaps measure karte ho.\n\nTum honestly kehte ho ki libraries change hoti hain, isliye pehle mechanisms sikh rahe ho. Ek short example do: attention ko pehle analogy se samjha, phir query-key-value math tak gaye.\n\nWeak answer: "LangChain tutorials kar raha hoon" bina kyun ke.\n\nCommon trap: buzzword flooding without personal understanding proof.\n\nMushkil words:\n- Mechanism: Andar ka working — kaise steps se result banta hai.\n- Buzzword: Fashionable technical word bina depth ke.\n- Self-check: Khud test karna ki concept explain ho raha hai ya nahi.',
          terms: 'Interview mindset, Fundamentals first',
          source: '13_Interview_Style + 00_START_HERE'
        },
        {
          mustKnow: true,
          q: 'Interview: “Tools vs fundamentals — aap kya prefer karte ho?”',
          a: 'Prefer fundamentals-first, tools-second. Explain: tools velocity dete hain, fundamentals transferability. Example: agar retrieval quality kharab hai toh naya agent framework bhi hallucinate karega. Isliye tum context/RAG evals aur math intuitions pe invest karte ho.\n\nPhir balance dikhao: production mein tools use karoge hi, lekin unke peeche assumptions challenge kar sakte ho. Interviewer ko engineer chahiye, button-clicker nahi.\n\nTrap: fundamentals bolke practical shipping insult karna — mature answer dono respect karta hai.\n\nMushkil words:\n- Transferability: Ek jagah seekhi skill doosri jagah kaam aaye.\n- Hallucinate: Model confident galat baat generate kare.\n- Retrieval: Sawal ke liye relevant documents dhoondhna.',
          terms: 'Tools vs fundamentals',
          source: '00_README'
        },
        {
          q: 'Interview: “Jab concept samajh nahi aata toh kya karte ho?”',
          a: 'Process batao: pehle simpler analogy, phir formal definition, phir tiny example, phir blank-page Feynman explain, phir related lesson se connection. Math pe visual resources (jaise 3Blue1Brown style) use. Agar overlap confusion ho toh mind map.\n\nYeh answer discipline dikhata hai. "YouTube pe random video" se better structured debugging of your own understanding.\n\nTrap: sirf "main hard work karta hoon" — method chahiye.\n\nMushkil words:\n- Feynman explain: Simple words mein hard idea likh/bol kar gap dhundhna.\n- Mind map: Ideas ko visually link karna.\n- Discipline: Consistent method follow karna, mood pe depend na hona.',
          terms: 'Learning process',
          source: '00_Learning_Path'
        }
      ]
    },

    {
      title: 'TOPIC I2 - History Interviews (Module 01)',
      subtitle: 'Turing limits, winters, DL boom, LLM era — depth answers',
      qa: [
        {
          mustKnow: true,
          q: 'Interview: Turing Test ki limits kya hain? Kya ChatGPT pass karna = true understanding?',
          a: 'Turing Test behavior check karta hai: human-like chat. Yeh useful hai lekin true understanding ya consciousness prove nahi karta. Chinese Room style critique: rules/patterns se right symbols produce karna possible hai bina meaning “feel” kiye.\n\nChatGPT impressive behavior dikhata hai, lekin alag scientific sawaal hai ki andar grounded understanding hai ya statistical pattern completion. Mature answer dono respect karta hai: capability real hai, philosophical claim alag hai.\n\nTrap: "Turing Test outdated hai isliye useless" — nahi, limited hai.\n\nMushkil words:\n- Consciousness: Self-aware feeling/experience — machines mein controversial topic.\n- Chinese Room: Thought experiment: symbol shuffling != language understanding.\n- Grounded understanding: World/meaning se genuinely connected knowledge, sirf text patterns nahi.',
          terms: 'Turing Test, Understanding',
          source: '01_AI_Ka_Janam'
        },
        {
          mustKnow: true,
          q: 'Interview: AI Winters se aaj ke engineer ko kya practical lesson milta hai?',
          a: 'Winters hype → disappointment → funding freeze cycles the. Expert systems brittle rules pe tootey. Lesson: demos se production mat confuse karo; maintenance, integration, liability, evaluation matter karte hain. Aaj LLM products mein bhi same — latency, cost, safety, evals ke bina winter-like backlash local domains mein aa sakta hai.\n\nPositive lesson: winters ne fundamentals pe kaam karne wale survivors (jaise deep learning trinity) ko reward kiya. Hype career fragile hota hai.\n\nTrap: "ab kabhi winter nahi hoga" absolute claim.\n\nMushkil words:\n- Brittle: Thoda unexpected input pe toot jaana.\n- Liability: Galati ki zimmedari legally/professionally kiski.\n- Backlash: Public/investor negative reaction after overhype.',
          terms: 'AI Winter, Production lessons',
          source: '02_AI_Winter'
        },
        {
          mustKnow: true,
          q: 'Interview: 2012 ImageNet/AlexNet moment kyun historically inflection point tha?',
          a: 'AlexNet ne ImageNet pe dramatic accuracy jump diya deep CNN + GPUs + large data + training tricks (ReLU/dropout) se. Yeh sirf ek contest win nahi tha — isne industry ko convince kiya ki deep features scale pe kaam karte hain. GPU compute race, transfer learning culture, aur hiring boom follow hue.\n\nConnect karo: yeh "overnight magic" nahi, winters ke survivors ke patient work + data/compute conditions ka milansa tha.\n\nTrap: sirf "deep learning invent hua 2012 mein" — ideas purani thin, inflection 2012 pe aayi.\n\nMushkil words:\n- Inflection point: Moment jahan trend suddenly tez badal jaye.\n- CNN: Convolutional Neural Network — images ke liye specially effective architecture.\n- Transfer learning: Bade task pe seekhke chhote task pe adapt karna.',
          terms: 'AlexNet, ImageNet 2012',
          source: '04_Deep_Learning'
        },
        {
          mustKnow: true,
          q: 'Interview: Transformers RNNs se kyun better scale karte hain? BERT vs GPT one-liner farq?',
          a: 'RNNs sequence ko step-by-step process karte the — parallelization soft, long-range signal weak. Transformers self-attention se kisi bhi position ko directly dekh sakte hain aur training parallelize hoti hai. Isliye large-scale LLMs practical bane.\n\nBERT-style: bidirectional encoder focus, historically strong understanding/NLU tasks. GPT-style: autoregressive next-token generation, strong writing/chat. Aaj assistants mostly GPT-like generators + alignment (RLHF/CAI).\n\nTrap: "Transformers OpenAI ne invent kiye" — paper Google Brain 2017.\n\nMushkil words:\n- Self-attention: Sequence ke elements ek doosre ko relevance scores se directly refer karein.\n- Autoregressive: Pehle generate kiye tokens pe depend karke next token banana.\n- Bidirectional: Left aur right dono context ek saath use karna.',
          terms: 'Transformer, BERT, GPT',
          source: '05_LLM_Era'
        },
        {
          mustKnow: true,
          q: 'Interview: RLHF aur Constitutional AI high level pe kya solve karte hain?',
          a: 'Raw LM internet-like text predict karta hai — capable but not reliably helpful/harmless. RLHF human preference data se reward model + policy optimization karke behavior product-like banata hai. Constitutional AI principles/constitution se model self-critique/rewrite encourage karta hai taaki human labeling bottlenecks kam hon aur principles transparent rahein.\n\nDono alignment family ke tools hain. Interview mein clear bolo: yeh perfect safety nahi, better steering hai.\n\nTrap: "RLHF = model facts yaad karata hai" — nahi, mostly preference/behavior shaping.\n\nMushkil words:\n- Alignment: Model ko human intentions/values ke closer behave karwana.\n- Reward model: Model jo bataye kaunsa answer humans ko better lagega.\n- Constitution: Likhi hui principles ki rulebook for desired behavior.',
          terms: 'RLHF, Constitutional AI, Alignment',
          source: '05_LLM_Era'
        }
      ]
    },

    {
      title: 'TOPIC I3 - Math for AI Interviews (Module 02)',
      subtitle: 'Explain like engineer: vectors, gradients, entropy, optimization tradeoffs',
      qa: [
        {
          mustKnow: true,
          q: 'Interview: Embeddings explain karo using vectors + dot product.',
          a: 'Embedding text/image ko vector space mein map karta hai. Similar meaning items geometrically closer. Dot product/cosine se similarity measure. Isliye semantic search: query embed karo, documents embed karo, nearest neighbors nikalo.\n\nAttention bhi related geometry use karti hai (query-key similarity). Isliye linear algebra LLM engineering ki daily language hai.\n\nTrap: "embedding = encryption" — nahi, meaningful geometry hai, secret code nahi.\n\nMushkil words:\n- Cosine similarity: Angle-based similarity; length effects kam, direction pe focus.\n- Semantic search: Keyword match nahi — meaning similarity se search.\n- Nearest neighbors: Sabse paas wale vectors/items.',
          terms: 'Embeddings, Dot product',
          source: '02_Linear_Algebra'
        },
        {
          mustKnow: true,
          q: 'Interview: Gradient aur learning rate ko whiteboard pe kaise explain karoge?',
          a: 'Loss hillside hai. Gradient uphill direction. Update opposite direction mein. Learning rate step size. Bada step: overshoot/diverge. Chhota: slow converge. Practical mein batch gradients, momentum/Adam, schedules.\n\nChain rule isliye critical kyunki deep nets composite functions hain — backprop end loss se early layers tak credit assign karti hai.\n\nTrap: "gradient descent always finds global minimum" — non-convex nets mein guarantee nahi, phir bhi empirically useful.\n\nMushkil words:\n- Converge: Training settle hona — loss stabilize / solution paas.\n- Batch: Ek update ke liye data ka chhota group.\n- Global minimum: Poori landscape ka sabse deep best point.',
          terms: 'Gradient, Learning rate, Backprop',
          source: '02_Calculus + 02_Optimization'
        },
        {
          mustKnow: true,
          q: 'Interview: Cross-entropy loss / entropy intuition ek minute mein?',
          a: 'Entropy = average surprise/uncertainty. Model probabilities assign karta hai. Cross-entropy loss punish karti hai jab true token pe model ne low probability di. Better predictions generally lower cross-entropy on real data.\n\nKL related idea: do distributions kitni different. Alignment/optimization discussions mein KL constraints kabhi-kabhi policy ko reference model ke paas rakhte hain.\n\nTrap: entropy ko "randomness always bad" samajhna — uncertainty natural hai; miscalibrated confidence bad hai.\n\nMushkil words:\n- Punish: Loss zyada hona — training signal ki model ko galat prediction mehngi pade.\n- Miscalibrated: Confidence aur reality match na kare.\n- Policy: Agent/model ka behavior rule — given state pe kya action/token.',
          terms: 'Cross-entropy, Entropy, KL',
          source: '02_Information_Theory'
        },
        {
          mustKnow: true,
          q: 'Interview: Overfitting vs underfitting — math intuition + practical signal?',
          a: 'Overfit: train excellent, val/test weak — memorized noise. Underfit: train bhi weak — model/capacity/features insufficient. Probability view: model true pattern ki jagah sample quirks catch kar raha (overfit).\n\nFixes directionally: more data, regularization, simpler model, early stopping, better features; underfit pe opposite — bigger model/capacity, longer train, richer features.\n\nTrap: test set pe baar-baar tune karke hidden overfit to test.\n\nMushkil words:\n- Underfitting: Model itna simple/weak ki training patterns bhi na seekhe.\n- Validation set: Tuning/selection ke liye held-out data.\n- Early stopping: Val loss bigadne se pehle training rokna.',
          terms: 'Overfitting, Underfitting',
          source: '02_Probability + ML foundations'
        },
        {
          q: 'Interview: “Chinchilla / bigger always better?” history+math crossover answer.',
          a: 'History side: LLM era ne scaling laws popular kiye — compute/data/model size ke saath predictable gains. Math/optimization side: resources finite hain, isliye compute-optimal allocation matter karti hai. Chinchilla lesson: given budget, aksar zyada tokens/data with appropriately sized model better than oversized undertrained model.\n\nCombined answer interviewer ko pasand aata hai kyunki hype ("sirf parameters badhao") ko engineering tradeoff se replace karta hai.\n\nTrap: ek paper ko eternal law maan lena — research evolves, lekin allocation thinking rehti hai.\n\nMushkil words:\n- Scaling laws: Resources badhne pe performance ke predictable trends.\n- Compute budget: Kitna training compute/money available hai.\n- Undertrained: Model size ke hisaab se data/steps kam padna.',
          terms: 'Chinchilla, Scaling',
          source: '05_LLM_Era + 02_Optimization'
        }
      ]
    }
  ];
}

function getGlossaryData_() {
  return [
    { term: 'Fundamentals first', meaning: 'Pehle base ideas (math, architecture, principles), baad mein tools/libraries.', topic: 'Start Here' },
    { term: 'Feynman Technique', meaning: 'Simple words mein explain karke check karna ki tum aslich samajhte ho ya nahi.', topic: 'Start Here' },
    { term: 'Spaced repetition', meaning: 'Gaps chhod kar revise karna taaki yaad long-term tikey.', topic: 'Start Here' },
    { term: 'Active reading', meaning: 'Padhte waqt why/how/connections poochna — sirf highlight nahi.', topic: 'Start Here' },
    { term: 'Learning path phases', meaning: 'Foundations → Modern AI → Mastery → Job ready.', topic: 'Start Here' },
    { term: 'Parrot vs understand', meaning: 'Words dohrana vs mechanism samajhna — interviews mein farq clear hota hai.', topic: 'Start Here' },
    { term: 'Vector', meaning: 'Numbers ki list / arrow with direction+length. AI mein meaning ka code.', topic: 'Mathematics' },
    { term: 'Matrix', meaning: 'Numbers ka grid jo vectors ko transform karta hai.', topic: 'Mathematics' },
    { term: 'Dot product', meaning: 'Do vectors kitna same direction mein hain — similarity signal.', topic: 'Mathematics' },
    { term: 'Gradient', meaning: 'Loss hillside pe uphill arrow; training aksar opposite (downhill) chalti hai.', topic: 'Mathematics' },
    { term: 'Learning rate', meaning: 'Har update pe step kitna bada.', topic: 'Mathematics' },
    { term: 'Chain rule', meaning: 'Linked functions ke change multiply — backprop ka engine.', topic: 'Mathematics' },
    { term: 'Entropy', meaning: 'Average surprise / uncertainty ka measure.', topic: 'Mathematics' },
    { term: 'Cross-entropy', meaning: 'Common ML loss: predictions vs true labels.', topic: 'Mathematics' },
    { term: 'KL divergence', meaning: 'Do probability maps kitni different — extra surprise measure.', topic: 'Mathematics' },
    { term: 'Bayes prior/posterior', meaning: 'Pehle belief, evidence ke baad updated belief.', topic: 'Mathematics' },
    { term: 'Overfitting', meaning: 'Train yaad; naye data pe weak.', topic: 'Mathematics' },
    { term: 'Optimization', meaning: 'Parameters dhoondhna jo loss kam karein.', topic: 'Mathematics' },
    { term: 'Tradeoff', meaning: 'Har design choice ka fayda + nuksaan clearly bolna.', topic: 'Interview' },
    { term: 'Calibration', meaning: 'Confidence aur reality ka match.', topic: 'Interview' },
    { term: 'Alignment', meaning: 'Model behavior ko human intent/values ke closer lana.', topic: 'Interview' },
    { term: 'Turing Test', meaning: 'Chat dekh ke decide karna ki opposite side insan hai ya machine — behavior test.', topic: 'History / Shared' },
    { term: 'Turing Machine', meaning: 'Calculation ka theoretical model: clear rules + steps.', topic: 'History / Shared' },
    { term: 'Dartmouth', meaning: '1956 meeting jahan AI field official naam/community mili.', topic: 'History / Shared' },
    { term: 'Artificial Neuron', meaning: 'Brain cell ka simple math switch: weighted sum + threshold.', topic: 'History / Shared' },
    { term: 'Threshold', meaning: 'Limit — isse upar signal ON, warna OFF.', topic: 'History / Shared' },
    { term: 'ELIZA', meaning: '1966 chatbot jo patterns se therapist-like replies deta tha.', topic: 'History / Shared' },
    { term: 'ELIZA Effect', meaning: 'AI ko insan/dost maan lene ki human tendency.', topic: 'History / Shared' },
    { term: 'Pattern Matching', meaning: 'Fixed templates se reply banana, deep understanding nahi.', topic: 'History / Shared' },
    { term: 'Symbolic AI', meaning: 'Rules/logic wali AI.', topic: 'History / Shared' },
    { term: 'Connectionist AI', meaning: 'Neural nets / learned connections wali AI.', topic: 'History / Shared' },
    { term: 'Neuro-symbolic', meaning: 'Rules + neural learning milane ki research direction.', topic: 'History / Shared' },
    { term: 'Machine Learning', meaning: 'Data/experience se improve hone wale algorithms.', topic: 'History / Shared' },
    { term: 'Reinforcement Learning', meaning: 'Try-feedback-improve style learning (rewards).', topic: 'History / Shared' },
    { term: 'Hype Cycle', meaning: 'Excitement uthna phir disappointment aana.', topic: 'History / Shared' },
    { term: 'AGI', meaning: 'Har domain mein human-level general intelligence ka goal.', topic: 'History / Shared' },
    { term: 'Over-optimism', meaning: 'Chhoti jeet ko poori problem solved maan lena.', topic: 'History / Shared' },
    { term: 'Expert System', meaning: 'Rules mein expert knowledge encode karne wala program.', topic: 'History / Shared' },
    { term: 'Liability', meaning: 'Nuksaan ki legal/professional zimmedari.', topic: 'History / Shared' },
    { term: 'Maintenance', meaning: 'System ko time ke saath update/repair karte rehna.', topic: 'History / Shared' },
    { term: 'Chinese Room', meaning: 'Symbols rules se chalana != truly language samajhna.', topic: 'History / Shared' },
    { term: 'Consciousness', meaning: 'Self-aware experience — machines pe open debate.', topic: 'History / Shared' },
    { term: 'Perceptron', meaning: 'Early single-layer learning network.', topic: 'History / Shared' },
    { term: 'XOR', meaning: 'Logic jahan output 1 tab jab exactly ek input 1.', topic: 'History / Shared' },
    { term: 'Linearly Separable', meaning: 'Seedhi line/plane se classes alag kar sakna.', topic: 'History / Shared' },
    { term: 'Deep Learning', meaning: 'Multi-layer neural nets se representation learning.', topic: 'History / Shared' },
    { term: 'AI Winter', meaning: 'Hype girne ke baad funding/interest freeze period.', topic: 'History / Shared' },
    { term: 'DARPA', meaning: 'US defense research funding agency.', topic: 'History / Shared' },
    { term: 'Lighthill Report', meaning: '1973 UK report: AI promises vs weak results.', topic: 'History / Shared' },
    { term: 'Knowledge Bottleneck', meaning: 'Experts se rules nikalna slow/mehnga/incomplete.', topic: 'History / Shared' },
    { term: 'Brittleness', meaning: 'Unexpected case pe toot jaana.', topic: 'History / Shared' },
    { term: 'Combinatorial Explosion', meaning: 'Options itne badh jaayein ki check impossible.', topic: 'History / Shared' },
    { term: 'Heuristics', meaning: 'Smart shortcuts jo search kam karte hain.', topic: 'History / Shared' },
    { term: 'Domain-specific Winter', meaning: 'Poori field nahi, ek area mein hype crash.', topic: 'History / Shared' },
    { term: 'Utility', meaning: 'Asli useful kaam / value.', topic: 'History / Shared' },
    { term: 'Bubble', meaning: 'Prices/expectations reality se bohot aage.', topic: 'History / Shared' },
    { term: 'Fundamentals', meaning: 'Base principles jo long-term matter karte hain.', topic: 'History / Shared' },
    { term: 'ROI', meaning: 'Return on Investment — paisa/fayda vs cost.', topic: 'History / Shared' },
    { term: 'Fifth Generation Project', meaning: '1980s Japan ka bada logic-computer dream project.', topic: 'History / Shared' },
    { term: 'Prolog', meaning: 'Logic programming language.', topic: 'History / Shared' },
    { term: 'Logic Programming', meaning: 'Rules/logic se compute karne ka paradigm.', topic: 'History / Shared' },
    { term: 'CNN', meaning: 'Images ke liye convolutional neural net.', topic: 'History / Shared' },
    { term: 'Backpropagation', meaning: 'Loss se peeche gradients bhejne ka algo.', topic: 'History / Shared' },
    { term: 'AlexNet', meaning: '2012 ImageNet jeetne wala famous deep CNN.', topic: 'History / Shared' },
    { term: 'XCON', meaning: 'DEC ka successful computer-config expert system.', topic: 'History / Shared' },
    { term: 'Lisp Machines', meaning: 'AI ke liye specialized expensive computers.', topic: 'History / Shared' },
    { term: 'Boom-Bust', meaning: 'Tez uthan phir crash.', topic: 'History / Shared' },
    { term: 'Misconception', meaning: 'Galat common belief.', topic: 'History / Shared' },
    { term: 'Continuity', meaning: 'Winter mein bhi research bilkul delete nahi hoti.', topic: 'History / Shared' },
    { term: 'SVM', meaning: 'Support Vector Machine — boundary based classifier.', topic: 'History / Shared' },
    { term: 'Random Forest', meaning: 'Bahut decision trees ka vote/average ensemble.', topic: 'History / Shared' },
    { term: 'XGBoost', meaning: 'Strong gradient-boosted trees library.', topic: 'History / Shared' },
    { term: 'HMM', meaning: 'Hidden Markov Model for sequences.', topic: 'History / Shared' },
    { term: 'Naive Bayes', meaning: 'Simple probabilistic classifier (e.g., spam).', topic: 'History / Shared' },
    { term: 'No Free Lunch Theorem', meaning: 'Koi algo har problem pe best nahi.', topic: 'History / Shared' },
    { term: 'Model Selection', meaning: 'Problem ke hisaab se model choose karna.', topic: 'History / Shared' },
    { term: 'Feature Engineering', meaning: 'Raw data se useful signals banana.', topic: 'History / Shared' },
    { term: 'Representation', meaning: 'Data ko kaise numbers/features mein likho.', topic: 'History / Shared' },
    { term: 'Bagging', meaning: 'Data samples pe alag models train karke combine.', topic: 'History / Shared' },
    { term: 'Ensemble', meaning: 'Kai models milake stronger prediction.', topic: 'History / Shared' },
    { term: 'Overfitting', meaning: 'Train yaad, naya data pe weak.', topic: 'History / Shared' },
    { term: 'Kernel Trick', meaning: 'Higher-dimension separation without heavy explicit map.', topic: 'History / Shared' },
    { term: 'RBF', meaning: 'Radial Basis Function kernel — common SVM kernel.', topic: 'History / Shared' },
    { term: 'Phoneme', meaning: 'Speech sound unit.', topic: 'History / Shared' },
    { term: 'Viterbi', meaning: 'HMM mein best state sequence nikalne ka algo.', topic: 'History / Shared' },
    { term: 'Sequence', meaning: 'Ordered series — speech, text, time.', topic: 'History / Shared' },
    { term: 'Kaggle', meaning: 'ML competition platform.', topic: 'History / Shared' },
    { term: 'Ensembling', meaning: 'Multiple models combine karna.', topic: 'History / Shared' },
    { term: 'Production ML', meaning: 'Real users/systems mein chalne wala ML.', topic: 'History / Shared' },
    { term: 'Bag of Words', meaning: 'Text = word counts (order ignore).', topic: 'History / Shared' },
    { term: 'TF-IDF', meaning: 'Rare important words ko zyada weight.', topic: 'History / Shared' },
    { term: 'N-gram', meaning: 'Previous N tokens se next predict / features.', topic: 'History / Shared' },
    { term: 'CRF', meaning: 'Conditional Random Field — sequence labeling model.', topic: 'History / Shared' },
    { term: 'Statistical ML', meaning: 'Data/statistics se pattern learning era.', topic: 'History / Shared' },
    { term: 'Practical AI', meaning: 'Real measurable utility wala AI.', topic: 'History / Shared' },
    { term: 'ImageNet', meaning: 'Large labeled image dataset/competition.', topic: 'History / Shared' },
    { term: 'Scale', meaning: 'Data/compute/model size badhana.', topic: 'History / Shared' },
    { term: 'Data Explosion', meaning: '2000s mein digital data ka sudden flood.', topic: 'History / Shared' },
    { term: 'GPU', meaning: 'Graphics chip jo parallel math tez karta hai — AI training pe reuse.', topic: 'History / Shared' },
    { term: 'ReLU', meaning: 'Activation max(0,x) — deep nets train karne mein helpful.', topic: 'History / Shared' },
    { term: 'Sigmoid', meaning: 'S-curve 0-1 activation; deep nets mein vanishing risk.', topic: 'History / Shared' },
    { term: 'Vanishing Gradient', meaning: 'Deep layers mein learning signal almost 0.', topic: 'History / Shared' },
    { term: 'ResNet', meaning: 'Skip connections wali deep network family.', topic: 'History / Shared' },
    { term: 'Skip Connection', meaning: 'Input ko seedha aage add karna — gradient path open.', topic: 'History / Shared' },
    { term: 'Identity Mapping', meaning: 'Kuch change na karna — output ~= input.', topic: 'History / Shared' },
    { term: 'Word2Vec', meaning: 'Word embeddings seekhne ka classic method.', topic: 'History / Shared' },
    { term: 'Embedding', meaning: 'Meaning-preserving vector map.', topic: 'History / Shared' },
    { term: 'Distributional Hypothesis', meaning: 'Word meaning uske neighbors se.', topic: 'History / Shared' },
    { term: 'Transfer Learning', meaning: 'Pretrain phir fine-tune.', topic: 'History / Shared' },
    { term: 'Pretrain', meaning: 'Bade general data pe pehle seekhna.', topic: 'History / Shared' },
    { term: 'Fine-tune', meaning: 'Specific task pe thoda aur train.', topic: 'History / Shared' },
    { term: 'GAN', meaning: 'Generator vs Discriminator competition.', topic: 'History / Shared' },
    { term: 'Generator', meaning: 'Fake samples banane wala network.', topic: 'History / Shared' },
    { term: 'Discriminator', meaning: 'Real vs fake detect karne wala network.', topic: 'History / Shared' },
    { term: 'Mode Collapse', meaning: 'GAN thodi variety hi generate kare.', topic: 'History / Shared' },
    { term: 'Compute Moat', meaning: 'Zyada compute wale players ka advantage.', topic: 'History / Shared' },
    { term: 'Efficient ML', meaning: 'Kam compute mein acchi performance.', topic: 'History / Shared' },
    { term: 'AlphaFold', meaning: 'Protein structure prediction breakthrough.', topic: 'History / Shared' },
    { term: 'Scientific AI', meaning: 'Science discovery ke liye AI.', topic: 'History / Shared' },
    { term: 'Protein Folding', meaning: 'Amino acids se 3D protein shape.', topic: 'History / Shared' },
    { term: 'Architecture > Depth', meaning: 'Smart design > sirf layers badhana.', topic: 'History / Shared' },
    { term: 'XGBoost vs DL', meaning: 'Tabular pe classical boosters often strong.', topic: 'History / Shared' },
    { term: 'NVIDIA', meaning: 'GPU company — AI compute leader.', topic: 'History / Shared' },
    { term: 'GPU History', meaning: 'GPUs pehle gaming, baad AI.', topic: 'History / Shared' },
    { term: 'Dropout', meaning: 'Randomly neurons off — overfitting kam.', topic: 'History / Shared' },
    { term: 'Regularization', meaning: 'Overfit rokne ke techniques.', topic: 'History / Shared' },
    { term: 'Transformer', meaning: 'Attention-based architecture without recurrence need.', topic: 'History / Shared' },
    { term: 'Self-Attention', meaning: 'Har token kisi bhi token ko directly weigh kare.', topic: 'History / Shared' },
    { term: 'RNN', meaning: 'Recurrent net — step-by-step sequence model.', topic: 'History / Shared' },
    { term: 'Parallelism', meaning: 'Kai calculations ek saath.', topic: 'History / Shared' },
    { term: 'RLHF', meaning: 'Human feedback se LLM behavior align karna.', topic: 'History / Shared' },
    { term: 'SFT', meaning: 'Supervised Fine-Tuning on high-quality examples.', topic: 'History / Shared' },
    { term: 'Reward Model', meaning: 'Preferred answers score karne wala model.', topic: 'History / Shared' },
    { term: 'PPO', meaning: 'Popular RL algorithm used in RLHF stacks.', topic: 'History / Shared' },
    { term: 'Scaling Laws', meaning: 'Resources vs performance ke predictable trends.', topic: 'History / Shared' },
    { term: 'Compute', meaning: 'Training/inference ka computational work.', topic: 'History / Shared' },
    { term: 'Chinchilla', meaning: 'Compute-optimal training allocation lesson.', topic: 'History / Shared' },
    { term: 'Emergence', meaning: 'Scale pe suddenly dikhne wali capabilities.', topic: 'History / Shared' },
    { term: 'Chain-of-Thought', meaning: 'Step-by-step reasoning prompting/behavior.', topic: 'History / Shared' },
    { term: 'Open vs Closed', meaning: 'Weights/API openness ka debate.', topic: 'History / Shared' },
    { term: 'LLaMA', meaning: 'Meta family open(ish) LLMs.', topic: 'History / Shared' },
    { term: 'Safety', meaning: 'Misuse/harm reduce karne ke practices.', topic: 'History / Shared' },
    { term: 'Constitutional AI', meaning: 'Principles se self-critique alignment.', topic: 'History / Shared' },
    { term: 'Alignment', meaning: 'Model ko intended values/behavior ke paas lana.', topic: 'History / Shared' },
    { term: 'Self-critique', meaning: 'Model khud answer check/rewrite kare.', topic: 'History / Shared' },
    { term: 'Few-shot', meaning: 'Prompt mein thode examples se task karna.', topic: 'History / Shared' },
    { term: 'In-context Learning', meaning: 'Weights update ke bina prompt examples se adapt.', topic: 'History / Shared' },
    { term: 'Prompt Engineering', meaning: 'Instructions/examples carefully design karna.', topic: 'History / Shared' },
    { term: 'BERT', meaning: 'Bidirectional encoder Transformer family.', topic: 'History / Shared' },
    { term: 'GPT', meaning: 'Usually left-to-right generative Transformer family.', topic: 'History / Shared' },
    { term: 'Bidirectional', meaning: 'Left+right context.', topic: 'History / Shared' },
    { term: 'Autoregressive', meaning: 'Next token sequentially generate.', topic: 'History / Shared' },
    { term: 'Attention Paper', meaning: '2017 "Attention Is All You Need".', topic: 'History / Shared' },
    { term: 'ChatGPT History', meaning: 'Viral assistant; pehla chatbot nahi.', topic: 'History / Shared' },
    { term: 'Compute-optimal', meaning: 'Budget ke hisaab se best size/data mix.', topic: 'History / Shared' },
    { term: 'Data Quality', meaning: 'Clean, diverse, enough tokens matter.', topic: 'History / Shared' },
    { term: 'LLM Timeline', meaning: '2017→scaling→RLHF→ChatGPT→open wave.', topic: 'History / Shared' },
    { term: 'Winter Survivors', meaning: 'Hinton/LeCun/Bengio etc. jo unfashionable nets pe lage rahe.', topic: 'History / Shared' },
    { term: 'Deep Learning Trinity', meaning: 'Hinton, LeCun, Bengio.', topic: 'History / Shared' },
    { term: 'Logic Theorist', meaning: 'Early theorem-proving program.', topic: 'History / Shared' },
    { term: 'GPS', meaning: 'General Problem Solver — search/goals idea.', topic: 'History / Shared' },
    { term: 'LISP', meaning: 'Classic AI programming language.', topic: 'History / Shared' },
    { term: 'DENDRAL', meaning: 'Early chemistry expert system.', topic: 'History / Shared' },
    { term: 'Timeline', meaning: 'Events ka time order.', topic: 'History / Shared' }
  ];
}
