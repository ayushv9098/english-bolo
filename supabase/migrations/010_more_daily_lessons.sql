-- 010_more_daily_lessons.sql
-- Adds 20 new "daily use" lessons (order_num 26 to 45) with 5 phrases each.
-- Safe to re-run: uses fixed UUIDs + ON CONFLICT, and clears these lessons' phrases first.

-- ------------------------------------------------------------------
-- 1. LESSONS (orders 26-45)
-- ------------------------------------------------------------------
INSERT INTO lessons (id, title, situation, hindi_description, difficulty, category, order_num, duration_mins, xp_reward, word_count, quiz_count) VALUES
  ('cccccccc-cccc-cccc-cccc-000000000026', 'Ordering Food Online', 'Using a food delivery app', 'Online khana order karna', 'BEGINNER', 'Daily Life', 26, 6, 50, 5, 5),
  ('cccccccc-cccc-cccc-cccc-000000000027', 'At the Pharmacy', 'Buying medicine at a chemist', 'Medical store par dawa lena', 'BEGINNER', 'Daily Life', 27, 6, 50, 5, 5),
  ('cccccccc-cccc-cccc-cccc-000000000028', 'Talking to a Neighbour', 'Friendly chat next door', 'Padosi se baat-cheet', 'BEGINNER', 'Daily Life', 28, 5, 50, 5, 5),
  ('cccccccc-cccc-cccc-cccc-000000000029', 'Mobile Recharge & SIM', 'At a mobile shop', 'Mobile recharge aur SIM', 'BEGINNER', 'Daily Life', 29, 5, 50, 5, 5),
  ('cccccccc-cccc-cccc-cccc-000000000030', 'At the Salon', 'Getting a haircut', 'Salon mein baal katwana', 'BEGINNER', 'Daily Life', 30, 6, 50, 5, 5),
  ('cccccccc-cccc-cccc-cccc-000000000031', 'Paying Bills', 'Paying utility bills', 'Bill bharna', 'BEGINNER', 'Daily Life', 31, 6, 50, 5, 5),
  ('cccccccc-cccc-cccc-cccc-000000000032', 'Small Talk: Weather', 'Casual weather chat', 'Mausam ki baat', 'BEGINNER', 'Daily Life', 32, 5, 50, 5, 5),
  ('cccccccc-cccc-cccc-cccc-000000000033', 'Saying Sorry', 'Apologizing sincerely', 'Maafi maangna', 'BEGINNER', 'Daily Life', 33, 5, 50, 5, 5),
  ('cccccccc-cccc-cccc-cccc-000000000034', 'Making Plans with Friends', 'Planning a weekend', 'Doston ke saath plan banana', 'BEGINNER', 'Daily Life', 34, 6, 50, 5, 5),
  ('cccccccc-cccc-cccc-cccc-000000000035', 'Ordering at a Cafe', 'At a coffee shop', 'Cafe mein order karna', 'BEGINNER', 'Daily Life', 35, 6, 50, 5, 5),
  ('cccccccc-cccc-cccc-cccc-000000000036', 'Complaining Politely', 'Raising a complaint', 'Shishtata se shikayat karna', 'INTERMEDIATE', 'Daily Life', 36, 8, 70, 5, 5),
  ('cccccccc-cccc-cccc-cccc-000000000037', 'At the Gym', 'Working out', 'Gym mein baat-cheet', 'BEGINNER', 'Daily Life', 37, 6, 50, 5, 5),
  ('cccccccc-cccc-cccc-cccc-000000000038', 'Booking a Cab', 'Ordering an Ola/Uber', 'Cab book karna', 'BEGINNER', 'Travel', 38, 6, 50, 5, 5),
  ('cccccccc-cccc-cccc-cccc-000000000039', 'At the Airport', 'Catching a flight', 'Airport par baat-cheet', 'INTERMEDIATE', 'Travel', 39, 10, 70, 5, 5),
  ('cccccccc-cccc-cccc-cccc-000000000040', 'Hotel Check-in', 'Arriving at a hotel', 'Hotel mein check-in', 'INTERMEDIATE', 'Travel', 40, 9, 70, 5, 5),
  ('cccccccc-cccc-cccc-cccc-000000000041', 'Asking for Wi-Fi', 'Getting connected', 'Wi-Fi maangna', 'BEGINNER', 'Travel', 41, 5, 50, 5, 5),
  ('cccccccc-cccc-cccc-cccc-000000000042', 'Daily Standup Meeting', 'Sharing your update', 'Office standup meeting', 'INTERMEDIATE', 'Work', 42, 8, 70, 5, 5),
  ('cccccccc-cccc-cccc-cccc-000000000043', 'Talking to a Colleague', 'Friendly office chat', 'Colleague se baat', 'BEGINNER', 'Work', 43, 6, 50, 5, 5),
  ('cccccccc-cccc-cccc-cccc-000000000044', 'Writing an Email', 'Professional emails', 'Email likhna', 'INTERMEDIATE', 'Work', 44, 9, 70, 5, 5),
  ('cccccccc-cccc-cccc-cccc-000000000045', 'Salary Discussion', 'Asking for a raise', 'Salary par baat-cheet', 'ADVANCED', 'Work', 45, 10, 100, 5, 5)
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
  'cccccccc-cccc-cccc-cccc-000000000026','cccccccc-cccc-cccc-cccc-000000000027',
  'cccccccc-cccc-cccc-cccc-000000000028','cccccccc-cccc-cccc-cccc-000000000029',
  'cccccccc-cccc-cccc-cccc-000000000030','cccccccc-cccc-cccc-cccc-000000000031',
  'cccccccc-cccc-cccc-cccc-000000000032','cccccccc-cccc-cccc-cccc-000000000033',
  'cccccccc-cccc-cccc-cccc-000000000034','cccccccc-cccc-cccc-cccc-000000000035',
  'cccccccc-cccc-cccc-cccc-000000000036','cccccccc-cccc-cccc-cccc-000000000037',
  'cccccccc-cccc-cccc-cccc-000000000038','cccccccc-cccc-cccc-cccc-000000000039',
  'cccccccc-cccc-cccc-cccc-000000000040','cccccccc-cccc-cccc-cccc-000000000041',
  'cccccccc-cccc-cccc-cccc-000000000042','cccccccc-cccc-cccc-cccc-000000000043',
  'cccccccc-cccc-cccc-cccc-000000000044','cccccccc-cccc-cccc-cccc-000000000045'
);

