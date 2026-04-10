library(readr)

# Get arg for measure id
args <- commandArgs(trailingOnly = TRUE)
if (length(args) == 0) {
  stop("Usage: Rscript scripts/run_demographics.R <measure_id>")
}
measure_id <- args[1]
output_dir <- file.path("output", measure_id)

dir.create(output_dir, recursive = TRUE, showWarnings = FALSE)

# Load and prepare data
scored_df <- read_csv(file.path(
  "output",
  measure_id,
  paste0(measure_id, "_scored.csv")
))
scored_df$id <- as.character(scored_df$id)

demographics_df <- read_tsv(file.path(
  "raw_data",
  "IPIP2539_demographics.tab"
))
demographics_df$ID <- as.character(demographics_df$ID)

demographics_df <- demographics_df[
  demographics_df$ID %in% scored_df$id,
]

write_csv(
  demographics_df,
  file.path(output_dir, paste0(measure_id, "_demographics.csv"))
)
