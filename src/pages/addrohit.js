import { useState } from 'react';
import { firebase } from '../Firebase/config';

const AddQuestionsForm = () => {
  const [branchname, setBranchName] = useState('');
  const [chaptername, setChapterName] = useState('');
  const [semestername, setSemesterName] = useState('');
  const [subjectname, setSubjectName] = useState('');
  const [yearname, setYearName] = useState('');
  const [questions, setQuestions] = useState([{ question: '', answer: '' }]);
  const [pdfFile1, setPdfFile1] = useState(null);
  const [pdfFile2, setPdfFile2] = useState(null);

  const handleQuestionChange = (event, index) => {
    const { name, value } = event.target;
    const newQuestions = [...questions];
    newQuestions[index][name] = value;
    setQuestions(newQuestions);
  };

  const handleAddQuestion = () => {
    setQuestions([...questions, { question: '', answer: '' }]);
  };

  const handleRemoveQuestion = (index) => {
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    setQuestions(newQuestions);
  };

  const handleFileChange1 = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile1(file);
    } else {
      setPdfFile1(null);
      alert('Please select a PDF file.');
    }
  };

  const handleFileChange2 = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile2(file);
    } else {
      setPdfFile2(null);
      alert('Please select a PDF file.');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    // Add questions to Firestore
    const db = firebase.firestore();
    const newQuestionsRef = db.collection('Engineering').doc();
    await newQuestionsRef.set({
      questions,
      branchname,
      yearname,
      semestername,
      subjectname,
      chaptername
    });
  
    // Upload PDF to Firebase Storage
    const storage = firebase.storage();
    const pdfFileRef1 = storage.ref().child(newQuestionsRef.id).child('questions1.pdf');
    const pdfSnapshot1 = await pdfFileRef1.put(pdfFile1);
    const pdfUrl1 = await pdfSnapshot1.ref.getDownloadURL();

    const pdfFileRef2 = storage.ref().child(newQuestionsRef.id).child('questions2.pdf');
    const pdfSnapshot2 = await pdfFileRef2.put(pdfFile2);
    const pdfUrl2 = await pdfSnapshot2.ref.getDownloadURL();
    
    await newQuestionsRef.update({
      pdf1: pdfUrl1,
      pdf2: pdfUrl2
    });
  
    alert('Questions added successfully');
    setBranchName('');
    setChapterName('');
    setSemesterName('');
    setSubjectName('');
    setYearName('');
    setQuestions([{ question: '', answer: '' }]);
  };

  return (
    <div className="container mx-auto">
      <form onSubmit={handleSubmit}>
        
        <label>
          Branch:
          <select value={branchname} onChange={(event) => setBranchName(event.target.value)} className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
            <option value="">Select Branch</option>
            <option value="Computer Science Engineering">Computer Science</option>
            <option value="Electrical Engineering">Electrical Engineering</option>
            <option value="Electronics Commmunication Engineering">Electronics Commmunication Engineering</option>
            <option value="Mechanical Engineering">Mechanical Engineering</option>
            <option value="Civil Engineering">Civil Engineering</option>
          </select>
        </label>
        <label>
          Year:
          <select value={yearname} onChange={(event) => setYearName(event.target.value)} className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
            <option value="">Select Year</option>
            <option value="1st Year">1st Year</option>
            <option value="2nd Year">2nd Year</option>
            <option value="3rd Year">3rd Year</option>
            <option value="4th Year">4th Year</option>
          </select>
        </label>
        <label>
          Semester:
          <select value={semestername} onChange={(event) => setSemesterName(event.target.value)} className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
            <option value="">Select Semester</option>
            <option value="1st Semester">1st Semester</option>
            <option value="2nd Semester">2nd Semester</option>
            <option value="3rd Semester">3rd Semester</option>
            <option value="4th Semester">4th Semester</option>
            <option value="5th Semester">5th Semester</option>
            <option value="6th Semester">6th Semester</option>
            <option value="7th Semester">7th Semester</option>
            <option value="8th Semester">8th Semester</option>
          </select>
        </label>
        <label>
          Subject Name:
          <input
            type="text"
            name="subject"
            value={subjectname}
            onChange={(event) => setSubjectName(event.target.value)}
            className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
          />
        </label>
        <label>
          Unit Name:
          <input
            type="text"
            name="subject"
            value={chaptername}
            onChange={(event) => setChapterName(event.target.value)}
            className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
          />
        </label>
        <label>
HandBook:
  <input type="file" name="pdf" accept=".pdf" onChange={handleFileChange1} />
</label>
<label>
  PYQ:
  <input type="file" name="pdf" accept=".pdf" onChange={handleFileChange2} />
</label>

        
        {questions.map((q, index) => (
          <div key={index} className="my-4">
            <label>
              Question:
              <input
                type="text"
                name="question"
                value={q.question}
                onChange={(event) => handleQuestionChange(event, index)}
                className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
              />
            </label>
            <label>
              Answer:
              <textarea
        className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
        rows="10"
                type="text"
                name="answer"
                value={q.answer}
                onChange={(event) => handleQuestionChange(event, index)}
            
              />
            </label>
            {index !== 0 && (
              <button type="button" onClick={() => handleRemoveQuestion(index)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-2">
                Remove Question
              </button>
            )}
          </div>
        ))}
        <button type="button" onClick={handleAddQuestion} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2">
          Add Question
        </button>
        <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-2">
          Submit
        </button>
      </form>
      </div>
    
    );
};

export default AddQuestionsForm;