-- ------------------------------------------------------------------
-- 2. PHRASES (5 per lesson)
-- ------------------------------------------------------------------

-- 26: Ordering Food Online
INSERT INTO phrases (lesson_id, english, hindi, pronunciation_guide) VALUES
  ('cccccccc-cccc-cccc-cccc-000000000026', 'I want to place an order.', 'Mujhe order dena hai.', 'I | want | to | place | an | or-der'),
  ('cccccccc-cccc-cccc-cccc-000000000026', 'Is delivery free?', 'Kya delivery free hai?', 'Is | de-liv-er-y | free'),
  ('cccccccc-cccc-cccc-cccc-000000000026', 'How long will it take?', 'Kitna samay lagega?', 'How | long | will | it | take'),
  ('cccccccc-cccc-cccc-cccc-000000000026', 'Please do not make it too spicy.', 'Zyada teekha mat banana.', 'Please | do | not | make | it | too | spi-cy'),
  ('cccccccc-cccc-cccc-cccc-000000000026', 'I want to pay by UPI.', 'Main UPI se pay karunga.', 'I | want | to | pay | by | U-P-I');

-- 27: At the Pharmacy
INSERT INTO phrases (lesson_id, english, hindi, pronunciation_guide) VALUES
  ('cccccccc-cccc-cccc-cccc-000000000027', 'Do you have this medicine?', 'Kya yeh dawa aapke paas hai?', 'Do | you | have | this | med-i-cine'),
  ('cccccccc-cccc-cccc-cccc-000000000027', 'I need something for a cough.', 'Mujhe khaansi ki dawa chahiye.', 'I | need | some-thing | for | a | cough'),
  ('cccccccc-cccc-cccc-cccc-000000000027', 'Are there any side effects?', 'Koi side effect to nahi?', 'Are | there | an-y | side | ef-fects'),
  ('cccccccc-cccc-cccc-cccc-000000000027', 'How should I take this?', 'Ise kaise lena hai?', 'How | should | I | take | this'),
  ('cccccccc-cccc-cccc-cccc-000000000027', 'Do I need a prescription?', 'Kya prescription chahiye?', 'Do | I | need | a | pre-scrip-tion');

