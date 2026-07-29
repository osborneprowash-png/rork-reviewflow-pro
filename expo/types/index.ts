export interface BrandProfile {
  businessName: string;
  ownerName: string;
  website: string;
  phone: string;
  serviceArea: string;
  tone: string;
  brandStyle: string;
  colors: string;
  services: string[];
  ctaPreference: string;
  keywordDefaults: string;
  defaultFacebookTone: string;
  defaultGoogleReplyTone: string;
}

export const DEFAULT_BRAND_PROFILE: BrandProfile = {
  businessName: '',
  ownerName: '',
  website: '',
  phone: '',
  serviceArea: '',
  tone: 'Warm',
  brandStyle: 'Premium',
  colors: 'Dark blue, white, subtle gold accents',
  services: [],
  ctaPreference: '',
  keywordDefaults: '',
  defaultFacebookTone: 'Professional',
  defaultGoogleReplyTone: 'Warm',
};

export type ToneStyle = 'Professional' | 'Warm' | 'Premium' | 'Luxury / High-End';

export const TONE_OPTIONS: ToneStyle[] = [
  'Professional',
  'Warm',
  'Premium',
  'Luxury / High-End',
];

export const SERVICE_OPTIONS = [
  'House Washing',
  'Soft Washing',
  'Concrete Cleaning',
  'Concrete Sealing',
  'Roof Cleaning',
  'Deck Cleaning',
  'Composite Deck Cleaning',
  'Exterior Cleaning',
  'Pressure Washing',
  'Other',
];

export type WorkflowStatus = 'draft' | 'generating' | 'generated' | 'in_progress' | 'completed';

export interface ChecklistState {
  copiedGoogleReply: boolean;
  pastedInGBP: boolean;
  clickedReply: boolean;
  copiedFacebookCaption: boolean;
  createdBusinessPost: boolean;
  copiedFirstComment: boolean;
  addedFirstComment: boolean;
  sharedToPersonal: boolean;
  copiedPersonalCaption: boolean;
  postedStory: boolean;
  markedComplete: boolean;
}

export const DEFAULT_CHECKLIST: ChecklistState = {
  copiedGoogleReply: false,
  pastedInGBP: false,
  clickedReply: false,
  copiedFacebookCaption: false,
  createdBusinessPost: false,
  copiedFirstComment: false,
  addedFirstComment: false,
  sharedToPersonal: false,
  copiedPersonalCaption: false,
  postedStory: false,
  markedComplete: false,
};

export interface GeneratedContent {
  googleReply: string;
  facebookBusinessCaption: string;
  firstComment: string;
  personalShareCaption: string;
  storyCaption: string;
  imagePrompt: string;
  suggestedCTA: string;
  keywordsUsed: string;
}

export interface ReviewWorkflow {
  id: string;
  dateCreated: string;
  reviewText: string;
  customerName: string;
  city: string;
  services: string[];
  tone: ToneStyle;
  status: WorkflowStatus;
  generatedContent: GeneratedContent | null;
  checklist: ChecklistState;
  notes: string;
}
