document.addEventListener("DOMContentLoaded", () => {
    const searchBar = document.querySelector(".search-bar");
    const jobCardsContainer = document.querySelector(".job-cards-container");

    // Search functionality
    searchBar.addEventListener("input", (e) => {
        const searchText = e.target.value.toLowerCase();
        const jobCards = jobCardsContainer.querySelectorAll(".job-card");

        jobCards.forEach((card) => {
            const jobTitle = card.querySelector("h3").textContent.toLowerCase();
            const jobCompany = card.querySelector(".tag-name").textContent.toLowerCase();
            const jobTags = Array.from(card.querySelectorAll(".job-tags span")).map((tag) =>
                tag.textContent.toLowerCase()
            );

            if (
                jobTitle.includes(searchText) ||
                jobCompany.includes(searchText) ||
                jobTags.some((tag) => tag.includes(searchText))
            ) {
                card.style.display = "flex";
            } else {
                card.style.display = "none";
            }
        });
    });

    // Prefill form with saved data if available
    loadFormData();

    // Add event listeners for existing edit and delete buttons
    addEventListenersToJobCards();
});

// Toggle between dark and light modes
function toggleMood() {
    const body = document.body;
    body.classList.toggle("dark-mode");

    const moodButton = document.querySelector(".mood-btn");
    moodButton.textContent = body.classList.contains("dark-mode") ? "☀️" : "🌙";
}

// DOM elements
const jobModal = document.getElementById("job-modal");
const jobForm = document.getElementById("job-form");
const modalTitle = document.getElementById("modal-title");
//const addJobBtn = document.querySelector(".add-job-container button");

// Track the current job being edited
let editingJob = null;

// Open modal for adding or editing a job
function openJobModal(jobCard = null) {
    editingJob = jobCard;
    if (jobCard) {
        // Pre-fill form for editing
        modalTitle.textContent = "Edit Job";
        document.getElementById("company-logo").value = jobCard.querySelector(".company-logo").style.backgroundImage.slice(5, -2);
        document.getElementById("company-name").value = jobCard.querySelector(".tag-name").textContent;
        document.getElementById("job-title").value = jobCard.querySelector("h3").textContent;
        document.getElementById("job-details").value = jobCard.querySelector("p").textContent;
        document.getElementById("job-tags").value = Array.from(jobCard.querySelectorAll(".job-tags span")).map((tag) => tag.textContent).join(", ");
        document.getElementById("job-type").value = jobCard.querySelector("p").textContent.includes("Freelance") ? "Freelance" : "Full-time";
    } else {
        modalTitle.textContent = "Add New Job";
        loadFormData();
    }

    jobModal.style.display = "block"; // Show modal
}

// Close the modal
function closeJobModal() {
    jobModal.style.display = "none";
    document.getElementById("job-form").reset(); // Reset form fields
    editingJob = null; // Clear the editingJob after closing
}

// Load saved data from localStorage for the "Add New Job" form
function loadFormData() {
    const savedData = JSON.parse(localStorage.getItem("jobFormData"));
    if (savedData) {
        document.getElementById("company-logo").value = savedData.companyLogo || "";
        document.getElementById("company-name").value = savedData.companyName || "";
        document.getElementById("job-title").value = savedData.jobTitle || "";
        document.getElementById("job-details").value = savedData.jobDetails || "";
        document.getElementById("job-tags").value = savedData.jobTags || "";
        document.getElementById("job-type").value = savedData.jobType || "";
    }
}

// Save form data to localStorage on every change (auto-save)
jobForm.addEventListener("input", () => {
    const formData = {
        companyLogo: document.getElementById("company-logo").value,
        companyName: document.getElementById("company-name").value,
        jobTitle: document.getElementById("job-title").value,
        jobDetails: document.getElementById("job-details").value,
        jobTags: document.getElementById("job-tags").value,
        jobType: document.getElementById("job-type").value,
    };
    localStorage.setItem("jobFormData", JSON.stringify(formData));
});

