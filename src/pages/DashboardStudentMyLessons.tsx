import React, { useState, useEffect } from 'react';

// Updated mock data
const mockUpcomingLessons = [
    { id: 1, title: 'Mathematics 101', date: '2023-11-25', day: 'Saturday', tutorName: 'John Doe', tutorImage: '/path/to/math-tutor.jpg' },
    { id: 2, title: 'History of Art', date: '2023-11-26', day: 'Sunday', tutorName: 'Jane Smith', tutorImage: '/path/to/art-tutor.jpg' },
    { id: 2, title: 'History of Art', date: '2023-11-26', day: 'Sunday', tutorName: 'Jane Smith', tutorImage: '/path/to/art-tutor.jpg' },
    { id: 2, title: 'History of Art', date: '2023-11-26', day: 'Sunday', tutorName: 'Jane Smith', tutorImage: '/path/to/art-tutor.jpg' },
    // ... other lessons
];

const mockLessonHistory = [
    { id: 1, title: 'Biology Basics', date: '2023-11-20', day: 'Monday', tutorName: 'Alice Johnson', tutorImage: '/path/to/biology-tutor.jpg' },
    { id: 2, title: 'Introduction to Physics', date: '2023-11-19', day: 'Sunday', tutorName: 'Bob Brown', tutorImage: '/path/to/physics-tutor.jpg' },
    { id: 2, title: 'Introduction to Physics', date: '2023-11-19', day: 'Sunday', tutorName: 'Bob Brown', tutorImage: '/path/to/physics-tutor.jpg' },
    { id: 2, title: 'Introduction to Physics', date: '2023-11-19', day: 'Sunday', tutorName: 'Bob Brown', tutorImage: '/path/to/physics-tutor.jpg' },
    { id: 2, title: 'Introduction to Physics', date: '2023-11-19', day: 'Sunday', tutorName: 'Bob Brown', tutorImage: '/path/to/physics-tutor.jpg' },
    // ... other lessons
];

const DashboardStudentMyLessons = () => {
    const [upcomingLessons, setUpcomingLessons] = useState([]);
    const [lessonHistory, setLessonHistory] = useState([]);

    useEffect(() => {
        setUpcomingLessons(mockUpcomingLessons);
        setLessonHistory(mockLessonHistory);
    }, []);

    return (
        <div className="container mx-auto p-4 h-4/5 flex flex-col space-y-6 h-[80vh]">
            <div className="h-[60vh]">
                <h2 className="text-2xl font-bold text-blue-600 mb-6">Upcoming Lessons</h2>
                <div className='h-[50vh] overflow-auto'>
                    {upcomingLessons.map(lesson => (
                        <div key={lesson.id} className="mb-4 bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg rounded-lg p-4 flex items-center space-x-4">
                            <img src={lesson.tutorImage} alt="Tutor" className="h-16 w-16 rounded-full" />
                            <div>
                                <span className="font-semibold text-white text-lg">{lesson.title}</span>
                                <span className="block text-gray-200">{`${lesson.day}, ${lesson.date}`}</span>
                                <span className="block text-gray-200">{`Tutor: ${lesson.tutorName}`}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="h-[60vh]">
                <h2 className="text-2xl font-bold text-green-600 mb-6">Lesson History</h2>
                <div className='h-[50vh] overflow-auto mb-10'>
                    {lessonHistory.map(lesson => (
                        <div key={lesson.id} className="mb-4 bg-gradient-to-r from-indigo-500 to-blue-500 shadow-lg rounded-lg p-4 flex items-center space-x-4">
                            <img src={lesson.tutorImage} alt="Tutor" className="h-16 w-16 rounded-full" />
                            <div>
                                <span className="font-semibold text-white text-lg">{lesson.title}</span>
                                <span className="block text-gray-200">{`${lesson.day}, ${lesson.date}`}</span>
                                <span className="block text-gray-200">{`Tutor: ${lesson.tutorName}`}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default DashboardStudentMyLessons;
