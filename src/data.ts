import type { FlashCard, PersonDossier, SourceEvidence } from "./types";

export const SOURCE_EVIDENCE: SourceEvidence[] = [
  {
    id: "calendar-final-manager-jun18",
    type: "calendar",
    title: "Calendar Invite: Mgr Interview - Damian Stevens - Program Mgr Community Impact",
    date: "2026-06-18",
    excerpt:
      "Found: Colene Daniel, Mary Clabeaux, Shalon Robinson, Lisa Stockdale, Judi Buchanan. Interpretation: final manager interview / decision-stage panel.",
    confidence: "verified",
  },
  {
    id: "calendar-hl-jun4",
    type: "calendar",
    title: "Calendar Invite: HL Interview - Damian Stevens - Program Manager",
    date: "2026-06-04",
    excerpt:
      "Found: Shalon Robinson, Lisa Stockdale, Judi Buchanan, Jennifer Morris, Maria Iniguez. Interpretation: hiring leader panel.",
    confidence: "verified",
  },
  {
    id: "email-recruiter-followup-jun8",
    type: "email",
    title: "Recruiter Follow-up: early alignment guidance",
    date: "2026-06-08",
    excerpt:
      "Key detail: early win is alignment first across communications, meetings, strategy, and direction before dashboard visibility. Interpretation: emphasize alignment, context-building, communication rhythm, and portfolio visibility.",
    confidence: "verified",
  },
  {
    id: "pre-read-slides-jun1",
    type: "pre-read",
    title: "Google Slides Share: CHM Program Manager Candidate Pre-Read",
    date: "2026-06-01",
    excerpt:
      "Interpretation: pre-read content exists and should be converted into flashcards for the interview prep deck.",
    confidence: "verified",
  },
  {
    id: "email-thank-you-jun18",
    type: "email",
    title: "User Thank-You Email",
    date: "2026-06-18",
    excerpt:
      "Found: Colene, Mary, Jennifer, Judi, Lisa, Shalon. Interpretation: confirms people the candidate remembers meeting.",
    confidence: "user-provided",
  },
  {
    id: "email-stephanie-signature",
    type: "email",
    title: "Stephanie Gross email signature",
    excerpt:
      "Signature included: Talent Advisor - System Office Talent Acquisition. Interpretation: Stephanie is recruiter / organizer / coordinator for the process.",
    confidence: "verified",
  },
  {
    id: "manual-colene-prep-material",
    type: "manual",
    title: "Supplied prep material: Colene Daniel",
    excerpt:
      "Prior flashcard material identifies Colene Daniel as VP, Community Health Ministries. Treat as user-provided until profile enrichment is verified.",
    confidence: "user-provided",
  },
  {
    id: "linkedin-stephanie-public-profile",
    type: "linkedin",
    title: "Public LinkedIn result: Stephanie Gross",
    date: "2026-06-22",
    url: "https://www.linkedin.com/in/stephanie-gross-mha-racr-904a514b",
    excerpt:
      "Public LinkedIn result lists Stephanie Gross, MHA, RACR as Talent Advisor at Ascension in Talent Acquisition. Used for role corroboration only; no image was reused.",
    confidence: "verified",
  },
  {
    id: "screenshot-stephanie-profile-header",
    type: "screenshot",
    title: "User-provided LinkedIn screenshot: Stephanie profile header",
    date: "2026-06-28",
    excerpt:
      "Uploaded LinkedIn profile screenshot shows Stephanie Gross, MHA, RACR as Talent Advisor at Ascension in Talent Acquisition; Ascension; University of Central Florida; Miami-Fort Lauderdale Area; 4,063 followers; and 500+ connections. The profile portrait used in this app was cropped from the user-provided screenshot.",
    confidence: "user-provided",
  },
  {
    id: "screenshot-stephanie-experience",
    type: "screenshot",
    title: "User-provided LinkedIn screenshot: Stephanie experience",
    date: "2026-06-28",
    excerpt:
      "Uploaded experience screenshots show current role as Talent Advisor at Ascension, Nov 2021 to present, and prior healthcare recruiting roles: Talent Acquisition Recruiter at Jupiter Medical Center, Jul 2020 to Jun 2022; Corporate Recruiter at Memorial Healthcare System, Oct 2017 to Apr 2020; Senior Human Resources Recruiter at Spartanburg Regional Healthcare System, Dec 2015 to Oct 2017; Human Resources Recruiter at Park Ridge Health, Feb 2014 to Dec 2015; HR Assistant and Reception at Florida Hospital, May 2012 to Feb 2014; and Volunteer at Orlando Health, Nov 2011 to May 2012.",
    confidence: "user-provided",
  },
  {
    id: "screenshot-stephanie-education-certification",
    type: "screenshot",
    title: "User-provided LinkedIn screenshot: Stephanie education and certification",
    date: "2026-06-28",
    excerpt:
      "Uploaded education and certification screenshots show University of Central Florida, Master's degree in Health Services Administration, 2011 to 2013; University of Central Florida, Bachelor of Science in Health Services Administration, 2008 to 2011; J.P. Taravella High School, High School Diploma, General Studies, 2004 to 2008; and Recruiter Academy Certified Recruiter - RACR from Lean Human Capital, issued Dec 2016 and expired Dec 2021.",
    confidence: "user-provided",
  },
  {
    id: "screenshot-stephanie-skills-interests",
    type: "screenshot",
    title: "User-provided LinkedIn screenshot: Stephanie skills and interests",
    date: "2026-06-28",
    excerpt:
      "Uploaded skills/interests screenshots show top skills including Healthcare with 28 endorsements and Hospitals with 19 endorsements; causes listed as Animal Welfare, Children, Education, and Health; visible groups including Long Term Care / Recruitment / Senior Care / Assisted Living / Skilled Nursing / Healthcare and Leadership Think Tank; and related Ascension talent-acquisition profiles.",
    confidence: "user-provided",
  },
  {
    id: "linkedin-colene-public-profile",
    type: "linkedin",
    title: "Public LinkedIn result: Colene Daniel",
    date: "2026-06-22",
    url: "https://www.linkedin.com/in/colene-daniel-bb00983a",
    excerpt:
      "Public LinkedIn result identifies Colene Daniel as VP of Community Health Ministries at Ascension, responsible for Community Health Ministries across the country.",
    confidence: "verified",
  },
  {
    id: "screenshot-colene-profile-header",
    type: "screenshot",
    title: "User-provided LinkedIn screenshot: Colene profile header",
    date: "2026-06-23",
    excerpt:
      "Uploaded profile screenshot shows Colene Y. Daniel, LFACHE; pronouns She/Her; VP - Community Health Ministries; Ascension; Johns Hopkins Bloomberg School of Public Health; Baltimore, Maryland; and 500+ connections. The profile portrait and muted header were cropped from this user-provided screenshot.",
    confidence: "user-provided",
  },
  {
    id: "screenshot-colene-experience",
    type: "screenshot",
    title: "User-provided LinkedIn screenshot: Colene experience",
    date: "2026-06-23",
    excerpt:
      "Uploaded experience screenshot shows current role as Vice President - Community Health Ministries at Ascension, full-time, Aug 2024 to present, United States hybrid. It also shows prior roles including Healthcare Practice Director at Patina - A Korn Ferry Company and Korn Ferry, Independent Consultant at Bonne Sante Group, LLC, and Interim Chief Executive Officer at MazarsUSA LLC.",
    confidence: "user-provided",
  },
  {
    id: "screenshot-colene-education-certifications",
    type: "screenshot",
    title: "User-provided LinkedIn screenshot: Colene education and certifications",
    date: "2026-06-23",
    excerpt:
      "Uploaded education/certification screenshot shows Johns Hopkins Bloomberg School of Public Health, MPH in Public Health, 1996; Texas Woman's University, MS in Health/Health Care Administration/Management, 1986; Leadership Development to Advance Equity in Health from Harvard T.H. Chan School of Public Health, issued Apr 2023; and a Qatar University Faculty certification entry from Sep 2015 to Dec 2017.",
    confidence: "user-provided",
  },
  {
    id: "screenshot-colene-skills-activity",
    type: "screenshot",
    title: "User-provided LinkedIn screenshot: Colene skills, services, and activity",
    date: "2026-06-23",
    excerpt:
      "Uploaded skills/services screenshots show Finance connected to Vice President - Community Health Ministries at Ascension, Business Development with 15 endorsements, services/keywords including Healthcare Consulting, Business Consulting, Non-profit Consulting, Strategic Planning, Program Management, Change Management, Diversity and Inclusion, and Leadership Development, plus activity showing 1,968 followers and visible recommendation context from Kassondra E. Riley.",
    confidence: "user-provided",
  },
  {
    id: "linkedin-mary-public-profile",
    type: "linkedin",
    title: "Public LinkedIn result: Mary Clabeaux",
    date: "2026-06-22",
    url: "https://www.linkedin.com/in/maryclabeaux",
    excerpt:
      "Public LinkedIn result lists Mary Clabeaux, PHR as a Human Resources Business Partner associated with Ascension.",
    confidence: "verified",
  },
  {
    id: "screenshot-mary-profile-header",
    type: "screenshot",
    title: "User-provided LinkedIn screenshot: Mary profile header",
    date: "2026-06-23",
    excerpt:
      "Uploaded profile screenshot shows Mary Clabeaux, PHR as Human Resources Business Partner; Ascension; Davenport University; Grand Rapids Metropolitan Area; 500+ connections. About text describes an HR professional focused on leadership development, diversity, recruitment, communication, people/projects, deadline-driven work, and self-starting execution.",
    confidence: "user-provided",
  },
  {
    id: "screenshot-mary-current-experience",
    type: "screenshot",
    title: "User-provided LinkedIn screenshot: Mary current experience",
    date: "2026-06-23",
    excerpt:
      "Uploaded experience screenshot shows Ascension experience of 6 years 5 months, including Human Resources Business Partner, full-time, Sep 2024 to present, and Regional Human Resources Consultant, Feb 2020 to present, with visible training, coaching, and communication-program language.",
    confidence: "user-provided",
  },
  {
    id: "screenshot-mary-prior-experience-education",
    type: "screenshot",
    title: "User-provided LinkedIn screenshot: Mary prior experience and education",
    date: "2026-06-23",
    excerpt:
      "Uploaded prior-experience screenshot shows Ricoh USA experience totaling 23 years 4 months, including Human Resources - Leadership Development/Diversity Project Manager and Human Resources Manager; Staffing Manager at Robert Half International; Director at Ross Medical Education Center; and education at Davenport University, Bachelor of Business Administration, General Business.",
    confidence: "user-provided",
  },
  {
    id: "screenshot-mary-licenses-volunteering-skills",
    type: "screenshot",
    title: "User-provided LinkedIn screenshot: Mary licenses, volunteering, and skills",
    date: "2026-06-23",
    excerpt:
      "Uploaded screenshot shows licenses/certifications including How to Use LinkedIn Learning, issued Aug 2019, and SHRM-CP, issued Aug 2019 and expired Aug 2022; volunteering as Director of Workforce Readiness with Association of Human Resources Managers from Jan 2021 to present and Fundraising Leader with United Way; and skills section with Training & Development.",
    confidence: "user-provided",
  },
  {
    id: "public-web-shalon-role-lead",
    type: "manual",
    title: "Public web result: Shalon Robinson role lead",
    date: "2026-06-22",
    url: "https://wiza.co/d/ascensionorg/7be8/shalon-robinson",
    excerpt:
      "Public web result suggests Shalon Robinson has a national regulatory outpatient/post-acute role at Ascension. Treat as a role lead to confirm, not a verified LinkedIn profile claim.",
    confidence: "inferred",
  },
  {
    id: "screenshot-shalon-profile-header",
    type: "screenshot",
    title: "User-provided LinkedIn screenshot: Shalon profile header",
    date: "2026-06-23",
    excerpt:
      "Uploaded profile screenshot shows Shalon R. as Strategic Healthcare Consultant, Founder & Principal of SNR Strategic Solutions, bridging clinical excellence with operational scalability; SNR Strategic Solutions, LLC; Webster University; Greater St. Louis; and 2,283 followers. This screenshot was supplied by the user and attached to the Shalon Robinson dossier.",
    confidence: "user-provided",
  },
  {
    id: "screenshot-shalon-about-featured",
    type: "screenshot",
    title: "User-provided LinkedIn screenshot: Shalon about and featured posts",
    date: "2026-06-23",
    excerpt:
      "Uploaded about screenshot highlights clinical transformation, regulatory readiness for NCQA/CMS/HRSA/Joint Commission compliance, value-based strategy with $36M+ revenue-growth language, operational excellence, and 15+ years leading enterprise-level initiatives for major payers and providers before founding SNR Strategic Solutions.",
    confidence: "user-provided",
  },
  {
    id: "screenshot-shalon-experience-current",
    type: "screenshot",
    title: "User-provided LinkedIn screenshot: Shalon current and regulatory experience",
    date: "2026-06-23",
    excerpt:
      "Uploaded experience screenshot shows Founder & Principal at SNR Strategic Solutions, LLC, Mar 2026 to present; Catholic Healthsystem experience including Director Clinical Operations - Quality, Aug 2025 to present, and National Director Regulatory Preparedness, Oct 2021 to Jul 2025; plus visible healthcare, executive management, operational compliance, and thinking-skills tags.",
    confidence: "user-provided",
  },
  {
    id: "screenshot-shalon-prior-experience",
    type: "screenshot",
    title: "User-provided LinkedIn screenshot: Shalon prior healthcare experience",
    date: "2026-06-23",
    excerpt:
      "Uploaded experience screenshots show Healthcare Transformation Organization experience, including Program Implementation and Accreditation Director, Apr 2020 to Oct 2021; Physician Relations/Strategic Planning at Presence Health, Jul 2010 to Jun 2014, in Joliet, Illinois; and visible working-with-physicians / healthcare-consulting skills.",
    confidence: "user-provided",
  },
  {
    id: "screenshot-shalon-education-certifications-skills",
    type: "screenshot",
    title: "User-provided LinkedIn screenshot: Shalon education, certification, and skills",
    date: "2026-06-23",
    excerpt:
      "Uploaded education/certification screenshot shows Loyola University Chicago Executive Education Certification Program, Emerging Leadership Essentials, 2017; Southern Illinois University Carbondale, BASc in Kinesiology and Exercise Science, Aug 1997 to May 2000; Value-based Care Analytics Certificate by CareJourney by Arcadia, issued Dec 2023 and expiring Dec 2026; and a Skills section with 59 skills including Presentation Skills and Medicare Star.",
    confidence: "user-provided",
  },
  {
    id: "linkedin-lisa-public-profile",
    type: "linkedin",
    title: "Public LinkedIn result: Lisa Stockdale",
    date: "2026-06-22",
    url: "https://www.linkedin.com/in/lisa-stockdale",
    excerpt:
      "Public LinkedIn result describes Lisa Stockdale with community health strategic integration, value-based care optimization, and Medicare, Medicaid, and uninsured transformation context.",
    confidence: "verified",
  },
  {
    id: "screenshot-lisa-profile-header",
    type: "screenshot",
    title: "User-provided LinkedIn screenshot: Lisa profile header",
    date: "2026-06-23",
    excerpt:
      "Uploaded profile screenshot shows Lisa Stockdale with headline: Community Health Strategic Integration, Value-Based Care Optimization, Medicare, Medicaid & Uninsured Transformation, Agentic Care Management, and Capital & Organizational Leadership; Loyola University Chicago; Greater Chicago Area; 2,298 followers; and 500+ connections.",
    confidence: "user-provided",
  },
  {
    id: "screenshot-lisa-about-skills",
    type: "screenshot",
    title: "User-provided LinkedIn screenshot: Lisa about and skills",
    date: "2026-06-23",
    excerpt:
      "Uploaded screenshot shows Lisa's about section describing a senior healthcare executive career built around high-performing systems at the intersection of clinical excellence, economic sustainability, and community impact. Visible top skills include Managed Care, Working with Physicians, Hospitals, Health Insurance, and Healthcare.",
    confidence: "user-provided",
  },
  {
    id: "linkedin-judi-public-profile",
    type: "linkedin",
    title: "Public LinkedIn result: Judi Buchanan",
    date: "2026-06-22",
    url: "https://www.linkedin.com/in/jmoritzkcmarketingandbusdev",
    excerpt:
      "Public LinkedIn result lists Judi A. Buchanan, M.A., PMP, 6 Sigma, PSM as an innovative change and growth agent associated with Ascension in Kansas City.",
    confidence: "verified",
  },
  {
    id: "screenshot-judi-profile-header",
    type: "screenshot",
    title: "User-provided LinkedIn screenshot: Judi profile header",
    date: "2026-06-23",
    excerpt:
      "Uploaded profile screenshot shows Judi A Buchanan, M.A., PMP, 6 Sigma, PSM; pronouns She/Her; headline Innovative Change and Growth Agent; Ascension; Kansas City, Missouri; 500+ connections; and 840 followers. The profile portrait and Ascension-branded header were cropped from user-provided screenshots.",
    confidence: "user-provided",
  },
  {
    id: "screenshot-judi-current-ascension-experience",
    type: "screenshot",
    title: "User-provided LinkedIn screenshot: Judi current Ascension experience",
    date: "2026-06-23",
    excerpt:
      "Uploaded experience screenshot shows Senior Director - Planning, Innovation and Accountability at Ascension, full-time, May 2025 to present, Kansas City, MO and San Antonio, TX, hybrid. Visible role language connects the work to Community Health Ministries, medical/dental/social services, social determinants of health, population health management, innovation, collaboration, and service to people who are poor and vulnerable.",
    confidence: "user-provided",
  },
  {
    id: "screenshot-judi-portfolio-program-experience",
    type: "screenshot",
    title: "User-provided LinkedIn screenshot: Judi portfolio and program experience",
    date: "2026-06-23",
    excerpt:
      "Uploaded experience screenshots show Blue Cross and Blue Shield of Kansas City experience including Enterprise Portfolio Business Partner and Transformation Program Manager; Aperture Health roles including Program Manager and Senior Product Marketing Manager; and Optum - UnitedHealth Group Solutions Engineer work tied to provider data and consumer solutions.",
    confidence: "user-provided",
  },
  {
    id: "screenshot-judi-marketing-motorsports-experience",
    type: "screenshot",
    title: "User-provided LinkedIn screenshot: Judi marketing and growth history",
    date: "2026-06-23",
    excerpt:
      "Uploaded experience screenshots show KSM Marketing business development, marketing, quality systems, project management, technical writing, process improvement, and Six Sigma work; Alphanote sales/business development leadership with growth outcomes; Wood Brothers Racing sponsorship and ROI-reporting work; and Ford Motor Company incentives, recognition, motorsports, events, agency, and regional marketing leadership.",
    confidence: "user-provided",
  },
  {
    id: "screenshot-judi-education-certifications",
    type: "screenshot",
    title: "User-provided LinkedIn screenshot: Judi education and certifications",
    date: "2026-06-23",
    excerpt:
      "Uploaded education screenshot shows Avila University, M.A. in Management and Project Management, 2012 to 2014; Project Management Institute, Project Management Professional, 2012 to 2023; Kansas State University, B.S. in International Marketing, 1984 to 1989; University of Michigan/Ford Marketing Institute continuing education; and University of Milano Statale cultural and linguistic studies.",
    confidence: "user-provided",
  },
  {
    id: "screenshot-judi-recommendations",
    type: "screenshot",
    title: "User-provided LinkedIn screenshot: Judi recommendations",
    date: "2026-06-23",
    excerpt:
      "Uploaded recommendation screenshots show multiple received recommendations from 2012. Visible themes include enthusiasm, professionalism, common sense, cutting through complexity, keeping people engaged, 360-degree assessment, strategic planning, marketing partnership, work ethic, presentation skill, organization, and professionalism.",
    confidence: "user-provided",
  },
  {
    id: "linkedin-jennifer-public-profile",
    type: "linkedin",
    title: "Public LinkedIn result: Jennifer Morris",
    date: "2026-06-22",
    url: "https://www.linkedin.com/in/jennifer-morris-a92a0a107",
    excerpt:
      "Public LinkedIn result lists Jennifer Morris as an Enterprise Clinical Strategy Leader at Ascension, with system priority architecture, access transformation, and financial stewardship context.",
    confidence: "verified",
  },
  {
    id: "screenshot-jennifer-about-clinical-strategy",
    type: "screenshot",
    title: "User-provided LinkedIn screenshot: Jennifer about and top skills",
    date: "2026-06-28",
    excerpt:
      "Uploaded LinkedIn about screenshot frames Jennifer as an enterprise clinical leader shaping systemwide priorities, access transformation, and performance architecture across Ascension markets. It says her work focuses on clinical integration, primary care access, healthcare cost optimization, performance visibility, accountability, collaboration across markets, and more than $24M in net savings. Visible top skills include Enterprise Clinical Strategy, Clinical Integration, Operational Excellence, Healthcare Cost Optimization, and Cross-functional Team Leadership.",
    confidence: "user-provided",
  },
  {
    id: "screenshot-jennifer-experience-clinical-impact",
    type: "screenshot",
    title: "User-provided LinkedIn screenshot: Jennifer clinical impact experience",
    date: "2026-06-28",
    excerpt:
      "Uploaded experience screenshot shows Ascension experience including Clinical Manager Community Impact, Jul 2024 to present, Indiana, and Clinical Manager, RN, BSN, Strategic Integration, Feb 2023 to Jul 2024. It also shows Clinical Integration Manager at The Resource Group, Spend Management Solutions, an Ascension subsidiary, Nov 2015 to Feb 2023, and RN, Charge Nurse / Preceptor at Riley Children's Hospital IU Health, May 2007 to Nov 2015.",
    confidence: "user-provided",
  },
  {
    id: "screenshot-jennifer-education-skills",
    type: "screenshot",
    title: "User-provided LinkedIn screenshot: Jennifer education and skills",
    date: "2026-06-28",
    excerpt:
      "Uploaded education and skills screenshot shows University of Indianapolis, Bachelor's Degree, Registered Nursing/Registered Nurse, 2010 to 2012; Ivy Tech Community College, Lafayette Indiana, Associate's Degree, Registered Nursing/Registered Nurse, 2002 to 2007; and visible skills including Physician Alignment and Change Acceleration tied to Clinical Manager Community Impact at Ascension.",
    confidence: "user-provided",
  },
  {
    id: "linkedin-maria-public-profile",
    type: "linkedin",
    title: "Public LinkedIn result: Maria Iniguez",
    date: "2026-06-22",
    url: "https://www.linkedin.com/in/maria-iniguez-ms-rn-3b86442b",
    excerpt:
      "Public LinkedIn result lists Maria Iniguez, MS RN as National Community Benefit Director at Ascension Health.",
    confidence: "verified",
  },
  {
    id: "screenshot-maria-experience-community-benefit",
    type: "screenshot",
    title: "User-provided LinkedIn screenshot: Maria community benefit experience",
    date: "2026-06-28",
    excerpt:
      "Uploaded experience screenshot shows Ascension experience across National Community Benefit Director, Apr 2026 to present, Illinois; Community Benefit Manager for Ascension Illinois and Maryland, Dec 2025 to May 2026; Community Benefit Manager for Ascension Wisconsin, Sep 2024 to Jan 2026; and Manager of Community Benefit for Ascension IL, Apr 2022 to Sep 2024. It also shows AMITA Health experience including System Manager of Community Benefit and Clinical Nurse Manager.",
    confidence: "user-provided",
  },
  {
    id: "screenshot-maria-education-nursing",
    type: "screenshot",
    title: "User-provided LinkedIn screenshot: Maria nursing education",
    date: "2026-06-28",
    excerpt:
      "Uploaded education screenshot shows Northern Illinois University, MS in Advance Practice Nursing, 2006 to 2012; Northern Illinois University, BS in Nursing, 2002 to 2005; and Waubonsee Community College, AS in Nursing, 2000 to 2002.",
    confidence: "user-provided",
  },
  {
    id: "pre-read-mission-values-screenshot",
    type: "pre-read",
    title: "User screenshot: Ascension mission, vision, and values",
    date: "2026-06-21",
    excerpt:
      "The pre-read screenshot frames the mission around serving all persons, with special attention to poor and vulnerable communities. It also shows vision language around health, healing, and hope, plus values: service of the poor, reverence, integrity, wisdom, creativity, and dedication.",
    confidence: "user-provided",
  },
  {
    id: "pre-read-ministry-identity-screenshot",
    type: "pre-read",
    title: "User screenshot: ministry identity principles",
    date: "2026-06-21",
    excerpt:
      "The pre-read frames ministry as a community called to serve the good of all persons and names principles of defending human dignity, acting on behalf of justice, and promoting the common good.",
    confidence: "user-provided",
  },
  {
    id: "pre-read-footprint-impact-screenshot",
    type: "pre-read",
    title: "User screenshot: Ascension footprint and FY24 impact",
    date: "2026-06-21",
    excerpt:
      "The pre-read shows a national footprint and FY24 fast facts: 6.1 million persons served, $2.1 billion community benefit, 15.7 million physician office and clinic visits, 131,000 associates, and 76,000 births.",
    confidence: "user-provided",
  },
  {
    id: "pre-read-neighbor-needs-screenshot",
    type: "pre-read",
    title: "User screenshot: CHM meeting neighbors' needs",
    date: "2026-06-21",
    excerpt:
      "The CHM pre-read names service areas including Kansas City, Southeast Arkansas, New Orleans, El Paso, and San Antonio. It separates clinical services from social services and resources, including SDoH, transportation assistance, food assistance, behavioral health, maternal health, Medicaid and Medicare enrollment, clothing assistance, outreach events, and vocational training.",
    confidence: "user-provided",
  },
  {
    id: "pre-read-market-map-screenshot",
    type: "pre-read",
    title: "User screenshot: Ascension markets and CHM map",
    date: "2026-06-21",
    excerpt:
      "The map distinguishes Ascension markets from Community Health Ministries and labels sites/markets including Illinois, Wisconsin, Indiana, Maryland, Tennessee, Florida, Kansas, Oklahoma, Texas, Kansas City, El Paso, San Antonio, New Orleans, and Southeast Arkansas.",
    confidence: "user-provided",
  },
  {
    id: "pre-read-org-structure-screenshot",
    type: "pre-read",
    title: "User screenshot: Community Impact organizational structure",
    date: "2026-06-21",
    excerpt:
      "The March 2026 org chart screenshot places Colene Daniel as VP, Community Health Ministries and visually marks the Program Manager role near the CHM structure. Treat this as user-provided pre-read evidence.",
    confidence: "user-provided",
  },
  {
    id: "pre-read-leadership-matrix-screenshot",
    type: "pre-read",
    title: "User screenshot: CHM leadership, structure, and services matrix",
    date: "2026-06-21",
    excerpt:
      "The leadership matrix screenshot is partially legible. Visible entries include Arkansas, New Orleans, San Antonio, Kansas City, and El Paso; names visible include Michael Griffin, Lisa Goodgame, Frank Folino, Eduardo Ramirez, Stacy Mayer, Chelsea Fernandez, Christina Paz, and Howard Williams. Small service columns were not converted into exact claims.",
    confidence: "user-provided",
  },
];

