-- 007_expanded_curriculum.sql

-- Insert 15 New Lessons (Orders 11 to 25)
INSERT INTO lessons (id, title, situation, hindi_description, difficulty, category, order_num, duration_mins) VALUES
  ('bbbbbbbb-1111-1111-1111-111111111111', 'Kitchen Help', 'At home in the kitchen', 'Rasoi mein madad karna', 'BEGINNER', 'Daily Life', 11, 6),
  ('bbbbbbbb-2222-2222-2222-222222222222', 'Morning Routine', 'Starting your day', 'Subah ki shuruvaat', 'BEGINNER', 'Daily Life', 12, 5),
  ('bbbbbbbb-3333-3333-3333-333333333333', 'Calling a Plumber', 'Fixing a leak at home', 'Plumber ko bulana', 'BEGINNER', 'Daily Life', 13, 7),
  ('bbbbbbbb-4444-4444-4444-444444444444', 'Welcoming Guests', 'Guests visiting your home', 'Mehmanon ka swagat', 'BEGINNER', 'Daily Life', 14, 8),
  ('bbbbbbbb-5555-5555-5555-555555555555', 'Cleaning Day', 'Cleaning the house', 'Ghar ki safai', 'BEGINNER', 'Daily Life', 15, 6),
  ('bbbbbbbb-6666-6666-6666-666666666666', 'Vegetable Market', 'Buying veggies from a vendor', 'Sabzi mandi mein baat-cheet', 'BEGINNER', 'Daily Life', 16, 8),
  ('bbbbbbbb-7777-7777-7777-777777777777', 'At the Bank', 'Opening an account or withdrawal', 'Bank mein kaam', 'INTERMEDIATE', 'Daily Life', 17, 10),
  ('bbbbbbbb-8888-8888-8888-888888888888', 'Parent-Teacher Meeting', 'Discussing child progress', 'School mein meeting', 'INTERMEDIATE', 'Daily Life', 18, 12),
  ('bbbbbbbb-9999-9999-9999-999911111111', 'Booking Gas', 'Refilling gas cylinder', 'Gas cylinder book karna', 'BEGINNER', 'Daily Life', 19, 5),
  ('bbbbbbbb-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Post Office', 'Sending a parcel', 'Dak khane mein kaam', 'BEGINNER', 'Daily Life', 20, 7),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Presenting an Idea', 'At the office meeting', 'Office mein apna idea dena', 'ADVANCED', 'Work', 21, 15),
  ('bbbbbbbb-cccc-cccc-cccc-cccccccccccc', 'Disagreeing Politely', 'Professional debate', 'Shishtata se asahmat hona', 'ADVANCED', 'Work', 22, 12),
  ('bbbbbbbb-dddd-dddd-dddd-dddddddddddd', 'Asking for Leave', 'Requesting time off', 'Chhutti ke liye poochna', 'ADVANCED', 'Work', 23, 10),
  ('bbbbbbbb-eeee-eeee-eeee-eeeeeeeeeeee', 'Networking', 'Meeting professionals at a party', 'Naye logon se milna', 'ADVANCED', 'Work', 24, 15),
  ('bbbbbbbb-ffff-ffff-ffff-ffffffffffff', 'Discussing a Movie', 'Talking about a film', 'Film ke baare mein baat karna', 'INTERMEDIATE', 'Daily Life', 25, 9);

-- Phrases for Lesson 11: Kitchen Help
INSERT INTO phrases (lesson_id, english, hindi, pronunciation_guide) VALUES
  ('bbbbbbbb-1111-1111-1111-111111111111', 'Is the tea ready?', 'Kya chai taiyar hai?', 'Is | the | tea | read-y'),
  ('bbbbbbbb-1111-1111-1111-111111111111', 'Pass me the salt, please.', 'Namak dena zara.', 'Pass | me | the | salt | please'),
  ('bbbbbbbb-1111-1111-1111-111111111111', 'What is for breakfast?', 'Nashte mein kya hai?', 'What | is | for | break-fast'),
  ('bbbbbbbb-1111-1111-1111-111111111111', 'Don''t overcook the vegetables.', 'Sabzi ko zyada mat pakana.', 'Don''t | o-ver-cook | the | veg-e-ta-bles'),
  ('bbbbbbbb-1111-1111-1111-111111111111', 'I will help with the dishes.', 'Main bartan dhone mein madad karunga.', 'I | will | help | with | the | dish-es');

