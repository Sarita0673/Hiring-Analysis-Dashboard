"""
Internship & Fresher Hiring Analysis
Run from any directory with:
    python python/analyze_hiring.py
Expected input:
    data/raw/internship_hiring_data.xlsx
Output:
    data/cleaned/cleaned_hiring_data.csv
    report/analysis_summary.txt
    dashboard/charts/*.png

IMPORTANT: Add genuine job listings collected from public sources.
Do not use invented listings as project data.
"""
from pathlib import Path
import re
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

ROOT = Path(__file__).resolve().parents[1]
RAW_XLSX = ROOT / "data" / "raw" / "internship_hiring_data.xlsx"
RAW_CSV = ROOT / "data" / "raw" / "internship_hiring_data.csv"
CLEAN_DIR = ROOT / "data" / "cleaned"
REPORT_DIR = ROOT / "report"
CHART_DIR = ROOT / "dashboard" / "charts"

REQUIRED_COLUMNS = [
    "Job_ID", "Role", "Company", "Skills", "Internship_Duration", "Stipend",
    "Work_Mode", "Location", "Technology", "Experience", "Industry",
    "Source", "Date_Collected"
]

def load_data():
    if RAW_XLSX.exists():
        df = pd.read_excel(RAW_XLSX)
    elif RAW_CSV.exists():
        df = pd.read_csv(RAW_CSV)
    else:
        raise FileNotFoundError(
            "Dataset not found. Put the Excel template at "
            "data/raw/internship_hiring_data.xlsx and add genuine listings."
        )
    if df.empty:
        raise ValueError(
            "The input file has headers but no job listings yet. Add real public listings first."
        )
    missing = [c for c in REQUIRED_COLUMNS if c not in df.columns]
    if missing:
        raise ValueError("Missing required columns: " + ", ".join(missing))
    return df

def clean_data(df):
    df = df.copy()
    # Trim text values and standardize blank cells
    for col in df.select_dtypes(include=["object"]).columns:
        df[col] = df[col].astype("string").str.strip()
        df[col] = df[col].replace({"": pd.NA, "nan": pd.NA, "None": pd.NA})
    # Normalize work-mode variants
    if "Work_Mode" in df:
        mode = df["Work_Mode"].str.lower()
        df.loc[mode.isin(["wfh", "work from home", "work-from-home", "fully remote"]), "Work_Mode"] = "Remote"
        df.loc[mode.isin(["onsite", "on site", "office", "work from office"]), "Work_Mode"] = "On-site"
        df.loc[mode.isin(["hybrid work"]), "Work_Mode"] = "Hybrid"
    # Preserve unknown stipend values; do not guess numeric amounts
    for col in ["Stipend", "Work_Mode", "Internship_Duration", "Technology", "Industry"]:
        if col in df:
            df[col] = df[col].fillna("Not Mentioned")
    # Remove exact duplicate rows
    before = len(df)
    df = df.drop_duplicates()
    duplicates_removed = before - len(df)
    CLEAN_DIR.mkdir(parents=True, exist_ok=True)
    df.to_csv(CLEAN_DIR / "cleaned_hiring_data.csv", index=False)
    return df, duplicates_removed

def save_bar_chart(series, title, filename, xlabel, ylabel="Number of listings", top=10):
    if series.empty:
        return
    CHART_DIR.mkdir(parents=True, exist_ok=True)
    data = series.head(top).sort_values()
    ax = data.plot(kind="barh", figsize=(9, 5))
    ax.set_title(title)
    ax.set_xlabel(ylabel)
    ax.set_ylabel(xlabel)
    plt.tight_layout()
    plt.savefig(CHART_DIR / filename, dpi=150)
    plt.close()

def main():
    df = load_data()
    print("\n--- DATASET OVERVIEW ---")
    print("Shape:", df.shape)
    print("\nColumns:\n", list(df.columns))
    print("\nData types:\n", df.dtypes)
    print("\nMissing values before cleaning:\n", df.isna().sum())

    df, duplicates_removed = clean_data(df)
    print("\nRows after duplicate removal:", len(df))
    print("Duplicate rows removed:", duplicates_removed)
    print("\n--- TOP ROLES ---\n", df["Role"].value_counts().head(10))
    print("\n--- WORK MODES ---\n", df["Work_Mode"].value_counts())
    print("\n--- TECHNOLOGIES ---\n", df["Technology"].value_counts().head(10))
    print("\n--- LOCATIONS ---\n", df["Location"].value_counts().head(10))

    # Count each listed skill separately (comma-separated Skills column)
    skills = df["Skills"].dropna().astype(str).str.split(",").explode().str.strip()
    skills = skills[skills.ne("") & skills.str.lower().ne("nan")]
    skill_counts = skills.value_counts()
    print("\n--- TOP SKILLS ---\n", skill_counts.head(15))

    save_bar_chart(df["Role"].value_counts(), "Top Internship/Fresher Roles",
                   "top_roles.png", "Role")
    save_bar_chart(skill_counts, "Most Requested Skills",
                   "top_skills.png", "Skill", top=15)
    save_bar_chart(df["Technology"].value_counts(), "Most Requested Technologies",
                   "top_technologies.png", "Technology")
    save_bar_chart(df["Location"].value_counts(), "Top Job Locations",
                   "top_locations.png", "Location")

    REPORT_DIR.mkdir(parents=True, exist_ok=True)
    summary = [
        "INTERNSHIP & FRESHER HIRING ANALYSIS",
        f"Rows analyzed: {len(df)}",
        f"Columns: {len(df.columns)}",
        f"Exact duplicate rows removed: {duplicates_removed}",
        "",
        "Top roles:",
        df["Role"].value_counts().head(10).to_string(),
        "",
        "Top skills:",
        skill_counts.head(15).to_string(),
        "",
        "Work modes:",
        df["Work_Mode"].value_counts().to_string(),
        "",
        "Top technologies:",
        df["Technology"].value_counts().head(10).to_string(),
        "",
        "Top locations:",
        df["Location"].value_counts().head(10).to_string(),
        "",
        "Interpret these results only as findings from the collected dataset. "
        "Mention source coverage and limitations in your final report."
    ]
    (REPORT_DIR / "analysis_summary.txt").write_text("\n".join(summary), encoding="utf-8")
    print("\nFinished. Cleaned CSV, summary and charts have been generated.")

if __name__ == "__main__":
    main()
