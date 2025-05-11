// Backend API URL
const API_URL = "http://127.0.0.1:8000/askU";


// Sign Up Form Submission Handler
const signUpForm = document.getElementById("add-user-form");
if (signUpForm) {
  signUpForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const uname = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const mobile = document.getElementById("mobile").value;
    const pass = document.getElementById("pass").value;

    fetch(`${API_URL}/users/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ uname, email, mobile, pass }),
    })
      .then((response) => {
        if (response.ok) {
          console.log("Account created successfully");
          localStorage.setItem("msg", "true"); // Store a success flag in localStorage
          location.href = "login.html"; // Redirect to login page
        } else {
          return response.json().then((error) => {
            throw new Error(error.message || "Failed to create account");
          });
        }
      })
      .catch((error) => {
        console.error("Error creating account:", error);
        alert("Failed to create account: " + error.message); // Inform the user
      });
  });
}

// Login Form Submission Handler
const loginForm = document.getElementById("login-form");
if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const pass = document.getElementById("pass").value;
    console.log(email, pass)

    fetch(`${API_URL}/users/${email}/${pass}`, {
      method: "GET",
    })
      .then((response) => {
        if (response.ok) {
          return response.json(); // Parse JSON if the response is OK
        } else {
          throw new Error("Invalid login credentials");
        }
      })
      .then((user) => {
        localStorage.setItem("user", JSON.stringify(user));
        location.href = "userhome.html";
      })
      .catch((error) => {
        // Handle errors (e.g., display an error message on the page)
        console.error("Login failed:", error);
        document.getElementById("login-error").innerText = "Incorrect Username or Password 😒😑";
      });
  });
}
// update user to local storage whenerver update then call these function
function updatedUser(email, pass) {
  fetch(`${API_URL}/users/${email}/${pass}`, {
    method: "GET",
  })
    .then((response) => {
      if (response.ok) {
        return response.json(); // Parse JSON if the response is OK
      } else {
        throw new Error("Invalid login credentials");
      }
    })
    .then((user) => {
      localStorage.setItem("user", JSON.stringify(user));
      location.href = "myprofile.html";
    })
    .catch((error) => {
      // Handle errors (e.g., display an error message on the page)
      console.error("Login failed:", error);
      document.getElementById("login-error").innerText = "Incorrect Username or Password 😒😑";
    });
}

// Sign Up Form Submission Handler
const askedQue = document.getElementById("ask-form");
if (askedQue) {
  askedQue.addEventListener("submit", function (e) {
    e.preventDefault();
    const que = document.getElementById("que").value;
    const user = JSON.parse(localStorage.getItem("user"))
    fetch(`${API_URL}/questions/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ que, user }),
    })
      .then((response) => {
        if (response.ok) {
          console.log("Account created successfully");
          localStorage.setItem("msg", "true"); // Store a success flag in localStorage
          location.href = "userhome.html"; // Redirect to login page
        } else {
          return response.json().then((error) => {
            throw new Error(error.message || "Failed to create account");
          });
        }
      })
      .catch((error) => {
        console.error("Error creating account:", error);
        alert("Failed to create account: " + error.message); // Inform the user
      });
  });
}

// Password Visibility Toggle
const togglePasswordCheckbox = document.getElementById("show-password");
if (togglePasswordCheckbox) {
  togglePasswordCheckbox.addEventListener("change", function () {
    const passField = document.getElementById("pass");
    const confirmPassField = document.getElementById("confirm_pass");

    const isChecked = togglePasswordCheckbox.checked;
    if (passField) passField.type = isChecked ? "text" : "password";
    if (confirmPassField) confirmPassField.type = isChecked ? "text" : "password";
  });
}

//Clear User
function clearuser() {
  localStorage.clear()
  location.reload()

}

// Go To Login
function gotoLogin() {
  const user = localStorage.getItem("user")
  if (!user) {
    location.href = "login.html"
  }

}
//Checkin Question
function checkQue() {
  const textarea = document.getElementById("que");
  const submitButton = document.getElementById("submit-btn");

  // List of words to block
  const blockedWords = ["suicide", "prohibited", "sucide"];

  // Check if the textarea contains any blocked word
  const containsBlockedWord = blockedWords.some((word) =>
    textarea.value.toLowerCase().includes(word.toLowerCase())
  );

  // Enable or disable the submit button based on the check
  submitButton.disabled = containsBlockedWord;

  // alert("Please Do Not Use inappropriate word")

  if (containsBlockedWord) {
    alert("Please Do Not Use inappropriate word")
    textarea.style.borderColor = "red"; // Highlight the textarea
  } else {
    textarea.style.borderColor = ""; // Reset the highlight
  }
}



