const OpenAI = require('openai');

class AIService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENROUTER_API_KEY,
      baseURL: process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1'
    });
    this.models = {
      kwaipilot: process.env.KWAIPILOT_MODEL, // kwaipilot/kat-coder-pro:free
      grok: process.env.GROK_MODEL            // x-ai/grok-4.1-fast:free
    };
    // Note: Embeddings may not be supported on all OpenRouter models
    this.embeddingModel = 'text-embedding-3-small';
  }

  // General chat method with model selection and reasoning support
  async chat({ messages, task = 'general', reasoning = false, reasoningDetails = [] }) {
    let model;
    let payload = { model, messages };

    if (task === 'coding') {
      model = this.models.kwaipilot;
      payload.model = model;
    } else if (task === 'recommendation' || task === 'research') {
      model = this.models.grok;
      payload.model = model;
      // Only add reasoning_details if present and non-empty
      if (reasoningDetails && reasoningDetails.length > 0) {
        payload.reasoning_details = reasoningDetails;
      }
      // If OpenAI API expects a boolean for 'reasoning', ensure it's a boolean, otherwise omit
      // Remove 'reasoning' if not required by OpenAI API spec
    } else {
      model = this.models.grok;
      payload.model = model;
    }

    const response = await this.openai.chat.completions.create(payload);
    return response;
  }

  // Generate study recommendations using Grok (recommendation task)
  async getStudyRecommendations(userId, courseId, userProgress) {
    try {
      const prompt = `
You are an expert learning advisor. Based on the following student information, provide 5 personalized study recommendations.

Student Progress: ${userProgress.completedLessons || 0}% complete
Recent Grades: ${userProgress.recentGrades?.join(', ') || 'No grades yet'}
Struggling Areas: ${userProgress.strugglingAreas?.join(', ') || 'None identified'}
Learning Pace: ${userProgress.pace || 'Normal'}

Provide recommendations in the following JSON format:
{
  "recommendations": [
    {
      "title": "Recommendation title",
      "description": "Brief description",
      "priority": "high|medium|low",
      "category": "study_habit|resource|practice|concept_review",
      "estimatedTime": "time in minutes"
    }
  ]
}
`;

      const response = await this.chat({
        messages: [
          {
            role: 'system',
            content: 'You are a helpful learning advisor specializing in personalized education.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        task: 'recommendation',
        reasoning: true
      });

      let parsed;
      try {
        parsed = JSON.parse(response.choices[0].message.content);
      } catch (e) {
        parsed = null;
      }
      // Defensive: If parsed is not an object or missing recommendations, use fallback
      let recommendationsArr = [];
      if (!parsed || !parsed.recommendations || !Array.isArray(parsed.recommendations)) {
        recommendationsArr = [
          {
            title: 'Stay Consistent',
            description: 'Set aside regular study time each day to build a habit.',
            priority: 'high',
            category: 'study_habit',
            estimatedTime: '30'
          },
          {
            title: 'Review Past Material',
            description: 'Go over previous lessons to reinforce your understanding.',
            priority: 'medium',
            category: 'concept_review',
            estimatedTime: '20'
          }
        ];
      } else {
        recommendationsArr = parsed.recommendations;
      }

      // Map recommendations into frontend structure
      const courses = recommendationsArr
        .filter(r => r.category === 'resource' || r.category === 'course')
        .map(r => ({ title: r.title, reason: r.description }));
      const books = recommendationsArr
        .filter(r => r.category === 'book' || r.title.toLowerCase().includes('book'))
        .map(r => r.title);
      const studyPlan = recommendationsArr
        .filter(r => r.category === 'study_habit' || r.category === 'concept_review' || r.category === 'practice')
        .map(r => `• ${r.title}: ${r.description} (${r.estimatedTime} min)`).join('\n');

      return {
        courses,
        books,
        studyPlan,
        recommendations: recommendationsArr
      };
    } catch (error) {
      console.error('AI study recommendations error:', error);
      // Fallback: Always return at least a default recommendation
      // Defensive fallback for error case
      const recommendationsArr = [
        {
          title: 'Stay Consistent',
          description: 'Set aside regular study time each day to build a habit.',
          priority: 'high',
          category: 'study_habit',
          estimatedTime: '30'
        },
        {
          title: 'Review Past Material',
          description: 'Go over previous lessons to reinforce your understanding.',
          priority: 'medium',
          category: 'concept_review',
          estimatedTime: '20'
        }
      ];
      return {
        courses: [],
        books: [],
        studyPlan: recommendationsArr
          .map(r => `• ${r.title}: ${r.description} (${r.estimatedTime} min)`).join('\n'),
        recommendations: recommendationsArr
      };
    }
  }

  // Generate resource recommendations using Grok (recommendation task)
  async getResourceRecommendations(courseTitle, courseDescription, currentTopic) {
    try {
      const prompt = `
You are an expert educator. Recommend 5 high-quality learning resources for a student studying:

Course: ${courseTitle}
Description: ${courseDescription}
Current Topic: ${currentTopic || 'General course content'}

Provide a mix of:
- Textbooks
- Online courses/tutorials
- YouTube channels
- Documentation
- Practice platforms

Return in JSON format:
{
  "resources": [
    {
      "title": "Resource title",
      "type": "textbook|video|course|documentation|practice",
      "author": "Author/Creator name",
      "url": "URL if available or 'Search online'",
      "description": "Why this resource is helpful",
      "difficulty": "beginner|intermediate|advanced",
      "isFree": true|false
    }
  ]
}
`;

      const response = await this.chat({
        messages: [
          {
            role: 'system',
            content: 'You are a knowledgeable education resource curator.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        task: 'recommendation',
        reasoning: true
      });

      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error('AI resource recommendations error:', error);
      throw new Error('Failed to generate resource recommendations');
    }
  }

  // Generate embeddings for content (may not be supported on OpenRouter free models)
  async generateEmbedding(text) {
    try {
      const response = await this.openai.embeddings.create({
        model: this.embeddingModel,
        input: text
      });

      return response.data[0].embedding;
    } catch (error) {
      console.error('Generate embedding error:', error);
      throw new Error('Failed to generate embedding');
    }
  }

  // Analyze student performance and provide insights using Grok
  async analyzePerformance(submissions, assignments) {
    try {
      const performanceData = submissions.map((sub, idx) => ({
        assignment: assignments[idx]?.title,
        score: sub.score,
        maxScore: assignments[idx]?.maxScore,
        isLate: sub.isLate,
        feedback: sub.feedback
      }));

      const prompt = `
Analyze the following student performance data and provide insights:

${JSON.stringify(performanceData, null, 2)}

Provide analysis in JSON format:
{
  "overallPerformance": "excellent|good|average|needs_improvement",
  "strengths": ["strength1", "strength2"],
  "weaknesses": ["weakness1", "weakness2"],
  "improvementAreas": ["area1", "area2"],
  "motivationalMessage": "Encouraging message for the student",
  "nextSteps": ["step1", "step2", "step3"]
}
`;

      const response = await this.chat({
        messages: [
          {
            role: 'system',
            content: 'You are an educational analyst providing constructive feedback.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        task: 'recommendation',
        reasoning: true
      });

      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error('AI performance analysis error:', error);
      throw new Error('Failed to analyze performance');
    }
  }

  // Auto-grade submission (assistant for tutors) using Kwaipilot (coding task)
  async preGradeSubmission(assignmentDescription, rubric, submissionText) {
    try {
      const prompt = `
You are a teaching assistant. Pre-grade the following student submission based on the assignment criteria.

Assignment: ${assignmentDescription}

Rubric:
${JSON.stringify(rubric, null, 2)}

Student Submission:
${submissionText}

Provide grading in JSON format:
{
  "suggestedScore": number,
  "maxScore": number,
  "feedback": "Detailed constructive feedback",
  "strengths": ["strength1", "strength2"],
  "improvements": ["area1", "area2"],
  "confidence": number (0-100)
}
`;

      const response = await this.chat({
        messages: [
          {
            role: 'system',
            content: 'You are a fair and constructive grading assistant. Provide honest, helpful feedback.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        task: 'coding'
      });

      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error('AI pre-grading error:', error);
      throw new Error('Failed to pre-grade submission');
    }
  }

  // Summarize video transcript using Grok (general task)
  async summarizeTranscript(transcript) {
    try {
      const response = await this.chat({
        messages: [
          {
            role: 'system',
            content: 'You are an expert at summarizing educational content into clear, concise notes.'
          },
          {
            role: 'user',
            content: `Summarize this class transcript into key points and actionable notes:\n\n${transcript}`
          }
        ]
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error('AI transcript summary error:', error);
      throw new Error('Failed to summarize transcript');
    }
  }

  // Generate study plan using Grok (recommendation task)
  async generateStudyPlan(courseData, availableHoursPerWeek, studentLevel) {
    try {
      const prompt = `
Create a personalized study plan for:

Course: ${courseData.title}
Description: ${courseData.description}
Duration: ${courseData.duration || 'Flexible'}
Student Level: ${studentLevel}
Available Hours/Week: ${availableHoursPerWeek}

Provide a week-by-week study plan in JSON format:
{
  "totalWeeks": number,
  "weeklyPlan": [
    {
      "week": number,
      "topics": ["topic1", "topic2"],
      "goals": ["goal1", "goal2"],
      "studyHours": number,
      "activities": ["activity1", "activity2"]
    }
  ],
  "tips": ["tip1", "tip2", "tip3"]
}
`;

      const response = await this.chat({
        messages: [
          {
            role: 'system',
            content: 'You are an expert learning strategist creating effective study plans.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        task: 'recommendation',
        reasoning: true
      });

      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error('AI study plan error:', error);
      throw new Error('Failed to generate study plan');
    }
  }

  // Answer student questions (supports task, reasoning, and reasoningDetails)
  async answerQuestion(
    question,
    courseContext,
    isCoding = false,
    task = 'general',
    reasoning = false,
    reasoningDetails = []
  ) {
    try {
      const response = await this.chat({
        messages: [
          {
            role: 'system',
            content: `You are a helpful tutor for the course: ${courseContext}. Provide clear, educational answers.`
          },
          {
            role: 'user',
            content: question
          }
        ],
        task: task || (isCoding ? 'coding' : 'general'),
        reasoning,
        reasoningDetails
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error('AI answer question error:', error);
      throw new Error('Failed to answer question');
    }
  }
}

module.exports = new AIService();
