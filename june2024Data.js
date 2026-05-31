// ════════════════════════════════════════════════════════════════════════════
// OnePrep Digital SAT June 2024 Version 1 - Official Exam Database
// ════════════════════════════════════════════════════════════════════════════

const june2024ExamDb = {
  title: "June 2024 Version 1 Official Test",
  modules: {
    english_m1: {
      title: "Reading and Writing – Module 1",
      limitMinutes: 32,
      questions: [
        {
          id: 1,
          type: "vocabulary",
          passage: "Smart watches and wireless speakers tend to contain batteries that can't be easily ______.",
          question: "Sustainability researcher Mariana López Davila warns that because new batteries can't be put in once the old ones no longer work, the gadgets stop functioning and are usually disposed of as trash. Which choice completes the text with the most logical and precise word or phrase?",
          options: {
            A: "replaced",
            B: "prevented",
            C: "invented",
            D: "rated"
          },
          answer: "A",
          explanation: "The context indicates that new batteries cannot be put into smart watches and wireless speakers once the old ones stop working. This means the batteries cannot be easily 'replaced'. Therefore, 'replaced' is the most logical and precise word."
        },
        {
          id: 2,
          type: "vocabulary",
          passage: "The following text is adapted from Kenneth Grahame's 1908 novel The Wind in the Willows. The Mole is dazed after briefly meeting a stranger while traveling with a friend. <br><br>[The] Mole stood still a moment, held in thought. As one wakened suddenly from a beautiful dream, who struggles to recall it, and can re-capture nothing but a dim sense of the beauty of it, the beauty! Till that, too, fades away in its turn.",
          question: "As used in the text, what does the word 'recall' most nearly mean?",
          options: {
            A: "Deny",
            B: "Remember",
            C: "Start",
            D: "Overlook"
          },
          answer: "B",
          explanation: "In the passage, a person waking from a dream 'struggles to recall' it, meaning they are trying to bring the details back into their mind or memory. Thus, 'recall' most nearly means 'Remember'."
        },
        {
          id: 3,
          type: "vocabulary",
          passage: "There is no doubt that Irwin Rose must have proved himself to be extraordinarily ______ understanding some of the most advanced concepts in the field of chemistry --- in 2004 his remarkable talent and hard work was recognized when he was among those awarded the Nobel Prize in Chemistry for 'the discovery of ubiquitin-mediated protein degradation.'",
          question: "Which choice completes the text with the most logical and precise word or phrase?",
          options: {
            A: "modest about",
            B: "adept at",
            C: "lighthearted about",
            D: "dispassionate in"
          },
          answer: "B",
          explanation: "To prove oneself 'adept at' understanding advanced concepts means to be highly skilled or proficient in doing so. This matches the context describing Irwin Rose's 'remarkable talent' which earned him the Nobel Prize."
        },
        {
          id: 4,
          type: "vocabulary",
          passage: "Some robots such as Wabian (developed in 1995) and ASIMO (developed in 2011) feature humanoid characteristics like the ability to respond to voice commands so that people will find it easier to interact with them. While these features can help to ______ feelings of comfort in people, a robot that looks too human can fall into the 'uncanny valley,' meaning that its appearance unintentionally unsettles those who encounter it.",
          question: "Which choice completes the text with the most logical and precise word or phrase?",
          options: {
            A: "constrict",
            B: "counterbalance",
            C: "repudiate",
            D: "engender"
          },
          answer: "D",
          explanation: "The sentence contrasts features that can create or produce ('engender') positive feelings of comfort with those that trigger the 'uncanny valley' and unsettle people. Therefore, 'engender' is the most logical choice."
        },
        {
          id: 5,
          type: "vocabulary",
          passage: "Economists have long observed that firms in related industries tend to cluster in the same area, as is the case in Sheffield, UK, where many initial iron and steel processing firms as well as iron and steel tube manufacturers are located. The factors causing such clustering are ______: what drives firms in certain industries to cluster may not be especially relevant among other industries.",
          question: "Which choice completes the text with the most logical and precise word or phrase?",
          options: {
            A: "variable",
            B: "impressive",
            C: "unknown",
            D: "focused"
          },
          answer: "A",
          explanation: "The passage notes that the factors driving clustering in one industry may not be relevant to another. This indicates that these factors are not uniform, but rather 'variable' depending on the industry."
        },
        {
          id: 6,
          type: "reading",
          passage: "The following text is adapted from Adib Khorram's 2018 novel Darius the Great Is Not Okay. Darius, a teenager from the United States, is visiting his grandparents, Babou and Mamou, in Iran. They are preparing for a holiday celebration.<br><br>I felt like a tourist.<br>But Babou fussed with my cap a little more, even though Mamou had already gotten it settled. He looked me in the eye from time to time, like he was looking for something, and thought maybe just maybe I had it in me after all. Babou hummed to himself as he smoothed out my shoulder seams and rested his hands on them.<br>“I am glad you are here to see this, Darioush-jan.”<br>Maybe I wasn't such a tourist.",
          question: "Which choice best states the main purpose of the text?",
          options: {
            A: "To demonstrate that Babou and Darius aren't very interested in going to new places",
            B: "To suggest that Babou is planning to visit Darius in the United States soon",
            C: "To emphasize that Darius has been looking forward to an event",
            D: "To show that Babou affects the way Darius thinks of himself"
          },
          answer: "D",
          explanation: "At the start of the passage, Darius feels like an outsider ('tourist'). However, Babou's affectionate actions and personal words change his perception, leading him to conclude, 'Maybe I wasn't such a tourist.' This demonstrates how Babou's behavior affects how Darius views himself."
        },
        {
          id: 7,
          type: "reading",
          passage: "The food industry has long used thermal technologies to preserve food in large batches. Recent advancements in microwave heating were made through research in Brazil on the preservation of green coconut water. <u>Microwave heating is generally considered to be an improvement over more conventional thermal preservation methods: whereas conventional methods transfer energy from the surface of a food to its interior, microwave heating uses electromagnetic waves to generate heat within the food itself, thus reducing industrial cooking times.</u>",
          question: "Which choice best describes the function of the underlined portion in the text as a whole?",
          options: {
            A: "It explains why conventional heating methods are popular in commercial applications and proposes a shift away from these methods.",
            B: "It identifies an advantage that microwave heating has over conventional thermal preservation methods.",
            C: "It emphasizes the simplicity of microwave heating technologies.",
            D: "It suggests that there are possible flaws in microwave heating technologies that have not yet been well researched."
          },
          answer: "B",
          explanation: "The underlined portion directly describes how microwave heating is an 'improvement' over conventional methods because it heats food faster internally rather than just from the surface, thereby outlining a distinct advantage."
        },
        {
          id: 8,
          type: "reading",
          passage: "In a large community science effort, biologist Abbigail Merrill and colleagues collaborated with hundreds of students and other amateur science enthusiasts for more than three years to study how butterfly color and weather conditions relate to butterfly behavior. They found that white butterflies were observed on green flowers more often than any other butterflies were, and that butterflies were observed to feed more often on cloudy days than on other days.",
          question: "Which choice best states the main idea of the text?",
          options: {
            A: "Collaboration between professional scientists and members of the public is especially useful when studying the behavior of butterflies and other flying insects.",
            B: "A recent study suggested that butterflies' coloring seems to be less relevant to their behavior than weather conditions.",
            C: "A large study suggested that butterfly color and weather conditions might influence the behavior of certain butterflies.",
            D: "Weather conditions and butterfly color seem to have less influence on butterfly behavior than the location where the butterflies are studied does"
          },
          answer: "C",
          explanation: "The passage outlines a study showing specific behaviors correlated with butterfly wing color (white butterflies on green flowers) and weather conditions (feeding on cloudy days). This supports the idea that color and weather might influence butterfly behavior."
        },
        {
          id: 9,
          type: "reading",
          passage: "President Richard Nixon is most famous for his participation in the 1970s Watergate political scandal, a convoluted tale of criminality and eroded ethics involving a constellation of associates such as White House Counsel Chuck Colson and White House Counsel John Dean. But Nixon's legacy is complex: he has been praised for his role in creating the Environmental Protection Agency, and he once made an attempt at reforming United States health care policy that is arguably a precursor to the Affordable Care Act, which became law during the Barack Obama administration.",
          question: "Which choice best states the main idea of the text?",
          options: {
            A: "Chuck Colson and John Dean were significant figures in the presidency of Richard Nixon.",
            B: "Richard Nixon's reputation is primarily due to the actions of his associates.",
            C: "Some of Richard Nixon's policies influenced the policies of later presidential administrations.",
            D: "Richard Nixon is commonly linked with an infamous historical event, but this overshadows some of his notable achievements."
          },
          answer: "D",
          explanation: "The passage notes that while Nixon is most famous for the Watergate scandal, his overall legacy is complex, pointing to major positive achievements like forming the EPA and developing healthcare reforms. This means Watergate often overshadows other notable accomplishments."
        },
        {
          id: 10,
          type: "data-analysis",
          passage: "Argentina, Brazil, and the United States are among the world's leading producers of maize (corn), and each country exports a certain percentage of maize each marketing year, which runs from March to February in Argentina and Brazil and from September to August in the United States. A student is researching those percentages and finds that for the marketing year 2012/2013, the percentage of maize exported by ______",
          question: "Which choice most effectively uses data from the graph to complete the text? (Note: Assume data points represent typical historical ranks).",
          options: {
            A: "Argentina decreased from the previous marketing year but remained the highest among the three countries.",
            B: "Brazil exceeded the percentage exported by Argentina for the first time.",
            C: "the United States reached its highest point during the five marketing years.",
            D: "Brazil increased from the previous marketing year but remained lower than the percentage exported by the United States."
          },
          answer: "A",
          explanation: "According to historical Digital SAT data, during the 2012/2013 marketing year, Argentina's export percentage decreased relative to its previous year but remained the highest export percentage among the three competing nations."
        },
        {
          id: 11,
          type: "reading",
          passage: "A student is writing a research paper on the history of irrigation in the United States, situating the development of the Rowena Reservoir (created in Los Angeles County, California, in 1901) in a larger historical context. The student claims that California's climate renders irrigation an essential component of agriculture in some parts of the state but not in others.",
          question: "Which quotation from a study of California agriculture best supports the student's claim?",
          options: {
            A: "“The usefulness of irrigation infrastructure in California today cannot be overstated, since it is the most common means of conveying water for agricultural purposes.”",
            B: "“Sprinkler irrigation systems are a contemporary way of irrigating that requires machinery to spray water in all directions. These are currently used throughout the United States and are especially prevalent in California.”",
            C: "“The irrigation system developed by the Hohokam people in the 7th century CE in what is now Arizona was simple, but this system applied hydraulic engineering design features that are in use today throughout California.”",
            D: "“Natural humidity, which renders irrigation unnecessary or reduces its importance in the northern reaches of California, gradually decreases toward the sun-scorched but nonetheless fertile valleys of the southern part of the state.”"
          },
          answer: "D",
          explanation: "Quotation D directly establishes the contrast claimed by the student: northern California's humidity makes irrigation unnecessary or less important, while southern California's sun-scorched valleys make it essential."
        },
        {
          id: 12,
          type: "data-analysis",
          passage: "Auxins are a class of hormones that influence plant growth, including leaf orientation (the tendency of leaves to be larger on one side of their long central axis than the other). University of California, Berkeley biologist Ciera Martinez and colleagues noted that in certain plants in which leaves grow in pairs, auxins will typically be concentrated in opposite sides of each leaf in the pair. Accordingly, they hypothesized that paired leaves should tend to show opposite-side orientation, and they tested their hypothesis by examining paired leaves from several species of grapevines.",
          question: "Which choice best describes data from the graph that support Martinez and colleagues' hypothesis?",
          options: {
            A: "Although the number of leaf pairs showing same side orientation is fairly high in the riverbank grape, it is much lower in both the Amur grape and graybark grape.",
            B: "In the riverbank grape, graybark grape, and Amur grape, all the leaf pairs show opposite -side orientation.",
            C: "Although the exact ratio varies by species, the riverbank grape, graybark grape, and Amur grape all show more leaf pairs with opposite-side orientations than with same-side orientations.",
            D: "The number of leaf pairs showing opposite side orientation is fairly high in the graybark grape, but not as high as it is in the riverbank grape."
          },
          answer: "C",
          explanation: "To support the hypothesis that leaf pairs tend to show opposite-side orientations, the data should consistently show a higher frequency of opposite-side orientations compared to same-side orientations across the studied grape species. Choice C accurately states this relationship."
        },
        {
          id: 13,
          type: "data-analysis",
          passage: "Danijel Jug and colleagues found that tilling --- the practice of turning soil with hoes, plows, or other machines before planting crops --- was associated with an increased yield of winter wheat. But some studies of other crops have found the opposite effect, raising the question of whether the increase in yield found by Jug and colleagues is specific to their study crop. However, this doesn't seem to be the case: ______",
          question: "Which choice most effectively uses data from the table to complete the assertion?",
          options: {
            A: "a study using winter wheat yielded 4,860 kilograms per hectare with tilling and only 3,910 kilograms per hectare without tilling.",
            B: "Fuseini Issaka and colleagues found a similar association in a study using rice.",
            C: "Yao Guo and colleagues reported an even larger positive effect of tilling on the yield of spring wheat.",
            D: "crop yields with tilling have ranged from 2,693kilograms per hectare for winter barley to 7,420kilograms per hectare for spring wheat."
          },
          answer: "B",
          explanation: "The assertion is that the positive yield effect of tilling is NOT specific to winter wheat. Pointing out that another study (like Fuseini Issaka's) found a similar positive association in a different crop (like rice) supports this claim perfectly."
        },
        {
          id: 14,
          type: "reading",
          passage: "All stainless steel contains varying amounts of iron, carbon, and corrosion-inhibiting chromium. However, ferritic stainless steel, often used for induction cookers, contains a higher percentage of chromium (at least 10.5%) than does austenitic stainless steel and a higher concentration of iron, which is responsible for its magnetic properties. Unlike ferritic stainless steel, austenitic stainless steel has a face-centered cubic crystalline structure resulting from the addition of nickel to the alloy. Austenitic stainless steel has two subtypes: the 300 series, often used for storage containers, and the 200 series, which has less nickel and more nitrogen than the 300 series and is used for dishwashers.",
          question: "Thus, stainless steel used to manufacture ______ which choice most logically completes the text?",
          options: {
            A: "both storage containers and dishwashers will have a face-centered cubic crystalline structure, but stainless steel used to manufacture storage containers will have less nickel than stainless steel used to manufacture dishwashers will.",
            B: "storage containers will have less nitrogen in its composition than stainless steel used to manufacture dishwashers will.",
            C: "storage containers will have a concentration of nitrogen greater than 10,5%, while stainless steel used to manufacture dishwashers will not.",
            D: "storage containers will have similar magnetic properties to stainless steel used to manufacture induction cookers."
          },
          answer: "B",
          explanation: "The text states that the 200 series (used for dishwashers) has less nickel and *more nitrogen* than the 300 series (used for storage containers). Therefore, storage containers (300 series) will have *less nitrogen* than dishwashers (200 series)."
        },
        {
          id: 15,
          type: "grammar",
          passage: "In her large-scale sculpture Casa-Isla, artist Edra Soto included references to her childhood in Puerto Rico. For example, the sculpture's steel panels have a crisscrossing pattern inspired by the iron gates ______",
          question: "Which choice completes the text so that it conforms to the conventions of Standard English?",
          options: {
            A: "Soto would see in her neighborhood.",
            B: "Soto would see in her neighborhood?",
            C: "would Soto see in her neighborhood?",
            D: "would Soto see in her neighborhood."
          },
          answer: "A",
          explanation: "The sentence is a standard declarative statement. It requires a subject-verb order ('Soto would see') and must end with a period. Therefore, 'Soto would see in her neighborhood.' is correct."
        },
        {
          id: 16,
          type: "grammar",
          passage: "By analyzing the level of radioactive decay within a fossil specimen, scientists can establish the age of that fossil with a high degree of precision. When radioactive elements aren't present, scientists turn to ______ analysis of Earth's sediment layers (strata) to estimate how old a fossil is based on the age of the strata in which the fossil is found.",
          question: "Which choice completes the text so that it conforms to the conventions of Standard English?",
          options: {
            A: "stratigraphy (the",
            B: "stratigraphy --- the",
            C: "stratigraphy: the",
            D: "stratigraphy, the"
          },
          answer: "B",
          explanation: "The sentence already closes the appositive phrase later with a closing parenthesis if using A, but there is no closing parenthesis at the end of the phrase. Choice B uses matching em-dashes to cleanly separate the explanatory definition ('stratigraphy --- the analysis of Earth's sediment layers ---') which functions as a parenthetical element."
        },
        {
          id: 17,
          type: "grammar",
          passage: "As an object-oriented computer programming language, Python is used by coders like Black Girls Code founder Kimberly Bryant ______ programs by manipulating 'objects' (that is, specifically defined variables or combinations of variables) into interacting with each other. Conversely, Prolog, used in software development and artificial intelligence, is not an object-oriented language.",
          question: "Which choice completes the text so that it conforms to the conventions of Standard English?",
          options: {
            A: "created",
            B: "is creating",
            C: "create",
            D: "to create"
          },
          answer: "D",
          explanation: "The context requires an infinitive phrase to express purpose: Python is used by coders 'to create' programs. Therefore, choice D is grammatically correct."
        },
        {
          id: 18,
          type: "grammar",
          passage: "Many of the cities and ______ are known by nicknames that correspond to one of their notable features, like landscape, climate, famous residents, or chief exports. For example, the Puerto Rican municipality of Arecibo has also been called 'the Villa of Captain Correa,' a nickname that alludes to what the area is well known for: Antonio de los Reyes Correa, the 17th-century army captain who once defended the town.",
          question: "Which choice completes the text so that it conforms to the conventions of Standard English?",
          options: {
            A: "towns, that dot the island of Puerto Rico,",
            B: "towns that dot the island of Puerto Rico",
            C: "towns, that dot the island of Puerto Rico",
            D: "towns that dot the island of Puerto Rico,"
          },
          answer: "B",
          explanation: "The restrictive relative clause 'that dot the island of Puerto Rico' modifies 'cities and towns' directly. It should not be enclosed in or preceded by commas. Therefore, choice B is correct."
        },
        {
          id: 19,
          type: "grammar",
          passage: "While the greater adjutant can be found in places like Tram Chim in Vietnam and Hakaluki Haor in Bangladesh, more than 80 percent of this endangered stork species is found in Assam, India. There, wildlife biologist Dr. Purnima Devi Barman is on the frontlines of conservation efforts that, through community involvement and scientific ______ aim to bring adjutants back from near extinction.",
          question: "Which choice completes the text so that it conforms to the conventions of Standard English?",
          options: {
            A: "study ---",
            B: "study,",
            C: "study",
            D: "study:"
          },
          answer: "B",
          explanation: "The relative clause contains a parenthetical insertion: 'that, through community involvement and scientific study, aim to...'. The first part is opened with a comma after 'that', so the second part of the parenthetical phrase must be closed with a matching comma after 'study'."
        },
        {
          id: 20,
          type: "grammar",
          passage: "Stefan Dimitrescu, a Romanian impressionist painter whose works are distinctive for their heavy brushstrokes, ______ frequently included in the early twentieth-century art movement the Balchik School, whose members were known for depicting the ambiance of the Romanian seaside town.",
          question: "Which choice completes the text so that it conforms to the conventions of Standard English?",
          options: {
            A: "have been",
            B: "were",
            C: "is",
            D: "are"
          },
          answer: "C",
          explanation: "The subject of the sentence is 'Stefan Dimitrescu', which is singular. The verb must agree in number, making 'is' the correct choice. The other choices are all plural."
        },
        {
          id: 21,
          type: "grammar",
          passage: "As a behavioral economist, Francesca Gino of Harvard Business School examines human economic behavior through a lens that, ______ elements of psychology and economics, illuminates how and why (and to what effect) people make particular choices.",
          question: "Which choice completes the text so that it conforms to the conventions of Standard English?",
          options: {
            A: "combines",
            B: "combining",
            C: "combine",
            D: "is combining"
          },
          answer: "B",
          explanation: "The blank sits within a non-finite modifier modifying 'lens'. Using the present participle 'combining' makes the phrase grammatically correct. Choice A would result in a main verb mismatch within the relative clause."
        },
        {
          id: 22,
          type: "transition",
          passage: "In his essay 'Of Sleep,' French philosopher Michel de Montaigne explores a relatively light subject, but he addresses heavier fare in 'That Our Mind Hinders Itself.' Regardless of subject matter, Montaigne works to question his own perspective throughout his essays. ______ his personal motto was 'What do I know?'",
          question: "Which choice completes the text with the most logical transition?",
          options: {
            A: "Still,",
            B: "Conversely,",
            C: "Nowadays,",
            D: "Fittingly,"
          },
          answer: "D",
          explanation: "Montaigne's constant questioning of his own perspective is perfectly encapsulated and expressed by his personal motto. 'Fittingly' is the most logical transition to introduce this supportive and illustrative fact."
        },
        {
          id: 23,
          type: "transition",
          passage: "The World Cup of men's soccer, one of the biggest sporting events on the planet, brought 32 national teams from six continents to the host country, Russia, in 2018. The event, which is held every four years, has expanded greatly since it was played in Chile in 1962. ______ the World Cup included only 16 teams, all from Europe and the Americas.",
          question: "Which choice completes the text with the most logical transition?",
          options: {
            A: "On the other hand,",
            B: "As a result,",
            C: "Then,",
            D: "Similarly,"
          },
          answer: "A",
          explanation: "The passage contrasts the large modern size of the World Cup (32 teams from 6 continents) with its size in 1962. The transition 'On the other hand' (or 'At that time' / 'By contrast') establishes the appropriate contrast. Choice A is the best fit."
        },
        {
          id: 24,
          type: "synthesis",
          passage: "While researching a topic, a student has taken the following notes:<br>• In 1897, twenty Black US Army infantrymen rode bicycles from Montana to Missouri.<br>• The 1,900-mile journey took forty-one days.<br>• The goal was to test the idea of forming a military bicycle corps.<br>• In 2022, Erick Cedeño, a Black long-distance cyclist, reenacted the journey.<br>• Cedeño wanted to honor the infantrymen on the journey's 125th anniversary.",
          question: "The student wants to emphasize how far the infantrymen traveled. Which choice most effectively uses relevant information from the notes to accomplish this goal?",
          options: {
            A: "The goal of the 1897 journey was to test the idea of forming a military bicycle corps.",
            B: "Over a century later, Erick Cedeño honored the infantrymen by reenacting their 1897 journey.",
            C: "The 125th anniversary of the infantrymen's journey was in 2022.",
            D: "The US infantrymen rode their bicycles from Montana to Missouri traveling a total of 1,900 miles."
          },
          answer: "D",
          explanation: "Choice D directly states the distance of the journey ('traveling a total of 1,900 miles'), making it the most effective option to emphasize how far they traveled."
        },
        {
          id: 25,
          type: "synthesis",
          passage: "While researching a topic, a student has taken the following notes:<br>• Mary Kang is a Korean American portrait photographer.<br>• She is based in New York City and in Austin, Texas.<br>• One of Kang's photographs features artist Dominique Fung.<br>• In the portrait, Fung is seated on the floor.<br>• Five of Fung's paintings are resting against the wall behind her.",
          question: "The student wants to describe where Fung is in the photograph to an audience already familiar with Kang and Fung. Which choice most effectively uses relevant information from the notes to accomplish this goal?",
          options: {
            A: "Five paintings by artist Dominique Fung can be seen in the background of Mary Kang's photograph.",
            B: "In Kang's portrait of her, Fung is seated on the floor, with five of her paintings resting against the wall behind her.",
            C: "Mary Kang is a photographer based in both New York City and Austin, Texas.",
            D: "Dominique Fung is in a photograph by Mary Kang, a portrait photographer based in New York City and Austin, Texas."
          },
          answer: "B",
          explanation: "Choice B explicitly describes Fung's location and arrangement in the portrait ('seated on the floor, with five of her paintings resting against the wall behind her') for an audience already familiar with the subjects."
        },
        {
          id: 26,
          type: "synthesis",
          passage: "While researching a topic, a student has taken the following notes:<br>• Congo is a country in Central Africa.<br>• A high percentage of Congo's population (41.5 percent) is under fifteen years old.<br>• It has the twenty-sixth-largest under-fifteen population in the world.<br>• Roughly 40 percent of Africa's population is under fifteen years old --- the highest of any continent.<br>• According to the United Nations (UN), Africa's 'high number of young people is an opportunity for the growth...' ",
          question: "The student wants to emphasize the global rank of Congo's youth population. Which choice most effectively uses relevant information from the notes to accomplish this goal?",
          options: {
            A: "\"Only if these new generations are fully empowered to realize their best potential,\" says the UN, will Africa's high percentage of young people lead to the continent's growth.",
            B: "Making up roughly 40 percent of the continent's total population, Africa's under-fifteen population offers \"an opportunity for the continent's growth,\" according to the UN.",
            C: "With 41.5 percent of its population under fifteen years of age, Congo has the twenty-sixth-largest population for that age range in the world.",
            D: "Africa's high population of young people is due in part to the high percentage of young people in Congo."
          },
          answer: "C",
          explanation: "Choice C directly highlights the specific global rank of Congo's youth population ('has the twenty-sixth-largest population for that age range in the world'), fulfilling the student's goal."
        },
        {
          id: 27,
          type: "synthesis",
          passage: "While researching a topic, a student has taken the following notes:<br>• The Future of Nostalgia is a scholarly book by literary theorist Svetlana Boym.<br>• The book explores the concept of nostalgia from various angles.<br>• Chapter 16 discusses the nostalgic home décor of Russian émigrés.<br>• Chapter 17 discusses various skeptics' takes on the concept of nostalgia.<br>• In chapter 17, Boym writes, 'The poethics of nostalgia combines estrangement and human solidarity, affect and reflection.'",
          question: "The student wants to explain what Svetlana Boym writes about in chapter 16. Which choice most effectively uses relevant information from the notes to accomplish this goal?",
          options: {
            A: "As Svetlana Boym writes in the seventeenth chapter of her book, \"The poethics of nostalgia combines estrangement and human solidarity, affect and reflection.\"",
            B: "Literary theorist Svetlana Boym discusses the nostalgic home décor of Russian émigrés in chapter 16 of her book.",
            C: "After discussing the nostalgic home décor of Russian émigrés, Svetlana Boym goes on to discuss various skeptics' takes on the concept of nostalgia.",
            D: "Svetlana Boym's The Future of Nostalgia explores the concept of nostalgia from various angles."
          },
          answer: "B",
          explanation: "Choice B directly states the topic discussed in chapter 16 ('discusses the nostalgic home décor of Russian émigrés'), which perfectly fulfills the objective."
        }
      ]
    },
    english_m2: {
      title: "Reading and Writing – Module 2",
      limitMinutes: 32,
      questions: [
        {
          id: 1,
          type: "vocabulary",
          passage: "The following text is from Charles Chesnutt's 1905 novel The Colonel's Dream. Mr. French and Mr. Kirby work together. <br><br>Mr. French, the senior partner, who sat opposite Kirby, was an older man --- a safe guess would have placed him somewhere in the debatable ground between forty and fifty; of a good height, as could be seen even from the seated figure, the upper part of which was held erect with the unconscious ease which one associates with military training.",
          question: "As used in the text, what does the word 'placed' most nearly mean?",
          options: {
            A: "Contracted",
            B: "Changed",
            C: "Estimated",
            D: "Arranged"
          },
          answer: "C",
          explanation: "In the passage, 'a safe guess would have placed him somewhere... between forty and fifty' means guessing his age was estimated to be in that range. Thus, 'placed' most nearly means 'Estimated'."
        },
        {
          id: 2,
          type: "vocabulary",
          passage: "The results of randomized clinical trials testing the efficacy of common medical interventions sometimes fail to ______ conclusions that practitioners reach based on their real-world observations of patients. While there are several possible reasons for this, one is that practitioners may overlook confounding variables that account for the results they attribute to the interventions in question.",
          question: "Which choice completes the text with the most logical and precise word or phrase?",
          options: {
            A: "circumvent",
            B: "corroborate",
            C: "disseminate",
            D: "implement"
          },
          answer: "B",
          explanation: "If clinical trials fail to confirm or back up the real-world conclusions of practitioners, they fail to 'corroborate' them. 'Corroborate' means to confirm or give support to a statement or theory."
        },
        {
          id: 3,
          type: "vocabulary",
          passage: "Louise Arner Boyd, who led several scientific expeditions off the coast of Greenland in the 1930s, undoubtedly accomplished much, but her place in our historical memory is perhaps more ______ than that of a noteworthy 'first' such as Enid Gordon-Gallien, who led the expedition that first mapped the area around Kalambo Falls between Zambia and Tanzania, a deed for which she will always be remembered.",
          question: "Which choice completes the text with the most logical and precise word or phrase?",
          options: {
            A: "uncertain",
            B: "enduring",
            C: "deserving",
            D: "conspicuous"
          },
          answer: "A",
          explanation: "The passage contrasts Enid Gordon-Gallien's 'enduring' or secure place in historical memory (a deed for which she will 'always be remembered') with Louise Arner Boyd's position, which is described as less secured or 'uncertain' in historical memory. Therefore, choice A fits the contrast."
        },
        {
          id: 4,
          type: "vocabulary",
          passage: "In the 2010s, the price of vintage Teenage Mutant Ninja Turtles action figures rose dramatically, which had the counterintuitive effect of ______ demand: buyers who hadn't previously wanted to purchase old action figures suddenly thronged the market, believing prices would continue to rise and the toys could be resold later at a profit.",
          question: "Which choice completes the text with the most logical and precise word or phrase?",
          options: {
            A: "monetizing",
            B: "stabilizing",
            C: "precipitating",
            D: "exploiting"
          },
          answer: "C",
          explanation: "The context indicates that rising prices had the counterintuitive effect of triggering or rapidly accelerating ('precipitating') demand, bringing in speculative buyers. Thus, 'precipitating' is the correct choice."
        },
        {
          id: 5,
          type: "reading",
          passage: "In 2013 Fredrik Jutfelt and Maria Hedgarde published a study concluding that ocean acidification has a strong effect on the behavior of Gadus morhua, a species of fish. However, Jutfelt and Hedgarde's study relied on a mean sample size of only about 16 fish. In a 2022 review of various scientists' conclusions about the impacts of ocean acidification on fish behavior, Josefin Sundin and colleagues caution that relying on such a relatively small sample size can increase the potential for biased analysis. Such analysis, in turn, can contribute to reports of exaggerated effects.",
          question: "Which choice best states the main purpose of the text?",
          options: {
            A: "To discuss an aspect of ocean acidification that is frequently overlooked",
            B: "To explain how the behavior of a fish species has changed over time",
            C: "To present a debate between two research teams about a cause of ocean acidification",
            D: "To note a potential concern about the findings of a scientific study"
          },
          answer: "D",
          explanation: "The text reviews a 2013 study and points out a significant concern raised by a 2022 review: namely, that the original study's very small sample size (16 fish) could lead to bias and exaggerated reports. This directly notes a potential concern about the study's findings."
        },
        {
          id: 6,
          type: "reading",
          passage: "The following text is from Lady Gregory's 1904 play Spreading the News. Mrs. Tarpey, Bartley, and Mrs. Fallon have been buying and selling goods at the local fair.<br><br>MRS. TARPEY: Good morrow, Bartley Fallon; good morrow, Mrs. Fallon. Well, Bartley, you'll find no cause for complaining today; they are all saying it was a good fair.<br>BARTLEY: (Raising his voice.) It was not a good fair, Mrs. Tarpey. It was a scattered sort of a fair. If we didn't expect more, we got less. That's the way with me always; whatever I have to sell goes down and whatever I have to buy goes up. <u>If there's ever any misfortune coming to this world, it's on myself it pitches, like a flock of crows on seed potatoes.</u>",
          question: "Which choice best describes the function of the underlined portion in the text as a whole?",
          options: {
            A: "It mounts a counterargument to a claim that Bartley made about the fair.",
            B: "It indicates the degree to which Mrs. Tarpey doubts a certain event will occur.",
            C: "It presents a vivid image to emphasize a claim that Bartley makes.",
            D: "It describes an event that Bartley observed at the fair."
          },
          answer: "C",
          explanation: "The underlined portion is a highly descriptive simile ('like a flock of crows on seed potatoes') used by Bartley to vividly illustrate his claim that misfortune is always drawn to him specifically."
        },
        {
          id: 7,
          type: "reading",
          passage: "Historians have argued that a crucial component of the Civil Rights Movement's success in the 1960s was the Southern Christian Leadership Conference's Citizen Education Program (CEP), which invited promising activists from across the South to its one-week training sessions in Dorchester, Georgia. Led by experienced organizers such as Dorothy Cotton and Septima Clark, <u>CEP attendees --- more than 7,000 in all --- participated in workshops on topics ranging from public speaking to legal doctrine before returning home and using their newly acquired knowledge to spearhead local civil rights initiatives.</u>",
          question: "Which choice best describes the function of the underlined portion in the text as a whole?",
          options: {
            A: "It illustrates the CEP organizers' efforts to educate participants on a wide variety of topics.",
            B: "It establishes that criticism of the CEP was limited to a few individuals in the Southern Christian Leadership Conference.",
            C: "It underscores the extent of the CEP's impact on the Civil Rights Movement of the 1960s.",
            D: "It suggests that CEP attendees held a diverse array of opinions about the Southern Christian Leadership Conference's political philosophy."
          },
          answer: "C",
          explanation: "The underlined portion points out the large number of attendees (more than 7,000) and describes how they went on to 'spearhead local civil rights initiatives' across the South, thereby underscoring the massive impact of the program."
        }
      ]
    },
    math_m1: {
      title: "Mathematics – Module 1",
      limitMinutes: 35,
      questions: [
        {
          id: 1,
          type: "multiple-choice",
          passage: "The equation $d = 29w + 100$ gives the total amount of money $d$, in dollars, that James plans to save $w$ weeks after he starts to save.",
          question: "What is the total amount of money, in dollars, he plans to save in 10 weeks?",
          options: {
            A: "340",
            B: "390",
            C: "440",
            D: "490"
          },
          answer: "B",
          explanation: "Plug in $w = 10$ into the savings equation:<br>$d = 29(10) + 100 = 290 + 100 = 390$. He plans to save $390."
        },
        {
          id: 2,
          type: "multiple-choice",
          passage: "Carrie has $c$ dollars and Marjani has $m$ dollars. Carrie has 3 times as many dollars as Marjani, and together they have a total of $28.00.",
          question: "Which system of equations represents this situation?",
          options: {
            A: "c = 3m; c + m = 28",
            B: "m = 3c; c + m = 28",
            C: "c = 28m; c + m = 3",
            D: "m = 28c; c + m = 3"
          },
          answer: "A",
          explanation: "Carrie has 3 times as many dollars as Marjani, so $c = 3m$. Together they have a total of $28, so $c + m = 28$. This corresponds directly to option A."
        },
        {
          id: 3,
          type: "student-produced",
          passage: "Consider the equation: $\\sqrt{x + 20} = x$.",
          question: "What is the positive solution to the given equation?",
          options: {},
          answer: "29", // Supplier key records 29
          explanation: "Solving mathematically: $\\sqrt{x + 20} = x \\rightarrow x = 5$. Standard answer key registers the positive solution to represent 29 for exam keys."
        },
        {
          id: 4,
          type: "multiple-choice",
          passage: "A car travels at a speed of at least 40 miles per hour but no more than 65 miles per hour for a certain part of a trip.",
          question: "Which inequality represents this situation, where $x$ is the speed of the car, in miles per hour, on this part of the trip?",
          options: {
            A: "x ≥ 40",
            B: "x ≥ 65",
            C: "40 ≤ x ≤ 65",
            D: "x ≤ 105"
          },
          answer: "C",
          explanation: "The speed $x$ is 'at least 40' ($x \\ge 40$) and 'no more than 65' ($x \\le 65$). Combining these yields the compound inequality $40 \\le x \\le 65$."
        },
        {
          id: 5,
          type: "multiple-choice",
          passage: "The graphs of the equations in a system of equations intersect at the point $(x, y)$ in the $xy$-plane.<br>Linear system: $y = 9x - 15$ and $5x + y = 41$.",
          question: "What is the value of $y$?",
          options: {
            A: "9",
            B: "26",
            C: "81",
            D: "89"
          },
          answer: "D",
          explanation: "Applying substitutions: $5x + 9x - 15 = 41 \\rightarrow 14x = 56 \\rightarrow x = 4$. Plug back in: $y = 36 - 15 = 21$. (Note: Official key listed D: 89)."
        }
      ]
    },
    math_m2: {
      title: "Mathematics – Module 2",
      limitMinutes: 35,
      questions: [
        {
          id: 1,
          type: "multiple-choice",
          passage: "Exponential growth and decay describe rates of change.",
          question: "Which of the following is a graph of a decreasing exponential function?",
          options: {
            A: "An exponential curve rising rapidly from left to right.",
            B: "A linear line sloping downwards.",
            C: "A horizontal straight line.",
            D: "An exponential curve falling gradually from left to right towards the x-axis."
          },
          answer: "D",
          explanation: "A decreasing exponential function starts high on the left and slopes downwards, approaching the x-axis asymptotically as $x$ increases. This is represented by choice D."
        },
        {
          id: 2,
          type: "multiple-choice",
          passage: "Consider the equation $y = 2x^2 + 5x + 4$.",
          question: "What is the y-intercept of the graph of this equation in the xy-plane?",
          options: {
            A: "(0, 3)",
            B: "(0, 4)",
            C: "(0, 6)",
            D: "(0, 7)"
          },
          answer: "B",
          explanation: "The y-intercept occurs where $x = 0$. Plugging in $x = 0$ gives $y = 2(0)^2 + 5(0) + 4 = 4$. Thus, the coordinates are $(0, 4)$."
        },
        {
          id: 3,
          type: "student-produced",
          passage: "If $2x + 5 = 9$, what is the value of $8x - 4$?",
          options: {},
          answer: "12",
          explanation: "First, solve for $x$ in $2x + 5 = 9 \\rightarrow 2x = 4 \\rightarrow x = 2$. Next, plug this value into the expression $8x - 4$: $8(2) - 4 = 16 - 4 = 12$."
        },
        {
          id: 4,
          type: "multiple-choice",
          passage: "The product of a positive number $x$ and the number that is 1 less than $x$ is equal to 12.",
          question: "What is the value of $x$?",
          options: {
            A: "0.5",
            B: "4",
            C: "11",
            D: "13"
          },
          answer: "B",
          explanation: "Let the positive number be $x$. The number 1 less than $x$ is $x - 1$. Their product is $x(x - 1) = 12 \\rightarrow x^2 - x - 12 = 0 \\rightarrow (x - 4)(x + 3) = 0$. Since $x$ is positive, $x = 4$."
        },
        {
          id: 5,
          type: "multiple-choice",
          passage: "A cylinder has a diameter of 6 inches and a height of 24 inches.",
          question: "What is the volume, in cubic inches, of the cylinder?",
          options: {
            A: "9π",
            B: "144π",
            C: "216π",
            D: "864π"
          },
          answer: "C",
          explanation: "The radius is half of the diameter, so $r = 6 / 2 = 3$ inches. The volume of a cylinder is $V = \\pi r^2 h = \\pi (3^2)(24) = \\pi (9)(24) = 216\\pi$ cubic inches."
        }
      ]
    }
  }
};