-- Phrases for Lesson 12: Morning Routine
INSERT INTO phrases (lesson_id, english, hindi, pronunciation_guide) VALUES
  ('bbbbbbbb-2222-2222-2222-222222222222', 'Wake up, it''s 7 AM.', 'Uth jao, subah ke saath baj gaye hain.', 'Wake | up | it''s | sev-en | AM'),
  ('bbbbbbbb-2222-2222-2222-222222222222', 'I am going to take a shower.', 'Main nahaane ja raha hoon.', 'I | am | go-ing | to | take | a | show-er'),
  ('bbbbbbbb-2222-2222-2222-222222222222', 'Where is my towel?', 'Mera towel kahan hai?', 'Where | is | my | tow-el'),
  ('bbbbbbbb-2222-2222-2222-222222222222', 'I need to iron my clothes.', 'Mujhe apne kapde iron karne hain.', 'I | need | to | i-ron | my | clothes'),
  ('bbbbbbbb-2222-2222-2222-222222222222', 'Let''s have breakfast together.', 'Chalo saath mein nashta karte hain.', 'Let''s | have | break-fast | to-geth-er');

-- Phrases for Lesson 13: Calling a Plumber
INSERT INTO phrases (lesson_id, english, hindi, pronunciation_guide) VALUES
  ('bbbbbbbb-3333-3333-3333-333333333333', 'The tap in the kitchen is leaking.', 'Kitchen ka nall leak kar raha hai.', 'The | tap | in | the | kitch-en | is | leak-ing'),
  ('bbbbbbbb-3333-3333-3333-333333333333', 'Can you come and fix it?', 'Kya aap aakar ise theek kar sakte hain?', 'Can | you | come | and | fix | it'),
  ('bbbbbbbb-3333-3333-3333-333333333333', 'When will you be here?', 'Aap kab tak pahunchenge?', 'When | will | you | be | here'),
  ('bbbbbbbb-3333-3333-3333-333333333333', 'How much will you charge?', 'Aap kitne paise lenge?', 'How | much | will | you | charge'),
  ('bbbbbbbb-3333-3333-3333-333333333333', 'Thank you for the quick service.', 'Jaldi aane ke liye shukriya.', 'Thank | you | for | the | quick | ser-vice');

-- Phrases for Lesson 14: Welcoming Guests
INSERT INTO phrases (lesson_id, english, hindi, pronunciation_guide) VALUES
  ('bbbbbbbb-4444-4444-4444-444444444444', 'Please come in.', 'Andar aaiye.', 'Please | come | in'),
  ('bbbbbbbb-4444-4444-4444-444444444444', 'Please have a seat.', 'Baithiye.', 'Please | have | a | seat'),
  ('bbbbbbbb-4444-4444-4444-444444444444', 'Would you like some tea or coffee?', 'Aap chai lenge ya coffee?', 'Would | you | like | some | tea | or | cof-fee'),
  ('bbbbbbbb-4444-4444-4444-444444444444', 'It''s good to see you after so long.', 'Aapse itne samay baad milkar khushi hui.', 'It''s | good | to | see | you | af-ter | so | long'),
  ('bbbbbbbb-4444-4444-4444-444444444444', 'Make yourself at home.', 'Ise apna hi ghar samjhein.', 'Make | your-self | at | home');

