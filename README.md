# Google-Location-Fahrtenbuch
Simple project to extract csv from google location json dumps. Useful for doing taxes in Germany.

Location history can be obtained from here: https://takeout.google.com/?pli=1

In the current state the app works with the semantic location history per month located in the year folder inside "Takeout\Location History\Semantic Location History\"

There are two inputs 1. textfield to filter the names of the places visited and a file chooser to select a month file to process. After choosing the file a download dialog opens to save the resulting csv files.
