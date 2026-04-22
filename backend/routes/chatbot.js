const express = require('express');
const router = express.Router();

/**
 * Rule-based NLP Chatbot for Jewellery Assistant
 * Falls back to Cohere API if available, otherwise uses built-in rules.
 */

const KNOWLEDGE_BASE = {
  greetings: ['hi', 'hello', 'hey', 'namaste', 'good morning', 'good evening'],
  farewell: ['bye', 'goodbye', 'see you', 'thanks', 'thank you'],
  howto_tryon: ['how to try', 'how do i try', 'how to use ar', 'virtual try', 'try on'],
  materials: ['gold', 'silver', 'diamond', 'platinum', 'rose gold', 'pearl', 'gemstone'],
  categories: ['earring', 'necklace', 'ring', 'bracelet', 'bangle', 'nose ring', 'pendant'],
  care: ['clean', 'care', 'maintain', 'polish', 'store'],
  size: ['size', 'fit', 'measurement', 'ring size'],
  shipping: ['ship', 'delivery', 'when will', 'return', 'refund', 'exchange'],
  price: ['price', 'cost', 'how much', 'affordable', 'budget', 'cheap', 'expensive'],
  recommendation: ['suggest', 'recommend', 'which one', 'best', 'popular', 'trending'],
  bridal: ['wedding', 'bridal', 'bride', 'shaadi', 'marriage']
};

const RESPONSES = {
  greetings: [
    "Namaste! Welcome to GLIMMR 💎 I'm your personal jewellery assistant. How can I help you today?",
    "Hello! I'm here to help you find your perfect jewellery. What are you looking for today? ✨",
    "Hi there! Ready to find something sparkly? Ask me anything about our collection!"
  ],
  farewell: [
    "Thank you for visiting GLIMMR! Come back anytime to try on more beautiful pieces 💎",
    "Goodbye! Hope you found your perfect jewellery. Don't forget to try the AR try-on!",
    "See you soon! Your perfect piece is waiting 🌟"
  ],
  howto_tryon: [
    "To use our AR Try-On: 1️⃣ Click 'Start Experience' on any jewellery page. 2️⃣ Allow camera access. 3️⃣ Position your face/hands in the frame. 4️⃣ Select a jewellery piece and see it on you in real-time! Works best in good lighting 💡",
    "AR Try-On is super easy! Navigate to any product, tap 'Try On', grant camera permission, and watch the magic happen! You can switch between earrings, necklaces, rings, and more."
  ],
  gold: [
    "Our gold jewellery is crafted in 18K, 22K, and 24K gold. 22K is ideal for Indian traditional jewellery, offering rich color and durability. Gold pairs beautifully with reds, maroons, and deep greens! 🌟",
    "Gold jewellery ranges from ₹5,000 to ₹5,00,000+ depending on weight and design. Would you like to see our gold collection?"
  ],
  silver: [
    "Silver jewellery is a timeless choice! Our pieces are 925 sterling silver, which means 92.5% pure silver for durability. Silver complements cool tones like blue, grey, and white. 💫",
    "Sterling silver is great for everyday wear and occasional jewellery. Easy to maintain — just wipe with a soft cloth to keep the shine!"
  ],
  diamond: [
    "Our diamond jewellery features certified natural diamonds. We evaluate diamonds on the 4Cs: Cut, Color, Clarity, and Carat. Our pieces range from solitaire rings to elaborate bridal sets! 💎",
    "Diamonds are forever! Our collection includes everything from delicate diamond studs to statement diamond necklaces. Would you like recommendations based on your occasion?"
  ],
  earring: [
    "We have a stunning range of earrings: studs, hoops, chandeliers, jhumkas, drops, and more! Which style interests you? Our AR try-on lets you see exactly how they'll look on you! 👂✨",
    "Earrings can transform any look! For traditional occasions, try jhumkas or chandelier earrings. For everyday wear, studs or small hoops are perfect."
  ],
  necklace: [
    "From delicate chains to statement chokers to traditional temple jewellery necklaces — we have it all! Pro tip: choose the neckline of your outfit first, then pick a complementary necklace length. 📿",
    "Our necklace collection includes gold chains, diamond pendants, kundan sets, and contemporary layering pieces. Want me to narrow it down by occasion?"
  ],
  ring: [
    "Rings are such personal pieces! We have engagement rings, cocktail rings, stackable bands, traditional kadas, and fashion rings. Try our AR try-on to see how rings look on your actual hand! 💍",
    "For ring sizing: measure your finger circumference in mm, or try our virtual fitting guide. Standard Indian sizes are 6 to 20."
  ],
  care: [
    "Jewellery care tips: 🌟 Store each piece separately in a soft pouch. 🌟 Remove jewellery before swimming, exercising, or using chemicals. 🌟 Clean gold with warm soapy water and a soft brush. 🌟 Polish silver with a silver cloth to prevent tarnishing. 🌟 Visit a jeweller annually for deep cleaning and inspection.",
    "For diamonds: a soft toothbrush with mild soap keeps them sparkling! For pearls: wipe with a damp cloth only — never soak them."
  ],
  size: [
    "Ring sizing guide: Wrap a strip of paper around your finger snugly, mark where it meets, and measure in mm. Alternatively, measure the diameter of a ring that fits you perfectly. Our AR try-on gives a visual preview of how any ring fits! 💍",
    "For bangles, measure the widest part of your hand (knuckles) when you make a fist. Standard sizes range from 2.0 to 2.10 in Indian sizing."
  ],
  shipping: [
    "We offer free shipping on orders above ₹2,000! Delivery typically takes 3-7 business days. Express delivery (1-2 days) available for select pin codes. Easy 15-day returns on unworn items with original packaging. 📦",
    "Returns are simple! If you're not happy, initiate a return within 15 days of delivery. We'll arrange free pickup and process your refund within 5-7 business days."
  ],
  price: [
    "Our collection caters to every budget! Costume jewellery starts from ₹299, silver jewellery from ₹999, and gold jewellery from ₹5,000. Diamond pieces start from ₹15,000. What's your budget? I can help find the perfect piece! 💰",
    "We have EMI options available on orders above ₹10,000 through major bank cards. No-cost EMI makes premium jewellery accessible!"
  ],
  recommendation: [
    "I'd love to help you find the perfect piece! Could you tell me: 1) The occasion (wedding, daily wear, party?), 2) Your preferred metal (gold, silver, diamond?), 3) Your budget range? With these details I can give you personalized recommendations! ✨",
    "Our bestsellers right now are our kundan earrings for weddings, diamond solitaire pendants for gifting, and minimalist gold bands for everyday wear. Want to try any of these in AR?"
  ],
  bridal: [
    "Congratulations on your upcoming wedding! 🎊 Our bridal collection includes complete sets — necklace, earrings, maang tikka, bangles, and rings — in gold, kundan, and diamond. Traditional meets modern in every design! Would you like to see our bridal lookbook?",
    "For bridal jewellery, we recommend booking a consultation. Our stylists can help create a coordinated set that complements your lehenga/saree perfectly. Try our AR feature to preview pieces before visiting!"
  ],
  default: [
    "That's a great question! Let me connect you with our jewellery expert. You can also explore our full catalogue or use the AR try-on to discover pieces you love! 💎",
    "I'm not sure about that specific query, but I'm happy to help with anything about our jewellery, AR try-on feature, sizing, care tips, or recommendations!",
    "Interesting question! For detailed assistance, you can also email us at support@glimmr.in. Meanwhile, have you tried our AR try-on? It's the best way to discover your perfect piece! ✨"
  ]
};

