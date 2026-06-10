-- 011_even_more_lessons.sql
-- Adds 20 more lessons (order_num 46 to 65) with 5 phrases each.
-- Safe to re-run: fixed UUIDs + ON CONFLICT, and clears these lessons' phrases first.

-- ------------------------------------------------------------------
-- 1. LESSONS (orders 46-65)
-- ------------------------------------------------------------------
INSERT INTO lessons (id, title, situation, hindi_description, difficulty, category, order_num, duration_mins, xp_reward, word_count, quiz_count) VALUES
  ('dddddddd-cccc-cccc-cccc-000000000046', 'At the Hospital', 'Visiting a hospital', 'Hospital mein baat-cheet', 'INTERMEDIATE', 'Daily Life', 46, 10, 70, 5, 5),
  ('dddddddd-cccc-cccc-cccc-000000000047', 'Talking to a Child', 'Everyday parenting talk', 'Bachche se baat', 'BEGINNER', 'Daily Life', 47, 5, 50, 5, 5),
  ('dddddddd-cccc-cccc-cccc-000000000048', 'At the Temple', 'Visiting a temple', 'Mandir mein', 'BEGINNER', 'Daily Life', 48, 5, 50, 5, 5),
  ('dddddddd-cccc-cccc-cccc-000000000049', 'Lost and Found', 'Losing something', 'Kho gaya saamaan', 'BEGINNER', 'Daily Life', 49, 6, 50, 5, 5),
  ('dddddddd-cccc-cccc-cccc-000000000050', 'At the Petrol Pump', 'Filling fuel', 'Petrol pump par', 'BEGINNER', 'Daily Life', 50, 5, 50, 5, 5),
  ('dddddddd-cccc-cccc-cccc-000000000051', 'Buying Groceries', 'At the kirana store', 'Kirana saamaan lena', 'BEGINNER', 'Daily Life', 51, 6, 50, 5, 5),
  ('dddddddd-cccc-cccc-cccc-000000000052', 'Talking to House Help', 'Giving daily instructions', 'Ghar ke kaam waale se baat', 'BEGINNER', 'Daily Life', 52, 6, 50, 5, 5),
  ('dddddddd-cccc-cccc-cccc-000000000053', 'At a Wedding', 'Attending a wedding', 'Shaadi mein', 'INTERMEDIATE', 'Daily Life', 53, 8, 70, 5, 5),
  ('dddddddd-cccc-cccc-cccc-000000000054', 'Giving Directions', 'Helping someone find a place', 'Rasta batana', 'BEGINNER', 'Daily Life', 54, 6, 50, 5, 5),
  ('dddddddd-cccc-cccc-cccc-000000000055', 'Festival Greetings', 'Wishing on festivals', 'Tyohaar ki shubhkamnayein', 'BEGINNER', 'Daily Life', 55, 5, 50, 5, 5),
  ('dddddddd-cccc-cccc-cccc-000000000056', 'Renting a Flat', 'Looking for a place', 'Kamra kiraye par lena', 'INTERMEDIATE', 'Travel', 56, 10, 70, 5, 5),
  ('dddddddd-cccc-cccc-cccc-000000000057', 'At the Bus Stop', 'Catching a bus', 'Bus stop par', 'BEGINNER', 'Travel', 57, 5, 50, 5, 5),
  ('dddddddd-cccc-cccc-cccc-000000000058', 'Asking About Tourist Spots', 'Sightseeing', 'Ghoomne ki jagah poochna', 'BEGINNER', 'Travel', 58, 6, 50, 5, 5),
  ('dddddddd-cccc-cccc-cccc-000000000059', 'Currency Exchange', 'Exchanging money', 'Paise badalna', 'INTERMEDIATE', 'Travel', 59, 8, 70, 5, 5),
  ('dddddddd-cccc-cccc-cccc-000000000060', 'Job Resignation', 'Resigning gracefully', 'Naukri chhodna', 'ADVANCED', 'Work', 60, 10, 100, 5, 5),
  ('dddddddd-cccc-cccc-cccc-000000000061', 'Customer Support Call', 'Calling support', 'Customer care se baat', 'INTERMEDIATE', 'Work', 61, 9, 70, 5, 5),
  ('dddddddd-cccc-cccc-cccc-000000000062', 'First Day Introductions', 'Your first day at work', 'Naye office mein intro', 'BEGINNER', 'Work', 62, 6, 50, 5, 5),
  ('dddddddd-cccc-cccc-cccc-000000000063', 'Negotiating a Deadline', 'Discussing timelines', 'Deadline par baat', 'ADVANCED', 'Work', 63, 10, 100, 5, 5),
  ('dddddddd-cccc-cccc-cccc-000000000064', 'Giving Feedback', 'Sharing feedback', 'Feedback dena', 'INTERMEDIATE', 'Work', 64, 8, 70, 5, 5),
  ('dddddddd-cccc-cccc-cccc-000000000065', 'Thanking Your Boss', 'Showing gratitude', 'Boss ko dhanyavaad', 'BEGINNER', 'Work', 65, 5, 50, 5, 5)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  situation = EXCLUDED.situation,
  hindi_description = EXCLUDED.hindi_description,
  difficulty = EXCLUDED.difficulty,
  category = EXCLUDED.category,
  order_num = EXCLUDED.order_num,
  duration_mins = EXCLUDED.duration_mins,
  xp_reward = EXCLUDED.xp_reward,
  word_count = EXCLUDED.word_count,
  quiz_count = EXCLUDED.quiz_count;

