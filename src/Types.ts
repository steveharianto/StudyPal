import { Timestamp } from "@firebase/firestore";

export type Classes = {
    schedule: Timestamp[];
    student: string;
    tutor: string;
};
export type MyClass = {
    schedule: Timestamp[];
    student: string;
    tutor: string;
    nextSession: string;
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

export type Tutor = {
    username: string;
    password: string;
    fullname: string;
    email: string;
    role: string; // student | tutor
    phoneNumber: string;
    balance: number;
    dob: Timestamp;
    description: string;
    imageUrl: string;
    price: number;
    schedule: string[];
};
