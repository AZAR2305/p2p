-- Seed initial skills for the platform

INSERT INTO skills (name, category, description) VALUES
-- Programming & Tech
('JavaScript', 'Programming', 'Modern web development with JavaScript, including ES6+ features, async programming, and DOM manipulation'),
('Python', 'Programming', 'Python programming for data science, web development, automation, and general-purpose coding'),
('React', 'Programming', 'Building modern user interfaces with React, hooks, state management, and best practices'),
('TypeScript', 'Programming', 'Strongly-typed JavaScript for scalable applications and better developer experience'),
('Node.js', 'Programming', 'Server-side JavaScript with Node.js, Express, APIs, and backend development'),
('SQL', 'Programming', 'Database design, queries, and management with SQL and relational databases'),
('Data Science', 'Programming', 'Data analysis, visualization, and machine learning fundamentals'),
('Web Development', 'Programming', 'Full-stack web development including HTML, CSS, JavaScript, and modern frameworks'),

-- Languages
('Spanish', 'Languages', 'Conversational and written Spanish for all levels, from beginner to advanced'),
('French', 'Languages', 'Learn French pronunciation, grammar, and conversation skills'),
('Mandarin Chinese', 'Languages', 'Mandarin Chinese for beginners and intermediate learners'),
('German', 'Languages', 'German language skills for travel, business, or personal growth'),
('Japanese', 'Languages', 'Japanese language and culture, including reading and writing systems'),
('English', 'Languages', 'English as a second language, academic writing, and conversation practice'),

-- Music
('Piano', 'Music', 'Piano lessons for beginners to advanced players, classical and contemporary'),
('Guitar', 'Music', 'Acoustic and electric guitar, chords, scales, and song learning'),
('Music Theory', 'Music', 'Understanding music fundamentals, composition, and arrangement'),
('Singing', 'Music', 'Vocal training, breathing techniques, and performance skills'),
('Music Production', 'Music', 'Digital audio workstations, mixing, mastering, and beat making'),

-- Academic
('Mathematics', 'Academic', 'Algebra, calculus, statistics, and problem-solving techniques'),
('Physics', 'Academic', 'Classical mechanics, electromagnetism, and modern physics concepts'),
('Chemistry', 'Academic', 'General, organic, and analytical chemistry tutoring'),
('Biology', 'Academic', 'Cell biology, genetics, ecology, and anatomy'),
('Essay Writing', 'Academic', 'Academic writing, research papers, and thesis development'),
('SAT/ACT Prep', 'Academic', 'Standardized test preparation and strategies'),

-- Business & Finance
('Financial Planning', 'Business', 'Personal finance, budgeting, investments, and retirement planning'),
('Marketing', 'Business', 'Digital marketing, social media, content strategy, and branding'),
('Entrepreneurship', 'Business', 'Starting a business, business plans, and startup fundamentals'),
('Public Speaking', 'Business', 'Presentation skills, confidence building, and effective communication'),
('Excel', 'Business', 'Advanced spreadsheet skills, formulas, pivot tables, and data analysis'),

-- Creative
('Photography', 'Creative', 'Camera basics, composition, lighting, and photo editing'),
('Graphic Design', 'Creative', 'Visual design principles, Adobe Creative Suite, and branding'),
('Video Editing', 'Creative', 'Video production, editing software, and storytelling'),
('Drawing', 'Creative', 'Sketching, illustration, and various artistic techniques'),
('UI/UX Design', 'Creative', 'User interface and experience design for digital products'),

-- Lifestyle
('Fitness Training', 'Lifestyle', 'Workout plans, nutrition basics, and exercise techniques'),
('Cooking', 'Lifestyle', 'Culinary skills, recipes, and food preparation'),
('Yoga', 'Lifestyle', 'Yoga poses, breathing exercises, and mindfulness'),
('Chess', 'Lifestyle', 'Chess strategy, tactics, and game analysis')

ON CONFLICT (name) DO NOTHING;