-- Clear any existing phrases for these lessons so re-running stays clean
DELETE FROM phrases WHERE lesson_id IN (
  'dddddddd-cccc-cccc-cccc-000000000046','dddddddd-cccc-cccc-cccc-000000000047',
  'dddddddd-cccc-cccc-cccc-000000000048','dddddddd-cccc-cccc-cccc-000000000049',
  'dddddddd-cccc-cccc-cccc-000000000050','dddddddd-cccc-cccc-cccc-000000000051',
  'dddddddd-cccc-cccc-cccc-000000000052','dddddddd-cccc-cccc-cccc-000000000053',
  'dddddddd-cccc-cccc-cccc-000000000054','dddddddd-cccc-cccc-cccc-000000000055',
  'dddddddd-cccc-cccc-cccc-000000000056','dddddddd-cccc-cccc-cccc-000000000057',
  'dddddddd-cccc-cccc-cccc-000000000058','dddddddd-cccc-cccc-cccc-000000000059',
  'dddddddd-cccc-cccc-cccc-000000000060','dddddddd-cccc-cccc-cccc-000000000061',
  'dddddddd-cccc-cccc-cccc-000000000062','dddddddd-cccc-cccc-cccc-000000000063',
  'dddddddd-cccc-cccc-cccc-000000000064','dddddddd-cccc-cccc-cccc-000000000065'
);

-- ------------------------------------------------------------------
-- 2. PHRASES (5 per lesson)
-- ------------------------------------------------------------------

-- 46: At the Hospital
INSERT INTO phrases (lesson_id, english, hindi, pronunciation_guide) VALUES
  ('dddddddd-cccc-cccc-cccc-000000000046', 'Where is the emergency ward?', 'Emergency ward kahan hai?', 'Where | is | the | e-mer-gen-cy | ward'),
  ('dddddddd-cccc-cccc-cccc-000000000046', 'I need to see a doctor.', 'Mujhe doctor se milna hai.', 'I | need | to | see | a | doc-tor'),
  ('dddddddd-cccc-cccc-cccc-000000000046', 'My father is not feeling well.', 'Mere pita ji ki tabiyat theek nahi hai.', 'My | fa-ther | is | not | feel-ing | well'),
  ('dddddddd-cccc-cccc-cccc-000000000046', 'Which floor is the lab on?', 'Lab kis floor par hai?', 'Which | floor | is | the | lab | on'),
  ('dddddddd-cccc-cccc-cccc-000000000046', 'What are the visiting hours?', 'Milne ka samay kya hai?', 'What | are | the | vis-it-ing | hours');

