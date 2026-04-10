library(readr)
library(psych)

# Get arg for measure id
args <- commandArgs(trailingOnly = TRUE)
if (length(args) == 0) {
  stop("Usage: Rscript scripts/run_core_analysis.R <measure_id>")
}
measure_id <- args[1]
output_dir <- file.path("output", measure_id)

dir.create(output_dir, recursive = TRUE, showWarnings = FALSE)

# Load and analyze scored data
key_df <- read_csv(file.path("measures", paste0(measure_id, ".csv")))
scales <- unique(key_df$scale_id)

scored_df <- read_csv(file.path(
  "output",
  measure_id,
  paste0(measure_id, "_scored.csv")
))
scored_df$id <- as.character(scored_df$id)

# Export scale descriptives
descriptives_list <- list()

for (scale in scales) {
  d <- describe(scored_df[[scale]])

  item_count <- nrow(key_df[
    key_df$scale_id == scale,
  ])

  scale_summary <- data.frame(
    scale = scale,
    n = d$n,
    items = item_count,
    mean = d$mean,
    sd = d$sd,
    median = d$median,
    min = d$min,
    max = d$max,
    theoretical_min = item_count * 1,
    theoretical_max = item_count * 5
  )

  descriptives_list[[scale]] <- scale_summary
}

scale_descriptives_df <- do.call(rbind, descriptives_list)
write_csv(
  scale_descriptives_df,
  file.path(output_dir, paste0(measure_id, "_scale_descriptives.csv"))
)

# Get summary and correlation matrix for scales
scale_cor_matrix <- cor(
  scored_df[, scales],
  use = "pairwise.complete.obs"
)

scale_cor_table <- as.data.frame(scale_cor_matrix)
scale_cor_table$scale <- rownames(scale_cor_table)
scale_cor_table <- scale_cor_table[,
  c("scale", colnames(scale_cor_matrix))
]

write_csv(
  scale_cor_table,
  file.path(output_dir, paste0(measure_id, "_scale_correlations.csv"))
)

# Scale reliability test (alpha and omega)
reliability_list <- list()

for (scale in scales) {
  scale_items <- key_df$id[key_df$scale_id == scale]

  d <- describe(scored_df[[scale]])
  alpha <- psych::alpha(scored_df[, scale_items])
  omega <- psych::omega(scored_df[, scale_items], nfactors = 1, plot = FALSE)

  scale_summary <- data.frame(
    scale = scale,
    n = d$n,
    items = nrow(key_df[
      key_df$scale_id == scale,
    ]),
    alpha = alpha$total$raw_alpha,
    omega_total = omega$omega.tot,
    mean_interitem_r = alpha$total$average_r
  )

  reliability_list[[scale]] <- scale_summary
}

scale_reliabilities_df <- do.call(rbind, reliability_list)
write_csv(
  scale_reliabilities_df,
  file.path(output_dir, paste0(measure_id, "_scale_reliabilities.csv"))
)

# Sample-based scoring tables
format_percentile <- function(p) {
  if (p >= 0.995) {
    return(sprintf("%.1f", 100 * p))
  }

  if (p < 0.005) {
    return(sprintf("%.1f", 100 * p))
  }

  sprintf("%.0f", 100 * p)
}

qualitative_descriptor <- function(ss) {
  if (ss >= 130) {
    return("Extremely High")
  }

  if (ss >= 120) {
    return("Very High")
  }

  if (ss >= 110) {
    return("High Average")
  }

  if (ss >= 90) {
    return("Average")
  }

  if (ss >= 80) {
    return("Low Average")
  }

  if (ss >= 70) {
    return("Very Low")
  }

  "Extremely Low"
}

score_table_list <- list()
z_90 <- qnorm(0.95)

for (scale in scales) {
  descriptives_row <- scale_descriptives_df[
    scale_descriptives_df$scale == scale,
  ]
  reliability_row <- scale_reliabilities_df[
    scale_reliabilities_df$scale == scale,
  ]

  raw_scores <- seq(
    descriptives_row$theoretical_min,
    descriptives_row$theoretical_max
  )

  standard_score_exact <- 100 +
    15 * ((raw_scores - descriptives_row$mean) / descriptives_row$sd)
  standard_score <- round(standard_score_exact)

  sem_ss <- 15 * sqrt(1 - reliability_row$omega_total)
  ci_lower <- round(standard_score - z_90 * sem_ss)
  ci_upper <- round(standard_score + z_90 * sem_ss)
  percentile_rank <- vapply(
    pnorm(standard_score_exact, mean = 100, sd = 15),
    format_percentile,
    character(1)
  )
  descriptor <- vapply(
    standard_score,
    qualitative_descriptor,
    character(1)
  )

  scale_score_table <- data.frame(
    scale = scale,
    raw_score = raw_scores,
    standard_score = standard_score,
    percentile_rank = percentile_rank,
    ci_90 = paste0(ci_lower, "-", ci_upper),
    qualitative_descriptor = descriptor
  )

  scale_score_table <- scale_score_table[
    scale_score_table$standard_score >= 55 &
      scale_score_table$standard_score <= 145,
  ]

  scale_score_table <- scale_score_table[
    order(
      scale_score_table$standard_score,
      scale_score_table$raw_score,
      decreasing = TRUE
    ),
  ]

  score_table_list[[scale]] <- scale_score_table
}

scale_scoring_tables_df <- do.call(rbind, score_table_list)
write_csv(
  scale_scoring_tables_df,
  file.path(output_dir, paste0(measure_id, "_scale_scoring_tables.csv"))
)