export const BRIEFING_CARDS = [
  {
    id: "briefing-mission",
    label: "Mission",
    title: "Anchor answers in ministry identity",
    metric: "Good of all persons",
    summary:
      "The pre-read asks candidates to understand CHM work as mission-driven community service, not just program throughput.",
    bullets: [
      "Name human dignity, justice, and common good when explaining prioritization.",
      "Connect PM discipline to service of poor and vulnerable communities.",
      "Use language around trust, stewardship, and compassionate impact.",
    ],
    evidenceIds: ["pre-read-mission-values-screenshot", "pre-read-ministry-identity-screenshot"],
  },
  {
    id: "briefing-values",
    label: "Values",
    title: "Use the values as answer filters",
    metric: "6 values",
    summary:
      "The values slide gives language for how to frame examples: service, reverence, integrity, wisdom, creativity, and dedication.",
    bullets: [
      "Pick examples that show stewardship, trust, and respect for diverse communities.",
      "Use creativity as practical innovation, not novelty for its own sake.",
      "Tie dedication to follow-through after meetings, handoffs, and decisions.",
    ],
    evidenceIds: ["pre-read-mission-values-screenshot"],
  },
  {
    id: "briefing-identity",
    label: "Identity",
    title: "Translate ministry identity into PM behavior",
    metric: "Justice + dignity",
    summary:
      "The ministry identity screenshots point to human dignity, justice, and the common good as the ethical frame for the work.",
    bullets: [
      "Describe prioritization as service to neighbors, not just internal throughput.",
      "Connect stakeholder alignment to better support for vulnerable communities.",
      "Ask how the team decides between urgent needs across different communities.",
    ],
    evidenceIds: ["pre-read-ministry-identity-screenshot"],
  },
  {
    id: "briefing-footprint",
    label: "Scale",
    title: "Show you understand the scale",
    metric: "6.1M served",
    summary:
      "The screenshot gives national scale and FY24 impact signals that can make your answers feel grounded.",
    bullets: [
      "Mention that visibility must support a large, distributed system.",
      "Translate data into decision clarity, not vanity dashboards.",
      "Treat community benefit and access as core measures of success.",
    ],
    evidenceIds: ["pre-read-footprint-impact-screenshot", "pre-read-market-map-screenshot"],
  },
  {
    id: "briefing-market-map",
    label: "Markets",
    title: "Name the distributed footprint carefully",
    metric: "Mapped CHM points",
    summary:
      "The market map shows why a one-size-fits-all operating rhythm would be risky across CHM and market contexts.",
    bullets: [
      "Speak to standardization where it helps and local variation where it matters.",
      "Ask how market relationships shape CHM priorities and reporting needs.",
      "Use geography as a reason to build clear communication channels early.",
    ],
    evidenceIds: ["pre-read-market-map-screenshot"],
  },
  {
    id: "briefing-locations",
    label: "Sites",
    title: "Five CHM areas are explicit in the pre-read",
    metric: "KC / AR / NOLA / EP / SA",
    summary:
      "The neighbors' needs slide names Kansas City, Southeast Arkansas, New Orleans, El Paso, and San Antonio.",
    bullets: [
      "Show that you noticed the multi-site nature of the portfolio.",
      "Avoid assuming the same service mix or constraints at every location.",
      "Ask what the role should learn first from each CHM area.",
    ],
    evidenceIds: ["pre-read-neighbor-needs-screenshot", "pre-read-leadership-matrix-screenshot"],
  },
  {
    id: "briefing-services",
    label: "Clinical",
    title: "Clinical and social needs are intertwined",
    metric: "Care access",
    summary:
      "The CHM needs slide lists clinical services such as primary and specialty care, pediatrics, OB/GYN and maternal health, oral health, behavioral and mental health, optometry, 340B pharmacies, substance treatment, and health literacy.",
    bullets: [
      "Frame yourself as a PM who can connect clinical, social, and operational context.",
      "Ask how clinical service priorities are tracked without flattening local site context.",
      "Connect care access to communication rhythm, dependencies, and visibility.",
    ],
    evidenceIds: ["pre-read-neighbor-needs-screenshot"],
  },
  {
    id: "briefing-social-services",
    label: "Social",
    title: "SDoH work expands the coordination surface",
    metric: "Resources + supports",
    summary:
      "The same needs slide lists social services and resources: food, thrift stores, rent and utility assistance, early childhood programs, wellness centers, outreach, enrollment help, transportation, clothing, and vocational training.",
    bullets: [
      "Use cross-functional examples, not only software or dashboard examples.",
      "Ask how social services data and clinical priorities meet in planning.",
      "Emphasize listening before standardizing across very different sites.",
    ],
    evidenceIds: ["pre-read-neighbor-needs-screenshot"],
  },
  {
    id: "briefing-org",
    label: "Structure",
    title: "Colene is sourced to the org chart",
    metric: "VP CHM",
    summary:
      "The org-structure screenshot directly supports the Colene role claim and shows the Program Manager role near CHM leadership.",
    bullets: [
      "Treat Colene as a senior CHM leader in answers.",
      "Position the role as a connector across sites, leaders, communications, and reporting.",
      "Ask what alignment should look like across CHM leaders before dashboards mature.",
    ],
    evidenceIds: ["pre-read-org-structure-screenshot", "manual-colene-prep-material"],
  },
  {
    id: "briefing-leadership-matrix",
    label: "Matrix",
    title: "Use the leadership matrix with caution",
    metric: "Partially legible",
    summary:
      "The leadership matrix adds site and leader context, but the screenshot is low resolution. Only visibly legible names and locations should be used.",
    bullets: [
      "Treat site leadership details as context, not verified interview talking points.",
      "Do not cite unreadable service columns as exact facts.",
      "Ask open questions about variation across Arkansas, New Orleans, San Antonio, Kansas City, and El Paso.",
    ],
    evidenceIds: ["pre-read-leadership-matrix-screenshot"],
  },
] as const;

