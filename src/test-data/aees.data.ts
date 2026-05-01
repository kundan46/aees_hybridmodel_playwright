/**
 * AEES Test Data
 * This file contains static and dynamic data for AEES application forms.
 */

export interface AeesPersonalData {
    title: string;
    firstName: string;
    lastName: string;
    nameChange: string;
    dob: string;
    gender: string;
    maritalStatus: string;
    category: string;
    pwd: string;
    exServiceman: string;
    fatherTitle: string;
    fatherFirstName: string;
    fatherLastName: string;
    fatherOccupation: string;
    motherTitle: string;
    motherFirstName: string;
    motherLastName: string;
    motherOccupation: string;
    address: string;
    state: string;
    district: string;
    city: string;
    pin: string;
}

export interface AeesEducationData {
    educationqualification3: string;
    educationqualification2: string;
    educationqualification1: string;
    degree: string;
    board: string;
    subject: string;
    percentage: string;
    year10th: string;
    year12th: string;
    yeardegree: string;
    yearpostgraduation: string;
    yearother: string;
}

export interface AeesUploadsData {
    photoPath: string;
    signaturePath: string;
    casteCertificate: string;
    casteCertNumber: string;
    casteIssueDate: string;
}


export const AEES_TEST_DATA = {
    validUser: {
        email: 'bug92@gmail.com',
        password: 'Abcd@1234'
    },
    defaultPersonalDetails: {
        title: 'MR',
        firstName: 'Automation',
        lastName: 'User',
        nameChange: 'NO',
        dob: '01-01-2000',
        gender: 'MALE',
        maritalStatus: 'UNMARRIED',
        category: 'SCHEDULED CASTE (SC)',
        pwd: 'NOT APPLICABLE',
        exServiceman: 'NO',
        fatherTitle: 'MR',
        fatherFirstName: 'Test',
        fatherLastName: 'Father',
        fatherOccupation: 'Engineer',
        motherTitle: 'MRS',
        motherFirstName: 'Test',
        motherLastName: 'Mother',
        motherOccupation: 'Engineer',
        address: '123 Framework Street',
        state: 'BIHAR',
        district: 'PATNA',
        city: 'Automation City',
        pin: '800001'
    } as AeesPersonalData,

    defaultEducationDetails: {
        degree: "Bachelor's Degree in Library Science from a recognized University with at least 50% marks.",
        educationqualification1: '10th Standard',
        educationqualification2: '12th Standard',
        educationqualification3: "Bachelor's Degree in Library Science from a recognized University with at least 50% marks.",
        board: 'Central Board',
        subject: 'Computer Science',
        percentage: '90',
        year10th: '01/01/2019',
        year12th: '01/01/2021',
        yeardegree: '01/01/2023',
        yearpostgraduation: '01/01/2025',
        yearother: '01/01/2027',
    } as AeesEducationData,
    defaultUploads: {
        photoPath: 'test-photo.jpg',
        signaturePath: 'test-signature.jpg',
        casteCertificate: 'test-caste-certificate.pdf',
        casteCertNumber: '123456789012',
        casteIssueDate: '01-01-2025',
    } as AeesUploadsData,


    // Helper to generate unique registration data
    generateRegistrationData: () => {
        const ts = Date.now();
        return {
            email: `user_${ts}@testmail.com`,
            email2: `bug94@gmail.com`,
            password: 'Abcd@1234',
            mobile: `98${ts.toString().slice(-8)}`
        };
    }
};
