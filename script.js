// ==========================================
// POLLVOTE - POLLING & VOTING APPLICATION
// ==========================================


// Get existing polls from LocalStorage
let polls =
    JSON.parse(localStorage.getItem("polls")) || [];


// ==========================================
// SAVE POLLS
// ==========================================

function savePolls() {

    localStorage.setItem(
        "polls",
        JSON.stringify(polls)
    );

}


// ==========================================
// ADD NEW OPTION
// ==========================================

function addOption() {

    const container =
        document.getElementById(
            "optionsContainer"
        );


    const optionNumber =
        container.querySelectorAll(
            ".option"
        ).length + 1;


    const input =
        document.createElement("input");


    input.type = "text";

    input.className = "option";

    input.placeholder =
        "Option " + optionNumber;


    container.appendChild(input);

}


// ==========================================
// CREATE POLL
// ==========================================

function createPoll() {


    const question =
        document
            .getElementById("question")
            .value
            .trim();


    const optionInputs =
        document.querySelectorAll(
            ".option"
        );


    const options = [];


    // Collect options
    optionInputs.forEach(input => {

        const value =
            input.value.trim();


        if (value !== "") {

            options.push({

                text: value,

                votes: 0

            });

        }

    });


    // Validate question
    if (question === "") {

        alert(
            "Please enter a poll question."
        );

        return;

    }


    // Validate options
    if (options.length < 2) {

        alert(
            "Please enter at least two options."
        );

        return;

    }


    // Create new poll
    const newPoll = {

        id: Date.now(),

        question: question,

        options: options

    };


    // Add poll
    polls.push(newPoll);


    // Save
    savePolls();


    alert(
        "Poll created successfully!"
    );


    // Clear question
    document.getElementById(
        "question"
    ).value = "";


    // Reset options
    document.getElementById(
        "optionsContainer"
    ).innerHTML = `

        <input
            type="text"
            class="option"
            placeholder="Option 1"
        >

        <input
            type="text"
            class="option"
            placeholder="Option 2"
        >

    `;


    // Display updated polls
    displayPolls();

}


// ==========================================
// DISPLAY ALL POLLS
// ==========================================

function displayPolls() {


    const pollList =
        document.getElementById(
            "pollList"
        );


    pollList.innerHTML = "";


    // No polls
    if (polls.length === 0) {

        pollList.innerHTML = `

            <div class="empty">

                <h3>
                    No polls available
                </h3>

                <p>
                    Create your first poll above.
                </p>

            </div>

        `;

        return;

    }


    // Display each poll
    polls.forEach(poll => {


        const pollCard =
            document.createElement(
                "div"
            );


        pollCard.className =
            "poll-card";


        // Check voting status
        const hasVoted =
            localStorage.getItem(
                "voted_" + poll.id
            );


        if (hasVoted) {

            displayResults(
                pollCard,
                poll
            );

        } else {

            displayVotingInterface(
                pollCard,
                poll
            );

        }


        pollList.appendChild(
            pollCard
        );

    });

}


// ==========================================
// DISPLAY VOTING INTERFACE
// ==========================================

function displayVotingInterface(
    card,
    poll
) {


    let html = `

        <h3>
            ${poll.question}
        </h3>

        <div>

    `;


    poll.options.forEach(
        (option, index) => {


            html += `

                <div class="vote-option">

                    <label>

                        <input
                            type="radio"
                            name="poll-${poll.id}"
                            value="${index}"
                        >

                        ${option.text}

                    </label>

                </div>

            `;

        }
    );


    html += `

        </div>

        <button
            class="vote-btn"
            onclick="vote(${poll.id})"
        >
            Submit Vote
        </button>

    `;


    card.innerHTML = html;

}


// ==========================================
// VOTE
// ==========================================

function vote(pollId) {


    // Find poll
    const poll =
        polls.find(
            p => p.id === pollId
        );


    if (!poll) {

        return;

    }


    // Check duplicate vote
    if (
        localStorage.getItem(
            "voted_" + pollId
        )
    ) {

        alert(
            "You have already voted in this poll."
        );

        return;

    }


    // Find selected option
    const selected =
        document.querySelector(
            `input[name="poll-${pollId}"]:checked`
        );


    // Nothing selected
    if (!selected) {

        alert(
            "Please select an option."
        );

        return;

    }


    // Get selected option index
    const optionIndex =
        parseInt(
            selected.value
        );


    // Increase vote
    poll.options[
        optionIndex
    ].votes++;


    // Save voting status
    localStorage.setItem(
        "voted_" + pollId,
        "true"
    );


    // Save poll data
    savePolls();


    // Refresh display
    displayPolls();

}


// ==========================================
// DISPLAY RESULTS
// ==========================================

function displayResults(
    card,
    poll
) {


    // Calculate total votes
    const totalVotes =
        poll.options.reduce(
            (sum, option) =>
                sum + option.votes,
            0
        );


    let html = `

        <h3>
            ${poll.question}
        </h3>

        <div>

    `;


    // Display each result
    poll.options.forEach(
        option => {


            let percentage = 0;


            if (totalVotes > 0) {

                percentage =
                    (
                        option.votes /
                        totalVotes
                    ) * 100;

            }


            html += `

                <div class="result">

                    <div class="result-header">

                        <span>
                            ${option.text}
                        </span>

                        <span>
                            ${percentage.toFixed(1)}%
                        </span>

                    </div>


                    <div class="bar-container">

                        <div
                            class="bar"
                            style="width: ${percentage}%"
                        ></div>

                    </div>

                </div>

            `;

        }
    );


    html += `

        </div>

        <div class="total-votes">

            Total Votes:
            ${totalVotes}

        </div>


        <div class="voted">

            ✓ You have already voted

        </div>

    `;


    card.innerHTML = html;

}


// ==========================================
// CLEAR ALL POLLS
// ==========================================

function clearAllPolls() {


    const confirmDelete =
        confirm(
            "Are you sure you want to delete all polls?"
        );


    if (!confirmDelete) {

        return;

    }


    // Remove polls
    localStorage.removeItem(
        "polls"
    );


    polls = [];


    // Remove voting records
    Object.keys(
        localStorage
    ).forEach(key => {


        if (
            key.startsWith(
                "voted_"
            )
        ) {

            localStorage.removeItem(
                key
            );

        }

    });


    // Refresh
    displayPolls();

}


// ==========================================
// LOAD POLLS WHEN PAGE OPENS
// ==========================================

displayPolls();