-- 28: Talking to a Neighbour
INSERT INTO phrases (lesson_id, english, hindi, pronunciation_guide) VALUES
  ('cccccccc-cccc-cccc-cccc-000000000028', 'Good morning! How are you?', 'Suprabhat! Aap kaise hain?', 'Good | morn-ing | How | are | you'),
  ('cccccccc-cccc-cccc-cccc-000000000028', 'Could you keep an eye on my house?', 'Kya aap mere ghar ka dhyan rakhenge?', 'Could | you | keep | an | eye | on | my | house'),
  ('cccccccc-cccc-cccc-cccc-000000000028', 'Can I borrow some sugar?', 'Thodi cheeni mil sakti hai?', 'Can | I | bor-row | some | su-gar'),
  ('cccccccc-cccc-cccc-cccc-000000000028', 'Let us meet sometime.', 'Kabhi milte hain.', 'Let | us | meet | some-time'),
  ('cccccccc-cccc-cccc-cccc-000000000028', 'Please lower the volume a little.', 'Zara aawaz kam kar dijiye.', 'Please | low-er | the | vol-ume | a | lit-tle');

-- 29: Mobile Recharge & SIM
INSERT INTO phrases (lesson_id, english, hindi, pronunciation_guide) VALUES
  ('cccccccc-cccc-cccc-cccc-000000000029', 'I want to recharge my number.', 'Mujhe apna number recharge karna hai.', 'I | want | to | re-charge | my | num-ber'),
  ('cccccccc-cccc-cccc-cccc-000000000029', 'Which plan is the best?', 'Sabse achha plan kaunsa hai?', 'Which | plan | is | the | best'),
  ('cccccccc-cccc-cccc-cccc-000000000029', 'I need a new SIM card.', 'Mujhe nayi SIM chahiye.', 'I | need | a | new | SIM | card'),
  ('cccccccc-cccc-cccc-cccc-000000000029', 'How much data will I get?', 'Kitna data milega?', 'How | much | da-ta | will | I | get'),
  ('cccccccc-cccc-cccc-cccc-000000000029', 'My recharge has not started yet.', 'Mera recharge abhi chalu nahi hua.', 'My | re-charge | has | not | start-ed | yet');

-- 30: At the Salon
INSERT INTO phrases (lesson_id, english, hindi, pronunciation_guide) VALUES
  ('cccccccc-cccc-cccc-cccc-000000000030', 'I want a haircut.', 'Mujhe baal katwane hain.', 'I | want | a | hair-cut'),
  ('cccccccc-cccc-cccc-cccc-000000000030', 'Just a little trim, please.', 'Bas thoda chhota kar dijiye.', 'Just | a | lit-tle | trim | please'),
  ('cccccccc-cccc-cccc-cccc-000000000030', 'Not too short.', 'Zyada chhote mat karna.', 'Not | too | short'),
  ('cccccccc-cccc-cccc-cccc-000000000030', 'How much will it cost?', 'Kitne paise lagenge?', 'How | much | will | it | cost'),
  ('cccccccc-cccc-cccc-cccc-000000000030', 'It looks great, thank you.', 'Bahut achha laga, shukriya.', 'It | looks | great | thank | you');