-- 47: Talking to a Child
INSERT INTO phrases (lesson_id, english, hindi, pronunciation_guide) VALUES
  ('dddddddd-cccc-cccc-cccc-000000000047', 'Did you finish your homework?', 'Tumne homework kiya?', 'Did | you | fin-ish | your | home-work'),
  ('dddddddd-cccc-cccc-cccc-000000000047', 'Wash your hands before eating.', 'Khaane se pehle haath dho lo.', 'Wash | your | hands | be-fore | eat-ing'),
  ('dddddddd-cccc-cccc-cccc-000000000047', 'It is time to sleep.', 'Sone ka samay ho gaya.', 'It | is | time | to | sleep'),
  ('dddddddd-cccc-cccc-cccc-000000000047', 'Be careful while crossing the road.', 'Road paar karte samay dhyan rakhna.', 'Be | care-ful | while | cross-ing | the | road'),
  ('dddddddd-cccc-cccc-cccc-000000000047', 'Well done, I am proud of you.', 'Shabaash, mujhe tum par garv hai.', 'Well | done | I | am | proud | of | you');

-- 48: At the Temple
INSERT INTO phrases (lesson_id, english, hindi, pronunciation_guide) VALUES
  ('dddddddd-cccc-cccc-cccc-000000000048', 'Where do I keep my shoes?', 'Joote kahan rakhne hain?', 'Where | do | I | keep | my | shoes'),
  ('dddddddd-cccc-cccc-cccc-000000000048', 'What time does the aarti start?', 'Aarti kab shuru hoti hai?', 'What | time | does | the | aar-ti | start'),
  ('dddddddd-cccc-cccc-cccc-000000000048', 'Please stand in the line.', 'Kripya line mein lagiye.', 'Please | stand | in | the | line'),
  ('dddddddd-cccc-cccc-cccc-000000000048', 'Can I take photos here?', 'Kya yahan photo le sakte hain?', 'Can | I | take | pho-tos | here'),
  ('dddddddd-cccc-cccc-cccc-000000000048', 'This place is very peaceful.', 'Yeh jagah bahut shaant hai.', 'This | place | is | ve-ry | peace-ful');

-- 49: Lost and Found
INSERT INTO phrases (lesson_id, english, hindi, pronunciation_guide) VALUES
  ('dddddddd-cccc-cccc-cccc-000000000049', 'I have lost my wallet.', 'Mera wallet kho gaya hai.', 'I | have | lost | my | wal-let'),
  ('dddddddd-cccc-cccc-cccc-000000000049', 'Have you seen a black bag?', 'Kya aapne ek kala bag dekha?', 'Have | you | seen | a | black | bag'),
  ('dddddddd-cccc-cccc-cccc-000000000049', 'Where is the lost and found office?', 'Lost and found office kahan hai?', 'Where | is | the | lost | and | found | of-fice'),
  ('dddddddd-cccc-cccc-cccc-000000000049', 'It has my ID card inside.', 'Usme mera ID card hai.', 'It | has | my | ID | card | in-side'),
  ('dddddddd-cccc-cccc-cccc-000000000049', 'Please call me if you find it.', 'Mil jaye to mujhe call kijiye.', 'Please | call | me | if | you | find | it');

-- 50: At the Petrol Pump
INSERT INTO phrases (lesson_id, english, hindi, pronunciation_guide) VALUES
  ('dddddddd-cccc-cccc-cccc-000000000050', 'Full tank, please.', 'Tank full kar dijiye.', 'Full | tank | please'),
  ('dddddddd-cccc-cccc-cccc-000000000050', 'Petrol for five hundred rupees.', 'Paanch sau ka petrol daal dijiye.', 'Pet-rol | for | five | hun-dred | ru-pees'),
  ('dddddddd-cccc-cccc-cccc-000000000050', 'Please check the air pressure.', 'Hawa check kar dijiye.', 'Please | check | the | air | pres-sure'),
  ('dddddddd-cccc-cccc-cccc-000000000050', 'Can I pay by card?', 'Kya card se de sakta hoon?', 'Can | I | pay | by | card'),
  ('dddddddd-cccc-cccc-cccc-000000000050', 'Where is the washroom?', 'Washroom kahan hai?', 'Where | is | the | wash-room');

