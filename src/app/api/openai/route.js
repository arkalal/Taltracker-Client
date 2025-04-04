import { NextResponse } from "next/server";
import OpenAI from "openai";
import { auth } from "../../../../auth";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { competencies } = await request.json();

    if (!competencies || !competencies.length) {
      return NextResponse.json(
        { error: "No competencies provided" },
        { status: 400 }
      );
    }

    const results = [];

    for (const competency of competencies) {
      // Skip empty competency names
      if (
        !competency ||
        typeof competency !== "string" ||
        competency.trim() === ""
      ) {
        continue;
      }

      // Create a system prompt to generate competency levels
      const systemPrompt = `
        You are an expert in creating competency matrices for professional skills development.
        Generate a detailed 5-level competency matrix for the skill: "${competency}".
        
        For each level (1-5), provide a brief description that explains the proficiency expected at that level.
        - Level 1: Unsatisfactory/Beginner - Limited skills and requires significant guidance.
        - Level 2: Needs Improvement/Basic - Has basic knowledge but needs development and assistance.
        - Level 3: Proficient - Works independently with solid understanding of concepts and applications.
        - Level 4: Expert - Advanced skills, able to guide others, recognized specialist.
        - Level 5: Master/Leader - Industry authority, innovates approaches, mentors experts.
        
        Focus on specific, observable behaviors and skills for each level.
        Make the progression logical, with each level building on the previous one.
        Be specific to the named competency.
        Keep each level description under 80 words.
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: `Please create a 5-level competency matrix for "${competency}". Each level should have a concise but comprehensive description.`,
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      });

      // Process the response to extract the levels
      const content = response.choices[0].message.content;
      const levels = processLevels(content, competency);

      results.push({
        competency,
        levels,
      });
    }

    return NextResponse.json({ results }, { status: 200 });
  } catch (error) {
    console.error("Error generating competency levels:", error);
    return NextResponse.json(
      { error: "Failed to generate competency levels", details: error.message },
      { status: 500 }
    );
  }
}

// Helper function to process the OpenAI response and extract levels
function processLevels(content, competency) {
  try {
    // Simple parsing to extract level descriptions - can be improved for production
    const lines = content.split("\n");
    const levels = [];
    let currentLevel = null;
    let currentDescription = "";

    for (const line of lines) {
      const levelMatch =
        line.match(/Level (\d+)|L(\d+):|(\d+)\./) ||
        line.toLowerCase().match(/^(beginner|basic|proficient|expert|master)/);

      if (levelMatch) {
        // Save previous level if exists
        if (currentLevel && currentDescription) {
          levels[currentLevel - 1] = currentDescription.trim();
          currentDescription = "";
        }

        // Determine level number from match
        if (levelMatch[1]) {
          currentLevel = parseInt(levelMatch[1]);
        } else if (levelMatch[2]) {
          currentLevel = parseInt(levelMatch[2]);
        } else if (levelMatch[3]) {
          currentLevel = parseInt(levelMatch[3]);
        } else {
          // Handle text-based level names
          const levelMap = {
            beginner: 1,
            basic: 2,
            proficient: 3,
            expert: 4,
            master: 5,
          };
          currentLevel = levelMap[levelMatch[0].toLowerCase()];
        }

        // If we can't determine level, skip
        if (!currentLevel || currentLevel < 1 || currentLevel > 5) {
          currentLevel = null;
          continue;
        }
      } else if (currentLevel && line.trim()) {
        // Add to current description
        currentDescription += line.trim() + " ";
      }
    }

    // Save last level if exists
    if (currentLevel && currentDescription) {
      levels[currentLevel - 1] = currentDescription.trim();
    }

    // If we couldn't parse levels, try a different approach - looking for headers
    if (levels.length === 0) {
      // Try to split by common level patterns
      const levelPatterns = [
        /Level 1:([^]*?)Level 2:/i,
        /Level 2:([^]*?)Level 3:/i,
        /Level 3:([^]*?)Level 4:/i,
        /Level 4:([^]*?)Level 5:/i,
        /Level 5:([^]*?)(?:$|(?:Level \d))/i,
      ];

      for (let i = 0; i < 5; i++) {
        const match = content.match(levelPatterns[i]);
        if (match && match[1]) {
          levels[i] = match[1].trim();
        }
      }
    }

    // Fill any missing levels with placeholders and ensure exactly 5 levels
    const result = new Array(5);
    for (let i = 0; i < 5; i++) {
      result[i] = levels[i] || `Level ${i + 1} description for ${competency}`;
    }

    console.log(`Processed levels for ${competency}:`, result);
    return result;
  } catch (error) {
    console.error("Error processing levels:", error);
    // Return placeholder levels if parsing fails
    return [
      `Level 1 description for ${competency}`,
      `Level 2 description for ${competency}`,
      `Level 3 description for ${competency}`,
      `Level 4 description for ${competency}`,
      `Level 5 description for ${competency}`,
    ];
  }
}
