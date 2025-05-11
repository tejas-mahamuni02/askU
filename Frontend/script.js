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
          localStorage.setItem("msg", "true");
          location.href = "login.html"; // Redirect to login page
        } else {
          return response.json().then((error) => {
            throw new Error(error.message || "Failed to create account");
          });
        }
      })
      .catch((error) => {
        console.error("Error creating account:", error);
        alert("Failed to create account: " + error.message);
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
        return response.json();
      } else {
        throw new Error("Invalid login credentials");
      }
    })
    .then((user) => {
      localStorage.setItem("user", JSON.stringify(user));
      location.href = "myprofile.html";
    })
    .catch((error) => {
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
          localStorage.setItem("msg", "true");
          location.href = "userhome.html";
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

  const containsBlockedWord = blockedWords.some((word) =>
    textarea.value.toLowerCase().includes(word.toLowerCase())
  );

  submitButton.disabled = containsBlockedWord;


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
                      <br><br>
                       ${ans.user.uname == user.uname ? ` <i class="fa-solid fa-trash" style="color: #b50303;margin-left:2px;font-size:30px;" onclick="deleteAns(${que._id}, ${ans.answer_id})" id="delete-button-${ans.answer_id}"></i> ` : `<i class="fa-solid fa-thumbs-up" style="color: #008CFF; font-size:30px;" onclick="addLike(${que._id}, ${ans.answer_id})" id="like-button-${ans.answer_id}"></i>`}
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
      mytotque = questions.length
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
        <h2 class="card-title">${que.que} <i class="fa-solid fa-trash" style="color: #b50303;margin-left:50px;font-size:30px;float:right;" onclick="deleteQue(${que._id})" id="delete-button-${que._id}"></i><i class="fa-solid fa-pen-to-square" onclick="editQue(${que._id})" style="margin-left:10px;font-size:30px;float:right;" title="Edit Question"></i></h2>
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
      myquestions.innerHTML = `<h1 style="color:black;">There Is No Questions Found <br><br><a href="AskQue.html" style="color: #fff;text-decoration: none;font-size: 36px; border:1px solid black;padding:10px;border-radius:5px;">Ask Question</a></h1>
      `;
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
  event.preventDefault();

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
        return response.json();
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
  // displayAllMyQue()
  // displayAllQue()
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
  event.preventDefault();


  const emailInput = document.getElementById("profileEmailInput").value;
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    alert("User not found!");
    return;
  }

  const formData = new FormData();
  formData.append("email", emailInput);
  formData.append("password", user.pass);

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
  event.preventDefault();


  const newmobile = document.getElementById("profileMobileInput").value;
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    alert("User not found!");
    return;
  }

  const formData = new FormData();
  formData.append("email", user.email);
  formData.append("password", user.pass);
  formData.append("mobile", newmobile);

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
  event.preventDefault();


  const newpass = document.getElementById("pass").value;
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    alert("User not found!");
    return;
  }

  const formData = new FormData();
  formData.append("email", user.email);
  formData.append("pass", newpass);

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

function countmyinfo() {
  const user = JSON.parse(localStorage.getItem("user"));
  fetch(`${API_URL}/questions/getallMyQue/${user.email}`, {
    method: "GET",
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Failed to fetch questions.");
      }
    })
    .then((questions) => {
      document.getElementById("myquecount").innerHTML = questions.length;

      if (questions.length === 0) {
        console.log("No questions found.");
        return;
      }

      questions.forEach((question) => {
        console.log(question.que);
      });
    })
    .catch((error) => {
      console.error("Error fetching questions:", error);
      document.getElementById("myquecount").innerHTML = 0;
    });


  let myAnswersCounter = 0; // Count of user's answers
  let likes = 0; // Total likes on user's answers
  let totalPercentage = 0; // Sum of all percentage values
  let questionsWithLikes = 0; // Count questions with at least one like

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
        document.getElementById("myanscount").innerHTML = 0;
        document.getElementById("myalllikes").innerHTML = 0;
        document.getElementById("avglikes").innerHTML = "0%";
        return;
      }

      questions.forEach((que) => {
        let totalLikesForQue = 0;
        let userLikesForQue = 0;

        que.answers?.forEach((ans) => {
          totalLikesForQue += ans.likes;
          if (ans.user.uname === user.uname) {
            myAnswersCounter++;
            userLikesForQue += ans.likes;
          }
        });

        if (totalLikesForQue > 0) {
          const percentage = (userLikesForQue / totalLikesForQue) * 100;
          totalPercentage += percentage;
          questionsWithLikes++;
        }

        likes += userLikesForQue;
      });

      const avgPercentage = questionsWithLikes > 0 ? totalPercentage / questionsWithLikes : 0;

      document.getElementById("myanscount").innerHTML = myAnswersCounter;
      document.getElementById("myalllikes").innerHTML = likes;
      let bgColor = "";
      let emoji = "";

      if (avgPercentage >= 75) {
        bgColor = "#4CAF50"; // Green
        emoji = "🔥"; // Fire
      } else if (avgPercentage >= 50) {
        bgColor = "#FFC107"; // Yellow
        emoji = "😊"; // Smiley face
      } else if (avgPercentage >= 25) {
        bgColor = "#FF9800"; // Orange
        emoji = "😐"; // Neutral face
      } else {
        bgColor = "#F44336"; // Red
        emoji = "😞"; // Sad face
      }

      // Apply styles and set emoji
      const avgLikesElement = document.getElementById("avglikes");
      avgLikesElement.innerHTML = `${avgPercentage.toFixed(2)}% ${emoji}`;
      avgLikesElement.style.backgroundColor = bgColor;
      avgLikesElement.style.color = "white";
      avgLikesElement.style.padding = "20px";
      avgLikesElement.style.borderRadius = "10px";
      avgLikesElement.style.textAlign = "center";
    })
    .catch((error) => {
      console.error("Error fetching questions:", error);
      document.getElementById("myanscount").innerHTML = 0;
      document.getElementById("myalllikes").innerHTML = 0;
      document.getElementById("avglikes").innerHTML = "0%";
    });
}
countmyinfo()