-- 51: Buying Groceries
INSERT INTO phrases (lesson_id, english, hindi, pronunciation_guide) VALUES
  ('dddddddd-cccc-cccc-cccc-000000000051', 'Do you have one kilo of rice?', 'Kya ek kilo chawal hai?', 'Do | you | have | one | ki-lo | of | rice'),
  ('dddddddd-cccc-cccc-cccc-000000000051', 'Give me a packet of biscuits.', 'Ek packet biscuit dena.', 'Give | me | a | pack-et | of | bis-cuits'),
  ('dddddddd-cccc-cccc-cccc-000000000051', 'Is this fresh?', 'Kya yeh taaza hai?', 'Is | this | fresh'),
  ('dddddddd-cccc-cccc-cccc-000000000051', 'How much is the total?', 'Total kitna hua?', 'How | much | is | the | to-tal'),
  ('dddddddd-cccc-cccc-cccc-000000000051', 'Please give a carry bag.', 'Ek thaili de dijiye.', 'Please | give | a | car-ry | bag');

-- 52: Talking to House Help
INSERT INTO phrases (lesson_id, english, hindi, pronunciation_guide) VALUES
  ('dddddddd-cccc-cccc-cccc-000000000052', 'Please clean the rooms first.', 'Pehle kamre saaf kar do.', 'Please | clean | the | rooms | first'),
  ('dddddddd-cccc-cccc-cccc-000000000052', 'The dishes are in the sink.', 'Bartan sink mein hain.', 'The | dish-es | are | in | the | sink'),
  ('dddddddd-cccc-cccc-cccc-000000000052', 'Please come on time tomorrow.', 'Kal time par aana.', 'Please | come | on | time | to-mor-row'),
  ('dddddddd-cccc-cccc-cccc-000000000052', 'Take a tea break if you want.', 'Chai peeni ho to pee lo.', 'Take | a | tea | break | if | you | want'),
  ('dddddddd-cccc-cccc-cccc-000000000052', 'Thank you for your hard work.', 'Tumhari mehnat ke liye shukriya.', 'Thank | you | for | your | hard | work');

-- 53: At a Wedding
INSERT INTO phrases (lesson_id, english, hindi, pronunciation_guide) VALUES
  ('dddddddd-cccc-cccc-cccc-000000000053', 'Congratulations to the couple!', 'Naye jode ko badhai!', 'Con-grat-u-la-tions | to | the | cou-ple'),
  ('dddddddd-cccc-cccc-cccc-000000000053', 'The decorations are beautiful.', 'Sajawat bahut sundar hai.', 'The | dec-o-ra-tions | are | beau-ti-ful'),
  ('dddddddd-cccc-cccc-cccc-000000000053', 'When is the dinner served?', 'Khana kab milega?', 'When | is | the | din-ner | served'),
  ('dddddddd-cccc-cccc-cccc-000000000053', 'You look great in this outfit.', 'Tum is dress mein bahut achhe lag rahe ho.', 'You | look | great | in | this | out-fit'),
  ('dddddddd-cccc-cccc-cccc-000000000053', 'Let us take a photo together.', 'Chalo saath mein photo lete hain.', 'Let | us | take | a | pho-to | to-geth-er');

-- 54: Giving Directions
INSERT INTO phrases (lesson_id, english, hindi, pronunciation_guide) VALUES
  ('dddddddd-cccc-cccc-cccc-000000000054', 'Go straight for two minutes.', 'Do minute seedhe jaiye.', 'Go | straight | for | two | min-utes'),
  ('dddddddd-cccc-cccc-cccc-000000000054', 'Turn right at the signal.', 'Signal par right mud jaiye.', 'Turn | right | at | the | sig-nal'),
  ('dddddddd-cccc-cccc-cccc-000000000054', 'It is next to the bank.', 'Woh bank ke bagal mein hai.', 'It | is | next | to | the | bank'),
  ('dddddddd-cccc-cccc-cccc-000000000054', 'You cannot miss it.', 'Aap aasani se dekh lenge.', 'You | can-not | miss | it'),
  ('dddddddd-cccc-cccc-cccc-000000000054', 'It is just a short walk.', 'Bas thodi door hai.', 'It | is | just | a | short | walk');

