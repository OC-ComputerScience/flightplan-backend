import axios from "axios";
import Student from "../sequelizeUtils/student.js";
import Major from "../sequelizeUtils/major.js";
import User from "../sequelizeUtils/user.js";
import FlightPlan from "../sequelizeUtils/flightPlan.js";

const BASE_URL = 'https://stingray.oc.edu/api'
const exports = {};

exports.getStudentForEmail = async (email) => {
    return await getStudentForEmail(email);
}

const getStudentForEmail = async (email) => {
    try {
        const response = await axios.get(`${BASE_URL}/CareerServicesStudentProfile/`, {
            params: {
                userString: email
            }
        });
        return response.data;
    }
    catch (error) {
        console.error("Error calling Colleague API:", error.response?.data || error.message);
        throw error;
    }
};

exports.getStudentForOCStudentId = async (ocStudentId) => {
    try {
        const response = await axios.get(`${BASE_URL}/CareerServicesStudentProfile/`, {
            params: {
                userString: ocStudentId
            }
        });
        return response.data;
    }
    catch (error) {
        console.error("Error calling Colleague API:", error.response?.data || error.message);
        throw error;
    }
};

exports.createNewStudentForUserId = async (userId) => {
    try {
        const user = await User.findById(userId);
        const email = user.email;
        const newColleagueData = await getStudentForEmail(email);
        console.log("Creating new student:", newColleagueData);
        const studentData = {
            graduationDate: newColleagueData.GraduationDate,
            semestersFromGrad: calculateSemestersFromGraduation(newColleagueData.GraduationDate),
            userId: userId,
            pointsAwarded: 0,
            pointsUsed: 0,
        };
        const newStudent = await Student.create(studentData);

        // create majors for student
        newColleagueData.Majors.forEach(async (major) => {
            const majorData = await Major.findForOCMajorId(major.Code);
            if (majorData) {
                await Student.addMajor(newStudent.id, majorData.id);
            }
        })

        return newStudent;
    }
    catch (error) {
        console.error("Error calling Colleague API:", error.response?.data || error.message);
        throw error;
    }
};

exports.checkUpdateStudentWithColleagueData = async (studentWithUserAndMajors) => {
    try {
        const newColleagueData = await getStudentForEmail(studentWithUserAndMajors.user.email);

        // check if majors need an update
        if (!hasSameMajors(studentWithUserAndMajors.majors, newColleagueData.Majors)) {
            const majorDifferences = getMajorDifferences(studentWithUserAndMajors.majors, newColleagueData.Majors);
            majorDifferences.majorsToRemove.forEach(async (major) => {
                await Student.removeMajor(studentWithUserAndMajors.id, major.id);
            })
            majorDifferences.majorsToAdd.forEach(async (major) => {
                console.log("Adding major:", major);
                const majorData = await Major.findForOCMajorId(major);
                if (majorData?.id) {
                    await Student.addMajor(studentWithUserAndMajors.id, majorData.id);
                }
                else {
                    console.error(`Major not found for OCMajorId: ${major.Code} Description: ${major.Description}`);
                }
            })
        }

        // check if graduation data needs an update
        if (!isSameDay(studentWithUserAndMajors.graduationDate, newColleagueData.GraduationDate)) {
            const newSemestersFromGraduation = calculateSemestersFromGraduation(newColleagueData.GraduationDate);
            const updatedStudentData = {
                graduationDate: newColleagueData.GraduationDate,
                semestersFromGrad: newSemestersFromGraduation,
            }
            await Student.update(studentWithUserAndMajors.id, updatedStudentData);

            if (studentWithUserAndMajors.semestersFromGrad !== newSemestersFromGraduation && newSemestersFromGraduation != 0) {
                const oldFlightPlan = await FlightPlan.getFlightPlanForStudentAndSemester(studentWithUserAndMajors.id, studentWithUserAndMajors.semestersFromGrad);
                if (oldFlightPlan?.id) {
                    await FlightPlan.updateOldFlightPlan(oldFlightPlan.id);
                }
                else {
                    console.log("generate new flight plan");

                    await FlightPlan.generateFlightPlan(studentWithUserAndMajors.id)
                    
                }
            }
        }
    } catch (error) {
        // Current known issue would be email not in Colleague (outside of OC email)
        console.error(`Error updating student with Colleugue data for student ${studentWithUserAndMajors.user.fullName} id: ${studentWithUserAndMajors.id}`);
        console.error(error);
    }
}

function hasSameMajors(oldMajors, newMajors) {
    const oldMajorOCMajorIds = oldMajors.map((major) => major.OCMajorId);
    const newMajorsOCMajorIds = newMajors.map((major) => major.Code);
    return oldMajorOCMajorIds.every((oldMajor) => newMajorsOCMajorIds.find((newMajor) => newMajor === oldMajor)) && oldMajorOCMajorIds.length === newMajorsOCMajorIds.length;
}

function getMajorDifferences(oldMajors, newColleagueMajors) {
    const majorDifferences = {
        majorsToRemove: oldMajors.filter((oldMajor) => !newColleagueMajors.find((newMajor) => oldMajor.OCMajorId === newMajor.Code)),
        majorsToAdd: newColleagueMajors.filter((newMajor) => !oldMajors.find((oldMajor) => oldMajor.OCMajorId === newMajor.Code))
    }
    return majorDifferences;
}

function isSameDay(date1, date2) {
    const d1 = new Date(date1);
    const d2 = new Date(date2);

    return (
        d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate()
    );
}

function calculateSemestersFromGraduation(graduationDate) {
    const grad = new Date(graduationDate)
    const now = new Date();

    if (now > grad) return 0;

    const getSemester = (date) => date.getMonth() < 6 ? 0 : 1;

    const gradYear = grad.getFullYear();
    const gradSemester = getSemester(grad);
    const nowYear = now.getFullYear();
    const nowSemester = getSemester(now);

    const yearDiff = gradYear - nowYear;
    const semesterDiff = gradSemester - nowSemester;
    const totalSemesters = yearDiff * 2 + semesterDiff + 1;

    return totalSemesters;
}

export default exports;
