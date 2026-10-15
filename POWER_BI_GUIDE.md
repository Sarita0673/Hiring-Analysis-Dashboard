# Power BI Dashboard Guide

1. Run `python python/analyze_hiring.py` after adding genuine data.
2. Open Power BI Desktop.
3. Select **Get Data → Text/CSV** and load `data/cleaned/cleaned_hiring_data.csv`.
4. Select **Transform Data** if column data types need adjustment, then **Close & Apply**.
5. Create these visuals:
   - Card: total listings (count of Job_ID)
   - Card: distinct companies
   - Bar chart: Role by count of Job_ID
   - Bar chart: Technology by count of Job_ID
   - Bar chart: Location by count of Job_ID
   - Donut chart: Work_Mode by count of Job_ID
   - Table: Role, Skills, Stipend, Work_Mode, Location, Source
6. Add slicers for Role, Location, Work_Mode, Technology, and Industry.
7. For a skills frequency chart, use the Python-generated `dashboard/charts/top_skills.png`, or create a separate normalized Skills table by splitting the comma-separated Skills column in Power Query.
8. Save as `dashboard/Internship_Hiring_Dashboard.pbix`.

The starter package does not include a prebuilt PBIX because Power BI Desktop creates that proprietary report file.