-- 31: Paying Bills
INSERT INTO phrases (lesson_id, english, hindi, pronunciation_guide) VALUES
  ('cccccccc-cccc-cccc-cccc-000000000031', 'I want to pay my electricity bill.', 'Mujhe bijli ka bill bharna hai.', 'I | want | to | pay | my | e-lec-tri-ci-ty | bill'),
  ('cccccccc-cccc-cccc-cccc-000000000031', 'What is the due date?', 'Aakhri tareekh kya hai?', 'What | is | the | due | date'),
  ('cccccccc-cccc-cccc-cccc-000000000031', 'Can I pay online?', 'Kya online bhar sakta hoon?', 'Can | I | pay | on-line'),
  ('cccccccc-cccc-cccc-cccc-000000000031', 'Is there a late fee?', 'Kya late fee lagega?', 'Is | there | a | late | fee'),
  ('cccccccc-cccc-cccc-cccc-000000000031', 'Please give me the receipt.', 'Receipt de dijiye.', 'Please | give | me | the | re-ceipt');

-- 32: Small Talk: Weather
INSERT INTO phrases (lesson_id, english, hindi, pronunciation_guide) VALUES
  ('cccccccc-cccc-cccc-cccc-000000000032', 'It is very hot today.', 'Aaj bahut garmi hai.', 'It | is | ve-ry | hot | to-day'),
  ('cccccccc-cccc-cccc-cccc-000000000032', 'It might rain in the evening.', 'Shaam ko baarish ho sakti hai.', 'It | might | rain | in | the | eve-ning'),
  ('cccccccc-cccc-cccc-cccc-000000000032', 'The weather is lovely.', 'Mausam bahut achha hai.', 'The | weath-er | is | love-ly'),
  ('cccccccc-cccc-cccc-cccc-000000000032', 'Do not forget your umbrella.', 'Apna chhata mat bhoolna.', 'Do | not | for-get | your | um-brel-la'),
  ('cccccccc-cccc-cccc-cccc-000000000032', 'It is getting cold these days.', 'Aajkal thand badh rahi hai.', 'It | is | get-ting | cold | these | days');

-- 33: Saying Sorry
INSERT INTO phrases (lesson_id, english, hindi, pronunciation_guide) VALUES
  ('cccccccc-cccc-cccc-cccc-000000000033', 'I am really sorry.', 'Mujhe sach mein maafi chahiye.', 'I | am | real-ly | sor-ry'),
  ('cccccccc-cccc-cccc-cccc-000000000033', 'It was my mistake.', 'Yeh meri galti thi.', 'It | was | my | mis-take'),
  ('cccccccc-cccc-cccc-cccc-000000000033', 'I did not mean to.', 'Maine jaan-boojhkar nahi kiya.', 'I | did | not | mean | to'),
  ('cccccccc-cccc-cccc-cccc-000000000033', 'Please forgive me.', 'Kripya mujhe maaf kar dein.', 'Please | for-give | me'),
  ('cccccccc-cccc-cccc-cccc-000000000033', 'It will not happen again.', 'Aisa dobara nahi hoga.', 'It | will | not | hap-pen | a-gain');

-- 34: Making Plans with Friends
INSERT INTO phrases (lesson_id, english, hindi, pronunciation_guide) VALUES
  ('cccccccc-cccc-cccc-cccc-000000000034', 'Are you free this weekend?', 'Kya tum is weekend free ho?', 'Are | you | free | this | week-end'),
  ('cccccccc-cccc-cccc-cccc-000000000034', 'Let us watch a movie.', 'Chalo movie dekhte hain.', 'Let | us | watch | a | mo-vie'),
  ('cccccccc-cccc-cccc-cccc-000000000034', 'What time should we meet?', 'Hum kitne baje milein?', 'What | time | should | we | meet'),
  ('cccccccc-cccc-cccc-cccc-000000000034', 'Where do you want to go?', 'Tum kahan jaana chahte ho?', 'Where | do | you | want | to | go'),
  ('cccccccc-cccc-cccc-cccc-000000000034', 'I will pick you up.', 'Main tumhe lene aa jaunga.', 'I | will | pick | you | up');

