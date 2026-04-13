library(readr)
library(dplyr)
library(tidyr)

# Get arg for measure id
args <- commandArgs(trailingOnly = TRUE)
if (length(args) == 0) {
  stop("Usage: Rscript scripts/score.R <measure_id>")
}
measure_id <- args[1]
output_dir <- file.path("output", measure_id)

dir.create(output_dir, recursive = TRUE, showWarnings = FALSE)

# Load and prepare data
responses_df <- read_tsv(file.path("raw_data", "IPIP2539_responses.tab"))
responses_df$id <- as.character(responses_df$id)

key_df <- read_csv(file.path("measures", paste0(measure_id, ".csv")))

scored_df <- responses_df |>
  select(id, all_of(key_df$id)) |>
  tidyr::drop_na()

# Reverse score negated items
reverse_items <- key_df$id[key_df$key == "-"]

scored_df <- scored_df
scored_df[reverse_items] <- 6 - scored_df[reverse_items]

# Group by scales and get sums
scale_ids <- unique(key_df$scale_id)
scale_ids <- scale_ids[!is.na(scale_ids)]

for (scale_id in scale_ids) {
  scale_items <- key_df$id[
    !is.na(key_df$scale_id) & key_df$scale_id == scale_id
  ]

  scored_df[[scale_id]] <- rowSums(scored_df[, scale_items], na.rm = TRUE)
}

# If subscales/facets are present, score those as well
subscale_ids <- unique(key_df$subscale_id)
subscale_ids <- subscale_ids[!is.na(subscale_ids)]

for (subscale_id in subscale_ids) {
  subscale_items <- key_df$id[
    !is.na(key_df$subscale_id) & key_df$subscale_id == subscale_id
  ]

  scored_df[[subscale_id]] <- rowSums(scored_df[, subscale_items], na.rm = TRUE)
}

write_csv(
  scored_df,
  file.path(output_dir, paste0(measure_id, "_scored.csv"))
)
