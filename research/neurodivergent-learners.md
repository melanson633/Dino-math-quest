# Neurodivergent Learners: Educational Game Patterns for Dino Math Quest

## Scope

- Audience lens: ADHD, autism spectrum, sensory-sensitive, and executive-function differences.
- Product lens: Dino Math Quest as a tablet-first preschool learning game.
- Design target: predictability, autonomy, low sensory load, and independent play.
- Recommendations should not medicalize the game or expose diagnostic labels.
- Evidence priority: autism/ADHD edtech, HCI accessibility studies, systematic reviews, and WCAG guidance.
- Practical priority: changes that make the current loop calmer, clearer, and more controllable.
- Main design question: how can the game be easier to regulate and predict?
- Secondary question: how can feedback stay motivating without surprise overload?

## Sources Reviewed

- *Interactive visual supports for children with autism*, Personal and Ubiquitous Computing, 2010.
- URL: https://link.springer.com/article/10.1007/s00779-010-0294-8
- Evidence type: peer-reviewed HCI and autism design study.

- *Classroom-based assistive technology: helping children with autism spectrum disorders in the classroom*, CHI 2011.
- URL: https://dl.acm.org/doi/10.1145/1978942.1978944
- Evidence type: peer-reviewed assistive-tech field study.

- *Method for the Development of Accessible Mobile Serious Games for Children with Autism Spectrum Disorder*, IJERPH, 2022.
- URL: https://www.mdpi.com/1660-4601/19/7/3844
- Evidence type: accessibility and serious-game design method.

- *Effectiveness of Technology-Based Interventions for School-Age Children With ADHD*, JMIR Mental Health, 2023.
- URL: https://mental.jmir.org/2023/1/e51459
- Evidence type: systematic review and meta-analysis.

- *Video games for the treatment of autism spectrum disorder*, Journal of Autism and Developmental Disorders, 2021.
- URL: https://link.springer.com/article/10.1007/s10803-021-04934-9
- Evidence type: systematic review.

- *Cognality VR*, CHI 2022 Extended Abstracts.
- URL: https://dl.acm.org/doi/fullHtml/10.1145/3491101.3519742
- Evidence type: sensory regulation design case study and stakeholder interviews.

- *Web Content Accessibility Guidelines 2.2*, W3C, 2023.
- URL: https://www.w3.org/TR/2023/REC-WCAG22-20231005/
- Evidence type: accessibility standard.

- *Understanding WCAG 2.2: Pause, Stop, Hide*, W3C WAI.
- URL: https://www.w3.org/WAI/WCAG21/Understanding/pause-stop-hide
- Evidence type: accessibility implementation guidance.

- *Understanding WCAG 2.2: Animation from Interactions*, W3C WAI.
- URL: https://w3c.github.io/wcag21/understanding/animation-from-interactions
- Evidence type: motion accessibility guidance.

- *Motion*, web.dev.
- URL: https://web.dev/learn/accessibility/motion
- Evidence type: accessibility guidance.

## Key Principles

- Predictability lowers cognitive load and transition stress.
- Visual supports can reduce reliance on spoken or written instructions.
- Autonomy helps, especially when choices are small and bounded.
- Sensory intensity should be adjustable: sound, music, motion, and visual density.
- Retry loops should be stable, immediate, and non-punitive.
- Consistency beats novelty when the child is regulating attention or sensory input.
- Rewards should be legible and expected rather than random or startling.
- Time pressure is risky and usually unnecessary for early learning.
- Technology is most useful when it supports independence.
- Evidence is strongest for proximal engagement and access, not broad clinical outcomes.

## Concrete Mechanic Patterns

- Add a compact "Now / Next" visual strip during play.
- Use the same puzzle layout after wrong answers so retry does not feel like a new task.
- Add a visible replay prompt button for instructions and audio models.
- Add Calm Mode with reduced motion, quieter audio, and simpler celebrations.
- Separate music, sound effects, and voice controls where possible.
- Avoid countdowns, forced urgency, and rapid auto-advance.
- Make reward progress visible before unlocks, such as "2 more to find a dino."
- Use consistent iconography for math, shapes, patterns, Dino Den, mute, and settings.
- Keep touch targets stable after tapping; avoid layout shifts from feedback labels.
- Let the child choose between two next activities at transition points.
- Provide opt-in bigger celebrations instead of forcing high-motion rewards.
- Use familiar repeated audio motifs instead of constant musical variation.

## Applicability to Dino-Quest

- The three-choice answer layout is already a good low-choice-load default.
- The current wrong-answer flow is gentle, but hint and retry states should remain visually stable.
- The current celebration overlay may need a reduced-motion alternative.
- The existing mute button is useful but may not be enough for sensory-sensitive sessions.
- A Calm Mode setting would support many learners without changing the game identity.
- A Now / Next strip can help Charlotte predict the loop without adult reading.
- Dino unlock progress should be visible enough to reduce uncertainty.
- Top-bar icons should communicate function consistently through shape, position, and optional labels.
- Speech prompts should be replayable and optional, not one-time or blocking.
- Tablet portrait layout should avoid cramped prompt/top-bar overlap.
- Avoid sudden screen changes after correct answers; let the transition feel expected.
- New modes should be opt-in, reversible, and framed as play preferences.

## Recommended Experiments

- Add Calm Mode and compare completion, retries, and caregiver feedback.
- Add a Now / Next strip to puzzle screens and observe hesitation or adult prompts.
- Replace one high-motion celebration with a low-motion confirmation state.
- Add replay prompt and hear-again controls for puzzle text and speech models.
- Add a simple audio panel: mute, quieter, music off.
- Add visible dino-unlock progress on the home or puzzle screen.
- Add a two-choice transition after a reward: next puzzle or Dino Den.
- Test a no-auto-advance variant after correct answers.

## Confidence And Gaps

- Confidence is high for predictability, visual supports, sensory controls, and stable retry.
- Confidence is medium for reward and choice patterns because evidence often comes from classrooms.
- ADHD-specific digital intervention evidence is mostly school-age, not preschool.
- Direct research on commercial-style preschool math games for neurodivergent children is limited.
- Some sensory recommendations are inferred from broader accessibility and VR/media studies.
- The safest product stance is universal design: make controls available without labels or diagnosis.

