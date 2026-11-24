// 10 SEO / AEO / GEO-oriented blogs for Mind and Soul Klinic (M.A.S.K.)
// - `content` is HTML (works with a Quill-style editor / dangerouslySetInnerHTML), with real <h2>/<h3> headings.
// - FAQs live in `blogSeoMeta[slug].faqs` and are rendered into the content from the SAME array,
//   so visible FAQ text and FAQ schema always match.
// - No statistics, search volumes, rankings, credentials or outcomes are claimed.
// - Primary/secondary keywords are suggested targets, NOT verified search-volume data.
// - Internal links point only to pages in this file, the home page and /book-session.
//   If your blog route is not /blog/<slug>, change BLOG_BASE below.
// - External references (WHO, Tele-MANAS) are listed in each post: verify the URLs before publishing.

const SITE = "https://www.mindandsoulklinic.com";
const BOOK = `${SITE}/book-session`;
const BLOG_BASE = `${SITE}/blog`;

const a = (slug, text) => `<a href="${BLOG_BASE}/${slug}">${text}</a>`;
const home = (text) => `<a href="${SITE}/">${text}</a>`;
const book = (text) => `<a href="${BOOK}">${text}</a>`;
const ext = (url, text) => `<a href="${url}" target="_blank" rel="noopener noreferrer">${text}</a>`;

const faqHtml = (faqs) =>
  `<h2>Frequently asked questions</h2>` +
  faqs.map((f) => `<h3>${f.q}</h3><p>${f.a}</p>`).join("");

const crisis = `<p><strong>If you or someone you know is in immediate danger,</strong> contact local emergency services right away. In India you can also call Tele-MANAS, the government mental health helpline, on 14416 (${ext("https://telemanas.mohfw.gov.in", "telemanas.mohfw.gov.in")}).</p>`;

const disclaimer = `<p><em>This article is general information and is not a substitute for a professional assessment or medical advice.</em></p>`;

/* ------------------------------------------------------------------ */
/* FAQs (single source of truth for visible FAQ + FAQ schema)          */
/* ------------------------------------------------------------------ */

const faqs = {
  anxiety: [
    { q: "Is anxiety a mental illness?", a: "Anxiety is a normal emotion. When it is persistent, intense and disruptive, it may meet the criteria for an anxiety disorder, which only a qualified professional can determine." },
    { q: "Can anxiety be treated?", a: "Many people find that therapy, and sometimes medical support, helps them manage anxiety much better. Results vary from person to person and are not guaranteed." },
    { q: "Do I need a psychologist or a psychiatrist for anxiety?", a: "A psychologist or counsellor offers talk-based therapy. A psychiatrist is a medical doctor who can assess and prescribe medication. Some people work with both." },
    { q: "How long does anxiety counselling take?", a: "It depends on the person, the concerns and the goals. Your therapist can discuss realistic expectations after an initial assessment." },
    { q: "Is online anxiety counselling an option?", a: "Many people find online sessions convenient for anxiety, especially when travel or time is a barrier." },
    { q: "Can physical symptoms like a racing heart be anxiety?", a: "They can be, but they can also have medical causes. Speak with a doctor about new or severe physical symptoms such as chest pain or breathlessness." },
  ],
  depression: [
    { q: "How long does sadness have to last before it might be depression?", a: "There is no single rule, but low mood on most days for two weeks or more, especially with loss of interest and reduced functioning, is a good reason to seek an assessment." },
    { q: "Can depression go away on its own?", a: "Some people improve with time, but depression often benefits from support. It is better to seek help than to wait and hope." },
    { q: "Is depression a sign of weakness?", a: "No. Depression can involve a combination of biological, psychological and life factors. It is a health condition, not a character flaw." },
    { q: "Can I have depression and still function at work?", a: "Yes. Some people look fine from the outside while feeling exhausted inside. This is sometimes called high-functioning depression, although it is not a formal diagnosis." },
    { q: "Will I need medication?", a: "That depends on your situation and is a decision to make with a qualified medical professional." },
    { q: "How can I support someone who may be depressed?", a: "Listen without rushing to fix, avoid phrases like 'just think positive', and encourage them to speak with a professional. Offer to help them find or attend an appointment." },
  ],
  choose: [
    { q: "How do I know if a psychologist is right for me?", a: "Usually it is a mix of clear qualifications, an approach that makes sense to you, and feeling safe and understood in the first few sessions." },
    { q: "Is it normal to try more than one therapist?", a: "Yes. Finding the right fit can take time and is a sensible part of the process." },
    { q: "How many sessions will I need?", a: "It varies with the concern and your goals. A therapist can discuss expectations after an initial assessment." },
    { q: "What is the difference between a psychologist, counsellor and psychiatrist?", a: "Psychologists and counsellors offer talk-based support, with training and titles that vary. A psychiatrist is a medical doctor who can diagnose and prescribe medication." },
    { q: "Should I choose online or in-person therapy?", a: "Choose whichever you can attend consistently and where you feel comfortable. Some people combine both." },
    { q: "Is therapy confidential?", a: "Professional therapy is generally confidential, with certain limits that your therapist should explain at the start." },
  ],
  marriage: [
    { q: "Does going to couples counselling mean our marriage is failing?", a: "No. Many couples seek support to strengthen communication and connection, not only in a crisis." },
    { q: "How long does marriage counselling take?", a: "It varies with the concerns and goals. A therapist can discuss this with you after an initial assessment." },
    { q: "Can counselling save a marriage?", a: "It can help couples understand and address their problems, but outcomes depend on many factors and cannot be guaranteed." },
    { q: "Do both partners have to attend every session?", a: "Joint sessions are usually the focus, though some therapists also offer individual sessions as part of the process." },
    { q: "What if only one of us wants counselling?", a: "You can invite your partner by describing your own experience rather than blaming. If they decline, individual therapy can still help you understand your patterns and needs." },
    { q: "Is what we say in sessions confidential?", a: "Therapists maintain confidentiality, with limits that they should explain at the start." },
  ],
  family: [
    { q: "Do all family members have to attend?", a: "Ideally those affected take part, but it can also be useful to begin with whoever is willing. A therapist can guide you." },
    { q: "Can family counselling help with a teenager who will not talk?", a: "It can help create a safer space for communication, though it takes time and patience." },
    { q: "What if some family members do not believe in therapy?", a: "This is common. Starting with those who are open, and approaching others with respect rather than pressure, is often more effective." },
    { q: "Is family counselling only for serious problems?", a: "No. Many families benefit from support during stress or transitions." },
    { q: "Will the therapist take sides?", a: "A good family therapist works to understand every perspective rather than assigning blame." },
  ],
  teen: [
    { q: "How do I know if it is normal teenage behaviour or a problem?", a: "Look at how long it lasts, how intense it is, and whether it interferes with sleep, school, friendships or daily life." },
    { q: "What if my teenager refuses therapy?", a: "Avoid forcing it. Express care, offer choices, and consider seeking guidance for yourself while keeping the door open." },
    { q: "Is exam stress a mental health issue?", a: "Stress is common and not automatically a disorder, but when it becomes overwhelming or persistent, support can help." },
    { q: "Should I check my teenager's phone?", a: "Practices vary by family. Open conversation and clear, agreed expectations usually build more trust than secret monitoring." },
    { q: "Can teenagers have depression and anxiety?", a: "Yes. These can occur at any age, and early support helps." },
    { q: "What should I do if my teenager talks about self-harm or not wanting to live?", a: "Take it seriously, stay calm and stay with them, and seek urgent help from a professional or emergency services." },
  ],
  burnout: [
    { q: "Is burnout a mental illness?", a: "Burnout is generally described as an occupational phenomenon rather than a medical condition, but it can occur alongside anxiety or depression and deserves care." },
    { q: "How long does it take to recover from burnout?", a: "It varies widely depending on the person, the situation and the changes that are possible." },
    { q: "Should I quit my job?", a: "That depends on your circumstances. Many people find it useful to explore options and underlying patterns with a professional before making major decisions." },
    { q: "Can burnout happen outside paid work?", a: "Yes. Caregivers, students and homemakers can also experience burnout." },
    { q: "How can I tell my manager I am struggling?", a: "Be specific about workload and what would help, and focus on solutions you can work on together." },
  ],
  hypno: [
    { q: "Will I lose control during hypnosis?", a: "In therapeutic hypnosis you remain aware and in control, and you can stop at any time." },
    { q: "Is hypnosis the same as sleep?", a: "No. It is a state of focused attention and relaxation, not sleep." },
    { q: "How many sessions are needed?", a: "It depends on your goals and situation. A therapist can discuss expectations with you." },
    { q: "Can everyone be hypnotised?", a: "People vary in how they respond, and this approach does not suit everyone." },
    { q: "Is it a replacement for counselling?", a: "It is typically used as part of a broader therapeutic process that includes conversation and reflection." },
    { q: "Is cognitive hypnotic psychotherapy safe?", a: "It is generally used with trained professionals, but suitability varies. People with severe symptoms or a history of trauma should be assessed first." },
  ],
  confidence: [
    { q: "Can self-confidence be learned?", a: "Yes. It develops through practice, supportive experiences and changing unhelpful beliefs." },
    { q: "Why do I feel confident in some areas but not others?", a: "Confidence is often situational and shaped by past experiences in specific areas." },
    { q: "Is low self-esteem a mental illness?", a: "Not by itself, but it can be linked with anxiety or depression and is worth addressing." },
    { q: "How long does it take to feel more confident?", a: "It varies. Change is usually gradual, with small steps adding up over time." },
    { q: "Can therapy help with self-worth?", a: "Many people find that therapy helps them understand and shift long-standing self-critical patterns, though results vary." },
  ],
  online: [
    { q: "Is online counselling as effective as in-person therapy?", a: "Many people find it helpful for common concerns, though suitability depends on the individual and the situation." },
    { q: "Is online counselling confidential?", a: "Therapists should explain how they protect your privacy. You can also protect it by choosing a private space and a secure connection." },
    { q: "Can I do online counselling from anywhere in Delhi NCR?", a: "Generally yes, if you have a private space and a stable internet connection." },
    { q: "What if my internet drops during a session?", a: "Therapists usually have a plan, such as reconnecting or switching to a phone call. Ask about this in advance." },
    { q: "Can I switch between online and in-person sessions?", a: "Often yes. Discuss it with your therapist." },
  ],
};

