const TicketManager = require("./ticketManager");
const EmailService = require('./emailService');
const DatabaseService = require('./databaseService.js');

const ticketManager = new TicketManager(1);
const emailService = new EmailService();
const databaseService = new DatabaseService();

// trigger every buy()
ticketManager.on('buy', (email, price, timestamp) => {
    console.log("Someone bought a ticket!");
    emailService.send(email);
    databaseService.save(email, price, timestamp);
});

ticketManager.on("error", (error) => {
    console.error(`Gracefully handling our error: ${error}`);
});


// only trigger one time
// ticketManager.once('buy', () => {
//     console.log("This is only called once");
// });

ticketManager.buy('test@email.com', 20);
ticketManager.buy('test@email.com', 10);

