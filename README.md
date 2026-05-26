# IPIP Workbench

This project is a psychometric analysis of five personality and emotional intelligence measures using public-domain items and responses. It contains an R pipeline portion, including scoring, demographics, reliability summaries, and exploratory factor analysis. It also contains an interactive React/Vite website which includes client-side scoring, storage, and interpretation of results.

- Live site: https://darrenskidmore.com/projects/ipip-workbench
- Project report: https://darrenskidmore.com/projects/ipip-workbench/report/unified_report.html

## Project Highlights

- Built a reproducible R pipeline for scoring, reliability analysis, exploratory factor analysis, and report generation.
- Evaluated five IPIP-based personality and emotional-intelligence instruments using empirical response data.
- Developed a React/Vite website with client-side scoring, percentile ranks, standard scores, and browser-local result storage.
- Documented psychometric limitations so exploratory measures are not presented with stronger claims than the data supports.

## Measures

| Measure | Primary Constructs | Reliability | Factor Structure | Overall Interpretation |
|---|---|---|---|---|
| Big Five Personality Domains | 5 personality domains | Good | Good | Strong |
| Behavioral Inhibition/Activation Systems | 1 BIS + 3 BAS scales | Acceptable | Good | Strong |
| Barchard Emotional Intelligence Components | 7 personality EI components | Acceptable | Borderline | Acceptable |
| Values in Action (IPIP reconstruction) | 24 character strengths, 6 broad virtues | Good (Virtues), Acceptable (Strengths) | Very Weak | Limited |
| Trait Emotional Intelligence (IPIP reconstruction) | 15 facets, 4 broad factors | Acceptable (Factors), Borderline (Facets) | Weak | Limited |

Please refer to the project report for more information about these measures as well as definitions for the interpretative labels.

## Pipeline

### How to Run

To run the pipeline for a given measure `m`, run these commands in the project directory:

1. `Rscript scripts/pipeline/score.R m`
2. `Rscript scripts/pipeline/demographics.R m`
3. `Rscript scripts/pipeline/core_analysis.R m`
4. `Rscript scripts/pipeline/factor_analysis.R m n` (where `n` is the number of factors) 
5. `Rscript scripts/pipeline/item_to_subscale_factor_analysis.R m n` (where `n` is the number of factors; only if subscales are present)
6. `Rscript scripts/pipeline/subscale_to_scale_factor_analysis.R m n` (where `n` is the number of factors; only if subscales are present)

Output files are in CSV format and can be located in `output/{m}`.

### Measure Schema

Each file in `measure/` is a CSV with the following columns:

| column      | type | description |
| ----------- | ---- | ----------- |
| id          | str  | IPIP item ID |
| name        | str  | Item text of the question |
| scale       | str  | Human-readable scale name |
| scale_id    | str  | Internal scale ID |
| subscale    | str? | Human-readable subscale name |
| subscale_id | str? | Internal subscale ID |
| key         | +/-  | Plus symbol means a higher score is positively related to the scale/subscale; minus symbol means the opposite |

To add your own measures, simply create a new CSV in `measures/` and call the pipeline with the file name of the measure.

## Report

The report summarizes the findings of the IPIP measure study. It is available as a Quarto file in the `reports/` folder, or can be found in HTML form on the website itself.

## Website

The website, which is based on a simple React/Vite stack, offers an interactive way to take the five instruments along with automated scoring based on the Eugene-Springfield Community Sample. Percentile ranks and standard scores (if applicable) are shown for scales and subscales. Results are computed by the client and saved in the browser's local storage, and can be deleted if desired.

### How to Run

First, clone this repository to your computer, and ensure that `node` and `python3` (only standard libraries required) are available on your PATH. Make sure that the first three R scripts in the pipeline have already been run, as this is mandatory for deriving the sample statistics (see Pipeline > How to Run.) Then follow these steps:

1. `cd website`
2. `npm install`
3. `npm run dev` or `npm run build && npm run preview`

## Privacy Notice and Copyright

No quiz responses are collected or stored server-side; all responses are computed locally in the browser. In-progress quizzes and completed results are stored in local storage on this device. However, non-identifying analytics data may be collected by Cloudflare.

The source code of this project is licensed under the MIT license. Data and models used by the project, including the IPIP items and Eugene-Springfield Community Sample, are public domain. Some assets were generated with AI tools. This project is not affiliated with or endorsed by IPIP.

Copyright (C) 2026 Darren R. Skidmore.