-- 35: Ordering at a Cafe
INSERT INTO phrases (lesson_id, english, hindi, pronunciation_guide) VALUES
  ('cccccccc-cccc-cccc-cccc-000000000035', 'One cappuccino, please.', 'Ek cappuccino dena.', 'One | cap-pu-cci-no | please'),
  ('cccccccc-cccc-cccc-cccc-000000000035', 'Do you have any snacks?', 'Kya kuch snacks hain?', 'Do | you | have | an-y | snacks'),
  ('cccccccc-cccc-cccc-cccc-000000000035', 'Can I get it to go?', 'Kya parcel mil sakta hai?', 'Can | I | get | it | to | go'),
  ('cccccccc-cccc-cccc-cccc-000000000035', 'Is there Wi-Fi here?', 'Kya yahan Wi-Fi hai?', 'Is | there | Wi-Fi | here'),
  ('cccccccc-cccc-cccc-cccc-000000000035', 'The coffee is delicious.', 'Coffee bahut achhi hai.', 'The | cof-fee | is | de-li-cious');

-- 36: Complaining Politely
INSERT INTO phrases (lesson_id, english, hindi, pronunciation_guide) VALUES
  ('cccccccc-cccc-cccc-cccc-000000000036', 'Excuse me, there is a problem.', 'Suniye, ek dikkat hai.', 'Ex-cuse | me | there | is | a | prob-lem'),
  ('cccccccc-cccc-cccc-cccc-000000000036', 'This is not what I ordered.', 'Maine yeh order nahi kiya tha.', 'This | is | not | what | I | or-dered'),
  ('cccccccc-cccc-cccc-cccc-000000000036', 'Could you please replace it?', 'Kya ise badal denge?', 'Could | you | please | re-place | it'),
  ('cccccccc-cccc-cccc-cccc-000000000036', 'I would like a refund.', 'Mujhe paise wapas chahiye.', 'I | would | like | a | re-fund'),
  ('cccccccc-cccc-cccc-cccc-000000000036', 'I hope you can fix this soon.', 'Umeed hai jaldi theek ho jayega.', 'I | hope | you | can | fix | this | soon');

-- 37: At the Gym
INSERT INTO phrases (lesson_id, english, hindi, pronunciation_guide) VALUES
  ('cccccccc-cccc-cccc-cccc-000000000037', 'How do I use this machine?', 'Yeh machine kaise chalti hai?', 'How | do | I | use | this | ma-chine'),
  ('cccccccc-cccc-cccc-cccc-000000000037', 'How many sets should I do?', 'Kitne set karne chahiye?', 'How | ma-ny | sets | should | I | do'),
  ('cccccccc-cccc-cccc-cccc-000000000037', 'Can you spot me?', 'Kya aap meri madad karenge?', 'Can | you | spot | me'),
  ('cccccccc-cccc-cccc-cccc-000000000037', 'I want to build stamina.', 'Mujhe stamina badhana hai.', 'I | want | to | build | stam-i-na'),
  ('cccccccc-cccc-cccc-cccc-000000000037', 'I am a little tired today.', 'Aaj main thoda thaka hua hoon.', 'I | am | a | lit-tle | tired | to-day');

-- 38: Booking a Cab
INSERT INTO phrases (lesson_id, english, hindi, pronunciation_guide) VALUES
  ('cccccccc-cccc-cccc-cccc-000000000038', 'I need a cab to the airport.', 'Mujhe airport tak cab chahiye.', 'I | need | a | cab | to | the | air-port'),
  ('cccccccc-cccc-cccc-cccc-000000000038', 'How long is the wait?', 'Kitni der lagegi?', 'How | long | is | the | wait'),
  ('cccccccc-cccc-cccc-cccc-000000000038', 'What is the fare?', 'Kitna kiraya lagega?', 'What | is | the | fare'),
  ('cccccccc-cccc-cccc-cccc-000000000038', 'Please come to the main gate.', 'Main gate par aa jaiye.', 'Please | come | to | the | main | gate'),
  ('cccccccc-cccc-cccc-cccc-000000000038', 'Please drive carefully.', 'Dhyan se chalaiye.', 'Please | drive | care-ful-ly');

