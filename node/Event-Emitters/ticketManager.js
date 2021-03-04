const EventEmitter = require('events');

class TicketManager extends EventEmitter {
    constructor(supply) {
        super();
        this.supply = supply; // initial number of ticket can sell
    }

    buy(email, price) {
        if (this.supply <= 0) {
            console.log('ticket sell done');
            this.emit('error', new Error('There are no more tickets left to purchase'));
            return;
        }
        this.supply--;
        this.emit('buy', email, price, Date.now());
    }
}

module.exports = TicketManager;