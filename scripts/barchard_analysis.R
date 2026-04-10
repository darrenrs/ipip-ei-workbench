library(readr)
library(psych)

# Load and analyze scored data
barchard_key <- read_csv("raw_data/barchard_key.csv")
components <- unique(barchard_key$component_id)

barchard_df <- read_csv("output/barchard_scored.csv")
barchard_df$id <- as.character(barchard_df$id)

# Export scale descriptives
descriptives_list <- list()

for (comp in components) {
  d <- describe(barchard_df[[comp]])

  item_count <- nrow(barchard_key[
    barchard_key$component_id == comp,
  ])

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
  barchard_df[, components],
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

for (comp in components) {
  descriptives_row <- barchard_scale_descriptives[
    barchard_scale_descriptives$scale == comp,
  ]
  reliability_row <- barchard_scale_reliabilities[
    barchard_scale_reliabilities$scale == comp,
  ]

  raw_scores <- seq(
    descriptives_row$theoretical_min,
    descriptives_row$theoretical_max
  )

  standard_score_exact <- 100 + 15 * (
    (raw_scores - descriptives_row$mean) / descriptives_row$sd
  )
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
    scale = comp,
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

  score_table_list[[comp]] <- scale_score_table
}

barchard_scale_scoring_tables <- do.call(rbind, score_table_list)
write_csv(
  barchard_scale_scoring_tables,
  "output/barchard_scale_scoring_tables.csv"
)

# Factor Analysis
fa_items <- barchard_key$id
barchard_df_fa <- barchard_df[, fa_items]

# Verify that the data are not an identity matrix and therefore suitable for Factor Analysis
cortest.bartlett(barchard_df_fa)

# Verify if the data are suitable for Factor Analysis with the Kaiser-Myer-Olkin test
KMO(barchard_df_fa)

# Observe the number of Eigenvalues with each Principal Component
set.seed(1)
fa.parallel(barchard_df_fa)

# Factor analysis via Principal Axis Factoring
par(xpd = TRUE)

# 11 factor model: excessive number of factors with only two or three questions
barchard_fa_pfa_ELEVEN <- fa(
  barchard_df_fa,
  nfactors = 11,
  fm = "pa",
  max.iter = 100,
  rotate = "oblimin"
)
fa.diagram(barchard_fa_pfa_ELEVEN, cex = 1, marg = c(1, 2, 1, 1))

# 8 factor model: nearly identical to 7 factor candidate but with one question having its own factor
barchard_fa_pfa_EIGHT <- fa(
  barchard_df_fa,
  nfactors = 8,
  fm = "pa",
  max.iter = 100,
  rotate = "oblimin"
)
fa.diagram(barchard_fa_pfa_EIGHT, cex = 1, marg = c(1, 2, 1, 1))

# 7 factor model: most interpretable theory-aligned candidate
barchard_fa_pfa <- fa(
  barchard_df_fa,
  nfactors = 7,
  fm = "pa",
  max.iter = 100,
  rotate = "oblimin"
)
fa.diagram(barchard_fa_pfa, cex = 1, marg = c(1, 2, 1, 1))

# What questions correlate to each factor?
print(barchard_fa_pfa$Structure, digits = 3)

# How do the factors correlate to each other? is there evidence of a higher-order factor?
print(barchard_fa_pfa$Phi, digits = 3)

# Export the 7-factor structure matrix and factor intercorrelations
structure_matrix <- as.data.frame(unclass(barchard_fa_pfa$Structure))
structure_matrix$item_id <- rownames(structure_matrix)
structure_matrix <- structure_matrix[,
  c("item_id", colnames(barchard_fa_pfa$Structure))
]

structure_table <- merge(
  barchard_key[, c("id", "component_id")],
  structure_matrix,
  by.x = "id",
  by.y = "item_id",
  sort = FALSE
)

write_csv(
  structure_table,
  "output/barchard_fa_structure_7.csv"
)

phi_table <- as.data.frame(unclass(barchard_fa_pfa$Phi))
phi_table$factor <- rownames(phi_table)
phi_table <- phi_table[,
  c("factor", colnames(barchard_fa_pfa$Phi))
]

write_csv(
  phi_table,
  "output/barchard_fa_phi_7.csv"
)

# Exploratory item-to-factor assignment from the structure matrix.
# This uses the largest absolute structure loading as the primary empirical factor.
structure_values <- as.matrix(unclass(barchard_fa_pfa$Structure))
assignment_list <- list()

for (item_id in rownames(structure_values)) {
  item_loadings <- structure_values[item_id, ]
  ordered_idx <- order(abs(item_loadings), decreasing = TRUE)

  primary_factor <- names(item_loadings)[ordered_idx[1]]
  primary_loading <- item_loadings[ordered_idx[1]]
  secondary_factor <- names(item_loadings)[ordered_idx[2]]
  secondary_loading <- item_loadings[ordered_idx[2]]

  assignment_list[[item_id]] <- data.frame(
    id = item_id,
    primary_factor = primary_factor,
    primary_loading = primary_loading,
    primary_loading_abs = abs(primary_loading),
    secondary_factor = secondary_factor,
    secondary_loading = secondary_loading,
    secondary_loading_abs = abs(secondary_loading),
    loading_gap_abs = abs(primary_loading) - abs(secondary_loading),
    weak_primary = abs(primary_loading) < 0.30,
    cross_loading = abs(secondary_loading) >= 0.30
  )
}

item_factor_assignments <- do.call(rbind, assignment_list)
item_factor_assignments <- merge(
  barchard_key[, c("id", "name", "component", "component_id")],
  item_factor_assignments,
  by = "id",
  sort = FALSE
)

write_csv(
  item_factor_assignments,
  "output/barchard_fa_structure_assignments_7.csv"
)

# Summarize how each empirical factor aligns with the original theoretical components
factor_component_counts <- as.data.frame.matrix(
  table(
    item_factor_assignments$primary_factor,
    item_factor_assignments$component_id
  )
)

factor_component_counts$factor <- rownames(factor_component_counts)
factor_component_counts <- factor_component_counts[,
  c("factor", components)
]

dominant_component <- apply(
  factor_component_counts[, components],
  1,
  function(row) {
    components[which.max(row)]
  }
)

dominant_count <- apply(
  factor_component_counts[, components],
  1,
  max
)

total_items_assigned <- rowSums(factor_component_counts[, components])

factor_component_alignment <- data.frame(
  factor = factor_component_counts$factor,
  dominant_component_id = dominant_component,
  dominant_item_count = dominant_count,
  total_items_assigned = total_items_assigned,
  dominant_share = dominant_count / total_items_assigned
)

factor_component_alignment <- merge(
  factor_component_alignment,
  unique(barchard_key[, c("component_id")]),
  by.x = "dominant_component_id",
  by.y = "component_id",
  sort = FALSE
)

factor_component_alignment <- merge(
  factor_component_alignment,
  factor_component_counts,
  by = "factor",
  sort = FALSE
)

write_csv(
  factor_component_alignment,
  "output/barchard_fa_structure_factor_component_alignment_7.csv"
)
