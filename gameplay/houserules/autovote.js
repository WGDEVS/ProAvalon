// modified from ref of the rain.js

class AutoVote {
    constructor(thisRoom) {
        this.thisRoom = thisRoom;
        this.houserule = 'Autovote';

        this.description = '1) Automatically approve hammer, except spy rejects last hammer. 2) After 2 fails, pass/fail is automatically determined, unless if double fail.';
    }

    runHouserule() {
      if (this.thisRoom.phase === 'votingTeam' && this.thisRoom.pickNum >= 5) {
        // 1) Automatically approve hammer, except spy rejects last hammer
        var lastMission = false;
        if (this.thisRoom.missionNum == 5) {
          lastMission = true;
        }

        this.thisRoom.votes = [];

        for (let index in this.thisRoom.playersInGame) {
          if (lastMission && this.thisRoom.playersInGame[index].alliance !== 'Resistance') {
            this.thisRoom.votes[index] = 'reject';
          } else {
            this.thisRoom.votes[index] = 'approve';
          }
        }

        this.thisRoom.commonPhases['votingTeam'].resolveVotes(" (Autovote)");

      } else if (this.thisRoom.phase === 'votingMission') {
        // 2) After 2 fails, pass/fail is automatically determined, unless if double fail with oberon

        var numOfFails = 0;
        for (var i = 0; i < this.thisRoom.missionHistory.length; i++) {
             if (this.thisRoom.missionHistory[i] === 'failed') {
                numOfFails++;
            }
        }
        if (numOfFails < 2) {
          return;
        }

        if (this.thisRoom.requiresTwoFails()) {
          // if double fail, only autovote if enough non-oberon spies on team
          var numKnownSpies = 0;
          this.thisRoom.proposedTeam
          for (var i = 0; i < this.thisRoom.playersInGame.length; i++) {
            if (this.thisRoom.proposedTeam.indexOf(this.thisRoom.playersInGame[i].username) < 0) {
              continue;
            }
            if (this.thisRoom.playersInGame[i].alliance === 'Spy' && this.thisRoom.playersInGame[i].role !== 'Oberon') {
              numKnownSpies ++;
            }
          }
          if (numKnownSpies < 2) {
            return;
          }
        }

        for (var i = 0; i < this.thisRoom.playersInGame.length; i++) {
          if (this.thisRoom.proposedTeam.indexOf(this.thisRoom.playersInGame[i].username) < 0) {
            continue;
          }
          if (this.thisRoom.playersInGame[i].alliance === 'Spy') {
            this.thisRoom.missionVotes[i] = 'fail';
          } else {
            this.thisRoom.missionVotes[i] = 'succeed';
          }
        }

        this.thisRoom.commonPhases['votingMission'].resolveVotes(" (Autovote)");
      } else {
        return;
      }

      this.thisRoom.distributeGameData();
    }
}

module.exports = AutoVote;
