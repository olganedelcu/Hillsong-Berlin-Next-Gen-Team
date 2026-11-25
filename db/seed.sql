-- Dummy content. Create the dummy account first (Supabase > Authentication > Add user),
-- then replace the email below and run this file.
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin' FROM auth.users WHERE email = 'team@example.com'
ON CONFLICT DO NOTHING;

INSERT INTO public.lessons (group_slug, lesson_date, title_en, title_de, verses_en, verses_de, idea_en, idea_de, story_en, story_de, questions_en, questions_de, published) VALUES
('cubby-house','2026-11-29','Hope Is Coming','Die Hoffnung kommt','Isaiah 9:6','Jesaja 9,6',
 'Jesus is the King God promised! Advent means we get ready for Him.','Jesus ist der König, den Gott versprochen hat! Advent heißt: Wir bereiten uns auf ihn vor.',
 'Long ago, God promised to send a special King. We light the first candle to remember that Jesus is coming!','Vor langer Zeit versprach Gott, einen besonderen König zu senden. Wir zünden die erste Kerze an und erinnern uns: Jesus kommt!',
 ARRAY['God keeps His promises → We can trust Him.','Light a candle (or pretend!) and say: Jesus is coming!'],ARRAY['Gott hält seine Versprechen → Wir können ihm vertrauen.','Zündet eine Kerze an (oder tut so!) und sagt: Jesus kommt!'],true),
('fun-house','2026-11-29','Hope Is Coming','Die Hoffnung kommt','Isaiah 9:6','Jesaja 9,6',
 'Jesus is the promised King, and He is worth waiting for.','Jesus ist der versprochene König, und es lohnt sich, auf ihn zu warten.',
 'Hundreds of years before Jesus was born, the prophet Isaiah told God''s people that a Savior would come.','Hunderte Jahre vor Jesu Geburt sagte der Prophet Jesaja Gottes Volk, dass ein Retter kommen würde.',
 ARRAY['What is something you love waiting for?','Why do you think God told His people ahead of time?'],ARRAY['Worauf wartest du besonders gern?','Warum hat Gott seinem Volk schon vorher Bescheid gesagt?'],true);

INSERT INTO public.events (event_date, event_time, title_en, title_de, description_en, description_de, location, groups) VALUES
('2026-12-20','','Christmas Sunday','Weihnachtssonntag','A special Sunday celebrating the birth of Jesus.','Ein besonderer Sonntag zur Feier der Geburt Jesu.','Berlin','{cubby-house,fun-house,voltage,fuel}');