let allquestions = document.querySelector(".Questions");

function displayAllQue() {
  const user = JSON.parse(localStorage.getItem("user"))
  fetch(`${API_URL}/questions/getall/${user.email}`, {
    method: "GET",
  })
    .then((response) => {
      if (response.ok) {
        return response.json(); // Parse JSON if the response is OK
      } else {
        throw new Error("Failed to fetch questions.");
      }
    })
    .then((questions) => {
      if (questions.length === 0) {
        allquestions.innerHTML = "<p>No questions found.</p>";
        return;
      }
      questions.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      allquestions.innerHTML = questions
        .map((que) => {
          console.log(que._id)
          return `
        <div class="card mt-4">
          <h2 class="card-title">${que.que}</h2>
          <h3 class="card-title">Questioned By ${que.user.uname}<p style="text-align: end;">Date: ${new Date(que.created_at).toLocaleDateString()}</p></h3>
          <p class="fs-5" style="font-size:20px;">
            <i class="fa-solid fa-reply" style="color: #008CFF; font-size:20px;"></i> Replies
          </p>
          <div class="answers">
            ${que["answers"]
              ?.map(
                (ans) => `
                  <div style="border: 2px solid black; border-radius: 5px;" class="outerdiv">
                    <div style="flex-grow: 15">
                      ${ans.ans}
                      <br><br>
                      Answer By: ${ans.user.uname == user.uname ? "ME" : ans.user.uname}
                       ${ans.user.image
                    ? `<img src="data:image/png;base64,${ans.user.image}" alt="User Image" style="width: 35px; height: 35px; border-radius: 50%;" onerror="this.src='default-profile.png';" />`
                    : ""
                  }
                    </div>
                    <div style="flex-grow: 10"> 
                      Date: ${new Date(ans.created_at).toLocaleString('en-US', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true // Ensures 12-hour format with AM/PM
                  })}

                    </div>
                    <div style="flex-grow: 1">
                      Likes: <span id="likes-${ans.answer_id}">${ans.likes}</span>
                      <br><br><i class="fa-solid fa-thumbs-up" style="color: #008CFF; font-size:30px;" onclick="addLike(${que._id}, ${ans.answer_id})" id="like-button-${ans.answer_id}"></i> ${ans.user.uname == user.uname ? ` <i class="fa-solid fa-trash" style="color: #b50303;margin-left:2px;font-size:30px;" onclick="deleteAns(${que._id}, ${ans.answer_id})" id="delete-button-${ans.answer_id}"></i> ` : ""}
                    </div >
                  </div >
                `
              )
              .join("") || `<p> No answers yet.Be the first to answer!</p> `}
            
                <form id="answer-form-${que._id}" method="POST" onsubmit="submitAnswer(event, ${que._id})">
                  <div style="border: 2px solid black; border-radius: 5px;" class="outerdiv">
                    <h3 style="flex-grow: 1">Add Your Answer 👉</h3>
                    <div style="flex-grow: 12">
                      <!-- Hidden field for Question ID -->
                      <input type="hidden" id="que-id-${que._id}" value="${que._id}">
                      <textarea name="ans" rows="8" onkeyup="checkAns(${que._id})" id="ans-${que._id}" ></textarea>
                    </div>
                    <div style="flex-grow: 5">
                      <button type="submit" id="submit-btn-${que._id}">Submit</button>
                    </div>
                  </div>
                </form>

          </div>
        </div>
      `;
        })
        .join("");

    })
    .catch((error) => {
      console.error("Error fetching questions:", error);
      allquestions.innerHTML = `<p>Error loading questions. Please try again later.</p>`;
    });
}

displayAllQue()

let myquestions = document.querySelector(".MyQuestions");