// Handle form submission
function submitJobForm(event) {
    event.preventDefault();

    const companyName = document.getElementById("company-name").value.trim();
    const jobTitle = document.getElementById("job-title").value.trim();
    const jobDetails = document.getElementById("job-details").value.trim();
    const jobTags = document.getElementById("job-tags").value.split(",").map((tag) => tag.trim());
    const companyLogo = document.getElementById("company-logo").value.trim();
    const jobType = document.getElementById("job-type").value.trim();

    if (!companyName || !jobTitle || !jobDetails || !companyLogo || !jobType) {
        alert("Please fill in all required fields!");
        return;
    }

    if (editingJob) {
        // Editing existing job card
        editingJob.querySelector(".company-logo").style.backgroundImage = `url('${companyLogo}')`;
        editingJob.querySelector(".tag-name").textContent = companyName;
        editingJob.querySelector("h3").textContent = jobTitle;
        editingJob.querySelector("p").textContent = jobDetails;
        const tagsContainer = editingJob.querySelector(".job-tags");
        tagsContainer.innerHTML = jobTags.map((tag) => `<span>${tag}</span>`).join("");
    } else {
        // Adding new job card
        const newJobCard = document.createElement("div");
        newJobCard.className = "job-card";
        newJobCard.tabIndex = 0;
        newJobCard.innerHTML = `
            <div class="company-logo" style="background-image: url('${companyLogo}');"></div>
            <div class="job-details">
                <span class="tag-name">${companyName}</span>
                <h3>${jobTitle}</h3>
                <p>${jobDetails}</p>
                <div class="job-tags">${jobTags.map((tag) => `<span>${tag}</span>`).join("")}</div>
            </div>
            <div class="job-actions">
                <button class="btn-edit" onclick="openJobModal(this.closest('.job-card'))"><i class="fas fa-edit"></i></button>
                <button class="btn-delete" onclick="deleteJobCard(this.closest('.job-card'))"><i class="fas fa-trash"></i></button>
            </div>
        `;
        const jobCardsContainer = document.querySelector(".job-cards-container");
        jobCardsContainer.insertBefore(newJobCard, jobCardsContainer.firstChild);
    }

    localStorage.removeItem("jobFormData"); // Clear saved form data
    closeJobModal(); // Close modal after saving
}

// Delete a job card
function deleteJobCard(jobCard) {
    jobCard.remove();
}

// Add event listeners for existing job cards
function addEventListenersToJobCards() {
    const jobCards = document.querySelectorAll(".job-card");
    if (jobCards) {
        jobCards.forEach(card => {
            const editButton = card.querySelector(".btn-edit");
            const deleteButton = card.querySelector(".btn-delete");

            if (editButton) {
                editButton.addEventListener("click", () => openJobModal(card));
            }
            if (deleteButton) {
                deleteButton.addEventListener("click", () => deleteJobCard(card));
            }
        });
    }
}

function getJobData(jobId) {
    // This is just an example. You should replace it with actual data retrieval logic.
    const jobs = [
        { id: '1', title: 'Software Engineer', company: 'Tech Corp', description: 'Develop software solutions.' },
        { id: '2', title: 'Product Manager', company: 'Biz Solutions', description: 'Manage product development.' }
    ];
    return jobs.find(job => job.id === jobId);
}


// Function to filter jobs based on the clicked tag
function filterJobsByTag(tagElement) {
    const tag = tagElement.innerText.toLowerCase(); // Get the clicked tag
    const jobCards = document.querySelectorAll('.job-card'); // Get all job cards

    jobCards.forEach(card => {
        // Get all the tags within the current job card
        const jobTags = card.querySelectorAll('.job-tags span');

        // Check if the job card contains the clicked tag
        let hasTag = false;
        jobTags.forEach(jobTag => {
            if (jobTag.innerText.toLowerCase() === tag) {
                hasTag = true; // If tag matches, show the job card
            }
        });

        // Toggle the visibility of the job card based on whether it has the clicked tag
        if (hasTag) {
            card.style.display = 'block';
            tagElement.classList.toggle('active');

        } else {
            card.style.display = 'none';
        }
    });
}




document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const jobId = params.get('id');
    const jobData = getJobData(jobId); // Retrieve job data based on ID
    
    if (jobData) {
        document.querySelector('.job-title').textContent = jobData.title;
        document.querySelector('.job-company').textContent = jobData.company;
        document.querySelector('.job-description').textContent = jobData.description;
    }
});


function navigateToDetail(url) {
    window.location.href = url;
}

function displayJobDetails() {
    const params = new URLSearchParams(window.location.search);
    const jobId = params.get('id');

    // Sample job data (replace with actual data or fetch from API)
    const jobData = {
        1: { title: 'Senior Frontend Developer', description: 'Details about job 1' },
        2: { title: 'Fullstack Developer', description: 'Details about job 2' },
        // Add more job data here
    };

    if (jobId && jobData[jobId]) {
        document.getElementById('job-title').textContent = jobData[jobId].title;
        document.getElementById('job-description').textContent = jobData[jobId].description;
    } else {
        document.getElementById('job-details-container').innerHTML = '<p>Job not found.</p>';
    }
}

if (window.location.pathname.includes('jobDetail.html')) {
    displayJobDetails();
}



