import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize with environment variable
const apiKey = process.env.GEMINI_API_KEY;

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { scenario, decision, score } = data;

    // Fallback if the user hasn't added their API key yet
    if (!apiKey) {
      return NextResponse.json({
         story: [
           `[OFFLINE HEURISTIC ANALYSIS] System evaluating payload.`,
           `Amount: $${scenario.amount} | Location: ${scenario.location}`,
           `Calculated Risk Score anomaly matches threshold: ${score}/100.`,
           `Final Execution Directive: ${decision}.`
         ]
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are 'FraudShield', an enterprise neural network. 
    Analyze this transaction and provide a 4-bullet-point chronological narrative of your thought process leading up to your conclusion.
    The absolute final decision made by the system is: ${decision}.

    Transaction telemetry:
    - User/Sender: ${scenario.sender}
    - Calculated Risk/Anomaly Score: ${score}/100 (where 100 is maximum fraud risk)
    - Amount: $${scenario.amount}
    - Geolocation: ${scenario.location}
    - Device Signature: ${scenario.device}
    
    INSTRUCTIONS:
    - Make the tone highly technical, cinematic, cold, and analytical.
    - Start the first line with exactly one of these tags depending on the severity: [CRITICAL_THREAT], [ANOMALY_DETECTED], or [SAFE_PACKET].
    - Maximum 20 words per line. 
    - Output MUST be exactly 4 lines separated by newlines. DO NOT use markdown list formatting like * or -.`;

    const result = await model.generateContent(prompt);
    let text = result.response.text();
    
    // Clean up response into strict array
    const storyLines = text.split('\n')
                           .map(line => line.replace(/^[-*•]\s*/, '').trim())
                           .filter(line => line.length > 0);

    return NextResponse.json({ story: storyLines.slice(0, 5) });

  } catch (error) {
    console.error("LLM Generation Error:", error);
    return NextResponse.json({ 
      story: ["[SYSTEM ERROR] External neural link severed.", "Falling back to local heuristic routing..."] 
    });
  }
}