export const PROVENANCE_SECTIONS = [
  {
    id: "received",
    label: "Received",
    bullets: [
      "Supplied email/calendar trail for Jun 4 and Jun 18 interview invites.",
      "Supplied Jun 8 recruiter follow-up with alignment-first guidance.",
      "Supplied Jun 1 Google Slides pre-read reference.",
      "Supplied user thank-you email confirming remembered panel names.",
      "Nine user-provided screenshots from the CHM candidate pre-read deck.",
      "Public web search results for interviewer names with Ascension/LinkedIn context, searched on Jun 22, 2026.",
    ],
  },
  {
    id: "extracted",
    label: "Built From It",
    bullets: [
      "Eight seeded people with initials, source-note IDs, function, question, and prep context.",
      "Screenshot-derived briefing cards for mission, values, ministry identity, scale, markets, sites, services, social resources, org structure, and leadership matrix context.",
      "Strategy flashcards that convert the pre-read and recruiter guidance into interview answer angles.",
      "Local import parser that can attach user-provided profile text or pasted interview intel to localStorage dossiers.",
      "Public LinkedIn/profile evidence records for sourced role/headline context where the result was specific enough.",
    ],
  },
  {
    id: "not-performed",
    label: "Not Performed",
    bullets: [
      "No LinkedIn connector lookup was performed.",
      "No logged-in LinkedIn scraping, automated profile browsing, or photo/background extraction was performed.",
      "No live Gmail or Google Calendar connector read was used in this demo; the app uses the supplied evidence trail.",
      "No copyrighted game screenshots, names, logos, music, or UI assets were used.",
    ],
  },
  {
    id: "profile-policy",
    label: "Profile Policy",
    bullets: [
      "Stephanie's role is sourced to the supplied email signature evidence, public LinkedIn role lead, and user-provided LinkedIn screenshots.",
      "Colene's VP Community Health Ministries role is sourced to both user-provided prep/pre-read material and a public LinkedIn result.",
      "Mary, Lisa, Judi, Jennifer, and Maria now have public profile evidence records attached for role/headline context.",
      "Shalon has a public-web role lead attached, but it remains marked as a confirmation lead rather than verified LinkedIn profile data.",
      "Tenure, current LinkedIn headline, and company-history claims are included only where public results or user-provided screenshots directly support them.",
    ],
  },
] as const;

