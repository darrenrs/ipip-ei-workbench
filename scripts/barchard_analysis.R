library(readr)
library(psych)

# Load and analyze scored data
barchard_key <- read_csv("raw_data/barchard_key.csv")
components <- unique(barchard_key$component_id)
score_variables <- c(components, "total_score_exploratory")

barchard_df <- read_csv("output/barchard_scored.csv")
barchard_df$id <- as.character(barchard_df$id)

# Export scale descriptives
descriptives_list <- list()

for (comp in score_variables) {
  d <- describe(barchard_df[[comp]])

  if (comp == "total_score_exploratory") {
    item_count <- nrow(barchard_key)
  } else {
    item_count <- nrow(barchard_key[
      barchard_key$component_id == comp,
    ])
  }

  scale_summary <- data.frame(
    scale = comp,
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

  descriptives_list[[comp]] <- scale_summary
}

barchard_scale_descriptives <- do.call(rbind, descriptives_list)
write_csv(barchard_scale_descriptives, "output/barchard_scale_descriptives.csv")

# Get summary and correlation matrix for components
component_cor_matrix <- cor(
  barchard_df[, score_variables],
  use = "pairwise.complete.obs"
)

component_cor_table <- as.data.frame(component_cor_matrix)
component_cor_table$scale <- rownames(component_cor_table)
component_cor_table <- component_cor_table[,
  c("scale", colnames(component_cor_matrix))
]

write_csv(component_cor_table, "output/barchard_scale_correlations.csv")

# Component reliability test (alpha and omega)
reliability_list <- list()

for (comp in components) {
  vars <- barchard_key$id[barchard_key$component_id == comp]

  d <- describe(barchard_df[[comp]])
  alpha <- psych::alpha(barchard_df[, vars])
  omega <- psych::omega(barchard_df[, vars], nfactors = 1, plot = FALSE)

  scale_summary <- data.frame(
    scale = comp,
    n = d$n,
    items = nrow(barchard_key[
      barchard_key$component_id == comp,
    ]),
    alpha = alpha$total$raw_alpha,
    omega_total = omega$omega.tot,
    mean_interitem_r = alpha$total$average_r
  )

  reliability_list[[comp]] <- scale_summary
}

barchard_scale_reliabilities <- do.call(rbind, reliability_list)
write_csv(
  barchard_scale_reliabilities,
  "output/barchard_scale_reliabilities.csv"
)
