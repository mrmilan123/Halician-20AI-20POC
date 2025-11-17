import { RequestHandler } from "express";

export const handleInitiateChat: RequestHandler = (req, res) => {
  const { caseName, caseType } = req.body;

  // Generate a simple AI response based on the case
  const responses: { [key: string]: string } = {
    "Consumer complaint": `I'm ready to assist you with your consumer complaint case: "${caseName}". Please provide details about the complaint, the product/service involved, and what resolution you're seeking.`,
    "Contract dispute": `I'll help you with your contract dispute case: "${caseName}". Please share the details of the contract, the specific dispute, and any relevant documentation or communications.`,
    "Property dispute": `I'm here to help with your property dispute case: "${caseName}". Please provide information about the property, the nature of the dispute, and the parties involved.`,
  };

  const message =
    responses[caseType] ||
    `Welcome to your case: "${caseName}". I'm ready to help you with your legal matter. Please share the details of your case.`;

  const response = {
    content: {
      message: message,
    },
    type: "text",
  };

  res.status(200).json(response);
};

export const handleAiResponse: RequestHandler = (req, res) => {
  const { content } = req.body;
  const userMessage = content?.message || "";

  // Generate a simple AI response based on user input
  const lowerMessage = userMessage.toLowerCase();

  let aiResponse = "I'm processing your request. Could you provide more details?";

  if (lowerMessage.includes("timeline") || lowerMessage.includes("deadline")) {
    aiResponse =
      "For your case, it's important to understand the applicable deadlines and statutes of limitations. Could you specify which jurisdiction this case falls under?";
  } else if (
    lowerMessage.includes("evidence") ||
    lowerMessage.includes("document")
  ) {
    aiResponse =
      "Evidence and documentation are crucial. Please ensure you have all relevant contracts, communications, receipts, and witness statements organized.";
  } else if (
    lowerMessage.includes("settlement") ||
    lowerMessage.includes("negotiate")
  ) {
    aiResponse =
      "Settlement negotiations can be effective. Have you considered the strength of your position and the potential outcomes of litigation?";
  } else if (lowerMessage.includes("cost") || lowerMessage.includes("fee")) {
    aiResponse =
      "Understanding legal costs is important. Different approaches have different financial implications. Would you like to discuss cost-benefit analysis?";
  } else if (lowerMessage.includes("next") || lowerMessage.includes("step")) {
    aiResponse =
      "The next steps depend on your specific situation. Would you like to discuss filing motions, preparing for discovery, or other procedural steps?";
  } else {
    aiResponse = `Thank you for that information about your case. Based on what you've shared, I recommend: 1) Organizing all relevant documentation, 2) Consulting with a legal professional if you haven't already, and 3) Understanding your legal rights and obligations. What specific aspect would you like to discuss further?`;
  }

  const response = {
    content: {
      message: aiResponse,
    },
    type: "text",
  };

  res.status(200).json(response);
};