function displayAllMyQue() {
  const user = JSON.parse(localStorage.getItem("user"))
  fetch(`${API_URL}/questions/getallMyQue/${user.email}`, {
    method: "GET",
  })
    .then((response) => {
      if (response.ok) {
        return response.json(); // Parse JSON if the response is OK
      } else {
        throw new Error("Failed to fetch questions.");
      }
    })
    .then((questions) => {
      if (questions.length === 0) {
        myquestions.innerHTML = "<p>No questions found.</p>";
        return;
      }
      questions.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      myquestions.innerHTML = questions
        .map((que) => {
          console.log(que._id)
          return `
      <div class="card mt-4">
        <h2 class="card-title">${que.que} <i class="fa-solid fa-trash" style="color: #b50303;margin-left:2px;font-size:30px;" onclick="deleteQue(${que._id})" id="delete-button-${que._id}"></i></h2>
        <h3 class="card-title">Questioned By ${que.user.uname}${que.user.image
              ? `<img src="data:image/png;base64,${que.user.image}" alt="User Image" style="width: 35px; height: 35px; border-radius: 50%;margin-left:10px;margin-top:10px;" onerror="this.src='default-profile.png';" />`
              : ""
            }<p style="text-align: end;">Date: ${new Date(que.created_at).toLocaleDateString()}</p></h3>
        <p class="fs-5" style="font-size:20px;">
          <i class="fa-solid fa-reply" style="color: #008CFF; font-size:20px;"></i> Replies
        </p>
        <div class="answers">
          ${que["answers"]
              ?.map(
                (ans) => `
                <div style="border: 2px solid black; border-radius: 5px;" class="outerdiv">
                  <div style="flex-grow: 15">
                    ${ans.ans}
                    <br><br>
                    
                    Answer By: ${ans.user.uname == user.uname ? "ME" : ans.user.uname}
                    ${ans.user.image
                    ? `<img src="data:image/png;base64,${ans.user.image}" alt="User Image" style="width: 35px; height: 35px; border-radius: 50%;" onerror="this.src='default-profile.png';" />`
                    : ""
                  }
                  </div>
                  <div style="flex-grow: 10"> 
                    Date: ${new Date(ans.created_at).toLocaleString('en-US', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true // Ensures 12-hour format with AM/PM
                  })}

                  </div>
                  <div style="flex-grow: 1">
                    Likes: <span id="likes-${ans.answer_id}">${ans.likes}</span>
                    <br><br><i class="fa-solid fa-thumbs-up" style="color: #008CFF; font-size:30px;" onclick="addLike(${que._id}, ${ans.answer_id})" id="like-button-${ans.answer_id}"></i>
                  </div>
                </div>
              `
              )
              .join("") || `<p>No answers yet. Be the first to answer!</p>`}
          
              <form id="answer-form-${que._id}" method="POST" onsubmit="submitAnswer(event, ${que._id})">
                <div style="border: 2px solid black; border-radius: 5px;" class="outerdiv">
                  <h3 style="flex-grow: 1">Add Your Answer 👉</h3>
                  <div style="flex-grow: 12">
                    <!-- Hidden field for Question ID -->
                    <input type="hidden" id="que-id-${que._id}" value="${que._id}">
                    <textarea name="ans" rows="8" onkeyup="checkAns(${que._id})" id="ans-${que._id}" ></textarea>
                  </div>
                  <div style="flex-grow: 5">
                    <button type="submit" id="submit-btn-${que._id}">Submit</button>
                  </div>
                </div>
              </form>

        </div>
      </div>
    `;
        })
        .join("");

    })
    .catch((error) => {
      console.error("Error fetching questions:", error);
      myquestions.innerHTML = `<h1 style="color:black;">There Is No Questions Found </h1>`;
    });
}
function deleteQue(questionId) {
  if (confirm("Are you sure you want to delete this Question?")) {
    fetch(`${API_URL}/questions/${questionId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {

          return response.json(); // Parse response if the deletion was successful
        } else {
          return response.json().then((error) => {
            throw new Error(error.error || "Failed to delete the Question.");
          });
        }
      })
    alert("Queston Deleted Successfully")
    location.reload()
  }
}
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
// Call the function to display questions when the page loads
displayAllMyQue();

//Checkin Question
function checkAns(questionId) {

  // const queid = document.getElementById(`que-id-${questionId}`).value;
  // const ans = document.getElementById(`ans-${questionId}`).value;
  const textarea = document.getElementById(`ans-${questionId}`);
  const submitButton = document.getElementById(`submit-btn-${questionId}`);

  // List of words to block
  const blockedWords = ["suicide", "prohibited", "sucide"];

  // Check if the textarea contains any blocked word
  const containsBlockedWord = blockedWords.some((word) =>
    textarea.value.toLowerCase().includes(word.toLowerCase())
  );

  // Enable or disable the submit button based on the check
  submitButton.disabled = containsBlockedWord;

  // alert("Please Do Not Use inappropriate word")

  if (containsBlockedWord) {
    alert("Please Do Not Use inappropriate word")
    textarea.style.borderColor = "red"; // Highlight the textarea
  } else {
    textarea.style.borderColor = ""; // Reset the highlight
  }
}



function addLike(questionId, answerId) {
  console.log(questionId)
  console.log(answerId)

  // Use the correct URL path here for updating likes
  fetch(`${API_URL}/questions/like/${questionId}/${answerId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Failed to update likes.");
      }
    })
    .then((data) => {
      const likeElement = document.querySelector(`#likes-${answerId}`);
      const likeButton = document.querySelector(`#like-button-${answerId}`);  // Assuming each like button has a unique ID
      if (likeButton) {
        likeButton.style.pointerEvents = 'none';  // Disable clicks by making the button unclickable
        likeButton.style.opacity = 0.5;  // Optionally, you can dim the button to indicate it's disabled
      }
      if (likeElement) {
        likeElement.innerText = ` ${data.likes}`;
        likeElement.disabled = true
      }
      // location.reload()
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("An error occurred while updating likes. Please try again.");
    });
}