export const SEED_PEOPLE: PersonDossier[] = [
  {
    id: "stephanie-gross",
    name: "Stephanie Gross",
    initials: "SG",
    email: "stephanie.gross1@ascension.org",
    roleFromEmail: "Talent Advisor - System Office Talent Acquisition",
    roleFromProfile: "Talent Advisor @ Ascension | Talent Acquisition",
    profileStatus: "verified",
    functionInInterview: "Recruiter / talent acquisition process lead",
    profilePhotoUrl: "/assets/profile-packets/stephanie-gross-profile.jpg",
    profileBackgroundSummary:
      "User-provided LinkedIn screenshots frame Stephanie as a healthcare talent acquisition professional at Ascension with a long healthcare recruiting path across Ascension, Jupiter Medical Center, Memorial Healthcare System, Spartanburg Regional Healthcare System, Park Ridge Health, Florida Hospital, and Orlando Health. Education and certification screenshots add Health Services Administration training from the University of Central Florida and RACR recruiter certification context. Skills/interests emphasize healthcare, hospitals, recruiting communities, and health/education causes.",
    whyTheyMatter:
      "Stephanie appears to own the interview logistics and process context. Her signature identifies her as Talent Advisor, and the uploaded LinkedIn screenshots show a healthcare talent acquisition background with Ascension, hospital recruiting, Health Services Administration education, and recruiter certification context. Treat her as the process lead and as a useful read on what the talent team will notice in candidate communication.",
    likelyCaresAbout: [
      "Clear, timely candidate communication",
      "A smooth interview process",
      "Whether your answers line up with the team's stated guidance",
      "Gratitude and concise follow-through",
      "Healthcare recruiting fit and hospital-context credibility",
      "Mission fit, service orientation, and professionalism",
    ],
    howToSpeakToThem: [
      "Keep messages warm, brief, and specific.",
      "Acknowledge the pre-read and the team's guidance.",
      "Ask process questions without making her chase details.",
      "Treat her as a source of context, not a decision panel substitute.",
      "Use healthcare and hospital language naturally, without overplaying it.",
      "Signal reliability: dates, follow-ups, and materials handled cleanly.",
    ],
    smartQuestion:
      "Based on what the team has shared so far, is there one example or theme you think I should be especially ready to connect back to Ascension's healthcare and community impact context?",
    evidenceIds: [
      "email-stephanie-signature",
      "linkedin-stephanie-public-profile",
      "screenshot-stephanie-profile-header",
      "screenshot-stephanie-experience",
      "screenshot-stephanie-education-certification",
      "screenshot-stephanie-skills-interests",
      "email-recruiter-followup-jun8",
      "pre-read-slides-jun1",
    ],
  },
  {
    id: "colene-daniel",
    name: "Colene Daniel",
    initials: "CD",
    email: "colene.daniel@ascension.org",
    roleFromProfile: "VP, Community Health Ministries",
    profileStatus: "verified",
    functionInInterview: "Senior leader / likely decision maker",
    profilePhotoUrl: "/assets/profile-packets/colene-daniel-profile.jpg",
    profileBackdropUrl: "/assets/profile-packets/colene-daniel-banner.jpg",
    profileBackgroundSummary:
      "User-provided profile screenshots show a muted professional header and profile packet. Visible text frames Colene as VP - Community Health Ministries at Ascension, with public health education, healthcare transformation, strategic planning, change management, and leadership development themes.",
    whyTheyMatter:
      "Colene appears in the final manager interview invite, user-provided pre-read material identifies her as VP, Community Health Ministries, and uploaded profile screenshots add current-role, education, services, and experience context. Treat her as a senior CHM stakeholder and possible decision maker.",
    likelyCaresAbout: [
      "Community impact outcomes",
      "Alignment before reporting pressure",
      "Trust across stakeholders",
      "Healthcare transformation under operational pressure",
      "Public health, equity, and leadership development",
      "Visible portfolio direction after the operating rhythm is clear",
    ],
    howToSpeakToThem: [
      "Speak in terms of mission, alignment, and measurable visibility.",
      "Show that you would listen first and map the work before forcing dashboards.",
      "Connect PM discipline to community impact rather than process for its own sake.",
      "Use enterprise healthcare transformation language carefully, tied back to CHM realities.",
      "Use examples where you built trust across groups with different priorities.",
    ],
    smartQuestion:
      "What would strong alignment across CHM stakeholders look like after the first 60 to 90 days?",
    evidenceIds: [
      "calendar-final-manager-jun18",
      "manual-colene-prep-material",
      "linkedin-colene-public-profile",
      "screenshot-colene-profile-header",
      "screenshot-colene-experience",
      "screenshot-colene-education-certifications",
      "screenshot-colene-skills-activity",
      "pre-read-org-structure-screenshot",
      "email-thank-you-jun18",
      "email-recruiter-followup-jun8",
    ],
  },
  {
    id: "mary-clabeaux",
    name: "Mary Clabeaux",
    initials: "MC",
    email: "mary.clabeaux@ascension.org",
    roleFromProfile: "Human Resources Business Partner",
    profileStatus: "verified",
    functionInInterview: "Final interview participant",
    profileBackdropUrl: "/assets/profile-packets/mary-clabeaux-banner.jpg",
    profileBackgroundSummary:
      "User-provided profile screenshots show an HR Business Partner profile tied to Ascension, Davenport University, leadership development, diversity, recruitment, communication, workforce readiness, and training/development themes. No real profile portrait was visible in the supplied screenshots, so the app keeps initials instead of inventing a face.",
    whyTheyMatter:
      "Mary is included in the final manager interview invite and is also named in the user's thank-you email. A public LinkedIn result and user-provided profile screenshots list her as a Human Resources Business Partner associated with Ascension.",
    likelyCaresAbout: [
      "How you clarify ambiguity",
      "How you communicate with a panel",
      "Whether your examples match the alignment-first guidance",
      "How you would build trust before pushing process changes",
      "Leadership development, recruitment, diversity, and stakeholder communication",
    ],
    howToSpeakToThem: [
      "Treat the HR Business Partner role as sourced to public profile evidence.",
      "Use concrete examples of listening, synthesis, and follow-through.",
      "Make your answer easy for a panel participant to repeat later.",
      "Frame people/process examples in terms of communication, leadership support, and practical change adoption.",
      "Ask questions that invite her view of success without presuming her function.",
    ],
    smartQuestion:
      "From your seat, where does this role most need clarity or alignment early on?",
    evidenceIds: [
      "calendar-final-manager-jun18",
      "email-thank-you-jun18",
      "linkedin-mary-public-profile",
      "screenshot-mary-profile-header",
      "screenshot-mary-current-experience",
      "screenshot-mary-prior-experience-education",
      "screenshot-mary-licenses-volunteering-skills",
    ],
  },
  {
    id: "shalon-robinson",
    name: "Shalon Robinson",
    initials: "SR",
    email: "shalon.robinson@ascension.org",
    roleFromProfile: "Strategic Healthcare Consultant / Founder & Principal, SNR Strategic Solutions",
    profileStatus: "user-provided",
    functionInInterview: "Hiring leader / interview panel participant",
    profilePhotoUrl: "/assets/profile-packets/shalon-robinson-profile.jpg",
    profileBackdropUrl: "/assets/profile-packets/shalon-robinson-banner.jpg",
    profileBackgroundSummary:
      "User-provided profile screenshots attached to the Shalon file show healthcare consulting, clinical transformation, regulatory readiness, value-based strategy, operational excellence, and prior quality/regulatory operations themes. The screenshot header shows 'Shalon R.' and was mapped to this Shalon Robinson dossier from the user's supplied packet.",
    whyTheyMatter:
      "Shalon appears in the June 4 hiring leader interview invite and is listed as optional for the June 18 manager interview. User-provided profile screenshots add healthcare consulting, regulatory readiness, clinical operations quality, and value-based strategy context.",
    likelyCaresAbout: [
      "How you work with hiring leader expectations",
      "Communication cadence",
      "Prioritization across a portfolio",
      "Regulatory readiness and operational compliance",
      "Clinical transformation and value-based strategy",
      "How quickly you can create shared direction",
    ],
    howToSpeakToThem: [
      "Emphasize stakeholder alignment before artifacts.",
      "Name how you handle unclear ownership and competing priorities.",
      "Use examples that show meeting discipline and decision follow-up.",
      "Use regulatory-readiness and clinical-operations language when it fits, but keep it tied to the user-provided screenshot packet.",
      "Show that you can convert complex healthcare operations into a calm execution rhythm.",
    ],
    smartQuestion:
      "Where have alignment gaps created the most friction for this portfolio so far?",
    evidenceIds: [
      "calendar-hl-jun4",
      "calendar-final-manager-jun18",
      "email-thank-you-jun18",
      "public-web-shalon-role-lead",
      "screenshot-shalon-profile-header",
      "screenshot-shalon-about-featured",
      "screenshot-shalon-experience-current",
      "screenshot-shalon-prior-experience",
      "screenshot-shalon-education-certifications-skills",
      "email-recruiter-followup-jun8",
    ],
  },
  {
    id: "lisa-stockdale",
    name: "Lisa Stockdale",
    initials: "LS",
    email: "lisa.stockdale@ascension.org",
    roleFromProfile: "Community Health Strategic Integration / Value-Based Care Optimization",
    profileStatus: "verified",
    functionInInterview: "Hiring leader / interview panel participant",
    profilePhotoUrl: "/assets/profile-packets/lisa-stockdale-profile.jpg",
    profileBackdropUrl: "/assets/profile-packets/lisa-stockdale-banner.jpg",
    profileBackgroundSummary:
      "User-provided profile screenshots show an Ascension-branded banner and headline around community health strategic integration, value-based care optimization, Medicare/Medicaid/uninsured transformation, agentic care management, and capital/organizational leadership.",
    whyTheyMatter:
      "Lisa is in the June 4 hiring leader invite and is listed as optional for the June 18 manager interview. Public LinkedIn evidence and user-provided screenshots add community health strategic integration, value-based care, uninsured transformation, and organizational leadership context.",
    likelyCaresAbout: [
      "A pragmatic first 30 days",
      "How you gather context from many stakeholders",
      "Whether dashboard visibility follows actual operating clarity",
      "Clinical excellence, economic sustainability, and community impact",
      "How you keep communication predictable",
    ],
    howToSpeakToThem: [
      "Lead with how you would learn the current rhythm.",
      "Explain the move from alignment to visibility as a sequence.",
      "Use examples where you improved communication without overbuilding process.",
      "Connect your answers to value-based care, managed care, and community-health transformation when relevant.",
      "Make the link between operating rhythm and measurable community impact explicit.",
    ],
    smartQuestion:
      "What communication rhythm would make this role most useful to the broader team?",
    evidenceIds: [
      "calendar-hl-jun4",
      "calendar-final-manager-jun18",
      "email-thank-you-jun18",
      "linkedin-lisa-public-profile",
      "screenshot-lisa-profile-header",
      "screenshot-lisa-about-skills",
    ],
  },
  {
    id: "judi-buchanan",
    name: "Judi Buchanan",
    initials: "JB",
    email: "judi.buchanan@ascension.org",
    roleFromProfile: "Senior Director - Planning, Innovation and Accountability",
    profileStatus: "verified",
    functionInInterview: "Hiring leader / interview panel participant",
    profilePhotoUrl: "/assets/profile-packets/judi-buchanan-profile.jpg",
    profileBackdropUrl: "/assets/profile-packets/judi-buchanan-banner.jpg",
    profileBackgroundSummary:
      "User-provided profile screenshots show Judi A Buchanan as an Ascension Senior Director - Planning, Innovation and Accountability, with an Innovative Change and Growth Agent headline. The packet adds CHM, social determinants, population health, portfolio transformation, project management, Six Sigma, marketing/business development, and stakeholder-engagement themes.",
    whyTheyMatter:
      "Judi is named in the June 4 hiring leader interview invite, the June 18 optional attendee list, and the user's thank-you email. Public LinkedIn evidence describes her as an innovative change and growth agent associated with Ascension, and uploaded profile screenshots add current Ascension planning, innovation, accountability, CHM, portfolio, and program-transformation context.",
    likelyCaresAbout: [
      "Planning, innovation, and accountability",
      "Portfolio/program transformation and decision clarity",
      "CHM work tied to SDoH and population health",
      "Candidate follow-through and stakeholder engagement",
      "Project management discipline, Six Sigma, and measurable growth",
    ],
    howToSpeakToThem: [
      "Keep answers concrete and operational.",
      "Show how you convert discussion into next steps.",
      "Use language around decision rights, rhythm, and accountability.",
      "Frame examples around change, implementation, and growth while keeping the profile packet source visible.",
      "Use examples where you cut through complexity without losing people or context.",
      "Connect portfolio visibility to practical accountability, not just status reporting.",
    ],
    smartQuestion:
      "Where would clearer planning, accountability, or portfolio visibility make the biggest difference in CHM over the next 90 days?",
    evidenceIds: [
      "calendar-hl-jun4",
      "calendar-final-manager-jun18",
      "email-thank-you-jun18",
      "linkedin-judi-public-profile",
      "screenshot-judi-profile-header",
      "screenshot-judi-current-ascension-experience",
      "screenshot-judi-portfolio-program-experience",
      "screenshot-judi-marketing-motorsports-experience",
      "screenshot-judi-education-certifications",
      "screenshot-judi-recommendations",
    ],
  },
  {
    id: "jennifer-morris",
    name: "Jennifer Morris",
    initials: "JM",
    email: "jennifer.morris@ascension.org",
    roleFromProfile: "Enterprise Clinical Strategy Leader (RN)",
    profileStatus: "verified",
    functionInInterview: "Interview panel participant",
    profilePhotoUrl: "/assets/profile-packets/jennifer-morris-profile.jpg",
    profileBackgroundSummary:
      "User-provided LinkedIn screenshots add a clinical strategy profile: Ascension clinical impact work, access transformation, primary care access, performance architecture, clinical integration, healthcare cost optimization, and market-level collaboration. The screenshots also add RN education and frontline clinical leadership context from Riley Children's Hospital IU Health.",
    whyTheyMatter:
      "Jennifer appears in the updated June 4 hiring leader interview invite and is later mentioned in the user's thank-you email. Public LinkedIn evidence lists her as an Enterprise Clinical Strategy Leader at Ascension, and uploaded screenshots add systemwide clinical strategy, access transformation, cost optimization, and clinical integration context.",
    likelyCaresAbout: [
      "How you build shared context",
      "How you communicate progress",
      "What you ask before proposing a dashboard",
      "Whether you can adapt to panel input",
      "Access transformation, primary care access, and patient attachment",
      "Clinical integration, physician alignment, and healthcare cost optimization",
      "Performance visibility that supports accountability across markets",
    ],
    howToSpeakToThem: [
      "Describe how you would interview stakeholders before changing process.",
      "Use brief examples with a clear before and after.",
      "Invite her view of current visibility gaps.",
      "Connect visibility and alignment answers to clinical strategy, access transformation, and financial stewardship.",
      "Tie dashboard or rhythm ideas to better execution across markets, not reporting for its own sake.",
      "Respect the RN and frontline clinical leadership path: make operational examples concrete and patient-impact aware.",
    ],
    smartQuestion:
      "Where do access, clinical integration, or cost-optimization priorities most need clearer visibility across markets right now?",
    evidenceIds: [
      "calendar-hl-jun4",
      "email-thank-you-jun18",
      "linkedin-jennifer-public-profile",
      "screenshot-jennifer-about-clinical-strategy",
      "screenshot-jennifer-experience-clinical-impact",
      "screenshot-jennifer-education-skills",
    ],
  },
  {
    id: "maria-iniguez",
    name: "Maria Iniguez",
    initials: "MI",
    email: "maria.iniguez@ascension.org",
    roleFromProfile: "National Community Benefit Director | Ascension Health",
    profileStatus: "verified",
    functionInInterview: "Interview panel participant",
    profilePhotoUrl: "/assets/profile-packets/maria-iniguez-profile.jpg",
    profileBackgroundSummary:
      "User-provided LinkedIn screenshots add community benefit and nursing context: Ascension national and market community benefit roles across Illinois, Maryland, and Wisconsin, AMITA Health community benefit and clinical nurse management experience, and nursing education from Northern Illinois University and Waubonsee Community College.",
    whyTheyMatter:
      "Maria appears in the June 4 updated calendar guest list. Public LinkedIn evidence lists her as National Community Benefit Director at Ascension Health, and uploaded screenshots add market-level community benefit progression plus clinical nursing leadership roots.",
    likelyCaresAbout: [
      "How you understand the current environment",
      "Whether your PM approach is practical",
      "How you build alignment with limited context",
      "Clear communication during change",
      "Community benefit priorities across multiple Ascension markets",
      "How clinical operations experience connects to community impact",
      "Respect for local context while creating national visibility",
    ],
    howToSpeakToThem: [
      "Answer from the evidence and connect examples to community benefit and impact alignment.",
      "Position yourself as a context builder first.",
      "Connect alignment work to later reporting visibility.",
      "Ask for her perspective on what the team needs from the role.",
      "Use language around market needs, community benefit, nursing-informed operations, and measurable service impact.",
      "Show that you can coordinate across regions without flattening local differences.",
    ],
    smartQuestion:
      "Across the community benefit markets, what should this role learn first so alignment work respects local needs while still improving national visibility?",
    evidenceIds: [
      "calendar-hl-jun4",
      "linkedin-maria-public-profile",
      "screenshot-maria-experience-community-benefit",
      "screenshot-maria-education-nursing",
    ],
  },
];

