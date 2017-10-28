'use strict';

/* Add the dependencies you're testing */
const Queue = artifacts.require("./Queue.sol");

contract('queueTest', function(accounts) {
	/* Define your constant variables and instantiate constantly changing 
	 * ones
	 */
	const args = {};
	let queue;

	/* Do something before every `describe` method */
	beforeEach(async function() {
		queue = await Queue.new();
	});

	/* Group test cases together 
	 * Make sure to provide descriptive strings for method arguments and
	 * assert statements
	 */
	describe('Basic Functionality', function() {
		it("Instantiate a new queue and make sure it is empty.", async function() {
			let isEmpty = await queue.empty();
			assert.equal(isEmpty, true, "A new queue should be empty.");
		});

		it("Add a person to the queue and make sure the queue's size is correct.", async function() {
			await queue.enqueue(accounts[0]);
			let queueSize = await queue.qsize();
			assert.equal(queueSize, 1, "The queue should have a size of 1.");
		});

		it("Remove a person from the queue and make sure the queue's size is correct.", async function() {
			await queue.enqueue(accounts[0]);
			await queue.dequeue();
			let queueSize = await queue.qsize();
			let isEmpty = await queue.empty();
			assert.equal(queueSize, 0, "The queue should have a size of 0.");
			assert.equal(isEmpty, true, "The queue should be empty.");
		});

		it("Check a person's place in the queue.", async function() {
			await queue.enqueue(accounts[0]);
			let pos = await queue.checkPlace.call({from: accounts[0]}).valueOf();
			assert.equal(pos, 1, "The person's position should be 1, but instead was " + pos);
		});

		it("Get the person in the front of the queue.", async function() {
			await queue.enqueue(accounts[0]);
			await queue.enqueue(accounts[1]);
			let first = await queue.getFirst();
			assert.equal(first, accounts[0], "The wrong person was retrieved from the front of the queue.");
		});
	});

	describe('Advanced Functionality', function() {
		it("Add 5 people to the queue and make sure nobody else can be added to the queue.", async function() {
			// add 5 people to the queue.
			var i;
			for (i = 0; i < 5; i++) {
				await queue.enqueue(accounts[0]);
			}
			var queueSize = await queue.qsize();
			assert.equal(queueSize, 5, "The queue should have a size of 5.");

			// attempt to add a 6th person to the queue. the queue's size should still be 5
			await queue.enqueue(accounts[5])
			assert.equal(queueSize, 5, "The queue should have a size of 5 after failing to add a 6th person.");

			var pos = await queue.checkPlace.call({from: accounts[5]});
			assert.equal(pos.valueOf(), 0, "The 6th person should not have a place in the queue.");
		});

		// this test doesn't work yet since i need to figure out timing.
		// it("Expel the person in the front of the queue.", async function() {
		// 	await queue.enqueue(accounts[0]);
		// 	await queue.enqueue(accounts[1]);
		// 	await queue.checkTime();
		// 	let queueSize = await queue.qsize();
		// 	assert.equal(queueSize, 1, "The queue should have a size of 1, but was " + queueSize);
		// 	var pos = await queue.checkPlace.call({from: accounts[0]}).valueOf();
		// 	assert.equal(pos, 0, "The expelled person should no longer be in the queue.");
		// 	pos = await queue.checkPlace.call({from: accounts[1]}).valueOf();
		// 	assert.equal(pos, 1, "The correct person is not in front of the queue.");

		// });
	});
});