-- Phrases for Lesson 15: Cleaning Day
INSERT INTO phrases (lesson_id, english, hindi, pronunciation_guide) VALUES
  ('bbbbbbbb-5555-5555-5555-111111111111', 'We need to clean the house today.', 'Aaj humein ghar ki safai karni hai.', 'We | need | to | clean | the | house | to-day'),
  ('bbbbbbbb-5555-5555-5555-111111111111', 'Please dust the furniture.', 'Kapde se furniture saaf kar do.', 'Please | dust | the | fur-ni-ture'),
  ('bbbbbbbb-5555-5555-5555-111111111111', 'I will sweep the floor.', 'Main jhadu laga deta hoon.', 'I | will | sweep | the | floor'),
  ('bbbbbbbb-5555-5555-5555-111111111111', 'Where is the mop?', 'Pocha kahan hai?', 'Where | is | the | mop'),
  ('bbbbbbbb-5555-5555-5555-111111111111', 'The house looks very clean now.', 'Ghar ab bahut saaf lag raha hai.', 'The | house | looks | ve-ry | clean | now');

-- Phrases for Lesson 16: Vegetable Market
INSERT INTO phrases (lesson_id, english, hindi, pronunciation_guide) VALUES
  ('bbbbbbbb-6666-6666-6666-666666666666', 'What is the price of potatoes?', 'Aloo kya bhaav hain?', 'What | is | the | price | of | po-ta-toes'),
  ('bbbbbbbb-6666-6666-6666-666666666666', 'Give me one kilo of onions.', 'Ek kilo pyaaz de do.', 'Give | me | one | ki-lo | of | on-ions'),
  ('bbbbbbbb-6666-6666-6666-666666666666', 'Are these tomatoes fresh?', 'Kya yeh tamatar taaza hain?', 'Are | these | to-ma-toes | fresh'),
  ('bbbbbbbb-6666-6666-6666-666666666666', 'Make it a bit cheaper.', 'Thoda sasta lagao.', 'Make | it | a | bit | cheap-er'),
  ('bbbbbbbb-6666-6666-6666-666666666666', 'Put them in a bag, please.', 'Inhe thaili mein daal do.', 'Put | them | in | a | bag | please');

-- Phrases for Lesson 17: At the Bank
INSERT INTO phrases (lesson_id, english, hindi, pronunciation_guide) VALUES
  ('bbbbbbbb-7777-7777-7777-777777777777', 'I want to open a new savings account.', 'Main ek naya savings account kholna chahta hoon.', 'I | want | to | o-pen | a | new | sav-ings | ac-count'),
  ('bbbbbbbb-7777-7777-7777-777777777777', 'What documents do I need?', 'Mujhe kaunse documents chahiye?', 'What | doc-u-ments | do | I | need'),
  ('bbbbbbbb-7777-7777-7777-777777777777', 'I want to withdraw ten thousand rupees.', 'Mujhe das hazaar rupaye nikaalne hain.', 'I | want | to | with-draw | ten | thou-sand | ru-pees'),
  ('bbbbbbbb-7777-7777-7777-777777777777', 'Where should I sign?', 'Mujhe kahan sign karna hai?', 'Where | should | I | sign'),
  ('bbbbbbbb-7777-7777-7777-777777777777', 'The ATM is not working.', 'ATM kaam nahi kar raha hai.', 'The | ATM | is | not | work-ing');

-- Phrases for Lesson 18: Parent-Teacher Meeting
INSERT INTO phrases (lesson_id, english, hindi, pronunciation_guide) VALUES
  ('bbbbbbbb-8888-8888-8888-888888888888', 'How is my child performing in class?', 'Mera baccha class mein kaisa kar raha hai?', 'How | is | my | child | per-form-ing | in | class'),
  ('bbbbbbbb-8888-8888-8888-888888888888', 'He is very good at math.', 'Woh maths mein bahut achha hai.', 'He | is | ve-ry | good | at | math'),
  ('bbbbbbbb-8888-8888-8888-888888888888', 'He needs to focus more on English.', 'Use English par zyada dhyan dene ki zaroorat hai.', 'He | needs | to | fo-cus | more | on | Eng-lish'),
  ('bbbbbbbb-8888-8888-8888-888888888888', 'When is the next exam?', 'Agla exam kab hai?', 'When | is | the | next | ex-am'),
  ('bbbbbbbb-8888-8888-8888-888888888888', 'Thank you for your feedback.', 'Aapki jaankari ke liye shukriya.', 'Thank | you | for | your | feed-back');

