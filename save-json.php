<?php
// Saving data from form in text file in JSON format


$json1 = file_get_contents("php://input");
    // encodes the array into a string in JSON format (JSON_PRETTY_PRINT - uses whitespace in json-string, for human readable)
   // $jsondata = json_encode($json1, JSON_PRETTY_PRINT);

    // saves the json string in "formdata.txt" (in "dirdata" folder)
    // outputs error message if data cannot be saved
    if(file_put_contents('formdata.json', $json1)) echo 'Data successfully saved';






?>
