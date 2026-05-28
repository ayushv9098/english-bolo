-- Clear existing data
TRUNCATE TABLE phrases CASCADE;
TRUNCATE TABLE lessons CASCADE;

-- Insert 10 Lessons
INSERT INTO lessons (id, title, situation, hindi_description, difficulty, category, order_num, duration_mins) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Ordering Chai', 'At a local tea stall', 'Chai order karna', 'BEGINNER', 'Daily Life', 1, 5),
  ('22222222-2222-2222-2222-222222222222', 'Self Introduction', 'Meeting someone new', 'Apne baare mein batana', 'BEGINNER', 'Daily Life', 2, 8),
  ('33333333-3333-3333-3333-333333333333', 'Asking Directions', 'Lost in the city', 'Rasta poochna', 'BEGINNER', 'Travel', 3, 6),
  ('44444444-4444-4444-4444-444444444444', 'Job Interview', 'First round HR interview', 'Interview ki shuruvaat', 'INTERMEDIATE', 'Work', 4, 12),
  ('55555555-5555-5555-5555-555555555555', 'At Doctor', 'Feeling unwell', 'Doctor ko bimari batana', 'INTERMEDIATE', 'Daily Life', 5, 10),
  ('66666666-6666-6666-6666-666666666666', 'Shopping', 'Buying clothes at a mall', 'Dukaan par mol-bhav', 'BEGINNER', 'Daily Life', 6, 7),
  ('77777777-7777-7777-7777-777777777777', 'Phone Call', 'Calling a service center', 'Phone par baat karna', 'INTERMEDIATE', 'Work', 7, 9),
  ('88888888-8888-8888-8888-888888888888', 'Restaurant', 'Ordering dinner', 'Khana order karna', 'INTERMEDIATE', 'Daily Life', 8, 10),
  ('99999999-9999-9999-9999-999999999999', 'Making Friends', 'Social gathering', 'Naye dost banana', 'BEGINNER', 'Daily Life', 9, 8),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Travel', 'At the railway station', 'Train ke baare mein poochna', 'INTERMEDIATE', 'Travel', 10, 11);

-- Insert Phrases for Lesson 1: Ordering Chai
INSERT INTO phrases (lesson_id, english, hindi, pronunciation_guide) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Can I have one cutting chai, please?', 'Ek cutting chai milegi?', 'Can | I | have | one | cut-ting | chai | please'),
  ('11111111-1111-1111-1111-111111111111', 'Make it strong.', 'Kadak banana.', 'Make | it | strong'),
  ('11111111-1111-1111-1111-111111111111', 'With less sugar.', 'Cheeni kam daalna.', 'With | less | su-gar'),
  ('11111111-1111-1111-1111-111111111111', 'How much for this?', 'Yeh kitne ka hai?', 'How | much | for | this'),
  ('11111111-1111-1111-1111-111111111111', 'Here is the money.', 'Yeh lijiye paise.', 'Here | is | the | mon-ey');

-- Insert Phrases for Lesson 2: Self Introduction
INSERT INTO phrases (lesson_id, english, hindi, pronunciation_guide) VALUES
  ('22222222-2222-2222-2222-222222222222', 'Hi, my name is Rahul.', 'Namaste, mera naam Rahul hai.', 'Hi | my | name | is | Ra-hul'),
  ('22222222-2222-2222-2222-222222222222', 'I am from Delhi.', 'Main Delhi se hoon.', 'I | am | from | Del-hi'),
  ('22222222-2222-2222-2222-222222222222', 'I work as a software engineer.', 'Main software engineer hoon.', 'I | work | as | a | soft-ware | en-gi-neer'),
  ('22222222-2222-2222-2222-222222222222', 'Nice to meet you.', 'Aapse milkar achha laga.', 'Nice | to | meet | you'),
  ('22222222-2222-2222-2222-222222222222', 'How about you?', 'Aapke baare mein batayein?', 'How | a-bout | you');

