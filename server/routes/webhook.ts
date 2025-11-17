import { RequestHandler } from "express";

export const handleLogin: RequestHandler = (req, res) => {
  const { email, password } = req.body;

  // Simple validation
  if (!email || !password) {
    res.status(400).json({ error: "Email and password are required" });
    return;
  }

  // Simulate a dummy login (in real app, check credentials against database)
  if (email && password.length >= 6) {
    res.status(200).json({
      success: true,
      message: "Login successful",
      token: "dummy-jwt-token-" + Math.random().toString(36).substr(2, 9),
      user: {
        id: 1,
        name: "John Smith",
        email: email,
        age: 35,
        gender: "Male",
      },
    });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
};

export const handleSignUpUser: RequestHandler = (req, res) => {
  const { name, email, password, confirmPassword, age, gender } = req.body;

  // Validation
  if (!name || !email || !password || !confirmPassword || !age || !gender) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  if (password !== confirmPassword) {
    res.status(400).json({ error: "Passwords do not match" });
    return;
  }

  if (password.length < 8) {
    res.status(400).json({ error: "Password must be at least 8 characters" });
    return;
  }

  const ageNum = parseInt(age);
  if (isNaN(ageNum) || ageNum < 13) {
    res.status(400).json({ error: "You must be at least 13 years old" });
    return;
  }

  // Simulate signup success
  res.status(200).json({
    success: true,
    message: "Account created successfully",
    token: "dummy-jwt-token-" + Math.random().toString(36).substr(2, 9),
    user: {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      age: ageNum,
      gender,
      createdAt: new Date().toISOString(),
    },
  });
};

export const handleUserDetails: RequestHandler = (req, res) => {
  // Simulate fetching user details from a database
  const userDetails = {
    id: 1,
    name: "John Smith",
    age: 35,
    gender: "Male",
    email: "john.smith@example.com",
    cases: [
      {
        caseId: 1,
        name: "Smith vs. Company Ltd.",
        type: "Consumer complaint",
        createdOn: "2024-01-15T10:30:00Z",
        lastModifiedOn: "2024-01-20T14:45:00Z",
      },
      {
        caseId: 2,
        name: "Property Boundary Dispute",
        type: "Property dispute",
        createdOn: "2024-02-01T09:15:00Z",
        lastModifiedOn: "2024-02-05T11:20:00Z",
      },
    ],
  };

  res.status(200).json(userDetails);
};

export const handleCreateCase: RequestHandler = (req, res) => {
  const { name, type } = req.body;

  // Simulate creating a new case
  const newCase = {
    caseId: Math.floor(Math.random() * 10000) + 100,
    name: name,
    type: type,
    createdOn: new Date().toISOString(),
    lastModifiedOn: new Date().toISOString(),
  };

  res.status(200).json(newCase);
};

export const handleLoadCaseConversation: RequestHandler = (req, res) => {
  const { caseId } = req.body;

  // Simulate loading case conversation history
  const mockConversations: { [key: number]: any[] } = {
    1: [
      {
        role: "assistant",
        content:
          "I'm ready to assist you with your consumer complaint case. What are the details?",
        time: new Date(Date.now() - 86400000).toISOString(),
        contentType: "text",
      },
      {
        role: "user",
        content:
          "The product I purchased was defective and the seller won't provide a refund.",
        time: new Date(Date.now() - 86400000 + 60000).toISOString(),
        contentType: "text",
      },
      {
        role: "assistant",
        content:
          "I understand your frustration. Have you documented the defect with photos or videos? Do you have the original receipt and warranty information?",
        time: new Date(Date.now() - 86400000 + 120000).toISOString(),
        contentType: "text",
      },
    ],
    2: [
      {
        role: "assistant",
        content:
          "Welcome to your property dispute case. I'm here to help you resolve this boundary issue. Please provide details about the dispute.",
        time: new Date(Date.now() - 172800000).toISOString(),
        contentType: "text",
      },
    ],
  };

  const chat = mockConversations[caseId as number] || [];

  res.status(200).json({
    caseId: caseId,
    chat: chat,
  });
};

export const handleInitiateChat: RequestHandler = (req, res) => {
  const { caseId, caseName, caseType } = req.body;

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
  const { caseId, content } = req.body;
  const userMessage = content?.message || "";

  // Generate a simple AI response based on user input
  const lowerMessage = userMessage.toLowerCase();

  let aiResponse =
    "I'm processing your request. Could you provide more details?";

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
