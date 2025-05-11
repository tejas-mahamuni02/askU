

// Form Submission Handler for Each Question
// const answerForms = document.querySelectorAll('[id^="answer-form-"]'); // Select all forms by prefix id

// answerForms.forEach((form) => {
//   form.addEventListener("submit", function (e) {
//     e.preventDefault();

//     // Get the question ID and answer content
//     const queid = form.querySelector('input[type="hidden"]').value;
//     const ans = form.querySelector('textarea').value;

//     // Check if the answer is empty
//     if (!ans.trim()) {
//       alert("Please enter an answer before submitting.");
//       return;
//     }

//     // Get the current user data from localStorage
//     const user = JSON.parse(localStorage.getItem("user"));

//     // Prepare the answer object
//     const answerData = {
//       ans: ans,
//       user: user // Include the user details
//     };

//     // Post the answer data to the API
//     fetch(`${API_URL}/answers/give/${queid}`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(answerData),
//     })
//       .then((response) => {
//         if (response.ok) {
//           return response.json(); // Parse the response to get the newly created answer
//         } else {
//           return response.json().then((error) => {
//             throw new Error(error.message || "Failed to submit the answer");
//           });
//         }
//       })
//       .then((newAnswer) => {
//         // Find the answers container for the current question
//         const answersContainer = form.closest('.answers');

//         // Create a new div element for the newly added answer
//         const newAnswerElement = document.createElement('div');
//         newAnswerElement.innerHTML = `
//           <div style="border: 2px solid black; border-radius: 5px;" class="outerdiv">
//             <div>${newAnswer.ans}</div>
//             <div>Answer By: ${newAnswer.user ? newAnswer.user.name : "Anonymous"}</div>
//             <div>Date: ${new Date(newAnswer.created_at).toLocaleDateString()}</div>
//           </div>
//         `;

//         // Append the new answer to the answers section
//         answersContainer.appendChild(newAnswerElement);

//         // Optionally, show success message or feedback
//         const successMessage = document.createElement('div');
//         successMessage.classList.add('success-message');
//         successMessage.textContent = "Answer submitted successfully!";
//         document.body.appendChild(successMessage);
//         setTimeout(() => successMessage.remove(), 3000); // Remove message after 3 seconds
//       })
//       .catch((error) => {
//         console.error("Error submitting answer:", error);
//         const errorMessage = document.createElement('div');
//         errorMessage.classList.add('error-message');
//         errorMessage.textContent = "Failed to submit answer: " + error.message;
//         form.appendChild(errorMessage); // Append error message under the form
//         setTimeout(() => errorMessage.remove(), 5000); // Remove error message after 5 seconds
//       });
//   });
// });


// function addLike(questionId, answerId) {
//   // Make a POST request to your backend API to update the likes count
//   fetch(`${API_URL}/answers/like/${questionId}/${answerId}`, {
//     method: "POST", // Change method to POST
//     headers: {
//       "Content-Type": "application/json",
//     },
//   })
//     .then((response) => {
//       if (response.ok) {
//         return response.json(); // Return the updated data
//       } else {
//         throw new Error("Failed to update likes.");
//       }
//     })
//     .then((data) => {
//       // Update the likes count in the DOM dynamically
//       const likeElement = document.querySelector(`#likes-${answerId}`);
//       if (likeElement) {
//         likeElement.innerText = `Likes: ${data.likes}`;
//       }
//     })
//     .catch((error) => {
//       console.error("Error:", error);
//     });
// }



// // Backend API URL
// const API_URL = "http://127.0.0.1:8000/askU";

// // function registerUser() {
// //   fetch(`${API_URL}/users/`)

// // }

// // Add a New USer
// document.getElementById("add-user-form").addEventListener("submit", function (e) {
//   e.preventDefault();

//   const uname = document.getElementById("username").value;
//   const email = document.getElementById("email").value;
//   const mobile = document.getElementById("mobile").value;
//   const pass = document.getElementById("pass").value;


