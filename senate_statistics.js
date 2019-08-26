var app = new Vue({
    el: '#app',
    data: {
        membersData: [],
        loading: true,
        statistics: {
            numberOfRepublicans: 0,
            numberOfDemocrats: 0,
            numberOfIndependents: 0,
            averagePercentPartyVotesRepublican: 0,
            averagePercentPartyVotesDemocrat: 0,
            averagePercentPartyVotesIndependent: 0,
        }
    },
    methods: {
        getData() {
            var data;
            fetch("https://api.propublica.org/congress/v1/113/senate/members.json", {

                method: "GET",
                headers: {
                    'X-API-Key': "4rap2gEepM6ulnocIf4uVHRqYuOmKwMP9IO2MmAm"
                }
            }).then(function (response) {

                if (response.ok) {
                    return response.json();
                }
                throw new Error(response.statusText);
            }).then(function (json) {

                data = json;

                var members = data.results[0].members;

                for (var i = 0; i < members.length; i++) {
                    if (members[i].url == "") {
                        members[i].url = null
                    }
                }

                app.membersData = members;

                localStorage.setItem("senateData", JSON.stringify(members));

                dataAge = Date.now();

                localStorage.setItem("Timestamp", dataAge);


                app.getStatistics();
                app.loading = false;

            }).catch(function (error) {
                console.log("Request failed: " + error.message);
            });
        },

        getStatistics() {
            var arrayOfRepublicans = [];
            var arrayOfDemocrats = [];
            var arrayOfIndependents = [];
            var arrayOfRepubVotes = 0
            var numRepubMember = 0;
            var arrayOfDemocratVotes = 0
            var numDemoMember = 0;
            var arrayOfIndepVotes = 0
            var numIndepMember = 0;

            for (var i = 0; i < this.membersData.length; i++) {

                if (this.membersData[i].party == "R") {
                    arrayOfRepublicans.push(this.membersData[i]);
                    arrayOfRepubVotes += this.membersData[i].votes_with_party_pct;
                    numRepubMember += 1
                } else if (this.membersData[i].party == "D") {
                    arrayOfDemocrats.push(this.membersData[i]);
                    arrayOfDemocratVotes += this.membersData[i].votes_with_party_pct;
                    numDemoMember += 1
                } else if (this.membersData[i].party == "I") {
                    arrayOfIndependents.push(this.membersData[i]);
                    arrayOfIndepVotes += this.membersData[i].votes_with_party_pct;
                    numIndepMember += 1
                }
            }
            this.statistics.numberOfRepublicans = arrayOfRepublicans.length;
            this.statistics.numberOfDemocrats = arrayOfDemocrats.length;
            this.statistics.numberOfIndependents = arrayOfIndependents.length;
            this.statistics.averagePercentPartyVotesDemocrat = (arrayOfDemocratVotes / numDemoMember).toFixed(2);
            this.statistics.averagePercentPartyVotesRepublican = (arrayOfRepubVotes / numRepubMember).toFixed(2);

            if (arrayOfIndepVotes == 0) {
                this.statistics.averagePercentPartyVotesIndependent = 0;
            } else {
                this.statistics.averagePercentPartyVotesIndependent = (arrayOfIndepVotes / numIndepMember).toFixed(2);
            }
            this.statistics.totalReps = this.statistics.numberOfRepublicans + this.statistics.numberOfDemocrats + this.statistics.numberOfIndependents;

            this.statistics.weightedAverage = (((this.statistics.averagePercentPartyVotesRepublican * this.statistics.numberOfRepublicans) + (this.statistics.averagePercentPartyVotesDemocrat * this.statistics.numberOfDemocrats) + (this.statistics.averagePercentPartyVotesIndependent * this.statistics.numberOfIndependents)) / this.statistics.totalReps).toFixed(2);

   
        }
    },
    computed: {

        getLeastVotesWithParty: function () {
            var leastLoyalNames = []
            var newArray = Array.from(this.membersData);

            newArray.sort(function (a, b) {
                return a.votes_with_party_pct - b.votes_with_party_pct
            })
            var array10Percent = Math.ceil((newArray.length * 0.1))

            for (var i = 0; i < array10Percent; i++) {
                leastLoyalNames.push(newArray[i]);
            }
            var lastElement = leastLoyalNames[leastLoyalNames.length - 1];

            for (var i = array10Percent; i < newArray.length; i++) {

                if (newArray[i].votes_with_party_pct === lastElement.votes_with_party_pct) {
                    leastLoyalNames.push(newArray[i]);
                }
            }
            return leastLoyalNames;
        },
        getMostVotesWithParty: function () {

            var mostLoyalNames = []
            var newArray = Array.from(this.membersData);

            newArray.sort(function (a, b) {
                return b.votes_with_party_pct - a.votes_with_party_pct
            })
            var array10Percent = Math.ceil((newArray.length * 0.1))

            for (var i = 0; i < array10Percent; i++) {

                mostLoyalNames.push(newArray[i]);

            }
            var lastElement = mostLoyalNames[mostLoyalNames.length - 1];

            for (var j = array10Percent; j < newArray.length; j++) {

                if (newArray[j].votes_with_party_pct === lastElement.votes_with_party_pct) {
                    mostLoyalNames.push(newArray[j]);
                }
            }
            return mostLoyalNames;
        },
        getMostAttendance: function () {

            let mostAttendanceArray = []

            var newArray = Array.from(this.membersData);

            newArray.sort(function (a, b) {
                return a.missed_votes_pct - b.missed_votes_pct
            })
            var array10PercentMost = Math.ceil((newArray.length * 0.1))

            for (var i = 0; i < array10PercentMost; i++) {

                mostAttendanceArray.push(newArray[i]);

            }
            var lastElement = mostAttendanceArray[mostAttendanceArray.length - 1];

            for (var j = array10PercentMost; j < newArray.length; j++) {

                if (newArray[j].votes_with_party_pct === lastElement.votes_with_party_pct) {
                    mostAttendanceArray.push(newArray[j]);
                }
            }
            return mostAttendanceArray;
        },
        getLeastAttendance: function () {

            let leastAttendanceArray = []

            var newArray = Array.from(this.membersData);

            newArray.sort(function (a, b) {
                return b.missed_votes_pct - a.missed_votes_pct
            })
            var array10Percent = Math.ceil((newArray.length * 0.1))

            for (var k = 0; k < array10Percent; k++) {

                leastAttendanceArray.push(newArray[k]);
            }
            var lastElement = leastAttendanceArray[leastAttendanceArray.length - 1];

            for (var l = array10Percent; l < newArray.length; l++) {

                if (newArray[l].votes_with_party_pct === lastElement.votes_with_party_pct) {
                    leastAttendanceArray.push(newArray[l]);
                }
            }
            return leastAttendanceArray;
        },
        getTotalReps: function () {
            totalReps = this.membersData.length;
            return totalReps;
        },
    },

    created() {

        var timeStampNow = Date.now();

        console.log(timeStampNow - localStorage.getItem("Timestamp"));


        if (localStorage.getItem("senateData") && timeStampNow - localStorage.getItem("Timestamp") < 1800000) {
            this.membersData = JSON.parse(localStorage.getItem("senateData"))
            console.log("using local");
            this.getStatistics();
            this.loading = false;
        } else {
            this.getData();
            console.log("using fetch");

        }
    },
});
