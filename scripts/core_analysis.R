library(readr)
library(psych)

# Get arg for measure id
args <- commandArgs(trailingOnly = TRUE)
if (length(args) == 0) {
  stop("Usage: Rscript scripts/core_analysis.R <measure_id>")
}
measure_id <- args[1]
output_dir <- file.path("output", measure_id)

dir.create(output_dir, recursive = TRUE, showWarnings = FALSE)

# Load inputs
key_df <- read_csv(file.path("measures", paste0(measure_id, ".csv")))
scored_df <- read_csv(file.path(
  "output",
  measure_id,
  paste0(measure_id, "_scored.csv")
))
scored_df$id <- as.character(scored_df$id)

# Optional subscale columns for measures that only define broad scales
if (!"subscale" %in% names(key_df)) {
  key_df$subscale <- NA_character_
}
if (!"subscale_id" %in% names(key_df)) {
  key_df$subscale_id <- NA_character_
}

# One canonical lookup for every scored output, whether broad scale or subscale
scale_lookup_df <- unique(
  key_df[!is.na(key_df$scale_id), c("scale", "scale_id")]
)
colnames(scale_lookup_df) <- c("score", "score_id")
scale_lookup_df$score_level <- "scale"
scale_lookup_df <- scale_lookup_df[, c("score_level", "score", "score_id")]

subscale_lookup_df <- unique(
  key_df[!is.na(key_df$subscale_id), c("subscale", "subscale_id")]
)
colnames(subscale_lookup_df) <- c("score", "score_id")
subscale_lookup_df$score_level <- "subscale"
subscale_lookup_df <- subscale_lookup_df[, c(
  "score_level",
  "score",
  "score_id"
)]

score_lookup_df <- rbind(scale_lookup_df, subscale_lookup_df)
score_ids <- score_lookup_df$score_id

get_item_ids <- function(score_id, score_level) {
  if (score_level == "scale") {
    return(key_df$id[!is.na(key_df$scale_id) & key_df$scale_id == score_id])
  }

  key_df$id[!is.na(key_df$subscale_id) & key_df$subscale_id == score_id]
}

format_percentile <- function(p) {
  if (p >= 0.995) {
    return(sprintf("%.1f", 100 * p))
  }

  if (p < 0.005) {
    return(sprintf("%.1f", 100 * p))
  }

  sprintf("%.0f", 100 * p)
}