//   fetch(`${API_URL}/users/`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ uname, email, mobile, pass }),
//   })
//     .then(response => {
//       if (response.ok) {
//         console.log("Data Inserted Successfully")
//         localStorage.setItem("msg", true)
//         location.href = "login.html";
//       } else {
//         console.error("Failed to add User");
//       }
//     })
//     .catch(error => console.error("Error adding drink:", error));
// });

// document.getElementById("login-form").addEventListener("submit", function (e) {
//   e.preventDefault()
//   const email = document.getElementById("email").value;
//   const pass = document.getElementById("pass").value;
//   console.log(email)
//   console.log(pass)


//   fetch(`${API_URL}/users/${email}/${pass}/`, {
//     method: "GET",
//   })
//     .then((response) => {
//       if (response.ok) {
//         return response.json(); // Parse JSON if the response is OK
//       } else {
//         throw new Error("Invalid login credentials");
//       }
//     })
//     .then((user) => {

//       localStorage.setItem("user", JSON.stringify(user));
//       location.href = "userhome.html";
//     })
//     .catch((error) => {
//       // Handle errors (e.g., display an error message on the page)
//       console.error("Login failed:", error);
//       document.getElementById("login-error").innerText = "Login failed. Please try again!";
//     });


// });

// document.addEventListener("DOMContentLoaded", function () {
//   // Simulate fetching user data from local storage or an API
//   const user = JSON.parse(localStorage.getItem("user"));

//   // Check if the image attribute is present in the user JSON object
//   if (user && user.image) {
//     // Show the image if present
//     const imgElement = document.getElementById("my_img");
//     const imgElement1 = document.getElementsByClassName("my_img1");
//     imgElement.src = `data:image/png;base64,${user.image}`;
//     imgElement1.src = `data:image/png;base64,${user.image}`;
//     imgElement.style.display = "block";
//     imgElement1.style.display = "inline";

//     // Hide the image upload form
//     document.getElementById("imageUploadSection").style.display = "none";
//     document.getElementsByClassName("userprofile").style.display = "none";
//   } else {
//     // Show the form if no image is found
//     document.getElementById("imageUploadSection").style.display = "block";
//     document.getElementsByClassName("my_img1").style.display = "none";
//   }
// });

// function displayAllQue() {
//   const user = JSON.parse(localStorage.getItem("user"))
//   fetch(`${API_URL}/questions/getall/${user.email}`, {
//     method: "GET",
//   })
//     .then((response) => {
//       if (response.ok) {
//         return response.json(); // Parse JSON if the response is OK
//       } else {
//         throw new Error("Failed to fetch questions.");
//       }
//     })
//     .then((questions) => {
//       if (questions.length === 0) {
//         allquestions.innerHTML = "<p>No questions found.</p>";
//         return;
//       }
//       questions.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
//       allquestions.innerHTML = questions
//         .map((que) => {
//           console.log(que._id)
//           return `
//         <div class="card mt-4">
//           <h2 class="card-title">${que.que}</h2>
//           <h3 class="card-title">Questioned By ${que.user.uname}<p style="text-align: end;">Date: ${new Date(que.created_at).toLocaleDateString()}</p></h3>
//           <p class="fs-5" style="font-size:20px;">
//             <i class="fa-solid fa-reply" style="color: #008CFF; font-size:20px;"></i> Replies
//           </p>
//           <div class="answers">
//             ${que["answers"]
//               ?.map(
//                 (ans) => `
//                   <div style="border: 2px solid black; border-radius: 5px;" class="outerdiv">
//                     <div style="flex-grow: 15">
//                       ${ans.ans}
//                       <br><br>
//                       Answer By: ${ans.user.uname == user.uname ? "ME" : ans.user.uname}
//                        ${ans.user.image
//                     ? `<img src="data:image/png;base64,${ans.user.image}" alt="User Image" style="width: 35px; height: 35px; border-radius: 50%;" onerror="this.src='default-profile.png';" />`
//                     : ""
//                   }
//                     </div>
//                     <div style="flex-grow: 10">
//                       Date: ${new Date(ans.created_at).toLocaleString('en-US', {
//                     year: 'numeric',
//                     month: '2-digit',
//                     day: '2-digit',
//                     hour: '2-digit',
//                     minute: '2-digit',
//                     hour12: true // Ensures 12-hour format with AM/PM
//                   })}

