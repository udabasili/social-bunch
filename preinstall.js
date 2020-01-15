var fs=require('fs');
fs.writeFile(process.env.GCP_KEY_FILE, process.env.GCP_CRED, (err) => {});