-- 55: Festival Greetings
INSERT INTO phrases (lesson_id, english, hindi, pronunciation_guide) VALUES
  ('dddddddd-cccc-cccc-cccc-000000000055', 'Happy Diwali to you and your family!', 'Aapko aur parivaar ko Diwali ki shubhkamnayein!', 'Hap-py | Di-wa-li | to | you | and | your | fam-i-ly'),
  ('dddddddd-cccc-cccc-cccc-000000000055', 'Wishing you a great year ahead.', 'Aane wala saal shubh ho.', 'Wish-ing | you | a | great | year | a-head'),
  ('dddddddd-cccc-cccc-cccc-000000000055', 'May you be happy and healthy.', 'Aap khush aur swasth rahein.', 'May | you | be | hap-py | and | health-y'),
  ('dddddddd-cccc-cccc-cccc-000000000055', 'Thank you for the sweets.', 'Mithai ke liye shukriya.', 'Thank | you | for | the | sweets'),
  ('dddddddd-cccc-cccc-cccc-000000000055', 'Let us celebrate together.', 'Chalo saath mein manate hain.', 'Let | us | cel-e-brate | to-geth-er');

-- 56: Renting a Flat
INSERT INTO phrases (lesson_id, english, hindi, pronunciation_guide) VALUES
  ('dddddddd-cccc-cccc-cccc-000000000056', 'I am looking for a two-room flat.', 'Mujhe do kamre ka flat chahiye.', 'I | am | look-ing | for | a | two-room | flat'),
  ('dddddddd-cccc-cccc-cccc-000000000056', 'What is the monthly rent?', 'Mahine ka kiraya kitna hai?', 'What | is | the | month-ly | rent'),
  ('dddddddd-cccc-cccc-cccc-000000000056', 'Is the deposit refundable?', 'Kya deposit wapas milega?', 'Is | the | de-pos-it | re-fund-a-ble'),
  ('dddddddd-cccc-cccc-cccc-000000000056', 'Are bills included in the rent?', 'Kya bill kiraye mein shaamil hain?', 'Are | bills | in-clud-ed | in | the | rent'),
  ('dddddddd-cccc-cccc-cccc-000000000056', 'When can I move in?', 'Main kab shift ho sakta hoon?', 'When | can | I | move | in');

-- 57: At the Bus Stop
INSERT INTO phrases (lesson_id, english, hindi, pronunciation_guide) VALUES
  ('dddddddd-cccc-cccc-cccc-000000000057', 'Does this bus go to the station?', 'Kya yeh bus station jaati hai?', 'Does | this | bus | go | to | the | sta-tion'),
  ('dddddddd-cccc-cccc-cccc-000000000057', 'What is the ticket price?', 'Ticket kitne ka hai?', 'What | is | the | tick-et | price'),
  ('dddddddd-cccc-cccc-cccc-000000000057', 'When is the next bus?', 'Agli bus kab hai?', 'When | is | the | next | bus'),
  ('dddddddd-cccc-cccc-cccc-000000000057', 'Please tell me when to get down.', 'Mujhe utarne ki jagah bata dena.', 'Please | tell | me | when | to | get | down'),
  ('dddddddd-cccc-cccc-cccc-000000000057', 'Is this seat free?', 'Kya yeh seat khaali hai?', 'Is | this | seat | free');

-- 58: Asking About Tourist Spots
INSERT INTO phrases (lesson_id, english, hindi, pronunciation_guide) VALUES
  ('dddddddd-cccc-cccc-cccc-000000000058', 'What is famous to see here?', 'Yahan dekhne layak kya hai?', 'What | is | fa-mous | to | see | here'),
  ('dddddddd-cccc-cccc-cccc-000000000058', 'How do I reach the fort?', 'Kile tak kaise jaaun?', 'How | do | I | reach | the | fort'),
  ('dddddddd-cccc-cccc-cccc-000000000058', 'Is there an entry fee?', 'Kya entry fee hai?', 'Is | there | an | en-try | fee'),
  ('dddddddd-cccc-cccc-cccc-000000000058', 'What time does it open?', 'Yeh kitne baje khulta hai?', 'What | time | does | it | o-pen'),
  ('dddddddd-cccc-cccc-cccc-000000000058', 'Can you suggest a good place to eat?', 'Khaane ki achhi jagah bataiye.', 'Can | you | sug-gest | a | good | place | to | eat');

