import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ClearYourDoubts = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(2); // Show 2 questions per page
  const [showAskQuestion, setShowAskQuestion] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [answeringQuestionId, setAnsweringQuestionId] = useState(null);
  const [newAnswer, setNewAnswer] = useState('');
  const [questionWordCount, setQuestionWordCount] = useState(0);
  const [answerWordCount, setAnswerWordCount] = useState(0);

  // Sample FAQ data - you can replace this with actual data from your API
  const faqData = [
    {
      id: 1,
      question: "What is Lorem Ipsum?",
      answer: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
      questioner: "Arnav",
      questionDate: "Nov, 2024",
      answerer: "Arya",
      answerDate: "Nov, 2024",
      helpfulYes: 21,
      helpfulNo: 21
    },
    {
      id: 2,
      question: "How do I book an appointment with a doctor?",
      answer: "You can book an appointment by searching for doctors on our platform, selecting your preferred doctor, and choosing an available time slot. You'll receive a confirmation email with all the details.",
      questioner: "Priya",
      questionDate: "Dec, 2024",
      answerer: "Dr. Smith",
      answerDate: "Dec, 2024",
      helpfulYes: 45,
      helpfulNo: 3
    },
    {
      id: 3,
      question: "What are the consultation fees?",
      answer: "Consultation fees vary depending on the doctor's specialty and experience. You can see the fees displayed on each doctor's profile before booking an appointment.",
      questioner: "Rahul",
      questionDate: "Dec, 2024",
      answerer: "Dr. Johnson",
      answerDate: "Dec, 2024",
      helpfulYes: 38,
      helpfulNo: 7
    },
    {
      id: 4,
      question: "How do I cancel my appointment?",
      answer: "You can cancel your appointment by going to your profile, selecting the appointment, and clicking the cancel button. Please note that cancellation policies may vary by doctor.",
      questioner: "Sneha",
      questionDate: "Dec, 2024",
      answerer: "Dr. Patel",
      answerDate: "Dec, 2024",
      helpfulYes: 42,
      helpfulNo: 5
    },
    {
      id: 5,
      question: "Are online consultations available?",
      answer: "Yes, many doctors offer online consultations through video calls. You can filter doctors by consultation type when searching to find those who offer online appointments.",
      questioner: "Vikram",
      questionDate: "Dec, 2024",
      answerer: "Dr. Kumar",
      answerDate: "Dec, 2024",
      helpfulYes: 55,
      helpfulNo: 2
    },
    {
      id: 6,
      question: "What if I need to reschedule my appointment?",
      answer: "You can reschedule your appointment by contacting the doctor directly or using the reschedule option in your appointment details. Most doctors allow rescheduling up to 24 hours before the appointment.",
      questioner: "Anita",
      questionDate: "Dec, 2024",
      answerer: "Dr. Sharma",
      answerDate: "Dec, 2024",
      helpfulYes: 33,
      helpfulNo: 8
    }
  ];

  // Filter questions based on search query
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredQuestions([]);
    } else {
      const filtered = faqData.filter(item =>
        item.question.toLowerCase().includes(query.toLowerCase()) ||
        item.answer.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredQuestions(filtered);
    }
  };

  // Display questions (filtered if search is active, otherwise show all)
  const allQuestions = searchQuery.trim() === '' ? faqData : filteredQuestions;
  
  // Pagination logic
  const totalPages = Math.ceil(allQuestions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayQuestions = allQuestions.slice(startIndex, endIndex);

  // Navigation functions
  const handlePrevious = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const handleViewAll = () => {
    navigate('/faq'); // Redirect to FAQ page
  };

  // Handle asking a new question
  const handleAskQuestion = () => {
    setShowAskQuestion(true);
  };

  const handleQuestionChange = (e) => {
    const text = e.target.value;
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    const wordCount = words.length;
    
    if (wordCount <= 200) {
      setNewQuestion(text);
      setQuestionWordCount(wordCount);
    }
  };

  const handleSubmitQuestion = () => {
    if (newQuestion.trim() && questionWordCount <= 200) {
      // Here you would typically send the question to your API
      console.log('New question:', newQuestion);
      alert('Question submitted successfully! We will review and post it soon.');
      setNewQuestion('');
      setQuestionWordCount(0);
      setShowAskQuestion(false);
    }
  };

  const handleCancelQuestion = () => {
    setNewQuestion('');
    setQuestionWordCount(0);
    setShowAskQuestion(false);
  };

  // Handle adding an answer to a specific question
  const handleAddAnswer = (questionId) => {
    setAnsweringQuestionId(questionId);
    setNewAnswer('');
    setAnswerWordCount(0);
  };

  const handleAnswerChange = (e) => {
    const text = e.target.value;
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    const wordCount = words.length;
    
    if (wordCount <= 200) {
      setNewAnswer(text);
      setAnswerWordCount(wordCount);
    }
  };

  const handleSubmitAnswer = () => {
    if (newAnswer.trim() && answerWordCount <= 200) {
      // Here you would typically send the answer to your API
      console.log('New answer for question', answeringQuestionId, ':', newAnswer);
      alert('Answer submitted successfully! We will review and post it soon.');
      setNewAnswer('');
      setAnswerWordCount(0);
      setAnsweringQuestionId(null);
    }
  };

  const handleCancelAnswer = () => {
    setNewAnswer('');
    setAnswerWordCount(0);
    setAnsweringQuestionId(null);
  };

  return (
    <div className="bg-white py-8 sm:py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Title */}
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-4">
            Clear your Doubts
          </h2>
        </div>

        {/* Search Input */}
        <div className="mb-6 sm:mb-8">
          <div className="relative max-w-md mx-auto px-2">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Have any Question"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              autoFocus={false}
            />
          </div>
        </div>

        {/* Questions and Answers */}
        <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8">
          {displayQuestions.length === 0 && searchQuery.trim() !== '' ? (
            <div className="text-center py-6 sm:py-8">
              <p className="text-gray-500 text-sm sm:text-base">No questions found matching your search.</p>
            </div>
          ) : (
            displayQuestions.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                {/* Question */}
                <div className="mb-3 sm:mb-4">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2 leading-tight">
                    Q{item.id}. {item.question}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500">
                    {item.questioner} • {item.questionDate}
                  </p>
                </div>

                {/* Answer */}
                <div className="mb-4 sm:mb-6">
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-2">
                    {item.answer}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500">
                    By {item.answerer} • {item.answerDate}
                  </p>
                </div>

                {/* Action and Feedback Section */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
                  <button 
                    onClick={() => handleAddAnswer(item.id)}
                    className="bg-gray-900 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm sm:text-base w-full sm:w-auto"
                  >
                    Add Answer
                  </button>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                    <span className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">Was it Helpful</span>
                    <div className="flex space-x-2 justify-center sm:justify-start">
                      <button className="flex items-center space-x-1 bg-gray-100 text-gray-700 px-2 sm:px-3 py-1 rounded-lg hover:bg-gray-200 transition-colors">
                        <svg className="h-3 w-3 sm:h-4 sm:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                        </svg>
                        <span className="text-xs">Yes ({item.helpfulYes})</span>
                      </button>
                      <button className="flex items-center space-x-1 bg-gray-100 text-gray-700 px-2 sm:px-3 py-1 rounded-lg hover:bg-gray-200 transition-colors">
                        <svg className="h-3 w-3 sm:h-4 sm:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.737 3h4.018c.163 0 .326.02.485.06L17 4m-7 10v-2M7 4H5a2 2 0 00-2 2v6a2 2 0 002 2h2.5" />
                        </svg>
                        <span className="text-xs">No ({item.helpfulNo})</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Answer Input Form - appears when answering a specific question */}
                {answeringQuestionId === item.id && (
                  <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h4 className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">Add your answer:</h4>
                    <textarea
                      value={newAnswer}
                      onChange={handleAnswerChange}
                      placeholder="Write your answer here..."
                      className="w-full p-2 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                      rows={3}
                      autoFocus={false}
                    />
                    <div className="flex justify-between items-center mt-2">
                      <div className="text-xs text-gray-500">
                        {answerWordCount}/200 words
                      </div>
                      {answerWordCount >= 200 && (
                        <div className="text-xs text-red-500">
                          Word limit reached
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 mt-3">
                      <button
                        onClick={handleCancelAnswer}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors text-sm sm:text-base order-2 sm:order-1"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSubmitAnswer}
                        disabled={!newAnswer.trim() || answerWordCount > 200}
                        className={`px-4 sm:px-6 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base order-1 sm:order-2 ${
                          newAnswer.trim() && answerWordCount <= 200
                            ? 'bg-purple-600 text-white hover:bg-purple-700'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        Submit Answer
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Navigation Controls */}
        {searchQuery.trim() === '' && allQuestions.length > itemsPerPage && (
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8 space-y-3 sm:space-y-0">
            {/* Previous Button */}
            <button
              onClick={handlePrevious}
              disabled={currentPage === 1}
              className={`p-2 transition-colors ${
                currentPage === 1
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Page Info and View All Button */}
            <div className="flex flex-col items-center space-y-2 sm:space-y-0">
              <div className="text-xs sm:text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </div>
              <button
                onClick={handleViewAll}
                className="text-purple-600 hover:text-purple-700 transition-colors text-xs sm:text-sm underline"
              >
                View All
              </button>
            </div>

            {/* Next Button */}
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className={`p-2 transition-colors ${
                currentPage === totalPages
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}

        {/* View All Button */}
        {searchQuery.trim() !== '' && (
          <div className="text-center mb-6 sm:mb-8">
            <button
              onClick={handleViewAll}
              className="bg-purple-600 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium text-sm sm:text-base"
            >
              View All Questions
            </button>
          </div>
        )}

        {/* Ask Questions Section */}
        <div className="text-center">
          {!showAskQuestion ? (
            <button 
              onClick={handleAskQuestion}
              className="bg-gray-900 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium text-sm sm:text-base"
            >
              Ask Questions
            </button>
          ) : (
            <div className="max-w-2xl mx-auto px-2">
              <div className="bg-gray-50 rounded-lg p-4 sm:p-6 border border-gray-200">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Ask a New Question</h3>
                <textarea
                  value={newQuestion}
                  onChange={handleQuestionChange}
                  placeholder="What would you like to know? Ask your question here..."
                  className="w-full p-3 sm:p-4 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none mb-2"
                  rows={3}
                  autoFocus={false}
                />
                <div className="flex justify-between items-center mb-4">
                  <div className="text-xs text-gray-500">
                    {questionWordCount}/200 words
                  </div>
                  {questionWordCount >= 200 && (
                    <div className="text-xs text-red-500">
                      Word limit reached
                    </div>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4">
                  <button
                    onClick={handleCancelQuestion}
                    className="px-4 sm:px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors font-medium text-sm sm:text-base order-2 sm:order-1"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitQuestion}
                    disabled={!newQuestion.trim() || questionWordCount > 200}
                    className={`px-6 sm:px-8 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base order-1 sm:order-2 ${
                      newQuestion.trim() && questionWordCount <= 200
                        ? 'bg-purple-600 text-white hover:bg-purple-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Submit Question
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClearYourDoubts;
