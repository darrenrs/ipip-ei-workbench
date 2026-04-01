library(readr)
library(dplyr)
library(tidyr)

# Load and prepare data
raw_df <- read_tsv("raw_data/IPIP2539.tab")
raw_df$id <- as.character(raw_df$id)

barchard_key <- read_csv("raw_data/barchard_key.csv")

barchard_df <- raw_df |>
  select(id, all_of(barchard_key$id)) |>
  tidyr::drop_na()

# Reverse score negated items
reverse_items <- barchard_key$id[barchard_key$key == "-"]

barchard_df <- barchard_df
barchard_df[reverse_items] <- 6 - barchard_df[reverse_items]

# Group by components and get sums
components <- unique(barchard_key$component_id)

# Exploratory total across all Barchard items
barchard_df[["total_score_exploratory"]] <- rowSums(
  barchard_df[, barchard_key$id],
  na.rm = TRUE
)

for (comp in components) {
  vars <- barchard_key$id[barchard_key$component_id == comp]
  barchard_df[[comp]] <- rowSums(
    barchard_df[, vars],
    na.rm = TRUE
  )
}

write_csv(barchard_df, "output/barchard_scored.csv")
