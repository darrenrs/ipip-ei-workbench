library(readr)
library(psych)

# Hardcoded measure ID
measure_id <- "barchard"
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

# Factor Analysis
fa_items <- key_df$id
scored_df_fa <- scored_df[, fa_items]

# Verify that the data are not an identity matrix and therefore suitable for Factor Analysis
cortest.bartlett(scored_df_fa)

# Verify if the data are suitable for Factor Analysis with the Kaiser-Myer-Olkin test
KMO(scored_df_fa)

# Observe the number of Eigenvalues with each Principal Component
set.seed(1)
fa.parallel(scored_df_fa)

# Factor analysis via Principal Axis Factoring
par(xpd = TRUE)

# 11 factor model: excessive number of factors with only two or three questions
barchard_fa_pfa_ELEVEN <- fa(
  scored_df_fa,
  nfactors = 11,
  fm = "pa",
  max.iter = 100,
  rotate = "oblimin"
)
fa.diagram(barchard_fa_pfa_ELEVEN, cex = 1, marg = c(1, 2, 1, 1))

# 8 factor model: nearly identical to 7 factor candidate but with one question having its own factor
barchard_fa_pfa_EIGHT <- fa(
  scored_df_fa,
  nfactors = 8,
  fm = "pa",
  max.iter = 100,
  rotate = "oblimin"
)
fa.diagram(barchard_fa_pfa_EIGHT, cex = 1, marg = c(1, 2, 1, 1))

# 7 factor model: most interpretable theory-aligned candidate
barchard_fa_pfa <- fa(
  scored_df_fa,
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
  key_df[, c("id", "scale_id")],
  structure_matrix,
  by.x = "id",
  by.y = "item_id",
  sort = FALSE
)

write_csv(
  structure_table,
  file.path(output_dir, "barchard_fa_structure.csv")
)

phi_table <- as.data.frame(unclass(barchard_fa_pfa$Phi))
phi_table$factor <- rownames(phi_table)
phi_table <- phi_table[,
  c("factor", colnames(barchard_fa_pfa$Phi))
]

write_csv(
  phi_table,
  file.path(output_dir, "barchard_fa_phi.csv")
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
  key_df[, c("id", "name", "scale", "scale_id")],
  item_factor_assignments,
  by = "id",
  sort = FALSE
)

write_csv(
  item_factor_assignments,
  file.path(output_dir, "barchard_fa_structure_assignments.csv")
)

# Summarize how each empirical factor aligns with the original theoretical scales
factor_scale_counts <- as.data.frame.matrix(
  table(
    item_factor_assignments$primary_factor,
    item_factor_assignments$scale_id
  )
)

factor_scale_counts$factor <- rownames(factor_scale_counts)
factor_scale_counts <- factor_scale_counts[,
  c("factor", scales)
]

dominant_scale <- apply(
  factor_scale_counts[, scales],
  1,
  function(row) {
    scales[which.max(row)]
  }
)

dominant_count <- apply(
  factor_scale_counts[, scales],
  1,
  max
)

total_items_assigned <- rowSums(factor_scale_counts[, scales])

factor_scale_alignment_df <- data.frame(
  factor = factor_scale_counts$factor,
  dominant_scale_id = dominant_scale,
  dominant_item_count = dominant_count,
  total_items_assigned = total_items_assigned,
  dominant_share = dominant_count / total_items_assigned
)

factor_scale_alignment_df <- merge(
  factor_scale_alignment_df,
  unique(key_df[, c("scale_id")]),
  by.x = "dominant_scale_id",
  by.y = "scale_id",
  sort = FALSE
)

factor_scale_alignment_df <- merge(
  factor_scale_alignment_df,
  factor_scale_counts,
  by = "factor",
  sort = FALSE
)

write_csv(
  factor_scale_alignment_df,
  file.path(output_dir, "barchard_fa_structure_factor_alignment.csv")
)