-- 39: At the Airport
INSERT INTO phrases (lesson_id, english, hindi, pronunciation_guide) VALUES
  ('cccccccc-cccc-cccc-cccc-000000000039', 'Where is the check-in counter?', 'Check-in counter kahan hai?', 'Where | is | the | check-in | coun-ter'),
  ('cccccccc-cccc-cccc-cccc-000000000039', 'I have one bag to check in.', 'Mujhe ek bag check-in karna hai.', 'I | have | one | bag | to | check | in'),
  ('cccccccc-cccc-cccc-cccc-000000000039', 'Which gate is my flight?', 'Meri flight kis gate par hai?', 'Which | gate | is | my | flight'),
  ('cccccccc-cccc-cccc-cccc-000000000039', 'Is the flight on time?', 'Kya flight time par hai?', 'Is | the | flight | on | time'),
  ('cccccccc-cccc-cccc-cccc-000000000039', 'Where is the boarding area?', 'Boarding area kahan hai?', 'Where | is | the | board-ing | ar-e-a');

-- 40: Hotel Check-in
INSERT INTO phrases (lesson_id, english, hindi, pronunciation_guide) VALUES
  ('cccccccc-cccc-cccc-cccc-000000000040', 'I have a booking under my name.', 'Mere naam par booking hai.', 'I | have | a | book-ing | un-der | my | name'),
  ('cccccccc-cccc-cccc-cccc-000000000040', 'Is breakfast included?', 'Kya nashta shaamil hai?', 'Is | break-fast | in-clud-ed'),
  ('cccccccc-cccc-cccc-cccc-000000000040', 'What time is check-out?', 'Check-out ka samay kya hai?', 'What | time | is | check-out'),
  ('cccccccc-cccc-cccc-cccc-000000000040', 'Could I get an extra towel?', 'Ek aur towel mil sakta hai?', 'Could | I | get | an | ex-tra | tow-el'),
  ('cccccccc-cccc-cccc-cccc-000000000040', 'The room is very comfortable.', 'Kamra bahut aaraamdayak hai.', 'The | room | is | ve-ry | com-fort-a-ble');

-- 41: Asking for Wi-Fi
INSERT INTO phrases (lesson_id, english, hindi, pronunciation_guide) VALUES
  ('cccccccc-cccc-cccc-cccc-000000000041', 'Do you have free Wi-Fi?', 'Kya yahan free Wi-Fi hai?', 'Do | you | have | free | Wi-Fi'),
  ('cccccccc-cccc-cccc-cccc-000000000041', 'What is the password?', 'Password kya hai?', 'What | is | the | pass-word'),
  ('cccccccc-cccc-cccc-cccc-000000000041', 'The internet is very slow.', 'Internet bahut slow hai.', 'The | in-ter-net | is | ve-ry | slow'),
  ('cccccccc-cccc-cccc-cccc-000000000041', 'It is not connecting.', 'Connect nahi ho raha.', 'It | is | not | con-nect-ing'),
  ('cccccccc-cccc-cccc-cccc-000000000041', 'Thanks, it is working now.', 'Shukriya, ab chal raha hai.', 'Thanks | it | is | work-ing | now');