-- Phrases for Lesson 19: Booking a Gas Cylinder
INSERT INTO phrases (lesson_id, english, hindi, pronunciation_guide) VALUES
  ('bbbbbbbb-9999-9999-9999-999911111111', 'I want to book a gas refill.', 'Mujhe gas refill book karna hai.', 'I | want | to | book | a | gas | re-fill'),
  ('bbbbbbbb-9999-9999-9999-999911111111', 'My consumer number is 12345.', 'Mera consumer number 12345 hai.', 'My | con-sum-er | num-ber | is | one | two | three | four | five'),
  ('bbbbbbbb-9999-9999-9999-999911111111', 'When will the delivery be made?', 'Delivery kab tak hogi?', 'When | will | the | de-liv-er-y | be | made'),
  ('bbbbbbbb-9999-9999-9999-999911111111', 'Can I pay online?', 'Kya main online payment kar sakta hoon?', 'Can | I | pay | on-line'),
  ('bbbbbbbb-9999-9999-9999-999911111111', 'The cylinder is empty.', 'Cylinder khaali ho gaya hai.', 'The | cyl-in-der | is | emp-ty');

-- Phrases for Lesson 20: Post Office
INSERT INTO phrases (lesson_id, english, hindi, pronunciation_guide) VALUES
  ('bbbbbbbb-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'I want to send this parcel to Mumbai.', 'Mujhe yeh parcel Mumbai bhejna hai.', 'I | want | to | send | this | par-cel | to | Mum-bai'),
  ('bbbbbbbb-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'How much is the postage?', 'Postage kitna lagega?', 'How | much | is | the | post-age'),
  ('bbbbbbbb-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Do you have stamps?', 'Kya aapke paas stamps hain?', 'Do | you | have | stamps'),
  ('bbbbbbbb-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'How many days will it take?', 'Kitne din lagenge?', 'How | ma-ny | days | will | it | take'),
  ('bbbbbbbb-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'I want to send it by speed post.', 'Mujhe ise speed post se bhejna hai.', 'I | want | to | send | it | by | speed | post');

-- Phrases for Lesson 21: Presenting an Idea
INSERT INTO phrases (lesson_id, english, hindi, pronunciation_guide) VALUES
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'I would like to propose a new plan.', 'Main ek naya plan pesh karna chahta hoon.', 'I | would | like | to | pro-pose | a | new | plan'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'This will help us save time.', 'Isse humein samay bachane mein madad milegi.', 'This | will | help | us | save | time'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'What are your thoughts on this?', 'Is par aapke kya vichaar hain?', 'What | are | your | thoughts | on | this'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Let''s look at the data.', 'Chalo data dekhte hain.', 'Let''s | look | at | the | da-ta'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Thank you for listening.', 'Sunne ke liye shukriya.', 'Thank | you | for | lis-ten-ing');

-- Phrases for Lesson 22: Disagreeing Politely
INSERT INTO phrases (lesson_id, english, hindi, pronunciation_guide) VALUES
  ('bbbbbbbb-cccc-cccc-cccc-cccccccccccc', 'I see your point, but I have a different opinion.', 'Main aapki baat samajhta hoon, par meri rai alag hai.', 'I | see | your | point | but | I | have | a | dif-fer-ent | o-pin-ion'),
  ('bbbbbbbb-cccc-cccc-cccc-cccccccccccc', 'I''m not sure if that''s the best way.', 'Mujhe yakeen nahi hai ki yeh sabse achha tareeka hai.', 'I''m | not | sure | if | that''s | the | best | way'),
  ('bbbbbbbb-cccc-cccc-cccc-cccccccccccc', 'Could we consider another option?', 'Kya hum kisi aur option par gaur kar sakte hain?', 'Could | we | con-sid-er | an-oth-er | op-tion'),
  ('bbbbbbbb-cccc-cccc-cccc-cccccccccccc', 'I respectfully disagree.', 'Main aadar ke saath asahmat hoon.', 'I | re-spect-ful-ly | dis-a-gree'),
  ('bbbbbbbb-cccc-cccc-cccc-cccccccccccc', 'Let''s find a middle ground.', 'Chalo koi beech ka raasta nikaalte hain.', 'Let''s | find | a | mid-dle | ground');

-- Phrases for Lesson 23: Asking for Leave
INSERT INTO phrases (lesson_id, english, hindi, pronunciation_guide) VALUES
  ('bbbbbbbb-dddd-dddd-dddd-dddddddddddd', 'I would like to request leave for two days.', 'Main do din ki chhutti maangna chahta hoon.', 'I | would | like | to | re-quest | leave | for | two | days'),
  ('bbbbbbbb-dddd-dddd-dddd-dddddddddddd', 'I have some personal work to attend to.', 'Mujhe kuch zaroori kaam hai.', 'I | have | some | per-son-al | work | to | at-tend | to'),
  ('bbbbbbbb-dddd-dddd-dddd-dddddddddddd', 'I have completed all my pending tasks.', 'Maine apne saare pending kaam khatam kar diye hain.', 'I | have | com-plet-ed | all | my | pend-ing | tasks'),
  ('bbbbbbbb-dddd-dddd-dddd-dddddddddddd', 'Who will handle my responsibilities?', 'Meri zimmedariyan kaun sambhalega?', 'Who | will | han-dle | my | re-spon-si-bil-i-ties'),
  ('bbbbbbbb-dddd-dddd-dddd-dddddddddddd', 'I will be back on Wednesday.', 'Main Wednesday ko wapas aa jaunga.', 'I | will | be | back | on | Wed-nes-day');

-- Phrases for Lesson 24: Networking
INSERT INTO phrases (lesson_id, english, hindi, pronunciation_guide) VALUES
  ('bbbbbbbb-eeee-eeee-eeee-eeeeeeeeeeee', 'Hi, I don''t think we''ve met before.', 'Hi, mujhe nahi lagta hum pehle mile hain.', 'Hi | I | don''t | think | we''ve | met | be-fore'),
  ('bbbbbbbb-eeee-eeee-eeee-eeeeeeeeeeee', 'What brings you here tonight?', 'Aapka yahan kaise aana hua?', 'What | brings | you | here | to-night'),
  ('bbbbbbbb-eeee-eeee-eeee-eeeeeeeeeeee', 'I really like the music here.', 'Mujhe yahan ka music bahut pasand aa raha hai.', 'I | real-ly | like | the | mu-sic | here'),
  ('bbbbbbbb-eeee-eeee-eeee-eeeeeeeeeeee', 'It was a pleasure talking to you.', 'Aapse baat karke khushi hui.', 'It | was | a | plea-sure | talk-ing | to | you'),
  ('bbbbbbbb-eeee-eeee-eeee-eeeeeeeeeeee', 'Here is my business card.', 'Yeh lijiye mera business card.', 'Here | is | my | busi-ness | card');

-- Phrases for Lesson 25: Discussing a Movie
INSERT INTO phrases (lesson_id, english, hindi, pronunciation_guide) VALUES
  ('bbbbbbbb-ffff-ffff-ffff-ffffffffffff', 'Have you seen the latest blockbuster?', 'Kya aapne latest hit film dekhi hai?', 'Have | you | seen | the | lat-est | block-bus-ter'),
  ('bbbbbbbb-ffff-ffff-ffff-ffffffffffff', 'The acting was superb.', 'Acting bahut zabardast thi.', 'The | act-ing | was | su-perb'),
  ('bbbbbbbb-ffff-ffff-ffff-ffffffffffff', 'I didn''t like the ending.', 'Mujhe ending pasand nahi aayi.', 'I | didn''t | like | the | end-ing'),
  ('bbbbbbbb-ffff-ffff-ffff-ffffffffffff', 'Who was your favorite character?', 'Aapka favorite character kaun tha?', 'Who | was | your | fa-vor-ite | char-ac-ter'),
  ('bbbbbbbb-ffff-ffff-ffff-ffffffffffff', 'I would highly recommend it.', 'Main ise zaroor dekhne ki salaah dunga.', 'I | would | high-ly | rec-om-mend | it');
