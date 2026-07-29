import { generateObject } from "@rork-ai/toolkit-sdk";
import { z } from "zod";
import { BrandProfile, GeneratedContent, ToneStyle } from "@/types";

const contentSchema = z.object({
  googleReply: z.string(),
  facebookBusinessCaption: z.string(),
  firstComment: z.string(),
  personalShareCaption: z.string(),
  storyCaption: z.string(),
  imagePrompt: z.string(),
  suggestedCTA: z.string(),
  keywordsUsed: z.string(),
});

export async function generateReviewContent(params: {
  reviewText: string;
  customerName: string;
  city: string;
  services: string[];
  tone: ToneStyle;
  brandProfile: BrandProfile;
}): Promise<GeneratedContent> {
  const { reviewText, customerName, city, services, tone, brandProfile } = params;

  const brandContext = brandProfile.businessName
    ? `
Brand Details:
- Business Name: ${brandProfile.businessName}
- Owner: ${brandProfile.ownerName}
- Website: ${brandProfile.website}
- Phone: ${brandProfile.phone}
- Service Area: ${brandProfile.serviceArea}
- Brand Style: ${brandProfile.brandStyle}
- Brand Tone: ${brandProfile.tone}
- Colors: ${brandProfile.colors}
- CTA Preference: ${brandProfile.ctaPreference}
- Default Keywords: ${brandProfile.keywordDefaults}
`
    : "No brand profile set up yet. Use generic premium home service branding.";

  const prompt = `Act as a local SEO expert and premium home service marketing specialist for a luxury exterior cleaning company.

${brandContext}

Review Details:
- Review Text: "${reviewText}"
- Customer Name: ${customerName || "Not provided"}
- City/Area: ${city}
- Service(s) Performed: ${services.join(", ")}
- Desired Tone: ${tone}

Generate the following content:

1. **Google Review Reply**: A warm, professional, non-generic reply. Sound human and conversational. Mention the city and service naturally for local SEO. Avoid robotic language. Do not overuse exclamation points. Ready to copy/paste directly into Google Business Profile.

2. **Facebook Business Page Caption**: Thank the customer, mention location and service, reinforce professionalism and quality, include a light CTA. Sound polished and premium. Ready to post on the business page.

3. **First Comment**: A short engagement-boosting comment to place under the business Facebook post. Lightly encourage quote requests without sounding salesy. Keep it short and easy to read.

4. **Personal Facebook Share Caption**: More personal and human. Express gratitude, feel like the business owner is proud of the work and thankful. Not overly promotional.

5. **Story Caption**: Very short, simple, clean, social-media-friendly. Just a few words or a short sentence.

6. **Image Generation Prompt**: A prompt for creating a square social media image featuring the 5-star review. Include: ${brandProfile.businessName || "business name"}, luxury/minimal style, ${brandProfile.colors || "dark blue, white, gold accents"}, ${customerName ? `reviewer name: ${customerName}` : "no reviewer name"}, the review text, ${brandProfile.phone || "phone number"} and ${brandProfile.website || "website"} if available. Clean layout, no fake logos, elegant typography, Facebook-optimized square format.

7. **Suggested CTA**: A brief call-to-action that fits the content.

8. **Keywords Used**: List of relevant local SEO and service keywords used across the generated content.

Requirements:
- Match a ${tone.toLowerCase()}, minimal, high-end brand voice
- Sound human and conversational
- Mention city and service naturally where appropriate
- Use relevant local SEO/service keywords without keyword stuffing
- Avoid robotic or repetitive wording
- Keep all outputs copy-and-paste ready`;

  const result = await generateObject({
    messages: [{ role: "user", content: prompt }],
    schema: contentSchema,
  });

  return result;
}
