/*
  # Seed Default Onboarding Tasks

  1. Default Tasks
    - Creates a comprehensive 30-day onboarding program
    - Tasks are distributed across different categories:
      - Welcome and orientation (Days 1-3)
      - Company culture and policies (Days 4-7)
      - Role-specific training (Days 8-15)
      - Team integration (Days 16-22)
      - Project involvement (Days 23-28)
      - Review and feedback (Days 29-30)

  2. Task Categories
    - Administrative tasks
    - Training and learning
    - Social integration
    - Performance setup
*/

-- Insert default onboarding tasks
INSERT INTO tasks (title, description, day_number, is_active) VALUES
  -- Week 1: Welcome and Orientation
  ('Welcome Meeting', 'Meet with your manager for a welcome session and initial orientation', 1, true),
  ('Complete IT Setup', 'Set up your workstation, accounts, and necessary software tools', 1, true),
  ('Review Company Handbook', 'Read through the employee handbook and company policies', 2, true),
  ('Office Tour', 'Take a guided tour of the office facilities and meet key personnel', 2, true),
  ('HR Documentation', 'Complete all required HR forms and documentation', 3, true),
  
  -- Week 2: Company Culture and Policies
  ('Company Culture Session', 'Attend a session about company values, mission, and culture', 4, true),
  ('Safety Training', 'Complete workplace safety and emergency procedures training', 5, true),
  ('Benefits Overview', 'Review health benefits, retirement plans, and other employee benefits', 6, true),
  ('Code of Conduct Training', 'Complete training on company code of conduct and ethics', 7, true),
  
  -- Week 3: Role-Specific Training
  ('Job Role Deep Dive', 'Detailed discussion about your role, responsibilities, and expectations', 8, true),
  ('Department Introduction', 'Meet your department team and understand team dynamics', 9, true),
  ('Tools and Systems Training', 'Learn about job-specific tools, software, and systems', 10, true),
  ('First Project Assignment', 'Receive and understand your first project or assignment', 11, true),
  ('Mentor Assignment', 'Meet with your assigned mentor and establish regular check-ins', 12, true),
  ('Skills Assessment', 'Complete assessment to identify training needs and strengths', 13, true),
  ('Training Plan Review', 'Review your personalized training and development plan', 14, true),
  
  -- Week 4: Team Integration
  ('Team Lunch', 'Join team for lunch to build relationships and network', 15, true),
  ('Cross-functional Meetings', 'Attend meetings with other departments you will work with', 16, true),
  ('Shadow Experienced Colleague', 'Spend time observing and learning from an experienced team member', 17, true),
  ('First Team Presentation', 'Give a brief presentation about yourself to the team', 18, true),
  ('Feedback Session 1', 'First formal feedback session with your manager', 19, true),
  ('Process Documentation Review', 'Study important processes and procedures for your role', 20, true),
  ('Client/Customer Introduction', 'Learn about key clients or customers (if applicable)', 21, true),
  
  -- Week 5: Project Involvement
  ('Project Planning Session', 'Participate in planning for upcoming projects', 22, true),
  ('Quality Standards Training', 'Learn about quality standards and best practices', 23, true),
  ('Independent Task Completion', 'Complete your first independent task or mini-project', 24, true),
  ('Collaboration Exercise', 'Work on a collaborative task with team members', 25, true),
  ('Professional Development Discussion', 'Discuss career goals and development opportunities', 26, true),
  ('Performance Metrics Review', 'Understand how your performance will be measured', 27, true),
  
  -- Final Week: Review and Completion
  ('Feedback Session 2', 'Second formal feedback session and progress review', 28, true),
  ('Knowledge Check', 'Complete a comprehensive review of what you have learned', 29, true),
  ('Onboarding Review Form', 'Complete the final onboarding feedback and review form', 30, true);