-- Insert Phrases for Lesson 3: Asking Directions
INSERT INTO phrases (lesson_id, english, hindi, pronunciation_guide) VALUES
  ('33333333-3333-3333-3333-333333333333', 'Excuse me, where is the nearest metro station?', 'Suniye, sabse paas metro station kahan hai?', 'Ex-cuse | me | where | is | the | near-est | me-tro | sta-tion'),
  ('33333333-3333-3333-3333-333333333333', 'Go straight and turn left.', 'Seedhe jaakar left mudiye.', 'Go | straight | and | turn | left'),
  ('33333333-3333-3333-3333-333333333333', 'Is it far from here?', 'Kya yeh yahan se door hai?', 'Is | it | far | from | here'),
  ('33333333-3333-3333-3333-333333333333', 'It will take five minutes.', 'Paanch minute lagenge.', 'It | will | take | five | min-utes'),
  ('33333333-3333-3333-3333-333333333333', 'Thank you for your help.', 'Madad ke liye shukriya.', 'Thank | you | for | your | help');

-- Insert Phrases for Lesson 4: Job Interview
INSERT INTO phrases (lesson_id, english, hindi, pronunciation_guide) VALUES
  ('44444444-4444-4444-4444-444444444444', 'Tell me about yourself.', 'Apne baare mein bataiye.', 'Tell | me | a-bout | your-self'),
  ('44444444-4444-4444-4444-444444444444', 'I have three years of experience.', 'Mujhe teen saal ka experience hai.', 'I | have | three | years | of | ex-pe-ri-ence'),
  ('44444444-4444-4444-4444-444444444444', 'What are your strengths?', 'Aapki taaqat kya hai?', 'What | are | your | strengths'),
  ('44444444-4444-4444-4444-444444444444', 'I am a fast learner.', 'Main jaldi seekhta hoon.', 'I | am | a | fast | learn-er'),
  ('44444444-4444-4444-4444-444444444444', 'Why should we hire you?', 'Hum aapko kyun hire karein?', 'Why | should | we | hire | you');

-- Insert Phrases for Lesson 5: At Doctor
INSERT INTO phrases (lesson_id, english, hindi, pronunciation_guide) VALUES
  ('55555555-5555-5555-5555-555555555555', 'I have a headache since yesterday.', 'Mujhe kal se sar dard hai.', 'I | have | a | head-ache | since | yes-ter-day'),
  ('55555555-5555-5555-5555-555555555555', 'Do you have fever?', 'Kya aapko bukhar hai?', 'Do | you | have | fe-ver'),
  ('55555555-5555-5555-5555-555555555555', 'Take this medicine twice a day.', 'Yeh dawa din mein do baar lein.', 'Take | this | med-i-cine | twice | a | day'),
  ('55555555-5555-5555-5555-555555555555', 'Drink plenty of water.', 'Khub paani piyein.', 'Drink | plen-ty | of | wa-ter'),
  ('55555555-5555-5555-5555-555555555555', 'I feel much better now.', 'Ab mujhe behtar lag raha hai.', 'I | feel | much | bet-ter | now');

-- Insert Phrases for Lesson 6: Shopping
INSERT INTO phrases (lesson_id, english, hindi, pronunciation_guide) VALUES
  ('66666666-6666-6666-6666-666666666666', 'How much does this cost?', 'Yeh kitne ka hai?', 'How | much | does | this | cost'),
  ('66666666-6666-6666-6666-666666666666', 'Can you give a discount?', 'Kya thoda discount milega?', 'Can | you | give | a | dis-count'),
  ('66666666-6666-6666-6666-666666666666', 'Do you have this in a larger size?', 'Kya isme bada size hai?', 'Do | you | have | this | in | a | larg-er | size'),
  ('66666666-6666-6666-6666-666666666666', 'I will take this one.', 'Main yeh wala lunga.', 'I | will | take | this | one'),
  ('66666666-6666-6666-6666-666666666666', 'Do you accept cards?', 'Kya aap card lete hain?', 'Do | you | ac-cept | cards');