-- 42: Daily Standup Meeting
INSERT INTO phrases (lesson_id, english, hindi, pronunciation_guide) VALUES
  ('cccccccc-cccc-cccc-cccc-000000000042', 'Yesterday I finished the report.', 'Kal maine report khatam ki.', 'Yes-ter-day | I | fin-ished | the | re-port'),
  ('cccccccc-cccc-cccc-cccc-000000000042', 'Today I will work on the design.', 'Aaj main design par kaam karunga.', 'To-day | I | will | work | on | the | de-sign'),
  ('cccccccc-cccc-cccc-cccc-000000000042', 'I am blocked on one issue.', 'Ek dikkat mein atka hoon.', 'I | am | blocked | on | one | is-sue'),
  ('cccccccc-cccc-cccc-cccc-000000000042', 'I need help from the team.', 'Mujhe team ki madad chahiye.', 'I | need | help | from | the | team'),
  ('cccccccc-cccc-cccc-cccc-000000000042', 'I will share an update by evening.', 'Shaam tak update dunga.', 'I | will | share | an | up-date | by | eve-ning');

-- 43: Talking to a Colleague
INSERT INTO phrases (lesson_id, english, hindi, pronunciation_guide) VALUES
  ('cccccccc-cccc-cccc-cccc-000000000043', 'Can you help me with this?', 'Kya isme meri madad karoge?', 'Can | you | help | me | with | this'),
  ('cccccccc-cccc-cccc-cccc-000000000043', 'Do you have a minute?', 'Kya ek minute hai?', 'Do | you | have | a | min-ute'),
  ('cccccccc-cccc-cccc-cccc-000000000043', 'Let us discuss over coffee.', 'Coffee par baat karte hain.', 'Let | us | dis-cuss | o-ver | cof-fee'),
  ('cccccccc-cccc-cccc-cccc-000000000043', 'Good job on the project!', 'Project bahut achha kiya!', 'Good | job | on | the | proj-ect'),
  ('cccccccc-cccc-cccc-cccc-000000000043', 'Let me know if you need anything.', 'Kuch chahiye to batana.', 'Let | me | know | if | you | need | an-y-thing');

-- 44: Writing an Email
INSERT INTO phrases (lesson_id, english, hindi, pronunciation_guide) VALUES
  ('cccccccc-cccc-cccc-cccc-000000000044', 'I am writing to follow up.', 'Main follow up ke liye likh raha hoon.', 'I | am | writ-ing | to | fol-low | up'),
  ('cccccccc-cccc-cccc-cccc-000000000044', 'Please find the file attached.', 'File attach kar di hai.', 'Please | find | the | file | at-tached'),
  ('cccccccc-cccc-cccc-cccc-000000000044', 'Let me know your thoughts.', 'Apni rai bata dijiye.', 'Let | me | know | your | thoughts'),
  ('cccccccc-cccc-cccc-cccc-000000000044', 'I look forward to your reply.', 'Aapke jawab ka intezaar rahega.', 'I | look | for-ward | to | your | re-ply'),
  ('cccccccc-cccc-cccc-cccc-000000000044', 'Thank you for your time.', 'Aapke samay ke liye shukriya.', 'Thank | you | for | your | time');

-- 45: Salary Discussion
INSERT INTO phrases (lesson_id, english, hindi, pronunciation_guide) VALUES
  ('cccccccc-cccc-cccc-cccc-000000000045', 'I would like to discuss my salary.', 'Main apni salary par baat karna chahta hoon.', 'I | would | like | to | dis-cuss | my | sal-a-ry'),
  ('cccccccc-cccc-cccc-cccc-000000000045', 'I have taken on more responsibility.', 'Maine zyada zimmedari li hai.', 'I | have | tak-en | on | more | re-spon-si-bil-i-ty'),
  ('cccccccc-cccc-cccc-cccc-000000000045', 'I believe I deserve a raise.', 'Mujhe lagta hai mujhe increment milna chahiye.', 'I | be-lieve | I | de-serve | a | raise'),
  ('cccccccc-cccc-cccc-cccc-000000000045', 'What are the chances of a promotion?', 'Promotion ke kya chances hain?', 'What | are | the | chanc-es | of | a | pro-mo-tion'),
  ('cccccccc-cccc-cccc-cccc-000000000045', 'I am open to your suggestions.', 'Main aapke sujhaav ke liye taiyar hoon.', 'I | am | o-pen | to | your | sug-ges-tions');
