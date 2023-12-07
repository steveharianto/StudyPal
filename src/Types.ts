import { Timestamp } from "@firebase/firestore";

export type Classes = {
    schedule: [];
    student: string;
    tutor: string;
};
export type Rating = {
    student: string;
    tutor: string;
    value: number;
};
export type User = {
    username: string;
    password: string;
    fullname: string;
    email: string;
    role: string; // student | tutor
    phoneNumber: string;
    balance: number;
    dob: Timestamp;
};