-- Insert Phrases for Lesson 7: Phone Call
INSERT INTO phrases (lesson_id, english, hindi, pronunciation_guide) VALUES
  ('77777777-7777-7777-7777-777777777777', 'Hello, may I speak to Mr. Sharma?', 'Hello, kya meri baat Mr. Sharma se ho sakti hai?', 'Hel-lo | may | I | speak | to | Mr | Shar-ma'),
  ('77777777-7777-7777-7777-777777777777', 'He is not available right now.', 'Woh abhi yahan nahi hain.', 'He | is | not | a-vail-a-ble | right | now'),
  ('77777777-7777-7777-7777-777777777777', 'Can I leave a message?', 'Kya main message chhod sakta hoon?', 'Can | I | leave | a | mes-sage'),
  ('77777777-7777-7777-7777-777777777777', 'Please tell him to call me back.', 'Unse kehna mujhe call karein.', 'Please | tell | him | to | call | me | back'),
  ('77777777-7777-7777-7777-777777777777', 'Thank you, I will call later.', 'Shukriya, main baad mein call karunga.', 'Thank | you | I | will | call | la-ter');

-- Insert Phrases for Lesson 8: Restaurant
INSERT INTO phrases (lesson_id, english, hindi, pronunciation_guide) VALUES
  ('88888888-8888-8888-8888-888888888888', 'Can I see the menu, please?', 'Kya main menu dekh sakta hoon?', 'Can | I | see | the | me-nu | please'),
  ('88888888-8888-8888-8888-888888888888', 'What is the special today?', 'Aaj special kya hai?', 'What | is | the | spe-cial | to-day'),
  ('88888888-8888-8888-8888-888888888888', 'I would like to order paneer tikka.', 'Main paneer tikka order karna chahunga.', 'I | would | like | to | or-der | pa-neer | tik-ka'),
  ('88888888-8888-8888-8888-888888888888', 'Is the food very spicy?', 'Kya khana zyada teekha hai?', 'Is | the | food | ve-ry | spi-cy'),
  ('88888888-8888-8888-8888-888888888888', 'Could we get the bill?', 'Kya bill mil sakta hai?', 'Could | we | get | the | bill');

-- Insert Phrases for Lesson 9: Making Friends
INSERT INTO phrases (lesson_id, english, hindi, pronunciation_guide) VALUES
  ('99999999-9999-9999-9999-999999999999', 'Nice to meet you.', 'Aapse milkar achha laga.', 'Nice | to | meet | you'),
  ('99999999-9999-9999-9999-999999999999', 'What do you do for fun?', 'Aap free time mein kya karte hain?', 'What | do | you | do | for | fun'),
  ('99999999-9999-9999-9999-999999999999', 'I love watching movies.', 'Mujhe movies dekhna pasand hai.', 'I | love | watch-ing | mo-vies'),
  ('99999999-9999-9999-9999-999999999999', 'We should hang out sometime.', 'Humein kabhi milna chahiye.', 'We | should | hang | out | some-time'),
  ('99999999-9999-9999-9999-999999999999', 'Can I get your number?', 'Kya mujhe aapka number mil sakta hai?', 'Can | I | get | your | num-ber');

-- Insert Phrases for Lesson 10: Travel
INSERT INTO phrases (lesson_id, english, hindi, pronunciation_guide) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Which platform does this train leave from?', 'Yeh train kis platform se jayegi?', 'Which | plat-form | does | this | train | leave | from'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'The train is running late.', 'Train late chal rahi hai.', 'The | train | is | run-ning | late'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Where is my seat?', 'Meri seat kahan hai?', 'Where | is | my | seat'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Could you please move your luggage?', 'Kya aap apna saamaan hata lenge?', 'Could | you | please | move | your | lug-gage'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'What time will we reach Mumbai?', 'Hum Mumbai kitne baje pahunchenge?', 'What | time | will | we | reach | Mum-bai');