const evidenceAnswer = (person: PersonDossier) =>
  `The dossier includes ${person.name} because of these sourced records: ${person.evidenceIds
    .map((id) => SOURCE_EVIDENCE.find((source) => source.id === id)?.title ?? id)
    .join("; ")}.`;

const roleLine = (person: PersonDossier) =>
  person.roleFromEmail ?? person.roleFromProfile ?? "Profile Pending";

const whoAnswer = (person: PersonDossier) => {
  if (person.id === "colene-daniel") {
    return "Colene appears to be a senior CHM leader. The prep material identifies her as VP, Community Health Ministries, the final manager interview invite includes her directly, and user-provided profile screenshots add current-role, education, services, and experience context. Treat her as a decision-maker. Speak in terms of alignment, community impact, measurable visibility, healthcare transformation, and how you would build trust before forcing dashboards or process.";
  }

  if (person.id === "stephanie-gross") {
    return "Stephanie is the Talent Advisor and talent acquisition process lead. The email signature anchors her role, while user-provided LinkedIn screenshots add Ascension talent acquisition context, healthcare recruiting history, UCF Health Services Administration education, RACR certification context, and skills around healthcare and hospitals. Keep communication warm, concise, grateful, and highly organized. She is a source of process context and a likely reader of candidate professionalism, follow-through, and healthcare fit.";
  }

  if (person.id === "jennifer-morris") {
    return "Jennifer is an Enterprise Clinical Strategy Leader and interview panel participant. The new screenshot packet adds Ascension clinical impact work, access transformation, clinical integration, healthcare cost optimization, performance architecture, and RN/frontline clinical leadership context. With her, connect project rhythm and visibility to clinical strategy, market execution, patient access, and measurable accountability.";
  }

  if (person.id === "maria-iniguez") {
    return "Maria is the National Community Benefit Director and an interview panel participant. The new screenshots add Ascension community benefit progression across Illinois, Maryland, and Wisconsin, AMITA Health community benefit and clinical nurse management experience, and nursing education. With her, speak in terms of community benefit, regional context, clinical operations roots, and practical alignment across markets.";
  }

  return `${person.name} is listed as ${person.functionInInterview}. Current role data is ${roleLine(
    person,
  )}. Do not add unsourced profile claims. Use the calendar/email trail to frame them as part of the interview prep.`;
};

