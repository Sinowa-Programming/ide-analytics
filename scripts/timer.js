var start_time = 0;
function startTimer() {
    start_time = 0;
    start_time = Date.now();
}

function endTimer() {   // Returns the timer duration in milliseconds( 1000ms -> 1sec ).
    if( start_time == 0) {
        return 0;   // The timer wasn't started
    }
    return Date.now() - start_time;
    
}

module.exports = {
    startTimer,
    endTimer
};