function deleteAns(questionId, answerId) {
  if (confirm("Are you sure you want to delete this answer?")) {
    fetch(`${API_URL}/questions/delete/${questionId}/${answerId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json(); // Parse response if the deletion was successful
        } else {
          return response.json().then((error) => {
            throw new Error(error.error || "Failed to delete the answer.");
          });
        }
      })
      .then((data) => {
        // alert(data.message || "Answer deleted successfully.");

        // Optionally remove the answer from the DOM
        const answerDiv = document.querySelector(`#answer-${answerId}`);
        if (answerDiv) answerDiv.remove();
        location.reload()
      })
      .catch((error) => {
        console.error("Error deleting answer:", error);
        alert("An error occurred while deleting the answer. Please try again.");
      });
  }
}




function submitAnswer(event, questionId) {
  event.preventDefault(); // Prevent the form from being submitted the traditional way

  // Get the question ID and answer content
  const queid = document.getElementById(`que-id-${questionId}`).value;
  const ans = document.getElementById(`ans-${questionId}`).value;

  // Check if the answer is empty
  if (!ans.trim()) {
    alert("Please enter an answer before submitting.");
    return;
  }

  // Get the current user data from localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  // Prepare the answer object
  const answerData = {
    ans: ans,
    user: user // Include the user details
  };

  // Post the answer data to the API
  fetch(`${API_URL}/answers/give/${queid}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(answerData),
  })
    .then((response) => {
      if (response.ok) {
        return response.json(); // Parse the response to get the newly created answer
      } else {
        return response.json().then((error) => {
          throw new Error(error.message || "Failed to submit the answer");
        });
      }
    })
    .then((newAnswer) => {

      location.reload()
    })
    .catch((error) => {
      console.error("Error submitting answer:", error);
      alert("Failed to submit answer: " + error.message);
    });
}

document.addEventListener("DOMContentLoaded", function () {
  // Fetch user data from localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  if (user && user.image) {
    // Show the image
    const imgElement = document.getElementById("my_img");
    const imgElements = document.getElementsByClassName("my_img1");

    if (imgElement) {
      imgElement.src = `data:image/png;base64,${user.image}`;
      imgElement.style.display = "block";
    }

    for (const img of imgElements) {
      img.src = `data:image/png;base64,${user.image}`;
      img.style.display = "inline";
    }

    // Hide the image upload form
    const uploadSection = document.getElementById("imageUploadSection");
    if (uploadSection) {
      uploadSection.style.display = "none";
    }

    // Hide the userprofile elements
    const userProfileElements = document.getElementsByClassName("userprofile");
    for (const element of userProfileElements) {
      element.style.display = "none";
    }
  } else {
    // Show the form if no image is found
    const uploadSection = document.getElementById("imageUploadSection");
    if (uploadSection) {
      uploadSection.style.display = "block";
    }

    // Hide the image elements
    const imgElements = document.getElementsByClassName("my_img1");
    for (const img of imgElements) {
      img.style.display = "none";
    }
  }
});

function visibleDPForm() {
  const DPForm = document.getElementById("imageUploadSection");
  const my_img = document.getElementById("my_img");
  const my_img1 = document.getElementById("my_img");
  if (DPForm.style.display === "none") {
    DPForm.style.display = "block";
    my_img.style.display = "none";
    my_img1.style.display = "none";
  } else {
    DPForm.style.display = "none";
    my_img.style.display = "block";
    my_img.style.display = "block";
  }
}
function updateImage(event) {
  event.preventDefault(); // Prevent form refresh

  // Get the image file from the input
  const imageFile = document.getElementById("profileImageInput").files[0];
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    alert("User not found!");
    return;
  }

  const formData = new FormData();
  formData.append("email", user.email);
  formData.append("password", user.pass);

  // Append the image file if provided
  if (imageFile) {
    formData.append("image", imageFile);
  }

  // Make the PUT request to update the user profile
  fetch(`${API_URL}/users/${user.email}/${user.pass}`, {
    method: "PUT",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      // localStorage.setItem("user", JSON.stringify(data));
      console.log("User profile updated:", data);
      alert("Profile image uploaded successfully!");
      // displayAllQue();
      updatedUser(user.email, user.pass)


    })
    .catch((error) => {
      console.error("Error updating user profile:", error);
    });

}


function visibleEmailForm() {
  const emailForm = document.getElementById("emailUploadSection");
  const emailHeader = document.getElementById("emailField");
  if (emailForm.style.display === "none") {
    emailForm.style.display = "block";
    emailHeader.style.display = "none";
  } else {
    emailForm.style.display = "none";
    emailHeader.style.display = "block";
  }
}



function updateEmail(event) {
  event.preventDefault(); // Prevent form refresh

  // Get the new email value from the input field
  const emailInput = document.getElementById("profileEmailInput").value;
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    alert("User not found!");
    return;
  }

  const formData = new FormData();
  formData.append("email", emailInput); // Append the updated email
  formData.append("password", user.pass); // Append the password

  // Make the PUT request to update the user profile
  fetch(`${API_URL}/users/${user.email}/${user.pass}`, {
    method: "PUT",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("User profile updated:", data);
      alert("Email updated successfully!");

      updatedUser(emailInput, user.pass);
    })
    .catch((error) => {
      console.error("Error updating user profile:", error);
    });
}


function visibleMobileForm() {
  const mobileForm = document.getElementById("mobileUploadSection");
  const mobile = document.getElementById("mobileField");
  if (mobileForm.style.display === "none") {
    mobileForm.style.display = "block";
    mobile.style.display = "none";
  } else {
    mobileForm.style.display = "none";
    mobile.style.display = "block";
  }
}

function updateMobile(event) {
  event.preventDefault(); // Prevent form refresh

  // Get the new email value from the input field
  const newmobile = document.getElementById("profileMobileInput").value;
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    alert("User not found!");
    return;
  }

  const formData = new FormData();
  formData.append("email", user.email); // Append the updated email
  formData.append("password", user.pass); // Append the password
  formData.append("mobile", newmobile); // Append the password

  // Make the PUT request to update the user profile
  fetch(`${API_URL}/users/${user.email}/${user.pass}`, {
    method: "PUT",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("User Mobile Number updated:", data);
      alert("Mobile Number updated successfully!");
      updatedUser(user.email, user.pass);
    })
    .catch((error) => {
      console.error("Error updating user profile:", error);
    });
}

function visiblePasswordForm() {
  const passwordForm = document.getElementById("passUploadSection");

  if (passwordForm.style.display === "none") {
    passwordForm.style.display = "block";

  } else {
    passwordForm.style.display = "none";

  }
}

function updatePass(event) {
  event.preventDefault(); // Prevent form refresh

  // Get the new email value from the input field
  const newpass = document.getElementById("pass").value;
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    alert("User not found!");
    return;
  }

  const formData = new FormData();
  formData.append("email", user.email); // Append the  email
  formData.append("pass", newpass);

  // Make the PUT request to update the user profile
  fetch(`${API_URL}/users/${user.email}/${user.pass}`, {
    method: "PUT",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("User password updated:", data);
      alert("Password updated successfully!");
      clearuser()
    })
    .catch((error) => {
      console.error("Error updating user profile:", error);
    });
}



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