function updateExamStatus(allExams) {
    allExams.forEach((exam) => {
        end = exam.endTime;
        start = exam.startTime;
        var currentDate = new Date();
        if (currentDate > exam.endTime) {
            exam.isUpcoming = false;
            exam.isLive = false;
            exam.isCompleted = true;
        }
        if (currentDate >= exam.startTime && currentDate <= exam.endTime) {
            exam.isUpcoming = false;
            exam.isLive = true;
            exam.isCompleted = false;
        }
        if (currentDate < exam.startTime) {
            exam.isUpcoming = true;
            exam.isLive = false;
            exam.isCompleted = false;
        }
    });
    return allExams;
}

module.exports = {
    updateExamStatus: updateExamStatus
}