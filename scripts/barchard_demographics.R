library(readr)
library(dplyr)
library(tidyr)

# Load and prepare data
scored_df <- read_csv("output/barchard_scored.csv")
scored_df$id <- as.character(scored_df$id)

demographics_df <- read_tsv("raw_data/IPIP2539_demographics.tab")
demographics_df$ID <- as.character(demographics_df$ID)

demographics_df_filtered <- demographics_df[
  demographics_df$ID %in% scored_df$id,
]

write_csv(demographics_df_filtered, "output/barchard_demographics.csv")