export const FLASH_CARDS: FlashCard[] = [
  ...SEED_PEOPLE.flatMap((person) => [
    {
      id: `${person.id}-who`,
      category: "Person" as const,
      title: `Who is ${person.name}?`,
      prompt: `Who is ${person.name}?`,
      answer: whoAnswer(person),
      personId: person.id,
      evidenceIds: person.evidenceIds,
    },
    {
      id: `${person.id}-why`,
      category: "Evidence" as const,
      title: `Why are they here?`,
      prompt: `Why is ${person.name} in this interview?`,
      answer: person.whyTheyMatter,
      personId: person.id,
      evidenceIds: person.evidenceIds,
    },
    {
      id: `${person.id}-emphasize`,
      category: "Answer Angle" as const,
      title: `What to emphasize`,
      prompt: `What should I emphasize to ${person.name}?`,
      answer: person.howToSpeakToThem.join(" "),
      personId: person.id,
      evidenceIds: person.evidenceIds,
    },
    {
      id: `${person.id}-evidence`,
      category: "Evidence" as const,
      title: `Evidence trail`,
      prompt: `What evidence put ${person.name} in the dossier?`,
      answer: evidenceAnswer(person),
      personId: person.id,
      evidenceIds: person.evidenceIds,
    },
    {
      id: `${person.id}-question`,
      category: "Likely Question" as const,
      title: `Smart question`,
      prompt: `What question should I ask ${person.name}?`,
      answer: person.smartQuestion,
      personId: person.id,
      evidenceIds: person.evidenceIds,
    },
  ]),
  {
    id: "stephanie-profile-screenshot-packet",
    category: "Evidence",
    title: "Stephanie profile packet",
    prompt: "What did the uploaded Stephanie screenshots add?",
    answer:
      "The uploaded screenshots add a fuller recruiter profile: Stephanie Gross, MHA, RACR is shown as Talent Advisor at Ascension in Talent Acquisition, with prior healthcare recruiting roles at Jupiter Medical Center, Memorial Healthcare System, Spartanburg Regional Healthcare System, Park Ridge Health, Florida Hospital, and Orlando Health. The packet also adds UCF Health Services Administration education, RACR certification context, healthcare and hospital skills, and interests around healthcare recruiting communities and health/education causes. Use this to communicate with her as a healthcare talent acquisition professional who will notice organization, follow-through, and mission fit.",
    personId: "stephanie-gross",
    evidenceIds: [
      "screenshot-stephanie-profile-header",
      "screenshot-stephanie-experience",
      "screenshot-stephanie-education-certification",
      "screenshot-stephanie-skills-interests",
    ],
  },
  {
    id: "colene-profile-screenshot-packet",
    category: "Evidence",
    title: "Colene profile packet",
    prompt: "What did the uploaded Colene screenshots add?",
    answer:
      "The uploaded screenshots add a user-provided profile packet: visible current role as VP - Community Health Ministries at Ascension, a profile header and portrait, public health and healthcare administration education, leadership/equity certification context, and services/keywords around healthcare consulting, strategic planning, program management, change management, diversity and inclusion, and leadership development. Use these as conversation context, but keep every claim tied to the screenshot source notes.",
    personId: "colene-daniel",
    evidenceIds: [
      "screenshot-colene-profile-header",
      "screenshot-colene-experience",
      "screenshot-colene-education-certifications",
      "screenshot-colene-skills-activity",
    ],
  },
  {
    id: "shalon-profile-screenshot-packet",
    category: "Evidence",
    title: "Shalon profile packet",
    prompt: "What did the uploaded Shalon screenshots add?",
    answer:
      "The uploaded screenshots add user-provided context around Shalon's healthcare consulting profile: clinical transformation, regulatory readiness, value-based strategy, operational excellence, quality operations, and prior regulatory-preparedness experience. Use that context to frame answers around calm execution, compliance-aware operations, and alignment before artifacts, while keeping the claims sourced to the screenshot packet.",
    personId: "shalon-robinson",
    evidenceIds: [
      "screenshot-shalon-profile-header",
      "screenshot-shalon-about-featured",
      "screenshot-shalon-experience-current",
      "screenshot-shalon-prior-experience",
      "screenshot-shalon-education-certifications-skills",
    ],
  },
  {
    id: "lisa-profile-screenshot-packet",
    category: "Evidence",
    title: "Lisa profile packet",
    prompt: "What did the uploaded Lisa screenshots add?",
    answer:
      "The uploaded screenshots add a stronger Lisa angle: community health strategic integration, value-based care optimization, Medicare/Medicaid/uninsured transformation, agentic care management, capital and organizational leadership, and a stated intersection of clinical excellence, economic sustainability, and community impact. Use this to speak about sequencing alignment, visibility, and community-health outcomes without sounding dashboard-first.",
    personId: "lisa-stockdale",
    evidenceIds: ["screenshot-lisa-profile-header", "screenshot-lisa-about-skills"],
  },
  {
    id: "jennifer-profile-screenshot-packet",
    category: "Evidence",
    title: "Jennifer profile packet",
    prompt: "What did the uploaded Jennifer screenshots add?",
    answer:
      "The uploaded screenshots add a sharper Jennifer angle: enterprise clinical strategy, access transformation, primary care access, clinical integration, healthcare cost optimization, performance architecture, physician alignment, and Change Acceleration. They also add a concrete path from RN and charge nurse/preceptor experience into Ascension clinical impact and strategic integration work. With Jennifer, connect alignment and visibility to clinical execution, market accountability, and measurable patient-access outcomes.",
    personId: "jennifer-morris",
    evidenceIds: [
      "screenshot-jennifer-about-clinical-strategy",
      "screenshot-jennifer-experience-clinical-impact",
      "screenshot-jennifer-education-skills",
    ],
  },
  {
    id: "maria-profile-screenshot-packet",
    category: "Evidence",
    title: "Maria profile packet",
    prompt: "What did the uploaded Maria screenshots add?",
    answer:
      "The uploaded screenshots add Maria's community benefit progression across Ascension markets: National Community Benefit Director, Community Benefit Manager roles for Illinois, Maryland, and Wisconsin, Manager of Community Benefit for Ascension IL, and prior AMITA Health community benefit and clinical nurse management experience. They also add nursing education from Northern Illinois University and Waubonsee Community College. With Maria, speak to community benefit, local market needs, nursing-informed operations, and practical national visibility.",
    personId: "maria-iniguez",
    evidenceIds: [
      "screenshot-maria-experience-community-benefit",
      "screenshot-maria-education-nursing",
    ],
  },
  {
    id: "mary-profile-screenshot-packet",
    category: "Evidence",
    title: "Mary profile packet",
    prompt: "What did the uploaded Mary screenshots add?",
    answer:
      "The uploaded screenshots add practical HR context for Mary: HR Business Partner at Ascension, regional HR consulting, leadership development, diversity, recruitment, training, communication programs, workforce readiness, and Training & Development. With Mary, keep answers clear, people-aware, and easy to retell: how you listen, clarify change, support leaders, and make follow-through visible.",
    personId: "mary-clabeaux",
    evidenceIds: [
      "screenshot-mary-profile-header",
      "screenshot-mary-current-experience",
      "screenshot-mary-prior-experience-education",
      "screenshot-mary-licenses-volunteering-skills",
    ],
  },
  {
    id: "judi-profile-screenshot-packet",
    category: "Evidence",
    title: "Judi profile packet",
    prompt: "What did the uploaded Judi screenshots add?",
    answer:
      "The uploaded screenshots add a much sharper Judi angle: Ascension Senior Director - Planning, Innovation and Accountability, an Innovative Change and Growth Agent headline, CHM/social-determinants/population-health language, portfolio and transformation program experience, PMP/project-management education, Six Sigma and process-improvement signals, marketing/business-development history, and recommendations emphasizing complex-project execution and stakeholder engagement. With Judi, speak in concrete terms: rhythm, ownership, accountability, visibility, and how you keep people aligned through change.",
    personId: "judi-buchanan",
    evidenceIds: [
      "screenshot-judi-profile-header",
      "screenshot-judi-current-ascension-experience",
      "screenshot-judi-portfolio-program-experience",
      "screenshot-judi-marketing-motorsports-experience",
      "screenshot-judi-education-certifications",
      "screenshot-judi-recommendations",
    ],
  },
  {
    id: "overall-interview-strategy",
    category: "Strategy",
    title: "Overall interview strategy",
    prompt: "What is the strongest interview angle?",
    answer:
      "The recruiter follow-up says the earliest win is alignment first: communication, meetings, strategy, and direction before portfolio dashboard visibility. Position yourself as the PM who will listen first, map the operating rhythm, clarify decision rights, then build visibility.",
    evidenceIds: ["email-recruiter-followup-jun8", "pre-read-slides-jun1"],
  },
  {
    id: "mission-interview-angle",
    category: "Strategy",
    title: "Mission interview angle",
    prompt: "How should I connect PM work to Ascension's mission?",
    answer:
      "Connect project management to ministry identity: serving all persons, paying special attention to poor and vulnerable communities, defending human dignity, acting on behalf of justice, and promoting the common good. Then translate that into practical PM behaviors: listen first, clarify ownership, make decision paths visible, and reduce friction for teams serving neighbors.",
    evidenceIds: [
      "pre-read-mission-values-screenshot",
      "pre-read-ministry-identity-screenshot",
      "email-recruiter-followup-jun8",
    ],
  },
  {
    id: "vision-values-answer-angle",
    category: "Answer Angle",
    title: "Vision and values answer angle",
    prompt: "Which values should shape my examples?",
    answer:
      "Use the pre-read values as filters for your examples: service of the poor, reverence, integrity, wisdom, creativity, and dedication. Translate them into concrete behaviors: protect stakeholder trust, make decisions visible, use resources wisely, improve the rhythm without overbuilding process, and keep the work connected to people most affected by the programs.",
    evidenceIds: ["pre-read-mission-values-screenshot"],
  },
  {
    id: "ministry-identity-pm-angle",
    category: "Strategy",
    title: "Ministry identity PM angle",
    prompt: "What does ministry identity imply for the Program Manager role?",
    answer:
      "The ministry identity screenshots point to human dignity, justice, and the common good. For the interview, say that good PM work should make it easier for teams to serve neighbors: clarify priorities, reduce confusion, make tradeoffs transparent, and build a communication rhythm that respects local community context.",
    evidenceIds: ["pre-read-ministry-identity-screenshot", "email-recruiter-followup-jun8"],
  },
  {
    id: "fy24-scale-facts",
    category: "Evidence",
    title: "FY24 scale facts",
    prompt: "What scale facts from the pre-read can I cite?",
    answer:
      "The supplied screenshot shows FY24 fast facts: 6.1 million persons served, $2.1 billion in community benefit, 15.7 million physician office and clinic visits, 131,000 associates, and 76,000 births. Use those as scale context, then pivot back to how the PM role creates alignment and useful visibility across a large system.",
    evidenceIds: ["pre-read-footprint-impact-screenshot"],
  },
  {
    id: "market-map-prep",
    category: "Evidence",
    title: "Market map prep",
    prompt: "What should I know from the market map?",
    answer:
      "The map distinguishes Ascension markets from Community Health Ministries and labels a distributed set of locations and markets. The useful interview point is not memorizing every dot; it is showing that you understand the portfolio spans different communities, site models, and operating contexts. Ask how the team balances common reporting with local variation.",
    evidenceIds: ["pre-read-market-map-screenshot"],
  },
  {
    id: "chm-site-list-prep",
    category: "Evidence",
    title: "CHM site list prep",
    prompt: "Which CHM areas are explicit in the pre-read?",
    answer:
      "The neighbors' needs slide explicitly names Kansas City, Southeast Arkansas, New Orleans, El Paso, and San Antonio. Use that to ask about the differences across CHM areas: what should be standardized, what should stay local, and where a Program Manager can make cross-site communication easier first.",
    evidenceIds: ["pre-read-neighbor-needs-screenshot", "pre-read-leadership-matrix-screenshot"],
  },
  {
    id: "chm-service-complexity-angle",
    category: "Strategy",
    title: "CHM service complexity",
    prompt: "What CHM context should I prove I understand?",
    answer:
      "The CHM pre-read shows a mix of clinical services and social services across several locations. Your answer should show comfort coordinating across different site models, community needs, SDoH work, transportation, food access, maternal health, behavioral health, outreach, and reporting needs without assuming every site should operate identically.",
    evidenceIds: ["pre-read-neighbor-needs-screenshot", "pre-read-market-map-screenshot"],
  },
  {
    id: "clinical-services-scope",
    category: "Evidence",
    title: "Clinical services scope",
    prompt: "What clinical services appear in the pre-read?",
    answer:
      "The needs slide lists clinical services including primary and specialty care, pediatrics, OB/GYN and maternal health, oral health, behavioral and mental health, condition-specific care, infectious disease treatment, optometry, 340B pharmacies, substance treatment, health literacy, and graduate medical partnerships. Use this to show that the work crosses clinical, operational, and community domains.",
    evidenceIds: ["pre-read-neighbor-needs-screenshot"],
  },
  {
    id: "social-services-scope",
    category: "Evidence",
    title: "Social services scope",
    prompt: "What social services and resources appear in the pre-read?",
    answer:
      "The needs slide lists resources such as food assistance, thrift stores, utility and rent assistance, early childhood development, Early Head Start and Head Start, wellness centers, pregnancy care network work, outreach events, Medicaid and Medicare enrollment, SDoH services, clothing assistance, transportation assistance, and vocational training. This points to PM work that connects community support, partnerships, and operations.",
    evidenceIds: ["pre-read-neighbor-needs-screenshot"],
  },
  {
    id: "footprint-visibility-angle",
    category: "Strategy",
    title: "Footprint visibility",
    prompt: "How do I talk about dashboards without sounding shallow?",
    answer:
      "Use the FY24 footprint as context for why visibility matters, then avoid leading with a dashboard-first answer. Say that useful visibility depends on shared definitions, communication rhythm, decision rights, and trust across a distributed system. Reporting should make community impact easier to understand and act on.",
    evidenceIds: [
      "pre-read-footprint-impact-screenshot",
      "pre-read-market-map-screenshot",
      "email-recruiter-followup-jun8",
    ],
  },
  {
    id: "org-chart-program-manager-role",
    category: "Evidence",
    title: "Org chart Program Manager role",
    prompt: "What does the org chart suggest about the Program Manager role?",
    answer:
      "The org chart screenshot places Colene Daniel as VP, Community Health Ministries and visually marks the Program Manager role near the CHM area. Use that evidence narrowly: the role appears close to CHM leadership and likely needs to connect leaders, sites, communications, and visibility. Do not infer reporting lines beyond what the screenshot clearly shows.",
    evidenceIds: ["pre-read-org-structure-screenshot", "manual-colene-prep-material"],
  },
  {
    id: "org-structure-question-angle",
    category: "Likely Question",
    title: "Org structure question",
    prompt: "What should I ask about the CHM structure?",
    answer:
      "A strong question is: 'Across the CHM structure, where would a Program Manager create the most value first: alignment across leaders, clearer communication rhythm, portfolio visibility, or decision follow-through?' That question uses the org-chart evidence without pretending you know more than the screenshot shows.",
    evidenceIds: ["pre-read-org-structure-screenshot", "email-recruiter-followup-jun8"],
  },
  {
    id: "leadership-matrix-caution",
    category: "Evidence",
    title: "Leadership matrix caution",
    prompt: "What should I avoid overstating from the leadership matrix screenshot?",
    answer:
      "Use only the clearly legible parts. The screenshot visibly supports that the pre-read included a CHM leadership, structure, and services matrix across Arkansas, New Orleans, San Antonio, Kansas City, and El Paso, with several local leader names visible. The small service columns are too low-resolution to treat as exact claims, so ask open questions rather than citing those columns as facts.",
    evidenceIds: ["pre-read-leadership-matrix-screenshot"],
  },
];