/* ------------------------------------------------------------------ */
/* Blogs                                                               */
/* ------------------------------------------------------------------ */

export const blogSeedDataSEO = [
  {
    title: "How to Know If You Need Anxiety Counselling: Signs, Types and What Helps",
    slug: "how-to-know-if-you-need-anxiety-counselling",
    category: "Anxiety",
    excerpt:
      "Worry is a normal human experience. Anxiety that is constant, physical, or starting to shape your choices may be a sign it is time to speak with a mental health professional.",
    image: "/blog/anxiety-counselling-signs-delhi.jpg",
    created_at: new Date("2026-11-24T09:00:00.000Z"),
    content: `<p>Everyone feels anxious sometimes: before an exam, a presentation or a difficult conversation. So how do you know when anxiety is simply part of life, and when it deserves professional support?</p>

<h2>Quick answer</h2>
<p>Consider anxiety counselling if worry feels hard to control, shows up in your body, lasts for weeks or months, and starts to affect your sleep, work, relationships or the choices you make. A qualified psychologist or counsellor can assess what is happening and suggest an appropriate approach.</p>

<h2>What anxiety can look like</h2>
<p>Anxiety is not only racing thoughts. It can appear in three broad ways.</p>
<h3>Emotionally</h3>
<p>You may feel restless, irritable or on edge, or feel a sense of dread without being able to name it.</p>
<h3>Physically</h3>
<p>You may notice muscle tension, headaches, a racing heart, stomach discomfort, fatigue, trembling or trouble sleeping. Because these symptoms overlap with physical health conditions, it is sensible to see a doctor if they are new or severe, especially chest pain or breathlessness.</p>
<h3>In behaviour</h3>
<p>You may avoid situations, seek constant reassurance, procrastinate, over-prepare or struggle to make decisions.</p>

<h2>Signs it may be time to seek help</h2>
<ul>
<li>Your worry feels out of proportion to the situation, or you cannot switch it off even when you try.</li>
<li>You are avoiding things that matter to you, such as social events, travel, work opportunities or conversations.</li>
<li>Your sleep, appetite or concentration has changed for a sustained period.</li>
<li>You rely on habits that bring short-term relief but cause longer-term problems, such as constant scrolling, overeating or avoiding feelings.</li>
<li>People close to you have noticed that you seem tense or withdrawn.</li>
</ul>

<h2>Different forms of anxiety</h2>
<p>Anxiety shows up differently from person to person. Some people experience persistent, wide-ranging worry. Others feel intense fear in social situations, sudden waves of panic, or fear linked to a specific place or object. Some experience anxiety mainly as perfectionism or a strong need to control outcomes. Only a trained professional can assess which pattern fits you, so avoid self-diagnosing from the internet. The ${ext("https://www.who.int/news-room/fact-sheets/detail/anxiety-disorders", "World Health Organization's fact sheet on anxiety disorders")} gives a good general overview.</p>

<h2>Anxiety in everyday city life</h2>
<p>Long commutes, demanding workplaces, family expectations, financial pressure and the pace of city life can all keep the body on high alert. For many people, anxiety is not one dramatic event but the build-up of many small pressures with very little time to recover. Naming this can reduce self-blame: needing support does not mean you are weak or failing. If work pressure is a big part of your picture, you may also find our guide to ${a("workplace-stress-and-burnout-signs-and-recovery", "workplace stress and burnout")} useful.</p>

<h2>What happens in anxiety counselling</h2>
<p>A first session is usually a conversation. You describe what you have been experiencing, how long it has been going on and what you would like to change. Your therapist helps you understand your patterns and agree on a way of working together.</p>
<p>Depending on the person, therapy may include learning to notice and reframe anxious thoughts, understanding the emotions and beliefs underneath worry, practising relaxation and grounding skills, and gradually facing avoided situations at a manageable pace. Approaches vary between therapists, and no responsible professional can promise a guaranteed outcome. What good therapy offers is a structured, respectful space to understand your anxiety and build tools to live with it differently. Some clients are also curious about ${a("what-is-cognitive-hypnotic-psychotherapy", "cognitive hypnotic psychotherapy")}, which combines thought-focused work with guided relaxation.</p>

<h2>Things you can try while you decide</h2>
<ul>
<li>Slow your breathing for a few minutes, making the exhale longer than the inhale.</li>
<li>Write the worry down and ask: is this a problem I can act on today, or a "what if"?</li>
<li>Reduce excess caffeine, protect sleep where you can, and add gentle movement to your day.</li>
<li>Talk to one trusted person about how you are feeling. Isolation tends to amplify anxiety.</li>
</ul>

<h2>Choosing a therapist and format</h2>
<p>If you are ready to reach out, our guides on ${a("how-to-choose-the-right-psychologist-in-delhi", "choosing the right psychologist in Delhi")} and ${a("online-counselling-in-delhi-ncr-does-it-work", "online counselling in Delhi NCR")} explain what to look for and how sessions work.</p>

${faqHtml(faqs.anxiety)}

<h2>Take the next step</h2>
<p>If anxiety is taking up more of your life than you would like, you do not have to wait until it becomes unbearable. Learn more about our approach on the ${home("Mind and Soul Klinic website")} or ${book("book an anxiety counselling session")}.</p>

${crisis}
${disclaimer}`,
  },

  {
    title: "Depression vs Sadness: How to Tell the Difference and When to Seek Counselling",
    slug: "depression-vs-sadness-when-to-seek-counselling",
    category: "Depression",
    excerpt:
      "Sadness is a natural response to loss or disappointment. Depression is more persistent and pervasive, and it deserves care and professional attention.",
    image: "/blog/depression-vs-sadness-counselling.jpg",
    created_at: new Date("2026-11-20T09:00:00.000Z"),
    content: `<p>Many people ask the same quiet question: "Am I just sad, or is this depression?" It is a fair question, and the answer is not always obvious from the inside.</p>

<h2>Quick answer</h2>
<p>Sadness usually has an identifiable cause and eases with time, comfort or change. Depression tends to last longer, affect many areas of life, and often involves loss of interest, energy and hope, even when things seem fine on the surface. Only a qualified professional can diagnose depression.</p>

<h2>Sadness: a healthy human emotion</h2>
<p>Grief, disappointment, loneliness and stress can all bring sadness. It may come in waves, but you can usually still experience moments of connection, humour or comfort, and the feeling tends to shift as circumstances change.</p>

<h2>Depression: more than a low mood</h2>
<p>Depression is a health condition that can affect how you feel, think and function. The ${ext("https://www.who.int/news-room/fact-sheets/detail/depression", "WHO fact sheet on depression")} describes it as different from usual mood changes and short-lived emotional responses. Common signs include:</p>
<ul>
<li>A low or empty mood most of the day, for much of the time, over an extended period.</li>
<li>Loss of interest or pleasure in things you used to enjoy.</li>
<li>Sleeping too much or too little.</li>
<li>Changes in appetite or weight.</li>
<li>Persistent tiredness or low energy.</li>
<li>Difficulty concentrating or making decisions.</li>
<li>Feelings of worthlessness, guilt or being a burden.</li>
<li>Withdrawing from people.</li>
<li>Thoughts of death or self-harm. If you have these thoughts, please reach out for immediate support.</li>
</ul>
<p>Depression can look different in different people. Some appear to be coping well while struggling privately. Some show irritability or anger rather than sadness. Some mainly feel numb.</p>

<h2>Key differences at a glance</h2>
<ul>
<li><strong>Cause:</strong> sadness often has a clear trigger; depression may or may not.</li>
<li><strong>Duration:</strong> sadness tends to ease; depression tends to persist for weeks or longer.</li>
<li><strong>Range:</strong> sadness may leave room for good moments; depression often colours most of life.</li>
<li><strong>Function:</strong> depression more often interferes with work, relationships and self-care.</li>
<li><strong>Self-view:</strong> depression often brings harsh self-criticism and hopelessness. Our guide on ${a("build-self-confidence-and-heal-emotionally", "building self-confidence after years of self-criticism")} explores where that inner voice can come from.</li>
</ul>

<h2>Why people delay seeking help</h2>
<p>Many people wait because they believe they should be able to cope alone, fear being judged, or feel they do not have a "good enough" reason. Depression is not a character flaw or a lack of gratitude. It is a health condition that responds to understanding and support.</p>

<h2>What depression counselling can offer</h2>
<p>Counselling gives you a confidential space to talk about what you are experiencing without needing to put on a brave face. A therapist can help you understand the thoughts, feelings and life experiences connected to your low mood, rebuild routines gradually, challenge harsh self-talk and work out what support you need. In some cases a therapist may suggest consulting a psychiatrist or doctor as well. Outcomes vary, and therapy is not a guaranteed cure, but many people find that being understood is itself a powerful first step. If you are unsure whom to approach, read ${a("how-to-choose-the-right-psychologist-in-delhi", "how to choose the right psychologist in Delhi")}.</p>

<h2>Small steps that may help alongside support</h2>
<ul>
<li>Keep one small daily anchor, such as a short walk, a shower or a meal at a regular time.</li>
<li>Reach out to one person, even with a short message.</li>
<li>Be gentle with expectations: do less, but do something.</li>
<li>Avoid using alcohol or other substances to numb feelings, as they tend to worsen low mood over time.</li>
</ul>

<h2>How to support someone you love</h2>
<p>Listen without rushing to fix. Say, "I am here and I am not going anywhere." Avoid phrases such as "just think positive." Encourage them to speak with a professional, and offer to help find or attend an appointment. For a young person, see our guide to ${a("teenage-mental-health-warning-signs-for-parents", "teenage mental health warning signs")}.</p>

${faqHtml(faqs.depression)}

<h2>Take the next step</h2>
<p>If you recognise yourself in this article, you are not alone and help is available. Learn more on the ${home("Mind and Soul Klinic website")} or ${book("book a counselling session")} when you feel ready.</p>

${crisis}
${disclaimer}`,
  },

  {
    title: "How to Choose the Right Psychologist or Counsellor in Delhi",
    slug: "how-to-choose-the-right-psychologist-in-delhi",
    category: "Therapy",
    excerpt:
      "The therapeutic relationship matters as much as the technique. Here is a practical guide to choosing a psychologist or counsellor who fits your needs.",
    image: "/blog/choose-psychologist-delhi-guide.jpg",
    created_at: new Date("2026-11-16T09:00:00.000Z"),
    content: `<p>Searching for a psychologist can feel overwhelming. There are many therapists, many approaches and very little guidance about what to look for. The good news is that you do not need to be an expert. A few clear questions can help you choose with confidence.</p>

<h2>Quick answer</h2>
<p>Look for a professional whose qualifications are clear, whose approach suits your concerns, with whom you feel reasonably comfortable, and whose practical details, such as location, timing, fees and format, work for you.</p>

<h2>Understand the roles first</h2>
<ul>
<li><strong>Psychologist:</strong> usually trained in psychology and offers assessment and talk-based therapy. Qualifications and titles vary, so it is reasonable to ask about training.</li>
<li><strong>Counsellor:</strong> offers guidance and emotional support, often for specific concerns such as stress, relationships or life transitions.</li>
<li><strong>Psychiatrist:</strong> a medical doctor who can diagnose mental health conditions and prescribe medication.</li>
</ul>
<p>If you are unsure which you need, a first conversation can help clarify it. A good professional will tell you if another kind of support would suit you better.</p>

<h2>Check qualifications and registration</h2>
<p>Ask about educational background, training, areas of experience and professional registration where applicable. A trustworthy professional will answer openly. Be cautious about anyone who guarantees quick cures or total recovery, because responsible therapy cannot promise that.</p>

<h2>Consider the therapist's approach</h2>
<p>Therapists work in different ways. Some focus on thoughts and behaviours, some on emotions and relationships, some on past experiences, and some combine approaches. You do not need to know the names of all the methods. Ask, "How do you usually work with concerns like mine?" and notice whether the answer makes sense to you. If you are curious about one specific method, our plain-language guide to ${a("what-is-cognitive-hypnotic-psychotherapy", "cognitive hypnotic psychotherapy")} shows how a combined approach can be explained.</p>

<h2>Match the therapist to your concern</h2>
<p>Some therapists have particular experience with anxiety, depression, relationships, family dynamics, teenagers or workplace stress. If you have a specific concern, ask whether the therapist regularly works with it. These guides may help you describe what you are going through: ${a("how-to-know-if-you-need-anxiety-counselling", "signs you may need anxiety counselling")}, ${a("marriage-counselling-what-to-expect-and-when-to-start", "what to expect from marriage counselling")} and ${a("family-counselling-when-conflict-at-home-needs-support", "family counselling")}.</p>

<h2>Practical considerations</h2>
<ul>
<li><strong>Location and format:</strong> some people prefer in-person sessions in South Delhi or a nearby area, while others prefer ${a("online-counselling-in-delhi-ncr-does-it-work", "online counselling")} for convenience.</li>
<li><strong>Timing:</strong> check whether available slots fit your schedule so attending is sustainable.</li>
<li><strong>Fees and policies:</strong> ask about session fees, duration and cancellation policy before you begin.</li>
<li><strong>Language:</strong> therapy works best when you can express yourself in the language that feels most natural, whether English, Hindi or a mix.</li>
<li><strong>Confidentiality:</strong> a professional should explain how your information is kept private and any limits to confidentiality.</li>
</ul>

<h2>Notice how you feel in the first session</h2>
<p>It is normal to feel nervous. Over one or two sessions, ask yourself: Do I feel heard? Is the therapist respectful of my pace? Do I feel judged? Do I understand the plan? You do not need to feel completely at ease straight away, but you should feel basic safety and respect. It is acceptable to say if something is not working, and acceptable to change therapists if the fit is not right.</p>

<h2>Red flags to be aware of</h2>
<ul>
<li>Guarantees of cure or rapid results.</li>
<li>Pressure to commit to many sessions in advance without discussion.</li>
<li>Dismissiveness or judgement about your experience.</li>
<li>Boundary violations, such as inappropriate personal contact.</li>
<li>Lack of clarity about confidentiality, fees or qualifications.</li>
</ul>

<h2>Questions to ask in a first conversation</h2>
<ul>
<li>What is your training and experience with concerns like mine?</li>
<li>What will a typical session look like?</li>
<li>How will we know whether therapy is helping?</li>
<li>What are your fees and cancellation policy?</li>
<li>How do you handle confidentiality?</li>
</ul>

${faqHtml(faqs.choose)}

<h2>Take the next step</h2>
<p>To learn about our team and approach, visit the ${home("Mind and Soul Klinic website")}. When you are ready, ${book("book a first session")} and ask any of the questions above.</p>

${disclaimer}`,
  },

  {
    title: "Marriage and Couples Counselling: What to Expect and When to Start",
    slug: "marriage-counselling-what-to-expect-and-when-to-start",
    category: "Relationships",
    excerpt:
      "Couples counselling is not only for relationships on the edge. It can be a structured space to understand patterns, rebuild communication, and make clearer choices together.",
    image: "/blog/marriage-counselling-what-to-expect.jpg",
    created_at: new Date("2026-11-12T09:00:00.000Z"),
    content: `<p>Many couples assume counselling is a last resort, something to try only when the relationship is about to end. In reality, people come to couples therapy for many reasons, and starting earlier often gives you more room to work with.</p>

<h2>Quick answer</h2>
<p>Marriage or couples counselling is a confidential, guided space where partners explore communication, conflict, expectations and emotional connection with the help of a trained therapist. It can help whether you want to strengthen your relationship, understand a difficult phase, or make a clearer decision about the future.</p>

<h2>Common reasons couples seek counselling</h2>
<ul>
<li>Repeated arguments that follow the same pattern.</li>
<li>Feeling emotionally distant, or like roommates.</li>
<li>Trust issues, including after a breach of trust.</li>
<li>Different expectations about money, parenting, careers or household responsibilities.</li>
<li>Pressure from extended family or in-laws.</li>
<li>Major transitions such as marriage, a new baby, relocation, illness or loss.</li>
<li>Difficulty talking about intimacy.</li>
<li>Uncertainty about whether to stay or leave.</li>
</ul>

<h2>Signs it may be time to seek help</h2>
<ul>
<li>You avoid certain topics because they always lead to conflict.</li>
<li>Conversations often turn into blame, criticism or silence.</li>
<li>One or both of you feel unheard or unappreciated.</li>
<li>You feel lonely even when you are together.</li>
<li>Small issues keep escalating into major fights.</li>
<li>You have tried to fix things yourselves but the pattern keeps repeating.</li>
</ul>

<h2>What happens in a first session</h2>
<p>The therapist typically asks each of you about your concerns, your history as a couple and what you hope will change. The goal is not to decide who is right or wrong. It is to understand the patterns between you and agree on how to work together. A good therapist treats both partners with respect and does not take sides.</p>

<h2>What the work may involve</h2>
<ul>
<li>Learning to communicate needs and feelings without attacking or withdrawing.</li>
<li>Understanding the cycle you fall into during conflict, and how each person's reactions feed it.</li>
<li>Exploring how family backgrounds and earlier experiences shape expectations. Where in-laws or joint-family dynamics are involved, ${a("family-counselling-when-conflict-at-home-needs-support", "family counselling")} may also help.</li>
<li>Rebuilding trust, where possible, through clear and consistent steps.</li>
<li>Strengthening emotional connection and appreciation.</li>
<li>Clarifying values and decisions, including difficult ones.</li>
</ul>
<p>Therapy cannot guarantee that a relationship will continue or that every problem will be resolved. What it can do is give both people a better understanding of what is happening and more skill in responding to it.</p>

<h2>How to prepare</h2>
<ul>
<li>Think about what you would like to be different, in specific terms.</li>
<li>Agree that the aim is understanding, not winning.</li>
<li>Be willing to listen as well as speak.</li>
<li>Be honest about your commitment and any hesitations.</li>
</ul>

<h2>If only one partner is willing</h2>
<p>Sometimes one person wants counselling and the other is hesitant. You can invite your partner by describing your own experience rather than blaming: "I would like us to have support in talking about this." If your partner declines, individual therapy can still help you understand your own patterns and decide what you need. Stress or anxiety may be shaping how you react in the relationship; our guide to ${a("how-to-know-if-you-need-anxiety-counselling", "anxiety counselling")} explains when to seek help for that.</p>

<h2>A note on safety</h2>
<p>Couples counselling is not suitable when there is ongoing abuse or violence, because joint sessions can increase risk. If you feel unsafe in your relationship, speak with a professional individually and consider contacting a local support service.</p>

<h2>Finding the right therapist</h2>
<p>Fit matters in couples work, because both partners need to feel respected. See our checklist on ${a("how-to-choose-the-right-psychologist-in-delhi", "choosing a psychologist in Delhi")}, and consider ${a("online-counselling-in-delhi-ncr-does-it-work", "online sessions")} if schedules are hard to align.</p>

${faqHtml(faqs.marriage)}

<h2>Take the next step</h2>
<p>If you and your partner would like support, learn more on the ${home("Mind and Soul Klinic website")} or ${book("book a couples counselling session")}.</p>

${disclaimer}`,
  },

  {
    title: "Family Counselling: When Conflict at Home Needs Support",
    slug: "family-counselling-when-conflict-at-home-needs-support",
    category: "Family",
    excerpt:
      "Family conflict is often about unspoken needs, roles, and expectations. Family counselling can help everyone feel heard and find healthier ways to relate.",
    image: "/blog/family-counselling-delhi.jpg",
    created_at: new Date("2026-11-08T09:00:00.000Z"),
    content: `<p>Families are where we first learn about closeness, conflict and belonging. They can also be where we feel most misunderstood. When tension at home becomes constant, it affects every member, often in different ways.</p>

<h2>Quick answer</h2>
<p>Family counselling is a guided conversation in which family members, with a trained therapist, explore communication patterns, roles, expectations and conflicts, and work towards healthier ways of relating. It is helpful when problems seem to involve the whole family rather than one person alone.</p>

<h2>Situations where families seek counselling</h2>
<ul>
<li>Frequent arguments between parents and children, or between siblings.</li>
<li>Tension between generations in joint or extended families.</li>
<li>Disagreements about education, career, marriage or lifestyle choices.</li>
<li>A family member struggling with anxiety, depression or behavioural difficulties.</li>
<li>Adjusting after a major change such as illness, bereavement, separation or relocation.</li>
<li>Communication that has broken down into silence or shouting.</li>
</ul>

<h2>Why family problems are rarely about one person</h2>
<p>When one family member is described as "the problem," it is often a sign that the whole system is under strain. Family therapy looks at how members affect each other, how roles were assigned over time and what each person needs. The aim is not to blame anyone but to understand the pattern and change it together.</p>

<h2>Common patterns therapy can help with</h2>
<h3>The peacemaker</h3>
<p>One person absorbs everyone's feelings and rarely asks for anything.</p>
<h3>Silent withdrawal</h3>
<p>Hurt is never spoken about, and distance grows.</p>
<h3>Control and fear</h3>
<p>Parents worry about the future and tighten control, while children feel unheard and pull away.</p>
<h3>Comparison and expectation</h3>
<p>Being compared with siblings or cousins can quietly damage self-worth. See also ${a("build-self-confidence-and-heal-emotionally", "how to build self-confidence after years of self-criticism")}.</p>
<h3>Unspoken rules</h3>
<p>Some topics become impossible to discuss, so problems go underground.</p>

<h2>What happens in family sessions</h2>
<p>A therapist usually begins by understanding each person's perspective and what they would like to change. Sessions may include structured conversations, practising listening without interrupting, and exploring the needs underneath conflict. Sometimes the therapist also meets members individually. Everyone does not have to agree about everything. The goal is that each person feels heard and that the family finds more workable ways to respond to each other.</p>

<h2>Tips for beginning change at home</h2>
<ul>
<li>Choose a calm moment to talk, not the middle of an argument.</li>
<li>Begin with "I feel" and "I need" rather than "You always" or "You never."</li>
<li>Listen to understand before replying.</li>
<li>Agree on small, specific changes rather than trying to fix everything at once.</li>
<li>Acknowledge effort when you see it.</li>
</ul>

<h2>Respecting different generations</h2>
<p>Differences in values between generations are common, particularly around independence, career and relationships. Counselling can help families respect the intentions behind each generation's views, such as care, security or a wish for freedom, while finding room for each person to be themselves.</p>

<h2>Related situations</h2>
<p>If a teenager is at the centre of the tension, read ${a("teenage-mental-health-warning-signs-for-parents", "teenage mental health warning signs for parents")}. If the strain is mainly between partners, see ${a("marriage-counselling-what-to-expect-and-when-to-start", "marriage and couples counselling")}.</p>

${faqHtml(faqs.family)}

<h2>Take the next step</h2>
<p>If your family could use support, learn more on the ${home("Mind and Soul Klinic website")} or ${book("book a family counselling session")}.</p>

${disclaimer}`,
  },

  {
    title: "Teenage Mental Health: Warning Signs Parents Should Not Ignore",
    slug: "teenage-mental-health-warning-signs-for-parents",
    category: "Teenagers",
    excerpt:
      "Moodiness is part of adolescence, but some changes deserve closer attention. Here is how parents can notice, listen, and seek support.",
    image: "/blog/teenage-mental-health-warning-signs.jpg",
    created_at: new Date("2026-11-04T09:00:00.000Z"),
    content: `<p>Adolescence brings big changes: physical growth, shifting friendships, academic pressure, identity questions and a growing need for independence. Mood swings and privacy are normal. But how do parents tell typical teenage behaviour from signs that their child may need support?</p>

<h2>Quick answer</h2>
<p>Pay attention to changes that are sustained, intense, or affecting your teenager's sleep, studies, friendships, appetite or interest in activities. These changes do not automatically mean a mental health condition, but they are a good reason to listen carefully and consider speaking with a professional.</p>

<h2>Common pressures teenagers face</h2>
<ul>
<li>Academic pressure, competitive exams and comparison with peers.</li>
<li>Friendship conflict, bullying or feeling left out.</li>
<li>Concerns about body image and appearance.</li>
<li>Heavy use of screens and social media.</li>
<li>Family tension or major changes at home.</li>
<li>Questions about identity, belonging and the future.</li>
</ul>

<h2>Signs that may need attention</h2>
<ul>
<li>Persistent sadness, irritability or anger lasting weeks.</li>
<li>Withdrawing from family and friends.</li>
<li>Loss of interest in activities they once enjoyed.</li>
<li>Sleeping far more or far less than usual.</li>
<li>Changes in appetite or eating habits.</li>
<li>A noticeable drop in school performance, or avoiding school.</li>
<li>Frequent headaches or stomach aches without a clear medical cause.</li>
<li>Intense worry, panic or fear of failure.</li>
<li>Risky behaviour or substance use.</li>
<li>Statements of hopelessness or worthlessness, or talk of self-harm or not wanting to live. These always deserve immediate, serious attention.</li>
</ul>
<p>Many of these overlap with the patterns described in our articles on ${a("depression-vs-sadness-when-to-seek-counselling", "depression and sadness")} and ${a("how-to-know-if-you-need-anxiety-counselling", "anxiety")}, which can affect teenagers too.</p>

<h2>How to start a conversation</h2>
<ul>
<li>Choose a calm, private moment, often side by side, such as during a drive or a walk, rather than face to face across a table.</li>
<li>Begin with care, not interrogation: "I have noticed you seem low lately. I am here if you want to talk."</li>
<li>Listen more than you speak, and avoid rushing to fix or lecture.</li>
<li>Validate feelings: "That sounds really hard" helps more than "You should not feel that way."</li>
<li>Respect privacy while keeping the door open.</li>
</ul>

<h2>What to avoid</h2>
<ul>
<li>Dismissing feelings as a phase or an attitude.</li>
<li>Comparing them with siblings or classmates.</li>
<li>Reacting with anger or panic when they share something difficult.</li>
<li>Threatening consequences for opening up.</li>
<li>Pressuring them to talk before they are ready.</li>
</ul>

<h2>When to seek professional help</h2>
<p>Consider speaking with a mental health professional if changes persist for several weeks, if your teenager seems distressed, or if daily functioning is affected. You can begin by speaking with a counsellor or psychologist yourself, and explain to your teenager that therapy is a supportive space, not a punishment. If your teenager mentions self-harm or suicide, seek urgent help from a professional or emergency services immediately.</p>

<h2>What therapy can offer teenagers</h2>
<p>A confidential space where they can speak freely, learn to name and manage emotions, understand stress and thinking patterns, and build confidence. Therapists usually involve parents in appropriate ways while respecting the teenager's need for privacy. When tension at home is part of the picture, ${a("family-counselling-when-conflict-at-home-needs-support", "family counselling")} can help everyone communicate better.</p>

<h2>Looking after yourself as a parent</h2>
<p>Supporting a struggling teenager can be exhausting and frightening. It is normal to feel worried, guilty or helpless. Seeking support for yourself, whether from a friend, a family member or a therapist, helps you stay steady for your child.</p>

${faqHtml(faqs.teen)}

<h2>Take the next step</h2>
<p>If you are worried about your teenager, you do not have to figure it out alone. Learn more on the ${home("Mind and Soul Klinic website")} or ${book("book a session")} to talk it through.</p>

${crisis}
${disclaimer}`,
  },

  {
    title: "Workplace Stress and Burnout: Warning Signs and Ways to Recover",
    slug: "workplace-stress-and-burnout-signs-and-recovery",
    category: "Workplace Wellbeing",
    excerpt:
      "Work stress becomes burnout when pressure is prolonged and recovery is limited. Learn the signs and practical steps to protect your wellbeing.",
    image: "/blog/workplace-stress-burnout-recovery.jpg",
    created_at: new Date("2026-10-31T09:00:00.000Z"),
    content: `<p>Deadlines, targets, long commutes, constant notifications and the expectation to always be available can leave many professionals feeling stretched thin. A stressful week is normal. But when exhaustion and detachment become your baseline, it may be burnout.</p>

<h2>Quick answer</h2>
<p>Burnout is a state of prolonged work-related stress that can involve exhaustion, growing cynicism or detachment from work, and reduced effectiveness. Recovery usually involves both personal changes and addressing workload, boundaries and support. A mental health professional can help you understand what is happening and what to do about it.</p>

<h2>Stress and burnout are not the same</h2>
<p><strong>Stress</strong> usually means feeling overloaded: too much pressure and too little time. You may feel urgent and tense, but still believe things will improve if you can get on top of it.</p>
<p><strong>Burnout</strong> tends to involve feeling drained, disconnected and less able to care. Where stress feels like too much, burnout often feels like not enough left to give. The WHO describes ${ext("https://www.who.int/news/item/28-05-2019-burn-out-an-occupational-phenomenon-international-classification-of-diseases", "burn-out as an occupational phenomenon")} resulting from chronic workplace stress that has not been successfully managed.</p>

<h2>Signs of burnout</h2>
<ul>
<li>Constant exhaustion that rest does not seem to fix.</li>
<li>Dreading work, or feeling detached and cynical about it.</li>
<li>Reduced concentration, motivation or productivity.</li>
<li>Irritability with colleagues, family or friends.</li>
<li>Physical symptoms such as headaches, tension, disturbed sleep or frequent illness.</li>
<li>Feeling ineffective, or that nothing you do matters.</li>
<li>Using food, alcohol or screens to cope.</li>
</ul>
<p>If symptoms are severe or you have physical concerns, consult a doctor as well. Burnout can also overlap with ${a("how-to-know-if-you-need-anxiety-counselling", "anxiety")} and ${a("depression-vs-sadness-when-to-seek-counselling", "depression")}.</p>

<h2>Common contributors</h2>
<ul>
<li>Unrealistic workload or unclear expectations.</li>
<li>Little control over how work is done.</li>
<li>Little recognition or reward.</li>
<li>A culture of long hours and constant availability.</li>
<li>Poor support from managers or colleagues.</li>
<li>Work that conflicts with your values.</li>
<li>Perfectionism and difficulty saying no.</li>
</ul>

<h2>Practical steps you can take</h2>
<ol>
<li><strong>Notice early.</strong> Treat changes in your body, mood and sleep as early indicators.</li>
<li><strong>Protect recovery.</strong> Build clear boundaries around work hours where possible, including switching off notifications in the evening.</li>
<li><strong>Take real breaks.</strong> Step away from your desk, eat properly and move your body during the day.</li>
<li><strong>Clarify priorities.</strong> Talk to your manager about workload and expectations, using specific examples.</li>
<li><strong>Practise negotiating.</strong> For example: "I can do this by Thursday if I move that task to next week."</li>
<li><strong>Reconnect with meaning.</strong> Spend time on the parts of work or life that feel purposeful.</li>
<li><strong>Seek support.</strong> Speak with a trusted colleague, friend or professional.</li>
</ol>

<h2>How therapy can help</h2>
<p>Counselling provides space to understand your stress response, examine perfectionism or people-pleasing patterns, rebuild boundaries and think through decisions about work, such as whether to renegotiate, take leave or change roles. A therapist cannot change your workplace, but can support you in responding to it in healthier ways. If self-doubt is part of the pattern, see ${a("build-self-confidence-and-heal-emotionally", "how to build self-confidence")}. If you are unsure whom to approach, read ${a("how-to-choose-the-right-psychologist-in-delhi", "how to choose a psychologist in Delhi")}.</p>

<h2>For managers and organisations</h2>
<p>Healthy workplaces reduce burnout through realistic workloads, clear expectations, recognition, flexibility and a culture where people can speak up without fear. Small changes, such as respecting off-hours, can make a meaningful difference.</p>

<h2>When to seek help urgently</h2>
<p>If you feel persistently hopeless, unable to function, or have thoughts of harming yourself, seek immediate support from a professional or emergency services.</p>

${faqHtml(faqs.burnout)}

<h2>Take the next step</h2>
<p>If work stress is affecting your health or relationships, support is available. Learn more on the ${home("Mind and Soul Klinic website")} or ${book("book a session")}.</p>

${crisis}
${disclaimer}`,
  },

  {
    title: "What Is Cognitive Hypnotic Psychotherapy? A Plain-Language Guide",
    slug: "what-is-cognitive-hypnotic-psychotherapy",
    category: "Therapy",
    excerpt:
      "Cognitive hypnotic psychotherapy combines work on thoughts and beliefs with guided relaxation. Here is what it involves, what it does not, and what to ask.",
    image: "/blog/cognitive-hypnotic-psychotherapy-guide.jpg",
    created_at: new Date("2026-10-27T09:00:00.000Z"),
    content: `<p>If you have come across the phrase "cognitive hypnotic psychotherapy," you may be wondering what it means, whether it is safe and whether it is right for you. This guide offers a plain-language overview. It is general information, not a substitute for a professional assessment.</p>

<h2>Quick answer</h2>
<p>Cognitive hypnotic psychotherapy is an approach that combines cognitive work, which focuses on thoughts, beliefs and patterns, with guided, focused relaxation (sometimes called hypnosis) so that a person can work with thoughts and emotions in a calm, concentrated state. It is used alongside conversation, not instead of it.</p>

<h2>What "cognitive" means here</h2>
<p>The cognitive part of therapy looks at how thoughts, beliefs and interpretations influence feelings and behaviour. For example, someone who believes "I always fail" may feel anxious and avoid challenges. Cognitive work helps identify such thoughts, examine how accurate or helpful they are, and develop more balanced alternatives.</p>

<h2>What "hypnotic" means here</h2>
<p>In a therapeutic setting, hypnosis is a state of focused attention and deep relaxation, guided by the therapist. It is very different from stage hypnosis. You are not unconscious, and most people remain aware of what is happening and can choose to stop at any time. A trained therapist works with your consent and does not take control of you.</p>

<h2>How the two can work together</h2>
<p>In a typical process, the therapist first talks with you to understand your concerns, goals and history. Where appropriate, relaxation and guided imagery can help you become calm and focused, making it easier to reflect on thoughts and feelings, practise new ways of responding and strengthen helpful beliefs. Techniques may include:</p>
<ul>
<li><strong>Thought restructuring:</strong> replacing unhelpful thoughts with more realistic ones.</li>
<li><strong>Emotional anchoring:</strong> linking a calm or confident state with a cue you can use in daily life.</li>
<li><strong>Exploring earlier experiences:</strong> gently looking at experiences that shape present beliefs, sometimes described as inner child work.</li>
</ul>
<p>The exact techniques differ between therapists, so ask yours how they use the approach.</p>

<h2>Concerns people often explore with this approach</h2>
<ul>
<li>Stress and anxiety. See also ${a("how-to-know-if-you-need-anxiety-counselling", "when anxiety needs counselling")}.</li>
<li>Self-confidence and self-esteem, covered in ${a("build-self-confidence-and-heal-emotionally", "building self-confidence and healing emotionally")}.</li>
<li>Unhelpful habits or emotional patterns, including emotional eating.</li>
<li>Guilt, shame and self-criticism.</li>
<li>Emotional healing from past experiences.</li>
</ul>

<h2>What it is not</h2>
<ul>
<li>It is not a magic cure, and no responsible therapist guarantees results.</li>
<li>It is not mind control.</li>
<li>It is not suitable for everyone. A professional should assess whether it is appropriate for you.</li>
<li>It does not replace medical treatment where that is needed.</li>
</ul>

<h2>Is it evidence-based?</h2>
<p>Evidence for different approaches varies, and research on combining cognitive therapy with hypnosis continues to develop. It is reasonable to ask your therapist about their training, how they use the approach and how progress will be reviewed. Be cautious about any claims of guaranteed or dramatic outcomes.</p>

<h2>Questions to ask a therapist</h2>
<ul>
<li>What is your training in this approach?</li>
<li>How would it be used in my case?</li>
<li>What will a session look like?</li>
<li>How will we know whether it is helping?</li>
<li>Are there reasons it may not suit me?</li>
</ul>
<p>Our guide to ${a("how-to-choose-the-right-psychologist-in-delhi", "choosing the right psychologist in Delhi")} has more questions you can use.</p>

<h2>Who should be cautious</h2>
<p>People experiencing severe mental health symptoms, certain psychiatric conditions or a history of trauma should speak with a qualified professional before starting hypnosis-based work, so that it is used safely and at an appropriate pace.</p>

${faqHtml(faqs.hypno)}

<h2>Take the next step</h2>
<p>To learn more about the approaches we use, visit the ${home("Mind and Soul Klinic website")}. You can also ${book("book a first session")} to discuss whether this approach may suit you.</p>

${disclaimer}`,
  },

  {
    title: "How to Build Self-Confidence and Heal Emotionally After Years of Self-Criticism",
    slug: "build-self-confidence-and-heal-emotionally",
    category: "Self-Confidence",
    excerpt:
      "Confidence is built, not found. Learn how self-criticism develops and practical steps to treat yourself with more steadiness and respect.",
    image: "/blog/build-self-confidence-emotional-healing.jpg",
    created_at: new Date("2026-10-23T09:00:00.000Z"),
    content: `<p>Many people carry a harsh inner voice that says "not good enough," "you should have done better," or "who do you think you are?" Over time, this voice can shape choices, relationships and how much space you allow yourself to take up.</p>

<h2>Quick answer</h2>
<p>Self-confidence grows through repeated experiences of acting despite doubt, treating yourself fairly, and healing the beliefs that formed from earlier criticism or comparison. Therapy can help you understand where these beliefs came from and practise new ways of relating to yourself.</p>

<h2>How self-criticism develops</h2>
<p>Self-criticism rarely appears from nowhere. It may develop through critical parenting, comparison with siblings or peers, bullying, academic pressure, cultural expectations, or experiences in which mistakes felt unsafe. Sometimes being hard on yourself once felt like a way to avoid being criticised by others. What helped you cope earlier can become a burden later.</p>

<h2>Signs of low self-confidence</h2>
<ul>
<li>Difficulty accepting compliments.</li>
<li>Constant comparison with others.</li>
<li>Fear of making mistakes or being judged.</li>
<li>Over-apologising or people-pleasing.</li>
<li>Avoiding opportunities because you doubt yourself.</li>
<li>Difficulty making decisions or trusting your own judgement.</li>
</ul>

<h2>Confidence versus self-esteem</h2>
<p>Self-esteem is how you value yourself. Confidence is trust in your ability to handle a situation. They are connected but not identical: you can be skilled and still feel unworthy, or feel worthy but unsure in a new task. Both can grow with practice and support.</p>

<h2>Practical steps to build confidence</h2>
<ol>
<li><strong>Notice your self-talk.</strong> For a week, write down the harsh sentences you say to yourself. Awareness comes before change.</li>
<li><strong>Ask what you would say to a friend.</strong> Most people speak far more kindly to others than to themselves.</li>
<li><strong>Replace global judgements with specifics.</strong> Instead of "I am useless," try "I struggled with this task, and here is what I can learn."</li>
<li><strong>Keep a record of evidence.</strong> Write down tasks completed, challenges handled and kind feedback received.</li>
<li><strong>Take small, repeated actions.</strong> Confidence grows from doing, not from waiting to feel ready.</li>
<li><strong>Practise setting boundaries.</strong> A clear, respectful no is an act of self-respect.</li>
<li><strong>Reduce comparison.</strong> Social media shows highlights, not whole lives. Notice how it affects your mood and adjust your use.</li>
<li><strong>Care for your body.</strong> Sleep, movement and regular meals support emotional stability.</li>
</ol>

<h2>Healing the roots</h2>
<p>Sometimes confidence does not improve through tips alone because the beliefs run deeper. If criticism, shame or old experiences keep resurfacing, therapy can help you explore where these beliefs came from, how they affect you now, and how to gradually replace them with more accurate and compassionate ones. Some people explore this through approaches such as ${a("what-is-cognitive-hypnotic-psychotherapy", "cognitive hypnotic psychotherapy")}. Healing does not mean erasing the past. It means changing how much power it has over your present.</p>

<h2>Self-compassion is not self-indulgence</h2>
<p>Many people fear that being kind to themselves will make them lazy or complacent. In practice, self-compassion tends to make it easier to try, to fail and to try again, because mistakes feel less threatening. It means speaking to yourself with the same steadiness you would offer someone you care about.</p>

<h2>When to seek support</h2>
<p>Consider speaking with a professional if self-criticism feels constant, is affecting your relationships or work, or is connected with low mood, anxiety or painful memories. Our articles on ${a("depression-vs-sadness-when-to-seek-counselling", "depression versus sadness")} and ${a("how-to-know-if-you-need-anxiety-counselling", "anxiety counselling")} can help you tell what you may be experiencing.</p>

${faqHtml(faqs.confidence)}

<h2>Take the next step</h2>
<p>If you would like support, learn more on the ${home("Mind and Soul Klinic website")} or ${book("book a session")}.</p>

${crisis}
${disclaimer}`,
  },

  {
    title: "Online Counselling in Delhi NCR: Does It Work and How to Get Started",
    slug: "online-counselling-in-delhi-ncr-does-it-work",
    category: "Therapy",
    excerpt:
      "Online counselling can be a practical and effective way to access support. Here is how it works, who it suits, and how to prepare for your first session.",
    image: "/blog/online-counselling-delhi-ncr.jpg",
    created_at: new Date("2026-10-19T09:00:00.000Z"),
    content: `<p>Between traffic, work schedules and family responsibilities, getting to a therapist's office can feel like one more task on a long list. Online counselling offers an alternative: sessions by video or phone from a space that suits you.</p>

<h2>Quick answer</h2>
<p>Online counselling is therapy delivered through video or audio calls. Many people find it convenient and helpful for concerns such as stress, anxiety, low mood and relationship difficulties, though it is not suitable for every situation. A professional can help you decide whether online or in-person sessions suit you better.</p>

<h2>How online counselling works</h2>
<p>You book a session, receive a link or call details, and meet your therapist at the agreed time. The structure is similar to in-person therapy: you talk, reflect and work on your concerns together. Sessions generally last the same length as in-person ones, and your therapist should explain how privacy and confidentiality are protected.</p>

<h2>Benefits</h2>
<ul>
<li><strong>Convenience:</strong> no commute, which can make regular attendance easier.</li>
<li><strong>Accessibility:</strong> helpful for people with busy schedules, mobility limitations or caring responsibilities.</li>
<li><strong>Comfort:</strong> some people find it easier to open up from a familiar environment.</li>
<li><strong>Flexibility:</strong> it can be possible to continue sessions while travelling or after relocating.</li>
<li><strong>Wider choice:</strong> you are not limited to professionals nearest to you.</li>
</ul>

<h2>Limitations to be aware of</h2>
<ul>
<li><strong>Privacy at home:</strong> you need a space where you can speak without being overheard.</li>
<li><strong>Technology:</strong> a stable internet connection and a working device are needed.</li>
<li><strong>Fewer non-verbal cues:</strong> some subtle body language is harder to read on screen.</li>
<li><strong>Not suitable for everyone:</strong> severe distress, risk of harm or certain conditions may need in-person or more intensive support.</li>
</ul>

<h2>Who may find it suitable</h2>
<p>Online counselling is often considered for stress, ${a("how-to-know-if-you-need-anxiety-counselling", "anxiety")}, low mood, ${a("marriage-counselling-what-to-expect-and-when-to-start", "relationship issues")}, ${a("workplace-stress-and-burnout-signs-and-recovery", "work pressure")} and life transitions. If you are unsure, discuss it with the therapist at the start.</p>

<h2>Does it work?</h2>
<p>Many people find online therapy helpful, and research on its effectiveness for a number of common concerns continues to grow. As with in-person therapy, outcomes depend on the concern, the therapeutic relationship and your engagement, and results cannot be guaranteed.</p>

<h2>How to prepare for your first online session</h2>
<ul>
<li>Choose a quiet, private space and let others at home know you should not be disturbed.</li>
<li>Test your device, camera, microphone and internet connection beforehand.</li>
<li>Use headphones if you can, for clarity and privacy.</li>
<li>Keep water and a notebook nearby.</li>
<li>Think about what you would like to talk about, but do not worry if you cannot organise it perfectly.</li>
<li>Give yourself a few minutes before and after the session to settle.</li>
</ul>

<h2>Making online therapy work for you</h2>
<ul>
<li>Keep sessions at a consistent time to build a routine.</li>
<li>Close other tabs and silence notifications.</li>
<li>Be honest if the format is not working. Adjustments or a different format may help.</li>
</ul>

<h2>Choosing an online therapist</h2>
<p>The same principles apply as for in-person therapy: check qualifications and training, ask about their approach, and notice whether you feel heard and respected. Our guide to ${a("how-to-choose-the-right-psychologist-in-delhi", "choosing a psychologist in Delhi")} has a full checklist, including questions about fees, cancellation policy and confidentiality.</p>

<h2>Online or in-person?</h2>
<p>Neither is better for everyone. Some people prefer to meet in person in South Delhi or nearby, others prefer online sessions, and some combine both. The best format is the one you can attend consistently and where you feel comfortable.</p>

${faqHtml(faqs.online)}

<h2>Take the next step</h2>
<p>If you would like to begin, learn more on the ${home("Mind and Soul Klinic website")} and ${book("book a session")}. Mention if you would prefer online or in-person sessions.</p>

${disclaimer}`,
  },
];

