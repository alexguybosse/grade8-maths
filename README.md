# Grade 8 Maths

The whole Grade 8 CAPS maths syllabus as a phone-friendly web app. Every topic has:

- **Learn** – the rules to know, explanations and worked examples
- **Try it** – an interactive demo (drag, slide, tap)
- **Test yourself** – 10 randomised questions, marked straight away with the working shown

Plus a **Rules sheet** (every rule on one searchable page) and a **Mock exam** (20 mixed questions, marked at the end with a list of topics to work on).

## Topics

| Area | Topics |
| --- | --- |
| Numbers and calculations | Whole numbers, Integers, Exponents, Common fractions, Decimal fractions |
| Patterns, functions and algebra | Number and shape patterns, Functions and relationships, Algebraic expressions, Algebraic equations, Graphs |
| Geometry | Angles and straight lines, Triangles and quadrilaterals, Constructions, Transformations, 3D objects |
| Measurement | Theorem of Pythagoras, Area and perimeter, Surface area and volume |
| Data and probability | Data handling, Probability |

## Put it on your phone

Open the site, then:

- **iPhone (Safari):** Share → *Add to Home Screen*
- **Android (Chrome):** ⋮ menu → *Add to Home screen* / *Install app*

It opens full-screen like an app and works offline after the first visit. Scores are saved on the phone only.

## How it's built

Plain HTML, CSS and JavaScript – no build step. Each topic is one file in `js/topics/` with its rules, lesson, demos and question generators. Numbers use the South African convention (decimal comma); answers can be typed with a comma or a point, and fractions as `3/4` or `1 1/2`.

Fonts: [Atkinson Hyperlegible](https://brailleinstitute.org/freefont) and [Shantell Sans](https://shantellsans.com), both under the SIL Open Font License (see `fonts/`).
