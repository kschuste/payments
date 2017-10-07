## payments
Payments is a repository containing a simple node client/server implementation that will allow the client to upload basic payment and tax information to server through a formatted .csv file placed in the server's output directory.

## Installation
1. Clone the repository from github
2. Navigate to the directory and execute 'npm install'
3. execute 'npm run start'
4. Open your browser to http://localhost:8765

## Usage
* Click the 'Choose File' button to select the .csv file to upload to the server.  Other file types are not allowed to be uploaded.
* Click the 'Submit' button to upload the data for the server.
* Will upload each record of information separately.
* Will be notified of the individual failures that do not get uploaded

## Expected .csv file format
firstName,lastName,annualSalary,superRate(%),paymentStartDate
Piglet,Pig,80000,5%,01 June – 30 June
Duckling,Duck,80001,12%,01 July – 31 July
Foal,Horse,180000,15%,01 August – 31 August

## Assumption for valid input data
firstName - String greater than 0 characters
lastName - String greater than 0 characters
annualSalary - Number not less than 0
superRate - Number with % between 0 and 50
paymentStartDate - String greater than 0 characters

## Outputted .csv file format
firstName lastName,paymentStartDate,grossIncome,incomeTax,netIncome,super
Piglet Pig,01	June – 30	June,6667,1462,5205,333
Duckling Duck,01 July – 31 July,6667,1462,5205,800
Foal Horse,01	August – 31 August,15000,4546,10454,2250

## Testing
To execute the jasmine unit tests execute the following: 'npm run test'

## Code formatting
Eslint is used to keep  code clean and formatted the same.  Execute the following to run the linter: 'npm run lint'