/* ------------------------------------------------------------------ */
/* SEO metadata keyed by slug                                          */
/* ------------------------------------------------------------------ */

export const blogSeoMeta = {
  "how-to-know-if-you-need-anxiety-counselling": {
    metaTitle: "Do You Need Anxiety Counselling? Signs & Help | M.A.S.K.",
    metaDescription: "Unsure whether your worry is normal or needs support? Learn the signs of anxiety, what counselling involves, and how to take the next step.",
    primaryKeyword: "anxiety counselling in Delhi",
    secondaryKeywords: ["signs of anxiety", "when to see a psychologist for anxiety", "anxiety therapy Delhi NCR"],
    longTailKeywords: ["how do I know if I need counselling for anxiety", "is my anxiety normal or a disorder"],
    imageAlt: "Person sitting quietly by a window reflecting on anxious thoughts",
    imageFilename: "anxiety-counselling-signs-delhi.jpg",
    social: { title: "Is it worry, or anxiety that needs support?", description: "The signs of anxiety, what counselling involves and when to reach out." },
    relatedSlugs: ["workplace-stress-and-burnout-signs-and-recovery", "what-is-cognitive-hypnotic-psychotherapy", "how-to-choose-the-right-psychologist-in-delhi"],
    faqs: faqs.anxiety,
  },
  "depression-vs-sadness-when-to-seek-counselling": {
    metaTitle: "Depression vs Sadness: Differences & When to Seek Help",
    metaDescription: "How can you tell sadness from depression? Understand the key differences, warning signs, and when counselling may help.",
    primaryKeyword: "depression vs sadness",
    secondaryKeywords: ["signs of depression", "depression counselling in Delhi", "when to see a therapist for depression"],
    longTailKeywords: ["am I sad or depressed", "difference between sadness and depression"],
    imageAlt: "Person looking out of a window on a grey day",
    imageFilename: "depression-vs-sadness-counselling.jpg",
    social: { title: "Sad, or depressed? How to tell the difference", description: "Key differences, warning signs and when counselling can help." },
    relatedSlugs: ["build-self-confidence-and-heal-emotionally", "teenage-mental-health-warning-signs-for-parents", "how-to-choose-the-right-psychologist-in-delhi"],
    faqs: faqs.depression,
  },
  "how-to-choose-the-right-psychologist-in-delhi": {
    metaTitle: "How to Choose the Right Psychologist in Delhi | M.A.S.K.",
    metaDescription: "A practical guide to choosing a psychologist or counsellor: qualifications, approach, questions to ask and red flags to watch for.",
    primaryKeyword: "how to choose a psychologist in Delhi",
    secondaryKeywords: ["counselling psychologist in Delhi", "psychotherapy in South Delhi", "psychologist vs counsellor vs psychiatrist"],
    longTailKeywords: ["questions to ask a therapist in first session", "how to find a good therapist in Delhi"],
    imageAlt: "Therapist and client in a calm consultation room",
    imageFilename: "choose-psychologist-delhi-guide.jpg",
    social: { title: "Choosing a psychologist in Delhi: a simple checklist", description: "Qualifications, approach, questions to ask and red flags." },
    relatedSlugs: ["online-counselling-in-delhi-ncr-does-it-work", "what-is-cognitive-hypnotic-psychotherapy", "how-to-know-if-you-need-anxiety-counselling"],
    faqs: faqs.choose,
  },
  "marriage-counselling-what-to-expect-and-when-to-start": {
    metaTitle: "Marriage Counselling: What to Expect & When to Start",
    metaDescription: "Wondering if couples counselling is right for you? Learn when to start, what sessions involve and how therapy supports communication.",
    primaryKeyword: "marriage counselling in Delhi",
    secondaryKeywords: ["couples therapy Delhi", "relationship counselling in Delhi", "signs you need marriage counselling"],
    longTailKeywords: ["when should couples start counselling", "what happens in a marriage counselling session"],
    imageAlt: "Couple talking together during a counselling session",
    imageFilename: "marriage-counselling-what-to-expect.jpg",
    social: { title: "Marriage counselling: what to expect and when to start", description: "It is not only for relationships on the edge. Here is how it works." },
    relatedSlugs: ["family-counselling-when-conflict-at-home-needs-support", "how-to-choose-the-right-psychologist-in-delhi", "online-counselling-in-delhi-ncr-does-it-work"],
    faqs: faqs.marriage,
  },
  "family-counselling-when-conflict-at-home-needs-support": {
    metaTitle: "Family Counselling: When Conflict at Home Needs Help",
    metaDescription: "Frequent arguments or distance at home? Understand how family counselling works and how it can improve communication.",
    primaryKeyword: "family counselling in Delhi",
    secondaryKeywords: ["family therapy Delhi", "parent child conflict counselling", "joint family stress"],
    longTailKeywords: ["how does family therapy work", "when should a family see a counsellor"],
    imageAlt: "Family members seated together in conversation",
    imageFilename: "family-counselling-delhi.jpg",
    social: { title: "When conflict at home needs support", description: "How family counselling helps everyone feel heard." },
    relatedSlugs: ["teenage-mental-health-warning-signs-for-parents", "marriage-counselling-what-to-expect-and-when-to-start", "build-self-confidence-and-heal-emotionally"],
    faqs: faqs.family,
  },
  "teenage-mental-health-warning-signs-for-parents": {
    metaTitle: "Teenage Mental Health: Warning Signs for Parents",
    metaDescription: "Learn the signs of a struggling teen, how to start supportive conversations and when to seek professional help.",
    primaryKeyword: "teenage mental health",
    secondaryKeywords: ["teen counselling Delhi", "signs of depression in teenagers", "adolescent therapy Delhi NCR"],
    longTailKeywords: ["how to know if my teenager needs therapy", "how to talk to a teenager about mental health"],
    imageAlt: "Parent talking calmly with a teenager",
    imageFilename: "teenage-mental-health-warning-signs.jpg",
    social: { title: "Teen mental health: signs parents should not ignore", description: "How to notice, listen and seek support." },
    relatedSlugs: ["family-counselling-when-conflict-at-home-needs-support", "depression-vs-sadness-when-to-seek-counselling", "how-to-know-if-you-need-anxiety-counselling"],
    faqs: faqs.teen,
  },
  "workplace-stress-and-burnout-signs-and-recovery": {
    metaTitle: "Workplace Stress & Burnout: Signs and Recovery",
    metaDescription: "Feeling drained by work? Understand the difference between stress and burnout, recognise the signs and learn steps to recover.",
    primaryKeyword: "burnout counselling",
    secondaryKeywords: ["workplace stress management", "signs of burnout", "stress counselling Delhi"],
    longTailKeywords: ["difference between stress and burnout", "how to recover from burnout"],
    imageAlt: "Tired professional at a desk late in the evening",
    imageFilename: "workplace-stress-burnout-recovery.jpg",
    social: { title: "Stress or burnout? Signs and ways to recover", description: "Practical steps to protect your wellbeing at work." },
    relatedSlugs: ["how-to-know-if-you-need-anxiety-counselling", "build-self-confidence-and-heal-emotionally", "how-to-choose-the-right-psychologist-in-delhi"],
    faqs: faqs.burnout,
  },
  "what-is-cognitive-hypnotic-psychotherapy": {
    metaTitle: "What Is Cognitive Hypnotic Psychotherapy? | M.A.S.K.",
    metaDescription: "A plain-language guide to cognitive hypnotic psychotherapy: how it works, what it is not, who it may suit and questions to ask a therapist.",
    primaryKeyword: "cognitive hypnotic psychotherapy",
    secondaryKeywords: ["hypnotherapy in Delhi", "hypnosis therapy explained", "hypnotherapy for anxiety"],
    longTailKeywords: ["is therapeutic hypnosis safe", "how does cognitive hypnotherapy work"],
    imageAlt: "Calm therapy room with a comfortable chair",
    imageFilename: "cognitive-hypnotic-psychotherapy-guide.jpg",
    social: { title: "What is cognitive hypnotic psychotherapy?", description: "A plain-language guide to how it works and what to ask." },
    relatedSlugs: ["build-self-confidence-and-heal-emotionally", "how-to-know-if-you-need-anxiety-counselling", "how-to-choose-the-right-psychologist-in-delhi"],
    faqs: faqs.hypno,
  },
  "build-self-confidence-and-heal-emotionally": {
    metaTitle: "Build Self-Confidence and Heal Emotionally | M.A.S.K.",
    metaDescription: "Learn how self-criticism develops and practical steps to build self-confidence, with guidance on when therapy can help.",
    primaryKeyword: "how to build self-confidence",
    secondaryKeywords: ["low self-esteem therapy", "stop self-criticism", "emotional healing counselling"],
    longTailKeywords: ["how to stop being so hard on yourself", "why do I have low self-confidence"],
    imageAlt: "Person standing confidently looking toward the sunrise",
    imageFilename: "build-self-confidence-emotional-healing.jpg",
    social: { title: "Building self-confidence after years of self-criticism", description: "Where the inner critic comes from and how to change it." },
    relatedSlugs: ["what-is-cognitive-hypnotic-psychotherapy", "depression-vs-sadness-when-to-seek-counselling", "workplace-stress-and-burnout-signs-and-recovery"],
    faqs: faqs.confidence,
  },
  "online-counselling-in-delhi-ncr-does-it-work": {
    metaTitle: "Online Counselling in Delhi NCR: Does It Work?",
    metaDescription: "How does online therapy work, who is it suited to and how do you prepare? A practical guide for people in Delhi NCR.",
    primaryKeyword: "online counselling in Delhi NCR",
    secondaryKeywords: ["online therapy India", "video counselling", "online psychologist Delhi"],
    longTailKeywords: ["is online therapy effective", "how to prepare for an online therapy session"],
    imageAlt: "Person attending an online counselling session on a laptop at home",
    imageFilename: "online-counselling-delhi-ncr.jpg",
    social: { title: "Online counselling in Delhi NCR: does it work?", description: "Benefits, limits and how to prepare for your first session." },
    relatedSlugs: ["how-to-choose-the-right-psychologist-in-delhi", "how-to-know-if-you-need-anxiety-counselling", "marriage-counselling-what-to-expect-and-when-to-start"],
    faqs: faqs.online,
  },
};

/* ------------------------------------------------------------------ */
/* Helpers: table of contents + JSON-LD schema                         */
/* Render the schema in a <script type="application/ld+json"> tag.     */
/* Only use schema that matches visible page content.                  */
/* ------------------------------------------------------------------ */

const strip = (html) => html.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();

export function getToc(content) {
  const out = [];
  const re = /<h2>(.*?)<\/h2>/g;
  let m;
  while ((m = re.exec(content))) {
    const text = strip(m[1]);
    out.push({ text, id: text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") });
  }
  return out;
}

export function getSchemas(blog) {
  const meta = blogSeoMeta[blog.slug];
  const url = `${BLOG_BASE}/${blog.slug}`;
  const org = { "@type": "Organization", name: "Mind and Soul Klinic", url: SITE };
  return {
    article: {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: blog.title,
      description: meta.metaDescription,
      mainEntityOfPage: url,
      datePublished: blog.created_at.toISOString(),
      author: org,
      publisher: org,
    },
    faq: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: meta.faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
    breadcrumb: {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
        { "@type": "ListItem", position: 2, name: "Blog", item: BLOG_BASE },
        { "@type": "ListItem", position: 3, name: blog.title, item: url },
      ],
    },
  };
}