function classifyIntent(message) {
  const lower = message.toLowerCase();

  for (const [intent, keywords] of Object.entries(KNOWLEDGE_BASE)) {
    if (keywords.some(kw => lower.includes(kw))) {
      return intent;
    }
  }

  // Check materials and categories directly
  for (const mat of KNOWLEDGE_BASE.materials) {
    if (lower.includes(mat)) return mat.replace(' ', '_');
  }
  for (const cat of KNOWLEDGE_BASE.categories) {
    if (lower.includes(cat)) return cat.replace('-', '_').replace(' ', '_');
  }

  return 'default';
}

function getResponse(intent) {
  const responses = RESPONSES[intent] || RESPONSES.default;
  return responses[Math.floor(Math.random() * responses.length)];
}

// @POST /api/chatbot/message
router.post('/message', async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    // Try Cohere API if key is available
    if (process.env.COHERE_API_KEY) {
      try {
        const { CohereClient } = require('cohere-ai');
        const cohere = new CohereClient({ token: process.env.COHERE_API_KEY });

        const systemPrompt = `You are a knowledgeable and friendly jewellery shopping assistant for GLIMMR, a premium AR-based jewellery try-on platform. You help customers with:
- Jewellery types: earrings, necklaces, rings, bracelets, bangles, nose rings
- Materials: gold, silver, diamond, platinum, rose gold, pearl, gemstone
- AR try-on feature assistance
- Styling and outfit recommendations  
- Care and maintenance tips
- Sizing guidance
- Order, shipping, and return queries

Keep responses concise (2-3 sentences), warm, and helpful. Use relevant emojis. Always suggest the AR try-on feature when appropriate.`;

        const history = conversationHistory.slice(-10).map(msg => ({
          role: msg.role === 'user' ? 'USER' : 'CHATBOT',
          message: msg.content
        }));

        const response = await cohere.chat({
          message,
          chatHistory: history,
          preamble: systemPrompt,
          model: 'command-r',
          temperature: 0.7
        });

        return res.json({
          success: true,
          reply: response.text,
          intent: classifyIntent(message),
          powered_by: 'cohere'
        });
      } catch (cohereErr) {
        console.warn('Cohere API failed, falling back to rule-based:', cohereErr.message);
      }
    }

    // Rule-based fallback
    const intent = classifyIntent(message);
    const reply = getResponse(intent);

    res.json({
      success: true,
      reply,
      intent,
      powered_by: 'rule-based'
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @GET /api/chatbot/suggestions  - quick reply suggestions
router.get('/suggestions', (req, res) => {
  res.json({
    success: true,
    data: [
      'How do I use AR try-on?',
      'Show me gold earrings',
      'What\'s trending for weddings?',
      'Help me with ring sizing',
      'Diamond jewellery care tips',
      'Recommend bridal jewellery'
    ]
  });
});

module.exports = router;
