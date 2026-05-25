# Speech-Delay Learners: Educational Game Patterns for Dino Math Quest

## Scope

- Audience lens: young children with speech or language delays.
- Product lens: Dino Math Quest for Charlotte, a bright 4-year-old with speech-delay support needs.
- Speech support should be optional, gentle, rhythmic, and nonclinical.
- The math game should remain fully playable without speaking.
- Research target: rhythm, repetition, syllable support, phonological awareness, and tablet play.
- Evidence priority: SLP-adjacent research, systematic reviews, ASHA/NIDCD guidance, and serious-game studies.
- Practical priority: mechanics that fit the current Dino Den, audio, and puzzle loops.
- Main design question: how can Dino-Quest add speech confidence without becoming therapy software?

## Sources Reviewed

- *Application of Digital Games for Speech Therapy in Children*, Journal of Healthcare Engineering, 2022.
- URL: https://pmc.ncbi.nlm.nih.gov/articles/PMC9061057/
- Evidence type: systematic review.

- *Therapeutic Serious Game Design Guidelines for Stimulating Cognitive Abilities of Children with Speech and Language Delay*, JICT, 2017.
- URL: https://e-journal.uum.edu.my/index.php/jict/article/view/8233
- Evidence type: literature and expert-informed design guidelines.

- *A Longitudinal Evaluation of Tablet-Based Child Speech Therapy with Apraxia World*, ACM TACCESS, 2021.
- URL: https://doi.org/10.1145/3433607
- Evidence type: longitudinal tablet-game intervention study.

- *Regular rhythmic primes improve sentence repetition in children with developmental language disorder*, npj Science of Learning, 2023.
- URL: https://doi.org/10.1038/s41539-023-00170-1
- Evidence type: experimental study.

- *Associations among Variables in Technology-Enhanced Phonological Awareness Programmes*, Education Sciences, 2024.
- URL: https://www.mdpi.com/2227-7102/14/4/343
- Evidence type: meta-analysis.

- *To Game or Not to Game? Efficacy of Using Tablet Games in Vocabulary Intervention for Children with DLD*, Applied Sciences, 2022.
- URL: https://www.mdpi.com/2076-3417/12/3/1643
- Evidence type: randomized controlled trial.

- *Design and evaluation of a serious video game to treat preschool children with speech sound disorders*, Scientific Reports, 2024.
- URL: https://www.nature.com/articles/s41598-024-68119-x
- Evidence type: design and usability evaluation.

- *Phonological Disorders in Children? Design and user experience evaluation of a mobile serious game approach*, Procedia Computer Science, 2017.
- URL: https://www.sciencedirect.com/science/article/pii/S1877050917317696
- Evidence type: prototype and user experience study.

- *Speech Sound Disorders: Articulation and Phonology*, ASHA Practice Portal.
- URL: https://asha.org/practice-portal/clinical-topics/articulation-and-phonology/
- Evidence type: clinical guidance.

- *Childhood Apraxia of Speech*, ASHA Practice Portal.
- URL: https://www.asha.org/Practice-Portal/Clinical-Topics/Childhood-Apraxia-of-Speech/
- Evidence type: clinical guidance.

- *Developmental Language Disorder*, NIDCD.
- URL: https://www.nidcd.nih.gov/health/developmental-language-disorder
- Evidence type: federal health guidance.

## Key Principles

- Speech support should be additive, never a gate to progress.
- Short, predictable repetition is useful; long drills risk fatigue.
- Rhythm and beat can prime language tasks and make repetition feel playful.
- Syllable-first modeling can reduce pressure around hard words.
- Visual and audio cues together are stronger than speech-only prompting.
- Immediate praise should reward effort, imitation, and participation.
- Parent co-play can help, but the child should still navigate independently.
- Speech recognition should not be trusted as the core scoring mechanism.
- Technology is better supported for phonological awareness than guaranteed speech production gains.
- A math-first PWA should use speech as confidence support, not diagnosis or treatment.

## Concrete Mechanic Patterns

- Add an optional "hear it" button on prompts so the child can replay instructions.
- Add short rhythmic cues before speech moments: two or three beat dots, then the model word.
- Break dino names into syllables visually and audibly: "Steg-o-saur-us" or "woo-lly."
- Keep each speech prompt skippable with a visible continue path.
- After a correct answer, occasionally offer a bonus echo: "Say dino with Tri."
- Use one target sound per mini-session so practice stays focused.
- Put hard sounds into friendly phrases, such as "long leaf" or "woolly wow."
- Use call-and-response in Dino Den, where a dino models a word and waits.
- Reward attempts with warmth rather than scoring pronunciation.
- Use a parent setting for target sounds, but hide it from the main child path.
- Avoid ASR-dependent pass/fail mechanics; if ASR is ever added, use it as soft feedback only.
- Pair speech moments with visible beat dots or clap cues instead of long written instructions.

## Applicability to Dino-Quest

- Dino-Quest already has synthesized audio hooks that can support rhythm and prompts.
- The current answer flow works without speech, which is exactly the right baseline.
- Dino Den is the best place for repeated practice because it is reward-oriented and optional.
- Hard sounds like L and W can appear in dino facts, habitat labels, and short reward phrases.
- "Tap to hear" should be available on shape prompts because those prompts currently rely on reading.
- Speech support should not increase puzzle difficulty or slow every round.
- Charlotte's visual memory suggests syllable cards and beat dots may be especially effective.
- A no-fail speech bonus after a win fits the current confidence-building tone.
- Parent controls should select targets but not create clinical-looking dashboards.
- The audio warning noted in exploration should be fixed before relying on speech support.
- Music should support rhythm but avoid playing over modeled words.
- The safest first step is speech modeling, not speech assessment.

## Recommended Experiments

- Add tap-to-hear prompt replay for shapes and observe whether adult reading decreases.
- Add a short dino-name syllable chant after every third correct answer.
- Add one Dino Den echo interaction for unlocked dinos and keep it fully optional.
- Test beat-dot animation before a word versus audio-only modeling.
- Add parent-selectable target sounds for L and W, stored locally.
- Try a "practice cave" where the child can repeat words without affecting progress.
- Compare generic praise with effort-specific speech praise: "Nice try saying long."
- Test whether speech prompts after wins feel rewarding or interrupt the math loop.

## Confidence And Gaps

- Confidence is high for optionality, repetition, rhythm, visual support, and no-fail design.
- Confidence is medium for speech gains from a casual game outside clinical context.
- Evidence is limited for English L/W support inside a math-first preschool game.
- Many speech-game studies are small or therapy-oriented.
- ASR remains a major implementation risk on iPad, especially in noisy rooms.
- Dino-Quest should frame speech features as playful confidence support, not treatment.