-- 59: Currency Exchange
INSERT INTO phrases (lesson_id, english, hindi, pronunciation_guide) VALUES
  ('dddddddd-cccc-cccc-cccc-000000000059', 'I want to exchange dollars.', 'Mujhe dollar badalne hain.', 'I | want | to | ex-change | dol-lars'),
  ('dddddddd-cccc-cccc-cccc-000000000059', 'What is the exchange rate today?', 'Aaj ka rate kya hai?', 'What | is | the | ex-change | rate | to-day'),
  ('dddddddd-cccc-cccc-cccc-000000000059', 'Is there any service charge?', 'Koi service charge hai?', 'Is | there | an-y | ser-vice | charge'),
  ('dddddddd-cccc-cccc-cccc-000000000059', 'Please give smaller notes.', 'Chhote note de dijiye.', 'Please | give | smaller | notes'),
  ('dddddddd-cccc-cccc-cccc-000000000059', 'Here is my passport.', 'Yeh lijiye mera passport.', 'Here | is | my | pass-port');

-- 60: Job Resignation
INSERT INTO phrases (lesson_id, english, hindi, pronunciation_guide) VALUES
  ('dddddddd-cccc-cccc-cccc-000000000060', 'I would like to resign from my position.', 'Main apne pad se isteefa dena chahta hoon.', 'I | would | like | to | re-sign | from | my | po-si-tion'),
  ('dddddddd-cccc-cccc-cccc-000000000060', 'My last working day will be next month.', 'Mera aakhri din agle mahine hoga.', 'My | last | work-ing | day | will | be | next | month'),
  ('dddddddd-cccc-cccc-cccc-000000000060', 'Thank you for the opportunity.', 'Is mauke ke liye shukriya.', 'Thank | you | for | the | op-por-tu-ni-ty'),
  ('dddddddd-cccc-cccc-cccc-000000000060', 'I have learned a lot here.', 'Maine yahan bahut kuch seekha.', 'I | have | learned | a | lot | here'),
  ('dddddddd-cccc-cccc-cccc-000000000060', 'I will complete the handover properly.', 'Main handover theek se kar dunga.', 'I | will | com-plete | the | hand-o-ver | prop-er-ly');

-- 61: Customer Support Call
INSERT INTO phrases (lesson_id, english, hindi, pronunciation_guide) VALUES
  ('dddddddd-cccc-cccc-cccc-000000000061', 'I am facing an issue with my order.', 'Mere order mein dikkat aa rahi hai.', 'I | am | fac-ing | an | is-sue | with | my | or-der'),
  ('dddddddd-cccc-cccc-cccc-000000000061', 'My complaint number is 4521.', 'Meri complaint number 4521 hai.', 'My | com-plaint | num-ber | is | four | five | two | one'),
  ('dddddddd-cccc-cccc-cccc-000000000061', 'Can you check the status, please?', 'Kya aap status check karenge?', 'Can | you | check | the | sta-tus | please'),
  ('dddddddd-cccc-cccc-cccc-000000000061', 'How soon can this be solved?', 'Yeh kitni jaldi theek hoga?', 'How | soon | can | this | be | solved'),
  ('dddddddd-cccc-cccc-cccc-000000000061', 'Thank you for your help.', 'Aapki madad ke liye shukriya.', 'Thank | you | for | your | help');

