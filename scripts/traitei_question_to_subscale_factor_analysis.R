library(readr)
library(psych)

# Get arg for measure id and nfactors
measure_id <- 'traitei'
nfactors <- 15
output_dir <- file.path("output", measure_id)

dir.create(output_dir, recursive = TRUE, showWarnings = FALSE)

# Load and analyze scored data
key_df <- read_csv(file.path("measures", paste0(measure_id, ".csv")))
scale_ids <- unique(key_df$subscale_id)
scale_ids <- scale_ids[!is.na(scale_ids)]

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

# Factor analysis via Principal Axis Factoring using nfactors
factor_analysis_pfa <- fa(
  scored_df_fa,
  nfactors = nfactors,
  fm = "pa",
  max.iter = 100,
  rotate = "oblimin"
)

# What questions correlate to each factor?
print(factor_analysis_pfa$Structure, digits = 3)

# How do the factors correlate to each other? is there evidence of a higher-order factor?
print(factor_analysis_pfa$Phi, digits = 3)

# Export the nfactor structure matrix
structure_matrix <- as.data.frame(unclass(factor_analysis_pfa$Structure))
structure_matrix$item_id <- rownames(structure_matrix)
structure_matrix <- structure_matrix[,
  c("item_id", colnames(factor_analysis_pfa$Structure))
]

structure_table <- merge(
  key_df[, c("id", "subscale_id")],
  structure_matrix,
  by.x = "id",
  by.y = "item_id",
  sort = FALSE
)

write_csv(
  structure_table,
  file.path(output_dir, paste0(measure_id, "_facet_fa_structure.csv"))
)

# Export the factor intercorrelations
phi_table <- as.data.frame(unclass(factor_analysis_pfa$Phi))
phi_table$factor <- rownames(phi_table)
phi_table <- phi_table[,
  c("factor", colnames(factor_analysis_pfa$Phi))
]

write_csv(
  phi_table,
  file.path(output_dir, paste0(measure_id, "_facet_fa_phi.csv"))
)

# Exploratory item-to-factor assignment from the structure matrix.
# This uses the largest absolute structure loading as the primary empirical factor.
# Also lists the secondary empirical factor and bools if highest load is <0.30 or two or more loads are >=0.30
structure_values <- as.matrix(unclass(factor_analysis_pfa$Structure))
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
    secondary_factor = secondary_factor,
    secondary_loading = secondary_loading,
    loading_gap = abs(primary_loading) - abs(secondary_loading),
    weak_primary = abs(primary_loading) < 0.30,
    cross_loading = abs(secondary_loading) >= 0.30
  )
}

item_factor_assignments <- do.call(rbind, assignment_list)
item_factor_assignments <- merge(
  key_df[, c("id", "name", "subscale", "subscale_id")],
  item_factor_assignments,
  by = "id",
  sort = FALSE
)

write_csv(
  item_factor_assignments,
  file.path(
    output_dir,
    paste0(measure_id, "_facet_fa_structure_assignments.csv")
  )
)

# List each empirical factor and how they align with the original theoretical scale_ids
factor_scale_counts <- as.data.frame.matrix(
  table(
    item_factor_assignments$primary_factor,
    item_factor_assignments$subscale_id
  )
)

factor_scale_counts$factor <- rownames(factor_scale_counts)
factor_scale_counts <- factor_scale_counts[,
  c("factor", scale_ids)
]

dominant_scale <- apply(
  factor_scale_counts[, scale_ids],
  1,
  function(row) {
    scale_ids[which.max(row)]
  }
)

dominant_count <- apply(
  factor_scale_counts[, scale_ids],
  1,
  max
)

total_items_assigned <- rowSums(factor_scale_counts[, scale_ids])

# for each factor get the percentage of items that stayed in that construct
scale_item_totals <- table(key_df$subscale_id)

factor_scale_alignment_df <- data.frame(
  factor = factor_scale_counts$factor,
  dominant_scale_id = dominant_scale,
  dominant_item_count = dominant_count,
  total_items_assigned = total_items_assigned,
  dominant_share_purity = dominant_count / total_items_assigned,
  dominant_share_alignment = dominant_count /
    as.integer(scale_item_totals[dominant_scale])
)

factor_scale_alignment_df <- merge(
  factor_scale_alignment_df,
  factor_scale_counts,
  by = "factor",
  sort = FALSE
)

write_csv(
  factor_scale_alignment_df,
  file.path(
    output_dir,
    paste0(measure_id, "_facet_fa_structure_factor_alignment.csv")
  )
)
