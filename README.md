# Outsider Trading
Outsider Trading is a web application where users can copy investments made by politicians. Using the Finnhub Congressional Trades API, the app tracks the stock trades made by both representatives and senators and allows users to mimic their investment strategies. Information such as trade volume, most traded sectors and issuers, total trades made, and more are on display to aid users in identifying trends and making insights. When copying an investment, the user is able to choose the amount to invest, at what value the investment should be closed if reached, and the sectors the investment should be allocated across. It is through these features that Outsider Trading aims to offer a data-driven, insightful platform for making informed investment decisions based on the strategies of those in Washington.

### Team Members
- Dorion Massengil (Dorion-M) - API, Database Management
- Jacob Tham (JNTGYV) - Project Design and Planning
- Albert Zhou (azfcf) - Backend Development, Database Management
- Andrew Veach (androodle)- Front End Design, UI/UX
- Pierce Terry (pierceterry01)- Data Visualization, Frontend/Backend Support

### Resources
- [Finnhub Congressional Trading API](https://finnhub.io/docs/api/congressional-trading)


### How to Run Locally
1. Clone the Repository
2. In the server directory, create an .env file containing following:

        FINNHUB_API_KEY=crvdanhr01qkji45ia40crvdanhr01qkji45ia4g
        JWT_SECRET=somestring
        DB_HOST=localhost
        DB_USER=root
        DB_PASSWORD=root
        DB_NAME=stock-tracker-db
        PORT=3001
3. In the project directory, run the following Docker command:

        docker-compose up --build

4. Once the container is running, go to the following URL in your browser:

        http://localhost:3000/
        

