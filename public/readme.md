// Spawn a Python child process
    // const pythonProcess = spawn('python', [__dirname+'/ML/modelRes.py', JSON.stringify(userValues)]); // For GausianNB
    const pythonProcess = spawn('python', [__dirname+'/ML/modelResXGB.py', JSON.stringify(userValues)]); // For xgboost

    // Collect data from the Python script
    let result = '';
    pythonProcess.stdout.on('data', (data) => {
      result += data;
    });
    // console.log("output: "+result);

    // Handle the end of the Python script execution
    pythonProcess.on('close', (code) => {
      if (code === 0) {
        console.log(result.trim());
        res.render("crop",{prediction:result, userValues:userValues });
      } else {
        console.log("Error in Python script execution");
        res.status(500).send('Error in Python script execution');
      }
    });
  