scale_descriptor <- function(ss) {
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

subscale_descriptor <- function(percentile) {
  if (percentile < 10) {
    return("Low")
  }

  if (percentile < 25) {
    return("Below Average")
  }

  if (percentile < 75) {
    return("Average")
  }

  if (percentile < 90) {
    return("Above Average")
  }

  "High"
}

# Export score descriptives
descriptives_list <- list()

for (i in seq_len(nrow(score_lookup_df))) {
  score_id <- score_lookup_df$score_id[i]
  score_level <- score_lookup_df$score_level[i]
  score_name <- score_lookup_df$score[i]
  score_items <- get_item_ids(score_id, score_level)
  d <- describe(scored_df[[score_id]])

  score_summary <- data.frame(
    score_level = score_level,
    score = score_name,
    score_id = score_id,
    n = d$n,
    items = length(score_items),
    mean = d$mean,
    sd = d$sd,
    median = d$median,
    min = d$min,
    max = d$max,
    theoretical_min = length(score_items) * 1,
    theoretical_max = length(score_items) * 5
  )

  descriptives_list[[score_id]] <- score_summary
}

score_descriptives_df <- do.call(rbind, descriptives_list)
write_csv(
  score_descriptives_df,
  file.path(output_dir, paste0(measure_id, "_score_descriptives.csv"))
)

# Export score correlations across both scales and subscales
score_cor_matrix <- cor(
  scored_df[, score_ids],
  use = "pairwise.complete.obs"
)

score_cor_df <- as.data.frame(score_cor_matrix)
score_cor_df$score_id <- rownames(score_cor_df)

score_cor_df <- merge(
  score_lookup_df,
  score_cor_df,
  by = "score_id",
  sort = FALSE
)

score_cor_df <- score_cor_df[, c(
  "score_level",
  "score",
  "score_id",
  score_ids
)]

write_csv(
  score_cor_df,
  file.path(output_dir, paste0(measure_id, "_score_correlations.csv"))
)

# Export score reliabilities across both scales and subscales
reliability_list <- list()

for (i in seq_len(nrow(score_lookup_df))) {
  score_id <- score_lookup_df$score_id[i]
  score_level <- score_lookup_df$score_level[i]
  score_name <- score_lookup_df$score[i]
  score_items <- get_item_ids(score_id, score_level)
  d <- describe(scored_df[[score_id]])
  alpha <- psych::alpha(scored_df[, score_items])
  omega <- psych::omega(scored_df[, score_items], nfactors = 1, plot = FALSE)

  reliability_summary <- data.frame(
    score_level = score_level,
    score = score_name,
    score_id = score_id,
    n = d$n,
    items = length(score_items),
    alpha = alpha$total$raw_alpha,
    omega_total = omega$omega.tot,
    mean_interitem_r = alpha$total$average_r
  )

  reliability_list[[score_id]] <- reliability_summary
}

score_reliabilities_df <- do.call(rbind, reliability_list)
write_csv(
  score_reliabilities_df,
  file.path(output_dir, paste0(measure_id, "_score_reliabilities.csv"))
)

# Export reference tables
reference_table_list <- list()
z_90 <- qnorm(0.95)

for (i in seq_len(nrow(score_lookup_df))) {
  score_id <- score_lookup_df$score_id[i]
  score_level <- score_lookup_df$score_level[i]
  score_name <- score_lookup_df$score[i]

  descriptives_row <- score_descriptives_df[
    score_descriptives_df$score_id == score_id,
  ]

  raw_scores <- seq(
    descriptives_row$theoretical_min,
    descriptives_row$theoretical_max
  )

  if (score_level == "scale") {
    reliability_row <- score_reliabilities_df[
      score_reliabilities_df$score_id == score_id,
    ]

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
      scale_descriptor,
      character(1)
    )

    score_reference_df <- data.frame(
      score_level = score_level,
      score = score_name,
      score_id = score_id,
      raw_score = raw_scores,
      standard_score = standard_score,
      percentile_rank = percentile_rank,
      ci_90 = paste0(ci_lower, "-", ci_upper),
      qualitative_descriptor = descriptor
    )

    score_reference_df <- score_reference_df[
      score_reference_df$standard_score >= 55 &
        score_reference_df$standard_score <= 145,
    ]

    score_reference_df <- score_reference_df[
      order(
        score_reference_df$standard_score,
        score_reference_df$raw_score,
        decreasing = TRUE
      ),
    ]
  } else {
    percentile_numeric <- vapply(
      raw_scores,
      function(raw_score) {
        mean(scored_df[[score_id]] <= raw_score, na.rm = TRUE) * 100
      },
      numeric(1)
    )
    percentile_rank <- vapply(
      percentile_numeric / 100,
      format_percentile,
      character(1)
    )
    descriptor <- vapply(
      percentile_numeric,
      subscale_descriptor,
      character(1)
    )

    score_reference_df <- data.frame(
      score_level = score_level,
      score = score_name,
      score_id = score_id,
      raw_score = raw_scores,
      standard_score = NA,
      percentile_rank = percentile_rank,
      ci_90 = NA,
      qualitative_descriptor = descriptor
    )

    score_reference_df <- score_reference_df[
      order(score_reference_df$raw_score, decreasing = TRUE),
    ]
  }

  reference_table_list[[score_id]] <- score_reference_df
}

score_reference_tables_df <- do.call(rbind, reference_table_list)
write_csv(
  score_reference_tables_df,
  file.path(output_dir, paste0(measure_id, "_score_reference_tables.csv"))
)