//                     </div>
//                     <div style="flex-grow: 1">
//                       Likes: <span id="likes-${ans.answer_id}">${ans.likes}</span>
//                       <br><br><i class="fa-solid fa-thumbs-up" style="color: #008CFF; font-size:30px;" onclick="addLike(${que._id}, ${ans.answer_id})" id="like-button-${ans.answer_id}"></i>
//                        ${ans.user.uname == user.uname ? ` <i class="fa-solid fa-trash" style="color: #b50303;margin-left:2px;font-size:30px;" onclick="deleteAns(${que._id}, ${ans.answer_id})" id="delete-button-${ans.answer_id}"></i> ` : ""}
//                     </div >
//                   </div >
//                 `
//               )
//               .join("") || `<p> No answers yet.Be the first to answer!</p> `}

//                 <form id="answer-form-${que._id}" method="POST" onsubmit="submitAnswer(event, ${que._id})">
//                   <div style="border: 2px solid black; border-radius: 5px;" class="outerdiv">
//                     <h3 style="flex-grow: 1">Add Your Answer 👉</h3>
//                     <div style="flex-grow: 12">
//                       <!-- Hidden field for Question ID -->
//                       <input type="hidden" id="que-id-${que._id}" value="${que._id}">
//                       <textarea name="ans" rows="8" onkeyup="checkAns(${que._id})" id="ans-${que._id}" ></textarea>
//                     </div>
//                     <div style="flex-grow: 5">
//                       <button type="submit" id="submit-btn-${que._id}">Submit</button>
//                     </div>
//                   </div>
//                 </form>

//           </div>
//         </div>
//       `;
//         })
//         .join("");

//     })
//     .catch((error) => {
//       console.error("Error fetching questions:", error);
//       allquestions.innerHTML = `<p>Error loading questions. Please try again later.</p>`;
//     });
// }

// function displayAllMyQue() {
//   const user = JSON.parse(localStorage.getItem("user"))
//   fetch(`${API_URL}/questions/getallMyQue/${user.email}`, {
//     method: "GET",
//   })
//     .then((response) => {
//       if (response.ok) {
//         return response.json(); // Parse JSON if the response is OK
//       } else {
//         throw new Error("Failed to fetch questions.");
//       }
//     })
//     .then((questions) => {
//       if (questions.length === 0) {
//         myquestions.innerHTML = "<p>No questions found.</p>";
//         return;
//       }
//       questions.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
//       myquestions.innerHTML = questions
//         .map((que) => {
//           console.log(que._id)
//           return `
//       <div class="card mt-4">
//         <h2 class="card-title">${que.que}</h2>
//         <h3 class="card-title">Questioned By ${que.user.uname}${que.user.image
//               ? `<img src="data:image/png;base64,${que.user.image}" alt="User Image" style="width: 35px; height: 35px; border-radius: 50%;margin-left:10px;margin-top:10px;" onerror="this.src='default-profile.png';" />`
//               : ""
//             }<p style="text-align: end;">Date: ${new Date(que.created_at).toLocaleDateString()}</p></h3>
//         <p class="fs-5" style="font-size:20px;">
//           <i class="fa-solid fa-reply" style="color: #008CFF; font-size:20px;"></i> Replies
//         </p>
//         <div class="answers">
//           ${que["answers"]
//               ?.map(
//                 (ans) => `
//                 <div style="border: 2px solid black; border-radius: 5px;" class="outerdiv">
//                   <div style="flex-grow: 15">
//                     ${ans.ans}
//                     <br><br>