-- 62: First Day Introductions
INSERT INTO phrases (lesson_id, english, hindi, pronunciation_guide) VALUES
  ('dddddddd-cccc-cccc-cccc-000000000062', 'Hi, I am the new team member.', 'Hi, main nayi team member hoon.', 'Hi | I | am | the | new | team | mem-ber'),
  ('dddddddd-cccc-cccc-cccc-000000000062', 'I am excited to work with you.', 'Aapke saath kaam karke khushi hogi.', 'I | am | ex-cit-ed | to | work | with | you'),
  ('dddddddd-cccc-cccc-cccc-000000000062', 'Where do I sit?', 'Main kahan baithun?', 'Where | do | I | sit'),
  ('dddddddd-cccc-cccc-cccc-000000000062', 'Who should I report to?', 'Mujhe kise report karna hai?', 'Who | should | I | re-port | to'),
  ('dddddddd-cccc-cccc-cccc-000000000062', 'Please help me get started.', 'Mujhe shuru karne mein madad kijiye.', 'Please | help | me | get | start-ed');

-- 63: Negotiating a Deadline
INSERT INTO phrases (lesson_id, english, hindi, pronunciation_guide) VALUES
  ('dddddddd-cccc-cccc-cccc-000000000063', 'This deadline is a bit tight.', 'Yeh deadline thodi tight hai.', 'This | dead-line | is | a | bit | tight'),
  ('dddddddd-cccc-cccc-cccc-000000000063', 'Can we extend it by two days?', 'Kya do din badha sakte hain?', 'Can | we | ex-tend | it | by | two | days'),
  ('dddddddd-cccc-cccc-cccc-000000000063', 'I want to deliver good quality.', 'Main achhi quality dena chahta hoon.', 'I | want | to | de-liv-er | good | qual-i-ty'),
  ('dddddddd-cccc-cccc-cccc-000000000063', 'I will keep you updated daily.', 'Main roz update dunga.', 'I | will | keep | you | up-dat-ed | dai-ly'),
  ('dddddddd-cccc-cccc-cccc-000000000063', 'Let us agree on a fair date.', 'Chalo ek sahi date tay karte hain.', 'Let | us | a-gree | on | a | fair | date');

-- 64: Giving Feedback
INSERT INTO phrases (lesson_id, english, hindi, pronunciation_guide) VALUES
  ('dddddddd-cccc-cccc-cccc-000000000064', 'You did a really good job.', 'Aapne bahut achha kaam kiya.', 'You | did | a | real-ly | good | job'),
  ('dddddddd-cccc-cccc-cccc-000000000064', 'There is some room for improvement.', 'Thoda sudhaar ki gunjaaish hai.', 'There | is | some | room | for | im-prove-ment'),
  ('dddddddd-cccc-cccc-cccc-000000000064', 'Try to be more clear next time.', 'Agli baar thoda saaf rakhna.', 'Try | to | be | more | clear | next | time'),
  ('dddddddd-cccc-cccc-cccc-000000000064', 'I appreciate your effort.', 'Mujhe aapki mehnat achhi lagi.', 'I | ap-pre-ci-ate | your | ef-fort'),
  ('dddddddd-cccc-cccc-cccc-000000000064', 'Let me know if you need support.', 'Madad chahiye to batana.', 'Let | me | know | if | you | need | sup-port');

-- 65: Thanking Your Boss
INSERT INTO phrases (lesson_id, english, hindi, pronunciation_guide) VALUES
  ('dddddddd-cccc-cccc-cccc-000000000065', 'Thank you for your guidance.', 'Aapke margdarshan ke liye shukriya.', 'Thank | you | for | your | guid-ance'),
  ('dddddddd-cccc-cccc-cccc-000000000065', 'I really appreciate your support.', 'Aapke saath ke liye dhanyavaad.', 'I | real-ly | ap-pre-ci-ate | your | sup-port'),
  ('dddddddd-cccc-cccc-cccc-000000000065', 'I learned a lot from you.', 'Maine aapse bahut kuch seekha.', 'I | learned | a | lot | from | you'),
  ('dddddddd-cccc-cccc-cccc-000000000065', 'It means a lot to me.', 'Yeh mere liye bahut maayne rakhta hai.', 'It | means | a | lot | to | me'),
  ('dddddddd-cccc-cccc-cccc-000000000065', 'I will keep working hard.', 'Main aage bhi mehnat karta rahunga.', 'I | will | keep | work-ing | hard');