//                     Answer By: ${ans.user.uname == user.uname ? "ME" : ans.user.uname}
//                     ${ans.user.image
//                     ? `<img src="data:image/png;base64,${ans.user.image}" alt="User Image" style="width: 35px; height: 35px; border-radius: 50%;" onerror="this.src='default-profile.png';" />`
//                     : ""
//                   }
//                   </div>
//                   <div style="flex-grow: 10">
//                     Date: ${new Date(ans.created_at).toLocaleString('en-US', {
//                     year: 'numeric',
//                     month: '2-digit',
//                     day: '2-digit',
//                     hour: '2-digit',
//                     minute: '2-digit',
//                     hour12: true // Ensures 12-hour format with AM/PM
//                   })}

//                   </div>
//                   <div style="flex-grow: 1">
//                     Likes: <span id="likes-${ans.answer_id}">${ans.likes}</span>
//                     <br><br><i class="fa-solid fa-thumbs-up" style="color: #008CFF; font-size:30px;" onclick="addLike(${que._id}, ${ans.answer_id})" id="like-button-${ans.answer_id}"></i>
//                   </div>
//                 </div>
//               `
//               )
//               .join("") || `<p>No answers yet. Be the first to answer!</p>`}

//               <form id="answer-form-${que._id}" method="POST" onsubmit="submitAnswer(event, ${que._id})">
//                 <div style="border: 2px solid black; border-radius: 5px;" class="outerdiv">
//                   <h3 style="flex-grow: 1">Add Your Answer 👉</h3>
//                   <div style="flex-grow: 12">
//                     <!-- Hidden field for Question ID -->
//                     <input type="hidden" id="que-id-${que._id}" value="${que._id}">
//                     <textarea name="ans" rows="8" onkeyup="checkAns(${que._id})" id="ans-${que._id}" ></textarea>
//                   </div>
//                   <div style="flex-grow: 5">
//                     <button type="submit" id="submit-btn-${que._id}">Submit</button>
//                   </div>
//                 </div>
//               </form>

//         </div>
//       </div>
//     `;
//         })
//         .join("");

//     })
//     .catch((error) => {
//       console.error("Error fetching questions:", error);
//       myquestions.innerHTML = `<h1 style="color:black;">There Is No Questions Found </h1>`;
//     });
// }

// function editQue(questionId) {
//   // Fetch the question data by ID to prefill the form
//   fetch(`${API_URL}/questions/${questionId}`, {
//     method: "GET",
//   })
//     .then((response) => response.json())
//     .then((question) => {
//       // Create a popup/modal to edit the question
//       const editFormHTML = `
//         <div id="edit-modal" class="modal">
//           <div class="modal-content">
//             <h2>Edit Your Question</h2>
//             <textarea id="edit-question-text" rows="5">${question.que}</textarea>
//             <button onclick="saveEditedQuestion(${questionId})">Save Changes</button>
//             <button onclick="closeModal()">Cancel</button>
//           </div>
//         </div>
//       `;
//       document.body.insertAdjacentHTML("beforeend", editFormHTML);
//       document.getElementById("edit-modal").style.display = "block";
//     })
//     .catch((error) => {
//       console.error("Error fetching question for editing:", error);
//       alert("Failed to load the question for editing.");
//     });
// }

// function saveEditedQuestion(questionId) {
//   const updatedQuestion = document.getElementById("edit-question-text").value;

//   // Send the updated question data to the backend
//   fetch(`${API_URL}/questions/${questionId}`, {
//     method: "PUT",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ que: updatedQuestion }),
//   })
//     .then((response) => response.json())
//     .then(() => {
//       alert("Question updated successfully!");
//       location.reload(); // Reload the page to show updated question
//     })
//     .catch((error) => {
//       console.error("Error updating question:", error);
//       alert("Failed to update the question.");
//     });
// }

// function closeModal() {
//   document.getElementById("edit-modal").remove();
// }
